<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Directeur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DirecteurSecondaireSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'nom'        => 'ADMIN',
            'prenom'     => 'Secondaire',
            'email'      => 'admin2@sirius.ma',
            'motDePasse' => Hash::make('password123'),
            'telephone'  => '0600000000',
            'role'       => 'directeur',
            'actif'      => 1,
        ]);

        Directeur::create([
            'idUser'    => $user->idUser,
            'typeAcces' => 'secondaire',
        ]);
    }
}