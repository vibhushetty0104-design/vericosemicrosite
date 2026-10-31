import React from 'react';
import { ArrowRight, Stethoscope, FileUp, Sparkles, AlertCircle, HeartPulse, ShieldCheck, ChevronRight } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { LivingMeridianBackground } from './LivingMeridianBackground';
import { LivingVeinHeroVideo } from './scene/LivingVeinHeroVideo';
import { EditorialTextReveal } from './scene/EditorialTextReveal';

interface HeroProps {
  onStartAssessment: () => void;
  onNavigateToTreatments?: () => void;
  onNavigateToSymptoms?: () => void;
  onNavigateToExpertReview?: () => void;
  onOpenBooking?: () => void;
  onNavigateToDoppler?: () => void;
}

/**
 * Varicose Veins Dedicated Microsite Hero
 *
 * Immersive, medically-informed vascular portal:
 * - Autoplaying, muted, looping MP4 video of living blood vessel flow on the right.
 * - Softly vignetted and blended into the forest-green (#0B4036) foundation.
 * - Signature branching vascular SVG background lines with luminous pulses.
 * - Clear explanation of what varicose veins are and when to seek care.
 * - 5 prominent pathways: Explore Symptoms, Assess Symptoms, Explore Treatments, Request Expert Review, Book Consultation.
 * - Free of unprompted speech bubbles or intrusive popups.
 */
export const Hero: React.FC<HeroProps> = ({
  onStartAssessment,
  onNavigateToTreatments,
  onNavigateToSymptoms,
  onNavigateToExpertReview,
  onOpenBooking,
}) => {
  return (
    <section
      aria-labelledby="hero-title"
      className="mv-on-dark relative overflow-hidden bg-mv-forest text-mv-ivory min-h-[580px] lg:min-h-[660px] flex items-center py-10 lg:py-16"
    >
      {/* Living Vein Circulation Video (Organically blended on the right side) */}
      <LivingVeinHeroVideo />

      {/* Signature Living Vascular Branching Background Lines */}
      <LivingMeridianBackground className="opacity-60" />

      <div className="mv-hero-inner container-page relative z-10 max-w-[1240px] w-full px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,6.2fr)_minmax(0,5.8fr)] lg:items-center">
          {/* Main Editorial Text & Primary Action Column */}
          <div className="max-w-[44rem]">
            {/* Brand Eyebrow Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-mv-pale mb-4 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#CE5B40] animate-pulse" />
              <span className="font-medium tracking-wide">Meridian Vascular · Varicose Veins Specialist Portal</span>
            </div>

            {/* Main Headline */}
            <EditorialTextReveal
              id="hero-title"
              text="Varicose Veins Care: From Early Symptoms to Modern Curative Treatments"
              tag="h1"
              staggerMs={40}
              initialDelayMs={30}
              className="mv-hero-title mt-1 font-serif text-[28px] sm:text-[42px] lg:text-[48px] font-semibold leading-[1.12] tracking-[-0.015em] text-white text-balance"
            />

            {/* Supporting plain-language lede */}
            <p
              className="mv-hero-lede editorial-fade-in mt-3 sm:mt-4 max-w-[38rem] text-[15px] sm:text-[17px] leading-relaxed text-mv-pale"
              style={{ animationDelay: '520ms' }}
            >
              Varicose veins develop when one-way valves in your leg veins weaken, allowing blood to pool against gravity. Understand your symptoms, assess severity, review modern non-surgical treatments (EVLA, Glue, Sclerotherapy), or have your scan evaluated by our vascular specialists.
            </p>

            {/* Primary Action Row: 2 Big CTAs */}
            <div className="mv-hero-actions mt-6 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href="#assessment"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('hero_primary_cta_click', { target: 'assessment' });
                  onStartAssessment();
                }}
                className="mv-btn bg-[#A9472F] hover:bg-[#8F3B26] text-white w-full sm:w-auto text-center shrink-0 min-h-[50px] px-7 text-[15px] font-semibold tracking-wide rounded-lg shadow-[0_4px_16px_rgba(169,71,47,0.35)] hover:shadow-[0_6px_20px_rgba(169,71,47,0.50)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <HeartPulse className="h-5 w-5" />
                <span>Assess Your Symptoms (3 min)</span>
                <ArrowRight className="h-4.5 w-4.5" strokeWidth={2} />
              </a>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('simulated_booking_opened', { from: 'hero_primary_cta' });
                  if (onOpenBooking) onOpenBooking();
                }}
                className="mv-btn bg-white/10 hover:bg-white/20 border border-white/25 text-white w-full sm:w-auto text-center shrink-0 min-h-[50px] px-6 text-[15px] font-semibold tracking-wide rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
              >
                <Stethoscope className="h-5 w-5 text-mv-pale" />
                <span>Book a Consultation</span>
              </button>
            </div>

            {/* 3 Secondary Pathway Links */}
            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="#symptoms"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToSymptoms) onNavigateToSymptoms();
                  else {
                    const el = document.getElementById('symptoms');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 text-xs font-medium text-mv-pale hover:text-white transition-colors group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-mv-terracotta group-hover:scale-125 transition-transform" />
                <span>1. Explore Symptoms</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="#treatments"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToTreatments) onNavigateToTreatments();
                  else {
                    window.location.hash = '#treatments';
                  }
                }}
                className="flex items-center gap-2 text-xs font-medium text-mv-pale hover:text-white transition-colors group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                <span>2. Explore Treatments</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="#expert-review"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigateToExpertReview) onNavigateToExpertReview();
                  else {
                    window.location.hash = '#expert-review';
                  }
                }}
                className="flex items-center gap-2 text-xs font-medium text-mv-pale hover:text-white transition-colors group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                <span>3. Request Expert Review</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mv-sage">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Certified Vascular Specialists
              </span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>Bengaluru Clinic & Tele-review</span>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>DPDP Compliant</span>
            </div>
          </div>

          {/* Right Column: 5 Prominent Action & Clinical Triage Hub */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/20 bg-[#0B4036]/80 p-6 sm:p-7 backdrop-blur-md shadow-[0_16px_36px_rgba(4,35,30,0.5)]">
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-mv-terracotta" />
                Your Varicose Veins Patient Journey
              </h3>
              <p className="text-xs sm:text-[13px] text-mv-pale/90 leading-relaxed mb-6">
                Choose where you are today. From checking unexplained leg heaviness or swelling to getting a second opinion on your Doppler scan report:
              </p>

              <div className="space-y-3">
                {/* Pathway 1 */}
                <a
                  href="#symptoms"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigateToSymptoms) onNavigateToSymptoms();
                    else {
                      const el = document.getElementById('symptoms');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white font-medium text-xs mt-0.5">
                    01
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white flex items-center justify-between">
                      <span>Explore Symptoms & Warning Signs</span>
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-mv-pale/80 mt-0.5 line-clamp-1">
                      Aching, swelling, heaviness, skin darkening, or visible bulging veins.
                    </p>
                  </div>
                </a>

                {/* Pathway 2 */}
                <a
                  href="#assessment"
                  onClick={(e) => {
                    e.preventDefault();
                    onStartAssessment();
                  }}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#A9472F] text-white flex items-center justify-center shrink-0 font-medium text-xs mt-0.5">
                    02
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white flex items-center justify-between">
                      <span>Assess Your Symptoms (CEAP Aligned)</span>
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-mv-pale/80 mt-0.5 line-clamp-1">
                      Answer 6 targeted clinical questions to gauge educational severity.
                    </p>
                  </div>
                </a>

                {/* Pathway 3 */}
                <a
                  href="#treatments"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigateToTreatments) onNavigateToTreatments();
                    else window.location.hash = '#treatments';
                  }}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/80 text-white flex items-center justify-center shrink-0 font-medium text-xs mt-0.5">
                    03
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white flex items-center justify-between">
                      <span>Explore Modern Treatments</span>
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-mv-pale/80 mt-0.5 line-clamp-1">
                      EVLA, VenaSeal Glue, Foam Sclerotherapy & Micro-Phlebectomy.
                    </p>
                  </div>
                </a>

                {/* Pathway 4 */}
                <a
                  href="#expert-review"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigateToExpertReview) onNavigateToExpertReview();
                    else window.location.hash = '#expert-review';
                  }}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/80 text-white flex items-center justify-center shrink-0 font-medium text-xs mt-0.5">
                    <FileUp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white flex items-center justify-between">
                      <span>Request Expert Review of Reports/Photos</span>
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-mv-pale/80 mt-0.5 line-clamp-1">
                      Upload your Doppler ultrasound scans or leg photos for clinical second opinion.
                    </p>
                  </div>
                </a>

                {/* Pathway 5 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenBooking) onOpenBooking();
                  }}
                  className="w-full flex items-start gap-3.5 p-3 rounded-xl bg-[#072B24] hover:bg-[#05211B] border border-emerald-500/30 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 font-medium text-xs mt-0.5">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white flex items-center justify-between">
                      <span>Book In-Person Clinic Consultation</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-mv-pale/80 mt-0.5 line-clamp-1">
                      Direct duplex ultrasound evaluation with our vascular surgeons in Bengaluru.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
