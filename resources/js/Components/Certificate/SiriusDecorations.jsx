import React from 'react';

export function SiriusCornerFrame({
  primaryColor = '#8B0000',
  secondaryColor = '#D4AF37',
}) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Soft Cream Canvas Gradient */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at 50% 35%, #FFFFFF 0%, #FFFDF7 60%, #FFF9EC 100%)'
        }}
      />

      {/* TOP LEFT CORNER ORNAMENTS */}
      <svg
        className="absolute top-0 left-0 w-[44%] h-[28%] min-w-[210px]"
        viewBox="0 0 400 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="topLeftCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A00000" />
            <stop offset="70%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#600000" />
          </linearGradient>
          <linearGradient id="goldGradTL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1B0" />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#997A15" />
          </linearGradient>
        </defs>

        {/* Deep Crimson Top-Left Filled Curve */}
        <path
          d="M 0,0 L 260,0 C 200,60 120,110 0,160 Z"
          fill="url(#topLeftCrimson)"
        />

        {/* Outer Crimson Subtle Layer */}
        <path
          d="M 0,160 C 120,110 200,60 260,0 L 285,0 C 215,70 130,125 0,180 Z"
          fill="#6B0000"
          opacity="0.4"
        />

        {/* Golden Sweeping Arc Lines */}
        <path
          d="M 0,180 C 140,125 230,75 320,0"
          stroke="url(#goldGradTL)"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 0,195 C 150,135 245,80 340,0"
          stroke="url(#goldGradTL)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 0,210 C 160,145 260,88 360,0"
          stroke="url(#goldGradTL)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 0,225 C 170,155 275,95 380,0"
          stroke="url(#goldGradTL)"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
      </svg>

      {/* TOP RIGHT CORNER ORNAMENTS */}
      <svg
        className="absolute top-0 right-0 w-[38%] h-[26%] min-w-[190px]"
        viewBox="0 0 350 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="goldGradTR" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE890" />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#8A6B0A" />
          </linearGradient>
        </defs>

        {/* Sweeping Gold Ribbon Arcs from Top Right */}
        <path
          d="M 350,140 C 250,100 150,50 100,0"
          stroke="url(#goldGradTR)"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 350,160 C 230,115 130,55 70,0"
          stroke="url(#goldGradTR)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 350,180 C 210,130 110,60 40,0"
          stroke="url(#goldGradTR)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 350,200 C 190,145 90,65 10,0"
          stroke="url(#goldGradTR)"
          strokeWidth="1"
          fill="none"
          opacity="0.35"
        />
      </svg>

      {/* BOTTOM RIGHT CORNER ORNAMENTS */}
      <svg
        className="absolute bottom-0 right-0 w-[50%] h-[34%] min-w-[250px]"
        viewBox="0 0 450 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="bottomRightCrimson" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#7A0000" />
            <stop offset="60%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#B00000" />
          </linearGradient>
          <linearGradient id="goldGradBR" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFE27A" />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#9E780E" />
          </linearGradient>
        </defs>

        {/* Deep Crimson Bottom-Right Curved Corner */}
        <path
          d="M 450,80 C 320,180 180,240 0,320 L 450,320 Z"
          fill="url(#bottomRightCrimson)"
        />

        {/* Dark Shadow Layer below Crimson Wave */}
        <path
          d="M 450,60 C 310,165 165,230 0,305 L 0,320 C 180,240 320,180 450,80 Z"
          fill="#4A0000"
          opacity="0.3"
        />

        {/* Gold Ribbon Waves on Bottom Right */}
        <path
          d="M 450,45 C 300,150 150,220 0,290"
          stroke="url(#goldGradBR)"
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M 450,30 C 280,135 130,205 0,270"
          stroke="url(#goldGradBR)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 450,15 C 260,120 110,190 0,250"
          stroke="url(#goldGradBR)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* BOTTOM LEFT CORNER GOLDEN SWOOSHES */}
      <svg
        className="absolute bottom-0 left-0 w-[45%] h-[22%] min-w-[200px]"
        viewBox="0 0 400 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="goldGradBL" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9E7A0E" />
            <stop offset="50%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#FFE082" />
          </linearGradient>
        </defs>

        <path
          d="M 0,110 C 100,130 220,160 400,200 L 0,200 Z"
          fill="url(#goldGradBL)"
          opacity="0.15"
        />
        <path
          d="M 0,130 C 120,145 250,170 400,200"
          stroke="url(#goldGradBL)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 0,150 C 130,160 270,180 400,200"
          stroke="url(#goldGradBL)"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 0,170 C 140,175 280,190 400,200"
          stroke="url(#goldGradBL)"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

export function SiriusWatermark({ opacity = 0.08 }) {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
      style={{ opacity }}
    >
      <div className="relative w-[480px] h-[480px] flex flex-col items-center justify-center transform -rotate-6 scale-105">
        {/* Laurel Wreath Emblem */}
        <svg viewBox="0 0 300 300" className="w-full h-full text-amber-800 fill-current">
          <path d="M 150 20 C 100 40 50 100 50 180 C 50 230 90 270 150 280 C 130 260 80 210 80 180 C 80 120 120 60 150 20 Z" />
          <path d="M 150 20 C 200 40 250 100 250 180 C 250 230 210 270 150 280 C 170 260 220 210 220 180 C 220 120 180 60 150 20 Z" />
          
          <path d="M 130 40 C 100 60 80 90 70 120 C 85 100 110 80 130 70 Z" />
          <path d="M 110 90 C 80 120 65 150 60 180 C 75 160 100 135 120 120 Z" />
          <path d="M 100 160 C 80 190 75 220 80 240 C 95 220 115 195 125 180 Z" />

          <path d="M 170 40 C 200 60 220 90 230 120 C 215 100 190 80 170 70 Z" />
          <path d="M 190 90 C 220 120 235 150 240 180 C 225 160 200 135 180 120 Z" />
          <path d="M 200 160 C 220 190 225 220 220 240 C 205 220 185 195 175 180 Z" />

          <polygon points="150,90 210,115 150,140 90,115" />
          <path d="M 110 125 L 110 148 C 110 160 190 160 190 148 L 190 125" />
          <path d="M 200 118 L 215 150 L 210 170" stroke="currentColor" strokeWidth="3" fill="none" />
        </svg>

        {/* Large Faint SIRIUS Center Text */}
        <div className="absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full">
          <div className="text-6xl font-black tracking-wider text-amber-950 font-sans uppercase">
            SIRIUS
          </div>
          <div className="text-4xl font-bold tracking-widest text-amber-800 font-serif italic -mt-1">
            Center
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiriusLogo({ className = "" }) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Top Graduation Cap with Stars */}
      <div className="relative mb-0.5 flex items-center justify-center">
        {/* Main Cap */}
        <svg viewBox="0 0 100 60" className="w-16 h-10 text-slate-900 fill-current drop-shadow-xs">
          <polygon points="50,5 95,25 50,45 5,25" />
          <path d="M 22,34 L 22,46 C 22,54 78,54 78,46 L 78,34 Z" />
          <path d="M 85,27 L 90,48 L 88,58" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="25" r="3.5" fill="#D4AF37" />
        </svg>

        {/* 2 Gold Stars next to the Cap */}
        <svg viewBox="0 0 40 40" className="absolute -top-1 -right-5 w-6 h-6 text-amber-500 fill-current">
          <polygon points="20,2 25,14 38,14 27,22 31,35 20,27 9,35 13,22 2,14 15,14" />
        </svg>
      </div>

      {/* Main Brand Name */}
      <div className="relative flex flex-col items-center">
        {/* SIRIUS in Bold Dark Metallic Sans */}
        <div className="text-4xl md:text-[2.65rem] font-black tracking-tight text-slate-950 uppercase font-sans leading-none">
          SIRIUS
        </div>

        {/* Golden Sweep Arc under SIRIUS */}
        <div className="w-full h-[5px] bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 rounded-full my-0.5" />

        {/* Center in Elegant Gold Script/Font */}
        <div className="text-2xl md:text-3xl font-semibold tracking-wide text-amber-500 font-serif italic -mt-1">
          Center
        </div>
      </div>

      {/* Red Subtitle: Centre de langue et de formation */}
      <div className="mt-2 text-base md:text-[1.1rem] font-bold tracking-normal text-[#8B0000] font-sans">
        Centre de langue et de formation
      </div>
    </div>
  );
}

export function OfficialSealStamp({ className = "" }) {
  return (
    <div className={`relative w-28 h-28 flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full text-red-700 opacity-90">
        <defs>
          <path
            id="stampTextPath"
            d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"
          />
        </defs>

        <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6,3" />
        <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1.5" />

        <text fontSize="12" fontWeight="bold" fill="currentColor" letterSpacing="1.5">
          <textPath href="#stampTextPath" startOffset="0%">
            • SIRIUS CENTER • OUJDA • CENTRE DE LANGUE •
          </textPath>
        </text>

        <g transform="translate(100, 100)">
          <polygon
            points="0,-18 5,-5 18,-5 8,3 12,16 0,8 -12,16 -8,3 -18,-5 -5,-5"
            fill="currentColor"
          />
          <text
            y="26"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="currentColor"
            letterSpacing="1"
          >
            SIRIUS CERTIFIED
          </text>
        </g>
      </svg>
    </div>
  );
}
