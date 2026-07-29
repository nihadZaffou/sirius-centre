<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Avance extends Model
{
    protected $table      = 'avances';
    protected $primaryKey = 'idAvance';
    public    $timestamps = false;

    protected $fillable = ['montant', 'datePaiement', 'idPaiement', 'idDirecteur'];

    public function paiement()
    {
        return $this->belongsTo(Paiement::class, 'idPaiement', 'idPaiement');
    }

    public function directeur()
    {
        return $this->belongsTo(Directeur::class, 'idDirecteur', 'idDirecteur');
    }
}