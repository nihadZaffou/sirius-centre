import React from 'react';
import { SiriusCornerFrame, SiriusWatermark, SiriusLogo, OfficialSealStamp } from './SiriusDecorations';
export function CertificateView({ certificate, onUpdateField, isInlineEditing = false, printRef }) {
  const { student, course, center, meta, styling } = certificate;

  const handleTextChange = (section, field, value) => {
    if (onUpdateField) {
      onUpdateField(section, field, value);
    }
  };

  return (
    <div className="flex justify-center items-center w-full my-2">
      {/* Printable / Canvas Paper Element (Standard A4 Ratio ~ 210mm x 297mm) */}
      <div
        ref={printRef}
        id="certificate-canvas"
        className="print-only-container relative bg-white text-slate-900 w-[210mm] min-h-[297mm] h-auto p-8 sm:p-12 md:p-14 flex flex-col justify-between shadow-2xl overflow-hidden rounded-xs transition-all duration-200 select-text"
        style={{
          boxSizing: 'border-box',
          width: '210mm',
          minHeight: '297mm',
        }}
      >
        {/* Background & Corner Graphics */}
        <SiriusCornerFrame
          primaryColor={styling.primaryColor}
          secondaryColor={styling.secondaryColor}
        />
        <SiriusWatermark opacity={styling.watermarkOpacity} />

        {/* TOP SECTION: LOGO & CENTER NAME */}
        <div className="relative z-10 pt-2 flex flex-col items-center text-center">
          <SiriusLogo />
        </div>

        {/* MIDDLE SECTION: MAIN CERTIFICATE CONTENT */}
        <div className="relative z-10 my-auto py-4 flex flex-col items-center text-center px-4 md:px-8 space-y-6">
          {/* Certificate Title: TEILNAHMEBESTÄTIGUNG */}
          <div className="w-full pt-2">
            <h1
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('meta', 'certificateTitle', e.target.innerText)}
              className="text-2xl sm:text-3xl md:text-[2.25rem] font-extrabold tracking-[0.15em] text-slate-950 font-serif italic uppercase outline-none focus:ring-2 focus:ring-amber-400 rounded px-2"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
              }}
            >
              {meta.certificateTitle}
            </h1>
          </div>

          {/* Subheading: Hiermit wird bescheinigt, dass */}
          <p
            contentEditable={isInlineEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleTextChange('course', 'headerText', e.target.innerText)}
            className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight font-sans pt-2"
          >
            Hiermit wird bescheinigt, dass
          </p>

          {/* Student Name: Frau/Herr OUALID MJOUN */}
          <div className="flex items-center justify-center space-x-2 text-xl sm:text-2xl md:text-[1.75rem] font-extrabold text-slate-950 tracking-normal font-sans py-1">
            <span
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('student', 'salutation', e.target.innerText)}
              className="font-medium text-slate-800 mr-2 outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
            >
              {student.salutation}
            </span>
            <span
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('student', 'fullName', e.target.innerText)}
              className="font-black tracking-wide text-black uppercase outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
            >
              {student.fullName}
            </span>
          </div>

          {/* Birth Info: geboren am 09.02.1996 in OUJDA */}
          <div className="text-base sm:text-lg font-semibold text-slate-900 font-sans">
            geboren am{' '}
            <span
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('student', 'birthDate', e.target.innerText)}
              className="font-black text-black outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
            >
              {student.birthDate}
            </span>{' '}
            in{' '}
            <span
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('student', 'birthPlace', e.target.innerText)}
              className="font-black text-black uppercase outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
            >
              {student.birthPlace}
            </span>
          </div>

          {/* Registration Text & Academic Period */}
          <div className="text-sm sm:text-base md:text-[1.125rem] font-semibold text-slate-900 max-w-2xl leading-relaxed font-sans space-y-2">
            <p>
              {course.registrationText}{' '}
              <span
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('course', 'academicPeriod', e.target.innerText)}
                className="font-black text-black outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              >
                {course.academicPeriod}
              </span>
            </p>

            {/* Course Level & Title */}
            <p className="py-1">
              regelmäßig die Niveaustufe{' '}
              <span
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('course', 'level', e.target.innerText)}
                className="font-black text-black outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              >
                {course.level}
              </span>
              <span className="font-black text-black font-sans tracking-tight px-0.5">
                "{course.courseTitle} "
              </span>
            </p>

            {/* Completion Text */}
            <p>
              <span
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('course', 'completionText', e.target.innerText)}
                className="outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              >
                {course.completionText}
              </span>
            </p>
          </div>

          {/* Director Signature Label */}
          <div className="pt-8 w-full flex flex-col items-start px-2 sm:px-8">
            <div
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('meta', 'directorTitle', e.target.innerText)}
              className="text-base sm:text-lg font-extrabold text-slate-950 font-sans outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
            >
              {meta.directorTitle}
            </div>

            {/* Optional Signature Space */}
            {meta.showSignature && (
              <div className="mt-3 h-12 flex items-center">
                <span className="italic font-serif text-slate-400 text-sm border-b border-dashed border-slate-300 pb-0.5">
                  Signature & Cachet
                </span>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: DATE (LEFT) & CENTER FOOTER DETAILS (RIGHT) */}
        <div className="relative z-10 pt-6 pb-2 flex flex-row items-end justify-between border-t border-amber-900/10 text-slate-900">
          {/* Bottom Left: Issue Date */}
          <div className="flex flex-col justify-end text-left pb-1">
            <div
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('meta', 'issueDate', e.target.innerText)}
              className="text-base sm:text-lg font-extrabold text-slate-950 font-sans outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
            >
              {meta.issueDate}
            </div>
          </div>

          {/* Bottom Right / Center: Official Center Info & ICE/GSM/Email */}
          <div className="flex flex-col items-end text-right space-y-0.5 text-xs sm:text-sm font-extrabold text-slate-950 font-sans max-w-[65%] leading-snug">
            <div
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('center', 'centerType', e.target.innerText)}
              className="font-black text-black outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
            >
              {center.centerType}
            </div>

            <div
              contentEditable={isInlineEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextChange('center', 'address', e.target.innerText)}
              className="font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
            >
              {center.address}
            </div>

            <div className="flex flex-wrap justify-end gap-x-1 font-black text-black">
              <span>ICE :</span>
              <span
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('center', 'ice', e.target.innerText)}
                className="outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              >
                {center.ice}
              </span>
              <span>(GSM :</span>
              <span
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('center', 'gsm', e.target.innerText)}
                className="outline-none focus:ring-2 focus:ring-amber-400 rounded px-1"
              >
                {center.gsm}
              </span>
              <span>)</span>
            </div>

            <div className="font-black text-black">
              <span>(E-Mail : </span>
              <span
                contentEditable={isInlineEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextChange('center', 'email', e.target.innerText)}
                className="outline-none focus:ring-2 focus:ring-amber-400 rounded px-1 text-slate-950 underline"
              >
                {center.email}
              </span>
              <span>)</span>
            </div>
          </div>

          {/* Stamp overlay if enabled */}
          {meta.showStamp && (
            <div className="absolute right-4 bottom-12 pointer-events-none opacity-80">
              <OfficialSealStamp className="w-24 h-24 sm:w-28 sm:h-28" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
