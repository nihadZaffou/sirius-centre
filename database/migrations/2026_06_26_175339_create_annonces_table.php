<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('annonces', function (Blueprint $table) {
            $table->id('idAnnonce');
            $table->string('titre');
            $table->text('message');
            $table->enum('type', [
                'absence_prof',
                'horaire',
                'examen',
                'fermeture',
                'nouveau_groupe',
                'autre'
            ]);
            $table->timestamp('datePublication')->useCurrent();
            $table->unsignedBigInteger('idDirecteur');
            $table->foreign('idDirecteur')->references('idDirecteur')->on('directeurs')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('annonces');
    }
};