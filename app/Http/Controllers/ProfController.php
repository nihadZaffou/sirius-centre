<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use App\Models\Prof;
use Carbon\Carbon;
use Inertia\Inertia;

class ProfController extends Controller
{
private function getProf()
{
    $idUser = auth()->user()->idUser;
    return \App\Models\Prof::where('idUser', $idUser)->first();
}

    public function dashboard()
    {
        
        $prof = $this->getProf();
        \Illuminate\Support\Facades\Log::info('Prof dashboard', [
    'idUser' => auth()->user()->idUser,
    'prof'   => $prof?->idProf,
    'groupes_count' => $prof ? \App\Models\Groupe::where('idProf', $prof->idProf)->count() : 0,
]);
        if (!$prof) {
            return Inertia::render('Prof/Dashboard', [
                'groupes'           => [],
                'seancesAujourdhui' => [],
                'stats'             => ['groupes' => 0, 'etudiants' => 0, 'seances' => 0],
            ]);
        }

        $jourFr = [
            'Monday'    => 'Lundi',
            'Tuesday'   => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday'  => 'Jeudi',
            'Friday'    => 'Vendredi',
            'Saturday'  => 'Samedi',
            'Sunday'    => 'Dimanche',
        ];
        $jourAujourdhui = $jourFr[Carbon::now()->format('l')];
$groupes = Groupe::where('idProf', $prof->idProf)
    ->where('actif', 1)
    ->where('statut', 'en_cours')
    ->with(['niveau.langue', 'emplois', 'etudiantsActifs'])
    ->get()
    ->map(fn($g) => [
        'id'         => $g->idGroupe,
        'nom'        => $g->nomGroupe,
        'langue'     => $g->niveau?->langue?->nomLangue,
        'niveau'     => $g->niveau?->nomNiveau,
        'inscrits'   => $g->etudiantsActifs->count(),
        'emplois'    => $g->emplois->map(fn($e) => [
            'jour'  => $e->jour,
            'debut' => $e->heureDebut,
            'fin'   => $e->heureFin,
            'salle' => $e->salle,
        ]),
        'aujourdhui' => $g->emplois->contains('jour', $jourAujourdhui),
        'heureDebut' => $g->emplois
            ->where('jour', $jourAujourdhui)
            ->first()?->heureDebut,
    ]);

       $seancesAujourdhui = $groupes
    ->filter(fn($g) => $g['aujourdhui'])
    ->sortBy(fn($g) => $g['emplois']
        ->filter(fn($e) => $e['jour'] === $jourAujourdhui)
        ->first()['debut'] ?? '99:99'
    )
    ->values();

        return Inertia::render('Prof/Dashboard', [
            'groupes'           => $groupes,
            'seancesAujourdhui' => $seancesAujourdhui,
            'stats'             => [
                'groupes'   => $groupes->count(),
                'etudiants' => $groupes->sum('inscrits'),
                'seances'   => $seancesAujourdhui->count(),
            ],
        ]);
    }

    public function groupes()
    {
        $prof = $this->getProf();

        if (!$prof) {
            return Inertia::render('Prof/Groupes', ['groupes' => []]);
        }

        $groupes = Groupe::where('idProf', $prof->idProf)
            ->where('actif', 1)
            ->with(['niveau.langue', 'emplois', 'etudiantsActifs'])
            ->get()
            ->map(fn($g) => [
                'id'       => $g->idGroupe,
                'nom'      => $g->nomGroupe,
                'langue'   => $g->niveau?->langue?->nomLangue,
                'niveau'   => $g->niveau?->nomNiveau,
                'statut'   => $g->statut,
                'inscrits' => $g->etudiantsActifs->count(),
                'capacite' => $g->capacite,
                'emplois'  => $g->emplois->map(fn($e) => [
                    'jour'  => $e->jour,
                    'debut' => $e->heureDebut,
                    'fin'   => $e->heureFin,
                    'salle' => $e->salle,
                ]),
                
            ]);

        return Inertia::render('Prof/Groupes', [
            'groupes' => $groupes,
        ]);
    }
}