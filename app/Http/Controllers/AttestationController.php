<?php

namespace App\Http\Controllers;

use App\Models\Attestation;
use App\Models\Etudiant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Mpdf\Mpdf;

class AttestationController extends Controller
{
    public function index()
    {
        $attestations = Attestation::with(['etudiant.user'])
            ->orderByDesc('dateDemande')
            ->get()
            ->map(fn($a) => [
                'id'       => $a->idAttestation,
                'langue'   => $a->langue,
                'niveau'   => $a->niveau,
                'statut'   => $a->statut,
                'date'     => $a->dateDemande,
                'etudiant' => [
                    'id'     => $a->etudiant->idEtudiant,
                    'nom'    => $a->etudiant->user->nom,
                    'prenom' => $a->etudiant->user->prenom,
                ],
            ]);

        $langues = collect(config('attestations'))->map(fn($l, $key) => [
            'code'    => $key,
            'label'   => ucfirst($key),
            'niveaux' => collect($l['niveaux'])->map(fn($n, $nkey) => [
                'code'  => $nkey,
                'label' => $n['label'],
            ])->values(),
        ])->values();

        return Inertia::render('Directeur/Attestations/Index', [
            'attestations' => $attestations,
            'langues'      => $langues,
        ]);
    }

  public function generer(Request $request)
{
    $request->validate([
        'idEtudiant' => 'required|exists:etudiants,idEtudiant',
        'langue'     => 'required|string',
        'niveau'     => 'required|string',
        'annee'      => 'required|string|max:20',
    ], [
        'idEtudiant.required' => 'Choisissez un étudiant.',
        'langue.required'     => 'Choisissez une langue.',
        'niveau.required'     => 'Choisissez un niveau.',
        'annee.required'      => 'L\'année scolaire est obligatoire.',
    ]);

    $config = config("attestations.{$request->langue}.niveaux.{$request->niveau}");
    if (!$config) {
        return response()->json(['message' => 'Niveau non trouvé.'], 404);
    }

    $etudiant = Etudiant::with('user')->findOrFail($request->idEtudiant);
    $texte    = str_replace('{{ANNEE}}', $request->annee, $config['texte']);

    $data = [
        'nom'           => $etudiant->user->prenom . ' ' . $etudiant->user->nom,
        'dateNaissance' => $etudiant->dateNaissance
            ? Carbon::parse($etudiant->dateNaissance)->format('d.m.Y')
            : '—',
        'ville'         => $etudiant->ville ?? '—',
        'texte'         => $texte,
        'bemerkungen'   => $config['bemerkungen'],
        'signataire'    => $config['signataire'],
        'type'          => $config['type'],
        'date'          => Carbon::now()->locale('fr')->isoFormat('D MMMM YYYY'),
    ];

    Attestation::updateOrCreate(
        [
            'idEtudiant' => $etudiant->idEtudiant,
            'langue'     => $request->langue,
            'niveau'     => $request->niveau,
        ],
        [
            'statut'      => 'validee',
            'dateDemande' => now(),
        ]
    );

    \App\Models\Log::enregistrer(
        'generation_attestation',
        "Attestation {$request->langue} {$config['label']} générée pour {$etudiant->user->prenom} {$etudiant->user->nom}"
    );

    // Générer HTML
    $html = view('attestations.allemand', $data)->render();

    // mPDF avec images positionnées nativement
    $mpdf = new Mpdf([
        'margin_left'   => 0,
        'margin_right'  => 0,
        'margin_top'    => 0,
        'margin_bottom' => 0,
        'format'        => 'A4',
        'default_font'  => 'dejavusans',
    ]);

    // Images de fond positionnées en mm sur la page A4 (210×297mm)
    $mpdf->Image(public_path('attestations/bg_fond.png'),    0,   0,   210, 297, 'png', '', true, false);
    $mpdf->Image(public_path('attestations/bg_gauche.png'),  0,   0,   55,  297, 'png', '', true, false);
    $mpdf->Image(public_path('attestations/bg_droite.png'),  165, 0,   45,  297, 'png', '', true, false);
    $mpdf->Image(public_path('attestations/bg_bas.png'),     0,   217, 55,  80,  'png', '', true, false);

    // Watermark centré
    $mpdf->SetWatermarkImage(public_path('attestations/bg_watermark.png'), 0.08, [90, 60]);
    $mpdf->showWatermarkImage = true;

    // Écrire le contenu HTML par-dessus
    $mpdf->WriteHTML($html);

    $hash     = substr(md5($etudiant->idEtudiant . now()->timestamp), 0, 8);
    $filename = "attestation_{$hash}.pdf";

    return response($mpdf->Output($filename, 'S'))
        ->header('Content-Type', 'application/pdf')
        ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
}

    public function destroy($id)
    {
        Attestation::findOrFail($id)->delete();
        return back()->with('success', 'Attestation supprimée.');
    }
}