<?php

namespace App\Http\Controllers;

use App\Models\Emploi;
use App\Models\Groupe;
use App\Models\Niveau;
use App\Models\Prof;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Models\Paiement;
use App\Models\Etudiant;

class GroupeController extends Controller
{
    // Page groupes par niveau
public function parNiveau($idNiveau)
{
    $niveau = Niveau::with('langue')->findOrFail($idNiveau);

    $groupes = Groupe::with(['prof.user', 'emplois'])
        ->withCount(['etudiantsActifs'])
        ->where('idNiveau', $idNiveau)
        ->where('statut', '!=', 'termine')
        ->orderBy('nomGroupe')
        ->get()
        ->map(fn($g) => [
            'id'              => $g->idGroupe,
            'nom'             => $g->nomGroupe,
            'capacite'        => $g->capacite,
            'statut'          => $g->statut,
            'actif'           => $g->actif,
            'dateDebut'       => $g->dateDebut,
            'dateFin'         => $g->dateFin,
            'prof'            => $g->prof?->user?->prenom . ' ' . $g->prof?->user?->nom,
            'etudiants_count' => $g->etudiants_actifs_count,
            'emplois'         => $g->emplois->map(fn($e) => [
                'jour'  => $e->jour,
                'debut' => $e->heureDebut,
                'fin'   => $e->heureFin,
                'salle' => $e->salle,
            ]),
        ]);

    $profs = Prof::with('user')
        ->whereHas('user', fn($q) => $q->where('actif', 1))
        ->get()
        ->map(fn($p) => [
            'id'  => $p->idProf,
            'nom' => $p->user->prenom . ' ' . $p->user->nom,
        ]);

    return Inertia::render('Directeur/Niveaux/Groupes', [
        'niveau'  => [
            'id'     => $niveau->idNiveau,
            'nom'    => $niveau->nomNiveau,
            'langue' => $niveau->langue->nomLangue,
        ],
        'groupes' => $groupes,
        'profs'   => $profs,
    ]);
}
// Liste étudiants d'un groupe
public function etudiants($idGroupe)
{
    $groupe = Groupe::with(['niveau.langue', 'prof.user', 'emplois'])
        ->findOrFail($idGroupe);

    // Tous les étudiants (actifs + anciens)
    $inscriptions = DB::table('appartient')
        ->join('etudiants', 'appartient.idEtudiant', '=', 'etudiants.idEtudiant')
        ->join('utilisateurs', 'etudiants.idUser', '=', 'utilisateurs.idUser')
        ->where('appartient.idGroupe', $idGroupe)
        ->select(
            'appartient.idEtudiant',
            'appartient.statut as statutInscription',
            'appartient.dateInscription',
            'appartient.dateFin',
            'utilisateurs.nom',
            'utilisateurs.prenom',
            'utilisateurs.email',
            'utilisateurs.telephone',
            'etudiants.cin',
            'etudiants.actif',
        )
        ->orderBy('utilisateurs.nom')
        ->get();

    // Enrichir avec paiements et absences
    $etudiants = $inscriptions->map(function($i) use ($idGroupe) {
        $etudiant = Etudiant::find($i->idEtudiant);

        // Paiement de ce groupe
        $paiement = Paiement::with('avances')
            ->where('idEtudiant', $i->idEtudiant)
            ->where('idGroupe', $idGroupe)
            ->first();

        $montantPaye = $paiement?->avances->sum('montant') ?? 0;
        $reste       = $paiement ? ($paiement->montantTotal - $montantPaye) : 0;

        // Absences non justifiées
        $absences = \App\Models\Presence::where('idEtudiant', $i->idEtudiant)
            ->where('idGroupe', $idGroupe)
            ->where('estPresent', 0)
            ->where('estJustifie', 0)
            ->count();

        return [
            'id'                 => $i->idEtudiant,
            'nom'                => $i->nom,
            'prenom'             => $i->prenom,
            'email'              => $i->email,
            'telephone'          => $i->telephone,
            'cin'                => $i->cin,
            'actif'              => $i->actif,
            'statutInscription'  => $i->statutInscription,
            'dateInscription'    => $i->dateInscription,
            'dateFin'            => $i->dateFin,
            'paiement'           => $paiement ? [
                'id'           => $paiement->idPaiement,
                'montantTotal' => $paiement->montantTotal,
                'montantPaye'  => $montantPaye,
                'reste'        => $reste,
                'statut'       => $paiement->statut,
            ] : null,
            'absences' => $absences,
        ];
    });

    // Groupes du même niveau pour "changer groupe"
    $groupesMemeNiveau = Groupe::where('idNiveau', $groupe->idNiveau)
        ->where('idGroupe', '!=', $idGroupe)
        ->where('actif', 1)
        ->where('statut', 'en_cours')
        ->get()
        ->map(fn($g) => [
            'id'  => $g->idGroupe,
            'nom' => $g->nomGroupe,
        ]);

    // Niveau suivant
   // Après — tous les niveaux de la même langue sauf le niveau actuel
$niveauSuivant = \App\Models\Niveau::where('idLangue', $groupe->niveau->idLangue)
    ->where('idNiveau', '!=', $groupe->idNiveau)
    ->where('actif', 1)
    ->with(['groupes' => fn($q) => $q->where('actif', 1)->where('statut', 'en_cours')])
    ->orderBy('ordre')
    ->get()
    ->filter(fn($n) => $n->groupes->count() > 0)
    ->map(fn($n) => [
        'id'     => $n->idNiveau,
        'nom'    => $n->nomNiveau,
        'groupes'=> $n->groupes->map(fn($g) => [
            'id'  => $g->idGroupe,
            'nom' => $g->nomGroupe,
        ]),
    ])
    ->values();
    return Inertia::render('Directeur/Groupes/Etudiants', [
        'groupe' => [
            'id'      => $groupe->idGroupe,
            'nom'     => $groupe->nomGroupe,
            'langue'  => $groupe->niveau?->langue?->nomLangue,
            'niveau'  => $groupe->niveau?->nomNiveau,
            'idNiveau'=> $groupe->idNiveau,
            'capacite'=> $groupe->capacite,
            'prof'    => $groupe->prof?->user?->prenom . ' ' . $groupe->prof?->user?->nom,
            'emplois' => $groupe->emplois->map(fn($e) => [
                'jour'  => $e->jour,
                'debut' => $e->heureDebut,
                'fin'   => $e->heureFin,
                'salle' => $e->salle,
            ]),
        ],
        'etudiants'        => $etudiants,
        'groupesMemeNiveau'=> $groupesMemeNiveau,
        'niveauSuivant' => $niveauSuivant
         
    ]);
}
    // Créer groupe
    public function store(Request $request)
    {
        $request->validate([
            'nomGroupe' => 'required|string|max:100',
            'idNiveau'  => 'required|exists:niveaux,idNiveau',
            'idProf'    => 'required|exists:profs,idProf',
            'capacite'  => 'required|integer|min:1|max:50',
            'dateDebut' => 'required|date',
            'dateFin'   => 'nullable|date|after:dateDebut',
            'emplois'   => 'nullable|array',
            'emplois.*.jour'  => 'required|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi,Dimanche',
            'emplois.*.debut' => 'required',
            'emplois.*.fin'   => 'required',
            'emplois.*.salle' => 'nullable|string|max:50',
        ], [
            'nomGroupe.required' => 'Le nom du groupe est obligatoire.',
            'idNiveau.required'  => 'Le niveau est obligatoire.',
            'idProf.required'    => 'Le professeur est obligatoire.',
            'dateDebut.required' => 'La date de début est obligatoire.',
        ]);

        $groupe = Groupe::create([
            'nomGroupe' => $request->nomGroupe,
            'idNiveau'  => $request->idNiveau,
            'idProf'    => $request->idProf,
            'capacite'  => $request->capacite,
            'dateDebut' => $request->dateDebut,
            'dateFin'   => $request->dateFin,
            'statut'    => 'en_cours',
            'actif'     => 1,
        ]);

        if ($request->emplois) {
            foreach ($request->emplois as $e) {
                Emploi::create([
                    'idGroupe'   => $groupe->idGroupe,
                    'jour'       => $e['jour'],
                    'heureDebut' => $e['debut'],
                    'heureFin'   => $e['fin'],
                    'salle'      => $e['salle'] ?? null,
                ]);
            }
        }

        return back()->with('success', "Groupe {$groupe->nomGroupe} créé.");
    }

    // Changer statut
    public function updateStatut(Request $request, $id)
    {
        $request->validate(['statut' => 'required|in:en_cours,termine,suspendu']);
        Groupe::findOrFail($id)->update(['statut' => $request->statut]);
        return back()->with('success', 'Statut mis à jour.');
    }

    // Désactiver
    public function destroy($id)
    {
        Groupe::findOrFail($id)->update(['actif' => 0, 'statut' => 'termine']);
        return back()->with('success', 'Groupe désactivé.');
    }
    public function historiquePresences($id)
{
    $groupe = Groupe::with([
        'niveau.langue',
        'prof.user',
        'etudiantsActifs.user',
    ])->findOrFail($id);

    // Toutes les dates de séances enregistrées
    $dates = \App\Models\Presence::where('idGroupe', $id)
        ->select('dateSeance')
        ->distinct()
        ->orderBy('dateSeance')
        ->pluck('dateSeance');

    // Toutes les présences du groupe
    $presences = \App\Models\Presence::where('idGroupe', $id)
        ->get()
        ->groupBy('idEtudiant');

    $etudiants = $groupe->etudiantsActifs->map(fn($e) => [
        'id'     => $e->idEtudiant,
        'nom'    => $e->user->nom,
        'prenom' => $e->user->prenom,
        'presences' => $dates->mapWithKeys(fn($date) => [
            $date => $presences->get($e->idEtudiant)
                ?->firstWhere('dateSeance', $date)
                ? [
                    'present'     => $presences->get($e->idEtudiant)->firstWhere('dateSeance', $date)->estPresent,
                    'justifie'    => $presences->get($e->idEtudiant)->firstWhere('dateSeance', $date)->estJustifie,
                    'motif'       => $presences->get($e->idEtudiant)->firstWhere('dateSeance', $date)->motifJustif,
                    'idPresence'  => $presences->get($e->idEtudiant)->firstWhere('dateSeance', $date)->idPresence,
                ]
                : null,
        ]),
    ]);

    return Inertia::render('Directeur/Groupes/HistoriquePresences', [
        'groupe' => [
            'id'      => $groupe->idGroupe,
            'nom'     => $groupe->nomGroupe,
            'langue'  => $groupe->niveau?->langue?->nomLangue,
            'niveau'  => $groupe->niveau?->nomNiveau,
            'prof'    => $groupe->prof?->user?->prenom . ' ' . $groupe->prof?->user?->nom,
        ],
        'dates'     => $dates,
        'etudiants' => $etudiants,
    ]);
}
    
}