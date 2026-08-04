<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\LangueController;
use App\Http\Controllers\GroupeController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\DirecteurProfController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\AppartientController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\AlerteController;
use App\Http\Controllers\TraductionController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\AttestationController;
use App\Http\Controllers\PresenceController;
use App\Http\Controllers\ProfController;
use Illuminate\Support\Facades\Route;

// ── PUBLIC ──
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
// ── PROFIL (tous les utilisateurs connectés) ──
Route::middleware(['auth', 'actif'])->group(function () {
    Route::get('/profil',                [App\Http\Controllers\ProfilController::class, 'index'])->name('profil.index');
    Route::put('/profil',                [App\Http\Controllers\ProfilController::class, 'update'])->name('profil.update');
    Route::put('/profil/password',       [App\Http\Controllers\ProfilController::class, 'updatePassword'])->name('profil.password');
});
Route::middleware(['auth', 'actif', 'role:directeur'])
    ->prefix('directeur')
    ->name('directeur.')
    ->group(function () {

    // Routes accessibles à TOUS les directeurs
    Route::get('/dashboard',             [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/attestations',          [AttestationController::class, 'index'])->name('attestations.index');
    Route::post('/attestations/generer', [AttestationController::class, 'generer'])->name('attestations.generer');
    Route::get('/attestations/preview', [AttestationController::class, 'preview'])->name('attestations.preview');
    Route::delete('/attestations/{id}',  [AttestationController::class, 'destroy'])->name('attestations.destroy');
    Route::get('/traductions',              [TraductionController::class, 'index'])->name('traductions.index');
    Route::post('/traductions',             [TraductionController::class, 'store'])->name('traductions.store');
    Route::patch('/traductions/{id}/statut',[TraductionController::class, 'updateStatut'])->name('traductions.statut');
    Route::delete('/traductions/{id}',      [TraductionController::class, 'destroy'])->name('traductions.destroy');
    Route::get('/inscription/data',      [InscriptionController::class, 'create'])->name('inscription.data');
    Route::get('/inscription/rechercher',[InscriptionController::class, 'rechercher'])->name('inscription.rechercher');
    Route::post('/inscription',          [InscriptionController::class, 'store'])->name('inscription.store');
Route::get('/certificate/{any?}', function () {
    return response()->file(public_path('certificate/index.html'), [
        'Access-Control-Allow-Origin' => '*',
    ]);
})->where('any', '.*');
    // Routes accessibles SEULEMENT au directeur principal
    Route::middleware('directeur.principal')->group(function () {
        Route::get('/langues',               [LangueController::class, 'index'])->name('langues.index');
        Route::post('/langues',              [LangueController::class, 'store'])->name('langues.store');
        Route::patch('/langues/{id}/toggle', [LangueController::class, 'toggleActif'])->name('langues.toggle');
        Route::get('/niveaux/{id}/groupes',  [GroupeController::class, 'parNiveau'])->name('niveaux.groupes');
        Route::post('/groupes',              [GroupeController::class, 'store'])->name('groupes.store');
        Route::patch('/groupes/{id}/statut', [GroupeController::class, 'updateStatut'])->name('groupes.statut');
        Route::delete('/groupes/{id}',       [GroupeController::class, 'destroy'])->name('groupes.destroy');
        Route::get('/groupes/{id}/etudiants',[GroupeController::class, 'etudiants'])->name('groupes.etudiants');
        Route::post('/groupes/{id}/ajouter', [InscriptionController::class, 'ajouterAuGroupe'])->name('groupes.ajouter');
        Route::get('/etudiants',               [EtudiantController::class, 'index'])->name('etudiants.index');
        Route::get('/etudiants/creer',         [EtudiantController::class, 'create'])->name('etudiants.create');
        Route::post('/etudiants',              [EtudiantController::class, 'store'])->name('etudiants.store');
        Route::get('/etudiants/{id}',          [EtudiantController::class, 'show'])->name('etudiants.fiche');
        Route::get('/etudiants/{id}/modifier', [EtudiantController::class, 'edit'])->name('etudiants.edit');
        Route::put('/etudiants/{id}',          [EtudiantController::class, 'update'])->name('etudiants.update');
        Route::delete('/etudiants/{id}',       [EtudiantController::class, 'destroy'])->name('etudiants.destroy');
        Route::post('/paiements/avance',       [PaiementController::class, 'ajouterAvance'])->name('paiements.avance');
        Route::patch('/paiements/{id}/solde',  [PaiementController::class, 'marquerSolde'])->name('paiements.solde');
        Route::post('/appartient/{id}/changer',        [AppartientController::class, 'changer'])->name('appartient.changer');
        Route::post('/appartient/{id}/niveau-suivant', [AppartientController::class, 'niveauSuivant'])->name('appartient.niveau-suivant');
        Route::patch('/appartient/{id}/statut',        [AppartientController::class, 'updateStatut'])->name('appartient.statut');
        Route::get('/profs',        [DirecteurProfController::class, 'index'])->name('profs.index');
        Route::post('/profs',       [DirecteurProfController::class, 'store'])->name('profs.store');
        Route::put('/profs/{id}',   [DirecteurProfController::class, 'update'])->name('profs.update');
        Route::delete('/profs/{id}',[DirecteurProfController::class, 'destroy'])->name('profs.destroy');
        Route::get('/annonces',                   [AnnonceController::class, 'index'])->name('annonces.index');
        Route::post('/annonces',                  [AnnonceController::class, 'store'])->name('annonces.store');
        Route::get('/annonces/{id}/destinataires',[AnnonceController::class, 'destinataires'])->name('annonces.destinataires');
        Route::delete('/annonces/{id}',           [AnnonceController::class, 'destroy'])->name('annonces.destroy');
        Route::get('/alertes',                [AlerteController::class, 'index'])->name('alertes.index');
        Route::patch('/alertes/{id}/resoudre',[AlerteController::class, 'resoudre'])->name('alertes.resoudre');
        Route::get('/logs',                   [LogController::class, 'index'])->name('logs.index');
        Route::patch('/presences/{id}/justifier', [PresenceController::class, 'justifier'])->name('presences.justifier');
       // Archives
        Route::get('/archives',  [App\Http\Controllers\ArchiveController::class, 'index'])->name('archives.index');
        Route::post('/archives/archiver', [App\Http\Controllers\ArchiveController::class, 'archiver'])->name('archives.archiver');
        Route::patch('/archives/reactiver/{id}', [App\Http\Controllers\ArchiveController::class, 'reactiver'])->name('archives.reactiver');
        Route::get('/groupes/{id}/presences-historique', [App\Http\Controllers\GroupeController::class, 'historiquePresences'])->name('groupes.presences-historique');
    });

});

// ── PROF ──
Route::middleware(['auth', 'actif', 'role:prof'])
    ->prefix('prof')
    ->name('prof.')
    ->group(function () {
        Route::get('/dashboard',             [ProfController::class, 'dashboard'])->name('dashboard');
        Route::get('/groupes',               [ProfController::class, 'groupes'])->name('groupes.index');
        Route::get('/presences/{idGroupe}',  [PresenceController::class, 'index'])->name('presences.index');
        Route::post('/presences/{idGroupe}', [PresenceController::class, 'marquer'])->name('presences.marquer');
    });


// ── ROOT ──
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