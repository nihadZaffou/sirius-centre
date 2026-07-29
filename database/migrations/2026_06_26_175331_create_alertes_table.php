<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alertes', function (Blueprint $table) {
            $table->id('idAlerte');
            $table->enum('type', ['paiement', 'absence']);
            $table->text('message');
            $table->enum('statut', ['active', 'traitee'])->default('active');
            $table->timestamp('dateCreation')->useCurrent();
            $table->dateTime('dateTraitement')->nullable();
            $table->unsignedBigInteger('idEtudiant');
            $table->unsignedBigInteger('idGroupe');
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onDelete('cascade');
            $table->foreign('idGroupe')->references('idGroupe')->on('groupes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alertes');
    }
};