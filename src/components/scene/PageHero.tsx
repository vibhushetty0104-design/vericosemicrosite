import React, { useEffect, useRef } from 'react';
import { ILLUSTRATIONS, IllustrationKey } from '../../content/illustrations';
import { MeridbotPose } from '../../content/meridbot';
import { Meridbot } from '../meridbot/Meridbot';
import { MessageCircleQuestion } from 'lucide-react';
import { LivingPageBackground, PageBackgroundVariant } from './LivingPageBackground';
import './scene.css';

function resolveBackgroundVariant(id: string): PageBackgroundVariant {
  if (id.includes('learn')) return 'learn';
  if (id.includes('doppler')) return 'doppler';
  if (id.includes('treatment')) return 'treatments';
  if (id.includes('assessment')) return 'assessment';
  if (id.includes('specialist')) return 'specialists';
  if (id.includes('journey')) return 'journey';
  if (id.includes('insurance')) return 'insurance';
  if (id.includes('research')) return 'research';
  return 'learn';
}

/*
 * Page hero with a 2.5D scene (stakeholder demo). Layered tonal planes and a vein motif sit behind
 * the approved dimensional icons. Motion is limited to a one-time entrance and a gentle pointer
 * response on desktop (nothing loops on its own); both are off under reduced motion.
 */

export interface HeroChip {
  label: string;
  href: string;
}

interface PageHeroProps {
  id: string;
  title: string;
  lede: string;
  illustrations: [IllustrationKey, IllustrationKey?, IllustrationKey?];
  chips?: HeroChip[];
  onAskMeridbot?: () => void;
  meridbotPose?: MeridbotPose;
  tone?: 'sage' | 'clay' | 'forest';
  children?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  id,
  title,
  lede,
  illustrations,
  chips = [],
  onAskMeridbot,
  meridbotPose,
  tone = 'sage',
  children,
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Gentle pointer response (fine pointers only, never under reduced motion).
  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene) return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      const r = scene.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        scene.style.setProperty('--px', x.toFixed(3));
        scene.style.setProperty('--py', y.toFixed(3));
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      scene.style.setProperty('--px', '0');
      scene.style.setProperty('--py', '0');
    };
    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const [main, second, third] = illustrations;

  return (
    <section ref={sectionRef} aria-labelledby={`${id}-title`} className={`mv-hero2 mv-hero2--${tone} relative overflow-hidden`}>
      <LivingPageBackground variant={resolveBackgroundVariant(id)} />
      <div className="container-page relative z-10 grid max-w-[1200px] items-center gap-6 py-8 sm:py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:py-14">
        <div className="max-w-[38rem]">
          <h1
            id={`${id}-title`}
            className="font-serif text-[32px] font-semibold leading-[1.1] tracking-[-0.015em] text-mv-forest text-balance sm:text-[40px] lg:text-[48px]"
          >
            {title}
          </h1>
          <p className="mt-3 max-w-[36rem] text-[18px] leading-relaxed text-mv-ink-muted">{lede}</p>
          {chips.length > 0 && (
            <nav aria-label="On this page" className="mt-5">
              <ul className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <li key={c.href}>
                    <a
                      href={c.href}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-mv-outline-strong bg-mv-surface px-4 text-[15px] font-semibold text-mv-forest transition-colors hover:bg-mv-pale"
                    >
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          {onAskMeridbot && (
            <button type="button" onClick={onAskMeridbot} className="mv-btn mv-btn-quiet mt-3 -ml-2 text-[15px]">
              <MessageCircleQuestion className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              Ask Meridbot about this page
            </button>
          )}
          {children}
        </div>

        <div ref={sceneRef} className="mv-scene" aria-hidden="true">
          <svg className="mv-scene__layer mv-scene__plane mv-scene__plane--edge" viewBox="0 0 400 320" preserveAspectRatio="none">
            <path d="M40 70 C80 18 190 6 270 24 C350 42 392 104 384 176 C376 250 312 300 214 306 C120 312 44 280 22 206 C6 150 10 108 40 70 Z" />
          </svg>
          <svg className="mv-scene__layer mv-scene__plane mv-scene__plane--back" viewBox="0 0 400 320" preserveAspectRatio="none">
            <path d="M40 70 C80 18 190 6 270 24 C350 42 392 104 384 176 C376 250 312 300 214 306 C120 312 44 280 22 206 C6 150 10 108 40 70 Z" />
          </svg>
          <svg className="mv-scene__layer mv-scene__plane mv-scene__plane--mid" viewBox="0 0 400 320" preserveAspectRatio="none">
            <path d="M120 238 C150 196 214 182 276 192 C338 202 376 236 364 270 C352 300 290 312 214 310 C150 308 100 282 120 238 Z" />
          </svg>
          <svg className="mv-scene__layer mv-scene__vein" viewBox="0 0 400 320" preserveAspectRatio="none">
            <path className="mv-scene__vein-line" d="M58 286 C96 236 92 190 138 156 C186 120 236 132 268 96 C298 62 330 58 360 40" />
            <path className="mv-scene__valve" d="M128 160 l10 -10 l10 10" />
            <path className="mv-scene__valve" d="M256 104 l10 -10 l10 10" />
            <circle className="mv-scene__node" cx="58" cy="286" r="6" />
            <circle className="mv-scene__node" cx="360" cy="40" r="6" />
          </svg>
          <img className="mv-scene__layer mv-scene__item mv-scene__item--main" src={ILLUSTRATIONS[main]} alt="" decoding="async" />
          {second && <img className="mv-scene__layer mv-scene__item mv-scene__item--b" src={ILLUSTRATIONS[second]} alt="" decoding="async" loading="lazy" />}
          {third && <img className="mv-scene__layer mv-scene__item mv-scene__item--c" src={ILLUSTRATIONS[third]} alt="" decoding="async" loading="lazy" />}
          {meridbotPose && (
            <span className="mv-scene__layer mv-scene__bot">
              <Meridbot pose={meridbotPose} height={104} />
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
