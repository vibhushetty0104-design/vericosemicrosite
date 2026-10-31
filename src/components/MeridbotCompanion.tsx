import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { promptsFor } from '../content/meridbot';
import { AppView } from '../types';

/**
 * ---------------------------------------------------------------------------
 * CONFIGURATION & REVERSIBILITY TOGGLE
 * ---------------------------------------------------------------------------
 * Set USE_25D_PROTOTYPE to `false` to instantly revert to the earlier editorial
 * mascot assets in `public/assets/meridbot/`.
 * Set to `true` to use the verified 2.5D character poses in `public/assets/meridbot-25d/`.
 */
export const USE_25D_PROTOTYPE = true;

export type MeridbotPose =
  | 'wave'
  | 'idle'
  | 'blink'
  | 'present'
  | 'thinking'
  | 'happy'
  | 'standing-happy';

const MASCOT_ASSETS_EDITORIAL: Record<MeridbotPose, string> = {
  wave: '/assets/meridbot/meridbot-wave.png',
  idle: '/assets/meridbot/meridbot-idle.png',
  blink: '/assets/meridbot/meridbot-idle.png',
  present: '/assets/meridbot/meridbot-present.png',
  thinking: '/assets/meridbot/meridbot-idle.png',
  happy: '/assets/meridbot/meridbot-wave.png',
  'standing-happy': '/assets/meridbot/meridbot-wave.png',
};

const MASCOT_ASSETS_25D: Record<MeridbotPose, string> = {
  wave: '/assets/meridbot-25d/meridbot-wave.png',
  idle: '/assets/meridbot-25d/meridbot-idle.png',
  blink: '/assets/meridbot-25d/meridbot-blink.png',
  present: '/assets/meridbot-25d/meridbot-present.png',
  thinking: '/assets/meridbot-25d/meridbot-thinking.png',
  happy: '/assets/meridbot-25d/meridbot-happy.png',
  'standing-happy': '/assets/meridbot-25d/meridbot-standing-happy.png',
};

interface MeridbotCompanionProps {
  onStartAssessment: () => void;
  onNavigateToDoppler: () => void;
  onOpenAssistant: () => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  currentView?: AppView;
  className?: string;
}

const DESKTOP_GREETING =
  "Hi, I'm Meridbot! 👋 I can help you understand vein symptoms, Doppler reports and your care options. What would you like to explore?";
const MOBILE_GREETING =
  "Hi, I'm Meridbot! 👋 I can help explain vein symptoms, scan reports, and care options. What would you like to explore?";

export const MeridbotCompanion: React.FC<MeridbotCompanionProps> = ({
  onStartAssessment,
  onNavigateToDoppler,
  onOpenAssistant,
  onOpenAssistantWithPrompt,
  currentView,
  className = '',
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const fullText = isMobile ? MOBILE_GREETING : DESKTOP_GREETING;
  const poseImageMap = USE_25D_PROTOTYPE ? MASCOT_ASSETS_25D : MASCOT_ASSETS_EDITORIAL;

  // Session storage check for greeting dismissal
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('meridbot_greeting_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [step, setStep] = useState<'hidden' | 'entering' | 'typing' | 'idle'>(
    isDismissed ? 'idle' : 'hidden'
  );
  const [displayedText, setDisplayedText] = useState<string>(
    isDismissed || prefersReducedMotion ? fullText : ''
  );
  const [activePose, setActivePose] = useState<MeridbotPose>('wave');
  const [tapCooldown, setTapCooldown] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const blinkTimerRef = useRef<number | null>(null);

  const handleCharacterTap = () => {
    if (tapCooldown || activePose === 'thinking') return;
    setTapCooldown(true);
    setActivePose('standing-happy');
    window.setTimeout(() => {
      setActivePose('idle');
      window.setTimeout(() => setTapCooldown(false), 2000);
    }, 1500);
  };

  // Resize and reduced-motion listeners
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    window.addEventListener('resize', handleResize);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Greeting and typing sequence
  useEffect(() => {
    if (isDismissed) {
      setStep('idle');
      setActivePose('idle');
      setDisplayedText(fullText);
      return;
    }

    if (prefersReducedMotion) {
      setStep('idle');
      setActivePose('idle');
      setDisplayedText(fullText);
      return;
    }

    // Phase 1: Subtle entrance after hero content is readable
    const entranceTimeout = window.setTimeout(() => {
      setStep('entering');
      setActivePose('wave');

      // Phase 2: Start typing
      const typingStartTimeout = window.setTimeout(() => {
        setStep('typing');
        setActivePose('thinking');
        let charIndex = 0;

        const typeNextChar = () => {
          if (charIndex <= fullText.length) {
            setDisplayedText(fullText.slice(0, charIndex));
            charIndex++;

            // Natural slight pauses for punctuation
            const lastChar = fullText[charIndex - 2];
            const delay = lastChar === '.' ? 100 : lastChar === ',' || lastChar === '!' ? 60 : 20;

            timerRef.current = window.setTimeout(typeNextChar, delay);
          } else {
            // Typing complete: settle to idle after a breath
            setStep('idle');
            window.setTimeout(() => setActivePose('idle'), 500);
          }
        };

        typeNextChar();
      }, 350);

      return () => clearTimeout(typingStartTimeout);
    }, 400);

    return () => {
      clearTimeout(entranceTimeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDismissed, fullText, prefersReducedMotion]);

  // Natural, periodic eye blinking when idle
  useEffect(() => {
    if (step !== 'idle' || isDismissed || prefersReducedMotion) {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
      return;
    }

    const scheduleNextBlink = () => {
      // Random interval between 3.8 and 6.2 seconds
      const nextDelay = 3800 + Math.random() * 2400;
      blinkTimerRef.current = window.setTimeout(() => {
        // Only blink if currently resting in idle pose
        setActivePose((prev) => (prev === 'idle' ? 'blink' : prev));

        // Blink duration: 200ms
        const restoreTimeout = window.setTimeout(() => {
          setActivePose((prev) => (prev === 'blink' ? 'idle' : prev));
          scheduleNextBlink();
        }, 200);

        return () => clearTimeout(restoreTimeout);
      }, nextDelay);
    };

    scheduleNextBlink();

    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, [step, isDismissed, prefersReducedMotion]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setStep('idle');
    setActivePose('idle');
    try {
      sessionStorage.setItem('meridbot_greeting_dismissed', 'true');
    } catch {
      // Ignore storage errors in restricted contexts
    }
  };

  const handleReopenGreeting = () => {
    setIsDismissed(false);
    setDisplayedText(fullText);
    setStep('idle');
    setActivePose('wave');
    try {
      sessionStorage.removeItem('meridbot_greeting_dismissed');
    } catch {
      // Ignore
    }
    // Return to idle after a polite wave
    window.setTimeout(() => setActivePose('idle'), 1600);
  };

  return (
    <div className={`meridbot-companion-wrapper relative flex flex-col items-center sm:items-start ${className}`}>
      {/* 
        ACCESSIBILITY: Screen reader announcement for the full greeting 
        Avoids reading character-by-character typing.
      */}
      <div className="sr-only" aria-live="polite">
        {!isDismissed ? fullText : ''}
      </div>

      {/* When dismissed: Unobtrusive, calm pill affordance */}
      {isDismissed ? (
        <div className="meridbot-minimized flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAssistant}
            aria-label="Open Meridbot educational guide"
            className="group flex items-center gap-2.5 rounded-full border border-mv-pale/40 bg-mv-pale/10 px-3.5 py-2 text-mv-pale shadow-xs backdrop-blur-xs transition-all hover:border-mv-pale hover:bg-mv-pale/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mv-pale"
          >
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-mv-pale/40 bg-[#FAF7F2]">
              <img
                src={poseImageMap.idle}
                alt=""
                className="h-full w-full object-contain"
                aria-hidden="true"
              />
            </div>
            <span className="text-[14px] font-medium tracking-tight">Ask Meridbot</span>
            <Sparkles className="h-3.5 w-3.5 text-mv-accent transition-transform group-hover:scale-110" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleReopenGreeting}
            className="text-[13px] text-mv-sage/80 underline underline-offset-2 hover:text-mv-pale"
            aria-label="Show Meridbot greeting again"
          >
            Show greeting
          </button>
        </div>
      ) : (
        /* Full Living Mascot + Speech Bubble Experience */
        <div className="meridbot-active-container relative flex flex-col sm:flex-row items-center sm:items-start gap-2.5 sm:gap-4 w-full max-w-[500px]">
          {/* Meridbot Natural Character Figure (Interactive tap for friendly response) */}
          <div
            className={`meridbot-avatar-stage relative shrink-0 transition-all duration-500 ${
              step === 'hidden' ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
            }`}
          >
            <button
              type="button"
              onClick={handleCharacterTap}
              aria-label="Tap Meridbot for a friendly reaction"
              title="Tap Meridbot!"
              className={`meridbot-character-figure group relative h-[105px] w-[140px] sm:h-[150px] sm:w-[200px] select-none filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)] transition-transform duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mv-pale active:scale-95 ${
                step === 'idle' && !prefersReducedMotion ? 'animate-meridbot-breathe' : ''
              }`}
            >
              <img
                src={poseImageMap[activePose]}
                alt="Meridbot, friendly educational guide"
                className="h-full w-full object-contain select-none transition-transform duration-200 group-hover:scale-105"
                loading="eager"
                draggable={false}
              />
            </button>

            {/* Subtle grounding ambient contact shadow on Forest green */}
            <div
              aria-hidden="true"
              className="mx-auto -mt-2 h-2.5 w-16 sm:w-24 rounded-full bg-black/30 blur-[4px]"
            />
          </div>

          {/* Dialogue Speech Bubble */}
          <div
            className={`meridbot-speech-bubble relative flex-1 rounded-[16px] sm:rounded-[18px] border border-mv-outline/80 bg-[#FAF7F2] p-3.5 sm:p-4 text-mv-ink shadow-[0_12px_32px_rgba(11,64,54,0.18)] transition-all duration-400 ${
              step === 'hidden'
                ? 'opacity-0 scale-95 translate-y-2'
                : 'opacity-100 scale-100 translate-y-0'
            }`}
          >
            {/* Speech pointer towards Meridbot */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 top-7 hidden h-4 w-4 rotate-45 border-b border-l border-mv-outline/80 bg-[#FAF7F2] sm:block"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 block h-4 w-4 rotate-45 border-t border-l border-mv-outline/80 bg-[#FAF7F2] sm:hidden"
            />

            {/* Bubble Header: Clean branding & accessible dismiss control */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-mv-outline/40">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-mv-forest" aria-hidden="true" />
                <span className="font-serif text-[13px] font-semibold tracking-wide text-mv-forest uppercase">
                  Meridbot
                </span>
                <span className="text-[11px] font-sans text-mv-ink-muted">· Educational Guide</span>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss greeting"
                className="flex h-7 w-7 items-center justify-center rounded-full text-mv-ink-muted transition-colors hover:bg-mv-pale/40 hover:text-mv-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-mv-forest shrink-0"
              >
                <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            {/* Bubble Content: Natural Typing Body */}
            <div className="pt-2">
              <p className="font-sans text-[14px] sm:text-[14.5px] leading-relaxed text-mv-ink text-pretty">
                {displayedText}
                {step === 'typing' && !prefersReducedMotion && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-3.5 ml-0.5 bg-mv-terracotta animate-pulse"
                  />
                )}
              </p>

              {/* Quick Interactive Actions: Visible when typing settles or reduced motion */}
              {(step === 'idle' || prefersReducedMotion) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-mv-outline/30">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePose('standing-happy');
                      trackEvent('hero_primary_cta_click', { target: 'assessment', source: 'meridbot' });
                      onStartAssessment();
                      window.setTimeout(() => setActivePose('idle'), 1400);
                    }}
                    onMouseEnter={() => setActivePose('present')}
                    onMouseLeave={() => setActivePose('idle')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-mv-forest px-3 py-1.5 text-[12.5px] font-semibold text-white shadow-2xs transition-all hover:bg-mv-forest/90 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-mv-forest"
                  >
                    <span>Check symptoms</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePose('standing-happy');
                      trackEvent('hero_secondary_cta_click', { target: 'doppler', source: 'meridbot' });
                      onNavigateToDoppler();
                      window.setTimeout(() => setActivePose('idle'), 1400);
                    }}
                    onMouseEnter={() => setActivePose('present')}
                    onMouseLeave={() => setActivePose('idle')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-mv-forest/25 bg-transparent px-3 py-1.5 text-[12.5px] font-medium text-mv-forest transition-all hover:bg-mv-forest/5 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-mv-forest"
                  >
                    <span>Decode report</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAssistant}
                    onMouseEnter={() => setActivePose('thinking')}
                    onMouseLeave={() => setActivePose('idle')}
                    className="inline-flex items-center gap-1 text-[12px] text-mv-ink-muted hover:text-mv-forest ml-auto py-1"
                    title="Open educational guide"
                  >
                    <MessageCircleQuestion className="h-3.5 w-3.5 text-mv-sage" aria-hidden="true" />
                    <span>Ask question</span>
                  </button>
                </div>
              )}

              {/* Contextual prompt suggestions based on current section */}
              {(step === 'idle' || prefersReducedMotion) && onOpenAssistantWithPrompt && (
                <div className="mt-2.5 pt-2 border-t border-mv-outline/20">
                  <p className="text-[11px] font-mono font-medium text-mv-ink-muted/80 mb-1.5 flex items-center gap-1">
                    <span>Suggested questions:</span>
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {promptsFor(currentView).slice(0, 2).map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setActivePose('thinking');
                          onOpenAssistantWithPrompt(p);
                          window.setTimeout(() => setActivePose('idle'), 1200);
                        }}
                        className="text-left text-[12px] text-mv-forest hover:text-mv-terracotta bg-white/60 hover:bg-white rounded-lg px-2.5 py-1.5 border border-mv-outline/40 transition-colors line-clamp-1 cursor-pointer"
                      >
                        &ldquo;{p}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
