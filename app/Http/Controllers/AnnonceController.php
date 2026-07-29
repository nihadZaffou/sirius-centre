<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\Groupe;
use App\Models\Directeur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnonceController extends Controller
{
    public function index()
    {
        $annonces = Annonce::with(['groupes', 'directeur.user'])
            ->orderByDesc('datePublication')
            ->get()
            ->map(fn($a) => [
                'id'              => $a->idAnnonce,
                'titre'           => $a->titre,
                'message'         => $a->message,
                'type'            => $a->type,
                'datePublication' => $a->datePublication,
                'auteur'          => $a->directeur?->user?->prenom . ' ' . $a->directeur?->user?->nom,
                'groupes'         => $a->groupes->map(fn($g) => [
                    'id'  => $g->idGroupe,
                    'nom' => $g->nomGroupe,
                ]),
                'destinatairesCount' => $a->groupes->sum(fn($g) => $g->etudiantsActifs()->count()),
            ]);

        $groupes = Groupe::actifs()
            ->with('niveau.langue')
            ->get()
            ->map(fn($g) => [
                'id'     => $g->idGroupe,
                'nom'    => $g->nomGroupe,
                'langue' => $g->niveau?->langue?->nomLangue,
                'niveau' => $g->niveau?->nomNiveau,
            ]);

        return Inertia::render('Directeur/Annonces/Index', [
            'annonces' => $annonces,
            'groupes'  => $groupes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre'      => 'required|string|max:255',
            'message'    => 'required|string|max:2000',
            'type'       => 'required|in:absence_prof,horaire,examen,fermeture,nouveau_groupe,autre',
            'groupeIds'  => 'required|array|min:1',
            'groupeIds.*'=> 'exists:groupes,idGroupe',
        ], [
            'titre.required'   => 'Le titre est obligatoire.',
            'message.required' => 'Le message est obligatoire.',
            'groupeIds.required' => 'Choisissez au moins un groupe.',
        ]);

        $directeur = Directeur::where('idUser', auth()->user()->idUser)->firstOrFail();

        $annonce = Annonce::create([
            'titre'           => $request->titre,
            'message'         => $request->message,
            'type'            => $request->type,
            'datePublication' => now(),
            'idDirecteur'     => $directeur->idDirecteur,
        ]);

        $annonce->groupes()->attach($request->groupeIds);

        return back()->with('success', 'Annonce créée avec succès.');
    }

    // Liste des destinataires d'une annonce (pour envoi WhatsApp/Email)
    public function destinataires($id)
    {
        $annonce = Annonce::with('groupes.etudiantsActifs.user')->findOrFail($id);

        $destinataires = collect();
        foreach ($annonce->groupes as $groupe) {
            foreach ($groupe->etudiantsActifs as $etudiant) {
                $destinataires->push([
                    'id'        => $etudiant->idEtudiant,
                    'nom'       => $etudiant->user->nom,
                    'prenom'    => $etudiant->user->prenom,
                    'telephone' => $etudiant->user->telephone,
                    'email'     => $etudiant->user->email,
                    'groupe'    => $groupe->nomGroupe,
                ]);
            }
        }

        // Dédupliquer si étudiant dans plusieurs groupes concernés
        $destinataires = $destinataires->unique('id')->values();

        return response()->json([
            'annonce' => [
                'titre'   => $annonce->titre,
                'message' => $annonce->message,
            ],
            'destinataires' => $destinataires,
        ]);
    }

    public function destroy($id)
    {
        Annonce::findOrFail($id)->delete();
        return back()->with('success', 'Annonce supprimée.');
    }
}