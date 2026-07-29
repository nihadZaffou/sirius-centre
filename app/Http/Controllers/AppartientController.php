<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use App\Models\Avance;
use App\Models\Groupe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Directeur;
class AppartientController extends Controller
{
    // Changer de groupe (même niveau)
    public function changer(Request $request, $idEtudiant)
    {
        $request->validate([
            'idGroupeActuel'  => 'required|exists:groupes,idGroupe',
            'idNouveauGroupe' => 'required|exists:groupes,idGroupe|different:idGroupeActuel',
        ], [
            'idNouveauGroupe.required'  => 'Choisissez un nouveau groupe.',
            'idNouveauGroupe.different' => 'Le nouveau groupe doit être différent.',
        ]);

        DB::transaction(function () use ($request, $idEtudiant) {
            // Terminer l'inscription actuelle
            DB::table('appartient')
                ->where('idEtudiant', $idEtudiant)
                ->where('idGroupe', $request->idGroupeActuel)
                ->where('statut', 'actif')
                ->update([
                    'statut'  => 'abandonne',
                    'dateFin' => now()->toDateString(),
                ]);

            // Nouvelle inscription
            DB::table('appartient')->insert([
                'idEtudiant'      => $idEtudiant,
                'idGroupe'        => $request->idNouveauGroupe,
                'dateInscription' => now()->toDateString(),
                'dateFin'         => null,
                'statut'          => 'actif',
            ]);

            // Transférer le paiement (même niveau → même paiement)
            Paiement::where('idEtudiant', $idEtudiant)
                ->where('idGroupe', $request->idGroupeActuel)
                ->update(['idGroupe' => $request->idNouveauGroupe]);
        });

        return back()->with('success', 'Étudiant transféré vers le nouveau groupe.');
    }

    // Passage niveau suivant
    public function niveauSuivant(Request $request, $idEtudiant)
    {
        $request->validate([
            'idGroupeActuel'  => 'required|exists:groupes,idGroupe',
            'idNouveauGroupe' => 'required|exists:groupes,idGroupe',
            'montantTotal'    => 'required|numeric|min:1',
            'avance'          => 'nullable|numeric|min:0',
            'dateAvance'      => 'nullable|date',
        ], [
            'idNouveauGroupe.required' => 'Choisissez un groupe pour le niveau suivant.',
            'montantTotal.required'    => 'Le montant est obligatoire.',
            'montantTotal.min'         => 'Le montant doit être supérieur à 0.',
        ]);

        $directeur = Directeur::where('idUser', auth()->user()->idUser)->firstOrFail();
        $nouveauGroupe = Groupe::findOrFail($request->idNouveauGroupe);

        DB::transaction(function () use ($request, $idEtudiant, $directeur, $nouveauGroupe) {
            // Terminer l'inscription actuelle
            DB::table('appartient')
                ->where('idEtudiant', $idEtudiant)
                ->where('idGroupe', $request->idGroupeActuel)
                ->where('statut', 'actif')
                ->update([
                    'statut'  => 'termine',
                    'dateFin' => now()->toDateString(),
                ]);

            // Nouvelle inscription niveau suivant
            DB::table('appartient')->insert([
                'idEtudiant'      => $idEtudiant,
                'idGroupe'        => $request->idNouveauGroupe,
                'dateInscription' => now()->toDateString(),
                'dateFin'         => null,
                'statut'          => 'actif',
            ]);

            // Nouveau paiement pour le nouveau niveau
            $paiement = Paiement::create([
                'montantTotal' => $request->montantTotal,
                'statut'       => 'en_cours',
                'idEtudiant'   => $idEtudiant,
                'idNiveau'     => $nouveauGroupe->idNiveau,
                'idGroupe'     => $request->idNouveauGroupe,
                'idDirecteur'  => $directeur->idDirecteur,
                'dateCreation' => now(),
            ]);

            // Avance si saisie
            if (!empty($request->avance) && $request->avance > 0) {
                Avance::create([
                    'montant'      => $request->avance,
                    'datePaiement' => $request->dateAvance ?? now()->toDateString(),
                    'idPaiement'   => $paiement->idPaiement,
                    'idDirecteur'  => $directeur->idDirecteur,
                ]);

                if ($request->avance >= $request->montantTotal) {
                    $paiement->update(['statut' => 'solde']);
                }
            }
        });

        return back()->with('success', 'Étudiant passé au niveau suivant.');
    }

    // Changer statut inscription (abandon ou terminer)
    public function updateStatut(Request $request, $idEtudiant)
    {
        $request->validate([
            'idGroupe' => 'required|exists:groupes,idGroupe',
            'statut'   => 'required|in:abandonne,termine',
        ]);

        DB::table('appartient')
            ->where('idEtudiant', $idEtudiant)
            ->where('idGroupe', $request->idGroupe)
            ->where('statut', 'actif')
            ->update([
                'statut'  => $request->statut,
                'dateFin' => now()->toDateString(),
            ]);

        $msg = $request->statut === 'abandonne' ? 'Inscription marquée comme abandonnée.' : 'Inscription terminée.';
        return back()->with('success', $msg);
    }
}
