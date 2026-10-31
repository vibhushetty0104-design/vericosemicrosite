import React, { useState, useEffect } from 'react';
import { Meridbot } from './Meridbot';
import { MeridbotPose } from '../../content/meridbot';

interface MeridbotScrollCompanionProps {
  activeView?: string;
  className?: string;
  onOpenChat?: () => void;
  isChatOpen?: boolean;
}

/**
 * Meridbot Floating Companion
 *
 * Standalone illustrated mascot that subtly accompanies visitors as they explore the website:
 * - Appears as a standalone floating character without background pills or circular frames.
 * - Active across both homepage and inner pages.
 * - Calm, organic vertical floating motion (~5-6px) with soft tilt.
 * - Natural lifelike blinks at occasional intervals in idle state.
 * - Contextual pose changes as the visitor moves across key clinical sections.
 * - Clicking or tapping the character opens the "Ask Meridbot" chatbox.
 * - Safe outer-margin positioning that never obscures headings, forms, CTAs or 3D models.
 * - Automatically hides when the footer is reached or when the chatbox is already open.
 * - Desktop size: 76px tall (within 65-90px). Mobile size: 48px tall (within 42-55px).
 * - Fully respects `prefers-reduced-motion` (renders static, zero float/blink).
 */
export const MeridbotScrollCompanion: React.FC<MeridbotScrollCompanionProps> = ({
  activeView = 'home',
  className = '',
  onOpenChat,
  isChatOpen = false,
}) => {
  const [basePose, setBasePose] = useState<MeridbotPose>('idle');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [scrollYPosition, setScrollYPosition] = useState(0);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Throttled scroll listener using requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollYPosition(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Update base pose contextually based on activeView and scroll position
  useEffect(() => {
    if (activeView === 'assessment') {
      setBasePose('thinking');
    } else if (activeView === 'treatments') {
      setBasePose('present');
    } else if (activeView === 'expert-review') {
      setBasePose('standing-happy');
    } else if (activeView === 'learn') {
      setBasePose('thinking');
    } else if (activeView === 'doppler' || activeView === 'journey') {
      setBasePose('present');
    } else {
      // On homepage: adapt contextually with scroll depth
      if (scrollYPosition > 2200) {
        setBasePose('idle');
      } else if (scrollYPosition > 1300) {
        setBasePose('present');
      } else if (scrollYPosition > 500) {
        setBasePose('thinking');
      } else {
        setBasePose('idle');
      }
    }
  }, [activeView, scrollYPosition]);

  // IntersectionObserver to gracefully hide Meridbot when footer is in view
  useEffect(() => {
    const footerEl = document.querySelector('footer');
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(footerEl);
    return () => observer.disconnect();
  }, []);

  // Natural intermittent blink when in idle pose (skipped under reduced motion)
  useEffect(() => {
    if (isReducedMotion || basePose !== 'idle') {
      setIsBlinking(false);
      return;
    }

    let blinkTimeout: number;
    let resetTimeout: number;

    const scheduleNextBlink = () => {
      // Random delay between 4.2s and 7.2s
      const delay = 4200 + Math.random() * 3000;
      blinkTimeout = window.setTimeout(() => {
        setIsBlinking(true);
        resetTimeout = window.setTimeout(() => {
          setIsBlinking(false);
          scheduleNextBlink();
        }, 150);
      }, delay);
    };

    scheduleNextBlink();

    return () => {
      window.clearTimeout(blinkTimeout);
      window.clearTimeout(resetTimeout);
    };
  }, [basePose, isReducedMotion]);

  // Active pose selection
  const currentPose: MeridbotPose = isBlinking ? 'blink' : basePose;

  // When footer is visible or chatbox is already open, gracefully hide
  const isHidden = isFooterVisible || isChatOpen;

  return (
    <aside
      aria-label="Meridbot educational companion"
      className={`fixed z-40 transition-all duration-500 ease-out ${className}`}
      style={{
        right: 'clamp(1rem, 2.5vw, 2.25rem)',
        bottom: isHidden ? '5.5rem' : 'clamp(1.25rem, 3.5vh, 2.25rem)',
        opacity: isHidden ? 0 : 1,
        pointerEvents: isHidden ? 'none' : 'auto',
        transform: isHidden ? 'translateY(16px) scale(0.9)' : 'translateY(0) scale(1)',
      }}
    >
      <button
        type="button"
        onClick={onOpenChat}
        aria-label="Ask Meridbot questions about vein health and treatment options"
        title="Ask Meridbot"
        className="group relative flex flex-col items-center bg-transparent border-none p-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-mv-forest focus-visible:outline-offset-4 rounded-full transition-transform hover:scale-105 active:scale-95"
      >
        {/* Floating animated character without background container */}
        <div className={isReducedMotion ? '' : 'mv-floating-character'}>
          {/* Desktop size: 76px tall */}
          <div className="hidden sm:block">
            <Meridbot pose={currentPose} height={76} />
          </div>
          {/* Mobile size: 48px tall */}
          <div className="block sm:hidden">
            <Meridbot pose={currentPose} height={48} />
          </div>
        </div>

        {/* Soft atmospheric ambient shadow */}
        {!isReducedMotion && (
          <div className="mv-floating-shadow" />
        )}
      </button>
    </aside>
  );
};
