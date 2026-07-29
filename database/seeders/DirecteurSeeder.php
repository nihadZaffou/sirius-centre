<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DirecteurSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Créer l'utilisateur
        $idUser = DB::table('utilisateurs')->insertGetId([
            'nom'         => 'Admin',
            'prenom'      => 'Sirius',
            'email'       => 'admin@sirius.ma',
            'motDePasse'  => Hash::make('password123'),
            'telephone'   => '0600000000',
            'role'        => 'directeur',
            'actif'       => 1,
            'dateCreation' => now(),
        ]);

        // 2. Créer le directeur principal
        DB::table('directeurs')->insert([
            'idUser'     => $idUser,
            'typeAcces'  => 'principal',
        ]);
    }
}