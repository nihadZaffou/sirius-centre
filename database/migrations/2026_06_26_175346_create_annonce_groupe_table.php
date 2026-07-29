<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('annonce_groupe', function (Blueprint $table) {
            $table->unsignedBigInteger('idAnnonce');
            $table->unsignedBigInteger('idGroupe');
            $table->primary(['idAnnonce', 'idGroupe']);
            $table->foreign('idAnnonce')->references('idAnnonce')->on('annonces')->onDelete('cascade');
            $table->foreign('idGroupe')->references('idGroupe')->on('groupes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('annonce_groupe');
    }
};