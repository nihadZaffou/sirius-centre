<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Directeur extends Model
{
    protected $table      = 'directeurs';
    protected $primaryKey = 'idDirecteur';
    public    $timestamps = false;

    protected $fillable = ['idUser', 'typeAcces'];

    public function user()
    {
        return $this->belongsTo(User::class, 'idUser', 'idUser');
    }
}