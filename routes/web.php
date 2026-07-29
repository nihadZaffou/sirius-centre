<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\LangueController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\DirecteurProfController;
use App\Http\Controllers\InscriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');
Route::get('/deconnexion', function () {
    auth()->logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect()->route('login');
})->middleware('auth');

Route::middleware(['auth', 'actif', 'role:directeur'])
    ->prefix('directeur')
    ->name('directeur.')
    ->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Langues
    Route::get('/langues',               [LangueController::class, 'index'])->name('langues.index');
    Route::post('/langues',              [LangueController::class, 'store'])->name('langues.store');
    Route::patch('/langues/{id}/toggle', [LangueController::class, 'toggleActif'])->name('langues.toggle');

    // Niveaux → Groupes
    Route::get('/niveaux/{id}/groupes',  [GroupeController::class, 'parNiveau'])->name('niveaux.groupes');

    // Groupes
    Route::post('/groupes',              [GroupeController::class, 'store'])->name('groupes.store');
    Route::patch('/groupes/{id}/statut', [GroupeController::class, 'updateStatut'])->name('groupes.statut');
    Route::delete('/groupes/{id}',       [GroupeController::class, 'destroy'])->name('groupes.destroy');

    // Étudiants
    Route::get('/etudiants',               [EtudiantController::class, 'index'])->name('etudiants.index');
    Route::get('/etudiants/creer',         [EtudiantController::class, 'create'])->name('etudiants.create');
    Route::post('/etudiants',              [EtudiantController::class, 'store'])->name('etudiants.store');
    Route::get('/etudiants/{id}',          [EtudiantController::class, 'show'])->name('etudiants.fiche');
    Route::get('/etudiants/{id}/modifier', [EtudiantController::class, 'edit'])->name('etudiants.edit');
    Route::put('/etudiants/{id}',          [EtudiantController::class, 'update'])->name('etudiants.update');
    Route::delete('/etudiants/{id}',       [EtudiantController::class, 'destroy'])->name('etudiants.destroy');

    // Paiements
    Route::post('/paiements/avance', [PaiementController::class, 'ajouterAvance'])->name('paiements.avance');

    // Pages simples
    Route::get('/attestations', fn() => inertia('Directeur/Attestations/Index'))->name('attestations.index');
    Route::get('/alertes',      fn() => inertia('Directeur/Alertes/Index'))->name('alertes.index');
    Route::get('/annonces',     fn() => inertia('Directeur/Annonces/Index'))->name('annonces.index');
    Route::get('/traductions',  fn() => inertia('Directeur/Traductions/Index'))->name('traductions.index');
    Route::get('/logs',         fn() => inertia('Directeur/Logs/Index'))->name('logs.index');
    Route::patch('/presences/{id}/justifier', [App\Http\Controllers\PresenceController::class, 'justifier'])->name('presences.justifier');
    // Profs
Route::get('/profs',        [App\Http\Controllers\ProfController::class, 'index'])->name('profs.index');
Route::post('/profs',       [App\Http\Controllers\ProfController::class, 'store'])->name('profs.store');
Route::put('/profs/{id}',   [App\Http\Controllers\ProfController::class, 'update'])->name('profs.update');
Route::delete('/profs/{id}',[App\Http\Controllers\ProfController::class, 'destroy'])->name('profs.destroy');
// Groupe → étudiants
Route::get('/groupes/{id}/etudiants',           [App\Http\Controllers\GroupeController::class, 'etudiants'])->name('groupes.etudiants');
Route::post('/groupes/{id}/ajouter',            [App\Http\Controllers\InscriptionController::class, 'ajouterAuGroupe'])->name('groupes.ajouter');

// Appartient
Route::post('/appartient/{id}/changer',         [App\Http\Controllers\AppartientController::class, 'changer'])->name('appartient.changer');
Route::post('/appartient/{id}/niveau-suivant',  [App\Http\Controllers\AppartientController::class, 'niveauSuivant'])->name('appartient.niveau-suivant');
Route::patch('/appartient/{id}/statut',         [App\Http\Controllers\AppartientController::class, 'updateStatut'])->name('appartient.statut');

// Inscription dashboard
Route::get('/inscription/data',                 [App\Http\Controllers\InscriptionController::class, 'create'])->name('inscription.data');
Route::get('/inscription/rechercher', [App\Http\Controllers\InscriptionController::class, 'rechercher'])->name('inscription.rechercher');
Route::post('/inscription',                     [App\Http\Controllers\InscriptionController::class, 'store'])->name('inscription.store');
Route::patch('/paiements/{id}/solde', [App\Http\Controllers\PaiementController::class, 'marquerSolde'])->name('paiements.solde');
Route::patch('/paiements/{id}/solde', [App\Http\Controllers\PaiementController::class, 'marquerSolde'])->name('paiements.solde');
// Annonces
Route::get('/annonces',                  [App\Http\Controllers\AnnonceController::class, 'index'])->name('annonces.index');
Route::post('/annonces',                 [App\Http\Controllers\AnnonceController::class, 'store'])->name('annonces.store');
Route::get('/annonces/{id}/destinataires',[App\Http\Controllers\AnnonceController::class, 'destinataires'])->name('annonces.destinataires');
Route::delete('/annonces/{id}',          [App\Http\Controllers\AnnonceController::class, 'destroy'])->name('annonces.destroy');
Route::get('/alertes',          [App\Http\Controllers\AlerteController::class, 'index'])->name('alertes.index');
Route::patch('/alertes/{id}/resoudre', [App\Http\Controllers\AlerteController::class, 'resoudre'])->name('alertes.resoudre');
Route::get('/traductions',              [App\Http\Controllers\TraductionController::class, 'index'])->name('traductions.index');
Route::post('/traductions',             [App\Http\Controllers\TraductionController::class, 'store'])->name('traductions.store');
Route::patch('/traductions/{id}/statut',[App\Http\Controllers\TraductionController::class, 'updateStatut'])->name('traductions.statut');
Route::delete('/traductions/{id}',      [App\Http\Controllers\TraductionController::class, 'destroy'])->name('traductions.destroy');
Route::get('/logs', [App\Http\Controllers\LogController::class, 'index'])->name('logs.index');
// Attestations
Route::get('/attestations',              [App\Http\Controllers\AttestationController::class, 'index'])->name('attestations.index');
Route::post('/attestations/generer',     [App\Http\Controllers\AttestationController::class, 'generer'])->name('attestations.generer');
Route::delete('/attestations/{id}',      [App\Http\Controllers\AttestationController::class, 'destroy'])->name('attestations.destroy');
Route::get('/profs',     [App\Http\Controllers\DirecteurProfController::class, 'index'])->name('profs.index');
Route::post('/profs',    [App\Http\Controllers\DirecteurProfController::class, 'store'])->name('profs.store');
Route::put('/profs/{id}',[App\Http\Controllers\DirecteurProfController::class, 'update'])->name('profs.update');
Route::delete('/profs/{id}',[App\Http\Controllers\DirecteurProfController::class, 'destroy'])->name('profs.destroy');

});
Route::get('/debug-prof', function() {
    $user = auth()->user();
    $prof = $user->prof;
    return response()->json([
        'idUser'     => $user->idUser,
        'email'      => $user->email,
        'prof'       => $prof,
        'prof_count' => \App\Models\Prof::count(),
        'all_profs'  => \App\Models\Prof::all(),
    ]);
})->middleware('auth');
// ── PROF ──
Route::middleware(['auth', 'actif', 'role:prof'])
    ->prefix('prof')
    ->name('prof.')
    ->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\ProfController::class, 'dashboard'])->name('dashboard');
        Route::get('/groupes',   [App\Http\Controllers\ProfController::class, 'groupes'])->name('groupes.index');
        Route::get('/presences/{idGroupe}',  [App\Http\Controllers\PresenceController::class, 'index'])->name('presences.index');
        Route::post('/presences/{idGroupe}', [App\Http\Controllers\PresenceController::class, 'marquer'])->name('presences.marquer');
    });

// ── REDIRECT ROOT ──
Route::get('/', function () {
    if (auth()->check()) {
        return match(auth()->user()->role) {
            'directeur' => redirect()->route('directeur.dashboard'),
            'prof'      => redirect()->route('prof.dashboard'),
            default     => redirect()->route('login'),
        };
    }
    return redirect()->route('login');
});

// ── 404 ──
Route::fallback(function () {
    return inertia('Errors/404');
});