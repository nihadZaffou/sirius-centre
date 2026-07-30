<?php
$nom           = 'OUALID MJOUN';
$dateNaissance = '09.02.1996';
$ville         = 'OUJDA';
$annee         = '2025/2026';
$niveau        = 'A1';
$coursTitle    = 'Deutschkurs für Studenten';
$signataire    = 'Der Schulleiter :';
$date          = 'juillet 12, 2026';
$primaryColor  = '#8B0000';
$secondaryColor= '#D4AF37';
?>
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Attestation</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { background:#ccc; font-family: Georgia, serif; }

@page { size: A4 portrait; margin: 0; }
@media print {
    body { background: white; }
    .page { margin: 0; box-shadow: none; }
}

.page {
    width: 210mm;
    min-height: 297mm;
    margin: 20px auto;
    background: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 30px rgba(0,0,0,0.4);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 56px;
}

/* DÉCORATIONS ABSOLUES */
.decorations {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
}

/* CONTENU */
.content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
    margin: auto 0;
    padding: 16px 32px;
}

/* LOGO */
.logo-cap svg { display: block; margin: 0 auto; }
.logo-sirius { font-size: 2.65rem; font-weight: 900; color: #0f172a; letter-spacing: -0.02em; font-family: Arial, sans-serif; text-transform: uppercase; line-height: 1; }
.logo-arc { height: 5px; background: linear-gradient(to right, #fcd34d, #f59e0b, #fcd34d); border-radius: 9999px; margin: 4px 0; }
.logo-center { font-size: 1.875rem; font-weight: 600; color: #f59e0b; font-family: Georgia, serif; font-style: italic; margin-top: -4px; }
.logo-subtitle { margin-top: 8px; font-size: 1.1rem; font-weight: 700; color: #8B0000; font-family: Arial, sans-serif; }

/* TITRE */
.cert-title {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    color: #0f172a;
    font-family: 'Playfair Display', Georgia, serif;
    font-style: italic;
    text-transform: uppercase;
}

/* TEXTES */
.cert-header { font-size: 1.125rem; font-weight: 800; color: #0f172a; }
.student-name { font-size: 1.75rem; font-weight: 900; color: #000; text-transform: uppercase; }
.student-salut { font-size: 1.75rem; font-weight: 500; color: #1e293b; margin-right: 8px; }
.birth-info { font-size: 1.125rem; font-weight: 600; color: #0f172a; }
.birth-bold { font-weight: 900; color: #000; }
.course-text { font-size: 1.125rem; font-weight: 600; color: #0f172a; line-height: 1.6; max-width: 600px; }
.course-bold { font-weight: 900; color: #000; }
.director { font-size: 1.125rem; font-weight: 800; color: #0f172a; align-self: flex-start; padding-left: 8px; margin-top: 32px; }

/* FOOTER */
.footer {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    border-top: 1px solid rgba(120,53,15,0.1);
    padding-top: 24px;
    margin-top: 24px;
}
.footer-date { font-size: 1.125rem; font-weight: 800; color: #0f172a; font-family: Arial, sans-serif; }
.footer-info { text-align: right; font-size: 0.875rem; font-weight: 700; color: #0f172a; line-height: 1.4; }
.footer-info .bold { font-weight: 900; color: #000; }
</style>
</head>
<body>
<div class="page">

    <!-- DÉCORATIONS -->
    <div class="decorations">

        <!-- Fond dégradé -->
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FFFDF7 60%, #FFF9EC 100%);"></div>

        <!-- COIN HAUT GAUCHE -->
        <svg style="position:absolute;top:0;left:0;width:44%;height:28%;min-width:210px;" viewBox="0 0 400 280" fill="none" preserveAspectRatio="none">
            <defs>
                <linearGradient id="tlC" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#A00000"/>
                    <stop offset="70%" stop-color="<?= $primaryColor ?>"/>
                    <stop offset="100%" stop-color="#600000"/>
                </linearGradient>
                <linearGradient id="tlG" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FFF1B0"/>
                    <stop offset="50%" stop-color="<?= $secondaryColor ?>"/>
                    <stop offset="100%" stop-color="#997A15"/>
                </linearGradient>
            </defs>
            <path d="M 0,0 L 260,0 C 200,60 120,110 0,160 Z" fill="url(#tlC)"/>
            <path d="M 0,160 C 120,110 200,60 260,0 L 285,0 C 215,70 130,125 0,180 Z" fill="#6B0000" opacity="0.4"/>
            <path d="M 0,180 C 140,125 230,75 320,0" stroke="url(#tlG)" stroke-width="4" fill="none"/>
            <path d="M 0,195 C 150,135 245,80 340,0" stroke="url(#tlG)" stroke-width="2.5" fill="none" opacity="0.85"/>
            <path d="M 0,210 C 160,145 260,88 360,0" stroke="url(#tlG)" stroke-width="1.5" fill="none" opacity="0.6"/>
            <path d="M 0,225 C 170,155 275,95 380,0" stroke="url(#tlG)" stroke-width="1" fill="none" opacity="0.4"/>
        </svg>

        <!-- COIN HAUT DROITE -->
        <svg style="position:absolute;top:0;right:0;width:38%;height:26%;min-width:190px;" viewBox="0 0 350 250" fill="none" preserveAspectRatio="none">
            <defs>
                <linearGradient id="trG" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#FFE890"/>
                    <stop offset="50%" stop-color="<?= $secondaryColor ?>"/>
                    <stop offset="100%" stop-color="#8A6B0A"/>
                </linearGradient>
            </defs>
            <path d="M 350,140 C 250,100 150,50 100,0" stroke="url(#trG)" stroke-width="4" fill="none"/>
            <path d="M 350,160 C 230,115 130,55 70,0" stroke="url(#trG)" stroke-width="2.5" fill="none" opacity="0.85"/>
            <path d="M 350,180 C 210,130 110,60 40,0" stroke="url(#trG)" stroke-width="1.5" fill="none" opacity="0.6"/>
            <path d="M 350,200 C 190,145 90,65 10,0" stroke="url(#trG)" stroke-width="1" fill="none" opacity="0.35"/>
        </svg>

        <!-- COIN BAS DROITE -->
        <svg style="position:absolute;bottom:0;right:0;width:50%;height:34%;min-width:250px;" viewBox="0 0 450 320" fill="none" preserveAspectRatio="none">
            <defs>
                <linearGradient id="brC" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#7A0000"/>
                    <stop offset="60%" stop-color="<?= $primaryColor ?>"/>
                    <stop offset="100%" stop-color="#B00000"/>
                </linearGradient>
                <linearGradient id="brG" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#FFE27A"/>
                    <stop offset="50%" stop-color="<?= $secondaryColor ?>"/>
                    <stop offset="100%" stop-color="#9E780E"/>
                </linearGradient>
            </defs>
            <path d="M 450,80 C 320,180 180,240 0,320 L 450,320 Z" fill="url(#brC)"/>
            <path d="M 450,60 C 310,165 165,230 0,305 L 0,320 C 180,240 320,180 450,80 Z" fill="#4A0000" opacity="0.3"/>
            <path d="M 450,45 C 300,150 150,220 0,290" stroke="url(#brG)" stroke-width="4" fill="none"/>
            <path d="M 450,30 C 280,135 130,205 0,270" stroke="url(#brG)" stroke-width="2.5" fill="none" opacity="0.8"/>
            <path d="M 450,15 C 260,120 110,190 0,250" stroke="url(#brG)" stroke-width="1.5" fill="none" opacity="0.6"/>
        </svg>

        <!-- COIN BAS GAUCHE -->
        <svg style="position:absolute;bottom:0;left:0;width:45%;height:22%;min-width:200px;" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
            <defs>
                <linearGradient id="blG" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#9E7A0E"/>
                    <stop offset="50%" stop-color="<?= $secondaryColor ?>"/>
                    <stop offset="100%" stop-color="#FFE082"/>
                </linearGradient>
            </defs>
            <path d="M 0,110 C 100,130 220,160 400,200 L 0,200 Z" fill="url(#blG)" opacity="0.15"/>
            <path d="M 0,130 C 120,145 250,170 400,200" stroke="url(#blG)" stroke-width="3" fill="none"/>
            <path d="M 0,150 C 130,160 270,180 400,200" stroke="url(#blG)" stroke-width="2" fill="none" opacity="0.7"/>
            <path d="M 0,170 C 140,175 280,190 400,200" stroke="url(#blG)" stroke-width="1" fill="none" opacity="0.4"/>
        </svg>

        <!-- WATERMARK -->
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:0;overflow:hidden;opacity:0.08;">
            <div style="position:relative;width:480px;height:480px;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-6deg) scale(1.05);">
                <svg viewBox="0 0 300 300" style="width:100%;height:100%;fill:#92400e;">
                    <path d="M 150 20 C 100 40 50 100 50 180 C 50 230 90 270 150 280 C 130 260 80 210 80 180 C 80 120 120 60 150 20 Z"/>
                    <path d="M 150 20 C 200 40 250 100 250 180 C 250 230 210 270 150 280 C 170 260 220 210 220 180 C 220 120 180 60 150 20 Z"/>
                    <path d="M 130 40 C 100 60 80 90 70 120 C 85 100 110 80 130 70 Z"/>
                    <path d="M 110 90 C 80 120 65 150 60 180 C 75 160 100 135 120 120 Z"/>
                    <path d="M 100 160 C 80 190 75 220 80 240 C 95 220 115 195 125 180 Z"/>
                    <path d="M 170 40 C 200 60 220 90 230 120 C 215 100 190 80 170 70 Z"/>
                    <path d="M 190 90 C 220 120 235 150 240 180 C 225 160 200 135 180 120 Z"/>
                    <path d="M 200 160 C 220 190 225 220 220 240 C 205 220 185 195 175 180 Z"/>
                    <polygon points="150,90 210,115 150,140 90,115"/>
                    <path d="M 110 125 L 110 148 C 110 160 190 160 190 148 L 190 125"/>
                </svg>
                <div style="position:absolute;top:52%;left:50%;transform:translate(-50%,-50%);text-align:center;width:100%;">
                    <div style="font-size:60px;font-weight:900;letter-spacing:4px;color:#451a03;font-family:Arial,sans-serif;text-transform:uppercase;">SIRIUS</div>
                    <div style="font-size:40px;font-weight:700;letter-spacing:6px;color:#78350f;font-family:Georgia,serif;font-style:italic;margin-top:-4px;">Center</div>
                </div>
            </div>
        </div>
    </div>

    <!-- CONTENU PRINCIPAL -->
    <div class="content">

        <!-- LOGO -->
        <div style="display:flex;flex-direction:column;align-items:center;text-align:center;">
            <!-- Cap SVG -->
            <div style="position:relative;margin-bottom:4px;display:flex;align-items:center;justify-content:center;">
                <svg viewBox="0 0 100 60" style="width:64px;height:40px;fill:#0f172a;">
                    <polygon points="50,5 95,25 50,45 5,25"/>
                    <path d="M 22,34 L 22,46 C 22,54 78,54 78,46 L 78,34 Z"/>
                    <path d="M 85,27 L 90,48 L 88,58" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
                    <circle cx="50" cy="25" r="3.5" fill="#D4AF37"/>
                </svg>
                <svg viewBox="0 0 40 40" style="position:absolute;top:-4px;right:-20px;width:24px;height:24px;fill:#f59e0b;">
                    <polygon points="20,2 25,14 38,14 27,22 31,35 20,27 9,35 13,22 2,14 15,14"/>
                </svg>
            </div>
            <div class="logo-sirius">SIRIUS</div>
            <div class="logo-arc" style="width:100%;"></div>
            <div class="logo-center">Center</div>
            <div class="logo-subtitle">Centre de langue et de formation</div>
        </div>

        <!-- TITRE -->
        <div style="width:100%;padding-top:8px;">
            <h1 class="cert-title">TEILNAHMEBESTÄTIGUNG</h1>
        </div>

        <!-- INTRO -->
        <p class="cert-header">Hiermit wird bescheinigt, dass</p>

        <!-- NOM ÉTUDIANT -->
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
            <span class="student-salut">Frau/Herr</span>
            <span class="student-name"><?= htmlspecialchars($nom) ?></span>
        </div>

        <!-- NAISSANCE -->
        <div class="birth-info">
            geboren am <span class="birth-bold"><?= htmlspecialchars($dateNaissance) ?></span>
            in <span class="birth-bold"><?= strtoupper(htmlspecialchars($ville)) ?></span>
        </div>

        <!-- TEXTE COURS -->
        <div class="course-text">
            <p>in unserer Sprachschule angemeldet ist und in der Zeit vom <span class="course-bold"><?= htmlspecialchars($annee) ?></span></p>
            <p style="padding:4px 0;">regelmäßig die Niveaustufe <span class="course-bold"><?= htmlspecialchars($niveau) ?></span><span class="course-bold">"<?= htmlspecialchars($coursTitle) ?> "</span></p>
            <p>besucht hat.</p>
        </div>

        <!-- SIGNATAIRE -->
        <div class="director"><?= htmlspecialchars($signataire) ?></div>

    </div>

    <!-- FOOTER -->
    <div class="footer">
        <div class="footer-date"><?= htmlspecialchars($date) ?></div>
        <div class="footer-info">
            <div class="bold">Centre Sirius (PRIVE)</div>
            <div>Bd Mohammed 6 RUE 20 Baalabak Oujda</div>
            <div><span class="bold">ICE : (002646655000021) (GSM :0629965237)</span></div>
            <div><span class="bold">(E-Mail : siriuscentre1@gmail.com)</span></div>
        </div>
    </div>

</div>
</body>
</html>