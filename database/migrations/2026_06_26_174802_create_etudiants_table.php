<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('etudiants', function (Blueprint $table) {
            $table->id('idEtudiant');
            $table->unsignedBigInteger('idUser');
            $table->string('cin')->unique()->nullable();
            $table->string('adresse')->nullable();
            $table->string('nomParent')->nullable();
            $table->string('telParent')->nullable();
            $table->tinyInteger('actif')->default(1);
            $table->foreign('idUser')->references('idUser')->on('utilisateurs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('etudiants');
    }
};