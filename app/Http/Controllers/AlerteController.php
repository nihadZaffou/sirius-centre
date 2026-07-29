<?php

namespace App\Http\Controllers;

use App\Models\Alerte;
use App\Models\Etudiant;
use App\Models\Groupe;
use App\Models\Emploi;
use App\Models\Presence;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AlerteController extends Controller
{
    public function index()
    {
        $alertes = Alerte::with(['etudiant.user', 'etudiant.user', 'groupe.niveau.langue'])
            ->where('statut', 'active')
            ->orderByDesc('dateCreation')
            ->get()
            ->map(fn($a) => [
                'id'       => $a->idAlerte,
                'type'     => $a->type,
                'message'  => $a->message,
                'date'     => $a->dateCreation,
                'statut'   => $a->statut,
                'etudiant' => [
                    'id'        => $a->etudiant->idEtudiant,
                    'nom'       => $a->etudiant->user->nom,
                    'prenom'    => $a->etudiant->user->prenom,
                    'telephone' => $a->etudiant->user->telephone,
                    'email'     => $a->etudiant->user->email,
                    'telParent' => $a->etudiant->telParent,
                    'nomParent' => $a->etudiant->nomParent,
                ],
                'groupe' => $a->groupe ? [
                    'id'     => $a->groupe->idGroupe,
                    'nom'    => $a->groupe->nomGroupe,
                    'langue' => $a->groupe->niveau?->langue?->nomLangue,
                    'niveau' => $a->groupe->niveau?->nomNiveau,
                ] : null,
            ]);

        return Inertia::render('Directeur/Alertes/Index', [
            'alertes' => $alertes,
            'total'   => $alertes->count(),
        ]);
    }

    public function resoudre($id)
    {
        Alerte::findOrFail($id)->update(['statut' => 'resolue']);
        return back()->with('success', 'Alerte résolue.');
    }

    // Générer alertes pour les séances dans les 3 prochaines heures
    public static function genererAlertes()
    {
        $maintenant  = Carbon::now();
        $dans3heures = Carbon::now()->addHours(3);

        $jourFr = [
            'Monday'    => 'Lundi',
            'Tuesday'   => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday'  => 'Jeudi',
            'Friday'    => 'Vendredi',
            'Saturday'  => 'Samedi',
            'Sunday'    => 'Dimanche',
        ];
        $jourAujourdhui = $jourFr[$maintenant->format('l')];

        // Trouver les emplois du temps qui ont séance dans 3h
        $emplois = Emploi::where('jour', $jourAujourdhui)
            ->whereRaw("STR_TO_DATE(heureDebut, '%H:%i:%s') BETWEEN ? AND ?", [
                $maintenant->format('H:i:s'),
                $dans3heures->format('H:i:s'),
            ])
            ->with(['groupe.etudiantsActifs.user'])
            ->get();

        foreach ($emplois as $emploi) {
            $groupe = $emploi->groupe;
            if (!$groupe) continue;

            foreach ($groupe->etudiantsActifs as $etudiant) {

                // Alerte absences
                $absences = Presence::where('idEtudiant', $etudiant->idEtudiant)
                    ->where('idGroupe', $groupe->idGroupe)
                    ->where('estPresent', 0)
                    ->where('estJustifie', 0)
                    ->count();

                if ($absences >= 3) {
                    $dejaExiste = Alerte::where('idEtudiant', $etudiant->idEtudiant)
                        ->where('idGroupe', $groupe->idGroupe)
                        ->where('type', 'absence')
                        ->where('statut', 'active')
                        ->exists();

                    if (!$dejaExiste) {
                        Alerte::create([
                            'type'         => 'absence',
                            'message'      => "{$absences} absences non justifiées",
                            'statut'       => 'active',
                            'idEtudiant'   => $etudiant->idEtudiant,
                            'idGroupe'     => $groupe->idGroupe,
                            'dateCreation' => now(),
                        ]);
                    }
                }

                // Alerte paiement
                $paiement = Paiement::with('avances')
                    ->where('idEtudiant', $etudiant->idEtudiant)
                    ->where('idGroupe', $groupe->idGroupe)
                    ->where('statut', 'en_cours')
                    ->first();

                if ($paiement) {
                    $montantPaye = $paiement->avances->sum('montant');
                    $reste       = $paiement->montantTotal - $montantPaye;

                    if ($reste > 0) {
                        $dejaExiste = Alerte::where('idEtudiant', $etudiant->idEtudiant)
                            ->where('idGroupe', $groupe->idGroupe)
                            ->where('type', 'paiement')
                            ->where('statut', 'active')
                            ->exists();

                        if (!$dejaExiste) {
                            Alerte::create([
                                'type'         => 'paiement',
                                'message'      => "Reste {$reste} DH impayé",
                                'statut'       => 'active',
                                'idEtudiant'   => $etudiant->idEtudiant,
                                'idGroupe'     => $groupe->idGroupe,
                                'dateCreation' => now(),
                            ]);
                        }
                    }
                }
            }
        }
    }
}