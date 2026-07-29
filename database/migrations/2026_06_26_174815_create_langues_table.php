<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('langues', function (Blueprint $table) {
            $table->id('idLangue');
            $table->string('nomLangue')->unique();
            $table->tinyInteger('actif')->default(1);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('langues');
    }
};