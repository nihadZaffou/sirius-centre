<?php

namespace App\Http\Controllers;

use App\Models\Langue;
use App\Models\Niveau;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LangueController extends Controller
{
    public function index()
    {
        $langues = Langue::withCount(['niveaux', 'niveaux as groupes_count' => function($q) {
                $q->whereHas('groupes');
            }])
            ->orderBy('nomLangue')
            ->get()
            ->map(fn($l) => [
                'id'            => $l->idLangue,
                'nom'           => $l->nomLangue,
                'actif'         => $l->actif,
                'niveaux_count' => $l->niveaux_count,
                'niveaux'       => $l->niveaux->map(fn($n) => [
                    'id'    => $n->idNiveau,
                    'nom'   => $n->nomNiveau,
                    'ordre' => $n->ordre,
                    'actif' => $n->actif,
                ]),
            ]);

        return Inertia::render('Directeur/Langues/Index', [
            'langues' => $langues,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nomLangue' => 'required|string|max:100|unique:langues,nomLangue',
        ], [
            'nomLangue.required' => 'Le nom de la langue est obligatoire.',
            'nomLangue.unique'   => 'Cette langue existe déjà.',
        ]);

        $langue = Langue::create([
            'nomLangue' => ucfirst(strtolower($request->nomLangue)),
            'actif'     => 1,
        ]);

        // Créer les 9 niveaux automatiquement
        $niveaux = [
            ['nom' => 'A1',   'ordre' => 1],
            ['nom' => 'A1.2', 'ordre' => 2],
            ['nom' => 'A2',   'ordre' => 3],
            ['nom' => 'A2+',  'ordre' => 4],
            ['nom' => 'B1.1', 'ordre' => 5],
            ['nom' => 'B1.2', 'ordre' => 6],
            ['nom' => 'B2.1', 'ordre' => 7],
            ['nom' => 'B2.2', 'ordre' => 8],
            ['nom' => 'C1',   'ordre' => 9],
        ];

        foreach ($niveaux as $n) {
            Niveau::create([
                'nomNiveau' => $n['nom'],
                'idLangue'  => $langue->idLangue,
                'ordre'     => $n['ordre'],
                'actif'     => 1,
            ]);
        }

        return back()->with('success', "Langue {$langue->nomLangue} ajoutée avec ses 9 niveaux.");
    }

    public function toggleActif($id)
    {
        $langue = Langue::findOrFail($id);
        $langue->update(['actif' => !$langue->actif]);

        $msg = $langue->actif ? 'activée' : 'désactivée';
        return back()->with('success', "Langue {$msg}.");
    }
}