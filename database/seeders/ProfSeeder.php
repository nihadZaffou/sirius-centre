<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Prof;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ProfSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'nom'        => 'ZAFFOU',
            'prenom'     => 'Nihad',
            'email'      => 'prof@sirius.ma',
            'motDePasse' => Hash::make('password123'),
            'telephone'  => '0670247663',
            'role'       => 'prof',
            'actif'      => 1,
        ]);

        Prof::create([
            'idUser'     => $user->idUser,
            'specialite' => 'Allemand',
            'actif'      => 1,
        ]);
    }
}