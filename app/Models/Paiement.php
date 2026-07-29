<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $table      = 'paiements';
    protected $primaryKey = 'idPaiement';
    public    $timestamps = false;

    protected $fillable = [
        'montantTotal', 'statut',
        'idEtudiant', 'idNiveau', 'idGroupe', 'idDirecteur',
        'dateCreation',
    ];

    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class, 'idEtudiant', 'idEtudiant');
    }

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'idNiveau', 'idNiveau');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class, 'idGroupe', 'idGroupe');
    }

    public function directeur()
    {
        return $this->belongsTo(Directeur::class, 'idDirecteur', 'idDirecteur');
    }

    public function avances()
    {
        return $this->hasMany(Avance::class, 'idPaiement', 'idPaiement');
    }

    public function getMontantPayeAttribute(): float
    {
        return $this->avances()->sum('montant');
    }

    public function getResteAttribute(): float
    {
        return $this->montantTotal - $this->montant_paye;
    }
}