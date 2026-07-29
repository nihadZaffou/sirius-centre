<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::table('attestations', function (Blueprint $table) {
        $table->string('langue', 50)->nullable()->after('idEtudiant');
        $table->string('niveau', 50)->nullable()->after('langue');
    });
}

public function down(): void
{
    Schema::table('attestations', function (Blueprint $table) {
        $table->dropColumn(['langue', 'niveau']);
    });
}
};
