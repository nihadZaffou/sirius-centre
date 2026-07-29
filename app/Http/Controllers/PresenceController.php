<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use App\Models\Prof;
use App\Models\Presence;
use App\Models\Etudiant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PresenceController extends Controller
{
    public function index($idGroupe)
    {
        $user  = auth()->user();
        $prof  = Prof::where('idUser', $user->idUser)->firstOrFail();
        $groupe = Groupe::where('idGroupe', $idGroupe)
            ->where('idProf', $prof->idProf)
            ->with(['niveau.langue', 'etudiantsActifs.user'])
            ->firstOrFail();

        $dateAujourdhui = Carbon::now()->toDateString();

        // Charger les présences d'aujourd'hui si déjà marquées
        $presencesExistantes = Presence::where('idGroupe', $idGroupe)
            ->where('dateSeance', $dateAujourdhui)
            ->get()
            ->keyBy('idEtudiant');

        $etudiants = $groupe->etudiantsActifs->map(fn($e) => [
            'id'        => $e->idEtudiant,
            'nom'       => $e->user->nom,
            'prenom'    => $e->user->prenom,
            'presence'  => $presencesExistantes->has($e->idEtudiant)
                ? $presencesExistantes[$e->idEtudiant]->estPresent
                : null,
            'idPresence'=> $presencesExistantes[$e->idEtudiant]?->idPresence ?? null,
        ]);

        // Historique des 5 dernières séances
        $historique = Presence::where('idGroupe', $idGroupe)
            ->select('dateSeance')
            ->distinct()
            ->orderByDesc('dateSeance')
            ->limit(5)
            ->pluck('dateSeance');

        return Inertia::render('Prof/Presences', [
            'groupe' => [
                'id'     => $groupe->idGroupe,
                'nom'    => $groupe->nomGroupe,
                'langue' => $groupe->niveau?->langue?->nomLangue,
                'niveau' => $groupe->niveau?->nomNiveau,
            ],
            'etudiants'  => $etudiants,
            'date'       => $dateAujourdhui,
            'historique' => $historique,
            'dejaMarque' => $presencesExistantes->isNotEmpty(),
        ]);
    }

    public function marquer(Request $request, $idGroupe)
    {
        $request->validate([
            'date'      => 'required|date',
            'presences' => 'required|array',
            'presences.*.idEtudiant' => 'required|exists:etudiants,idEtudiant',
            'presences.*.present'    => 'required|boolean',
        ]);

        $user = auth()->user();
        $prof = Prof::where('idUser', $user->idUser)->firstOrFail();

        // Vérifier que ce groupe appartient au prof
        $groupe = Groupe::where('idGroupe', $idGroupe)
            ->where('idProf', $prof->idProf)
            ->firstOrFail();

        foreach ($request->presences as $p) {
           Presence::updateOrCreate(
    [
        'idEtudiant' => $p['idEtudiant'],
        'idGroupe'   => $idGroupe,
        'dateSeance' => $request->date,
    ],
    [
        'estPresent'  => $p['present'],
        'estJustifie' => false,
        'idProf'      => $prof->idProf,
    ]
);
        }

        \App\Models\Log::enregistrer(
            'marquer_presences',
            "Présences marquées pour le groupe #{$idGroupe} le {$request->date}"
        );

        return back()->with('success', 'Présences enregistrées.');
    }

    // Directeur justifie une absence
    public function justifier(Request $request, $idPresence)
    {
        $request->validate([
            'motif' => 'required|string|max:255',
        ]);

        $presence = Presence::findOrFail($idPresence);
        $presence->update([
            'estJustifie'  => true,
            'motifJustif'  => $request->motif,
        ]);

        \App\Models\Log::enregistrer(
            'justifier_absence',
            "Absence #{$idPresence} justifiée : {$request->motif}"
        );

        return back()->with('success', 'Absence justifiée.');
    }
}