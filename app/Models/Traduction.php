<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Traduction extends Model
{
    protected $table      = 'traductions';
    protected $primaryKey = 'idTraduction';
    public $timestamps    = false;

   protected $fillable = [
    'idEtudiant', 'idDirecteur', 'montant', 'statut', 'dateDemande',
    'nomExterne', 'prenomExterne', 'telephoneExterne',
];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'idEtudiant', 'idEtudiant');
    }
}