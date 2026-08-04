<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attestation extends Model
{
    protected $table      = 'attestations';
    protected $primaryKey = 'idAttestation';
    public $timestamps    = false;

   protected $fillable = [
    'idEtudiant', 'idNiveau', 'langue', 'niveau', 'statut', 'dateDemande',
];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'idEtudiant', 'idEtudiant');
    }
}