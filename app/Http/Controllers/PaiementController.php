<?php

namespace App\Http\Controllers;

use App\Models\Avance;
use App\Models\Paiement;
use Illuminate\Http\Request;

class PaiementController extends Controller
{
    public function ajouterAvance(Request $request)
    {
        $request->validate([
            'idPaiement'   => 'required|exists:paiements,idPaiement',
            'montant'      => 'required|numeric|min:1',
            'datePaiement' => 'required|date',
        ], [
            'idPaiement.required'   => 'Le paiement est requis.',
            'idPaiement.exists'     => 'Paiement introuvable.',
            'montant.required'      => 'Le montant est requis.',
            'montant.numeric'       => 'Le montant doit être un nombre.',
            'montant.min'           => 'Le montant doit être supérieur à 0.',
            'datePaiement.required' => 'La date est requise.',
            'datePaiement.date'     => 'La date est invalide.',
        ]);

        $paiement = Paiement::with('avances')->findOrFail($request->idPaiement);

        $montantPaye = $paiement->avances->sum('montant');
        $reste       = $paiement->montantTotal - $montantPaye;

        if ($request->montant > $reste) {
            return back()->withErrors([
                'montant' => "Le montant ne peut pas dépasser le reste dû ({$reste} DH)."
            ]);
        }

        Avance::create([
            'montant'      => $request->montant,
            'datePaiement' => $request->datePaiement,
            'idPaiement'   => $request->idPaiement,
            'idDirecteur'  => auth()->user()->directeur->idDirecteur,
        ]);

        \App\Models\Log::enregistrer(
            'ajout_avance',
            "Avance de {$request->montant} DH ajoutée au paiement #{$request->idPaiement}"
        );

        return back()->with('success', 'Avance enregistrée avec succès.');
    }

    public function marquerSolde($id)
    {
        $paiement = Paiement::findOrFail($id);
        $paiement->update(['statut' => 'solde']);

        \App\Models\Log::enregistrer(
            'marquer_solde',
            "Paiement #{$id} marqué comme soldé"
        );

        return back()->with('success', 'Paiement marqué comme soldé.');
    }
}