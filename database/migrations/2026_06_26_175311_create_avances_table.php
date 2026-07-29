<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('avances', function (Blueprint $table) {
            $table->id('idAvance');
            $table->decimal('montant', 10, 2);
            $table->date('datePaiement');
            $table->unsignedBigInteger('idPaiement');
            $table->unsignedBigInteger('idDirecteur');
            $table->foreign('idPaiement')->references('idPaiement')->on('paiements')->onDelete('cascade');
            $table->foreign('idDirecteur')->references('idDirecteur')->on('directeurs')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avances');
    }
};