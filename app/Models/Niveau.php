<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    protected $table      = 'niveaux';
    protected $primaryKey = 'idNiveau';
    public    $timestamps = false;

    protected $fillable = ['nomNiveau', 'idLangue', 'ordre', 'actif'];

    public function langue()
    {
        return $this->belongsTo(Langue::class, 'idLangue', 'idLangue');
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class, 'idNiveau', 'idNiveau');
    }

    public function scopeActifs($query)
    {
        return $query->where('actif', 1);
    }
}