<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Modèles d'attestations par langue et niveau
    |--------------------------------------------------------------------------
    | Structure :
    | 'code_langue' => [
    |     'niveaux' => [
    |         'code_niveau' => [
    |             'label'        => Nom affiché
    |             'type'         => 'simple' ou 'goethe'
    |             'signataire'   => Nom du signataire
    |             'texte'        => Texte principal (avec variables)
    |             'bemerkungen'  => Remarques (vide si aucune)
    |         ]
    |     ]
    | ]
    |
    | Variables disponibles dans les textes :
    | {{ANNEE}}   → Année scolaire (ex: 2025/2026)
    | {{NIVEAU}}  → Niveau (ex: A1, B2)
    */

    'allemand' => [
        'niveaux' => [

            'a1' => [
                'label'       => 'A1',
                'signataire'  => 'Der Schulleiter',
                'type'        => 'simple',   
                'texte'       => 'in unserer Sprachschule angemeldet ist und in der Zeit vom {{ANNEE}} regelmäßig die Niveaustufe A1"Deutschkurs für Studenten " besucht hat.',
                'bemerkungen' => '',
            ],

            'a1_2' => [
                'label'       => 'A1.2',
                'type'        => 'simple',
                'signataire'  => 'Der Schulleiter',
                'texte'       => 'in unserer Sprachschule angemeldet ist und in der Zeit vom {{ANNEE}} regelmäßig die Niveaustufe A1.2"Deutschkurs für Studenten " besucht hat.',
                'bemerkungen' => '',
            ],

            'a2' => [
                'label'       => 'A2',
                'type'        => 'simple',
                'signataire'  => 'Der Schulleiter',
                'texte'       => 'in unserer Sprachschule angemeldet ist und in der Zeit vom {{ANNEE}} regelmäßig die Niveaustufe A2"Deutschkurs für Studenten " besucht hat.',
                'bemerkungen' => '',
            ],

            'a2_plus' => [
                'label'       => 'A2+',
               'type'        => 'simple', 
                'signataire'  => 'Der Schulleiter',
                'texte'       => 'in unserer Sprachschule angemeldet ist und in der Zeit vom {{ANNEE}} regelmäßig die Niveaustufe A2+"Deutschkurs für Studenten " besucht hat.',
                'bemerkungen' => '',
            ],

            'b1_1' => [
                'label'       => 'B1/1',
                'type'        => 'goethe',  
                'signataire'  => 'PädagogischeLeitung',
                'texte'       => 'Im Schuljahr {{ANNEE}} regelmäßig und mit gutem Erfolg an einem Deutschkurs für Studenten/innen zur Vorbereitung des Goethe Zertifikats Deutsch B1/1 teilgenommen hat.',
                'bemerkungen' => 'Der Kurs bis zum Zertifikat B1 umfasst vier Niveaus: A1, A2, B1/1 und B1/2',
            ],

            'b1_2' => [
                'label'       => 'B1/2',
                'type'        => 'goethe',
                'signataire'  => 'PädagogischeLeitung',
                'texte'       => 'Im Schuljahr {{ANNEE}} regelmäßig und mit gutem Erfolg an einem Deutschkurs für Studenten/innen zur Vorbereitung des Goethe Zertifikats Deutsch B1/2 teilgenommen hat.',
                'bemerkungen' => 'Der Kurs bis zum Zertifikat B1 umfasst vier Niveaus: A1, A2, B1/1 und B1/2',
            ],

            'b2_1' => [
                'label'       => 'B2/1',
                'type'        => 'goethe',
                'signataire'  => 'PädagogischeLeitung',
                'texte'       => 'Im Schuljahr {{ANNEE}} regelmäßig und mit gutem Erfolg an einem Deutschkurs für Studenten/innen zur Vorbereitung des Goethe Zertifikats Deutsch B2/1 teilgenommen hat.',
                'bemerkungen' => 'Der Kurs bis zum Zertifikat B2 umfasst zwei Niveaus: B2/1 und B2/2',
            ],

            'b2_2' => [
                'label'       => 'B2/2',
                'type'        => 'goethe',
                'signataire'  => 'PädagogischeLeitung',
                'texte'       => 'Im Schuljahr {{ANNEE}} regelmäßig und mit gutem Erfolg an einem Deutschkurs für Studenten/innen zur Vorbereitung des Goethe Zertifikats Deutsch B2/2 teilgenommen hat.',
                'bemerkungen' => 'Der Kurs bis zum Zertifikat B2 umfasst zwei Niveaus: B2/1 und B2/2',
            ],

            'b2_complet' => [
                'label'       => 'B2 Complet',
                'type'        => 'goethe',
                'signataire'  => 'PädagogischeLeitung',
                'texte'       => 'Im Schuljahr {{ANNEE}} regelmäßig und mit gutem Erfolg an einem Deutschkurs für Studenten/innen zur Vorbereitung des Goethe Zertifikats Deutsch B2 teilgenommen hat.',
                'bemerkungen' => 'Der Kurs bis zum Zertifikat B2 umfasst zwei Niveaus: B2/1 und B2/2',
            ],

            'c1' => [
                'label'       => 'C1',
                'type'        => 'goethe',
                'signataire'  => 'PädagogischeLeitung',
                'texte'       => 'Im Schuljahr {{ANNEE}} regelmäßig und mit gutem Erfolg an einem Deutschkurs für Studenten/innen zur Vorbereitung des Goethe Zertifikats Deutsch C1 teilgenommen hat.',
                'bemerkungen' => '',
            ],
        ],
    ],

    // Ajouter d'autres langues ici facilement :
    // 'anglais' => [ 'niveaux' => [...] ],
    // 'espagnol' => [ 'niveaux' => [...] ],
];