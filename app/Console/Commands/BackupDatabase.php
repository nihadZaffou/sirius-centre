<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;

class BackupDatabase extends Command
{
    protected $signature   = 'backup:database';
    protected $description = 'Backup automatique de la base de données';

    public function handle()
    {
        $date     = Carbon::now()->format('Y-m-d_H-i-s');
        $filename = "backup_{$date}.sql";
        $path     = storage_path("backups/{$filename}");

        // Créer dossier si n'existe pas
        if (!file_exists(storage_path('backups'))) {
            mkdir(storage_path('backups'), 0755, true);
        }

        $host     = config('database.connections.mysql.host');
        $database = config('database.connections.mysql.database');
        $username = config('database.connections.mysql.username');
        $password = config('database.connections.mysql.password');

        $mysqldump = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
        $command = "\"{$mysqldump}\" -h {$host} -u {$username} -p{$password} {$database} > \"{$path}\"";
        exec($command, $output, $returnCode);
        exec($command, $output, $returnCode);

        if ($returnCode === 0) {
            $this->info("✅ Backup créé : {$filename}");
            $this->nettoyerAnciensBackups();
        } else {
            $this->error("❌ Erreur lors du backup");
        }
    }

    private function nettoyerAnciensBackups()
    {
        $files = glob(storage_path('backups/*.sql'));
        foreach ($files as $file) {
            if (filemtime($file) < strtotime('-30 days')) {
                unlink($file);
                $this->info("Supprimé : " . basename($file));
            }
        }
    }
}