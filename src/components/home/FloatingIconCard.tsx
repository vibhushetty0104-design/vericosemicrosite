import React, { useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';

export type FloatingAnimationType =
  | 'vein'
  | 'doppler'
  | 'treatment'
  | 'specialist'
  | 'pathway'
  | 'meridbot'
  | 'anatomy'
  | 'insurance'
  | 'research'
  | 'warning'
  | 'prevention'
  | 'faq'
  | 'portal'
  | 'appointment'
  | 'assessment'
  | string;

export interface FloatingIconCardProps {
  id: string;
  animationType: FloatingAnimationType;
  iconWebp: string;
  iconPng: string;
  title: string;
  category: string;
  description: string;
  actionLabel: string;
  href: string;
  onClick: (e: React.MouseEvent) => void;
  badge?: string;
  clinicalNote?: string;
}

export const FloatingIconCard: React.FC<FloatingIconCardProps> = ({
  id,
  animationType,
  iconWebp,
  iconPng,
  title,
  category,
  description,
  actionLabel,
  href,
  onClick,
  badge,
  clinicalNote,
}) => {
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);

  // Character-specific animation wrapper classes
  const getAnimationClass = () => {
    switch (animationType) {
      case 'vein':
      case 'anatomy':
        return 'anim-vein-float';
      case 'doppler':
        return 'anim-doppler-float';
      case 'treatment':
      case 'insurance':
      case 'appointment':
        return 'anim-treatment-float';
      case 'specialist':
      case 'research':
      case 'portal':
        return 'anim-specialist-float';
      case 'pathway':
      case 'prevention':
        return 'anim-pathway-float';
      case 'meridbot':
      case 'faq':
        return 'anim-meridbot-icon-float';
      case 'warning':
        return 'anim-vein-float';
      default:
        return 'anim-vein-float';
    }
  };

  return (
    <div
      id={`explore-card-${id}`}
      onClick={(e) => {
        // Prevent card navigation if clicking inner interactive buttons (like disclosure drawer)
        if ((e.target as HTMLElement).closest('button')) return;
        onClick(e);
      }}
      className="group relative flex flex-col items-center text-center p-2.5 min-[360px]:p-3 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-300 focus-within:z-30 hover:z-30 bg-white/80 hover:bg-white sm:bg-transparent sm:hover:bg-white/70 focus-within:bg-white/70 cursor-pointer border border-mv-outline/70 hover:border-mv-sage/90 sm:border-transparent sm:hover:border-mv-forest/15 shadow-2xs hover:shadow-xs sm:shadow-none h-full min-w-0 justify-between"
    >
      {/* 
        1. Top Stage: Centered Medical Illustration
        On mobile: 80-110px target height, contain fit, zero cropping.
        On desktop: Unboxed floating icon with hover backlight and signature overlays.
      */}
      <div className="relative flex items-center justify-center w-full min-h-[90px] max-h-[110px] sm:max-h-none sm:min-h-[180px] select-none py-1 sm:py-0">
        
        {/* Soft ambient backlight blooming on hover */}
        <div
          aria-hidden="true"
          className="absolute inset-0 m-auto w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-radial from-mv-forest/8 via-mv-terracotta/5 to-transparent blur-xl sm:blur-2xl opacity-0 group-hover:opacity-100 group-hover:scale-130 transition-all duration-500 pointer-events-none motion-reduce:hidden"
        />

        {/* Character-Specific Signature Animation Overlays (Desktop & Tablet) */}
        {(animationType === 'vein' || animationType === 'anatomy') && (
          <div
            aria-hidden="true"
            className="hidden sm:block absolute inset-x-0 bottom-4 mx-auto w-24 h-24 pointer-events-none overflow-hidden"
          >
            <div className="anim-vein-gleam w-12 h-12 rounded-full bg-radial from-white/75 to-transparent blur-xs mx-auto" />
          </div>
        )}

        {animationType === 'doppler' && (
          <div
            aria-hidden="true"
            className="hidden sm:block absolute inset-x-8 top-12 bottom-12 overflow-hidden pointer-events-none rounded-xl"
          >
            <div className="anim-doppler-scan w-8 h-full bg-gradient-to-r from-transparent via-mv-terracotta/35 to-transparent blur-xs transform -skew-x-12" />
          </div>
        )}

        {(animationType === 'treatment' || animationType === 'insurance') && (
          <div
            aria-hidden="true"
            className="hidden sm:block absolute top-10 right-10 w-16 h-16 pointer-events-none"
          >
            <div className="anim-treatment-glow w-10 h-10 rounded-full bg-radial from-mv-terracotta/40 via-mv-terracotta/15 to-transparent blur-sm" />
          </div>
        )}

        {(animationType === 'pathway' || animationType === 'prevention') && (
          <div
            aria-hidden="true"
            className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none"
          >
            <span className="anim-pathway-node-1 w-2 h-2 rounded-full bg-mv-terracotta" />
            <span className="anim-pathway-node-2 w-2 h-2 rounded-full bg-mv-forest" />
            <span className="anim-pathway-node-3 w-2 h-2 rounded-full bg-mv-terracotta" />
          </div>
        )}

        {animationType === 'meridbot' && (
          <div
            aria-hidden="true"
            className="hidden sm:block absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none"
          >
            <span className="anim-meridbot-beacon block w-4 h-4 rounded-full bg-mv-terracotta/60 blur-xs" />
          </div>
        )}

        {/* The 2.5D Medical Illustration */}
        <a
          href={href}
          onClick={onClick}
          tabIndex={-1}
          aria-hidden="true"
          className={`${getAnimationClass()} block cursor-pointer transition-transform duration-300 ease-out group-hover:scale-105 sm:group-hover:scale-108 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 motion-reduce:transform-none`}
        >
          <picture>
            <source srcSet={iconWebp} type="image/webp" />
            <img
              src={iconPng}
              alt=""
              width={140}
              height={140}
              loading="lazy"
              decoding="async"
              className="w-18 h-18 min-[360px]:w-20 min-[360px]:h-20 sm:w-34 sm:h-34 object-contain drop-shadow-[0_4px_10px_rgba(11,64,54,0.10)] sm:drop-shadow-[0_10px_20px_rgba(11,64,54,0.13)] group-hover:drop-shadow-[0_12px_24px_rgba(11,64,54,0.18)] sm:group-hover:drop-shadow-[0_20px_35px_rgba(11,64,54,0.20)] transition-all duration-300 motion-reduce:transition-none"
            />
          </picture>
        </a>
      </div>

      {/* 
        2. Content Area: Category, Title, Description, and Actions
        Flex column so all elements stack cleanly and primary CTA pins to bottom.
      */}
      <div className="mt-2 sm:mt-2.5 flex flex-col items-center flex-1 w-full min-w-0 justify-between">
        
        {/* Typography Block */}
        <div className="flex flex-col items-center w-full min-w-0">
          <span className="font-mono text-[9.5px] min-[360px]:text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-mv-ink-muted/80 line-clamp-1 w-full text-center">
            {badge || category}
          </span>

          <h3
            id={`card-title-${id}`}
            className="mt-1 font-serif text-[14.5px] min-[360px]:text-[15.5px] sm:text-[22px] font-semibold leading-[1.25] sm:leading-tight text-mv-forest group-hover:text-mv-terracotta transition-colors duration-200 line-clamp-2 w-full text-center"
          >
            <a
              href={href}
              onClick={onClick}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest focus-visible:ring-offset-2 rounded-xs"
            >
              {title}
            </a>
          </h3>

          {/* Description: 2-3 lines on mobile, clean leading */}
          <p className="mt-1 sm:mt-2 text-[11.5px] min-[360px]:text-[12px] sm:text-[14px] leading-[1.45] sm:leading-relaxed text-mv-ink-muted line-clamp-3 w-full text-center">
            {description}
          </p>

          {/* Mobile Secondary Action: Discreet Clinical Note toggle */}
          {clinicalNote && (
            <div className="mt-1.5 w-full block lg:hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileInfoOpen(!isMobileInfoOpen);
                }}
                aria-expanded={isMobileInfoOpen}
                aria-controls={`info-drawer-${id}`}
                className="inline-flex items-center justify-center gap-1 text-[10.5px] font-medium text-mv-ink-muted/80 hover:text-mv-forest py-1 px-1.5 transition-colors cursor-pointer rounded-md hover:bg-mv-pale/50"
              >
                <Info className="w-3 h-3 text-mv-terracotta/90 shrink-0" aria-hidden="true" />
                <span>{isMobileInfoOpen ? 'Hide note' : 'Clinical note'}</span>
              </button>

              {isMobileInfoOpen && (
                <div
                  id={`info-drawer-${id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1.5 p-2 text-left rounded-xl bg-white/95 border border-mv-outline/70 text-[11px] text-mv-ink-muted leading-relaxed shadow-xs"
                >
                  <span className="font-semibold text-mv-forest block mb-0.5 text-[10.5px]">Clinical context:</span>
                  {clinicalNote}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 
          3. Mobile Primary Action: Explore Link
          Pinned to bottom so row cards align consistently across varying text lengths.
        */}
        <div className="mt-auto pt-2 block lg:hidden w-full">
          <a
            href={href}
            onClick={onClick}
            aria-label={`${actionLabel} for ${title}`}
            className="inline-flex items-center justify-center gap-1 text-[12px] min-[360px]:text-[12.5px] font-bold text-mv-terracotta hover:text-mv-cta active:text-mv-cta-press min-h-[40px] min-[360px]:min-h-[44px] py-1.5 px-2 transition-colors w-full group/link"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 text-mv-terracotta transition-transform group-hover/link:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* 
        3. Desktop Smooth Fade-and-Expand Information Panel
        On hover or keyboard focus: smoothly reveals itself floating cleanly below the card.
        The invisible before pseudo-element acts as a bridge so mouse hover is never lost between the trigger and panel.
      */}
      <div
        className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[calc(100%+24px)] z-30 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 transition-all duration-300 ease-out"
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-mv-forest/15 shadow-[0_16px_40px_rgba(11,64,54,0.14)] text-left">
          
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-mv-terracotta">
              {badge || category}
            </span>
            <span className="w-2 h-2 rounded-full bg-mv-sage/60" aria-hidden="true" />
          </div>

          <p className="text-[13.5px] leading-relaxed text-mv-ink-muted">
            {description}
          </p>

          {clinicalNote && (
            <p className="mt-2.5 pt-2 border-t border-mv-outline/50 text-[12px] leading-relaxed text-mv-forest/90">
              <strong className="text-mv-forest">Clinical context:</strong> {clinicalNote}
            </p>
          )}

          <div className="mt-3.5 pt-2.5 border-t border-mv-outline/50 flex items-center justify-between">
            <a
              href={href}
              onClick={onClick}
              aria-label={`${actionLabel} for ${title}`}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-mv-forest hover:text-mv-terracotta min-h-[44px] py-1 transition-colors"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-4 h-4 text-mv-terracotta group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
