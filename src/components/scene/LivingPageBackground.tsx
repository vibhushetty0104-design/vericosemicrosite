import React, { useEffect, useRef, useState } from 'react';
import './livingBackgrounds.css';

export type PageBackgroundVariant =
  | 'home'
  | 'learn'
  | 'assessment'
  | 'doppler'
  | 'treatments'
  | 'specialists'
  | 'journey'
  | 'insurance'
  | 'research'
  | 'dashboard';

interface LivingPageBackgroundProps {
  variant: PageBackgroundVariant;
  className?: string;
}

/**
 * LivingPageBackground
 *
 * Reusable, performant motion system providing page-specific living atmospheres:
 * - Each major page receives an intentional visual treatment reflecting its clinical purpose.
 * - Colors adhere to Meridian Vascular brand: Forest (#0B4036), Sage (#8DAA9D), Pale Sage (#E4ECE6), Terracotta (#CE5B40).
 * - Pauses automatically when off-screen or when browser tab is hidden.
 * - Complete static fallback under prefers-reduced-motion.
 */
export const LivingPageBackground: React.FC<LivingPageBackgroundProps> = ({ variant, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPaused(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsPaused(!inView);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`living-bg-container pointer-events-none select-none ${className}`}
      style={{
        ['--living-play-state' as any]: isPaused ? 'paused' : 'running',
      }}
    >
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-60"
      >
        {/* =========================================================================
            VARIANT 1: LEARN — Organic Branching Vein Networks & Valvular Sinus Arcs
           ========================================================================= */}
        {variant === 'learn' && (
          <g className="living-pulse-slow">
            {/* Subtle cephalad circulatory flow lines */}
            <path
              d="M 1200 900 C 1180 720, 1140 560, 1180 380 C 1210 240, 1290 160, 1340 0"
              stroke="#8DAA9D"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="living-flow-stream"
              opacity="0.45"
            />
            <path
              d="M 1040 900 C 1060 740, 1100 620, 1180 380"
              stroke="#E4ECE6"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* Bicuspid valve sinus arches */}
            <path
              d="M 1160 520 C 1170 510, 1190 510, 1200 520"
              stroke="#0B4036"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M 1160 380 C 1170 370, 1190 370, 1200 380"
              stroke="#0B4036"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.3"
            />
            <circle cx="1180" cy="380" r="4" fill="#CE5B40" opacity="0.35" />
          </g>
        )}

        {/* =========================================================================
            VARIANT 2: ASSESSMENT — Calm, Quiet Diagnostic Rhythm & Supportive Arcs
           ========================================================================= */}
        {variant === 'assessment' && (
          <g className="living-pulse-slow">
            {/* Gentle, non-intrusive breathing horizon curves */}
            <path
              d="M 0 350 C 360 310, 720 390, 1080 330 C 1260 300, 1380 340, 1440 330"
              stroke="#8DAA9D"
              strokeWidth="1.75"
              strokeDasharray="6 12"
              opacity="0.35"
            />
            <path
              d="M 0 520 C 420 480, 840 560, 1260 500 C 1360 485, 1410 495, 1440 490"
              stroke="#E4ECE6"
              strokeWidth="2.25"
              opacity="0.4"
            />
          </g>
        )}

        {/* =========================================================================
            VARIANT 3: DOPPLER — Hemodynamic Acoustic Waves & Laminar Streamlines
           ========================================================================= */}
        {variant === 'doppler' && (
          <g>
            {/* Acoustic Doppler sweep beam */}
            <g className="living-doppler-beam">
              <path
                d="M 1020 0 L 1380 900"
                stroke="#CE5B40"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                opacity="0.25"
              />
              <path
                d="M 1120 0 L 1440 800"
                stroke="#0B4036"
                strokeWidth="1.5"
                strokeDasharray="8 12"
                opacity="0.2"
              />
            </g>
            {/* Frequency velocity streamlines */}
            <path
              d="M 960 900 C 1040 700, 1140 500, 1080 300 C 1040 160, 1120 60, 1180 0"
              stroke="#8DAA9D"
              strokeWidth="2"
              className="living-flow-stream"
              opacity="0.35"
            />
          </g>
        )}

        {/* =========================================================================
            VARIANT 4: TREATMENTS — Endovenous Catheter Pathways & Subtle Thermal Nodes
           ========================================================================= */}
        {variant === 'treatments' && (
          <g>
            {/* Catheter guidance trajectory line */}
            <path
              d="M 1180 900 C 1160 680, 1120 460, 1150 240 C 1170 120, 1220 40, 1260 0"
              stroke="#0B4036"
              strokeWidth="2"
              strokeDasharray="6 8"
              opacity="0.3"
            />
            {/* Targeted thermal ablation focal nodes */}
            <g className="living-thermal-glow">
              <circle cx="1150" cy="240" r="28" fill="#CE5B40" fillOpacity="0.08" />
              <circle cx="1150" cy="240" r="14" fill="#CE5B40" fillOpacity="0.18" />
              <circle cx="1150" cy="240" r="3.5" fill="#CE5B40" opacity="0.65" />

              <circle cx="1135" cy="460" r="20" fill="#CE5B40" fillOpacity="0.06" />
              <circle cx="1135" cy="460" r="3" fill="#CE5B40" opacity="0.5" />
            </g>
          </g>
        )}

        {/* =========================================================================
            VARIANT 5: SPECIALISTS — Interconnected Clinical Hubs & Geographic Beacons
           ========================================================================= */}
        {variant === 'specialists' && (
          <g>
            {/* Interconnecting clinical constellation filaments */}
            <path
              d="M 1080 260 L 1260 380 L 1180 560 L 1340 680"
              stroke="#8DAA9D"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              opacity="0.35"
            />
            {/* Metro healthcare nodes (Bengaluru, Mumbai, Delhi, Hyderabad, Chennai) */}
            <g className="living-node-beacon">
              <circle cx="1080" cy="260" r="4.5" fill="#0B4036" opacity="0.5" />
              <circle cx="1260" cy="380" r="5" fill="#CE5B40" opacity="0.6" />
              <circle cx="1180" cy="560" r="4" fill="#0B4036" opacity="0.45" />
              <circle cx="1340" cy="680" r="4.5" fill="#8DAA9D" opacity="0.55" />
            </g>
          </g>
        )}

        {/* =========================================================================
            VARIANT 6: JOURNEY — Sequential Care Pathway Track with Milestone Flow
           ========================================================================= */}
        {variant === 'journey' && (
          <g className="living-pulse-slow">
            {/* Continuous serpentine care roadmap ribbon */}
            <path
              d="M 1120 900 C 1040 760, 1260 620, 1140 460 C 1040 320, 1220 180, 1160 0"
              stroke="#8DAA9D"
              strokeWidth="2.75"
              strokeLinecap="round"
              className="living-flow-stream"
              opacity="0.4"
            />
            {/* Step station markers */}
            <circle cx="1140" cy="460" r="5" fill="#CE5B40" opacity="0.6" />
            <circle cx="1140" cy="460" r="14" stroke="#CE5B40" strokeWidth="1" opacity="0.25" />
          </g>
        )}

        {/* =========================================================================
            VARIANT 7: INSURANCE — Structured Policy & Document Guideline Grid
           ========================================================================= */}
        {variant === 'insurance' && (
          <g className="living-pulse-slow">
            {/* Architectural document alignment measures */}
            <line x1="980" y1="0" x2="980" y2="900" stroke="#E4ECE6" strokeWidth="1.5" opacity="0.6" />
            <line x1="1240" y1="0" x2="1240" y2="900" stroke="#8DAA9D" strokeWidth="1" strokeDasharray="6 8" opacity="0.3" />
            <line x1="880" y1="360" x2="1440" y2="360" stroke="#E4ECE6" strokeWidth="1.5" opacity="0.5" />
            <line x1="880" y1="620" x2="1440" y2="620" stroke="#E4ECE6" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
          </g>
        )}

        {/* =========================================================================
            VARIANT 8: RESEARCH — Scholarly Baselines & Curated Citation Notations
           ========================================================================= */}
        {variant === 'research' && (
          <g className="living-pulse-slow">
            {/* Editorial library baselines & bracket accents */}
            <path
              d="M 1040 220 L 1380 220 M 1080 340 L 1340 340 M 1040 460 L 1380 460"
              stroke="#8DAA9D"
              strokeWidth="1.25"
              strokeDasharray="8 12"
              opacity="0.3"
            />
            {/* Citation node marker */}
            <rect x="1220" y="336" width="8" height="8" rx="2" fill="#CE5B40" opacity="0.4" />
          </g>
        )}

        {/* =========================================================================
            VARIANT 9: DASHBOARD — Demonstrative Session Contour Lines
           ========================================================================= */}
        {variant === 'dashboard' && (
          <g className="living-pulse-slow">
            <circle cx="1200" cy="300" r="180" stroke="#8DAA9D" strokeWidth="1" strokeDasharray="4 8" opacity="0.25" />
            <circle cx="1200" cy="300" r="100" stroke="#E4ECE6" strokeWidth="1.5" opacity="0.4" />
            <circle cx="1200" cy="300" r="5" fill="#0B4036" opacity="0.45" />
          </g>
        )}

        {/* =========================================================================
            VARIANT 10: HOME — Living Vascular Tributaries
           ========================================================================= */}
        {variant === 'home' && (
          <g className="living-pulse-slow">
            <path
              d="M 1100 900 C 1060 740, 1000 580, 1060 400 C 1100 280, 1180 180, 1220 0"
              stroke="#8DAA9D"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="living-flow-stream"
              opacity="0.4"
            />
            <circle cx="1060" cy="400" r="4.5" fill="#CE5B40" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
};
