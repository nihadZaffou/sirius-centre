<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profs', function (Blueprint $table) {
            $table->id('idProf');
            $table->unsignedBigInteger('idUser');
            $table->string('specialite')->nullable();
            $table->foreign('idUser')->references('idUser')->on('utilisateurs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profs');
    }
};