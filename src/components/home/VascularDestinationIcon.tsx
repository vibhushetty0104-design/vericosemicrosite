import React from 'react';
import { VisualTopicItem } from './vascularTopics';

interface VascularDestinationIconProps {
  item: VisualTopicItem;
  size?: 'desktop' | 'mobile';
  isHovered?: boolean;
  isOpen?: boolean;
  className?: string;
}

/**
 * VASCULAR DESTINATION ICON (Prominent & Dimensional Medical Emblem)
 * The primary focal point of each medical environment:
 * - 15-20% larger artwork scale with crystal-clear contrast.
 * - Soft, translucent luminous backing plate (no heavy circular containers).
 * - Multi-stage realistic soft drop shadows for a natural floating appearance.
 * - Smooth, gentle lift (-translate-y-2) and subtle scale (1.07) on hover/active.
 * - Clean, restrained contextual accents without rapid or distracting animations.
 */
export const VascularDestinationIcon: React.FC<VascularDestinationIconProps> = ({
  item,
  size = 'desktop',
  isHovered = false,
  isOpen = false,
  className = '',
}) => {
  const isDesktop = size === 'desktop';
  const isActive = isHovered || isOpen;

  // Render quiet, dignified contextual accents where helpful
  const renderContextualAccent = () => {
    switch (item.id) {
      case 'assessment':
        // Feetscan: Smooth horizontal laser scanline
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div
              className={`absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CE5B40] to-transparent ${
                isActive ? 'opacity-90 shadow-[0_0_8px_#CE5B40]' : 'opacity-40'
              } transition-opacity duration-300 animate-scanline`}
            />
          </div>
        );

      case 'dvt':
        // Emergency hospital triage indicator
        return (
          <div className="absolute top-1 right-1 pointer-events-none flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full border border-white transition-all duration-300 ${
                isActive ? 'bg-[#CE5B40] scale-125 shadow-[0_0_8px_#CE5B40]' : 'bg-[#CE5B40]/80'
              }`}
            />
          </div>
        );

      case 'expert-review':
        // Duplex Doppler scan badge
        return (
          <div
            className={`absolute top-1 left-1 px-1.5 py-0.5 rounded-full border transition-all duration-300 pointer-events-none flex items-center gap-1 ${
              isActive
                ? 'bg-white border-[#CE5B40] shadow-2xs'
                : 'bg-white/90 border-[#0B4036]/15'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-[#CE5B40]' : 'bg-[#0B4036]'
              }`}
            />
            <span className="text-[8px] font-mono font-bold text-[#0B4036]">DOPPLER</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative select-none transition-all duration-300 ease-out ${
        isDesktop
          ? 'w-28 h-28 xl:w-32 xl:h-32'
          : 'w-20 h-20 sm:w-22 sm:h-22'
      } ${
        isActive ? 'transform -translate-y-2 scale-[1.07]' : ''
      } ${className}`}
    >
      {/* ===================================================================== */}
      {/* 1. SOFT TRANSLUCENT LUMINOUS BACKING PLATE                             */}
      {/* Provides crystal-clear contrast without a heavy, bulky container       */}
      {/* ===================================================================== */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isActive
            ? 'bg-white/95 shadow-[0_20px_35px_-8px_rgba(11,64,54,0.22),0_0_24px_rgba(206,91,64,0.18)] border border-[#CE5B40]/60 ring-2 ring-[#CE5B40]/40'
            : 'bg-white/80 hover:bg-white/90 shadow-[0_12px_24px_-4px_rgba(11,64,54,0.12),0_2px_5px_rgba(11,64,54,0.05)] border border-[#8DAA9D]/30 hover:border-[#0B4036]/25'
        }`}
      >
        {/* Delicate inner rim highlight */}
        <div className="absolute inset-[1px] rounded-[15px] border border-white/70 pointer-events-none" />
      </div>

      {/* ===================================================================== */}
      {/* 2. THE 2.5D MEDICAL ILLUSTRATION ARTWORK (Primary Focal Point)        */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 flex items-center justify-center p-2.5 sm:p-3 z-10">
        <picture className="w-full h-full flex items-center justify-center">
          <source srcSet={item.iconWebp} type="image/webp" />
          <img
            src={item.iconPng}
            alt={item.title}
            className={`w-full h-full object-contain filter transition-all duration-300 ${
              isActive
                ? 'scale-105 drop-shadow-[0_8px_14px_rgba(11,64,54,0.22)]'
                : 'drop-shadow-[0_3px_6px_rgba(11,64,54,0.10)]'
            }`}
            loading="lazy"
          />
        </picture>
      </div>

      {/* ===================================================================== */}
      {/* 3. RESTRAINED CONTEXTUAL ACCENTS                                      */}
      {/* ===================================================================== */}
      <div className="z-20">{renderContextualAccent()}</div>

      {/* ===================================================================== */}
      {/* 4. CONNECTING STEM INDICATOR NODE (Illuminates on hover/active)       */}
      {/* ===================================================================== */}
      <div
        className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white transition-all duration-300 pointer-events-none z-30 ${
          isActive
            ? 'bg-[#CE5B40] scale-125 shadow-[0_0_8px_#CE5B40]'
            : 'bg-[#8DAA9D] opacity-60'
        }`}
      />
    </div>
  );
};
