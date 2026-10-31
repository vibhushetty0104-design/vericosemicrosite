import React, { useEffect, useId, useRef, useState } from 'react';
import './venous-valve.css';

/*
 * Venous valve educational prototype (isolated; served only by the dev server from
 * prototypes/venous-valve.html, never bundled into the site).
 *
 * The drawings are simplified SVG made for this prototype. They are not traced from the
 * owner's concept sheet, are not to scale and have not been checked by a clinician.
 * Wording is general education, pending clinical review. No measurements are shown.
 */

export type ValveStateId = 'open' | 'closed' | 'reflux';

interface ValveStateSpec {
  label: string;
  hint: string;
  caption: string;
  whatHappens: string;
  whyItMatters: string;
}

const VALVE_STATES: Record<ValveStateId, ValveStateSpec> = {
  open: {
    label: 'Valve open',
    hint: 'Blood moving up',
    caption: 'Valve open: blood moves up through the valve, toward the heart.',
    whatHappens:
      'When you walk, your calf muscles squeeze the veins and push blood upward. The two thin flaps of the valve fold back against the vein wall and let it through.',
    whyItMatters: 'This squeeze-and-push is how leg veins move blood uphill, against gravity.',
  },
  closed: {
    label: 'Valve closed',
    hint: 'Blood held',
    caption: 'Valve closed: the two flaps meet in the middle and stop blood falling back.',
    whatHappens:
      'When the muscle relaxes, blood starts to fall back down. It fills the small pockets behind the flaps, which pushes them together until they meet in the middle.',
    whyItMatters: 'A closed valve keeps blood from running back down the leg between steps.',
  },
  reflux: {
    label: 'Leaky valve',
    hint: 'Blood leaking back',
    caption: 'Leaky valve: the flaps do not meet, so blood leaks back down through the gap.',
    whatHappens:
      'If the flaps cannot meet, for example when the vein has widened, a gap stays open and blood can leak back down past the valve. Doctors call this backward flow reflux.',
    whyItMatters:
      'Reflux is one of the things a Doppler (duplex ultrasound) scan looks for. Only a scan, read by a clinician, can show whether it is happening in your legs.',
  },
};

const STATE_ORDER: ValveStateId[] = ['open', 'closed', 'reflux'];

type LayerId = 'superficial' | 'deep' | 'perforators';
const LAYERS: { id: LayerId; label: string }[] = [
  { id: 'superficial', label: 'Surface veins' },
  { id: 'deep', label: 'Deep veins' },
  { id: 'perforators', label: 'Connecting veins' },
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/** True while the element is at least partly on screen and the browser tab is visible. */
function useIsVisible(ref: React.RefObject<Element | null>): boolean {
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(() => typeof document === 'undefined' || !document.hidden);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.25 });
    io.observe(node);
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ref]);
  return onScreen && tabVisible;
}

/** Leaflet and wall positions per state, as SVG transforms (portable; no CSS `d` animation). */
const GEOMETRY: Record<ValveStateId, { wallShift: number; leftLeaflet: string; rightLeaflet: string }> = {
  open: { wallShift: 0, leftLeaflet: 'rotate(-28deg)', rightLeaflet: 'rotate(28deg)' },
  closed: { wallShift: 0, leftLeaflet: 'rotate(0deg)', rightLeaflet: 'rotate(0deg)' },
  reflux: { wallShift: 12, leftLeaflet: 'translateX(-12px) rotate(-6deg)', rightLeaflet: 'translateX(12px) rotate(6deg)' },
};

const ValveCloseUp: React.FC<{ state: ValveStateId; titleId: string; descId: string }> = ({ state, titleId, descId }) => {
  const g = GEOMETRY[state];
  return (
    <svg viewBox="0 0 240 300" className="vv-closeup" role="img" aria-labelledby={`${titleId} ${descId}`}>
      <title id={titleId}>Close-up of a vein valve: {VALVE_STATES[state].label.toLowerCase()}</title>
      <desc id={descId}>{VALVE_STATES[state].caption}</desc>

      {/* Lumen and walls (left/right halves move apart for the widened, leaky vein; the centre
          strip keeps the lumen continuous when they do) */}
      <rect x="96" y="10" width="48" height="280" className="vv-lumen" />
      <g className="vv-wall" style={{ transform: `translateX(${-g.wallShift}px)` }}>
        <path d="M120,10 L80,10 L80,105 C80,125 64,138 64,162 C64,186 80,198 80,212 L80,290 L120,290 Z" className="vv-lumen" />
        <path d="M80,10 L80,105 C80,125 64,138 64,162 C64,186 80,198 80,212 L80,290" className="vv-wall-line" />
      </g>
      <g className="vv-wall" style={{ transform: `translateX(${g.wallShift}px)` }}>
        <path d="M120,10 L160,10 L160,105 C160,125 176,138 176,162 C176,186 160,198 160,212 L160,290 L120,290 Z" className="vv-lumen" />
        <path d="M160,10 L160,105 C160,125 176,138 176,162 C176,186 160,198 160,212 L160,290" className="vv-wall-line" />
      </g>

      {/* Flow, drawn per state; animated only while playing, visible and motion is allowed */}
      {state === 'open' && (
        <g className="vv-flow vv-flow--up" aria-hidden="true">
          <path d="M120,282 L120,40" />
          <path d="M104,282 C104,220 100,150 104,46" />
          <path d="M136,282 C136,220 140,150 136,46" />
          <path d="M108,40 L120,22 L132,40" className="vv-arrowhead" />
        </g>
      )}
      {state === 'closed' && (
        <g className="vv-flow vv-flow--held" aria-hidden="true">
          <path d="M100,70 C96,110 92,128 82,150" />
          <path d="M140,70 C144,110 148,128 158,150" />
          <path d="M76,140 L82,152 L94,146" className="vv-arrowhead" />
          <path d="M164,140 L158,152 L146,146" className="vv-arrowhead" />
        </g>
      )}
      {state === 'reflux' && (
        <g className="vv-flow vv-flow--down" aria-hidden="true">
          <path d="M120,24 L120,268" />
          <path d="M110,60 C112,140 114,200 108,262" />
          <path d="M130,60 C128,140 126,200 132,262" />
          <path d="M108,266 L120,284 L132,266" className="vv-arrowhead" />
        </g>
      )}

      {/* Valve flaps (leaflets), hinged at the vein wall */}
      <path
        d="M80,205 C92,198 112,178 120,150"
        className={`vv-leaflet vv-leaflet--left ${state === 'reflux' ? 'is-highlight' : ''}`}
        style={{ transform: g.leftLeaflet }}
      />
      <path
        d="M160,205 C148,198 128,178 120,150"
        className={`vv-leaflet vv-leaflet--right ${state === 'reflux' ? 'is-highlight' : ''}`}
        style={{ transform: g.rightLeaflet }}
      />
    </svg>
  );
};

const LegSchematic: React.FC<{ layers: Record<LayerId, boolean>; titleId: string }> = ({ layers, titleId }) => (
  <svg viewBox="0 0 160 320" className="vv-leg" role="img" aria-labelledby={titleId}>
    <title id={titleId}>
      Simplified schematic of one leg showing{' '}
      {LAYERS.filter((l) => layers[l.id]).map((l) => l.label.toLowerCase()).join(', ') || 'no vein layers'}, and where
      the valve in the close-up sits. Positions are approximate.
    </title>
    {/* Simplified front view: thigh, knee, calf, ankle, foot. Not traced from any reference. */}
    <path
      d="M40,12 C38,60 44,110 50,150 C42,180 38,212 48,242 C53,256 57,264 56,274 C50,292 60,306 80,306 C100,306 110,292 102,274 C100,262 104,254 110,240 C118,212 114,180 106,150 C112,110 120,60 118,12 Z"
      className="vv-leg-outline"
    />
    {layers.deep && (
      <g className="vv-layer vv-layer--deep">
        <path d="M84,16 C86,70 86,120 82,150 C80,190 80,232 80,282" />
      </g>
    )}
    {layers.perforators && (
      <g className="vv-layer vv-layer--perforators">
        <path d="M58,100 L84,96" />
        <path d="M55,190 L80,186" />
        <path d="M58,238 L80,234" />
      </g>
    )}
    {layers.superficial && (
      <g className="vv-layer vv-layer--superficial">
        <path d="M70,18 C60,70 55,120 59,150 C53,190 53,232 60,284" />
      </g>
    )}
    {/* Valve markers: small ticks; the close-up valve gets a static ring (no pulsing) */}
    <g className="vv-valve-marks" aria-hidden="true">
      <path d="M59,64 l4,-3 l4,3" />
      <path d="M52,214 l4,-3 l4,3" />
      <path d="M81,124 l4,-3 l4,3" />
      <circle cx="58" cy="140" r="9" className="vv-focus-ring" />
      <circle cx="58" cy="140" r="3" className="vv-focus-dot" />
    </g>
  </svg>
);

export const VenousValvePrototype: React.FC = () => {
  const [state, setState] = useState<ValveStateId>('open');
  const [isPlaying, setIsPlaying] = useState(false);
  const [layers, setLayers] = useState<Record<LayerId, boolean>>({ superficial: true, deep: true, perforators: true });
  const reducedMotion = usePrefersReducedMotion();
  const figureRef = useRef<HTMLDivElement>(null);
  const visible = useIsVisible(figureRef);
  const id = useId();

  const animating = isPlaying && visible && !reducedMotion;
  const spec = VALVE_STATES[state];

  return (
    <section className="vv" aria-labelledby={`${id}-title`}>
      <header className="vv-header">
        <p className="vv-eyebrow">Educational illustration · Prototype</p>
        <h2 id={`${id}-title`} className="vv-title">
          How a vein valve works
        </h2>
        <p className="vv-lede">
          Leg veins have small one-way valves. Choose a state to see what the valve does, and play the flow to watch the
          blood move.
        </p>
      </header>

      <div className="vv-controls">
        <fieldset className="vv-states">
          <legend className="vv-legend">Valve state</legend>
          <div className="vv-segments">
            {STATE_ORDER.map((s) => (
              <span key={s} className="vv-segment">
                <input
                  type="radio"
                  id={`${id}-${s}`}
                  name={`${id}-state`}
                  value={s}
                  checked={state === s}
                  onChange={() => setState(s)}
                  className="vv-radio"
                />
                <label htmlFor={`${id}-${s}`} className="vv-segment-label" data-state={s}>
                  <span className="vv-segment-name">{VALVE_STATES[s].label}</span>
                  <span className="vv-segment-hint">{VALVE_STATES[s].hint}</span>
                </label>
              </span>
            ))}
          </div>
        </fieldset>

        {reducedMotion ? (
          <p className="vv-motion-note">Motion is reduced on this device, so the flow is shown as still arrows.</p>
        ) : (
          <button type="button" className="vv-play" onClick={() => setIsPlaying((p) => !p)}>
            <span aria-hidden="true" className="vv-play-icon">
              {isPlaying ? (
                <svg viewBox="0 0 20 20">
                  <rect x="5" y="4" width="3.5" height="12" rx="1" />
                  <rect x="11.5" y="4" width="3.5" height="12" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20">
                  <path d="M6 4 L16 10 L6 16 Z" />
                </svg>
              )}
            </span>
            <span>{isPlaying ? 'Pause flow' : 'Play flow'}</span>
          </button>
        )}
      </div>

      <p className="vv-status" aria-live="polite">
        {spec.caption}
      </p>

      <div className="vv-grid">
        <figure className="vv-card vv-card--closeup" ref={figureRef}>
          <span className="vv-badge">Illustration · not to scale · not a scan</span>
          <p className="vv-orient">↑ Toward the heart</p>
          <div className={`vv-stage ${animating ? 'is-animating' : ''}`} data-state={state}>
            <ValveCloseUp state={state} titleId={`${id}-svg-title`} descId={`${id}-svg-desc`} />
          </div>
          <p className="vv-orient">↓ Toward the foot</p>
          <figcaption className="vv-figcaption">
            <strong>{spec.label}.</strong> {spec.hint}.{' '}
            {state === 'closed' ? 'Nothing moves past a closed valve.' : null}
          </figcaption>
        </figure>

        <div className="vv-card vv-card--text">
          <h3 className="vv-h3">What is happening</h3>
          <p className="vv-body">{spec.whatHappens}</p>
          <h3 className="vv-h3">Why it matters</h3>
          <p className="vv-body">{spec.whyItMatters}</p>
          <p className="vv-review-note">Wording is general education and has not yet been reviewed by a clinician.</p>
        </div>

        <figure className="vv-card vv-card--leg">
          <h3 className="vv-h3">Where valves sit</h3>
          <LegSchematic layers={layers} titleId={`${id}-leg-title`} />
          <div className="vv-layers" role="group" aria-label="Show or hide vein layers">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="vv-layer-toggle"
                data-layer={l.id}
                aria-pressed={layers[l.id]}
                onClick={() => setLayers((prev) => ({ ...prev, [l.id]: !prev[l.id] }))}
              >
                <span className="vv-swatch" aria-hidden="true" />
                {l.label}
              </button>
            ))}
          </div>
          <figcaption className="vv-figcaption">
            Simplified schematic, not an anatomical map. Vein positions are approximate; the ring marks the valve shown in
            the close-up.
          </figcaption>
        </figure>
      </div>

      <footer className="vv-footer">
        <p>
          <strong>Educational illustration only.</strong> This is a simplified model to explain an idea. It is not a scan, a
          measurement or a diagnosis, and it does not show your own veins.
        </p>
        <p>
          <strong>About the concept sheet.</strong> The five-panel concept sheet was supplied as a single flattened image
          (WebP, no transparent layers). It is not stored in this project, so it isn&rsquo;t shown here, and these drawings
          are not traced from it. Separated, reviewed artwork would replace them.
        </p>
      </footer>
    </section>
  );
};
