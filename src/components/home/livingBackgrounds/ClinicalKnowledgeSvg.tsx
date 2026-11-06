import React from 'react';

/**
 * ENVIRONMENT 04 — CLINICAL KNOWLEDGE (Living Medical Atlas)
 * Art Direction:
 * - Richer tonal palette: Warm ivory (#F7F5EF), champagne highlights (#FAF4E8, #F5EEDB),
 *   deep botanical green (#072D26, #0B4036), pale sage (#E4ECE6), soft translucent sage (#8DAA9D, #B3C9BE),
 *   muted coral (#DF6E53), and delicate warm grey (#D8D3C8).
 * - Visual storytelling (Simplified & Editorial, NOT a dashboard):
 *   1. Soft champagne and pale-sage ambient directional lighting.
 *   2. Restrained anatomical vessel contour in the background.
 *   3. ONE elegant Doppler waveform illustration: spectral velocity curve with systolic peak.
 *   4. ONE subtle ultrasound-inspired visual detail: acoustic insonation arcs in soft sage.
 *   5. ONE refined clinical measurement illustration: delicate precision caliper measurement ticks.
 *   6. Exactly ONE slow, tranquil highlight gliding along the Doppler curve (13s linear).
 * - Maximum breathing space for the 3 primary medical destination icons.
 */
export const ClinicalKnowledgeSvg: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft Warm Ivory Base Gradient */}
        <linearGradient id="ck04BaseBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBF9F4" />
          <stop offset="50%" stopColor="#F7F5EF" />
          <stop offset="100%" stopColor="#EDE6DA" />
        </linearGradient>

        {/* Ambient Champagne Directional Glow */}
        <radialGradient id="ck04ChampagneGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FAF4E8" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#F5EEDB" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#E4ECE6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F7F5EF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm Ivory Base Canvas */}
      <rect width="1200" height="560" fill="url(#ck04BaseBg)" />

      {/* Ambient Champagne Directional Lighting */}
      <ellipse
        cx="600"
        cy="280"
        rx="440"
        ry="240"
        fill="url(#ck04ChampagneGlow)"
        className="svg-bg-breathe"
      />

      {/* ===================================================================== */}
      {/* CENTRAL VISUAL ANCHOR: MINIMALIST CLINICAL DIAGNOSTIC ARTWORK         */}
      {/* Restrained anatomical contour + Doppler waveform + Ultrasound arcs    */}
      {/* ===================================================================== */}
      <g strokeLinecap="round">
        {/* 1. Restrained Anatomical Vessel Contour in Background */}
        <path
          d="M 320,380 C 420,380 500,320 600,320 C 700,320 780,260 880,260"
          fill="none"
          stroke="#E4ECE6"
          strokeWidth="8"
          strokeOpacity="0.80"
        />
        <path
          d="M 320,380 C 420,380 500,320 600,320 C 700,320 780,260 880,260"
          fill="none"
          stroke="#B3C9BE"
          strokeWidth="1.6"
          strokeOpacity="0.40"
          strokeDasharray="5 5"
        />

        {/* 2. Ultrasound-Inspired Acoustic Insonation Arcs (Soft Sage) */}
        <path
          d="M 540,195 C 580,180 620,180 660,195"
          fill="none"
          stroke="#8DAA9D"
          strokeWidth="1.6"
          strokeOpacity="0.40"
        />
        <path
          d="M 520,175 C 570,155 630,155 680,175"
          fill="none"
          stroke="#8DAA9D"
          strokeWidth="1.2"
          strokeOpacity="0.30"
          strokeDasharray="4 3"
        />
        <path
          d="M 500,155 C 560,132 640,132 700,155"
          fill="none"
          stroke="#D8D3C8"
          strokeWidth="1.0"
          strokeOpacity="0.35"
        />

        {/* 3. One Elegant Doppler Waveform Illustration */}
        {/* Doppler Zero-Velocity Baseline */}
        <line
          x1="360"
          y1="270"
          x2="840"
          y2="270"
          stroke="#0B4036"
          strokeWidth="1.4"
          strokeOpacity="0.30"
        />

        {/* Systolic Peak & Diastolic Flow Curve */}
        <path
          d="M 380,270 
             C 430,270 450,225 470,225 
             C 490,225 510,270 540,270 
             C 570,270 590,205 610,205 
             C 630,205 650,270 680,270 
             C 710,270 730,230 750,230 
             C 770,230 790,270 820,270"
          fill="none"
          stroke="#072D26"
          strokeWidth="2.4"
          strokeOpacity="0.55"
        />

        {/* 4. One Refined Clinical Measurement / Caliper Detail */}
        {/* Caliper Baseline Indicator on the second peak (x: 590-630, y: 205) */}
        <g stroke="#DF6E53" strokeWidth="1.2" strokeOpacity="0.65">
          <line x1="600" y1="205" x2="620" y2="205" />
          <line x1="600" y1="200" x2="600" y2="210" />
          <line x1="620" y1="200" x2="620" y2="210" />
        </g>
      </g>

      {/* ===================================================================== */}
      {/* LIVING MOTION: EXACTLY ONE TRANQUIL HIGHLIGHT ALONG DOPPLER CURVE     */}
      {/* Glides gracefully across the diagnostic wave (13s linear)             */}
      {/* ===================================================================== */}
      <path
        d="M 380,270 
           C 430,270 450,225 470,225 
           C 490,225 510,270 540,270 
           C 570,270 590,205 610,205 
           C 630,205 650,270 680,270 
           C 710,270 730,230 750,230 
           C 770,230 790,270 820,270"
        fill="none"
        stroke="#DF6E53"
        strokeWidth="3.0"
        strokeOpacity="0.80"
        strokeDasharray="24 360"
        className="svg-path-pulse-slow"
      />
    </svg>
  );
};
