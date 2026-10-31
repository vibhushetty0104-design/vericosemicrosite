import React, { useState } from 'react';
import { Waves, ShieldCheck, Info, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const DuplexUltrasoundExplorer: React.FC = () => {
  const [simulationState, setSimulationState] = useState<'normal' | 'reflux'>('reflux');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const triggerCalfSqueeze = () => {
    setIsCompressing(true);
    setTimeout(() => {
      setIsCompressing(false);
    }, 1800);
  };

  return (
    <section id="duplex-scan" className="py-16 sm:py-24 bg-white border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <p className="font-mono text-[12px] font-bold tracking-[0.12em] uppercase text-mv-forest">
            Diagnostic Gold Standard · Educational Model
          </p>
          <h2 className="mt-2 font-serif text-[28px] sm:text-[34px] lg:text-[38px] font-semibold text-mv-forest leading-tight">
            Venous Duplex Ultrasound Simulation
          </h2>
          <p className="mt-3 text-[16px] sm:text-[17px] text-mv-ink-muted leading-relaxed">
            Before any vein treatment can be recommended, a standing duplex ultrasound is performed. It maps internal vascular anatomy, assesses deep vein patency, and quantifies valve reflux duration using Doppler audio and spectral waveforms.
          </p>
        </div>

        {/* Clear Educational Simulation Disclaimer */}
        <div className="mb-8 flex items-center gap-3 p-4 rounded-2xl bg-mv-ivory border border-mv-outline/70 text-[13.5px] text-mv-ink-muted">
          <Info className="w-4 h-4 text-mv-forest shrink-0" aria-hidden="true" />
          <p>
            <strong className="text-mv-forest">Educational simulation:</strong> This interactive visual demonstrates how Doppler ultrasound measures valve closure and reflux. It is an illustrative educational model, not a medical device, real patient scan, or diagnostic tool.
          </p>
        </div>

        {/* Interactive Waveform Stage (Warm Editorial Canvas) */}
        <div className="rounded-3xl border border-mv-outline/80 bg-[#FAF7F2] p-6 sm:p-8 shadow-xs">
          
          {/* Top Simulation Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-mv-outline/60">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-mono uppercase font-bold text-mv-ink-muted mr-1">
                Select Valve Condition:
              </span>
              <button
                type="button"
                onClick={() => setSimulationState('reflux')}
                className={`px-4 py-2 text-[13px] font-semibold rounded-xl transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                  simulationState === 'reflux'
                    ? 'bg-mv-terracotta text-white shadow-2xs'
                    : 'bg-white text-mv-forest border border-mv-outline/70 hover:bg-mv-ivory'
                }`}
              >
                Incompetent Valve (Reflux &gt;0.5s)
              </button>

              <button
                type="button"
                onClick={() => setSimulationState('normal')}
                className={`px-4 py-2 text-[13px] font-semibold rounded-xl transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                  simulationState === 'normal'
                    ? 'bg-mv-forest text-white shadow-2xs'
                    : 'bg-white text-mv-forest border border-mv-outline/70 hover:bg-mv-ivory'
                }`}
              >
                Competent Valve (Normal &lt;0.5s)
              </button>
            </div>

            {/* Calf Squeeze Action */}
            <button
              type="button"
              onClick={triggerCalfSqueeze}
              disabled={isCompressing}
              className="px-5 py-2.5 text-[13.5px] font-semibold rounded-xl bg-white hover:bg-mv-ivory border border-mv-outline/80 text-mv-forest shadow-2xs flex items-center gap-2 min-h-[44px] cursor-pointer disabled:opacity-60 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest"
            >
              <Waves className="w-4 h-4 text-mv-terracotta" aria-hidden="true" />
              <span>{isCompressing ? 'Calf Squeeze Active...' : 'Simulate Calf Squeeze & Release'}</span>
            </button>
          </div>

          {/* Spectral Waveform Graph Viewport */}
          <div className="mt-6 relative bg-white rounded-2xl border border-mv-outline/70 p-6 overflow-hidden">
            
            {/* Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-[12.5px] font-mono text-mv-ink-muted pb-4 border-b border-mv-outline/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-mv-terracotta" aria-hidden="true" />
                <span className="font-bold text-mv-forest">MAPPED VESSEL: Great Saphenous Vein (GSV) Thigh</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Caliber: <strong className="text-mv-forest">{simulationState === 'normal' ? '3.8 mm (Normal)' : '7.2 mm (Dilated)'}</strong></span>
                <span>Reflux Time: <strong className={simulationState === 'normal' ? 'text-mv-forest' : 'text-mv-terracotta'}>
                  {simulationState === 'normal' ? '0.12s (Normal <0.5s)' : '2.40s (Pathologic >0.5s)'}
                </strong></span>
              </div>
            </div>

            {/* SVG Spectral Doppler Velocity Curve */}
            <div className="my-6 relative h-48 sm:h-56 flex items-center justify-center">
              
              {/* Baseline zero velocity line */}
              <div className="absolute w-full h-px bg-mv-outline/80 top-1/2 z-0" />
              
              {/* International 500ms Consensus Threshold Guide */}
              <div className="absolute left-[38%] top-0 bottom-0 w-px border-l border-dashed border-mv-terracotta/50 z-0 flex flex-col justify-end pb-2">
                <span className="font-mono text-[10px] text-mv-terracotta bg-white/90 px-1 -ml-6 whitespace-nowrap">
                  500 ms Threshold
                </span>
              </div>

              {/* Axis Labels */}
              <span className="absolute left-2 top-3 font-mono text-[11px] text-mv-forest font-semibold">
                +40 cm/s (Heartward Flow)
              </span>
              <span className="absolute left-2 top-[46%] font-mono text-[11px] text-mv-ink-muted">
                0 cm/s (Baseline)
              </span>
              <span className="absolute left-2 bottom-3 font-mono text-[11px] text-mv-terracotta font-semibold">
                -40 cm/s (Retrograde Reflux)
              </span>

              {/* Spectral Doppler SVG Curve */}
              <svg viewBox="0 0 500 140" className="w-full h-full relative z-10" preserveAspectRatio="none">
                {simulationState === 'normal' ? (
                  /* Normal Flow: Rapid upward systolic spike on squeeze, immediate flatline closure (<0.2s) on release */
                  <path
                    d={isCompressing
                      ? "M 0,70 Q 50,70 80,20 Q 110,70 140,70 L 500,70"
                      : "M 0,70 Q 60,70 100,70 L 500,70"
                    }
                    fill="none"
                    stroke="#0B4036"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                ) : (
                  /* Reflux Flow: Upward spike during squeeze, then prolonged deep retrograde wave below baseline lasting >0.5s */
                  <g>
                    <path
                      d={isCompressing
                        ? "M 0,70 Q 40,70 60,20 Q 80,70 100,70 Q 170,130 320,125 Q 430,95 500,70"
                        : "M 0,70 Q 80,70 110,70 Q 180,125 320,125 Q 430,95 500,70"
                      }
                      fill="none"
                      stroke="#CE5B40"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    {/* Spectral fill shading */}
                    <path
                      d="M 110,70 Q 180,125 320,125 Q 430,95 500,70 L 110,70 Z"
                      fill="rgba(206, 91, 64, 0.16)"
                      className="transition-opacity duration-300"
                    />
                  </g>
                )}
              </svg>

              {/* Status Indicator */}
              <div className="absolute right-3 bottom-2 font-mono text-[11px] text-mv-ink-muted bg-white/90 px-2 py-1 rounded-md border border-mv-outline/50">
                {isCompressing ? '>>> CALF COMPRESSION ACTIVE <<<' : 'RELEASE PHASE: VALVE STATUS RECORDED'}
              </div>
            </div>

            {/* Explanatory Caption under Waveform */}
            <div className="pt-4 border-t border-mv-outline/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-mv-ink-muted">
              <div>
                {simulationState === 'normal' ? (
                  <p>
                    <strong className="text-mv-forest">Healthy Valve Closure:</strong> When calf pressure is released, healthy bicuspid valve leaflets fold together in under <strong>0.2 seconds</strong>, preventing blood from falling backward.
                  </p>
                ) : (
                  <p>
                    <strong className="text-mv-terracotta">Valvular Incompetence (Reflux):</strong> When calf pressure is released, incompetent valve cusps fail to close. Blood leaks backward down the leg for <strong>2.40 seconds</strong>, exceeding the 0.5s clinical threshold.
                  </p>
                )}
              </div>
              <span className="font-mono text-[11px] text-mv-forest font-bold uppercase shrink-0">
                SVS / AVF Standard: &gt;500ms
              </span>
            </div>
          </div>

          {/* Three Unboxed Editorial Knowledge Pillars */}
          <div className="mt-8 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-3 pt-6 border-t border-mv-outline/60">
            <div>
              <h3 className="font-serif text-[17.5px] font-semibold text-mv-forest mb-1.5">
                The Diagnostic &gt;0.5s Rule
              </h3>
              <p className="text-[13.5px] text-mv-ink-muted leading-relaxed">
                Healthy venous valves snap shut in under 0.2 seconds. International vascular guidelines define reflux exceeding <strong>500 milliseconds (0.5 seconds)</strong> in superficial truncal veins as definitive proof of incompetence.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-[17.5px] font-semibold text-mv-forest mb-1.5">
                Standing Position Mandate
              </h3>
              <p className="text-[13.5px] text-mv-ink-muted leading-relaxed">
                A venous duplex ultrasound must be performed with the patient standing. Lying down eliminates the gravitational column of blood, frequently masking reflux and leading to false-negative scan results.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-[17.5px] font-semibold text-mv-forest mb-1.5">
                Deep Vein Compressibility
              </h3>
              <p className="text-[13.5px] text-mv-ink-muted leading-relaxed">
                Direct probe pressure is applied to the deep femoral and popliteal veins. Complete luminal collapse confirms the deep system is patent and free of acute Deep Vein Thrombosis (DVT).
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
