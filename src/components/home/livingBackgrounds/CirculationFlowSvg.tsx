import React from 'react';

/**
 * ENVIRONMENT 03 — CIRCULATION FLOW (Living Medical Atlas)
 * Art Direction:
 * - Richer tonal palette: Warm ivory (#F7F5EF), champagne highlights (#FAF4E8, #F5EEDB),
 *   deep botanical green (#072D26, #0B4036), pale sage (#E4ECE6), soft translucent sage (#8DAA9D, #B3C9BE),
 *   muted coral (#DF6E53), and delicate warm grey (#D8D3C8).
 * - Visual storytelling:
 *   1. Dynamic, fluid branching circulation pathways with soft directional lighting.
 *   2. Layered translucent vascular channels in pale sage and champagne.
 *   3. Venous upward return streamline in forest green and systemic counter-curve in muted coral.
 *   4. Elegant directional flow chevron accents softly integrated into the stream.
 *   5. Exactly TWO slow, graceful hemodynamic highlights (11s and 14s linear).
 * - Generous breathing space for the 3 medical destination icons.
 */
export const CirculationFlowSvg: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft Warm Ivory Base Gradient */}
        <linearGradient id="cf03BaseBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBF9F5" />
          <stop offset="50%" stopColor="#F7F5EF" />
          <stop offset="100%" stopColor="#EDE6DA" />
        </linearGradient>

        {/* Ambient Champagne Directional Glow */}
        <radialGradient id="cf03ChampagneGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#FAF4E8" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#F5EEDB" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#E4ECE6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F7F5EF" stopOpacity="0" />
        </radialGradient>

        {/* Sculptural Flow Ribbon Shading */}
        <linearGradient id="cf03RibbonGrad" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#E4ECE6" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#B3C9BE" stopOpacity="0.25" />
          <stop offset="65%" stopColor="#F5EEDB" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#E4ECE6" stopOpacity="0.20" />
        </linearGradient>
      </defs>

      {/* Warm Ivory Base Canvas */}
      <rect width="1200" height="560" fill="url(#cf03BaseBg)" />

      {/* Ambient Champagne Directional Lighting */}
      <ellipse
        cx="600"
        cy="280"
        rx="440"
        ry="240"
        fill="url(#cf03ChampagneGlow)"
        className="svg-bg-breathe"
      />

      {/* ===================================================================== */}
      {/* CENTRAL VISUAL ANCHOR: FLUID BRANCHING CIRCULATION PATHWAYS           */}
      {/* Dynamic, fluid, and medically inspired; generous negative space      */}
      {/* ===================================================================== */}
      {/* Translucent Sculptural Circulation Channel Ribbon */}
      <path
        d="M -20,380 
           C 250,440 400,280 620,310 
           C 840,340 980,210 1220,230 
           L 1220,300 
           C 980,280 840,410 620,380 
           C 400,350 250,510 -20,450 
           Z"
        fill="url(#cf03RibbonGrad)"
      />

      {/* Primary Directional Circulation Streamlines */}
      <g fill="none" strokeLinecap="round">
        {/* Main Upward Venous Return Pathway (Forest Green) */}
        <path
          d="M -10,400 C 240,460 410,290 620,320 C 830,350 990,220 1210,240"
          stroke="#0B4036"
          strokeWidth="2.6"
          strokeOpacity="0.45"
        />

        {/* Counter Systemic Streamline (Muted Coral) */}
        <path
          d="M -10,320 C 250,260 430,360 660,270 C 890,180 1040,240 1210,190"
          stroke="#DF6E53"
          strokeWidth="2.0"
          strokeOpacity="0.40"
        />

        {/* Secondary Boundary Guide (Soft Sage) */}
        <path
          d="M 120,440 C 350,500 500,340 720,370 C 940,400 1080,270 1220,290"
          stroke="#8DAA9D"
          strokeWidth="1.4"
          strokeOpacity="0.30"
          strokeDasharray="4 4"
        />

        {/* Integrated Directional Flow Chevrons (Indicating laminar venous direction) */}
        <g stroke="#0B4036" strokeWidth="1.6" strokeOpacity="0.45">
          <path d="M 520,315 L 526,312 L 520,309" />
          <path d="M 720,335 L 726,332 L 720,329" />
        </g>
        <g stroke="#DF6E53" strokeWidth="1.6" strokeOpacity="0.45">
          <path d="M 560,302 L 566,299 L 560,296" />
        </g>
      </g>

      {/* ===================================================================== */}
      {/* LIVING MOTION: EXACTLY TWO TRANQUIL DIRECTIONAL FLOW HIGHLIGHTS       */}
      {/* Glides gracefully along circulation curves (11s and 14s linear)       */}
      {/* ===================================================================== */}
      {/* Venous Upward Return Highlight (Coral) */}
      <path
        d="M -10,400 C 240,460 410,290 620,320 C 830,350 990,220 1210,240"
        fill="none"
        stroke="#DF6E53"
        strokeWidth="3.0"
        strokeOpacity="0.80"
        strokeDasharray="26 340"
        className="svg-path-pulse-slow"
      />

      {/* Systemic Flow Highlight (Sage) */}
      <path
        d="M -10,320 C 250,260 430,360 660,270 C 890,180 1040,240 1210,190"
        fill="none"
        stroke="#8DAA9D"
        strokeWidth="2.4"
        strokeOpacity="0.80"
        strokeDasharray="22 300"
        className="svg-path-pulse-medium"
      />
    </svg>
  );
};
