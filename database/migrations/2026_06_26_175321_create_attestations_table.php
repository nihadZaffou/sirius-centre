<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attestations', function (Blueprint $table) {
            $table->id('idAttestation');
            $table->date('dateDemande');
            $table->date('dateGeneration')->nullable();
            $table->enum('statut', ['en_attente', 'validee', 'refusee'])->default('en_attente');
            $table->string('fichierPDF', 255)->nullable();
            $table->unsignedBigInteger('idEtudiant');
            $table->unsignedBigInteger('idNiveau');
            $table->unsignedBigInteger('idDirecteur')->nullable();
            $table->unique(['idEtudiant', 'idNiveau'], 'unique_attestation');
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onDelete('cascade');
            $table->foreign('idNiveau')->references('idNiveau')->on('niveaux')->onDelete('restrict');
            $table->foreign('idDirecteur')->references('idDirecteur')->on('directeurs')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attestations');
    }
};