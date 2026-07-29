<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Annonce extends Model
{
    protected $table      = 'annonces';
    protected $primaryKey = 'idAnnonce';
    public    $timestamps = false;

    protected $fillable = [
        'titre', 'message', 'type',
        'datePublication', 'idDirecteur',
    ];

    public function directeur()
    {
        return $this->belongsTo(Directeur::class, 'idDirecteur', 'idDirecteur');
    }

    public function groupes()
    {
        return $this->belongsToMany(
            Groupe::class,
            'annonce_groupe',
            'idAnnonce',
            'idGroupe'
        );
    }
}