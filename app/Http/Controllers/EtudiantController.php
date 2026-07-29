<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use App\Models\Groupe;
use App\Models\Langue;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EtudiantController extends Controller
{
    // Liste étudiants
    public function index(Request $request)
    {
        $query = Etudiant::with([
        'user',
        'groupesActifs.niveau.langue',
        'paiements.avances',
        'presences',
    ])
    ->join('utilisateurs', 'etudiants.idUser', '=', 'utilisateurs.idUser')
    ->select('etudiants.*');

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('utilisateurs.nom', 'like', "%$search%")
                  ->orWhere('utilisateurs.prenom', 'like', "%$search%")
                  ->orWhere('utilisateurs.email', 'like', "%$search%")
                  ->orWhere('etudiants.cin', 'like', "%$search%")
                  ->orWhere('utilisateurs.telephone', 'like', "%$search%");
            });
        }

        // Filtre actif
        if ($request->filled('statut')) {
            if ($request->statut === 'actif') {
                $query->where('etudiants.actif', 1);
            } elseif ($request->statut === 'inactif') {
                $query->where('etudiants.actif', 0);
            }
        } else {
            $query->where('etudiants.actif', 1);
        }
    // Filtre par groupe
if ($request->filled('idGroupe')) {
    $query->whereHas('groupes', function($q) use ($request) {
        $q->where('groupes.idGroupe', $request->idGroupe)
          ->where('appartient.statut', 'actif');
    });
}
        $etudiants = $query
            ->orderBy('utilisateurs.nom')
            ->paginate(15)
            ->withQueryString()
            ->through(fn($e) => [
    'id'        => $e->idEtudiant,
    'nom'       => $e->user->nom,
    'prenom'    => $e->user->prenom,
    'email'     => $e->user->email,
    'telephone' => $e->user->telephone,
    'cin'       => $e->cin,
    'actif'     => $e->actif,
    'groupes'   => $e->groupesActifs->map(fn($g) => [
        'id'     => $g->idGroupe,
        'nom'    => $g->nomGroupe,
        'langue' => $g->niveau?->langue?->nomLangue,
        'niveau' => $g->niveau?->nomNiveau,
    ]),
    // Paiement
    'paiement' => $e->paiements()
        ->where('statut', 'en_cours')
        ->selectRaw('SUM(montantTotal) as total')
        ->first()->total > 0 ? [
            'statut' => 'en_cours',
            'reste'  => $e->paiements()
                ->where('statut', 'en_cours')
                ->get()
                ->sum(fn($p) => $p->reste),
        ] : ['statut' => 'solde', 'reste' => 0],
    // Absences non justifiées
    'absences' => $e->presences()
        ->where('estPresent', 0)
        ->where('estJustifie', 0)
        ->count(),
]);

        return Inertia::render('Directeur/Etudiants/Index', [
            'etudiants' => $etudiants,
            'filters'   => $request->only(['search', 'statut', 'idGroupe']),
        ]);
    }

    // Fiche étudiant
    public function show($id)
    {
       $etudiant = Etudiant::with([
    'user',
    'groupesActifs.niveau.langue',
    'groupesActifs.prof.user',
    'groupesActifs.emplois',
    'paiements.avances',
    'paiements.niveau',
    'paiements.groupe',
    'presences.groupe',  // ← ajoutez
    'attestations',
    'traductions',
    'alertes' => fn($q) => $q->where('statut', 'active'),
])->findOrFail($id);

        return Inertia::render('Directeur/Etudiants/Fiche', [
            'etudiant' => [
                'id'         => $etudiant->idEtudiant,
                'nom'        => $etudiant->user->nom,
                'prenom'     => $etudiant->user->prenom,
                'email'      => $etudiant->user->email,
                'telephone'  => $etudiant->user->telephone,
                'cin'        => $etudiant->cin,
                'adresse'    => $etudiant->adresse,
                'ville'     => $etudiant->ville,
                'nomParent'  => $etudiant->nomParent,
                'telParent'  => $etudiant->telParent,
                'actif'      => $etudiant->actif,
                'dateNaissance' => $etudiant->dateNaissance,
                'groupes'    => $etudiant->groupesActifs->map(fn($g) => [
                    'id'      => $g->idGroupe,
                    'nom'     => $g->nomGroupe,
                    'langue'  => $g->niveau?->langue?->nomLangue,
                    'niveau'  => $g->niveau?->nomNiveau,
                    'prof'    => $g->prof?->user?->prenom . ' ' . $g->prof?->user?->nom,
                    'emplois' => $g->emplois->map(fn($e) => [
                        'jour'   => $e->jour,
                        'debut'  => $e->heureDebut,
                        'fin'    => $e->heureFin,
                        'salle'  => $e->salle,
                    ]),
                    'dateInscription' => $g->pivot->dateInscription,
                ]),
                'paiements'     => $etudiant->paiements->map(fn($p) => [
                    'id'           => $p->idPaiement,
                    'montantTotal' => $p->montantTotal,
                    'montantPaye'  => $p->montant_paye,
                    'reste'        => $p->reste,
                    'statut'       => $p->statut,
                    'niveau'       => $p->niveau?->nomNiveau,
                    'groupe'       => $p->groupe?->nomGroupe,
                    'date'         => $p->dateCreation,
                    'avances'      => $p->avances->map(fn($a) => [
                        'id'      => $a->idAvance,
                        'montant' => $a->montant,
                        'date'    => $a->datePaiement,
                    ]),
                ]),
                'attestations'  => $etudiant->attestations->map(fn($a) => [
                    'id'      => $a->idAttestation,
                    'niveau'  => $a->niveau,
                    'statut'  => $a->statut,
                    'date'    => $a->dateDemande,
                    'fichier' => $a->fichierPDF,
                ]),
                'traductions'   => $etudiant->traductions->map(fn($t) => [
                    'id'      => $t->idTraduction,
                    'statut'  => $t->statut,
                    'date'    => $t->dateDemande,
                    'montant' => $t->montant,
                ]),
                'alertes'       => $etudiant->alertes->map(fn($a) => [
                    'id'      => $a->idAlerte,
                    'type'    => $a->type,
                    'message' => $a->message,
                    'date'    => $a->dateCreation,
                ]),
                'presences' => $etudiant->presences->map(fn($p) => [
                    'id'          => $p->idPresence,
                    'dateSeance'  => $p->dateSeance,
                    'estPresent'  => $p->estPresent,
                    'estJustifie' => $p->estJustifie,
                    'motifJustif' => $p->motifJustif,
                    'groupe'      => $p->groupe?->nomGroupe,
                    'idPresence'  => $p->idPresence,
                ]),
            ],
        ]);
    }

    // Formulaire création
    public function create()
    {
        $groupes = Groupe::actifs()
            ->with('niveau.langue')
            ->get()
            ->map(fn($g) => [
                'id'     => $g->idGroupe,
                'nom'    => $g->nomGroupe,
                'langue' => $g->niveau?->langue?->nomLangue,
                'niveau' => $g->niveau?->nomNiveau,
            ]);

        return Inertia::render('Directeur/Etudiants/Form', [
            'groupes' => $groupes,
            'mode'    => 'create',
        ]);
    }

    // Enregistrer étudiant
    public function store(Request $request)
    {
        $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:utilisateurs,email',
            'telephone'  => 'nullable|string|max:20',
            'cin'        => 'nullable|string|max:20|unique:etudiants,cin',
            'adresse'    => 'nullable|string|max:255',
            'nomParent'  => 'nullable|string|max:100',
            'telParent'  => 'nullable|string|max:20',
            'ville' => 'nullable|string|max:100',
            'dateNaissance' => 'nullable|date',
            'idGroupe'   => 'nullable|exists:groupes,idGroupe',
        ], [
            'nom.required'      => 'Le nom est obligatoire.',
            'prenom.required'   => 'Le prénom est obligatoire.',
            'email.required'    => 'L\'email est obligatoire.',
            'email.email'       => 'L\'adresse email n\'est pas valide.',
            'email.unique'      => 'Cet email est déjà utilisé.',
            'cin.unique'        => 'Ce CIN est déjà utilisé.',
        ]);

        DB::transaction(function () use ($request) {
            // Créer utilisateur
            $user = User::create([
                'nom'        => strtoupper($request->nom),
                'prenom'     => ucfirst(strtolower($request->prenom)),
                'email'      => $request->email,
                'motDePasse' => Hash::make('sirius123'),
                'telephone'  => $request->telephone,
                'role'       => 'etudiant',
                'actif'      => 1,
            ]);

            // Créer étudiant
            $etudiant = Etudiant::create([
    'idUser'    => $user->idUser,
    'cin'       => $request->cin,
    'adresse'   => $request->adresse,
    'ville'     => $request->ville,
    'nomParent' => $request->nomParent,
    'telParent' => $request->telParent,
    'actif'     => 1,
    'dateNaissance' => $request->dateNaissance,
]);

            // Inscrire dans un groupe si sélectionné
            if ($request->idGroupe) {
                DB::table('appartient')->insert([
                    'idEtudiant'      => $etudiant->idEtudiant,
                    'idGroupe'        => $request->idGroupe,
                    'dateInscription' => now()->toDateString(),
                    'statut'          => 'actif',
                ]);
            }
        });

        return redirect()->route('directeur.etudiants.index')
            ->with('success', 'Étudiant ajouté avec succès.');
    }

    // Formulaire modification
public function edit($id)
{
    $etudiant = Etudiant::with('user')->findOrFail($id);

    return Inertia::render('Directeur/Etudiants/Form', [
        'etudiant' => [
            'id'        => $etudiant->idEtudiant,
            'nom'       => $etudiant->user->nom,
            'prenom'    => $etudiant->user->prenom,
            'email'     => $etudiant->user->email,
            'telephone' => $etudiant->user->telephone,
            'cin'       => $etudiant->cin,
            'adresse'   => $etudiant->adresse,
            'ville'     => $etudiant->ville,        // ← ajoutez cette ligne
            'nomParent' => $etudiant->nomParent,
            'dateNaissance' => $etudiant->dateNaissance,
            'telParent' => $etudiant->telParent,
        ],
        'mode' => 'edit',
    ]);
}

    // Modifier étudiant
    public function update(Request $request, $id)
    {
        $etudiant = Etudiant::with('user')->findOrFail($id);

        $request->validate([
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => ['required', 'email', Rule::unique('utilisateurs', 'email')->ignore($etudiant->idUser, 'idUser')],
            'telephone' => 'nullable|string|max:20',
            'cin'       => ['nullable', 'string', 'max:20', Rule::unique('etudiants', 'cin')->ignore($etudiant->idEtudiant, 'idEtudiant')],
            'adresse'   => 'nullable|string|max:255',
            'nomParent' => 'nullable|string|max:100',
            'telParent' => 'nullable|string|max:20',
            'ville' => 'nullable|string|max:100',
        ], [
            'nom.required'    => 'Le nom est obligatoire.',
            'prenom.required' => 'Le prénom est obligatoire.',
            'email.required'  => 'L\'email est obligatoire.',
            'email.email'     => 'L\'adresse email n\'est pas valide.',
            'email.unique'    => 'Cet email est déjà utilisé.',
            'cin.unique'      => 'Ce CIN est déjà utilisé.',
        ]);

        DB::transaction(function () use ($request, $etudiant) {
            $etudiant->user->update([
                'nom'       => strtoupper($request->nom),
                'prenom'    => ucfirst(strtolower($request->prenom)),
                'email'     => $request->email,
                'telephone' => $request->telephone,
            ]);

           $etudiant->update([
    'cin'       => $request->cin,
    'adresse'   => $request->adresse,
    'ville'     => $request->ville,
    'nomParent' => $request->nomParent,
    'dateNaissance' => $request->dateNaissance,
    'telParent' => $request->telParent,
]);
        });

        return redirect()->route('directeur.etudiants.fiche', $id)
            ->with('success', 'Étudiant modifié avec succès.');
    }

    // Désactiver étudiant (soft delete)
    public function destroy($id)
    {
        $etudiant = Etudiant::findOrFail($id);
        $etudiant->update(['actif' => 0]);
        $etudiant->user->update(['actif' => 0]);

        return redirect()->route('directeur.etudiants.index')
            ->with('success', 'Étudiant désactivé.');
    }
}