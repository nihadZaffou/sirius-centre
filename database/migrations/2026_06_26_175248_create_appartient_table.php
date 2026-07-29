<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appartient', function (Blueprint $table) {
            $table->unsignedBigInteger('idEtudiant');
            $table->unsignedBigInteger('idGroupe');
            $table->date('dateInscription');
            $table->date('dateFin')->nullable();
            $table->enum('statut', ['actif', 'termine', 'abandonne'])->default('actif');
            $table->primary(['idEtudiant', 'idGroupe']);
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onDelete('cascade');
            $table->foreign('idGroupe')->references('idGroupe')->on('groupes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appartient');
    }
};