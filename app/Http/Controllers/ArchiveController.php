<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use App\Models\Etudiant;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ArchiveController extends Controller
{
    // Page archives
    public function index(Request $request)
    {
        $annee  = $request->get('annee', '');
        $search = $request->get('search', '');

        // Groupes terminés
        $groupes = Groupe::where('statut', 'termine')
            ->with(['niveau.langue', 'prof.user'])
            ->when($annee, fn($q) => $q->whereYear('dateFin', substr($annee, 0, 4)))
            ->get()
            ->map(fn($g) => [
                'id'       => $g->idGroupe,
                'nom'      => $g->nomGroupe,
                'langue'   => $g->niveau?->langue?->nomLangue,
                'niveau'   => $g->niveau?->nomNiveau,
                'prof'     => $g->prof?->user?->prenom . ' ' . $g->prof?->user?->nom,
                'dateDebut'=> $g->dateDebut,
                'dateFin'  => $g->dateFin,
                'inscrits' => $g->etudiants()->count(),
            ]);

        // Étudiants archivés (inactifs ou sans groupe actif)
        $etudiants = Etudiant::with(['user', 'groupes.niveau.langue'])
            ->where('actif', 0)
            ->when($search, fn($q) => $q->whereHas('user', fn($u) =>
                $u->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
            ))
            ->get()
            ->map(fn($e) => [
                'id'      => $e->idEtudiant,
                'nom'     => $e->user->nom,
                'prenom'  => $e->user->prenom,
                'email'   => $e->user->email,
                'telephone'=> $e->user->telephone,
                'groupes' => $e->groupes->map(fn($g) => [
                    'nom'    => $g->nomGroupe,
                    'langue' => $g->niveau?->langue?->nomLangue,
                    'niveau' => $g->niveau?->nomNiveau,
                    'statut' => $g->statut,
                ]),
            ]);

        // Années disponibles
        $annees = Groupe::where('statut', 'termine')
            ->selectRaw('YEAR(dateFin) as annee')
            ->distinct()
            ->orderByDesc('annee')
            ->pluck('annee');

        return Inertia::render('Directeur/Archives/Index', [
            'groupes'   => $groupes,
            'etudiants' => $etudiants,
            'annees'    => $annees,
            'filters'   => ['annee' => $annee, 'search' => $search],
        ]);
    }

    // Archiver une année scolaire
    public function archiver(Request $request)
    {
        $request->validate([
            'annee' => 'required|string|max:20',
        ]);

        // Passer tous les groupes en_cours → terminé
        $groupes = Groupe::where('statut', 'en_cours')->get();
        $nbGroupes = $groupes->count();

        foreach ($groupes as $groupe) {
            $groupe->update([
                'statut' => 'termine',
                'dateFin'=> now(),
            ]);
        }

        // Passer les étudiants sans groupe actif → inactif
        $etudiants = Etudiant::where('actif', 1)->get();
        $nbArchives = 0;

        foreach ($etudiants as $etudiant) {
            $aGroupeActif = $etudiant->groupesActifs()->exists();
            if (!$aGroupeActif) {
                $etudiant->update(['actif' => 0]);
                $nbArchives++;
            }
        }

        // Log
        \App\Models\Log::enregistrer(
            'archivage_annee',
            "Année {$request->annee} archivée — {$nbGroupes} groupes terminés, {$nbArchives} étudiants archivés"
        );

        return back()->with('success', "Année {$request->annee} archivée avec succès — {$nbGroupes} groupes, {$nbArchives} étudiants.");
    }
    public function reactiver($id)
{
    $etudiant = \App\Models\Etudiant::findOrFail($id);
    $etudiant->update(['actif' => 1]);

    \App\Models\Log::enregistrer(
        'reactivation_etudiant',
        "Étudiant #{$id} réactivé"
    );

    return back()->with('success', 'Étudiant réactivé avec succès.');
}
}