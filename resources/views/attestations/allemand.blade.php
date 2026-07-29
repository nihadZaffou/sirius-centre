<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>

        /* ==========================================
           RESET
        ========================================== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* ==========================================
           PAGE
        ========================================== */
        @page {
            size: A4 portrait;
            margin: 0;
        }

        body {
            font-family: "DejaVu Serif", "Times New Roman", serif;
            color: #111111;
            background: #ffffff;
            font-size: 12pt;
            line-height: 1.6;
            width: 210mm;
            height: 297mm;
        }

        /* ==========================================
           CONTENEUR PRINCIPAL
           Marges internes pour laisser place aux images de fond
        ========================================== */
        .page {
            width: 210mm;
            height: 297mm;
            position: relative;
        }

        .attestation {
            margin-left: 45mm;
            margin-right: 38mm;
            padding-top: 10mm;
            padding-bottom: 30mm;
        }

        /* ==========================================
           HEADER - LOGO
        ========================================== */
        .header {
            text-align: center;
            margin-bottom: 6mm;
        }

        .logo {
            width: 36mm;
            height: auto;
        }

        /* ==========================================
           TITRE PRINCIPAL
        ========================================== */
        .title {
            font-size: 19pt;
            font-weight: bold;
            font-style: italic;
            text-align: center;
            letter-spacing: 2px;
            margin-bottom: 14mm;
            color: #000000;
            font-family: "DejaVu Serif", "Times New Roman", serif;
        }

        /* ==========================================
           INTRODUCTION
        ========================================== */
        .introduction {
            font-size: 11.5pt;
            font-weight: bold;
            margin-bottom: 7mm;
            color: #111111;
        }

        /* ==========================================
           NOM ÉTUDIANT
        ========================================== */
        .student-name {
            text-align: center;
            font-size: 13pt;
            margin-bottom: 4mm;
            color: #000000;
        }

        .student-name .label {
            font-weight: normal;
        }

        .student-name .name {
            font-weight: bold;
        }

        /* ==========================================
           DATE ET LIEU DE NAISSANCE
        ========================================== */
        .birth-info {
            text-align: center;
            font-size: 12pt;
            margin-bottom: 10mm;
            color: #000000;
        }

        .birth-info strong {
            font-weight: bold;
        }

        /* ==========================================
           TEXTE PRINCIPAL - TYPE SIMPLE (A1, A2)
           Centré, plus grand
        ========================================== */
        .paragraph-simple {
            font-size: 12pt;
            text-align: center;
            line-height: 2.0;
            margin-bottom: 10mm;
            color: #000000;
        }

        .paragraph-simple strong {
            font-weight: bold;
        }

        /* ==========================================
           TEXTE PRINCIPAL - TYPE GOETHE (B1, B2)
           Justifié, taille normale
        ========================================== */
        .paragraph-goethe {
            font-size: 11pt;
            text-align: center;
            line-height: 1.9;
            margin-bottom: 8mm;
            color: #000000;
        }

        .paragraph-goethe strong {
            font-weight: bold;
        }

        /* ==========================================
           BEMERKUNGEN (REMARQUES)
        ========================================== */
        .bemerkungen-label {
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 2mm;
            color: #000000;
        }

        .bemerkungen-text {
            font-size: 11pt;
            line-height: 1.7;
            margin-bottom: 10mm;
            color: #000000;
        }

        /* ==========================================
           SIGNATAIRE
        ========================================== */
        .signataire {
            font-size: 11pt;
            font-weight: bold;
            margin-top: 8mm;
            color: #000000;
        }

        /* ==========================================
           FOOTER - DATE + ADRESSE
           Utilise display:table pour compatibilité mPDF
        ========================================== */
        .footer {
            position: fixed;
            bottom: 8mm;
            left: 45mm;
            right: 38mm;
        }

        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .footer-date {
            font-size: 9.5pt;
            font-weight: bold;
            font-style: italic;
            color: #000000;
            vertical-align: bottom;
            width: 35%;
        }

        .footer-address {
            font-size: 8pt;
            text-align: center;
            font-weight: bold;
            line-height: 1.7;
            color: #000000;
            vertical-align: bottom;
            width: 65%;
        }

    </style>
</head>
<body>

<div class="page">
    <div class="attestation">

        {{-- LOGO --}}
        <div class="header">
            <img
                src="{{ public_path('attestations/logo_sirius.png') }}"
                class="logo"
                alt="Sirius Center"
            >
        </div>

        {{-- TITRE --}}
        <div class="title">TEILNAHMEBESTÄTIGUNG</div>

        {{-- INTRODUCTION --}}
        <div class="introduction">Hiermit wird bescheinigt, dass</div>

        {{-- NOM ÉTUDIANT --}}
        <div class="student-name">
            <span class="label">Frau/Herr </span>
            <span class="name">{{ strtoupper($nom) }}</span>
        </div>

        {{-- DATE ET LIEU DE NAISSANCE --}}
        <div class="birth-info">
            geboren am <strong>{{ $dateNaissance }}</strong>
            in <strong>{{ strtoupper($ville) }}</strong>
        </div>

        {{-- TEXTE PRINCIPAL --}}
        @if($type === 'simple')
            <div class="paragraph-simple">{!! $texte !!}</div>
        @else
            <div class="paragraph-goethe">{!! $texte !!}</div>
        @endif

        {{-- BEMERKUNGEN --}}
        @if($bemerkungen)
            <div class="bemerkungen-label">Bemerkungen:</div>
            <div class="bemerkungen-text">{{ $bemerkungen }}</div>
        @endif

        {{-- SIGNATAIRE --}}
        <div class="signataire">{{ $signataire }} :</div>

    </div>

    {{-- FOOTER --}}
    <div class="footer">
        <table class="footer-table">
            <tr>
                <td class="footer-date">{{ $date }}</td>
                <td class="footer-address">
                    <strong>Centre Sirius (PRIVE)</strong><br>
                    Bd Mohammed 6 RUE 20 Baalabak Oujda<br>
                    ICE : (002646655000021) (GSM :0629965237)<br>
                    (E-Mail : siriuscentre1@gmail.com)
                </td>
            </tr>
        </table>
    </div>

</div>

</body>
</html>