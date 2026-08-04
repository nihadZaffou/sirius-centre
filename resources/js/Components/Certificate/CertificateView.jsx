import React, { useState } from 'react';


const SIRIUS_LOGO_SRC = "/logo.png";


const WATERMARK_SRC = "/big logo center.png";
export const DEFAULT_CERTIFICATE_DATA = {
  salutation:       'Frau/Herr',
  fullName:         'OUALID MJOUN',
  birthDate:        '09.02.1996',
  birthPlace:       'OUJDA',
  academicPeriod:   '2026/2027',
  level:            'A1',
  courseTitle:      'Deutschkurs für Studenten ',
  texteComplet:     'in unserer Sprachschule angemeldet ist und in der Zeit vom 2026/2027 regelmäßig die Niveaustufe A1"Deutschkurs für Studenten " besucht hat.',
  bemerkungen:      '',
  certificateTitle: 'TEILNAHMEBESTÄTIGUNG',
  headerText:       'Hiermit wird bescheinigt, dass',
  registrationText: 'in unserer Sprachschule angemeldet ist und in der Zeit vom',
  completionText:   'besucht hat.',
  directorTitle:    'Der Schulleiter :',
  issueDate:        new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  centerType:       'Centre Sirius (PRIVE)',
  address:          'Bd Mohammed 6 RUE 20 Baalabak Oujda',
  ice:              '(002646655000021)',
  gsm:              '0629965237',
  email:            'siriuscentre1@gmail.com',
};


export function CertificateView({ certificate, onUpdateField, isInlineEditing = true, printRef }) {
  const [internalData, setInternalData] = useState(DEFAULT_CERTIFICATE_DATA);

  // Use passed prop if provided, otherwise use internal component state
  const data = certificate || internalData;

  const handleChange = (field, value) => {
    if (onUpdateField) {
      onUpdateField(field, value);
    } else {
      setInternalData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="flex justify-center items-center w-full my-2 print:block print:m-0 print:p-0">
      {/* Printable Canvas Element (Exact A4 Dimensions: 210mm x 297mm) */}
      <div
        ref={printRef}
        id="certificate-canvas"
        className="print-only-container relative w-[210mm] min-h-[297mm] h-auto p-10 sm:p-14 flex flex-col justify-start shadow-2xl overflow-hidden rounded-xs transition-all duration-200 select-text bg-white text-black"
        style={{
          boxSizing: 'border-box',
          width: '210mm',
          minHeight: '297mm',
          background: 'linear-gradient(135deg, #FFFFFF 80%, #fff2cb 20%, #fff2cb 25%, #fff2cb 0%)',
          color: '#000000',
           position: 'relative',
        }}
      >
        {/* BACKGROUND CORNER DECORATIONS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Top-left white to bottom-right yellow gradient canvas */}
          <div 
            className="absolute inset-0" 
            style={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 30%, #FFFBEB 65%, #FDE047 100%)'
            }}
          />

          {/* TOP LEFT CRIMSON WEDGE & GOLD TEXTURED RIBBON */}
          <svg
            className="absolute top-0 left-0 w-[30%] h-[18%] min-w-[140px]"
            viewBox="0 0 400 280"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="topLeftCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6A0000" />
                <stop offset="50%" stopColor="#8B0000" />
                <stop offset="100%" stopColor="#5A0000" />
              </linearGradient>

              <linearGradient id="goldGradTL" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE896" />
                <stop offset="30%" stopColor="#D4AF37" />
                <stop offset="60%" stopColor="#FFF2B2" />
                <stop offset="100%" stopColor="#B38B12" />
              </linearGradient>

              <pattern id="goldGlitterPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                <rect width="12" height="12" fill="#D4AF37" />
                <circle cx="2" cy="3" r="1.2" fill="#FFF8DC" opacity="0.9" />
                <circle cx="8" cy="9" r="1.5" fill="#FFEAA7" opacity="0.95" />
                <circle cx="9" cy="2" r="1" fill="#997300" opacity="0.6" />
                <circle cx="4" cy="8" r="1.1" fill="#FFFFFF" opacity="0.8" />
              </pattern>
            </defs>

            {/* Solid Dark Crimson Corner Triangle Wedge */}
            <path d="M 0,0 L 260,0 L 0,185 Z" fill="url(#topLeftCrimsonGrad)" />

            {/* Textured Gold Ribbon Band along the crimson edge */}
            <path d="M 260,0 L 290,0 L 0,206 L 0,185 Z" fill="url(#goldGradTL)" />
            <path d="M 260,0 L 290,0 L 0,206 L 0,185 Z" fill="url(#goldGlitterPattern)" opacity="0.45" />

            {/* Gold Arc Curves Sweeping Below */}
            <path d="M 0,225 C 120,175 210,105 320,0" stroke="url(#goldGradTL)" strokeWidth="3.5" />
            <path d="M 0,245 C 135,190 230,118 345,0" stroke="url(#goldGradTL)" strokeWidth="2" opacity="0.85" />
          </svg>

          {/* TOP RIGHT CRIMSON CORNER & SWEEPING GOLD ARCS */}
          <svg
            className="absolute top-0 right-0 w-[28%] h-[16%] min-w-[130px]"
            viewBox="0 0 350 250"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="goldGradTR" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE896" />
                <stop offset="40%" stopColor="#D4AF37" />
                <stop offset="80%" stopColor="#FFF2B2" />
                <stop offset="100%" stopColor="#B38B12" />
              </linearGradient>
            </defs>

            {/* Crimson Top Right Wedge */}
            <path d="M 350,0 L 220,0 L 350,110 Z" fill="url(#topLeftCrimsonGrad)" />

            {/* Gold Textured Ribbon along Top Right Crimson Wedge */}
            <path d="M 220,0 L 195,0 L 350,128 L 350,110 Z" fill="url(#goldGradTR)" />
            <path d="M 220,0 L 195,0 L 350,128 L 350,110 Z" fill="url(#goldGlitterPattern)" opacity="0.45" />

            {/* Sweeping Gold Parallel Arcs */}
            <path d="M 350,150 C 240,100 120,40 50,0" stroke="url(#goldGradTR)" strokeWidth="4" />
            <path d="M 350,172 C 220,115 100,48 25,0" stroke="url(#goldGradTR)" strokeWidth="2.5" opacity="0.85" />
            <path d="M 350,192 C 200,128 80,55 5,0" stroke="url(#goldGradTR)" strokeWidth="1.5" opacity="0.65" />
          </svg>

          {/* FULL-WIDTH BOTTOM WAVE BANNER */}
          <svg
           className="absolute bottom-0 left-0 w-full h-[22%] min-h-[120px]"
            viewBox="0 0 1000 300"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="crimsonWaveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7A0000" />
                <stop offset="40%" stopColor="#9E0000" />
                <stop offset="70%" stopColor="#B30000" />
                <stop offset="100%" stopColor="#600000" />
              </linearGradient>

              <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E5C158" />
                <stop offset="20%" stopColor="#FDEB9B" />
                <stop offset="45%" stopColor="#D4AF37" />
                <stop offset="70%" stopColor="#FAF0A6" />
                <stop offset="85%" stopColor="#B8860B" />
                <stop offset="100%" stopColor="#E5C158" />
              </linearGradient>
            </defs>

            {/* Solid Crimson Wave */}
            <path
              d="M 0,220 C 120,200 180,170 270,170 C 400,170 480,295 620,295 C 750,295 880,180 1000,45 L 1000,300 L 0,300 Z"
              fill="url(#crimsonWaveGrad)"
            />

            {/* Gold Ribbon Layer */}
            <path
              d="M 0,205 C 120,185 180,155 270,155 C 400,155 480,280 620,280 C 750,280 880,165 1000,30
                 L 1000,45 C 880,180 750,295 620,295 C 480,295 400,170 270,170 C 180,170 120,200 0,220 Z"
              fill="url(#goldRibbonGrad)"
            />

            {/* Gold Parallel Arc Line 1 */}
            <path
              d="M 0,170 C 120,150 180,120 270,120 C 400,120 480,245 620,245 C 750,245 880,130 1000,10"
              stroke="url(#goldRibbonGrad)"
              strokeWidth="3.5"
            />

            {/* Gold Parallel Arc Line 2 */}
            <path
              d="M 0,140 C 120,120 180,90 270,90 C 400,90 480,215 620,215 C 750,215 880,100 1000,-5"
              stroke="url(#goldRibbonGrad)"
              strokeWidth="2.5"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* WATERMARK BACKGROUND IMAGE */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <img 
            src={WATERMARK_SRC} 
            alt="Watermark" 
            className="w-[1000px] h-[1000px] opacity-40 object-contain"
          />
        </div>

  
       {/* TOP SECTION: SIRIUS LOGO IMAGE */}
<div className="relative z-10 flex flex-col items-center text-center" style={{ marginTop: '0', paddingTop: '0' }}>
          <img 
            src={SIRIUS_LOGO_SRC} 
            alt="SIRIUS Center Logo" 
            className="w-[350px] sm:w-[390px] h-auto object-contain drop-shadow-xs"
          />
          <p 
            className="text-[#8B0000] font-extrabold text-xl sm:text-2xl tracking-normal mt-0.5 font-sans"
            style={{ color: '#8B0000' }}
          >
            Centre de langue et de formation
          </p>
        </div>

        {/* MIDDLE SECTION: MAIN CERTIFICATE CONTENT */}
        <div className="relative z-10 my-auto py-2 flex flex-col items-center text-center px-4 md:px-8 space-y-6">
          {/* Certificate Title: TEILNAHMEBESTÄTIGUNG */}
          <div className="w-full pt-1">
            <h1
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('certificateTitle', e.target.innerText)}
              className="text-2xl sm:text-3xl md:text-[2.25rem] font-black tracking-[0.12em] font-serif italic uppercase outline-none focus:ring-2 focus:ring-amber-400 rounded px-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                color: '#000000',
              }}
            >
              {data.certificateTitle}
            </h1>
          </div>

          {/* Subheading: Hiermit wird bescheinigt, dass */}
          <p
            contentEditable={isInlineEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleChange('headerText', e.target.innerText)}
            className="text-base sm:text-lg font-extrabold tracking-tight font-sans pt-1"
            style={{ color: '#000000' }}
          >
            {data.headerText}
          </p>

          {/* Student Name: Frau/Herr OUALID MJOUN */}
          <div 
            className="flex items-center justify-center space-x-2 text-xl sm:text-2xl md:text-[1.75rem] font-sans py-1"
            style={{ color: '#000000' }}
          >
            <span
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('salutation', e.target.innerText)}
              className="font-normal text-black mr-1.5 outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              style={{ color: '#000000' }}
            >
              {data.salutation}
            </span>
            <span
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('fullName', e.target.innerText)}
              className="font-black tracking-wide uppercase outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              style={{ color: '#000000' }}
            >
              {data.fullName}
            </span>
          </div>

          {/* Birth Info: geboren am 09.02.1996 in OUJDA */}
          <div 
            className="text-base sm:text-lg font-medium font-sans"
            style={{ color: '#000000' }}
          >
            geboren am{' '}
            <span
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('birthDate', e.target.innerText)}
              className="font-black text-black outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              style={{ color: '#000000' }}
            >
              {data.birthDate}
            </span>{' '}
            in{' '}
            <span
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('birthPlace', e.target.innerText)}
              className="font-black text-black uppercase outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              style={{ color: '#000000' }}
            >
              {data.birthPlace}
            </span>
          </div>

          {/* Registration Text & Academic Period */}
          <div
  className="text-sm sm:text-base md:text-[1.12rem] font-medium max-w-2xl leading-relaxed font-sans"
  style={{ color: '#000000' }}
  dangerouslySetInnerHTML={{ __html: data.texteComplet }}
/>

          {/* Director Label */}
{/* Bemerkungen */}
{data.bemerkungen && (
    <div className="text-sm sm:text-base font-medium max-w-2xl leading-relaxed font-sans mt-3" style={{ color: '#000000' }}>
        <p className="font-extrabold mb-1">Bemerkungen:</p>
        <p>{data.bemerkungen}</p>
    </div>
)}

<div className="pt-6 w-full flex flex-col items-start px-2 sm:px-8">
    <div
        contentEditable={isInlineEditing}
        suppressContentEditableWarning
        onBlur={(e) => handleChange('directorTitle', e.target.innerText)}
        className="text-base sm:text-lg font-extrabold font-sans outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
        style={{ color: '#000000' }}
    >
        {data.directorTitle}
    </div>
</div>

        {/* BOTTOM SECTION: DATE (LEFT) & CENTER FOOTER DETAILS (RIGHT) */}
        <div 
          className="relative z-10 pt-4 pb-2 flex flex-row items-end justify-between"  mt-auto
          style={{ color: '#000000' }}
        >
          {/* Bottom Left: Issue Date */}
          <div className="flex flex-col justify-end mb-[100px] text-left pb-1 mb-8 mr-20">
            <div
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('issueDate', e.target.innerText)}
              className="text-base sm:text-lg font-black font-sans outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              style={{ color: '#000000' }}
            >
              {data.issueDate}
            </div>
          </div>

          {/* Bottom Right / Center: Official Center Info & ICE/GSM/Email */}
          <div 
            className="flex flex-col items-center text-center mb-10 mr-26 space-y-0.5 text-xs sm:text-[13px] font-extrabold font-sans max-w-[65%] leading-tight"
            style={{ color: '#000000' }}
          >
            <div
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('centerType', e.target.innerText)}
              className="font-black outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              style={{ color: '#000000' }}
            >
              {data.centerType}
            </div>

            <div
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleChange('address', e.target.innerText)}
              className="font-extrabold outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              style={{ color: '#000000' }}
            >
              {data.address}
            </div>

            <div className="flex flex-wrap justify-end gap-x-1 font-black" style={{ color: '#000000' }}>
              <span>ICE :</span>
              <span
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleChange('ice', e.target.innerText)}
                className="outline-none focus:ring-2 focus:ring-amber-400 rounded px-0.5"
                style={{ color: '#000000' }}
              >
                {data.ice}
              </span>
              <span>(GSM :</span>
              <span
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleChange('gsm', e.target.innerText)}
                className="outline-none focus:ring-2 focus:ring-amber-400 rounded px-0.5"
                style={{ color: '#000000' }}
              >
                {data.gsm}
              </span>
              <span>)</span>
            </div>

            <div className="font-black" style={{ color: '#000000' }}>
              <span>(E-Mail : </span>
              <span
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleChange('email', e.target.innerText)}
                className="outline-none focus:ring-2 focus:ring-amber-400 rounded px-0.5 underline"
                style={{ color: '#000000' }}
              >
                {data.email}
              </span>
              <span>)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

</div>)}