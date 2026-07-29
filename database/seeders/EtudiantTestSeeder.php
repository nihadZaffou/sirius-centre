<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EtudiantTestSeeder extends Seeder
{
    public function run(): void
    {
        $etudiants = [
            ['nom' => 'BENALI',   'prenom' => 'Mohammed', 'email' => 'mohammed@test.ma', 'cin' => 'AB123456', 'tel' => '0612345678'],
            ['nom' => 'ALAOUI',   'prenom' => 'Fatima',   'email' => 'fatima@test.ma',   'cin' => 'CD789012', 'tel' => '0623456789'],
            ['nom' => 'CHAKIR',   'prenom' => 'Youssef',  'email' => 'youssef@test.ma',  'cin' => 'EF345678', 'tel' => '0634567890'],
            ['nom' => 'MANSOURI', 'prenom' => 'Aicha',    'email' => 'aicha@test.ma',    'cin' => 'GH901234', 'tel' => '0645678901'],
            ['nom' => 'IDRISSI',  'prenom' => 'Omar',     'email' => 'omar@test.ma',     'cin' => 'IJ567890', 'tel' => '0656789012'],
        ];

        foreach ($etudiants as $e) {
            $idUser = DB::table('utilisateurs')->insertGetId([
                'nom'         => $e['nom'],
                'prenom'      => $e['prenom'],
                'email'       => $e['email'],
                'motDePasse'  => Hash::make('sirius123'),
                'telephone'   => $e['tel'],
                'role'        => 'etudiant',
                'actif'       => 1,
                'dateCreation' => now(),
            ]);

            DB::table('etudiants')->insert([
                'idUser'    => $idUser,
                'cin'       => $e['cin'],
                'adresse'   => 'Fès, Maroc',
                'nomParent' => 'Parent ' . $e['nom'],
                'telParent' => '0600000000',
                'actif'     => 1,
            ]);
        }
    }
}