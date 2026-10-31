/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Vascular3DViewer } from '../simulation/3d/Vascular3DViewer';

interface VenousValveSimulator3DProps {
  className?: string;
  autoPlayDefault?: boolean;
}

interface ValveCycleStage {
  id: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  captionHealthy: string;
  captionIncompetent: string;
  valveState: 'open' | 'closed' | 'incompetent';
  flowDirection: 'upward' | 'filling' | 'halted' | 'retrograde';
  flowLabel: string;
}

const VALVE_CYCLE_STAGES: ValveCycleStage[] = [
  {
    id: 1,
    title: 'Calf Muscle Contraction',
    shortTitle: '1. Squeeze',
    subtitle: 'Muscles contract and raise compartment pressure',
    captionHealthy:
      'Walking squeezes the calf muscles. This inward pressure compresses the deep veins and begins pushing blood upward against gravity.',
    captionIncompetent:
      'The same muscular squeeze compresses the vein, driving blood upward through the vessel lumen.',
    valveState: 'open',
    flowDirection: 'upward',
    flowLabel: 'Forward flow',
  },
  {
    id: 2,
    title: 'Upward Blood Flow',
    shortTitle: '2. Upward Flow',
    subtitle: 'Pressure pushes valve leaflets open against the wall',
    captionHealthy:
      'The forward pressure gradient forces both valve leaflets wide open, letting red blood cells surge upward toward the heart.',
    captionIncompetent:
      'Blood moves upward through the open leaflets, similar to a healthy vein during active contraction.',
    valveState: 'open',
    flowDirection: 'upward',
    flowLabel: 'Forward flow',
  },
  {
    id: 3,
    title: 'Muscle Relaxation & Diastole',
    shortTitle: '3. Relaxation',
    subtitle: 'Muscles relax and blood starts to settle',
    captionHealthy:
      'As calf muscles relax between steps, the deep vein re-expands. Gravity starts pulling blood downward, filling the valve sinuses.',
    captionIncompetent:
      'As the muscle relaxes, blood begins to settle downward under gravity toward the lower vein.',
    valveState: 'closed',
    flowDirection: 'filling',
    flowLabel: 'Valve closing',
  },
  {
    id: 4,
    title: 'Competent Valve Closure',
    shortTitle: '4. Healthy Seal',
    subtitle: 'Leaflets meet at the midline to stop backflow',
    captionHealthy:
      'In a healthy valve, the two curved leaflets fill like parachutes and seal tightly at the midline, holding the column of blood in place.',
    captionIncompetent:
      'In an incompetent valve, stretched vein walls or damaged leaflets prevent the edges from meeting. A persistent central gap remains.',
    valveState: 'closed',
    flowDirection: 'halted',
    flowLabel: 'Valve closed (flow held)',
  },
  {
    id: 5,
    title: 'Incompetent Valve & Backward Reflux',
    shortTitle: '5. Reflux Leak',
    subtitle: 'Blood leaks backward through the faulty gap',
    captionHealthy:
      'The competent seal continues to hold the blood column safely, protecting downstream veins and ankle tissues from pressure overload.',
    captionIncompetent:
      'Blood leaks backward through the gap (venous reflux), pooling in the lower leg. Over time, persistent pooling contributes to varicose vein dilation.',
    valveState: 'incompetent',
    flowDirection: 'retrograde',
    flowLabel: 'Backward flow (reflux)',
  },
];

export const VenousValveSimulator3D: React.FC<VenousValveSimulator3DProps> = ({
  className = '',
  autoPlayDefault = true,
}) => {
  const [isHealthy, setIsHealthy] = useState<boolean>(true);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlayDefault);
  const [cameraResetKey, setCameraResetKey] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const stage = VALVE_CYCLE_STAGES[currentStageIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const goToStage = useCallback((index: number) => {
    setCurrentStageIndex(Math.max(0, Math.min(VALVE_CYCLE_STAGES.length - 1, index)));
  }, []);

  const nextStage = useCallback(() => {
    goToStage((currentStageIndex + 1) % VALVE_CYCLE_STAGES.length);
  }, [currentStageIndex, goToStage]);

  const prevStage = useCallback(() => {
    goToStage((currentStageIndex - 1 + VALVE_CYCLE_STAGES.length) % VALVE_CYCLE_STAGES.length);
  }, [currentStageIndex, goToStage]);

  // Autoplay cycle
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(nextStage, 4200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextStage, prefersReducedMotion]);

  const handleResetCamera = () => {
    setCameraResetKey((prev) => prev + 1);
  };

  // Determine current active valve state & flow direction
  const effectiveValveState: 'open' | 'closed' | 'incompetent' = !isHealthy
    ? stage.id >= 4
      ? 'incompetent'
      : stage.valveState
    : stage.valveState;

  const effectiveFlowDirection: 'upward' | 'filling' | 'halted' | 'retrograde' = !isHealthy
    ? stage.id >= 4
      ? 'retrograde'
      : stage.flowDirection
    : stage.flowDirection;

  return (
    <section
      id="valve-simulation"
      aria-labelledby="valve-simulation-title"
      className={`rounded-3xl border border-mv-outline/70 bg-white p-6 sm:p-8 lg:p-10 shadow-card ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-mv-outline/50 pb-6 mb-7">
        <div className="max-w-[48rem]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mv-pale text-mv-forest font-mono text-[11px] font-bold tracking-[0.14em] uppercase mb-2.5">
            <span className="w-2 h-2 rounded-full bg-mv-terracotta" aria-hidden="true" />
            <span>SECTION 02 &bull; VALVE BIOMECHANICS &amp; REFLUX</span>
          </div>
          <h2
            id="valve-simulation-title"
            className="font-serif text-[26px] sm:text-[32px] lg:text-[36px] font-semibold text-mv-forest leading-[1.18] tracking-[-0.015em]"
          >
            Healthy Valve vs. Venous Reflux
          </h2>
          <p className="mt-2.5 text-[15px] sm:text-[16px] leading-relaxed text-mv-ink-muted">
            Venous valves have two delicate leaflets that act as one-way gates. Compare how a healthy valve seals against gravity versus how an incompetent valve allows backward blood leakage.
          </p>
        </div>

        {/* Camera Reset */}
        <button
          type="button"
          onClick={handleResetCamera}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-mv-ivory hover:bg-mv-pale border border-mv-outline/60 text-mv-forest text-[13px] font-medium transition-colors cursor-pointer self-start md:self-auto shrink-0 shadow-2xs"
          title="Reset 3D camera to default position"
        >
          <RotateCcw className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Main Interactive Stage: 3D Viewport (Left) + Cycle Explanation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-stretch">
        
        {/* Left Column: 3D Canvas with Primary Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          {/* Master Valve State Toggle & Stepper Toolbar */}
          <div className="space-y-2.5 mb-3">
            {/* Top Toggle: Healthy vs Incompetent */}
            <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-mv-ivory border border-mv-outline/60">
              <span className="text-[12px] font-mono uppercase tracking-wider text-mv-ink-muted px-1 font-semibold">
                Valve Condition:
              </span>
              <div className="inline-flex rounded-lg bg-white p-1 border border-mv-outline/50 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIsHealthy(true)}
                  className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
                    isHealthy
                      ? 'bg-mv-forest text-white shadow-xs'
                      : 'text-mv-forest hover:bg-mv-pale/50'
                  }`}
                >
                  Healthy Valve (Competent)
                </button>
                <button
                  type="button"
                  onClick={() => setIsHealthy(false)}
                  className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all cursor-pointer ${
                    !isHealthy
                      ? 'bg-mv-terracotta text-white shadow-xs'
                      : 'text-mv-terracotta hover:bg-mv-terracotta/10'
                  }`}
                >
                  Incompetent Valve (Reflux)
                </button>
              </div>
            </div>

            {/* Stepper & Play/Pause Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2 rounded-xl bg-mv-ivory border border-mv-outline/60">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mv-forest hover:bg-mv-forest/90 text-white text-[13px] font-semibold cursor-pointer shadow-xs transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{isPlaying ? 'Pause' : 'Play Cycle'}</span>
                </button>
                <button
                  type="button"
                  onClick={prevStage}
                  className="p-1.5 rounded-lg bg-white hover:bg-mv-pale border border-mv-outline/60 text-mv-forest cursor-pointer"
                  title="Previous cycle stage"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={nextStage}
                  className="p-1.5 rounded-lg bg-white hover:bg-mv-pale border border-mv-outline/60 text-mv-forest cursor-pointer"
                  title="Next cycle stage"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* 5-Stage Step Pills */}
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                {VALVE_CYCLE_STAGES.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToStage(idx)}
                    className={`px-2 py-1 rounded-md font-mono text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      currentStageIndex === idx
                        ? isHealthy
                          ? 'bg-mv-forest text-white shadow-2xs'
                          : 'bg-mv-terracotta text-white shadow-2xs'
                        : 'bg-white hover:bg-mv-pale/60 text-mv-ink-muted border border-mv-outline/40'
                    }`}
                  >
                    {s.shortTitle}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Viewport Canvas */}
          <div className="relative flex-1 rounded-2xl border border-mv-outline/60 overflow-hidden shadow-inner min-h-[420px] sm:min-h-[460px] lg:min-h-[500px]">
            <Vascular3DViewer
              mode="valve"
              valveState={effectiveValveState}
              flowDirection={effectiveFlowDirection}
              cameraResetKey={cameraResetKey}
              isPaused={!isPlaying}
            />

            {/* Canvas Hint */}
            <div className="pointer-events-none absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/85 backdrop-blur-xs border border-mv-outline/50 text-mv-forest text-[11px] font-mono shadow-xs">
              <span>Drag to rotate &bull; Scroll to zoom</span>
            </div>

            {/* Dynamic Directional Indicator Badge */}
            <div className="pointer-events-none absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-mv-outline/50 shadow-xs flex items-center gap-2">
              {effectiveFlowDirection === 'retrograde' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-mv-terracotta animate-pulse" aria-hidden="true" />
                  <ArrowDown className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                  <span className="font-mono text-[11.5px] font-bold text-mv-terracotta uppercase">
                    Backward flow (reflux)
                  </span>
                </>
              ) : effectiveFlowDirection === 'halted' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-mv-sage" aria-hidden="true" />
                  <span className="font-mono text-[11.5px] font-bold text-mv-forest uppercase">
                    Valve closed (flow held)
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" aria-hidden="true" />
                  <ArrowUp className="w-3.5 h-3.5 text-green-700" aria-hidden="true" />
                  <span className="font-mono text-[11.5px] font-bold text-mv-forest uppercase">
                    Forward flow (toward heart)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Stage Caption & Clinical Context */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="rounded-2xl bg-[#FAF8F3] border border-mv-outline/60 p-6 sm:p-7 shadow-xs">
            
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isHealthy ? 'bg-mv-forest' : 'bg-mv-terracotta'
                }`}
                aria-hidden="true"
              />
              <span className="font-mono text-[11.5px] font-bold tracking-wider uppercase text-mv-ink-muted">
                Cycle Stage 0{stage.id} &bull; {isHealthy ? 'Healthy Valve' : 'Incompetent Valve'}
              </span>
            </div>

            <h3 className="font-serif text-[23px] sm:text-[25px] font-semibold text-mv-forest leading-snug">
              {stage.title}
            </h3>

            <p className="mt-2 text-[13.5px] font-mono text-mv-terracotta uppercase tracking-wider font-semibold">
              {stage.subtitle}
            </p>

            {/* Dynamic Stage Caption */}
            <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.65] text-mv-ink">
              {isHealthy ? stage.captionHealthy : stage.captionIncompetent}
            </p>

            {/* Key Comparison Card */}
            <div className="mt-5 p-4.5 rounded-xl bg-white border border-mv-outline/50 space-y-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[13.5px] text-mv-ink leading-snug">
                  <strong>Healthy Mechanism:</strong> Thin, curved tissue flaps attached to opposite sides of the vein wall seal cleanly along their center meeting line.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-mv-terracotta shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[13.5px] text-mv-ink leading-snug">
                  <strong>Reflux Mechanism:</strong> If leaflets stretch or separate, gravity pulls blood backward. Venous reflux is an important contributing factor to chronic venous disease.
                </p>
              </div>
            </div>

            {/* Clinical Qualification */}
            <div className="mt-5 pt-4 border-t border-mv-outline/50 text-[13px] text-mv-ink-muted leading-relaxed">
              <p>
                <strong>Important note:</strong> Not all varicose veins have the exact same single cause. Vein-wall elasticity, family history, standing occupations, and hormonal factors all interact with valvular incompetence.
              </p>
            </div>

          </div>

          {/* Educational Disclaimer */}
          <div className="mt-4 p-4 rounded-xl bg-mv-pale/40 border border-mv-outline/50 flex items-start gap-3">
            <Info className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[12.5px] leading-relaxed text-mv-ink-muted">
              <strong>Educational anatomical visualization.</strong> Simplified for learning; not intended for diagnosis or treatment decisions.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
