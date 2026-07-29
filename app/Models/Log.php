<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $table      = 'logs';
    protected $primaryKey = 'idLog';
    public $timestamps    = false;

    protected $fillable = [
        'idUser', 'action', 'table_cible', 'idEnregistrement', 'dateAction', 'ipAddress',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'idUser', 'idUser');
    }

    public static function enregistrer(string $action, string $details)
    {
        try {
            static::create([
                'idUser'      => auth()->user()->idUser,
                'action'      => $action,
                'table_cible' => $details,
                'dateAction'  => now(),
                'ipAddress'   => request()->ip(),
            ]);
        } catch (\Exception $e) {
            // silencieux
        }
    }
}