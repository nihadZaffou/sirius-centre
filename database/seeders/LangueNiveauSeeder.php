<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LangueNiveauSeeder extends Seeder
{
    public function run(): void
    {
        $langues = [
            'Allemand',
            'Anglais',
            'Espagnol',
            'Français',
            'Hollandais',
            'Arabe',
            'Turc',
            'Chinois',
        ];

        $niveaux = [
            ['nom' => 'A1',  'ordre' => 1],
            ['nom' => 'A1.2','ordre' => 2],
            ['nom' => 'A2',  'ordre' => 3],
            ['nom' => 'A2+', 'ordre' => 4],
            ['nom' => 'B1.1','ordre' => 5],
            ['nom' => 'B1.2','ordre' => 6],
            ['nom' => 'B2.1','ordre' => 7],
            ['nom' => 'B2.2','ordre' => 8],
            ['nom' => 'C1',  'ordre' => 9],
        ];

        foreach ($langues as $nomLangue) {
            $idLangue = DB::table('langues')->insertGetId([
                'nomLangue' => $nomLangue,
                'actif'     => 1,
            ]);

            foreach ($niveaux as $niveau) {
                DB::table('niveaux')->insert([
                    'nomNiveau' => $niveau['nom'],
                    'idLangue'  => $idLangue,
                    'ordre'     => $niveau['ordre'],
                    'actif'     => 1,
                ]);
            }
        }
    }
}