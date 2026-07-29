<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id('idLog');
            $table->string('action');
            $table->string('table_cible')->nullable();
            $table->unsignedBigInteger('idEnregistrement')->nullable();
            $table->unsignedBigInteger('idUser');
            $table->timestamp('dateAction')->useCurrent();
            $table->string('ipAddress', 45)->nullable();
            $table->foreign('idUser')->references('idUser')->on('utilisateurs')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logs');
    }
};