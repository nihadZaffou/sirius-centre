<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('traductions', function (Blueprint $table) {
            $table->id('idTraduction');
            $table->date('dateDemande');
            $table->date('dateEnvoi')->nullable();
            $table->date('dateRetour')->nullable();
            $table->date('dateLimite')->nullable();
            $table->decimal('montant', 10, 2)->nullable();
            $table->enum('statut', [
                'demande',
                'en_attente',
                'approuve',
                'retour',
                'recupere'
            ])->default('demande');
            $table->unsignedBigInteger('idEtudiant');
            $table->unsignedBigInteger('idDirecteur');
            $table->dateTime('dateModif')->nullable();
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onDelete('restrict');
            $table->foreign('idDirecteur')->references('idDirecteur')->on('directeurs')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('traductions');
    }
};