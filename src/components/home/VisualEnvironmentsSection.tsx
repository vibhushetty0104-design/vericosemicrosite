import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  X,
  ExternalLink,
} from 'lucide-react';
import { AppView } from '../../types';
import { hrefForView, LearnTopicSlug, hrefForLearnTopic } from '../../content/siteNav';
import { ALL_VASCULAR_TOPICS, VisualTopicItem } from './vascularTopics';
import { VascularNetworkSvg } from './livingBackgrounds/VascularNetworkSvg';
import { HumanFormSvg } from './livingBackgrounds/HumanFormSvg';
import { CirculationFlowSvg } from './livingBackgrounds/CirculationFlowSvg';
import { ClinicalKnowledgeSvg } from './livingBackgrounds/ClinicalKnowledgeSvg';
import { VascularDestinationIcon } from './VascularDestinationIcon';

interface VisualEnvironmentsSectionProps {
  onNavigateView: (view: AppView) => void;
  onNavigateSection?: (view: AppView, sectionId: string) => void;
  onNavigateTopic?: (slug: LearnTopicSlug) => void;
  onOpenAssistant: () => void;
  onOpenBooking?: () => void;
}

export interface VisualEnvironmentConfig {
  id: string;
  legacyId?: string;
  number: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  bgType: 'vascular-network' | 'human-form' | 'circulation-flow' | 'clinical-knowledge';
  itemIds: string[];
  desktopLayouts: {
    // Relative coordinates (%) within the desktop canvas
    left: string;
    top: string;
    align?: 'left' | 'right' | 'center';
  }[];
}

export const VISUAL_ENVIRONMENTS: VisualEnvironmentConfig[] = [
  // ENVIRONMENT 01: VASCULAR NETWORK
  {
    id: 'env-vascular-network',
    legacyId: 'env-cath-lab',
    number: '01',
    badge: 'LIVING VISUAL SYSTEM · VASCULAR NETWORK',
    title: 'Vascular Network',
    tagline: 'Delicate branching vessel structures and valvular mechanics',
    description: 'Explore normal valvular architecture, retrograde pooling dynamics, hemodynamic biomechanics, and differential pain evaluation.',
    bgType: 'vascular-network',
    itemIds: ['circulation', 'causes', 'differential', 'science'],
    desktopLayouts: [
      { left: '12%', top: '14%', align: 'left' },     // Circulation (top-left: opens BELOW, expands right)
      { left: '74%', top: '14%', align: 'right' },    // Causes (top-right: opens BELOW, expands left)
      { left: '14%', top: '56%', align: 'left' },     // Differential (bottom-left: opens ABOVE, expands right)
      { left: '72%', top: '54%', align: 'right' },    // Science (bottom-right: opens ABOVE, expands left)
    ],
  },

  // ENVIRONMENT 02: HUMAN FORM
  {
    id: 'env-human-form',
    legacyId: 'env-patient-care',
    number: '02',
    badge: 'LIVING VISUAL SYSTEM · HUMAN FORM',
    title: 'Human Form',
    tagline: 'Abstract lower-limb anatomical silhouette and venous pathways',
    description: 'Recognise symptom triggers, assess severity with photographic review, and understand clinical CEAP disease progression.',
    bgType: 'human-form',
    itemIds: ['assessment', 'symptoms', 'ceap'],
    desktopLayouts: [
      { left: '14%', top: '16%', align: 'left' },     // Assessment (top-left: opens BELOW, expands right)
      { left: '74%', top: '16%', align: 'right' },    // Symptoms (top-right: opens BELOW, expands left)
      { left: '46%', top: '56%', align: 'center' },   // CEAP Progression (bottom-center: opens ABOVE, expands center)
    ],
  },

  // ENVIRONMENT 03: CIRCULATION FLOW
  {
    id: 'env-circulation-flow',
    legacyId: 'env-operating-theatre',
    number: '03',
    badge: 'LIVING VISUAL SYSTEM · CIRCULATION FLOW',
    title: 'Circulation Flow',
    tagline: 'Organic flowing ribbons, directional movement and therapy mechanics',
    description: 'Learn the emergency warning signs of deep vein clots, explore modern day-care laser interventions, and adopt daily circulation habits.',
    bgType: 'circulation-flow',
    itemIds: ['dvt', 'treatments', 'habits'],
    desktopLayouts: [
      { left: '14%', top: '16%', align: 'left' },     // DVT Red Flags (top-left: opens BELOW, expands right)
      { left: '74%', top: '16%', align: 'right' },    // Treatments (top-right: opens BELOW, expands left)
      { left: '46%', top: '56%', align: 'center' },   // Prevention Habits (bottom-center: opens ABOVE, expands center)
    ],
  },

  // ENVIRONMENT 04: CLINICAL KNOWLEDGE
  {
    id: 'env-clinical-knowledge',
    legacyId: 'env-laser-suite',
    number: '04',
    badge: 'LIVING VISUAL SYSTEM · CLINICAL KNOWLEDGE',
    title: 'Clinical Knowledge',
    tagline: 'Interconnected scientific nodes, medical curriculum and specialist evaluation',
    description: 'Access expert duplex ultrasound scan interpretation, review the complete illustrated curriculum, and schedule a specialist evaluation.',
    bgType: 'clinical-knowledge',
    itemIds: ['expert-review', 'curriculum', 'booking'],
    desktopLayouts: [
      { left: '14%', top: '16%', align: 'left' },     // Expert Review (top-left: opens BELOW, expands right)
      { left: '74%', top: '16%', align: 'right' },    // Curriculum (top-right: opens BELOW, expands left)
      { left: '46%', top: '56%', align: 'center' },   // Booking Request (bottom-center: opens ABOVE, expands center)
    ],
  },
];

// Helper to get floating animation class
const getFloatClass = (index: number) => {
  const floats = ['env-float-1', 'env-float-2', 'env-float-3', 'env-float-4'];
  return floats[index % floats.length];
};

export const VisualEnvironmentsSection: React.FC<VisualEnvironmentsSectionProps> = ({
  onNavigateView,
  onNavigateSection,
  onNavigateTopic,
  onOpenAssistant,
  onOpenBooking,
}) => {
  // Mobile active item for bottom sheet
  const [activeMobileItem, setActiveMobileItem] = useState<VisualTopicItem | null>(null);
  
  // Desktop active item (locked open via click) or hovered item
  const [selectedDesktopItem, setSelectedDesktopItem] = useState<string | null>(null);
  const [hoveredDesktopItem, setHoveredDesktopItem] = useState<string | null>(null);

  // Close desktop card on Escape key or clicking outside
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDesktopItem(null);
        setActiveMobileItem(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (selectedDesktopItem && sectionRef.current) {
        const target = e.target as HTMLElement;
        if (!target.closest('.interactive-icon-anchor') && !target.closest('.popover-information-card')) {
          setSelectedDesktopItem(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedDesktopItem]);

  const handleItemAction = (item: VisualTopicItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    // Close mobile sheet if open
    setActiveMobileItem(null);
    setSelectedDesktopItem(null);

    if (item.targetType === 'learn-topic' && item.learnSlug) {
      if (onNavigateTopic) {
        onNavigateTopic(item.learnSlug);
      } else {
        window.location.hash = `learn/${item.learnSlug}`;
      }
      return;
    }
    if (item.targetType === 'assistant') {
      onOpenAssistant();
      return;
    }
    if (item.targetType === 'booking') {
      if (onOpenBooking) onOpenBooking();
      return;
    }
    if (item.targetType === 'section' && item.targetView && item.targetSection) {
      if (onNavigateSection) {
        onNavigateSection(item.targetView, item.targetSection);
      } else {
        window.location.hash = item.targetSection;
        onNavigateView(item.targetView);
      }
      return;
    }
    if (item.targetView) {
      onNavigateView(item.targetView);
    }
  };

  const getHref = (item: VisualTopicItem): string => {
    if (item.targetType === 'learn-topic' && item.learnSlug) {
      return hrefForLearnTopic(item.learnSlug);
    }
    if (item.targetType === 'assistant') return '#ai';
    if (item.targetType === 'booking') return '#booking';
    if (item.targetSection) return `#${item.targetSection}`;
    if (item.targetView) return hrefForView(item.targetView);
    return '#';
  };

  const scrollToEnv = (envId: string) => {
    const el = document.getElementById(envId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Render the appropriate living SVG background
  const renderLivingBackground = (bgType: VisualEnvironmentConfig['bgType']) => {
    switch (bgType) {
      case 'vascular-network':
        return <VascularNetworkSvg />;
      case 'human-form':
        return <HumanFormSvg />;
      case 'circulation-flow':
        return <CirculationFlowSvg />;
      case 'clinical-knowledge':
        return <ClinicalKnowledgeSvg />;
      default:
        return null;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="explore-leg-health"
      aria-labelledby="explore-title"
      className="bg-[#F7F5EF] pt-12 sm:pt-20 pb-20 sm:pb-32 border-b border-[#0B4036]/10 scroll-mt-20 overflow-hidden"
    >
      <div className="container-page max-w-[1360px] px-3.5 min-[360px]:px-4 sm:px-8">
        
        {/* Section Global Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 text-[#0B4036] text-xs font-mono font-bold tracking-wider uppercase mb-3 border border-[#0B4036]/15 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#CE5B40]" />
            <span>Living Visual Environment</span>
          </div>
          <h2
            id="explore-title"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.14] tracking-[-0.015em] text-[#0B4036]"
          >
            Explore Leg Health Through Living Medical Environments
          </h2>
          <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-[#4A6058]">
            An original, scientifically inspired visual canvas created for Meridian Vascular. Thirteen interactive medical destination markers are suspended across four living environments, mapping vessel anatomy, clinical symptoms, circulation flow, and specialist care.
          </p>
        </div>

        {/* Environment Quick-Switcher Bar */}
        <div className="mb-10 sm:mb-14 overflow-x-auto pb-2 -mx-3.5 px-3.5 min-[360px]:-mx-4 min-[360px]:px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            <span className="text-xs font-mono uppercase tracking-wider text-[#4A6058] mr-1 hidden sm:inline-block font-semibold">
              Jump to Environment:
            </span>
            {VISUAL_ENVIRONMENTS.map((env) => (
              <button
                key={env.id}
                type="button"
                onClick={() => scrollToEnv(env.id)}
                className="px-4 py-2.5 rounded-full text-xs font-semibold bg-white border border-[#0B4036]/15 text-[#0B4036] hover:bg-[#FAF9F5] hover:border-[#CE5B40] hover:text-[#CE5B40] transition-all shadow-2xs flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4036]"
              >
                <span className="font-mono text-[#CE5B40] font-bold">{env.number}</span>
                <span>{env.title}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#E4ECE6] text-[#0B4036] font-semibold">
                  {env.itemIds.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* FOUR LIVING VISUAL ENVIRONMENTS                                   */}
        {/* ================================================================= */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-24">
          {VISUAL_ENVIRONMENTS.map((env) => {
            const envItems = env.itemIds
              .map((id) => ALL_VASCULAR_TOPICS.find((t) => t.id === id))
              .filter(Boolean) as VisualTopicItem[];

            return (
              <div
                key={env.id}
                id={env.id}
                data-legacy-id={env.legacyId}
                className="relative rounded-3xl border border-[#0B4036]/15 shadow-sm scroll-mt-24 bg-[#FAF8F3]"
              >
                {/* Legacy Anchor Shim for backwards compatibility */}
                {env.legacyId && <span id={env.legacyId} className="sr-only" />}

                {/* --------------------------------------------------------- */}
                {/* 1. CUSTOM LIVING SVG BACKGROUND LAYER (Clips to Rounded Corners) */}
                {/* --------------------------------------------------------- */}
                <div className="absolute inset-0 z-0 rounded-3xl overflow-hidden pointer-events-none">
                  {renderLivingBackground(env.bgType)}
                </div>

                {/* --------------------------------------------------------- */}
                {/* 2. ENVIRONMENT HEADER (Identity Card)                    */}
                {/* --------------------------------------------------------- */}
                <div className="relative z-10 p-5 sm:p-8 lg:p-10 pb-2 sm:pb-4 pointer-events-auto">
                  <div className="max-w-xl bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-[#0B4036]/12 shadow-xs">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-[#CE5B40] bg-[#CE5B40]/10 px-2.5 py-0.5 rounded-full border border-[#CE5B40]/25">
                        ENV {env.number}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-[#4A6058] font-bold">
                        {env.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#0B4036] tracking-tight">
                      {env.title}
                    </h3>
                    <p className="mt-1 font-medium text-xs sm:text-sm text-[#CE5B40]">
                      {env.tagline}
                    </p>
                    <p className="mt-2 text-xs sm:text-[13px] text-[#2D3E38]/90 leading-relaxed hidden sm:block">
                      {env.description}
                    </p>
                  </div>
                </div>

                {/* --------------------------------------------------------- */}
                {/* 3. DESKTOP INTERACTIVE CANVAS WITH INTELLIGENT POSITIONING*/}
                {/* Visible on lg screens (>= 1024px)                          */}
                {/* --------------------------------------------------------- */}
                <div className="hidden lg:block relative z-20 min-h-[540px] xl:min-h-[580px] p-6 lg:p-10">
                  {envItems.map((item, itemIdx) => {
                    const layout = env.desktopLayouts[itemIdx] || { left: `${20 + itemIdx * 25}%`, top: '40%' };
                    const isSelected = selectedDesktopItem === item.id;
                    const isHovered = hoveredDesktopItem === item.id;
                    const isCardOpen = isSelected || isHovered;
                    const anyItemInEnvActive = envItems.some(
                      (t) => t.id === selectedDesktopItem || t.id === hoveredDesktopItem
                    );
                    const isSubdued = anyItemInEnvActive && !isCardOpen;
                    const floatClass = getFloatClass(itemIdx);

                    // Intelligent Directional Positioning to PREVENT CLIPPING:
                    // If top > 40%, icon is in lower portion: open ABOVE (bottom-full mb-3)
                    // If top <= 40%, icon is in upper portion: open BELOW (top-full mt-3)
                    const topPercentNum = parseFloat(layout.top);
                    const openAbove = topPercentNum > 40;

                    // Horizontal alignment:
                    let horizontalClass = 'left-1/2 -translate-x-1/2'; // default center
                    if (layout.align === 'right' || parseFloat(layout.left) > 60) {
                      horizontalClass = 'right-0';
                    } else if (layout.align === 'left' || parseFloat(layout.left) < 30) {
                      horizontalClass = 'left-0';
                    }

                    return (
                      <div
                        key={item.id}
                        style={{
                          left: layout.left,
                          top: layout.top,
                        }}
                        className={`absolute transition-all duration-300 ${
                          isCardOpen
                            ? 'z-40 scale-105'
                            : isSubdued
                            ? 'z-20 opacity-60 filter-[grayscale(15%)] scale-[0.98]'
                            : 'z-20 opacity-100'
                        }`}
                        onMouseEnter={() => setHoveredDesktopItem(item.id)}
                        onMouseLeave={() => setHoveredDesktopItem(null)}
                      >
                        {/* Interactive Floating Anchor */}
                        <div className={`relative flex flex-col items-center group cursor-pointer interactive-icon-anchor ${floatClass}`}>
                          {/* Refined Medical Emblem Button */}
                          <button
                            type="button"
                            aria-expanded={isCardOpen}
                            aria-haspopup="dialog"
                            aria-label={`Explore ${item.title}`}
                            onClick={() => {
                              setSelectedDesktopItem((prev) => (prev === item.id ? null : item.id));
                            }}
                            onFocus={() => setHoveredDesktopItem(item.id)}
                            onBlur={() => setHoveredDesktopItem(null)}
                            className="relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CE5B40] rounded-2xl cursor-pointer"
                          >
                            <VascularDestinationIcon
                              item={item}
                              size="desktop"
                              isHovered={isHovered}
                              isOpen={isSelected}
                            />
                          </button>

                          {/* Connecting stem line */}
                          <div
                            className={`w-[1.5px] h-2 transition-colors duration-300 ${
                              isCardOpen ? 'bg-[#CE5B40]' : 'bg-[#8DAA9D]/40'
                            }`}
                          />

                          {/* Permanent Title Glass Pill */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDesktopItem((prev) => (prev === item.id ? null : item.id));
                            }}
                            onFocus={() => setHoveredDesktopItem(item.id)}
                            onBlur={() => setHoveredDesktopItem(null)}
                            className={`px-3.5 py-1.5 rounded-full border backdrop-blur-md font-semibold text-xs xl:text-[13px] shadow-2xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CE5B40] ${
                              isCardOpen
                                ? 'bg-[#0B4036] text-white border-[#0B4036] shadow-sm'
                                : 'bg-white/95 border-[#8DAA9D]/30 text-[#0B4036] hover:border-[#CE5B40] hover:text-[#CE5B40]'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                isCardOpen ? 'bg-[#CE5B40] scale-125' : 'bg-[#CE5B40]'
                              }`}
                            />
                            <span>{item.title}</span>
                          </button>

                          {/* ================================================= */}
                          {/* INTELLIGENT UNCLIPPED INFORMATION PANEL           */}
                          {/* Opens ABOVE if bottom icon, BELOW if top icon     */}
                          {/* ================================================= */}
                          {isCardOpen && (
                            <div
                              role="dialog"
                              aria-label={item.title}
                              className={`popover-information-card absolute w-[340px] bg-[#FAF8F3]/98 backdrop-blur-xl border border-[#8DAA9D]/45 rounded-2xl p-5 shadow-[0_20px_40px_-12px_rgba(11,64,54,0.18),0_4px_12px_rgba(11,64,54,0.06)] text-left text-[#0B4036] z-50 animate-in fade-in zoom-in-95 duration-150 ${horizontalClass} ${
                                openAbove ? 'bottom-full mb-3.5' : 'top-full mt-3.5'
                              }`}
                            >
                              {/* Directional Indicator Pip */}
                              <div
                                className={`absolute w-3 h-3 bg-[#FAF8F3] border-[#8DAA9D]/45 rotate-45 ${
                                  openAbove
                                    ? 'top-full -mt-1.5 border-r border-b'
                                    : 'bottom-full -mb-1.5 border-l border-t'
                                } ${
                                  layout.align === 'right' || parseFloat(layout.left) > 60
                                    ? 'right-8'
                                    : layout.align === 'left' || parseFloat(layout.left) < 30
                                    ? 'left-8'
                                    : 'left-1/2 -translate-x-1/2'
                                }`}
                              />

                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[10.5px] font-mono text-[#CE5B40] uppercase font-bold tracking-wider truncate">
                                  {item.category}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {item.badge && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E4ECE6] text-[#0B4036] font-semibold border border-[#0B4036]/10">
                                      {item.badge}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedDesktopItem(null);
                                      setHoveredDesktopItem(null);
                                    }}
                                    className="p-1 rounded-full text-[#4A6058] hover:text-[#0B4036] hover:bg-[#E4ECE6] transition cursor-pointer"
                                    aria-label="Close card"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <h4 className="font-serif text-[17px] font-bold text-[#0B4036] mb-1.5 leading-snug tracking-tight">
                                {item.title}
                              </h4>

                              <p className="text-[13px] text-[#2D3E38] leading-relaxed mb-3">
                                {item.description}
                              </p>

                              {item.clinicalNote && (
                                <p className="text-[11.5px] text-[#4A6058] italic bg-[#E4ECE6]/40 p-2.5 rounded-xl border-l-2 border-[#CE5B40] mb-3.5 leading-relaxed">
                                  {item.clinicalNote}
                                </p>
                              )}

                              <button
                                type="button"
                                onClick={(e) => handleItemAction(item, e)}
                                className="w-full py-2.5 px-4 rounded-xl bg-[#0B4036] hover:bg-[#CE5B40] text-white text-xs font-semibold flex items-center justify-between transition-colors shadow-2xs hover:shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CE5B40]"
                              >
                                <span>{item.actionLabel}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* --------------------------------------------------------- */}
                {/* 4. DEDICATED MOBILE & TABLET LAYOUT (< 1024px)            */}
                {/* Clean non-overlapping cards with Bottom-Sheet Disclosure  */}
                {/* --------------------------------------------------------- */}
                <div className="block lg:hidden relative z-20 p-4 sm:p-6 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {envItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#0B4036]/15 p-4 flex flex-col justify-between text-[#0B4036] transition-all shadow-2xs hover:shadow-sm"
                      >
                        <div className="flex items-start gap-3.5">
                          {/* 2.5D Illustration (Tap opens bottom sheet) */}
                          <button
                            type="button"
                            onClick={() => setActiveMobileItem(item)}
                            className="w-20 h-20 sm:w-22 sm:h-22 shrink-0 relative flex items-center justify-center cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CE5B40]"
                            aria-label={`View details for ${item.title}`}
                          >
                            <VascularDestinationIcon
                              item={item}
                              size="mobile"
                              className="w-20 h-20 sm:w-22 sm:h-22"
                            />
                          </button>

                          {/* Title & Category */}
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#CE5B40] font-bold block truncate">
                              {item.category}
                            </span>
                            <h4 className="font-serif text-sm sm:text-base font-semibold text-[#0B4036] leading-snug mt-0.5">
                              {item.title}
                            </h4>
                            {item.badge && (
                              <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#E4ECE6] text-[#0B4036] mt-1 font-semibold">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Direct Action & Bottom-Sheet Trigger */}
                        <div className="mt-3.5 pt-3 border-t border-[#0B4036]/10 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveMobileItem(item)}
                            className="text-xs font-semibold text-[#4A6058] hover:text-[#0B4036] py-1.5 flex items-center gap-1 cursor-pointer min-h-[44px]"
                          >
                            <span>Learn more</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleItemAction(item, e)}
                            className="py-2 px-3.5 rounded-xl bg-[#FAF8F3] hover:bg-[#CE5B40] hover:text-white border border-[#0B4036]/18 text-[#0B4036] font-semibold text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer min-h-[44px]"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* =================================================================== */}
      {/* MOBILE BOTTOM SHEET MODAL (Guaranteed Unclipped Full Information)    */}
      {/* =================================================================== */}
      {activeMobileItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-sheet-title"
          className="fixed inset-0 z-50 flex items-end justify-center lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setActiveMobileItem(null)}
          />

          {/* Bottom Sheet Container */}
          <div className="relative z-10 w-full max-w-lg bg-[#FAF8F3] rounded-t-3xl border-t-2 border-[#0B4036]/20 p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-250">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-[#8DAA9D]/40 rounded-full mx-auto mb-4" />

            {/* Header with Category and Close Button */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-[11px] font-mono text-[#CE5B40] uppercase font-bold tracking-wider">
                {activeMobileItem.category}
              </span>
              <button
                type="button"
                onClick={() => setActiveMobileItem(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E4ECE6] text-[#0B4036] hover:bg-[#CE5B40] hover:text-white transition cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-3.5">
              <div className="w-20 h-20 sm:w-22 sm:h-22 shrink-0 relative flex items-center justify-center">
                <VascularDestinationIcon
                  item={activeMobileItem}
                  size="mobile"
                  className="w-20 h-20 sm:w-22 sm:h-22"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="mobile-sheet-title" className="font-serif text-lg sm:text-xl font-bold text-[#0B4036] leading-snug">
                  {activeMobileItem.title}
                </h3>
                {activeMobileItem.badge && (
                  <span className="inline-block text-[10.5px] font-mono px-2.5 py-0.5 rounded-full bg-[#E4ECE6] text-[#0B4036] font-semibold mt-1">
                    {activeMobileItem.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Clinical Description */}
            <p className="text-[13.5px] text-[#2D3E38] leading-relaxed mb-3.5">
              {activeMobileItem.description}
            </p>

            {/* Clinical Guideline Note */}
            {activeMobileItem.clinicalNote && (
              <div className="p-3 rounded-xl bg-white/80 border-l-3 border-[#CE5B40] mb-5 text-xs text-[#4A6058] italic leading-relaxed">
                {activeMobileItem.clinicalNote}
              </div>
            )}

            {/* Action CTA Button (Large touch target >= 48px) */}
            <button
              type="button"
              onClick={(e) => handleItemAction(activeMobileItem, e)}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#CE5B40] hover:bg-[#b84e36] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer min-h-[48px]"
            >
              <span>{activeMobileItem.actionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
