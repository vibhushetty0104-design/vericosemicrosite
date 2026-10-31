/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HeartPulse,
  Layers,
  Eye,
  Info,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from 'lucide-react';
import {
  Vascular3DViewer,
  SimulationMode,
} from './simulation/3d/Vascular3DViewer';
import {
  ANATOMICAL_STRUCTURES,
  AnatomicalStructure,
} from './simulation/3d/LegAnatomy3D';

export interface CalfMusclePumpStage {
  id: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  plainExplanation: string;
  flowDirection: 'upward' | 'filling' | 'halted' | 'retrograde';
  valveState: 'open' | 'closed' | 'incompetent';
  flowLabel: string;
}

export const CALF_PUMP_STAGES: CalfMusclePumpStage[] = [
  {
    id: 1,
    title: 'Calf Muscle Contraction',
    shortTitle: '1. Squeeze',
    subtitle: 'Muscles contract and compress the deep vein',
    plainExplanation:
      'When your calf muscles contract during walking or movement, they tighten within the leg compartment and gently squeeze the deep vein, starting to push blood upward.',
    flowDirection: 'upward',
    valveState: 'open',
    flowLabel: 'Forward flow',
  },
  {
    id: 2,
    title: 'Upward Blood Flow',
    shortTitle: '2. Upward Flow',
    subtitle: 'Blood moves toward the heart through open valves',
    plainExplanation:
      'The pressure from the muscle squeeze forces the two valve leaflets open against the vessel wall, letting blood flow smoothly upward toward the heart.',
    flowDirection: 'upward',
    valveState: 'open',
    flowLabel: 'Forward flow',
  },
  {
    id: 3,
    title: 'Calf Muscle Relaxation',
    shortTitle: '3. Relax',
    subtitle: 'Muscles relax and the vein refills',
    plainExplanation:
      'When your muscles relax between steps, the deep vein returns toward its resting shape, drawing in blood from the smaller veins and capillary beds of the foot and calf.',
    flowDirection: 'filling',
    valveState: 'closed',
    flowLabel: 'Valve closing',
  },
  {
    id: 4,
    title: 'Competent Valve Closure',
    shortTitle: '4. Healthy Seal',
    subtitle: 'Healthy valve leaflets meet to limit backward flow',
    plainExplanation:
      'As gravity tries to pull the blood back down, the two curved leaflets fill and meet at the center, creating a seal that holds the blood in place until the next step.',
    flowDirection: 'halted',
    valveState: 'closed',
    flowLabel: 'Valve closed (flow held)',
  },
  {
    id: 5,
    title: 'Incompetent Valve & Backward Reflux',
    shortTitle: '5. Reflux Gap',
    subtitle: 'A faulty valve leaves a gap where blood leaks backward',
    plainExplanation:
      'If a venous valve does not close properly, its leaflets fail to meet. Some blood falls backward through the central gap, pooling in the lower leg and contributing to varicose veins over time.',
    flowDirection: 'retrograde',
    valveState: 'incompetent',
    flowLabel: 'Backward flow (reflux)',
  },
];

interface CalfMusclePumpAnimationProps {
  className?: string;
  autoPlayDefault?: boolean;
}

export const CalfMusclePumpAnimation: React.FC<CalfMusclePumpAnimationProps> = ({
  className = '',
  autoPlayDefault = true,
}) => {
  // Mode selection: default to primary Venous Valve view
  const [activeMode, setActiveMode] = useState<SimulationMode>('valve');

  // Mode 1: Venous Valve State ('closed' | 'open' | 'incompetent')
  const [valveModeState, setValveModeState] = useState<'open' | 'closed' | 'incompetent'>('closed');

  // Mode 2: Calf Pump 5-Stage Cycle
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlayDefault);

  // Mode 3: Healthy vs Varicose
  const [isVaricose, setIsVaricose] = useState<boolean>(false);

  // Mode 4: Explore Anatomy Layer Selection
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>('gsv');
  const [visibleLayers, setVisibleLayers] = useState({
    muscles: true,
    deepVeins: true,
    superficialVeins: true,
    perforators: true,
    valves: true,
  });

  const [cameraResetKey, setCameraResetKey] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const activeStage = CALF_PUMP_STAGES[currentStageIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Calf Pump Navigation Handlers
  const goToStage = useCallback((index: number) => {
    setCurrentStageIndex(Math.max(0, Math.min(CALF_PUMP_STAGES.length - 1, index)));
  }, []);

  const nextStage = useCallback(() => {
    goToStage((currentStageIndex + 1) % CALF_PUMP_STAGES.length);
  }, [currentStageIndex, goToStage]);

  const prevStage = useCallback(() => {
    goToStage((currentStageIndex - 1 + CALF_PUMP_STAGES.length) % CALF_PUMP_STAGES.length);
  }, [currentStageIndex, goToStage]);

  // Autoplay loop for pump mode
  useEffect(() => {
    if (activeMode !== 'pump' || !isPlaying || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(nextStage, 4200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeMode, isPlaying, nextStage, prefersReducedMotion]);

  // Reset Camera Handler
  const handleResetCamera = () => {
    setCameraResetKey((prev) => prev + 1);
  };

  // Derive current valve state & flow direction
  const isVaricoseEffective = activeMode === 'varicose' && isVaricose;

  const currentValveState: 'open' | 'closed' | 'incompetent' =
    activeMode === 'pump'
      ? activeStage.valveState
      : activeMode === 'valve'
      ? valveModeState
      : isVaricoseEffective
      ? 'incompetent'
      : 'closed';

  const currentFlowDirection: 'upward' | 'filling' | 'halted' | 'retrograde' =
    activeMode === 'pump'
      ? activeStage.flowDirection
      : activeMode === 'valve'
      ? valveModeState === 'open'
        ? 'upward'
        : valveModeState === 'incompetent'
        ? 'retrograde'
        : 'halted'
      : isVaricoseEffective
      ? 'retrograde'
      : 'upward';

  const selectedStructure: AnatomicalStructure | null = selectedStructureId
    ? ANATOMICAL_STRUCTURES[selectedStructureId] ?? null
    : null;

  return (
    <section
      id="calf-muscle-pump"
      aria-labelledby="simulation-title"
      className={`rounded-3xl border border-mv-outline/70 bg-white p-5 sm:p-7 lg:p-9 shadow-card ${className}`}
    >
      {/* 1. Section Header & Purpose */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-mv-outline/50 pb-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mv-pale text-mv-forest font-mono text-[11px] font-bold tracking-[0.14em] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-mv-terracotta" aria-hidden="true" />
            <span>Interactive 3D Medical Education</span>
          </div>
          <h2
            id="simulation-title"
            className="font-serif text-[26px] sm:text-[32px] lg:text-[36px] font-semibold leading-[1.16] text-mv-forest tracking-[-0.015em]"
          >
            How Leg Veins & the Calf-Muscle Pump Work
          </h2>
          <p className="mt-2 text-[15px] sm:text-[16px] leading-relaxed text-mv-ink-muted max-w-[46rem]">
            Explore how healthy veins push blood back toward the heart, how the calf muscles act as
            a natural pump, and how a faulty valve allows blood to leak backward.
          </p>
        </div>

        {/* Global Reset View Button */}
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

      {/* 2. Compact 4-Mode Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        {[
          {
            id: 'valve',
            label: 'Venous Valve',
            icon: ShieldCheck,
            tag: 'Primary view',
            summary: 'Leaflets, closure & reflux',
          },
          {
            id: 'pump',
            label: 'Calf-Muscle Pump',
            icon: HeartPulse,
            tag: '5-step cycle',
            summary: 'Muscular compression & flow',
          },
          {
            id: 'varicose',
            label: 'Healthy vs Varicose',
            icon: Layers,
            tag: 'Comparison',
            summary: 'Normal calibre vs tortuous',
          },
          {
            id: 'explore',
            label: 'Explore Anatomy',
            icon: Eye,
            tag: 'Interactive',
            summary: 'Deep veins, GSV & muscles',
          },
        ].map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMode(m.id as SimulationMode)}
              className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-mv-forest text-mv-ivory border-mv-forest shadow-xs'
                  : 'bg-mv-ivory/60 hover:bg-mv-pale/40 border-mv-outline/60 text-mv-forest'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-serif text-[15.5px] font-semibold leading-tight">
                  {m.label}
                </span>
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-mv-terracotta' : 'text-mv-forest/70'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <span
                className={`text-[12px] leading-tight ${
                  isActive ? 'text-mv-pale/85' : 'text-mv-ink-muted'
                }`}
              >
                {m.summary}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Main Stage: 3D Canvas (Left/Center) + Clear Educational Context (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Left Column: 3D Viewport with Integrated Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          {/* Mode Sub-Controls Toolbar */}
          <div className="mb-3">
            {/* Mode 1: Venous Valve State Selector */}
            {activeMode === 'valve' && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-mv-ivory border border-mv-outline/60">
                <span className="text-[12px] font-mono uppercase tracking-wider text-mv-ink-muted px-1">
                  Valve State:
                </span>
                <div className="inline-flex rounded-lg bg-white p-1 border border-mv-outline/50 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setValveModeState('closed')}
                    className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                      valveModeState === 'closed'
                        ? 'bg-mv-forest text-white shadow-xs'
                        : 'text-mv-forest hover:bg-mv-pale/50'
                    }`}
                  >
                    Competent Closure
                  </button>
                  <button
                    type="button"
                    onClick={() => setValveModeState('open')}
                    className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                      valveModeState === 'open'
                        ? 'bg-mv-forest text-white shadow-xs'
                        : 'text-mv-forest hover:bg-mv-pale/50'
                    }`}
                  >
                    Forward Flow
                  </button>
                  <button
                    type="button"
                    onClick={() => setValveModeState('incompetent')}
                    className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                      valveModeState === 'incompetent'
                        ? 'bg-mv-terracotta text-white shadow-xs'
                        : 'text-mv-terracotta hover:bg-mv-terracotta/10'
                    }`}
                  >
                    Incompetent Valve
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Calf-Muscle Pump Stepper */}
            {activeMode === 'pump' && (
              <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-mv-ivory border border-mv-outline/60">
                <div className="flex items-center justify-between gap-2">
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
                      <span>{isPlaying ? 'Pause' : 'Autoplay'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={prevStage}
                      className="p-1.5 rounded-lg bg-white hover:bg-mv-pale border border-mv-outline/60 text-mv-forest cursor-pointer"
                      title="Previous step"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={nextStage}
                      className="p-1.5 rounded-lg bg-white hover:bg-mv-pale border border-mv-outline/60 text-mv-forest cursor-pointer"
                      title="Next step"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>

                  <span className="font-mono text-[12px] font-bold text-mv-forest">
                    Step {activeStage.id} of 5
                  </span>
                </div>

                {/* 5-Step Buttons */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {CALF_PUMP_STAGES.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => goToStage(idx)}
                      className={`py-1 px-1 text-center rounded-md font-mono text-[11px] font-semibold transition-all cursor-pointer truncate ${
                        currentStageIndex === idx
                          ? 'bg-mv-forest text-white shadow-xs'
                          : 'bg-white hover:bg-mv-pale/60 text-mv-ink-muted border border-mv-outline/40'
                      }`}
                    >
                      {s.shortTitle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mode 3: Healthy vs Varicose Toggle */}
            {activeMode === 'varicose' && (
              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-mv-ivory border border-mv-outline/60">
                <span className="text-[12px] font-mono uppercase tracking-wider text-mv-ink-muted px-1">
                  Anatomy State:
                </span>
                <div className="inline-flex rounded-lg bg-white p-1 border border-mv-outline/50 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setIsVaricose(false)}
                    className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                      !isVaricose ? 'bg-mv-forest text-white' : 'text-mv-forest hover:bg-mv-pale/50'
                    }`}
                  >
                    Healthy Venous Anatomy
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsVaricose(true)}
                    className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                      isVaricose
                        ? 'bg-mv-terracotta text-white shadow-xs'
                        : 'text-mv-terracotta hover:bg-mv-terracotta/10'
                    }`}
                  >
                    Varicose-Vein Anatomy
                  </button>
                </div>
              </div>
            )}

            {/* Mode 4: Layer Visibility Toggles */}
            {activeMode === 'explore' && (
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-mv-ivory border border-mv-outline/60">
                <span className="text-[11px] font-mono uppercase tracking-wider text-mv-ink-muted mr-1 px-1">
                  Layers:
                </span>
                {[
                  { key: 'muscles', label: 'Calf Muscles' },
                  { key: 'deepVeins', label: 'Deep Veins' },
                  { key: 'superficialVeins', label: 'Superficial GSV' },
                  { key: 'perforators', label: 'Perforators' },
                ].map((layer) => {
                  const isVisible = visibleLayers[layer.key as keyof typeof visibleLayers];
                  return (
                    <button
                      key={layer.key}
                      type="button"
                      onClick={() =>
                        setVisibleLayers((prev) => ({
                          ...prev,
                          [layer.key]: !prev[layer.key as keyof typeof visibleLayers],
                        }))
                      }
                      className={`px-2.5 py-1 rounded-md text-[12px] font-medium border transition-colors cursor-pointer ${
                        isVisible
                          ? 'bg-mv-forest text-white border-mv-forest'
                          : 'bg-white text-mv-ink-muted border-mv-outline/50 opacity-60'
                      }`}
                    >
                      {layer.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3D Viewport Canvas */}
          <div className="relative flex-1 rounded-2xl border border-mv-outline/60 overflow-hidden shadow-inner">
            <Vascular3DViewer
              mode={activeMode}
              stageId={activeStage.id}
              valveState={currentValveState}
              flowDirection={currentFlowDirection}
              isVaricose={isVaricoseEffective}
              isPaused={!isPlaying && activeMode === 'pump'}
              selectedStructureId={selectedStructureId}
              onSelectStructure={setSelectedStructureId}
              visibleLayers={visibleLayers}
              cameraResetKey={cameraResetKey}
            />

            {/* Subtle Canvas Interaction Hint */}
            <div className="pointer-events-none absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/85 backdrop-blur-xs border border-mv-outline/50 text-mv-forest text-[11px] font-mono shadow-xs">
              <span>Drag to rotate · Scroll to zoom</span>
            </div>

            {/* Dynamic 3D Flow Indicator Badge */}
            <div className="pointer-events-none absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-mv-outline/50 shadow-xs flex items-center gap-2">
              {currentFlowDirection === 'retrograde' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-mv-terracotta animate-pulse" aria-hidden="true" />
                  <ArrowDown className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                  <span className="font-mono text-[11.5px] font-bold text-mv-terracotta uppercase">
                    Backward flow (reflux)
                  </span>
                </>
              ) : currentFlowDirection === 'halted' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-mv-sage" aria-hidden="true" />
                  <span className="font-mono text-[11.5px] font-bold text-mv-forest uppercase">
                    Valve closes
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" aria-hidden="true" />
                  <ArrowUp className="w-3.5 h-3.5 text-green-700" aria-hidden="true" />
                  <span className="font-mono text-[11.5px] font-bold text-mv-forest uppercase">
                    Forward flow
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Clear, Public-Friendly Educational Card */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="rounded-2xl bg-[#FAF8F3] border border-mv-outline/60 p-6 sm:p-7 shadow-xs">
            
            {/* Mode 1: Venous Valve Educational Text */}
            {activeMode === 'valve' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      valveModeState === 'incompetent' ? 'bg-mv-terracotta' : 'bg-mv-forest'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11.5px] font-bold tracking-wider uppercase text-mv-ink-muted">
                    Venous Valve Anatomy
                  </span>
                </div>

                <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest">
                  {valveModeState === 'closed'
                    ? 'Competent Valve Closure'
                    : valveModeState === 'open'
                    ? 'Forward Flow Through Open Leaflets'
                    : 'Incompetent Valve & Venous Reflux'}
                </h3>

                <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.65] text-mv-ink">
                  {valveModeState === 'closed'
                    ? 'Venous valves have two principal leaflets that help limit reverse flow. When blood starts to settle between steps, the two leaflets fill and meet at the center to hold the column of blood in place.'
                    : valveModeState === 'open'
                    ? 'When blood is pushed upward toward the heart, the two valve leaflets swing open against the vessel wall, creating a clear central passage for red blood cells.'
                    : 'If a venous valve does not close properly, its leaflets fail to meet, leaving a central gap. Some blood can flow backward (venous reflux), which contributes to varicose veins over time.'}
                </p>

                {/* Educational Summary Callout */}
                <div className="mt-5 p-4 rounded-xl bg-white border border-mv-outline/50 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-[13.5px] text-mv-ink leading-snug">
                      <strong>Two-Leaflet Design:</strong> Delicate bicuspid tissue flaps anchored to opposite sides of the vein wall.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-mv-terracotta shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-[13.5px] text-mv-ink leading-snug">
                      <strong>Reflux Detection:</strong> In venous Doppler ultrasound, reverse flow lasting 0.5 seconds or longer in superficial veins indicates valve incompetence.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Calf-Muscle Pump Educational Text */}
            {activeMode === 'pump' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-mv-terracotta" aria-hidden="true" />
                  <span className="font-mono text-[11.5px] font-bold tracking-wider uppercase text-mv-ink-muted">
                    Calf-Muscle Pump &bull; {activeStage.shortTitle}
                  </span>
                </div>

                <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest">
                  {activeStage.title}
                </h3>

                <p className="mt-3 text-[14px] font-mono text-mv-terracotta uppercase tracking-wider">
                  {activeStage.subtitle}
                </p>

                <p className="mt-3 text-[15.5px] sm:text-[16px] leading-[1.65] text-mv-ink">
                  {activeStage.plainExplanation}
                </p>

                <div className="mt-5 p-4 rounded-xl bg-white border border-mv-outline/50">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-mv-terracotta font-semibold block mb-1">
                    How it works
                  </span>
                  <p className="text-[14px] text-mv-ink leading-relaxed">
                    “When your calf muscles contract during movement, they compress deep veins and help push blood upward toward the heart. Venous valves help limit backward flow. When the muscles relax, the veins can refill.”
                  </p>
                </div>
              </div>
            )}

            {/* Mode 3: Healthy vs Varicose Educational Text */}
            {activeMode === 'varicose' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isVaricose ? 'bg-mv-terracotta' : 'bg-mv-forest'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11.5px] font-bold tracking-wider uppercase text-mv-ink-muted">
                    Venous Comparison
                  </span>
                </div>

                <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest">
                  {isVaricose ? 'Varicose-Vein Anatomy' : 'Healthy Venous Anatomy'}
                </h3>

                <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.65] text-mv-ink">
                  {isVaricose
                    ? 'In varicose veins, weakened vein walls and faulty valves allow blood to flow backward and pool. Over time, the affected superficial veins become noticeably dilated, elongated, and tortuous (twisted), bulging under the skin.'
                    : 'In healthy venous anatomy, the Great Saphenous Vein travels smoothly beneath the skin with a straight, uniform calibre. Working valves prevent blood from falling backward between steps.'}
                </p>

                <div className="mt-5 p-4 rounded-xl bg-white border border-mv-outline/50 space-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-mv-terracotta font-semibold block">
                    Key Clinical Difference
                  </span>
                  <p className="text-[13.5px] text-mv-ink leading-relaxed">
                    Venous reflux and changes in the vein wall can contribute to varicose veins. Not every varicose vein has the exact same underlying cause, which is why a venous Doppler ultrasound is used to map individual blood flow.
                  </p>
                </div>
              </div>
            )}

            {/* Mode 4: Explore Anatomy Educational Text */}
            {activeMode === 'explore' && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-mv-forest" aria-hidden="true" />
                  <span className="font-mono text-[11.5px] font-bold tracking-wider uppercase text-mv-ink-muted">
                    Anatomical Structure Inspector
                  </span>
                </div>

                <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest">
                  {selectedStructure ? selectedStructure.name : 'Select a Structure to Inspect'}
                </h3>

                <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.65] text-mv-ink">
                  {selectedStructure
                    ? selectedStructure.description
                    : 'Click any muscle, deep vein, saphenous vein, or perforator in the 3D model to understand its anatomical function.'}
                </p>

                {selectedStructure && (
                  <div className="mt-4 p-4 rounded-xl bg-white border border-mv-outline/50">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-mv-terracotta font-semibold block mb-1">
                      Function in Circulation
                    </span>
                    <p className="text-[13.5px] text-mv-ink leading-relaxed">
                      {selectedStructure.clinicalNote}
                    </p>
                  </div>
                )}

                {/* Quick Structure Pill Buttons */}
                <div className="mt-4 pt-3 border-t border-mv-outline/50">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-mv-ink-muted block mb-2">
                    Select Structure:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.values(ANATOMICAL_STRUCTURES).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedStructureId(item.id)}
                        className={`px-2.5 py-1 rounded-md text-[12px] font-medium border transition-colors cursor-pointer ${
                          selectedStructureId === item.id
                            ? 'bg-mv-forest text-white border-mv-forest'
                            : 'bg-white hover:bg-mv-pale/50 text-mv-forest border-mv-outline/60'
                        }`}
                      >
                        {item.name.split(' (')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Documented Medical References */}
            <div className="mt-5 pt-4 border-t border-mv-outline/50">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-mv-ink-muted block mb-1.5">
                Medical References & Sources:
              </span>
              <ul className="text-[11.5px] text-mv-ink-muted space-y-1">
                <li>
                  &bull; Lower extremity venous anatomy:{' '}
                  <a
                    href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5381851/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mv-terracotta hover:underline inline-flex items-center gap-1"
                  >
                    PMC5381851 <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  &bull; Venous return & calf muscle pump:{' '}
                  <a
                    href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3036282/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mv-terracotta hover:underline inline-flex items-center gap-1"
                  >
                    PMC3036282 <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
                <li>
                  &bull; Venous valves & pathophysiology:{' '}
                  <a
                    href="https://www.ncbi.nlm.nih.gov/books/NBK534256/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mv-terracotta hover:underline inline-flex items-center gap-1"
                  >
                    NBK534256 <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Mandatory Public Educational Disclaimer */}
          <div className="mt-4 p-4 rounded-xl bg-mv-pale/40 border border-mv-outline/50 flex items-start gap-3">
            <Info className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[12.5px] leading-relaxed text-mv-ink-muted">
              <strong>Educational anatomical visualization.</strong> Simplified for learning; not
              intended for diagnosis or treatment decisions.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
