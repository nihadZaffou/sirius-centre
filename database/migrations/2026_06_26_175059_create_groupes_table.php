<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groupes', function (Blueprint $table) {
            $table->id('idGroupe');
            $table->string('nomGroupe');
            $table->integer('capacite')->default(15);
            $table->date('dateDebut')->nullable();
            $table->date('dateFin')->nullable();
            $table->enum('statut', ['en_cours', 'termine', 'suspendu'])->default('en_cours');
            $table->tinyInteger('actif')->default(1);
            $table->unsignedBigInteger('idNiveau');
            $table->unsignedBigInteger('idProf');
            $table->foreign('idNiveau')->references('idNiveau')->on('niveaux')->onDelete('restrict');
            $table->foreign('idProf')->references('idProf')->on('profs')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('groupes');
    }
};