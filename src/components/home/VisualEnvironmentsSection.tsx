import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Activity,
  Layers,
  FileText,
  Calendar,
  Eye,
  Info,
  CheckCircle2,
  Play
} from 'lucide-react';
import { AppView } from '../../types';
import { hrefForView, LearnTopicSlug, hrefForLearnTopic } from '../../content/siteNav';
import { ALL_VASCULAR_TOPICS, VisualTopicItem } from './vascularTopics';

interface VisualEnvironmentsSectionProps {
  onNavigateView: (view: AppView) => void;
  onNavigateSection?: (view: AppView, sectionId: string) => void;
  onNavigateTopic?: (slug: LearnTopicSlug) => void;
  onOpenAssistant: () => void;
  onOpenBooking?: () => void;
}

export interface VisualEnvironmentConfig {
  id: string;
  number: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  bgType: 'photo' | 'video';
  mediaSrc: string;
  posterSrc: string;
  itemIds: string[];
  desktopLayouts: {
    // Relative coordinates (%) within the desktop canvas to ensure zero collision
    left: string;
    top: string;
    align?: 'left' | 'right' | 'center';
  }[];
}

export const VISUAL_ENVIRONMENTS: VisualEnvironmentConfig[] = [
  // ENVIRONMENT 1: Vascular Cath Lab / Diagnostic Environment
  {
    id: 'env-cath-lab',
    number: '01',
    badge: 'DIAGNOSTIC CATH LAB & ULTRASOUND SUITE',
    title: 'Venous Hemodynamics & Diagnostics',
    tagline: 'Mapping valve mechanics, blood flow velocity and differential pain',
    description: 'Explore normal valvular architecture, retrograde pooling dynamics, hemodynamic biomechanics, and differential pain evaluation.',
    bgType: 'photo',
    mediaSrc: '/assets/photos/clinical-doppler-exam.jpg',
    posterSrc: '/assets/photos/clinical-doppler-exam.jpg',
    itemIds: ['circulation', 'causes', 'differential', 'science'],
    desktopLayouts: [
      { left: '46%', top: '8%', align: 'left' },     // Circulation
      { left: '76%', top: '14%', align: 'right' },   // Causes
      { left: '42%', top: '56%', align: 'left' },    // Differential
      { left: '74%', top: '54%', align: 'right' },   // Science
    ],
  },

  // ENVIRONMENT 2: Premium Hospital Lobby / Patient Care Environment
  {
    id: 'env-patient-care',
    number: '02',
    badge: 'PATIENT CARE LOUNGE & ONBOARDING',
    title: 'Symptoms, Assessment & Clinical Triage',
    tagline: 'Recognise symptom triggers, assess severity and initiate specialist care',
    description: 'From initial awareness of heavy legs to private symptom assessment with photo uploads and direct clinical consultation scheduling.',
    bgType: 'photo',
    mediaSrc: '/assets/photos/care-journey-reception.jpg',
    posterSrc: '/assets/photos/care-journey-reception.jpg',
    itemIds: ['assessment', 'symptoms', 'booking'],
    desktopLayouts: [
      { left: '48%', top: '10%', align: 'left' },    // Assessment (Feetscan)
      { left: '76%', top: '22%', align: 'right' },   // Symptoms
      { left: '56%', top: '55%', align: 'center' },  // Booking
    ],
  },

  // ENVIRONMENT 3: Modern Operation Theatre / Surgical Environment
  {
    id: 'env-operating-theatre',
    number: '03',
    badge: 'MODERN SURGICAL SUITE & CLOT TRIAGE',
    title: 'Clinical Staging & Clot Safety Protocols',
    tagline: 'CEAP disease progression, deep vein thrombosis alerts and specialist report triage',
    description: 'Understand clinical progression from spider veins to chronic ulcers, distinguish emergency DVT signs, and submit medical records for human specialist evaluation.',
    bgType: 'photo',
    mediaSrc: '/assets/photos/treatment-venaseal-glue.jpg',
    posterSrc: '/assets/photos/treatment-venaseal-glue.jpg',
    itemIds: ['dvt', 'ceap', 'expert-review'],
    desktopLayouts: [
      { left: '46%', top: '12%', align: 'left' },    // DVT Red Flags
      { left: '77%', top: '18%', align: 'right' },   // CEAP Stages
      { left: '58%', top: '56%', align: 'center' },  // Expert Review
    ],
  },

  // ENVIRONMENT 4: Vascular Laser Equipment / EVLA Fibre Environment
  {
    id: 'env-laser-suite',
    number: '04',
    badge: 'PROCEDURE SUITE & ENDOTHERMAL LASER',
    title: 'Laser Interventions & Prevention Habits',
    tagline: 'Pinhole endothermal ablation, everyday circulation habits and topic curriculum',
    description: 'Compare modern day-care laser ablation and medical glue against open surgery, adopt evidence-backed circulation habits, and explore the complete educational curriculum.',
    bgType: 'video',
    mediaSrc: '/videos/vein-flowing.mp4',
    posterSrc: '/assets/photos/treatment-laser-evla.jpg',
    itemIds: ['treatments', 'habits', 'curriculum'],
    desktopLayouts: [
      { left: '47%', top: '10%', align: 'left' },    // Treatments
      { left: '76%', top: '20%', align: 'right' },   // Habits
      { left: '57%', top: '56%', align: 'center' },  // Curriculum
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
  // Mobile tap-to-expand active card tracker: { [itemId]: boolean }
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  // Hovered item on desktop
  const [hoveredDesktopItem, setHoveredDesktopItem] = useState<string | null>(null);

  const handleItemClick = (item: VisualTopicItem, e?: React.MouseEvent) => {
    if (e) e.preventDefault();

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

  return (
    <section
      id="explore-leg-health"
      aria-labelledby="explore-title"
      className="bg-[#FAF7F2] pt-12 sm:pt-20 pb-20 sm:pb-32 border-b border-mv-outline/50 scroll-mt-20 overflow-hidden"
    >
      <div className="container-page max-w-[1360px] px-3.5 min-[360px]:px-4 sm:px-8">
        
        {/* Section Global Header */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-mv-pale text-mv-forest text-xs font-mono font-bold tracking-wider uppercase mb-3 border border-mv-outline/70">
            <Sparkles className="w-3.5 h-3.5 text-mv-terracotta" />
            <span>Interactive Visual Discovery</span>
          </div>
          <h2
            id="explore-title"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12] tracking-[-0.015em] text-mv-forest"
          >
            Explore Leg Health in Four Immersive Environments
          </h2>
          <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-mv-ink-muted">
            Move through four authentic clinical environments. Thirteen interactive visual markers are suspended across each scene, mapping vein circulation, causes, diagnostics, treatments and patient care.
          </p>
        </div>

        {/* Environment Quick-Switcher Bar */}
        <div className="mb-10 sm:mb-14 overflow-x-auto pb-2 -mx-3.5 px-3.5 min-[360px]:-mx-4 min-[360px]:px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            <span className="text-xs font-mono uppercase tracking-wider text-mv-ink-muted mr-1 hidden sm:inline-block">
              Jump to Environment:
            </span>
            {VISUAL_ENVIRONMENTS.map((env) => (
              <button
                key={env.id}
                type="button"
                onClick={() => scrollToEnv(env.id)}
                className="px-4 py-2.5 rounded-full text-xs font-semibold bg-white border border-mv-outline/70 text-mv-forest hover:bg-mv-pale hover:border-mv-forest/40 transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <span className="font-mono text-mv-terracotta">{env.number}</span>
                <span>{env.title.split('&')[0].trim()}</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-[#FAF7F2] text-mv-ink-muted">
                  {env.itemIds.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* FOUR LARGE CINEMATIC BACKGROUND ENVIRONMENTS                      */}
        {/* ================================================================= */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {VISUAL_ENVIRONMENTS.map((env, envIdx) => {
            const envItems = env.itemIds
              .map((id) => ALL_VASCULAR_TOPICS.find((t) => t.id === id))
              .filter(Boolean) as VisualTopicItem[];

            return (
              <div
                key={env.id}
                id={env.id}
                className="relative rounded-3xl overflow-hidden border border-white/10 shadow-xl scroll-mt-24 bg-[#07241E]"
              >
                {/* --------------------------------------------------------- */}
                {/* 1. CINEMATIC BACKGROUND LAYER (PHOTO OR VIDEO)            */}
                {/* --------------------------------------------------------- */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {env.bgType === 'video' ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={env.posterSrc}
                      className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
                    >
                      <source src={env.mediaSrc} type="video/mp4" />
                      <img src={env.posterSrc} alt={env.title} className="w-full h-full object-cover" />
                    </video>
                  ) : (
                    <img
                      src={env.mediaSrc}
                      alt={env.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
                    />
                  )}

                  {/* Sophisticated Multi-Stage Dark Forest Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#041612]/95 via-[#072822]/85 to-[#041612]/90 pointer-events-none" />
                  <div className="absolute inset-0 bg-radial from-transparent via-[#020D0A]/50 to-[#020D0A]/85 pointer-events-none" />
                </div>

                {/* --------------------------------------------------------- */}
                {/* 2. ENVIRONMENT HEADER (Glassmorphism Identity Card)       */}
                {/* --------------------------------------------------------- */}
                <div className="relative z-10 p-5 sm:p-8 lg:p-10 pb-4 sm:pb-6">
                  <div className="max-w-xl bg-black/40 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/15 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-mv-terracotta bg-mv-terracotta/15 px-2.5 py-0.5 rounded-full border border-mv-terracotta/30">
                        ENV {env.number}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-white/70">
                        {env.badge}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                      {env.title}
                    </h3>
                    <p className="mt-1 font-medium text-xs sm:text-sm text-mv-sage/95">
                      {env.tagline}
                    </p>
                    <p className="mt-2 text-xs sm:text-[13px] text-white/80 leading-relaxed hidden sm:block">
                      {env.description}
                    </p>
                  </div>
                </div>

                {/* --------------------------------------------------------- */}
                {/* 3. DESKTOP INTERACTIVE CANVAS (ORGANIC FLOATING PLACEMENT)*/}
                {/* Visible on lg screens (>= 1024px)                          */}
                {/* --------------------------------------------------------- */}
                <div className="hidden lg:block relative z-10 min-h-[440px] xl:min-h-[480px] p-6 lg:p-8">
                  {envItems.map((item, itemIdx) => {
                    const layout = env.desktopLayouts[itemIdx] || { left: `${20 + itemIdx * 25}%`, top: '40%' };
                    const isHovered = hoveredDesktopItem === item.id;
                    const floatClass = getFloatClass(itemIdx);

                    return (
                      <div
                        key={item.id}
                        style={{
                          left: layout.left,
                          top: layout.top,
                        }}
                        className={`absolute transition-all duration-300 ${
                          isHovered ? 'z-40 scale-105' : 'z-20'
                        }`}
                        onMouseEnter={() => setHoveredDesktopItem(item.id)}
                        onMouseLeave={() => setHoveredDesktopItem(null)}
                      >
                        {/* Interactive Floating Anchor */}
                        <div className={`relative flex flex-col items-center group cursor-pointer ${floatClass}`}>
                          {/* 2.5D Illustration Image */}
                          <div className="relative w-28 h-28 xl:w-32 xl:h-32 flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_16px_32px_rgba(0,0,0,0.8)] transition-transform duration-300">
                            <picture>
                              <source srcSet={item.iconWebp} type="image/webp" />
                              <img
                                src={item.iconPng}
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            </picture>
                          </div>

                          {/* Permanent Title Glass Pill */}
                          <button
                            type="button"
                            onClick={(e) => handleItemClick(item, e)}
                            className="mt-2 px-3.5 py-1.5 rounded-full bg-[#07241E]/95 border border-white/25 backdrop-blur-md text-white font-medium text-xs xl:text-[13px] shadow-lg hover:border-mv-terracotta hover:bg-[#0B4036] transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-left"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-mv-terracotta animate-pulse" />
                            <span>{item.title}</span>
                          </button>

                          {/* REFINED INFORMATION PANEL (Revealed on Hover) */}
                          {isHovered && (
                            <div
                              className={`absolute top-full mt-3 w-80 bg-[#061D18]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl text-left text-white animate-in fade-in zoom-in-95 duration-150 ${
                                layout.align === 'right'
                                  ? 'right-0'
                                  : layout.align === 'center'
                                  ? '-left-20'
                                  : 'left-0'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-mono text-mv-terracotta uppercase font-bold tracking-wider mb-1.5">
                                <span>{item.category}</span>
                                {item.badge && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                                    {item.badge}
                                  </span>
                                )}
                              </div>

                              <h4 className="font-serif text-base font-bold text-white mb-1.5">
                                {item.title}
                              </h4>

                              <p className="text-xs text-white/85 leading-relaxed mb-2.5">
                                {item.description}
                              </p>

                              {item.clinicalNote && (
                                <p className="text-[11px] text-mv-sage/90 italic border-l-2 border-mv-terracotta/70 pl-2 mb-3 leading-snug">
                                  {item.clinicalNote}
                                </p>
                              )}

                              <button
                                type="button"
                                onClick={(e) => handleItemClick(item, e)}
                                className="w-full py-2 px-3.5 rounded-xl bg-mv-cta hover:bg-[#b84e36] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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
                {/* 4. MOBILE & TABLET LAYOUT (RESPONSIVE NON-OVERLAPPING)    */}
                {/* Visible on screens < 1024px                                */}
                {/* --------------------------------------------------------- */}
                <div className="block lg:hidden relative z-10 p-4 sm:p-6 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {envItems.map((item, itemIdx) => {
                      const isExpanded = expandedMobileItem === item.id;

                      return (
                        <div
                          key={item.id}
                          className="bg-black/45 backdrop-blur-md rounded-2xl border border-white/15 p-4 flex flex-col justify-between text-white transition-all shadow-md"
                        >
                          <div className="flex items-start gap-3.5">
                            {/* Illustration */}
                            <div className="w-16 h-16 shrink-0 relative flex items-center justify-center filter drop-shadow-md">
                              <picture>
                                <source srcSet={item.iconWebp} type="image/webp" />
                                <img
                                  src={item.iconPng}
                                  alt={item.title}
                                  className="w-full h-full object-contain"
                                />
                              </picture>
                            </div>

                            {/* Title & Category */}
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-mv-terracotta font-bold block truncate">
                                {item.category}
                              </span>
                              <h4 className="font-serif text-sm sm:text-base font-semibold text-white leading-snug mt-0.5">
                                {item.title}
                              </h4>
                              {item.badge && (
                                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/80 mt-1">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Expanded Content or Toggle */}
                          <div className="mt-3 pt-3 border-t border-white/10">
                            {isExpanded ? (
                              <div className="space-y-2.5 text-xs text-white/85">
                                <p className="leading-relaxed">{item.description}</p>
                                {item.clinicalNote && (
                                  <p className="text-[11px] text-mv-sage/90 italic border-l border-mv-terracotta pl-2">
                                    {item.clinicalNote}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={(e) => handleItemClick(item, e)}
                                    className="flex-1 py-2 px-3 rounded-xl bg-mv-cta text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                                  >
                                    <span>{item.actionLabel}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setExpandedMobileItem(null)}
                                    className="p-2 rounded-xl bg-white/10 text-white text-xs"
                                    aria-label="Collapse info"
                                  >
                                    <ChevronUp className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() => setExpandedMobileItem(item.id)}
                                  className="text-xs font-medium text-mv-sage/90 hover:text-white flex items-center gap-1"
                                >
                                  <span>View details</span>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleItemClick(item, e)}
                                  className="py-1.5 px-3 rounded-lg bg-white/15 hover:bg-mv-cta text-white font-semibold text-xs flex items-center gap-1 transition"
                                >
                                  <span>{item.actionLabel}</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Environment Footer Tag */}
                <div className="relative z-10 px-5 sm:px-8 py-3 bg-black/50 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
                  <span>ENVIRONMENT {env.number} &middot; {env.itemIds.length} VISUAL DESTINATIONS</span>
                  <span className="hidden sm:inline">MERIDIAN VASCULAR CLINICAL DIRECTORY</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
