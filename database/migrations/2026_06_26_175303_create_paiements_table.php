<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id('idPaiement');
            $table->decimal('montantTotal', 10, 2);
            $table->enum('statut', ['en_cours', 'solde'])->default('en_cours');
            $table->unsignedBigInteger('idEtudiant');
            $table->unsignedBigInteger('idNiveau');
            $table->unsignedBigInteger('idGroupe');
            $table->unsignedBigInteger('idDirecteur');
            $table->timestamp('dateCreation')->useCurrent();
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onDelete('restrict');
            $table->foreign('idNiveau')->references('idNiveau')->on('niveaux')->onDelete('restrict');
            $table->foreign('idGroupe')->references('idGroupe')->on('groupes')->onDelete('restrict');
            $table->foreign('idDirecteur')->references('idDirecteur')->on('directeurs')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};