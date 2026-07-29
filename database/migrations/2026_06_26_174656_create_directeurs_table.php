<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('directeurs', function (Blueprint $table) {
            $table->id('idDirecteur');
            $table->unsignedBigInteger('idUser');
            $table->enum('typeAcces', ['principal', 'secondaire']);
            $table->foreign('idUser')->references('idUser')->on('utilisateurs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('directeurs');
    }
};