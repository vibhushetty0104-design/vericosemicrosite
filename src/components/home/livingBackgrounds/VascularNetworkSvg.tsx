import React from 'react';

/**
 * ENVIRONMENT 01 — VASCULAR NETWORK (Living Medical Atlas)
 * Art Direction:
 * - Richer tonal palette: Warm ivory (#F7F5EF), champagne highlights (#FAF4E8, #F5EEDB),
 *   deep botanical green (#072D26, #0B4036), soft translucent sage (#8DAA9D, #B3C9BE),
 *   muted coral (#DF6E53), and delicate warm grey (#E2DDD2).
 * - Visual storytelling:
 *   1. Soft directional champagne and pale-sage ambient lighting.
 *   2. Primary Great Saphenous Vein in botanical green with layered endothelial translucent walls.
 *   3. Deep femoral return conduit in soft sage.
 *   4. Anatomical bicuspid valve detail at mid-thigh and knee levels.
 *   5. Fine branching capillary arborization tapering outward gracefully.
 *   6. Exactly ONE slow, serene champagne-coral flow highlight (13s linear).
 * - Clean, generous negative space around the 4 destination icons.
 */
export const VascularNetworkSvg: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft Warm Ivory Base Gradient */}
        <linearGradient id="vn01BaseBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBF9F4" />
          <stop offset="45%" stopColor="#F7F5EF" />
          <stop offset="100%" stopColor="#ECE6DA" />
        </linearGradient>

        {/* Ambient Champagne Directional Light */}
        <radialGradient id="vn01ChampagneLight" cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FAF4E8" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#F5EEDB" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#E4ECE6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F7F5EF" stopOpacity="0" />
        </radialGradient>

        {/* Translucent Botanical Tissue Wash */}
        <linearGradient id="vn01TissueWash" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E4ECE6" stopOpacity="0.65" />
          <stop offset="40%" stopColor="#B3C9BE" stopOpacity="0.20" />
          <stop offset="80%" stopColor="#FAF4E8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#F7F5EF" stopOpacity="0" />
        </linearGradient>

        {/* Main Saphenous Axis Gradient */}
        <linearGradient id="vn01GsvGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#072D26" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#0B4036" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#072D26" stopOpacity="0.40" />
        </linearGradient>

        {/* Delicate Arborization Tributary Gradient */}
        <linearGradient id="vn01CapillaryGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8DAA9D" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#B3C9BE" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#DF6E53" stopOpacity="0.30" />
        </linearGradient>
      </defs>

      {/* Warm Ivory Base Canvas */}
      <rect width="1200" height="560" fill="url(#vn01BaseBg)" />

      {/* Ambient Champagne Directional Lighting */}
      <ellipse
        cx="600"
        cy="260"
        rx="440"
        ry="250"
        fill="url(#vn01ChampagneLight)"
        className="svg-bg-breathe"
      />

      {/* Subtle Translucent Fascial Depth Plane */}
      <path
        d="M 120,-30 
           C 340,70 460,-20 680,60 
           C 900,140 1060,40 1230,110 
           L 1230,580 L 120,580 Z"
        fill="url(#vn01TissueWash)"
      />

      {/* ===================================================================== */}
      {/* CENTRAL VISUAL ANCHOR: REFINED BOTANICAL VASCULAR TREE                */}
      {/* Graceful, organic, and medically inspired; generous negative space   */}
      {/* ===================================================================== */}
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* Translucent Outer Vessel Halo */}
        <path
          d="M 590,560 C 585,460 575,370 595,280 C 615,190 635,110 640,-10"
          fill="none"
          stroke="#FAF4E8"
          strokeWidth="14"
          strokeOpacity="0.85"
        />
        <path
          d="M 590,560 C 585,460 575,370 595,280 C 615,190 635,110 640,-10"
          fill="none"
          stroke="#E4ECE6"
          strokeWidth="8"
          strokeOpacity="0.75"
        />

        {/* Great Saphenous Vein (GSV) Main Stem */}
        <path
          d="M 590,560 C 585,460 575,370 595,280 C 615,190 635,110 640,-10"
          fill="none"
          stroke="url(#vn01GsvGrad)"
          strokeWidth="3.4"
        />

        {/* Endothelial Vessel Lining Detail (Delicate Sage Guide) */}
        <path
          d="M 588,560 C 583,460 573,370 593,280 C 613,190 633,110 638,-10"
          fill="none"
          stroke="#B3C9BE"
          strokeWidth="1.2"
          strokeOpacity="0.50"
        />

        {/* Deep Femoral Conduit (Intermuscular Axis) */}
        <path
          d="M 628,560 C 622,450 625,350 622,250 C 620,170 652,80 656,-10"
          fill="none"
          stroke="#8DAA9D"
          strokeWidth="2.2"
          strokeOpacity="0.40"
          strokeDasharray="6 5"
        />

        {/* Fine Branching Capillary & Tributary Arborization */}
        {/* Upper Lateral Tributary (Anterior Accessory GSV) */}
        <path
          d="M 610,230 C 570,200 520,180 470,165"
          fill="none"
          stroke="url(#vn01CapillaryGrad)"
          strokeWidth="1.8"
        />
        <path
          d="M 530,185 C 500,175 470,185 440,180"
          fill="none"
          stroke="#B3C9BE"
          strokeWidth="1.2"
          strokeOpacity="0.40"
        />

        {/* Upper Medial Tributary (Posterior Arch) */}
        <path
          d="M 620,170 C 660,140 705,125 750,115"
          fill="none"
          stroke="url(#vn01CapillaryGrad)"
          strokeWidth="1.6"
        />
        <path
          d="M 680,135 C 715,120 740,105 770,95"
          fill="none"
          stroke="#B3C9BE"
          strokeWidth="1.2"
          strokeOpacity="0.40"
        />

        {/* Mid-Calf Communicating Perforator (Dodd Bridge) */}
        <path
          d="M 585,340 C 550,335 510,345 475,360"
          fill="none"
          stroke="#DF6E53"
          strokeWidth="1.6"
          strokeOpacity="0.50"
        />
        {/* Lower Ankle Communicating Bridge (Cockett Branch) */}
        <path
          d="M 580,440 C 600,435 615,436 625,438"
          fill="none"
          stroke="#DF6E53"
          strokeWidth="1.6"
          strokeOpacity="0.50"
        />

        {/* Anatomical Bicuspid Valve Details */}
        {/* Valve 1: Mid-Thigh */}
        <path
          d="M 596,215 C 603,212 607,206 609,202 M 616,215 C 611,212 609,206 609,202"
          fill="none"
          stroke="#072D26"
          strokeWidth="2.0"
          strokeOpacity="0.65"
        />
        {/* Valve 2: Knee Level */}
        <path
          d="M 582,315 C 588,312 592,306 594,302 M 602,315 C 597,312 595,306 594,302"
          fill="none"
          stroke="#072D26"
          strokeWidth="2.0"
          strokeOpacity="0.65"
        />
      </g>

      {/* ===================================================================== */}
      {/* LIVING MOTION: EXACTLY ONE TRANQUIL CHAMPAGNE-CORAL FLOW PULSE         */}
      {/* Glides gracefully upward along the saphenous stem (13s linear)         */}
      {/* ===================================================================== */}
      <path
        d="M 590,560 C 585,460 575,370 595,280 C 615,190 635,110 640,-10"
        fill="none"
        stroke="#DF6E53"
        strokeWidth="3.4"
        strokeOpacity="0.80"
        strokeDasharray="26 380"
        className="svg-path-pulse-slow"
      />
    </svg>
  );
};
