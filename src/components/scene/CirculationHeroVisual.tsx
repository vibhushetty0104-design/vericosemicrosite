import React, { useState } from 'react';
import { Activity, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface CirculationHeroVisualProps {
  onNavigateToDoppler: () => void;
  onNavigateToCirculation?: () => void;
}

type AnatomicZone = 'superficial' | 'deep' | 'perforators';

/**
 * CirculationHeroVisual
 *
 * Prominent medical circulation visual for the homepage hero.
 * Features a high-fidelity vector illustration of the lower limb,
 * showing oxygenated arterial descent, deoxygenated venous ascent,
 * and communicating perforator valves with living circulation pulses.
 */
export const CirculationHeroVisual: React.FC<CirculationHeroVisualProps> = ({
  onNavigateToDoppler,
  onNavigateToCirculation = () => {
    window.location.hash = '#learn/leg-circulation';
  },
}) => {
  const [activeZone, setActiveZone] = useState<AnatomicZone>('superficial');

  const zoneDetails: Record<AnatomicZone, { title: string; subtitle: string; clinicalRole: string }> = {
    superficial: {
      title: 'Superficial System (Great Saphenous Vein)',
      subtitle: 'Runs beneath skin along inner calf and thigh to the groin (SFJ).',
      clinicalRole: 'Primary site of valvular incompetence resulting in visible varicose bulging.',
    },
    deep: {
      title: 'Deep System (Femoral & Popliteal Veins)',
      subtitle: 'Enclosed deep within the calf muscle pump and thigh compartments.',
      clinicalRole: 'Returns >90% of venous blood to the heart; must be verified open (patent) before care.',
    },
    perforators: {
      title: 'Communicating Perforator Veins',
      subtitle: 'Bridge superficial surface veins to the deep muscular channels.',
      clinicalRole: 'Equipped with one-way valves that prevent high deep pressures from forcing blood outward.',
    },
  };

  return (
    <div
      aria-label="Lower extremity venous circulation diagram"
      className="w-full rounded-2xl sm:rounded-3xl border border-mv-sage/35 bg-[#082D26]/85 p-4 sm:p-5 backdrop-blur-md shadow-[0_12px_36px_rgba(4,35,30,0.45)] transition-all hover:border-mv-sage/60"
    >
      {/* Header Bar */}
      <div className="flex items-start justify-between gap-3 border-b border-mv-sage/20 pb-3">
        <div>
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-mv-terracotta">
            Clinical Circulation Map
          </span>
          <h2 className="font-serif text-[16.5px] sm:text-[18px] font-semibold text-white leading-snug mt-0.5">
            How Blood Returns from the Leg
          </h2>
        </div>

        <span className="flex items-center gap-1.5 rounded-full bg-mv-forest px-2.5 py-1 text-[11px] font-mono font-medium text-mv-pale border border-mv-sage/30 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Normal Upward Return</span>
        </span>
      </div>

      {/* Main Vector Circulation Stage */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        
        {/* Left / Center: Vector Anatomy Illustration */}
        <div className="sm:col-span-6 relative flex items-center justify-center p-2 rounded-xl bg-mv-forest/40 border border-mv-sage/15 overflow-hidden">
          <svg
            viewBox="0 0 320 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-h-[260px] sm:max-h-[290px] object-contain select-none"
            aria-hidden="true"
          >
            <defs>
              {/* Dimensional Leg Silhouette Gradient */}
              <linearGradient id="hero-leg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#E4ECE6" stopOpacity="0.90" />
                <stop offset="100%" stopColor="#D5DFD9" stopOpacity="0.85" />
              </linearGradient>

              {/* Arterial Gradient */}
              <linearGradient id="hero-artery-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E0523C" />
                <stop offset="50%" stopColor="#CE5B40" />
                <stop offset="100%" stopColor="#A9472F" />
              </linearGradient>

              {/* Venous Gradient */}
              <linearGradient id="hero-vein-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#145D4F" />
                <stop offset="50%" stopColor="#0B4036" />
                <stop offset="100%" stopColor="#041E19" />
              </linearGradient>

              {/* Subtle Pulse Glow */}
              <filter id="hero-pulse-blur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>

            {/* Leg Ground Shadow */}
            <ellipse cx="140" cy="415" rx="70" ry="10" fill="#041E19" fillOpacity="0.25" />

            {/* Human Lower Limb Anatomical Silhouette */}
            <path
              d="M95,30 C110,30 145,35 175,42 C188,70 194,95 198,120 C206,150 218,185 214,210 C211,230 198,250 200,275 C202,295 194,315 198,332 C203,345 198,362 176,370 C148,378 112,378 88,366 C76,358 72,346 82,326 C88,310 96,286 98,262 C100,230 92,182 88,150 C83,118 88,82 95,30 Z"
              fill="url(#hero-leg-grad)"
              stroke="#8DAA9D"
              strokeWidth="1.2"
              strokeOpacity="0.6"
            />

            {/* Arterial Pathway (Oxygenated Downward Blood Supply) */}
            <g id="hero-artery-group" opacity={activeZone === 'deep' ? '0.4' : '0.85'}>
              <path
                d="M122,30 C124,60 128,88 130,118 C132,150 135,178 143,206 C146,218 154,238 152,258 C150,278 142,306 134,330 C129,342 126,354 133,360"
                fill="none"
                stroke="url(#hero-artery-grad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Arterial downward flow pulse */}
              <circle r="2.2" fill="#FDFCF9" filter="url(#hero-pulse-blur)">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M122,30 C124,60 128,88 130,118 C132,150 135,178 143,206 C146,218 154,238 152,258 C150,278 142,306 134,330 C129,342 126,354 133,360"
                />
              </circle>
            </g>

            {/* Deep Venous System (Femoral & Popliteal Pathway) */}
            <g
              id="hero-deep-system"
              className="transition-opacity duration-300"
              opacity={activeZone === 'deep' ? '1' : activeZone === 'superficial' ? '0.6' : '0.75'}
            >
              <path
                d="M108,30 C112,62 115,90 117,120 C118,152 121,180 129,208 C132,220 140,240 139,260 C137,280 129,308 121,332 C116,344 113,356 120,362"
                fill="none"
                stroke="url(#hero-vein-grad)"
                strokeWidth={activeZone === 'deep' ? '6.5' : '5.5'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Living Upward Venous Flow Pulse along Deep Vein */}
              <circle r="2.6" fill="#8DAA9D" filter="url(#hero-pulse-blur)">
                <animateMotion
                  dur="4.5s"
                  repeatCount="indefinite"
                  path="M120,362 C113,356 116,344 121,332 C129,308 137,280 139,260 C140,240 132,220 129,208 C121,180 118,152 117,120 C115,90 112,62 108,30"
                />
              </circle>
            </g>

            {/* Superficial Great Saphenous Vein (GSV) Pathway */}
            <g
              id="hero-superficial-system"
              className="transition-opacity duration-300"
              opacity={activeZone === 'superficial' ? '1' : '0.65'}
            >
              <path
                d="M100,30 C104,82 105,118 102,154 C99,190 96,226 100,262 C104,298 101,326 92,352"
                fill="none"
                stroke="#8DAA9D"
                strokeWidth={activeZone === 'superficial' ? '4.2' : '3.2'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Upward Venous Return Pulse along GSV */}
              <circle r="2.5" fill="#CE5B40" filter="url(#hero-pulse-blur)">
                <animateMotion
                  dur="5s"
                  begin="0.8s"
                  repeatCount="indefinite"
                  path="M92,352 C101,326 104,298 100,262 C96,226 99,190 102,154 C105,118 104,82 100,30"
                />
              </circle>
            </g>

            {/* Perforator Veins (Connecting Bridges) */}
            <g
              id="hero-perforators"
              stroke="#CE5B40"
              strokeWidth={activeZone === 'perforators' ? '2.4' : '1.8'}
              strokeLinecap="round"
              className="transition-opacity duration-300"
              opacity={activeZone === 'perforators' ? '1' : '0.75'}
            >
              <line x1="116" y1="88" x2="105" y2="85" strokeDasharray="2 2" />
              <line x1="119" y1="160" x2="102" y2="155" strokeDasharray="2 2" />
              <line x1="131" y1="216" x2="98" y2="208" strokeDasharray="2 2" />
              <line x1="139" y1="256" x2="101" y2="248" strokeDasharray="2 2" />
              <line x1="126" y1="316" x2="96" y2="307" strokeDasharray="2 2" />

              {/* Junction Dots */}
              <circle cx="105" cy="85" r="2" fill="#CE5B40" />
              <circle cx="102" cy="155" r="2" fill="#CE5B40" />
              <circle cx="98" cy="208" r="2" fill="#CE5B40" />
              <circle cx="101" cy="248" r="2.5" fill="#CE5B40" />
              <circle cx="96" cy="307" r="2" fill="#CE5B40" />
            </g>

            {/* Upward Flow Directional Chevrons */}
            <path d="M112,64 L111,56 M111,56 L108,60 M111,56 L114,60" stroke="#CE5B40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M103,116 L102,108 M102,108 L99,112 M102,108 L105,112" stroke="#E4ECE6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M121,196 L120,188 M120,188 L117,192 M120,188 L123,192" stroke="#CE5B40" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M98,244 L97,236 M97,236 L94,240 M97,236 L100,240" stroke="#E4ECE6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Right: Anatomical Zone Selector & Educational Breakdown */}
        <div className="sm:col-span-6 flex flex-col justify-between h-full py-1">
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-mv-sage block mb-1">
              Interactive Vessel Layers
            </span>

            {/* Zone Selector Buttons */}
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setActiveZone('superficial')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-[12.5px] transition-all cursor-pointer ${
                  activeZone === 'superficial'
                    ? 'bg-mv-pale text-mv-forest font-semibold shadow-xs'
                    : 'bg-mv-forest/40 text-mv-pale hover:bg-mv-forest/70'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#8DAA9D]" />
                  <span>Superficial GSV</span>
                </span>
                <span className="font-mono text-[10px] opacity-80">Skin Layer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveZone('deep')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-[12.5px] transition-all cursor-pointer ${
                  activeZone === 'deep'
                    ? 'bg-mv-pale text-mv-forest font-semibold shadow-xs'
                    : 'bg-mv-forest/40 text-mv-pale hover:bg-mv-forest/70'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Deep Venous System</span>
                </span>
                <span className="font-mono text-[10px] opacity-80">90% Volume</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveZone('perforators')}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-[12.5px] transition-all cursor-pointer ${
                  activeZone === 'perforators'
                    ? 'bg-mv-pale text-mv-forest font-semibold shadow-xs'
                    : 'bg-mv-forest/40 text-mv-pale hover:bg-mv-forest/70'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#CE5B40]" />
                  <span>Communicating Perforators</span>
                </span>
                <span className="font-mono text-[10px] opacity-80">One-Way</span>
              </button>
            </div>

            {/* Dynamic Zone Educational Note */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-mv-forest-press/70 border border-mv-sage/20 text-[12px] text-mv-pale leading-relaxed">
              <strong className="text-white block font-medium mb-0.5">{zoneDetails[activeZone].title}</strong>
              <span className="text-mv-sage/90 block mb-1">{zoneDetails[activeZone].subtitle}</span>
              <span className="text-mv-pale/90 text-[11.5px] block border-t border-mv-sage/20 pt-1">
                {zoneDetails[activeZone].clinicalRole}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-3 pt-2.5 border-t border-mv-sage/20 flex items-center justify-between gap-3 text-[12px]">
            <a
              href="#doppler"
              onClick={(e) => {
                e.preventDefault();
                trackEvent('hero_secondary_cta_click', { target: 'doppler' });
                onNavigateToDoppler();
              }}
              className="inline-flex items-center gap-1 font-semibold text-mv-terracotta hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              <span>Doppler scan guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="#learn/leg-circulation"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToCirculation();
              }}
              className="text-mv-pale hover:text-white transition-colors"
            >
              <span>Full simulation →</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
