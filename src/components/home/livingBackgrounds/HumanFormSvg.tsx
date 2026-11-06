import React from 'react';

/**
 * ENVIRONMENT 02 — HUMAN FORM (Living Medical Atlas)
 * Art Direction:
 * - Richer tonal palette: Warm ivory (#F7F5EF), champagne glow (#FAF4E8, #F5EEDB),
 *   pale sage (#E4ECE6), soft translucent sage (#8DAA9D, #B3C9BE),
 *   muted coral (#DF6E53), and delicate warm grey (#D8D3C8, #E2DDD2).
 * - Visual storytelling:
 *   1. Soft directional lighting focused behind the lower-limb silhouette.
 *   2. Understated lower-body anatomical silhouette in translucent pale sage & champagne.
 *   3. Faint muscle & skeletal contours: gastrocnemius apex, patella, popliteal fold, Achilles guide.
 *   4. Delicate saphenous and deep intermuscular venous pathways.
 *   5. Subtle anatomical landmark indicators at the Saphenofemoral junction and calf apex.
 *   6. Exactly ONE slow, tranquil upward venous flow highlight (13s linear).
 * - Generous breathing space for the 3 medical destination icons.
 */
export const HumanFormSvg: React.FC = () => {
  return (
    <svg
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      aria-hidden="true"
    >
      <defs>
        {/* Soft Warm Ivory Base Gradient */}
        <linearGradient id="hf02BaseBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF8F2" />
          <stop offset="50%" stopColor="#F7F5EF" />
          <stop offset="100%" stopColor="#ECE6DA" />
        </linearGradient>

        {/* Ambient Champagne Directional Glow */}
        <radialGradient id="hf02ChampagneGlow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FAF4E8" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#F5EEDB" stopOpacity="0.40" />
          <stop offset="70%" stopColor="#E4ECE6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F7F5EF" stopOpacity="0" />
        </radialGradient>

        {/* Anatomical Silhouette Body Wash */}
        <linearGradient id="hf02LimbWash" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#FAF4E8" stopOpacity="0.80" />
          <stop offset="35%" stopColor="#E4ECE6" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#B3C9BE" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FAF4E8" stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Warm Ivory Base Canvas */}
      <rect width="1200" height="560" fill="url(#hf02BaseBg)" />

      {/* Ambient Champagne Directional Lighting */}
      <ellipse
        cx="600"
        cy="280"
        rx="400"
        ry="250"
        fill="url(#hf02ChampagneGlow)"
        className="svg-bg-breathe"
      />

      {/* ===================================================================== */}
      {/* CENTRAL VISUAL ANCHOR: UNDERSTATED LOWER-LIMB SILHOUETTE              */}
      {/* Softly integrated into the background; dignified and informative     */}
      {/* ===================================================================== */}
      <g>
        {/* Soft Translucent Limb Outer Glow */}
        <path
          d="M 565,-20 
             C 572,60 576,130 582,180 
             C 588,225 566,265 558,305 
             C 548,355 556,410 582,455 
             C 598,480 608,498 622,560 
             L 692,560 
             C 682,500 678,480 672,455 
             C 660,405 688,350 694,300 
             C 700,250 674,210 668,170 
             C 662,120 666,50 670,-20 
             Z"
          fill="url(#hf02LimbWash)"
          stroke="#0B4036"
          strokeWidth="1.6"
          strokeOpacity="0.30"
          strokeLinejoin="round"
        />

        {/* Faint Skeletal & Muscular Contours in Delicate Warm Grey & Sage */}
        {/* Patella / Knee Joint Curve */}
        <path
          d="M 574,225 C 604,218 638,218 668,225"
          fill="none"
          stroke="#D8D3C8"
          strokeWidth="1.6"
          strokeDasharray="4 4"
        />
        {/* Popliteal Fossa Posterior Fold */}
        <path
          d="M 580,255 C 610,248 640,248 665,255"
          fill="none"
          stroke="#E2DDD2"
          strokeWidth="1.4"
        />
        {/* Gastrocnemius Calf Muscle Apex Contour */}
        <path
          d="M 552,325 C 596,312 646,312 688,325"
          fill="none"
          stroke="#DF6E53"
          strokeWidth="1.4"
          strokeOpacity="0.45"
        />
        {/* Tibial Crest Anterior Guide */}
        <path
          d="M 590,260 C 588,330 592,400 596,480"
          fill="none"
          stroke="#8DAA9D"
          strokeWidth="1.2"
          strokeOpacity="0.25"
          strokeDasharray="3 3"
        />
        {/* Achilles Tendon Distal Axis */}
        <path
          d="M 648,460 C 646,490 644,520 642,550"
          fill="none"
          stroke="#D8D3C8"
          strokeWidth="1.4"
          strokeOpacity="0.40"
        />

        {/* Delicate Saphenous Venous Axis */}
        <path
          d="M 608,540 
             C 590,480 576,420 582,345 
             C 588,270 613,210 623,140 
             C 628,90 633,40 638,-10"
          fill="none"
          stroke="#0B4036"
          strokeWidth="2.8"
          strokeOpacity="0.50"
          strokeLinecap="round"
        />

        {/* Deep Popliteal Axis */}
        <path
          d="M 646,540 
             C 640,460 644,370 641,285 
             C 638,200 646,110 650,-10"
          fill="none"
          stroke="#8DAA9D"
          strokeWidth="1.8"
          strokeOpacity="0.35"
          strokeDasharray="5 4"
        />

        {/* Anatomical Landmark Glow Highlights */}
        {/* SFJ Landmark (Medial Upper Thigh) */}
        <circle cx="623" cy="140" r="12" fill="#FAF4E8" fillOpacity="0.8" />
        <circle cx="623" cy="140" r="3.5" fill="#DF6E53" />

        {/* Calf Muscle Pump Center */}
        <circle cx="582" cy="345" r="10" fill="#FAF4E8" fillOpacity="0.8" />
        <circle cx="582" cy="345" r="3" fill="#0B4036" />
      </g>

      {/* ===================================================================== */}
      {/* LIVING MOTION: EXACTLY ONE TRANQUIL UPWARD VENOUS RETURN HIGHLIGHT    */}
      {/* Glides gracefully upward through the limb axis (13s linear)           */}
      {/* ===================================================================== */}
      <path
        d="M 608,540 
           C 590,480 576,420 582,345 
           C 588,270 613,210 623,140 
           C 628,90 633,40 638,-10"
        fill="none"
        stroke="#DF6E53"
        strokeWidth="3.0"
        strokeOpacity="0.75"
        strokeDasharray="24 360"
        className="svg-path-pulse-slow"
      />
    </svg>
  );
};
