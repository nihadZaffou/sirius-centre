<?php

namespace App\Http\Controllers;

use App\Models\Prof;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DirecteurProfController extends Controller
{
    public function index()
    {
        $profs = Prof::with(['user', 'groupes.niveau.langue'])
            ->get()
            ->map(fn($p) => [
                'id'         => $p->idProf,
                'nom'        => $p->user->nom,
                'prenom'     => $p->user->prenom,
                'email'      => $p->user->email,
                'telephone'  => $p->user->telephone,
                'specialite' => $p->specialite,
                'groupes'    => $p->groupes->map(fn($g) => [
                    'id'     => $g->idGroupe,
                    'nom'    => $g->nomGroupe,
                    'langue' => $g->niveau?->langue?->nomLangue,
                    'niveau' => $g->niveau?->nomNiveau,
                    'statut' => $g->statut,
                ]),
            ]);

        return Inertia::render('Directeur/Profs/Index', [
            'profs' => $profs,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:utilisateurs,email',
            'telephone'  => 'nullable|string|max:20',
            'specialite' => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'nom'        => strtoupper($request->nom),
            'prenom'     => ucfirst(strtolower($request->prenom)),
            'email'      => $request->email,
            'motDePasse' => Hash::make('sirius123'),
            'telephone'  => $request->telephone,
            'role'       => 'prof',
            'actif'      => 1,
        ]);

        Prof::create([
            'idUser'     => $user->idUser,
            'specialite' => $request->specialite,
            'actif'      => 1,
        ]);

        return back()->with('success', 'Professeur ajouté avec succès.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:utilisateurs,email,'.Prof::findOrFail($id)->user->idUser.',idUser',
            'telephone'  => 'nullable|string|max:20',
            'specialite' => 'nullable|string|max:100',
        ]);

        $prof = Prof::findOrFail($id);
        $prof->user->update([
            'nom'       => strtoupper($request->nom),
            'prenom'    => ucfirst(strtolower($request->prenom)),
            'email'     => $request->email,
            'telephone' => $request->telephone,
        ]);
        $prof->update(['specialite' => $request->specialite]);

        return back()->with('success', 'Professeur modifié.');
    }

    public function destroy($id)
    {
        $prof = Prof::findOrFail($id);
        $prof->user->update(['actif' => 0]);
        return back()->with('success', 'Professeur désactivé.');
    }
}