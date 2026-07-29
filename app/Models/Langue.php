<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Langue extends Model
{
    protected $table      = 'langues';
    protected $primaryKey = 'idLangue';
    public    $timestamps = false;

    protected $fillable = ['nomLangue', 'actif'];

    public function niveaux()
    {
        return $this->hasMany(Niveau::class, 'idLangue', 'idLangue')
                    ->orderBy('ordre');
    }

    public function scopeActives($query)
    {
        return $query->where('actif', 1);
    }
}