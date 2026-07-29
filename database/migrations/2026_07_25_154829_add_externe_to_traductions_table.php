<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('traductions', function (Blueprint $table) {
            $table->string('nomExterne', 100)->nullable()->after('idEtudiant');
            $table->string('prenomExterne', 100)->nullable()->after('nomExterne');
            $table->string('telephoneExterne', 20)->nullable()->after('prenomExterne');
        });
    }

    public function down(): void
    {
        Schema::table('traductions', function (Blueprint $table) {
            $table->dropColumn(['nomExterne', 'prenomExterne', 'telephoneExterne']);
        });
    }
};