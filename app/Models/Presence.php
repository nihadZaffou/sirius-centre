<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    protected $table      = 'presences';
    protected $primaryKey = 'idPresence';
    public    $timestamps = false;

  protected $fillable = [
    'idEtudiant', 'idGroupe', 'idProf', 'dateSeance', 'estPresent', 'estJustifie', 'motifJustif'
];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'idEtudiant', 'idEtudiant');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'idGroupe', 'idGroupe');
    }

    public function prof()
    {
        return $this->belongsTo(Prof::class, 'idProf', 'idProf');
    }

    public function modificateur()
    {
        return $this->belongsTo(Prof::class, 'modifiePar', 'idProf');
    }
}