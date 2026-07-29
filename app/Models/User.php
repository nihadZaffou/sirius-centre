<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table      = 'utilisateurs';
    protected $primaryKey = 'idUser';
    public    $timestamps = false;

    protected $fillable = [
        'nom', 'prenom', 'email', 'motDePasse',
        'telephone', 'role', 'actif',
    ];

    protected $hidden = ['motDePasse', 'remember_token'];

    protected function casts(): array
    {
        return ['motDePasse' => 'hashed'];
    }

    public function getAuthPassword()
    {
        return $this->motDePasse;
    }

    // Relations
    public function directeur()
    {
        return $this->hasOne(Directeur::class, 'idUser', 'idUser');
    }

    public function prof()
    {
        return $this->hasOne(Prof::class, 'idUser', 'idUser');
    }

    public function etudiant()
    {
        return $this->hasOne(Etudiant::class, 'idUser', 'idUser');
    }

    // Helpers
    public function isDirecteurPrincipal(): bool
    {
        return $this->role === 'directeur' && $this->directeur?->typeAcces === 'principal';
    }

    public function isDirecteurSecondaire(): bool
    {
        return $this->role === 'directeur' && $this->directeur?->typeAcces === 'secondaire';
    }
}