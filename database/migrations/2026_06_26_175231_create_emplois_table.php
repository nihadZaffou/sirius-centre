<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emplois', function (Blueprint $table) {
            $table->id('idEmploi');
            $table->enum('jour', ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
            $table->time('heureDebut');
            $table->time('heureFin');
            $table->string('salle')->nullable();
            $table->unsignedBigInteger('idGroupe');
            $table->foreign('idGroupe')->references('idGroupe')->on('groupes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emplois');
    }
};