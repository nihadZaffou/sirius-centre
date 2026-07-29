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
    Schema::table('etudiants', function (Blueprint $table) {
        $table->date('dateNaissance')->nullable()->after('ville');
    });
}

public function down(): void
{
    Schema::table('etudiants', function (Blueprint $table) {
        $table->dropColumn('dateNaissance');
    });
}
};
