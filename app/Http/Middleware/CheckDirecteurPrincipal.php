<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckDirecteurPrincipal
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'directeur') {
            abort(403);
        }

        $directeur = $user->directeur;

        if (!$directeur || $directeur->typeAcces !== 'principal') {
            abort(403, 'Accès réservé au directeur principal.');
        }

        return $next($request);
    }
}