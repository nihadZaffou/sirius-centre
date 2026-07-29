<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('utilisateurs', function (Blueprint $table) {
            $table->id('idUser');
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('motDePasse');
            $table->string('telephone')->nullable();
            $table->enum('role', ['directeur', 'prof', 'etudiant']);
            $table->tinyInteger('actif')->default(1);
            $table->timestamp('dateCreation')->useCurrent();
            $table->rememberToken();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('utilisateurs');
    }
};