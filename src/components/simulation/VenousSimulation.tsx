import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import './simulation.css';

/*
 * Educational venous valve simulation (stakeholder demo).
 *
 * Healthy valves and a leaky (incompetent) lower valve run through the same four-phase calf-pump
 * cycle. Particle motion is computed per frame from the cycle time (no physics) and written straight
 * to the SVG; valves and muscles change state with CSS transitions when the phase changes. The loop
 * runs only while playing, on screen and in a visible tab, and never under reduced motion.
 * Not to scale, not a model of any person's veins, not a diagnostic tool.
 */

type Variant = 'healthy' | 'leaky';
type Mode = 'compare' | Variant;

const CYCLE_MS = 6400;
const PHASES = [
  { name: 'Calf squeezes', short: 'Squeeze' },
  { name: 'Blood moves up', short: 'Move up' },
  { name: 'Calf relaxes', short: 'Relax' },
  { name: 'Valves hold, or blood leaks back', short: 'Hold or leak' },
] as const;

const CAPTIONS: Record<Variant, string[]> = {
  healthy: [
    'Walking squeezes the calf muscles, which press on the deep veins.',
    'The squeeze pushes blood upward. Both valves fold open to let it pass.',
    'As the muscle relaxes, blood starts to fall back. The valve flaps fill and meet.',
    'Closed valves hold the blood in place until the next step.',
  ],
  leaky: [
    'The same squeeze presses on the vein.',
    'Blood is pushed upward through the open valves, as in a healthy vein.',
    'The lower valve’s flaps can’t meet. Blood starts to slip back through the gap.',
    'Blood leaks back down (reflux) and collects in the lower vein, which stretches over time.',
  ],
};

const FLOW_STATUS: Record<Variant, string[]> = {
  healthy: ['Flow: pushed upward', 'Flow: upward', 'Flow: valves closing', 'Flow: held in place'],
  leaky: ['Flow: pushed upward', 'Flow: upward', 'Flow: starting to leak back', 'Flow: leaking back down'],
};

const N = 20;
const TOP = 24;
const BOTTOM = 420;
const TRACK = BOTTOM - TOP;
const CENTER = 100;
const RISE = 70;
const FALLBACK = 56;

const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Track position of particle i (0 = bottom of the vein) at absolute time ms. */
function particleY(i: number, ms: number, variant: Variant): number {
  const cycles = Math.floor(ms / CYCLE_MS);
  const t = (ms % CYCLE_MS) / CYCLE_MS;
  const up = RISE * easeInOut(clamp01(t / 0.5));
  const back = variant === 'leaky' ? FALLBACK * easeInOut(clamp01((t - 0.5) / 0.5)) : 2 * easeInOut(clamp01((t - 0.5) / 0.12));
  const net = variant === 'leaky' ? RISE - FALLBACK : RISE - 2;
  const s = (((i / N) * TRACK + cycles * net + up - back) % TRACK + TRACK) % TRACK;
  return BOTTOM - s;
}

function halfWidthAt(y: number, variant: Variant): number {
  if (variant === 'healthy' || y < 220) return 24;
  return 24 + 9 * Math.sin(Math.min(1, (y - 220) / 120) * (Math.PI / 2));
}

const phaseOf = (ms: number) => Math.min(3, Math.floor(((ms % CYCLE_MS) / CYCLE_MS) * 4));

interface VeinProps {
  variant: Variant;
  phase: number;
  setCircle: (variant: Variant, i: number, el: SVGCircleElement | null) => void;
  titleId: string;
}

const Vein: React.FC<VeinProps> = ({ variant, phase, setCircle, titleId }) => {
  const leaky = variant === 'leaky';
  const squeezing = phase === 0 || phase === 1;
  // Valve states: open while blood moves up; closed (healthy) or gapped (leaky lower valve) after.
  const upper = squeezing ? 'open' : 'closed';
  const lower = squeezing ? 'open' : leaky ? 'gap' : 'closed';
  const wallLower = leaky
    ? { l: 'M76,230 C70,262 67,300 67,330 C67,370 70,400 70,420', r: 'M124,230 C130,262 133,300 133,330 C133,370 130,400 130,420' }
    : { l: 'M76,230 L76,420', r: 'M124,230 L124,420' };

  const valve = (y: number, state: string, highlight: boolean, key: string) => {
    const hl = leaky && highlight ? 76 - 9 : 76;
    const hr = leaky && highlight ? 124 + 9 : 124;
    return (
      <g key={key} className={`vs-valve is-${state} ${highlight && leaky ? 'is-highlight' : ''}`}>
        <path
          className="vs-leaflet vs-leaflet--l"
          style={{ transformOrigin: `${hl}px ${y + 22}px` }}
          d={`M${hl},${y + 22} Q${hl + 16},${y + 16} ${CENTER - 1},${y - 10}`}
        />
        <path
          className="vs-leaflet vs-leaflet--r"
          style={{ transformOrigin: `${hr}px ${y + 22}px` }}
          d={`M${hr},${y + 22} Q${hr - 16},${y + 16} ${CENTER + 1},${y - 10}`}
        />
        {highlight && leaky && state === 'gap' && <circle className="vs-gap-ring" cx={CENTER} cy={y - 4} r="16" />}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 200 440" className="vs-svg" role="img" aria-labelledby={titleId}>
      <title id={titleId}>
        {variant === 'healthy' ? 'Healthy vein' : 'Vein with a leaky lower valve'}: {PHASES[phase].name.toLowerCase()}. {CAPTIONS[variant][phase]}
      </title>
      {/* Calf muscles around the lower vein */}
      <g className={`vs-muscles ${squeezing && phase === 0 ? 'is-squeezing' : ''}`} aria-hidden="true">
        <ellipse className="vs-muscle vs-muscle--l" cx="38" cy="330" rx="30" ry="78" />
        <ellipse className="vs-muscle vs-muscle--r" cx="162" cy="330" rx="30" ry="78" />
      </g>
      {/* Lumen */}
      <path
        className="vs-lumen"
        d={
          leaky
            ? 'M76,24 L76,230 C70,262 67,300 67,330 C67,370 70,400 70,420 L130,420 C130,400 133,370 133,330 C133,300 130,262 124,230 L124,24 Z'
            : 'M76,24 L76,420 L124,420 L124,24 Z'
        }
      />
      {/* Walls: the lower part narrows while the calf squeezes */}
      <path className="vs-wall" d="M76,24 L76,232 M124,24 L124,232" />
      <g className={`vs-wall-lower ${phase === 0 ? 'is-squeezing' : ''}`}>
        <path className="vs-wall" d={wallLower.l} />
        <path className="vs-wall" d={wallLower.r} />
      </g>
      {/* Blood particles (positions written each frame) */}
      <g className="vs-particles" aria-hidden="true">
        {Array.from({ length: N }, (_, i) => (
          <circle key={i} ref={(el) => setCircle(variant, i, el)} r="4.2" cx={CENTER} cy={BOTTOM - (i / N) * TRACK} />
        ))}
      </g>
      {valve(150, upper, false, 'u')}
      {valve(300, lower, true, 'l')}
      {/* Direction marks */}
      <g className="vs-arrow" aria-hidden="true">
        {squeezing && <path className="vs-arrow-up" d="M188,250 L188,170 M180,182 L188,168 L196,182" />}
        {!squeezing && leaky && <path className="vs-arrow-down" d="M188,250 L188,330 M180,318 L188,332 L196,318" />}
      </g>
    </svg>
  );
};

export const VenousSimulation: React.FC = () => {
  const id = useId();
  const [mode, setMode] = useState<Mode>('compare');
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  const [announce, setAnnounce] = useState('');
  const timeRef = useRef(CYCLE_MS * 0.125);
  const circles = useRef<Record<Variant, (SVGCircleElement | null)[]>>({ healthy: [], leaky: [] });
  const stageRef = useRef<HTMLDivElement>(null);

  const setCircle = useCallback((variant: Variant, i: number, el: SVGCircleElement | null) => {
    circles.current[variant][i] = el;
  }, []);

  const draw = useCallback(() => {
    const ms = timeRef.current;
    (['healthy', 'leaky'] as Variant[]).forEach((v) => {
      circles.current[v].forEach((c, i) => {
        if (!c) return;
        const y = particleY(i, ms, v);
        const hw = halfWidthAt(y, v);
        const x = CENTER + Math.sin(i * 2.39) * hw * 0.55;
        c.setAttribute('cx', x.toFixed(1));
        c.setAttribute('cy', y.toFixed(1));
        const edge = Math.min(y - TOP, BOTTOM - y);
        c.setAttribute('opacity', edge < 18 ? (edge / 18).toFixed(2) : '1');
      });
    });
    const p = phaseOf(ms);
    setPhase((old) => (old === p ? old : p));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    const node = stageRef.current;
    const io = node ? new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.2 }) : null;
    if (node && io) io.observe(node);
    return () => {
      mq.removeEventListener('change', onChange);
      document.removeEventListener('visibilitychange', onVis);
      io?.disconnect();
    };
  }, []);

  // Redraw whenever the visible veins change (mode switch) or on first paint.
  useEffect(() => {
    draw();
  }, [mode, draw]);

  const running = playing && !reduced && onScreen && tabVisible;
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      timeRef.current += Math.min(64, now - last);
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, draw]);

  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  const goToPhase = (p: number) => {
    const base = Math.floor(timeRef.current / CYCLE_MS) * CYCLE_MS;
    const np = ((p % 4) + 4) % 4;
    timeRef.current = base + ((np + 0.62) / 4) * CYCLE_MS;
    setPlaying(false);
    draw();
    setAnnounce(`${PHASES[np].name}. ${CAPTIONS.healthy[np]} ${mode !== 'healthy' ? CAPTIONS.leaky[np] : ''}`);
  };

  const togglePlay = () => {
    setPlaying((p) => {
      if (p) setAnnounce(`Paused at: ${PHASES[phaseOf(timeRef.current)].name}.`);
      else setAnnounce('');
      return !p;
    });
  };

  const variants: Variant[] = mode === 'compare' ? ['healthy', 'leaky'] : [mode];

  return (
    <section id="valve-simulation" aria-labelledby={`${id}-title`} className="vs border-b border-mv-outline bg-mv-surface py-12 lg:py-16">
      <div className="container-page max-w-[1200px]">
        <div className="vs-layout">
          <div className="vs-intro">
            <ul className="flex flex-wrap gap-2 text-[13px] font-semibold" aria-label="About this simulation">
              <li className="rounded-full bg-mv-warning-surface px-2.5 py-1 text-mv-warning">Educational simulation</li>
              <li className="rounded-full bg-mv-pale px-2.5 py-1 text-mv-forest">Not a diagnostic tool</li>
              <li className="rounded-full bg-mv-pale px-2.5 py-1 text-mv-forest">Not to scale</li>
            </ul>
            <h2 id={`${id}-title`} className="mt-3 font-serif text-[28px] font-semibold leading-tight text-mv-forest sm:text-[36px]">
              See how vein valves work
            </h2>
            <p className="mt-3 max-w-[34rem] text-[17px] leading-relaxed text-mv-ink-muted">
              Every step you take, your calf muscles squeeze the veins and push blood up toward the heart. One-way valves stop it falling back. Compare a
              healthy vein with one whose lower valve leaks.
            </p>
          </div>

          <div className="vs-controls">
            <fieldset className="mt-6">
              <legend className="text-[14px] font-semibold text-mv-ink">Show</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    ['compare', 'Side by side'],
                    ['healthy', 'Healthy valves'],
                    ['leaky', 'Leaky valve'],
                  ] as [Mode, string][]
                ).map(([m, label]) => (
                  <span key={m} className="vs-seg">
                    <input type="radio" id={`${id}-${m}`} name={`${id}-mode`} checked={mode === m} onChange={() => setMode(m)} />
                    <label htmlFor={`${id}-${m}`}>{label}</label>
                  </span>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {reduced ? (
                <p className="max-w-[24rem] text-[14px] text-mv-ink-muted">Motion is reduced on this device. Step through the phases instead.</p>
              ) : (
                <button type="button" onClick={togglePlay} className="mv-btn mv-btn-secondary">
                  {playing ? <Pause className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" /> : <Play className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
                  {playing ? 'Pause' : 'Play the cycle'}
                </button>
              )}
              <button type="button" onClick={() => goToPhase(phase - 1)} className="vs-step" aria-label="Previous phase">
                <ChevronLeft className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => goToPhase(phase + 1)} className="vs-step" aria-label="Next phase">
                <ChevronRight className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            <ol className="vs-phases mt-5" aria-label="Phases of one step">
              {PHASES.map((p, i) => (
                <li key={p.name} aria-current={phase === i ? 'step' : undefined} className={phase === i ? 'is-current' : ''}>
                  <button type="button" onClick={() => goToPhase(i)}>
                    <span className="vs-phase-n" aria-hidden="true">{i + 1}</span>
                    {p.name}
                  </button>
                </li>
              ))}
            </ol>
            <p className="sr-only" aria-live="polite">
              {announce}
            </p>
          </div>

          <div ref={stageRef} className={`vs-stage vs-stage--${mode} ${reduced ? 'is-reduced' : ''}`}>
            {variants.map((v) => (
              <figure key={v} className={`vs-figure vs-figure--${v}`}>
                <figcaption className="vs-figure-title">
                  <span className="font-serif text-[20px] font-semibold text-mv-forest">{v === 'healthy' ? 'Healthy valves' : 'Leaky lower valve'}</span>
                  <span className={`vs-status ${v === 'leaky' && phase >= 2 ? 'is-back' : ''}`}>{FLOW_STATUS[v][phase]}</span>
                </figcaption>
                <Vein variant={v} phase={phase} setCircle={setCircle} titleId={`${id}-${v}-svg`} />
                <p className="vs-caption">{CAPTIONS[v][phase]}</p>
              </figure>
            ))}
          </div>
        </div>
        <p className="mt-8 max-w-[44rem] text-[14px] leading-relaxed text-mv-ink-muted">
          <strong className="font-semibold text-mv-ink">About this simulation:</strong> a simplified illustration of the calf-muscle pump and one-way
          valves, made for this demo. It is not to scale, does not show any person’s veins, and cannot be used to interpret a scan. In a duplex ultrasound examination, retrograde flow exceeding 500 ms (0.5 s) in superficial veins or 1,000 ms in deep veins is the diagnostic threshold for pathological venous reflux. Read more in{' '}
          <a href="#research/venous-reflux" className="mv-link">
            Venous reflux
          </a>{' '}
          or decode your findings in the{' '}
          <a href="#doppler" className="mv-link">
            Doppler report guide
          </a>
          .
        </p>
      </div>
    </section>
  );
};
