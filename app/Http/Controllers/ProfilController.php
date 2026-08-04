<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfilController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile/Index', [
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'telephone' => 'nullable|string|max:20',
        ]);

        auth()->user()->update([
            'nom'       => strtoupper($request->nom),
            'prenom'    => ucfirst(strtolower($request->prenom)),
            'telephone' => $request->telephone,
        ]);

        return back()->with('success', 'Profil mis à jour.');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'ancien'        => 'required|string',
            'nouveau'       => 'required|string|min:8|confirmed',
        ], [
            'ancien.required'        => 'L\'ancien mot de passe est obligatoire.',
            'nouveau.required'       => 'Le nouveau mot de passe est obligatoire.',
            'nouveau.min'            => 'Le mot de passe doit avoir au moins 8 caractères.',
            'nouveau.confirmed'      => 'Les mots de passe ne correspondent pas.',
        ]);

        if (!Hash::check($request->ancien, auth()->user()->motDePasse)) {
            return back()->withErrors(['ancien' => 'Ancien mot de passe incorrect.']);
        }

        auth()->user()->update([
            'motDePasse' => Hash::make($request->nouveau),
        ]);

        \App\Models\Log::enregistrer('changement_mdp', 'Mot de passe modifié');

        return back()->with('success', 'Mot de passe modifié avec succès.');
    }
}