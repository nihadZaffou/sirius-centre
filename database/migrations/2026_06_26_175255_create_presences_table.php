<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presences', function (Blueprint $table) {
            $table->id('idPresence');
            $table->date('dateSeance');
            $table->tinyInteger('estPresent')->default(0);
            $table->tinyInteger('estJustifie')->default(0);
            $table->string('motifJustif', 255)->nullable();
            $table->dateTime('dateModif')->nullable();
            $table->unsignedBigInteger('modifiePar')->nullable();
            $table->unsignedBigInteger('idEtudiant');
            $table->unsignedBigInteger('idGroupe');
            $table->unsignedBigInteger('idProf');
            $table->unique(['dateSeance', 'idGroupe', 'idEtudiant'], 'unique_presence');
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onDelete('cascade');
            $table->foreign('idGroupe')->references('idGroupe')->on('groupes')->onDelete('cascade');
            $table->foreign('idProf')->references('idProf')->on('profs')->onDelete('restrict');
            $table->foreign('modifiePar')->references('idProf')->on('profs')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presences');
    }
};