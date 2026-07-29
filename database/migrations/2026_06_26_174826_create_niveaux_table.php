<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('niveaux', function (Blueprint $table) {
            $table->id('idNiveau');
            $table->string('nomNiveau');
            $table->unsignedBigInteger('idLangue');
            $table->integer('ordre');
            $table->tinyInteger('actif')->default(1);
            $table->foreign('idLangue')->references('idLangue')->on('langues')->onDelete('cascade');
            $table->unique(['nomNiveau', 'idLangue']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('niveaux');
    }
};