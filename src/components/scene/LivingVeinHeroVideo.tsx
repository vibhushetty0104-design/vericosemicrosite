import React, { useEffect, useRef, useState } from 'react';

interface LivingVeinHeroVideoProps {
  className?: string;
}

/**
 * LivingVeinHeroVideo
 *
 * Implements the living vascular circulation background video into the Meridian Vascular homepage hero.
 * - Sourced from /assets/meridian-hero-background.mp4.
 * - Autoplay, loop, muted, playsInline, preload="auto" with zero controls.
 * - Styled cleanly with absolute inset-0 w-full h-full object-cover object-center.
 * - Layered behind foreground content (pointer-events-none, z-0).
 * - Restrained forest-green (#0B4036) gradient scrim maintains flawless editorial text contrast.
 * - Provides static poster fallback for browsers with autoplay blocks or prefers-reduced-motion.
 */
export const LivingVeinHeroVideo: React.FC<LivingVeinHeroVideoProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Ensure programmatic play attempt for strict autoplay policies
    const video = videoRef.current;
    if (video && !prefersReducedMotion) {
      video.muted = true;
      video.play().catch(() => {
        // Autoplay may be deferred until first user interaction; poster will remain visible
      });
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full select-none overflow-hidden z-0 ${className}`}
    >
      {/* Video / Poster Stage */}
      <div className="relative h-full w-full">
        {!prefersReducedMotion && !hasError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/assets/meridian-hero-poster.jpg"
            aria-hidden="true"
            onError={() => setHasError(true)}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-80 transition-opacity duration-700"
          >
            <source src="/assets/meridian-hero-background.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/assets/meridian-hero-poster.jpg"
            alt=""
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-75"
          />
        )}

        {/* Sophisticated Vignette & Text Readability Scrims in #0B4036 */}
        {/* Left Side Scrim: High-density gradient protecting hero headline, subtext and CTA buttons */}
        <div className="absolute inset-y-0 left-0 w-full md:w-3/5 lg:w-1/2 bg-gradient-to-r from-mv-forest via-mv-forest/90 to-transparent z-10" />

        {/* Overall subtle darkening overlay across whole viewport for crisp text readability */}
        <div className="absolute inset-0 bg-mv-forest/35 z-10" />

        {/* Top Edge: Soft transition from navigation header */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-mv-forest via-mv-forest/70 to-transparent z-10" />

        {/* Bottom Edge: Seamless transition to subsequent sections */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-mv-forest via-mv-forest/80 to-transparent z-10" />

        {/* Radial vignette drawing the eye to the organic vessel motion while framing content */}
        <div className="absolute inset-0 bg-radial-[at_65%_45%] from-transparent via-mv-forest/20 to-mv-forest/70 z-10" />
      </div>
    </div>
  );
};
