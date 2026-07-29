<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Emploi extends Model
{
    protected $table      = 'emplois';
    protected $primaryKey = 'idEmploi';
    public    $timestamps = false;

    protected $fillable = ['jour', 'heureDebut', 'heureFin', 'salle', 'idGroupe'];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'idGroupe', 'idGroupe');
    }
}