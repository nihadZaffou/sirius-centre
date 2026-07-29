<?php

namespace App\Http\Controllers;

use App\Models\Traduction;
use App\Models\Etudiant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TraductionController extends Controller
{
    public function index()
    {
        $traductions = Traduction::with('etudiant.user')
            ->orderByDesc('dateDemande')
            ->get()
            ->map(fn($t) => [
    'id'      => $t->idTraduction,
    'statut'  => $t->statut,
    'montant' => $t->montant,
    'date'    => $t->dateDemande,
    'externe' => $t->idEtudiant === null,
    'etudiant' => $t->idEtudiant ? [
        'id'        => $t->etudiant->idEtudiant,
        'nom'       => $t->etudiant->user->nom,
        'prenom'    => $t->etudiant->user->prenom,
        'email'     => $t->etudiant->user->email,
        'telephone' => $t->etudiant->user->telephone,
    ] : [
        'id'        => null,
        'nom'       => $t->nomExterne,
        'prenom'    => $t->prenomExterne,
        'email'     => null,
        'telephone' => $t->telephoneExterne,
    ],
]);

        $etudiants = Etudiant::with('user')
            ->where('etudiants.actif', 1)
            ->join('utilisateurs', 'etudiants.idUser', '=', 'utilisateurs.idUser')
            ->select('etudiants.*')
            ->orderBy('utilisateurs.nom')
            ->get()
            ->map(fn($e) => [
                'id'     => $e->idEtudiant,
                'nom'    => $e->user->nom,
                'prenom' => $e->user->prenom,
            ]);

        return Inertia::render('Directeur/Traductions/Index', [
            'traductions' => $traductions,
            'etudiants'   => $etudiants,
        ]);
    }

  public function store(Request $request)
{
    $request->validate([
        'externe'          => 'boolean',
        'idEtudiant'       => 'required_if:externe,false|nullable|exists:etudiants,idEtudiant',
        'nomExterne'       => 'required_if:externe,true|nullable|string|max:100',
        'prenomExterne'    => 'required_if:externe,true|nullable|string|max:100',
        'telephoneExterne' => 'nullable|string|max:20',
        'montant'          => 'required|numeric|min:1',
    ], [
        'idEtudiant.required_if'    => 'Choisissez un étudiant.',
        'nomExterne.required_if'    => 'Le nom est obligatoire.',
        'prenomExterne.required_if' => 'Le prénom est obligatoire.',
        'montant.required'          => 'Le montant est obligatoire.',
    ]);

    $directeur = \App\Models\Directeur::where('idUser', auth()->user()->idUser)->firstOrFail();

    Traduction::create([
        'idEtudiant'       => $request->externe ? null : $request->idEtudiant,
        'nomExterne'       => $request->externe ? $request->nomExterne : null,
        'prenomExterne'    => $request->externe ? $request->prenomExterne : null,
        'telephoneExterne' => $request->externe ? $request->telephoneExterne : null,
        'montant'          => $request->montant,
        'statut'           => 'demande',
        'dateDemande'      => now(),
        'idDirecteur'      => $directeur->idDirecteur,
    ]);

    return back()->with('success', 'Demande de traduction créée.');
}

    public function updateStatut(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:demande,en_attente,approuve,retour,recupere',
        ]);

        Traduction::findOrFail($id)->update(['statut' => $request->statut]);
        return back()->with('success', 'Statut mis à jour.');
    }

    public function destroy($id)
    {
        Traduction::findOrFail($id)->delete();
        return back()->with('success', 'Demande supprimée.');
    }
}