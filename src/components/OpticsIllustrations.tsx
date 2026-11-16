/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface IllustrationProps {
  className?: string;
}

// 1. Prisma & Dispersi Cahaya (Me-Ji-Ku-Hi-Bi-Ni-U)
export const PrismDispersionIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="prismGlass" x1="160" y1="20" x2="160" y2="150" gradientUnits="userSpaceOnUse">
        <stop stopColor="#93C5FD" stopOpacity="0.45" />
        <stop offset="1" stopColor="#3B82F6" stopOpacity="0.2" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Dark/soft laboratory backdrop */}
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    <path d="M0 160 Q160 150 320 160" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

    {/* Incoming White Light Beam */}
    <line x1="20" y1="110" x2="125" y2="85" stroke="#F8FAFC" strokeWidth="4" filter="url(#glow)" strokeLinecap="round" />
    <text x="30" y="98" fill="#F8FAFC" fontSize="10" fontWeight="bold">Sinar Putih (Polikromatik)</text>

    {/* Prism Triangle */}
    <polygon points="160,25 215,145 105,145" fill="url(#prismGlass)" stroke="#60A5FA" strokeWidth="3" />
    <polygon points="160,35 205,140 115,140" fill="#DBEAFE" fillOpacity="0.2" />

    {/* Dispersed Spectrum Rays */}
    {/* Red */}
    <path d="M145 90 L205 95 L300 70" stroke="#EF4444" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />
    {/* Orange */}
    <path d="M145 92 L206 99 L300 82" stroke="#F97316" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />
    {/* Yellow */}
    <path d="M145 94 L207 103 L300 95" stroke="#EAB308" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />
    {/* Green */}
    <path d="M145 96 L208 107 L300 108" stroke="#10B981" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />
    {/* Blue */}
    <path d="M145 98 L209 111 L300 122" stroke="#3B82F6" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />
    {/* Indigo */}
    <path d="M145 100 L210 115 L300 135" stroke="#6366F1" strokeWidth="3" filter="url(#glow)" strokeLinecap="round" />
    {/* Violet (Most bent) */}
    <path d="M145 102 L211 119 L300 148" stroke="#A855F7" strokeWidth="3.5" filter="url(#glow)" strokeLinecap="round" />

    {/* Labels */}
    <text x="250" y="65" fill="#EF4444" fontSize="9" fontWeight="bold">Merah (λ terbesar)</text>
    <text x="250" y="162" fill="#C084FC" fontSize="9" fontWeight="bold">Ungu (deviasi maks)</text>
  </svg>
);

// 2. Cahaya Merambat Lurus & Karton Berlubang
export const StraightLightIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Candle */}
    <rect x="35" y="95" width="16" height="45" rx="3" fill="#FBBF24" />
    <ellipse cx="43" cy="95" rx="8" ry="3" fill="#F59E0B" />
    {/* Flame */}
    <path d="M43 70 Q51 84 43 93 Q35 84 43 70" fill="#EF4444" />
    <path d="M43 75 Q48 85 43 92 Q38 85 43 75" fill="#FBBF24" />

    {/* 3 Perforated Cards */}
    {[100, 160, 220].map((x, i) => (
      <g key={i}>
        <rect x={x} y="50" width="14" height="95" rx="4" fill="#64748B" stroke="#94A3B8" strokeWidth="2" />
        {/* Hole */}
        <circle cx={x + 7} cy="85" r="4.5" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
        <rect x={x - 4} y="145" width="22" height="6" rx="2" fill="#475569" />
      </g>
    ))}

    {/* Straight Beam of Light Passing Through All 3 Holes */}
    <line x1="43" y1="85" x2="280" y2="85" stroke="#FDE047" strokeWidth="3" strokeDasharray="3 3" />
    <line x1="43" y1="85" x2="280" y2="85" stroke="#FEF08A" strokeWidth="1.5" />

    {/* Observer Eye */}
    <path d="M265 85 Q285 70 305 85 Q285 100 265 85 Z" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="2" />
    <circle cx="285" cy="85" r="6" fill="#1E40AF" />
    <circle cx="285" cy="85" r="2.5" fill="#000000" />
    <circle cx="287" cy="83" r="1" fill="#FFFFFF" />

    <text x="75" y="35" fill="#FDE047" fontSize="11" fontWeight="bold">Satu Garis Lurus</text>
    <text x="60" y="165" fill="#94A3B8" fontSize="9">Cahaya merambat lurus dalam medium homogen</text>
  </svg>
);

// 3. Hukum Pemantulan Cahaya (i = r)
export const ReflectionIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Mirror Surface */}
    <rect x="40" y="130" width="240" height="10" rx="2" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
    {/* Hatch marks underneath mirror */}
    {[60, 90, 120, 150, 180, 210, 240, 260].map((x) => (
      <line key={x} x1={x} y1="140" x2={x - 10} y2="152" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
    ))}

    {/* Normal Line */}
    <line x1="160" y1="30" x2="160" y2="130" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 5" />
    <text x="165" y="45" fill="#94A3B8" fontSize="10" fontWeight="bold">Garis Normal (N)</text>

    {/* Incident Ray */}
    <line x1="60" y1="50" x2="160" y2="130" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
    <polygon points="108,86 112,94 102,92" fill="#F59E0B" />
    <text x="65" y="75" fill="#FBBF24" fontSize="10" fontWeight="bold">Sinar Datang (i)</text>

    {/* Reflected Ray */}
    <line x1="160" y1="130" x2="260" y2="50" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
    <polygon points="212,86 218,92 208,94" fill="#10B981" />
    <text x="215" y="75" fill="#34D399" fontSize="10" fontWeight="bold">Sinar Pantul (r)</text>

    {/* Angle Arcs */}
    <path d="M140 115 A 25 25 0 0 1 160 105" stroke="#FBBF24" strokeWidth="2" fill="none" />
    <path d="M160 105 A 25 25 0 0 1 180 115" stroke="#34D399" strokeWidth="2" fill="none" />
    <text x="138" y="102" fill="#FBBF24" fontSize="11" fontWeight="bold">∠i</text>
    <text x="175" y="102" fill="#34D399" fontSize="11" fontWeight="bold">∠r</text>

    <rect x="100" y="152" width="120" height="20" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
    <text x="160" y="166" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="bold">∠i = ∠r (Snellius)</text>
  </svg>
);

// 4. Cermin Datar & Bayangan Maya (s = s')
export const PlaneMirrorIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Central Vertical Mirror */}
    <line x1="160" y1="20" x2="160" y2="160" stroke="#38BDF8" strokeWidth="4" />
    {[40, 70, 100, 130].map((y) => (
      <line key={y} x1="160" y1={y} x2="168" y2={y - 8} stroke="#0284C7" strokeWidth="2" />
    ))}
    <text x="160" y="172" textAnchor="middle" fill="#38BDF8" fontSize="9" fontWeight="bold">Cermin Datar</text>

    {/* Real Object (Left side) */}
    <g transform="translate(60, 50)">
      <rect x="15" y="50" width="10" height="40" fill="#EF4444" rx="2" />
      <polygon points="20,25 32,50 8,50" fill="#F59E0B" />
      <circle cx="20" cy="20" r="4" fill="#FCD34D" />
      <text x="20" y="105" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">Benda Nyata</text>
    </g>

    {/* Virtual Image (Right side - dashed) */}
    <g transform="translate(220, 50)" opacity="0.85">
      <rect x="15" y="50" width="10" height="40" fill="#F43F5E" stroke="#FECDD3" strokeDasharray="3 3" rx="2" />
      <polygon points="20,25 32,50 8,50" fill="#FBBF24" stroke="#FEF08A" strokeDasharray="3 3" />
      <circle cx="20" cy="20" r="4" fill="#FEF08A" />
      <text x="20" y="105" textAnchor="middle" fill="#F43F5E" fontSize="10" fontWeight="bold">Bayangan Maya</text>
    </g>

    {/* Distance Arrows */}
    <line x1="80" y1="135" x2="160" y2="135" stroke="#FBBF24" strokeWidth="1.5" markerEnd="url(#arrow)" />
    <line x1="160" y1="135" x2="240" y2="135" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="120" y="148" textAnchor="middle" fill="#FBBF24" fontSize="10">s</text>
    <text x="200" y="148" textAnchor="middle" fill="#FBBF24" fontSize="10">s&apos; (s = s&apos;)</text>
  </svg>
);

// 5. Cermin Cekung & Titik Fokus
export const ConcaveMirrorIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Optical Axis */}
    <line x1="20" y1="90" x2="300" y2="90" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4 4" />

    {/* Concave Mirror Arc */}
    <path d="M260 25 Q240 90 260 155" stroke="#38BDF8" strokeWidth="5" fill="none" strokeLinecap="round" />
    {/* Back hatching */}
    <path d="M265 35 L272 32 M264 65 L271 62 M263 90 L270 90 M264 115 L271 118 M265 145 L272 148" stroke="#0284C7" strokeWidth="2" />

    {/* Center of Curvature (R/2F) & Focus (F) */}
    <circle cx="120" cy="90" r="3.5" fill="#F59E0B" />
    <text x="120" y="108" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="bold">R (2F)</text>

    <circle cx="185" cy="90" r="3.5" fill="#EF4444" />
    <text x="185" y="108" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">F (Fokus)</text>

    {/* Parallel Rays converging to F */}
    <line x1="30" y1="50" x2="245" y2="50" stroke="#FDE047" strokeWidth="2" />
    <line x1="245" y1="50" x2="185" y2="90" stroke="#FDE047" strokeWidth="2" strokeDasharray="2 2" />

    <line x1="30" y1="130" x2="245" y2="130" stroke="#FDE047" strokeWidth="2" />
    <line x1="245" y1="130" x2="185" y2="90" stroke="#FDE047" strokeWidth="2" strokeDasharray="2 2" />

    <rect x="75" y="145" width="170" height="24" rx="6" fill="#0F172A" stroke="#EF4444" strokeWidth="1" />
    <text x="160" y="161" textAnchor="middle" fill="#FEF08A" fontSize="10" fontWeight="bold">Cermin Cekung: Mengumpulkan Sinar (Konvergen)</text>
  </svg>
);

// 6. Cermin Cembung & Medan Pandang Tikungan
export const ConvexMirrorIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Optical Axis */}
    <line x1="20" y1="90" x2="300" y2="90" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4 4" />

    {/* Convex Mirror Arc */}
    <path d="M120 25 Q140 90 120 155" stroke="#F97316" strokeWidth="5" fill="none" strokeLinecap="round" />
    {/* Back hatching */}
    <path d="M125 35 L132 32 M134 65 L141 62 M135 90 L142 90 M134 115 L141 118 M125 145 L132 148" stroke="#EA580C" strokeWidth="2" />

    {/* Virtual Diverging Rays */}
    <line x1="20" y1="50" x2="135" y2="50" stroke="#FBBF24" strokeWidth="2" />
    <line x1="135" y1="50" x2="40" y2="15" stroke="#FBBF24" strokeWidth="2" />
    <line x1="135" y1="50" x2="200" y2="90" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 3" />

    <line x1="20" y1="130" x2="135" y2="130" stroke="#FBBF24" strokeWidth="2" />
    <line x1="135" y1="130" x2="40" y2="165" stroke="#FBBF24" strokeWidth="2" />
    <line x1="135" y1="130" x2="200" y2="90" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 3" />

    {/* Wide Vision Cone */}
    <path d="M120 25 L40 15 L40 165 L120 155 Z" fill="#F59E0B" fillOpacity="0.1" />
    <text x="75" y="94" fill="#FBBF24" fontSize="10" fontWeight="bold">Medan Pandang Luas</text>

    <rect x="70" y="145" width="180" height="24" rx="6" fill="#0F172A" stroke="#F97316" strokeWidth="1" />
    <text x="160" y="161" textAnchor="middle" fill="#FED7AA" fontSize="10" fontWeight="bold">Cermin Tikungan: Maya, Tegak, Diperkecil</text>
  </svg>
);

// 7. Pembiasan Cahaya & Pensil Patah di Air
export const RefractionIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Air region (top) */}
    <rect x="20" y="20" width="280" height="60" fill="#0F172A" rx="8" />
    <text x="35" y="40" fill="#93C5FD" fontSize="10" fontWeight="bold">Udara (n1 = 1,00) - Renggang</text>

    {/* Water boundary and water region (bottom) */}
    <rect x="20" y="80" width="280" height="80" fill="#0284C7" fillOpacity="0.3" rx="8" />
    <line x1="20" y1="80" x2="300" y2="80" stroke="#38BDF8" strokeWidth="2.5" />
    <text x="35" y="100" fill="#7DD3FC" fontSize="10" fontWeight="bold">Air (n2 = 1,33) - Rapat</text>

    {/* Normal Line */}
    <line x1="160" y1="30" x2="160" y2="150" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" />

    {/* Light beam bending towards normal */}
    <line x1="80" y1="35" x2="160" y2="80" stroke="#FBBF24" strokeWidth="3" />
    <line x1="160" y1="80" x2="200" y2="150" stroke="#FBBF24" strokeWidth="3" />

    <text x="110" y="60" fill="#FBBF24" fontSize="9" fontWeight="bold">∠i (besar)</text>
    <text x="180" y="115" fill="#FBBF24" fontSize="9" fontWeight="bold">∠r (kecil: mendekati N)</text>

    {/* Dipping Pencil illusion */}
    <line x1="230" y1="40" x2="260" y2="80" stroke="#F43F5E" strokeWidth="6" strokeLinecap="round" />
    <line x1="255" y1="80" x2="275" y2="135" stroke="#FB7185" strokeWidth="6" strokeLinecap="round" />
    <text x="235" y="152" fill="#FDA4AF" fontSize="9">Pensil tampak patah</text>
  </svg>
);

// 8. Lensa Cembung & Rumus 1/f = 1/s + 1/s'
export const LensIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Principal Axis */}
    <line x1="20" y1="90" x2="300" y2="90" stroke="#64748B" strokeWidth="1.5" strokeDasharray="4 4" />

    {/* Biconvex Lens */}
    <path d="M160 25 Q175 90 160 155 Q145 90 160 25 Z" fill="#60A5FA" fillOpacity="0.4" stroke="#38BDF8" strokeWidth="2.5" />

    {/* Focal points */}
    <circle cx="100" cy="90" r="3.5" fill="#EF4444" />
    <text x="100" y="108" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">F1</text>
    <circle cx="220" cy="90" r="3.5" fill="#EF4444" />
    <text x="220" y="108" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">F2</text>

    {/* Light Rays Converging */}
    <line x1="30" y1="50" x2="160" y2="50" stroke="#FBBF24" strokeWidth="2" />
    <line x1="160" y1="50" x2="220" y2="90" stroke="#FBBF24" strokeWidth="2" />
    <line x1="220" y1="90" x2="290" y2="135" stroke="#FBBF24" strokeWidth="2" />

    {/* Formula Banner */}
    <rect x="80" y="145" width="160" height="24" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
    <text x="160" y="161" textAnchor="middle" fill="#93C5FD" fontSize="11" fontWeight="bold">1/f = 1/s + 1/s&apos; | P = 100/f</text>
  </svg>
);

// 9. Anatomi Mata & Kacamata Miopi/Hipermetropi
export const HumanEyeIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Eyeball Oval */}
    <ellipse cx="200" cy="90" rx="65" ry="55" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
    {/* Retina Arc at back */}
    <path d="M230 45 Q265 90 230 135" stroke="#F59E0B" strokeWidth="4" fill="none" strokeLinecap="round" />
    <text x="250" y="94" fill="#F59E0B" fontSize="9" fontWeight="bold">Retina</text>

    {/* Eye Lens */}
    <ellipse cx="160" cy="90" rx="7" ry="24" fill="#93C5FD" fillOpacity="0.6" stroke="#60A5FA" strokeWidth="2" />
    {/* Cornea */}
    <path d="M145 65 Q132 90 145 115" stroke="#38BDF8" strokeWidth="2.5" fill="none" />

    {/* Corrective Eyeglass Lens in Front */}
    <path d="M70 65 Q65 90 70 115 Q75 90 70 65 Z" fill="#A7F3D0" fillOpacity="0.5" stroke="#10B981" strokeWidth="2" />
    <text x="70" y="132" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">Lensa Kacamata</text>

    {/* Rays focusing onto retina */}
    <line x1="20" y1="75" x2="70" y2="78" stroke="#FBBF24" strokeWidth="2" />
    <line x1="70" y1="78" x2="160" y2="80" stroke="#FBBF24" strokeWidth="2" />
    <line x1="160" y1="80" x2="250" y2="90" stroke="#FBBF24" strokeWidth="2" />

    <line x1="20" y1="105" x2="70" y2="102" stroke="#FBBF24" strokeWidth="2" />
    <line x1="70" y1="102" x2="160" y2="100" stroke="#FBBF24" strokeWidth="2" />
    <line x1="160" y1="100" x2="250" y2="90" stroke="#FBBF24" strokeWidth="2" />

    <rect x="50" y="152" width="220" height="20" rx="4" fill="#0F172A" stroke="#10B981" strokeWidth="1" />
    <text x="160" y="166" textAnchor="middle" fill="#A7F3D0" fontSize="10" fontWeight="bold">Miopi (Lensa Cekung) • Hipermetropi (Lensa Cembung)</text>
  </svg>
);

// 10. Mikroskop Optik Laboratorium
export const MicroscopeIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Base and Arm */}
    <rect x="70" y="145" width="180" height="15" rx="4" fill="#475569" />
    <path d="M120 145 Q120 70 180 60" stroke="#64748B" strokeWidth="14" fill="none" strokeLinecap="round" />

    {/* Eyepiece / Okuler */}
    <rect x="180" y="25" width="22" height="35" rx="3" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
    <text x="210" y="42" fill="#38BDF8" fontSize="9" fontWeight="bold">Lensa Okuler</text>

    {/* Body tube */}
    <rect x="184" y="60" width="14" height="40" fill="#334155" />

    {/* Revolver & Objective lens */}
    <circle cx="191" cy="100" r="10" fill="#F59E0B" />
    <rect x="186" y="105" width="10" height="20" rx="2" fill="#10B981" stroke="#34D399" strokeWidth="1.5" />
    <text x="205" y="118" fill="#34D399" fontSize="9" fontWeight="bold">Lensa Objektif</text>

    {/* Stage & Specimen */}
    <rect x="155" y="128" width="70" height="6" rx="2" fill="#94A3B8" />
    <rect x="183" y="126" width="16" height="3" fill="#EF4444" />

    {/* Light source / Mirror */}
    <ellipse cx="191" cy="142" rx="12" ry="4" fill="#FDE047" />

    <text x="60" y="35" fill="#FCD34D" fontSize="11" fontWeight="bold">Perbesaran Total = M_ob × M_ok</text>
  </svg>
);

// 11. Periskop Kapal Selam (2 Cermin Datar 45°)
export const PeriscopeIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#1E293B" />
    {/* Water Line */}
    <line x1="20" y1="80" x2="300" y2="80" stroke="#0284C7" strokeWidth="2" strokeDasharray="6 4" />
    <text x="25" y="74" fill="#38BDF8" fontSize="9">Permukaan Laut</text>

    {/* Periscope Tube Body */}
    <path d="M80 30 H160 V140 H240" stroke="#475569" strokeWidth="26" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
    <path d="M80 30 H160 V140 H240" stroke="#0F172A" strokeWidth="20" fill="none" strokeLinecap="square" strokeLinejoin="miter" />

    {/* Top Mirror (45°) */}
    <line x1="148" y1="18" x2="172" y2="42" stroke="#38BDF8" strokeWidth="4" />
    <text x="180" y="32" fill="#38BDF8" fontSize="9" fontWeight="bold">Cermin 1 (45°)</text>

    {/* Bottom Mirror (45°) */}
    <line x1="148" y1="128" x2="172" y2="152" stroke="#38BDF8" strokeWidth="4" />
    <text x="90" y="148" fill="#38BDF8" fontSize="9" fontWeight="bold">Cermin 2 (45°)</text>

    {/* Light Ray Path */}
    <path d="M50 30 L160 30 L160 140 L270 140" stroke="#FBBF24" strokeWidth="3" strokeDasharray="4 2" />

    {/* Eye of observer */}
    <circle cx="280" cy="140" r="8" fill="#F8FAFC" stroke="#38BDF8" strokeWidth="2" />
    <circle cx="280" cy="140" r="4" fill="#0F172A" />

    <text x="70" y="170" fill="#FDE047" fontSize="10" fontWeight="bold">Bayangan tetap tegak berkat pantulan ganda 90°</text>
  </svg>
);

// 12. Bonus Foton Energi
export const PhotonBonusIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-40' }) => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="180" rx="16" fill="#064E3B" />
    {/* Particle blast */}
    <circle cx="160" cy="90" r="45" fill="#10B981" fillOpacity="0.3" />
    <circle cx="160" cy="90" r="28" fill="#34D399" fillOpacity="0.5" />
    <circle cx="160" cy="90" r="16" fill="#FDE047" />

    {/* Energy wave ripples */}
    <path d="M40 90 Q80 60 120 90 T200 90 T280 90" stroke="#6EE7B7" strokeWidth="3" fill="none" />
    <path d="M40 90 Q80 120 120 90 T200 90 T280 90" stroke="#FDE047" strokeWidth="2" fill="none" opacity="0.7" />

    {/* Sparkles */}
    {[
      { x: 100, y: 40 },
      { x: 220, y: 45 },
      { x: 70, y: 130 },
      { x: 250, y: 125 },
      { x: 160, y: 25 },
    ].map((pt, i) => (
      <polygon
        key={i}
        points={`${pt.x},${pt.y - 8} ${pt.x + 3},${pt.y - 3} ${pt.x + 8},${pt.y} ${pt.x + 3},${pt.y + 3} ${pt.x},${pt.y + 8} ${pt.x - 3},${pt.y + 3} ${pt.x - 8},${pt.y} ${pt.x - 3},${pt.y - 3}`}
        fill="#FBBF24"
      />
    ))}

    <text x="160" y="160" textAnchor="middle" fill="#A7F3D0" fontSize="13" fontWeight="900">
      +20 POIN ENERGI FOTON (E = h · f)
    </text>
  </svg>
);

// Helper to pick illustration by contentId or tileIndex
export const getOpticsIllustration = (contentId: string, className?: string) => {
  switch (contentId) {
    case 'mat_1':
    case 'quiz_1':
      return <StraightLightIllustration className={className} />;
    case 'mat_2':
    case 'quiz_2':
      return <ReflectionIllustration className={className} />;
    case 'chal_1':
      return <StraightLightIllustration className={className} />;
    case 'bonus_1':
      return <PhotonBonusIllustration className={className} />;
    case 'mat_3':
    case 'quiz_3':
      return <PlaneMirrorIllustration className={className} />;
    case 'chal_2':
      return <ConcaveMirrorIllustration className={className} />;
    case 'mat_4':
    case 'quiz_4':
      return <ConcaveMirrorIllustration className={className} />;
    case 'chal_3':
      return <ConvexMirrorIllustration className={className} />;
    case 'mat_5':
    case 'quiz_5':
      return <RefractionIllustration className={className} />;
    case 'chal_4':
      return <RefractionIllustration className={className} />;
    case 'mat_6':
    case 'quiz_6':
      return <LensIllustration className={className} />;
    case 'chal_5':
      return <PrismDispersionIllustration className={className} />;
    case 'mat_7':
    case 'quiz_7':
      return <HumanEyeIllustration className={className} />;
    case 'chal_6':
      return <PeriscopeIllustration className={className} />;
    case 'mat_8':
    case 'quiz_8':
      return <MicroscopeIllustration className={className} />;
    default:
      return <PrismDispersionIllustration className={className} />;
  }
};
