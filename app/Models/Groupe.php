<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    protected $table      = 'groupes';
    protected $primaryKey = 'idGroupe';
    public    $timestamps = false;

    protected $fillable = [
        'nomGroupe', 'capacite', 'dateDebut', 'dateFin',
        'statut', 'actif', 'idNiveau', 'idProf',
    ];

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'idNiveau', 'idNiveau');
    }

    public function prof()
    {
        return $this->belongsTo(Prof::class, 'idProf', 'idProf');
    }

    public function etudiants()
    {
        return $this->belongsToMany(
            Etudiant::class,
            'appartient',
            'idGroupe',
            'idEtudiant'
        )->withPivot('dateInscription', 'dateFin', 'statut');
    }

    public function etudiantsActifs()
    {
        return $this->etudiants()->wherePivot('statut', 'actif');
    }

    public function emplois()
    {
        return $this->hasMany(Emploi::class, 'idGroupe', 'idGroupe');
    }

    public function scopeActifs($query)
    {
        return $query->where('statut', 'en_cours')->where('actif', 1);
    }
}