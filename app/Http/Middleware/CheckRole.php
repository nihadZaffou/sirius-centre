<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Pas connecté
        if (!$user) {
            return redirect()->route('login');
        }

        // Compte désactivé
        if (!$user->actif) {
            auth()->logout();
            return redirect()->route('login')->withErrors([
                'email' => 'Votre compte a été désactivé.'
            ]);
        }

        // Rôle non autorisé
        if (!in_array($user->role, $roles)) {
            abort(403, 'Accès non autorisé.');
        }

        return $next($request);
    }
}