<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Etudiant;
use App\Models\Groupe;
use App\Models\Niveau;
use App\Models\Langue;
use App\Models\Emploi;
use App\Models\Appartient;
use App\Models\Paiement;
use App\Models\Avance;
use App\Models\Presence;
use App\Models\Traduction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DonneesRealistesSeeder extends Seeder
{
    public function run(): void
    {
        // Récupérer langue allemand et niveaux
        $langue = Langue::where('nomLangue', 'Allemand')->first();
        if (!$langue) {
            $this->command->error('Langue Allemand non trouvée — lancez LangueNiveauSeeder d\'abord');
            return;
        }

        $niveauA1  = Niveau::where('idLangue', $langue->idLangue)->where('nomNiveau', 'A1')->first();
        $niveauA2  = Niveau::where('idLangue', $langue->idLangue)->where('nomNiveau', 'A2')->first();
        $niveauB1  = Niveau::where('idLangue', $langue->idLangue)->where('nomNiveau', 'B1.1')->first();

        if (!$niveauA1 || !$niveauA2) {
            $this->command->error('Niveaux non trouvés');
            return;
        }

        // Récupérer le prof
        $prof = \App\Models\Prof::first();

        // ── GROUPES ──
        $groupeA1 = Groupe::create([
            'nomGroupe' => 'Allemand A1 - Matin',
            'capacite'  => 12,
            'dateDebut' => '2025-09-01',
            'dateFin'   => '2026-06-30',
            'statut'    => 'en_cours',
            'actif'     => 1,
            'idNiveau'  => $niveauA1->idNiveau,
            'idProf'    => $prof?->idProf,
        ]);

        $groupeA2 = Groupe::create([
            'nomGroupe' => 'Allemand A2 - Soir',
            'capacite'  => 10,
            'dateDebut' => '2025-09-01',
            'dateFin'   => '2026-06-30',
            'statut'    => 'en_cours',
            'actif'     => 1,
            'idNiveau'  => $niveauA2->idNiveau,
            'idProf'    => $prof?->idProf,
        ]);

        $groupeB1 = Groupe::create([
            'nomGroupe' => 'Allemand B1 - Weekend',
            'capacite'  => 8,
            'dateDebut' => '2025-10-01',
            'dateFin'   => '2026-06-30',
            'statut'    => 'en_cours',
            'actif'     => 1,
            'idNiveau'  => $niveauB1?->idNiveau ?? $niveauA2->idNiveau,
            'idProf'    => $prof?->idProf,
        ]);

        // ── EMPLOIS DU TEMPS ──
        Emploi::create(['jour' => 'Lundi',    'heureDebut' => '09:00', 'heureFin' => '11:00', 'salle' => '1', 'idGroupe' => $groupeA1->idGroupe]);
        Emploi::create(['jour' => 'Mercredi', 'heureDebut' => '09:00', 'heureFin' => '11:00', 'salle' => '1', 'idGroupe' => $groupeA1->idGroupe]);
        Emploi::create(['jour' => 'Mardi',    'heureDebut' => '17:00', 'heureFin' => '19:00', 'salle' => '2', 'idGroupe' => $groupeA2->idGroupe]);
        Emploi::create(['jour' => 'Jeudi',    'heureDebut' => '17:00', 'heureFin' => '19:00', 'salle' => '2', 'idGroupe' => $groupeA2->idGroupe]);
        Emploi::create(['jour' => 'Samedi',   'heureDebut' => '10:00', 'heureFin' => '13:00', 'salle' => '3', 'idGroupe' => $groupeB1->idGroupe]);

        // ── ÉTUDIANTS ──
        $etudiants = [
            ['nom' => 'BENALI',    'prenom' => 'Mohammed',  'email' => 'mohammed.benali@gmail.com',   'telephone' => '0661234567', 'cin' => 'ZZ100001', 'ville' => 'Oujda',    'dateNaissance' => '1998-05-15', 'groupe' => $groupeA1, 'montant' => 1200, 'avance' => 600],
            ['nom' => 'TAZI',      'prenom' => 'Fatima',    'email' => 'fatima.tazi@gmail.com',        'telephone' => '0662345678', 'cin' => 'ZZ100002', 'ville' => 'Oujda',    'dateNaissance' => '2000-03-20', 'groupe' => $groupeA1, 'montant' => 1200, 'avance' => 1200],
            ['nom' => 'ALAMI',     'prenom' => 'Youssef',   'email' => 'youssef.alami@gmail.com',      'telephone' => '0663456789', 'cin' => 'ZZ100003', 'ville' => 'Berkane',  'dateNaissance' => '1999-07-10', 'groupe' => $groupeA1, 'montant' => 1200, 'avance' => 400],
            ['nom' => 'MANSOURI',  'prenom' => 'Khadija',   'email' => 'khadija.mansouri@gmail.com',   'telephone' => '0664567890', 'cin' => 'ZZ100004', 'ville' => 'Oujda',    'dateNaissance' => '2001-11-25', 'groupe' => $groupeA1, 'montant' => 1200, 'avance' => 800],
            ['nom' => 'IDRISSI',   'prenom' => 'Hamza',     'email' => 'hamza.idrissi@gmail.com',      'telephone' => '0665678901', 'cin' => 'ZZ100005', 'ville' => 'Taourirt', 'dateNaissance' => '1997-02-14', 'groupe' => $groupeA1, 'montant' => 1200, 'avance' => 0],
            ['nom' => 'CHRAIBI',   'prenom' => 'Salma',     'email' => 'salma.chraibi@gmail.com',      'telephone' => '0666789012', 'cin' => 'ZZ100006', 'ville' => 'Oujda',    'dateNaissance' => '2002-08-30', 'groupe' => $groupeA2, 'montant' => 1400, 'avance' => 700],
            ['nom' => 'BERRADA',   'prenom' => 'Omar',      'email' => 'omar.berrada@gmail.com',       'telephone' => '0667890123', 'cin' => 'ZZ100007', 'ville' => 'Oujda',    'dateNaissance' => '1996-04-18', 'groupe' => $groupeA2, 'montant' => 1400, 'avance' => 1400],
            ['nom' => 'OUALI',     'prenom' => 'Nadia',     'email' => 'nadia.ouali@gmail.com',        'telephone' => '0668901234', 'cin' => 'ZZ1000018', 'ville' => 'Saïdia',   'dateNaissance' => '2000-12-05', 'groupe' => $groupeA2, 'montant' => 1400, 'avance' => 500],
            ['nom' => 'HAJJI',     'prenom' => 'Rachid',    'email' => 'rachid.hajji@gmail.com',       'telephone' => '0669012345', 'cin' => 'ZZ100009', 'ville' => 'Oujda',    'dateNaissance' => '1995-09-22', 'groupe' => $groupeA2, 'montant' => 1400, 'avance' => 200],
        ];

        $directeur = \App\Models\Directeur::first();

        foreach ($etudiants as $data) {
            // Créer user
            $user = User::create([
                'nom'        => strtoupper($data['nom']),
                'prenom'     => $data['prenom'],
                'email'      => $data['email'],
                'motDePasse' => Hash::make('password123'),
                'telephone'  => $data['telephone'],
                'role'       => 'etudiant',
                'actif'      => 1,
            ]);

            // Créer étudiant
            $etudiant = Etudiant::create([
                'idUser'        => $user->idUser,
                'cin'           => $data['cin'],
                'ville'         => $data['ville'],
                'dateNaissance' => $data['dateNaissance'],
                'actif'         => 1,
            ]);

            // Inscription dans groupe
            $groupe = $data['groupe'];
           \DB::table('appartient')->insert([
                'idEtudiant'      => $etudiant->idEtudiant,
                'idGroupe'        => $groupe->idGroupe,
                'dateInscription' => Carbon::now()->subMonths(rand(1, 6)),
                'statut'          => 'actif',
            ]);

            // Paiement
            $statut = $data['avance'] >= $data['montant'] ? 'solde' : 'en_cours';
            $paiement = Paiement::create([
                'idEtudiant'   => $etudiant->idEtudiant,
                'idGroupe'     => $groupe->idGroupe,
                'idNiveau'     => $groupe->idNiveau,
                'montantTotal' => $data['montant'],
                'statut'       => $statut,
                'dateCreation' => Carbon::now()->subMonths(rand(1, 5)),
                'idDirecteur'  => $directeur?->idDirecteur,
            ]);

            // Avance si montant > 0
            if ($data['avance'] > 0) {
                Avance::create([
                    'idPaiement'   => $paiement->idPaiement,
                    'montant'      => $data['avance'],
                    'datePaiement' => Carbon::now()->subMonths(rand(1, 4)),
                    'idDirecteur'  => $directeur?->idDirecteur,
                ]);
            }
        }

        // ── PRÉSENCES (quelques absences) ──
        $tousEtudiants = Etudiant::with('groupesActifs')->get();
        $dates = [
            Carbon::now()->subDays(7)->toDateString(),
            Carbon::now()->subDays(14)->toDateString(),
            Carbon::now()->subDays(21)->toDateString(),
        ];

        foreach ($tousEtudiants as $etudiant) {
            foreach ($etudiant->groupesActifs as $groupe) {
                foreach ($dates as $i => $date) {
                    Presence::create([
                        'idEtudiant'  => $etudiant->idEtudiant,
                        'idGroupe'    => $groupe->idGroupe,
                        'idProf'      => $prof?->idProf,
                        'dateSeance'  => $date,
                        'estPresent'  => rand(0, 4) > 0 ? 1 : 0,
                        'estJustifie' => 0,
                    ]);
                }
            }
        }

        // ── TRADUCTIONS ──
        $premiersEtudiants = Etudiant::take(3)->get();
        foreach ($premiersEtudiants as $etudiant) {
            Traduction::create([
                'idEtudiant'  => $etudiant->idEtudiant,
                'idDirecteur' => $directeur?->idDirecteur,
                'montant'     => rand(150, 300),
               'statut' => ['demande', 'en_attente', 'approuve'][rand(0, 2)],
                'dateDemande' => Carbon::now()->subDays(rand(1, 30)),
            ]);
        }

        $this->command->info('✅ Données réalistes créées avec succès !');
        $this->command->info('   → 15 étudiants');
        $this->command->info('   → 3 groupes (A1, A2, B1)');
        $this->command->info('   → Paiements + présences + traductions');
    }
}