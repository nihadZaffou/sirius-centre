<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index()
    {
        $logs = Log::with('user')
            ->orderByDesc('dateAction')
            ->paginate(50)
            ->through(fn($l) => [
                'id'      => $l->idLog,
                'action'  => $l->action,
                'details' => $l->table_cible,
                'date'    => $l->dateAction,
                'ip'      => $l->ipAddress,
                'user'    => $l->user ? $l->user->prenom . ' ' . $l->user->nom : '—',
                'role'    => $l->user?->role,
            ]);

        return Inertia::render('Directeur/Logs/Index', [
            'logs' => $logs,
        ]);
    }
}