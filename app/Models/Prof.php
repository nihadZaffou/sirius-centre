<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prof extends Model
{
    protected $table      = 'profs';
    protected $primaryKey = 'idProf';
    public    $timestamps = false;

    protected $fillable = ['idUser', 'specialite', 'actif'];

    public function user()
    {
        return $this->belongsTo(User::class, 'idUser', 'idUser');
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class, 'idProf', 'idProf');
    }
}