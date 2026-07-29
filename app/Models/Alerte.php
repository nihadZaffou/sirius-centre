<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alerte extends Model
{
    protected $table      = 'alertes';
    protected $primaryKey = 'idAlerte';
    public $timestamps    = false;

    protected $fillable = [
        'type', 'message', 'statut',
        'idEtudiant', 'idGroupe', 'dateCreation',
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'idEtudiant', 'idEtudiant');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'idGroupe', 'idGroupe');
    }
}