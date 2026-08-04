<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use App\Models\Groupe;
use App\Models\Paiement;
use App\Models\Avance;
use App\Models\Directeur;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class InscriptionController extends Controller
{
    // Recherche étudiant
    public function rechercher(Request $request)
    {
        $search = $request->q;
        if (!$search || strlen($search) < 2) {
            return response()->json([]);
        }

        $etudiants = Etudiant::with('user')
            ->join('utilisateurs', 'etudiants.idUser', '=', 'utilisateurs.idUser')
            ->where('etudiants.actif', 1)
            ->where(function($q) use ($search) {
                $q->where('utilisateurs.nom', 'like', "%$search%")
                  ->orWhere('utilisateurs.prenom', 'like', "%$search%")
                  ->orWhere('etudiants.cin', 'like', "%$search%")
                  ->orWhere('utilisateurs.telephone', 'like', "%$search%");
            })
            ->select('etudiants.*')
            ->limit(10)
            ->get()
            ->map(fn($e) => [
                'id'        => $e->idEtudiant,
                'nom'       => $e->user->nom,
                'prenom'    => $e->user->prenom,
                'email'     => $e->user->email,
                'cin'       => $e->cin,
                'telephone' => $e->user->telephone,
            ]);

        return response()->json($etudiants);
    }

    // Données formulaire
    public function create()
    {
        $langues = \App\Models\Langue::actives()
            ->with(['niveaux' => fn($q) => $q->where('actif', 1)
                ->with(['groupes' => fn($q) => $q->where('actif', 1)->where('statut', 'en_cours')])
                ->orderBy('ordre')
            ])
            ->orderBy('nomLangue')
            ->get()
            ->map(fn($l) => [
                'id'      => $l->idLangue,
                'nom'     => $l->nomLangue,
                'niveaux' => $l->niveaux->map(fn($n) => [
                    'id'      => $n->idNiveau,
                    'nom'     => $n->nomNiveau,
                    'groupes' => $n->groupes->map(fn($g) => [
                        'id'       => $g->idGroupe,
                        'nom'      => $g->nomGroupe,
                        'capacite' => $g->capacite,
                        'inscrits' => $g->etudiantsActifs()->count(),
                    ]),
                ]),
            ]);

        return response()->json(['langues' => $langues]);
    }

    // Ajouter étudiant à un groupe
    public function ajouterAuGroupe(Request $request, $idGroupe)
    {
        $request->validate([
            'nouveau'      => 'boolean',
            'nom'          => 'required_if:nouveau,true|string|max:100',
            'prenom'       => 'required_if:nouveau,true|string|max:100',
            'email'        => 'required_if:nouveau,true|email|unique:utilisateurs,email',
            'telephone'    => 'nullable|string|max:20',
            'cin'          => 'nullable|string|max:20|unique:etudiants,cin',
            'ville'        => 'nullable|string|max:100',
            'adresse'      => 'nullable|string|max:255',
            'nomParent'    => 'nullable|string|max:100',
            'telParent'    => 'nullable|string|max:20',
            'idEtudiant'   => 'required_if:nouveau,false|exists:etudiants,idEtudiant',
            'montantTotal' => 'required|numeric|min:1',
            'avance'       => 'nullable|numeric|min:0',
            'dateAvance'   => 'nullable|date',
        ], [
            'nom.required_if'       => 'Le nom est obligatoire.',
            'prenom.required_if'    => 'Le prénom est obligatoire.',
            'email.required_if'     => 'L\'email est obligatoire.',
            'email.unique'          => 'Cet email est déjà utilisé.',
            'cin.unique'            => 'Ce CIN est déjà utilisé.',
            'montantTotal.required' => 'Le montant est obligatoire.',
        ]);

        $groupe    = Groupe::findOrFail($idGroupe);
        $directeur = Directeur::where('idUser', auth()->user()->idUser)->firstOrFail();

        DB::transaction(function () use ($request, $groupe, $directeur) {

            // Créer ou récupérer étudiant
            if ($request->nouveau) {
                $user = User::create([
                    'nom'        => strtoupper($request->nom),
                    'prenom'     => ucfirst(strtolower($request->prenom)),
                    'email'      => $request->email,
                    'motDePasse' => Hash::make('sirius123'),
                    'telephone'  => $request->telephone,
                    'role'       => 'etudiant',
                    'actif'      => 1,
                ]);
                $etudiant = Etudiant::create([
                    'idUser'    => $user->idUser,
                    'cin'       => $request->cin,
                    'adresse'   => $request->adresse,
                    'ville'     => $request->ville,
                    'nomParent' => $request->nomParent,
                    'telParent' => $request->telParent,
                    'actif'     => 1,
                ]);
            } else {
                $etudiant = Etudiant::findOrFail($request->idEtudiant);
            }

            // Vérifier si déjà actif dans ce groupe
                $dejaActif = DB::table('appartient')
                    ->where('idEtudiant', $etudiant->idEtudiant)
                    ->where('idGroupe', $groupe->idGroupe)
                    ->where('statut', 'actif')
                    ->exists();

                if ($dejaActif) {
                    return back()->with('error', 'Cet étudiant est déjà inscrit et actif dans ce groupe.');
                }

                // Vérifier si inscription existe (terminée ou abandonnée)
                $dejaInscrit = DB::table('appartient')
                    ->where('idEtudiant', $etudiant->idEtudiant)
                    ->where('idGroupe', $groupe->idGroupe)
                    ->exists();

                if (!$dejaInscrit) {
                    // Nouvelle inscription
                    DB::table('appartient')->insert([
                        'idEtudiant'      => $etudiant->idEtudiant,
                        'idGroupe'        => $groupe->idGroupe,
                        'dateInscription' => now()->toDateString(),
                        'statut'          => 'actif',
                    ]);
                } else {
                    // Réactiver étudiant (était terminé ou abandonné)
                    DB::table('appartient')
                        ->where('idEtudiant', $etudiant->idEtudiant)
                        ->where('idGroupe', $groupe->idGroupe)
                        ->update([
                            'statut'          => 'actif',
                            'dateInscription' => now()->toDateString(),
                            'dateFin'         => null,
                        ]);
                }

            // Créer paiement si n'existe pas
            $paiementExiste = Paiement::where('idEtudiant', $etudiant->idEtudiant)
                ->where('idGroupe', $groupe->idGroupe)
                ->exists();

            if (!$paiementExiste) {
                $paiement = Paiement::create([
                    'montantTotal' => $request->montantTotal,
                    'statut'       => 'en_cours',
                    'idEtudiant'   => $etudiant->idEtudiant,
                    'idNiveau'     => $groupe->idNiveau,
                    'idGroupe'     => $groupe->idGroupe,
                    'idDirecteur'  => $directeur->idDirecteur,
                    'dateCreation' => now(),
                ]);

                if (!empty($request->avance) && $request->avance > 0) {
                    Avance::create([
                        'montant'      => $request->avance,
                        'datePaiement' => $request->dateAvance ?? now()->toDateString(),
                        'idPaiement'   => $paiement->idPaiement,
                        'idDirecteur'  => $directeur->idDirecteur,
                    ]);
                }
            }
        });

        return back();
    }

    // Inscription complète depuis dashboard
    public function store(Request $request)
    {
        $request->validate([
            'nouveau'                     => 'boolean',
            'nom'                         => 'required_if:nouveau,true|string|max:100',
            'prenom'                      => 'required_if:nouveau,true|string|max:100',
            'dateNaissance' => 'nullable|date',
            'email'                       => 'required_if:nouveau,true|email|unique:utilisateurs,email',
            'telephone'                   => 'nullable|string|max:20',
            'cin'                         => 'nullable|string|max:20|unique:etudiants,cin',
            'adresse'                     => 'nullable|string|max:255',
            'ville'                       => 'nullable|string|max:100',
            'nomParent'                   => 'nullable|string|max:100',
            'telParent'                   => 'nullable|string|max:20',
            'idEtudiant' => 'nullable|required_if:nouveau,false|exists:etudiants,idEtudiant',
            'inscriptions'                => 'required|array|min:1',
            'inscriptions.*.idGroupe'     => 'required|exists:groupes,idGroupe',
            'inscriptions.*.montantTotal' => 'required|numeric|min:1',
            'inscriptions.*.avance'       => 'nullable|numeric|min:0',
            'inscriptions.*.dateAvance'   => 'nullable|date',
        ]);

        $directeur = Directeur::where('idUser', auth()->user()->idUser)->firstOrFail();

        DB::transaction(function () use ($request, $directeur) {

            if ($request->nouveau) {
                $user = User::create([
                    'nom'        => strtoupper($request->nom),
                    'prenom'     => ucfirst(strtolower($request->prenom)),
                    'email'      => $request->email,
                    'motDePasse' => Hash::make('sirius123'),
                    'telephone'  => $request->telephone,
                    'role'       => 'etudiant',
                    'actif'      => 1,
                ]);
            $etudiant = Etudiant::create([
                'idUser'        => $user->idUser,
                'dateNaissance' => $request->dateNaissance,
                'cin'           => $request->cin,
                'adresse'       => $request->adresse,
                'ville'         => $request->ville,
                'nomParent'     => $request->nomParent,
                'telParent'     => $request->telParent,
                'actif'         => 1,
            ]);
            } else {
                $etudiant = Etudiant::findOrFail($request->idEtudiant);
            }

            foreach ($request->inscriptions as $ins) {
                $groupe = Groupe::findOrFail($ins['idGroupe']);

                $dejaInscrit = DB::table('appartient')
                    ->where('idEtudiant', $etudiant->idEtudiant)
                    ->where('idGroupe', $ins['idGroupe'])
                    ->exists();

                if (!$dejaInscrit) {
                    DB::table('appartient')->insert([
                        'idEtudiant'      => $etudiant->idEtudiant,
                        'idGroupe'        => $ins['idGroupe'],
                        'dateInscription' => now()->toDateString(),
                        'statut'          => 'actif',
                    ]);
                } else {
                    DB::table('appartient')
                        ->where('idEtudiant', $etudiant->idEtudiant)
                        ->where('idGroupe', $ins['idGroupe'])
                        ->update([
                            'statut'          => 'actif',
                            'dateInscription' => now()->toDateString(),
                            'dateFin'         => null,
                        ]);
                }

                $paiementExiste = Paiement::where('idEtudiant', $etudiant->idEtudiant)
                    ->where('idGroupe', $ins['idGroupe'])
                    ->exists();

                if (!$paiementExiste) {
                    $paiement = Paiement::create([
                        'montantTotal' => $ins['montantTotal'],
                        'statut'       => 'en_cours',
                        'idEtudiant'   => $etudiant->idEtudiant,
                        'idNiveau'     => $groupe->idNiveau,
                        'idGroupe'     => $ins['idGroupe'],
                        'idDirecteur'  => $directeur->idDirecteur,
                        'dateCreation' => now(),
                    ]);

                    if (!empty($ins['avance']) && $ins['avance'] > 0) {
                        Avance::create([
                            'montant'      => $ins['avance'],
                            'datePaiement' => $ins['dateAvance'] ?? now()->toDateString(),
                            'idPaiement'   => $paiement->idPaiement,
                            'idDirecteur'  => $directeur->idDirecteur,
                        ]);
                    }
                }
            }
        });

        return back()->with('success', 'Inscription enregistrée avec succès.');
    }
    
}