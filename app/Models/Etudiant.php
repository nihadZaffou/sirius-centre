<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    protected $table      = 'etudiants';
    protected $primaryKey = 'idEtudiant';
    public    $timestamps = false;

protected $fillable = [
    'idUser', 'cin', 'adresse', 'ville',
    'nomParent', 'telParent', 'actif',
];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class, 'idUser', 'idUser');
    }

    public function groupes()
    {
        return $this->belongsToMany(
            Groupe::class,
            'appartient',
            'idEtudiant',
            'idGroupe'
        )->withPivot('dateInscription', 'dateFin', 'statut');
    }

    public function groupesActifs()
    {
        return $this->groupes()->wherePivot('statut', 'actif');
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'idEtudiant', 'idEtudiant');
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'idEtudiant', 'idEtudiant');
    }

    public function attestations()
    {
        return $this->hasMany(Attestation::class, 'idEtudiant', 'idEtudiant');
    }

    public function traductions()
    {
        return $this->hasMany(Traduction::class, 'idEtudiant', 'idEtudiant');
    }

    public function alertes()
    {
        return $this->hasMany(Alerte::class, 'idEtudiant', 'idEtudiant');
    }

    // Scopes
    public function scopeActifs($query)
    {
        return $query->where('etudiants.actif', 1);
    }

    // Helpers
    public function getNomCompletAttribute(): string
    {
        return $this->user->prenom . ' ' . $this->user->nom;
    }

    public function getAbsencesNonJustifieesAttribute(): int
    {
        return $this->presences()
            ->where('estPresent', 0)
            ->where('estJustifie', 0)
            ->count();
    }
    
}