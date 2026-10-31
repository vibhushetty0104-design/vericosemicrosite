import React, { useState } from 'react';
import {
  Layers,
  Activity,
  ArrowDown,
  ArrowUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { ValvyCharacter } from './VascularCharacters';
import { GuideIcon, askGuideAbout } from '../content/guideLabels';

interface OverviewProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  onNavigateToDoppler?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  onOpenAiWithPrompt,
  onNavigateToDoppler,
}) => {
  const [activeNetwork, setActiveNetwork] = useState<'superficial' | 'deep' | 'perforator'>('superficial');
  const [valveState, setValveState] = useState<'healthy' | 'refluxing'>('refluxing');

  return (
    <section id="circulation-education" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-mv-ink-muted text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
              <span>HEMODYNAMICS &amp; ANATOMY</span>
              <span>·</span>
              <span>EDUCATIONAL GUIDE</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
              Understanding Leg Circulation &amp; Venous Valves
            </h2>
            <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-mv-ink-muted">
              Unlike arteries driven by the heart’s systolic pressure, leg veins must pump deoxygenated blood upwards against gravity. This return depends on the calf muscle pump and delicate bicuspid one-way valves.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-mono text-mv-forest bg-mv-ivory px-3.5 py-1.5 rounded-full border border-mv-outline shrink-0 self-start lg:self-auto">
            <ShieldCheck className="w-4 h-4 text-mv-forest" />
            <span>SVS &amp; AVF Anatomy Consensus</span>
          </div>
        </div>

        {/* Interactive Venous Valve Simulator (Editorial Canvas) */}
        <div className="mb-16 rounded-3xl border border-mv-outline/80 bg-white/95 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-mv-outline/60">
            <div className="flex items-start gap-4">
              {/* Valvy Companion in safe desktop simulator margin */}
              <div className="hidden lg:block pointer-events-none shrink-0">
                <ValvyCharacter size="sm" showBadge={false} />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-mv-terracotta block">
                  Interactive Demonstration
                </span>
                <h3 className="font-serif text-[22px] sm:text-[25px] font-semibold text-mv-forest mt-0.5 leading-snug">
                  How One-Way Venous Valves Work &amp; Fail
                </h3>
                <p className="text-[14.5px] sm:text-[15px] text-mv-ink-muted mt-1.5 max-w-xl leading-relaxed">
                  Toggle between a competent valve that blocks gravitational backflow and an incompetent valve where blood pools retrograde.
                </p>
              </div>
            </div>

            {/* Valve Toggle Controls */}
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-full border border-mv-outline/70 self-start md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setValveState('healthy')}
                className={`min-h-[44px] px-4.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                  valveState === 'healthy'
                    ? 'bg-mv-forest text-white shadow-xs'
                    : 'text-mv-ink-muted hover:text-mv-forest'
                }`}
              >
                Healthy Valve (No Reflux)
              </button>
              <button
                type="button"
                onClick={() => setValveState('refluxing')}
                className={`min-h-[44px] px-4.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                  valveState === 'refluxing'
                    ? 'bg-mv-terracotta text-white shadow-xs'
                    : 'text-mv-ink-muted hover:text-mv-forest'
                }`}
              >
                Incompetent Valve (Reflux &gt;500ms)
              </button>
            </div>
          </div>

          {/* Valve Visual Representation */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* SVG Schematic */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#FAF7F2] rounded-2xl border border-mv-outline/70">
              <svg viewBox="0 0 280 240" className="w-full max-w-[260px] h-auto">
                <defs>
                  <linearGradient id="veinWall" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1D6356" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1D6356" stopOpacity="0.08" />
                  </linearGradient>
                </defs>

                {/* Vein Vessel Column */}
                <rect x="70" y="20" width="140" height="200" rx="12" fill="url(#veinWall)" stroke="#0A3B32" strokeWidth="2.5" />

                {valveState === 'healthy' ? (
                  <>
                    {/* Closed Leaflets meeting in middle */}
                    <path d="M 70,120 Q 140,110 140,135" fill="none" stroke="#0A3B32" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M 210,120 Q 140,110 140,135" fill="none" stroke="#0A3B32" strokeWidth="4.5" strokeLinecap="round" />

                    {/* Upward Healthy Flow Arrow */}
                    <path d="M 140,200 L 140,155" stroke="#1D6356" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="140,145 132,160 148,160" fill="#1D6356" />

                    {/* Blood Cells Heartward */}
                    <circle cx="120" cy="180" r="5" fill="#1D6356" opacity="0.8" />
                    <circle cx="160" cy="185" r="5" fill="#1D6356" opacity="0.8" />
                    <circle cx="140" cy="80" r="5" fill="#1D6356" opacity="0.8" />
                    <circle cx="120" cy="60" r="5" fill="#1D6356" opacity="0.8" />

                    <text x="140" y="100" textAnchor="middle" fontSize="11" fill="#0A3B32" fontWeight="bold">
                      Valve Closed: Backflow Blocked
                    </text>
                    <text x="140" y="220" textAnchor="middle" fontSize="10" fill="#1D6356" fontWeight="bold">
                      ↑ Upward Flow Toward Heart
                    </text>
                  </>
                ) : (
                  <>
                    {/* Incompetent Separated Leaflets */}
                    <path d="M 70,115 Q 110,105 115,135" fill="none" stroke="#C85A3F" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 210,115 Q 170,105 165,135" fill="none" stroke="#C85A3F" strokeWidth="4" strokeLinecap="round" />

                    {/* Gap in middle */}
                    <line x1="115" y1="135" x2="165" y2="135" stroke="#C85A3F" strokeWidth="1.5" strokeDasharray="3 3" />

                    {/* Retrograde pooling downward arrows */}
                    <path d="M 140,60 L 140,165" stroke="#C85A3F" strokeWidth="4" strokeLinecap="round" />
                    <polygon points="140,175 132,160 148,160" fill="#C85A3F" />

                    {/* Clustered Stagnant Cells */}
                    <circle cx="130" cy="190" r="6" fill="#C85A3F" />
                    <circle cx="150" cy="195" r="6" fill="#C85A3F" />
                    <circle cx="138" cy="205" r="6" fill="#C85A3F" />

                    <text x="140" y="90" textAnchor="middle" fontSize="10" fill="#C85A3F" fontWeight="bold">
                      Gap &gt; Leaflet Failure
                    </text>
                    <text x="140" y="225" textAnchor="middle" fontSize="10" fill="#C85A3F" fontWeight="bold">
                      ↓ Pathologic Gravitational Reflux
                    </text>
                  </>
                )}
              </svg>

              <div className="mt-3 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold ${
                  valveState === 'healthy'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  {valveState === 'healthy' ? 'Normal Competence (<500ms)' : 'Pathologic Reflux (>500ms)'}
                </span>
              </div>
            </div>

            {/* Explanation & Hemodynamic Numbers */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6">
              <div>
                <h4 className="font-serif text-[20px] sm:text-[22px] font-semibold text-mv-forest">
                  {valveState === 'healthy'
                    ? "Normal Venous Coaptation & Calf Pump Synergy"
                    : "Valvular Incompetence, Venous Stasis & Varicose Bulges"}
                </h4>
                <p className="mt-2 text-[14.5px] leading-relaxed text-mv-ink-muted">
                  {valveState === 'healthy'
                    ? "Healthy vein valves are delicate bicuspid cusps lined with endothelium. When you take a step, contracting calf muscles propel blood upward. During relaxation, gravity attempts to pull blood backward; the cusps fill like parachutes, coapt in the midline, and stop retrograde flow within 0.5 seconds."
                    : "When vein walls stretch due to genetic collagen weakness, prolonged static standing, or prior thrombosis, the leaflets can no longer meet in the midline. Blood falls backward under gravity (reflux). Over months and years, the stagnant column of blood exerts continuous hydrostatic pressure (up to 90 mmHg), causing subcutaneous veins to dilate, tortuously elongate, and bulge as varicose veins."}
                </p>
              </div>

              {/* Hemodynamic Metric Comparison (Open Editorial Layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-mv-outline/50">
                <div className="pr-4 sm:border-r border-mv-outline/50">
                  <span className="text-[11px] font-mono text-mv-ink-muted uppercase tracking-wide block">
                    Walking Ankle Pressure
                  </span>
                  <span className={`text-[18px] font-bold font-mono mt-0.5 block ${
                    valveState === 'healthy' ? 'text-emerald-700' : 'text-mv-terracotta'
                  }`}>
                    {valveState === 'healthy' ? '20 – 30 mmHg (Normal)' : '60 – 90 mmHg (Hypertension)'}
                  </span>
                  <span className="text-[12px] text-mv-ink-muted/80 mt-0.5 block">
                    {valveState === 'healthy' ? 'Decompresses with walking' : 'Remains elevated even while walking'}
                  </span>
                </div>

                <div className="pl-0 sm:pl-2">
                  <span className="text-[11px] font-mono text-mv-ink-muted uppercase tracking-wide block">
                    Duplex Reflux Duration
                  </span>
                  <span className={`text-[18px] font-bold font-mono mt-0.5 block ${
                    valveState === 'healthy' ? 'text-emerald-700' : 'text-mv-terracotta'
                  }`}>
                    {valveState === 'healthy' ? '< 500 ms (0.5 sec)' : '> 500 ms (Up to 3+ sec)'}
                  </span>
                  <span className="text-[12px] text-mv-ink-muted/80 mt-0.5 block">
                    SVS / AVF diagnostic threshold for truncal saphenous disease
                  </span>
                </div>
              </div>

              {/* Contextual Action */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                {onNavigateToDoppler && (
                  <button
                    type="button"
                    onClick={onNavigateToDoppler}
                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-mv-forest hover:text-mv-terracotta transition-colors cursor-pointer min-h-[44px]"
                  >
                    <span>Read Doppler Ultrasound Guidelines</span>
                    <span>&rarr;</span>
                  </button>
                )}
                {onOpenAiWithPrompt && (
                  <button
                    type="button"
                    onClick={() => onOpenAiWithPrompt("How does venous valve failure cause varicose veins, and why does walking help?")}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-mv-forest bg-mv-ivory px-3.5 py-1.5 rounded-full hover:bg-mv-forest hover:text-white transition-all cursor-pointer border border-mv-outline/70 min-h-[44px]"
                  >
                    <GuideIcon className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                    <span>{askGuideAbout('venous reflux')}</span>
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* The Three Venous Networks Section */}
        <div className="mt-12">
          <div className="max-w-2xl mb-6">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0A3B32]/70 block">
              Venous Architecture
            </span>
            <h3 className="font-serif text-[26px] sm:text-[30px] font-semibold text-mv-forest mt-0.5">
              The Three Venous Networks of the Leg
            </h3>
            <p className="text-[15px] text-mv-ink-muted mt-2 leading-relaxed">
              Your leg contains three interconnected venous systems. Understanding which network is involved determines whether your condition requires routine outpatient ablation or urgent medical care.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Network 1: Superficial */}
            <div
              onClick={() => setActiveNetwork('superficial')}
              className={`p-6 rounded-3xl transition-all cursor-pointer flex flex-col justify-between ${
                activeNetwork === 'superficial'
                  ? 'bg-white shadow-xs border border-mv-terracotta/40 ring-1 ring-mv-terracotta/20'
                  : 'bg-white/60 border border-mv-outline/50 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-mv-terracotta/10 text-mv-terracotta">
                    Origin of Varicose Veins
                  </span>
                  <span className="text-[12px] font-mono text-mv-ink-muted">01</span>
                </div>
                <h4 className="font-serif text-[21px] font-semibold text-mv-forest">Superficial Venous System</h4>
                <p className="mt-2 text-[13.5px] text-mv-ink-muted leading-relaxed">
                  Located in the subcutaneous fat layer above the muscular fascia. Dominated by the <strong>Great Saphenous Vein (GSV)</strong> running inner ankle to groin, and the <strong>Small Saphenous Vein (SSV)</strong> along the calf back.
                </p>
                <div className="mt-4 space-y-2 text-[12.5px] text-mv-ink-muted border-t border-mv-outline/50 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-terracotta shrink-0" />
                    <span>Handles ~10% of total leg return</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-terracotta shrink-0" />
                    <span>Prone to bulging without muscular counter-support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-terracotta shrink-0" />
                    <span>Safely ablated with laser, RFA, or glue</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-mv-outline/50 text-[12px] font-mono text-mv-terracotta font-semibold">
                Target of EVLA / RFA / VenaSeal
              </div>
            </div>

            {/* Network 2: Deep System */}
            <div
              onClick={() => setActiveNetwork('deep')}
              className={`p-6 rounded-3xl transition-all cursor-pointer flex flex-col justify-between ${
                activeNetwork === 'deep'
                  ? 'bg-white shadow-xs border border-mv-forest/40 ring-1 ring-mv-forest/20'
                  : 'bg-white/60 border border-mv-outline/50 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-mv-forest/10 text-mv-forest">
                    Main Circulatory Highway
                  </span>
                  <span className="text-[12px] font-mono text-mv-ink-muted">02</span>
                </div>
                <h4 className="font-serif text-[21px] font-semibold text-mv-forest">Deep Venous System</h4>
                <p className="mt-2 text-[13.5px] text-mv-ink-muted leading-relaxed">
                  Encased inside tight muscular compartments alongside main arteries (Femoral, Popliteal, and Tibial veins). Squeezed directly by calf muscles during every step.
                </p>
                <div className="mt-4 space-y-2 text-[12.5px] text-mv-ink-muted border-t border-mv-outline/50 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-forest shrink-0" />
                    <span>Carries &gt;90% of leg venous return to heart</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-forest shrink-0" />
                    <span>Site of dangerous Deep Vein Thrombosis (DVT)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-mv-forest shrink-0" />
                    <span>Must remain patent before saphenous treatment</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-mv-outline/50 text-[12px] font-mono text-mv-forest font-semibold">
                Never closed or ablated
              </div>
            </div>

            {/* Network 3: Perforating Veins */}
            <div
              onClick={() => setActiveNetwork('perforator')}
              className={`p-6 rounded-3xl transition-all cursor-pointer flex flex-col justify-between ${
                activeNetwork === 'perforator'
                  ? 'bg-white shadow-xs border border-amber-600/40 ring-1 ring-amber-600/20'
                  : 'bg-white/60 border border-mv-outline/50 hover:bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800">
                    Bridging Connectors
                  </span>
                  <span className="text-[12px] font-mono text-mv-ink-muted">03</span>
                </div>
                <h4 className="font-serif text-[21px] font-semibold text-mv-forest">Perforating Veins</h4>
                <p className="mt-2 text-[13.5px] text-mv-ink-muted leading-relaxed">
                  Narrow connecting channels (Cockett, Boyd, Dodd perforators) that puncture through tough muscular fascia. Their one-way valves ensure flow strictly travels from superficial into deep.
                </p>
                <div className="mt-4 space-y-2 text-[12.5px] text-mv-ink-muted border-t border-mv-outline/50 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    <span>Normal flow direction: Superficial → Deep</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    <span>When blown out, deep pressure leaks to skin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    <span>Primary driver of CEAP C5–C6 venous ulcers</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-mv-outline/50 text-[12px] font-mono text-amber-800 font-semibold">
                Requires targeted ultrasound evaluation
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
