<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\AlerteController;

class GenererAlertes extends Command
{
    protected $signature   = 'alertes:generer';
    protected $description = 'Générer les alertes pour les séances dans 3h';

    public function handle()
    {
        AlerteController::genererAlertes();
        $this->info('Alertes générées avec succès.');
    }
}