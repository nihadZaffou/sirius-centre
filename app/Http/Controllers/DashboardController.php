<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use App\Models\Groupe;
use App\Models\Prof;
use App\Models\Paiement;
use App\Models\Alerte;
use App\Models\Emploi;
use App\Models\Attestation;
use App\Models\Traduction;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user         = auth()->user();
        $directeur    = $user->directeur;
        $isSecondaire = $directeur?->typeAcces === 'secondaire';

        if ($isSecondaire) {
            // Dashboard simplifié pour directeur secondaire
            $stats = [
                'attestations' => Attestation::count(),
                'traductions'  => Traduction::where('statut', 'demande')->count(),
            ];

            return Inertia::render('Directeur/Dashboard', [
                'stats'        => $stats,
                'alertes'      => [],
                'seances'      => [],
                'isSecondaire' => true,
            ]);
        }

        // Dashboard complet pour directeur principal
        $stats = [
            'etudiants' => Etudiant::actifs()->count(),
            'groupes'   => Groupe::actifs()->count(),
            'profs'     => Prof::whereHas('user', fn($q) => $q->where('actif', 1))->count(),
            'impayes'   => Paiement::where('statut', 'en_cours')->count(),
        ];

        $alertes = Alerte::where('statut', 'active')
            ->with(['etudiant.user', 'groupe'])
            ->latest('dateCreation')
            ->take(5)
            ->get()
            ->map(fn($a) => [
                'id'       => $a->idAlerte,
                'type'     => $a->type,
                'message'  => $a->message,
                'date'     => $a->dateCreation,
                'etudiant' => $a->etudiant?->user?->prenom . ' ' . $a->etudiant?->user?->nom,
                'groupe'   => $a->groupe?->nomGroupe,
            ]);

        $aujourdhui = ucfirst(Carbon::now()->locale('fr')->isoFormat('dddd'));

        $seances = Emploi::where('jour', $aujourdhui)
            ->with(['groupe.niveau.langue', 'groupe.prof.user'])
            ->get()
            ->map(fn($e) => [
                'id'     => $e->idEmploi,
                'groupe' => $e->groupe?->nomGroupe,
                'langue' => $e->groupe?->niveau?->langue?->nomLangue,
                'niveau' => $e->groupe?->niveau?->nomNiveau,
                'prof'   => $e->groupe?->prof?->user?->prenom . ' ' . $e->groupe?->prof?->user?->nom,
                'debut'  => $e->heureDebut,
                'fin'    => $e->heureFin,
                'salle'  => $e->salle,
            ]);

        return Inertia::render('Directeur/Dashboard', [
            'stats'        => $stats,
            'alertes'      => $alertes,
            'seances'      => $seances,
            'isSecondaire' => false,
        ]);
    }
}