/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppView } from '../../types';
import { getLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { CLINICAL_PHOTOS } from '../../content/photos';
import { LearnTopicLayout } from './LearnTopicLayout';
import { LegCirculationExplorer3D } from './LegCirculationExplorer3D';
import { VenousValveSimulator3D } from './VenousValveSimulator3D';
import { VenousNetworksSection } from './VenousNetworksSection';
import { Camera, ArrowRight, ClipboardList, Layers, Stethoscope, HelpCircle, ShieldCheck } from 'lucide-react';

interface TopicPageProps {
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onAskMeridbot?: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

export const LegCirculationPage: React.FC<TopicPageProps> = ({
  onNavigateView,
  onNavigateTopic,
  onOpenAssistantWithPrompt,
  onAskMeridbot,
}) => {
  const topic = getLearnTopic('leg-circulation');
  if (!topic) return null;

  return (
    <LearnTopicLayout
      topic={topic}
      onNavigateView={onNavigateView}
      onNavigateTopic={onNavigateTopic}
      onAskMeridbot={onAskMeridbot}
      chips={[
        { label: '3D Circulation Explorer', href: '#explore-circulation' },
        { label: 'Interactive Valve & Reflux', href: '#valve-simulation' },
        { label: 'Three Venous Networks', href: '#venous-networks' },
        { label: 'Clinical Doppler Assessment', href: '#clinical-assessment' },
        { label: 'Next Steps', href: '#next-steps' },
      ]}
    >
      <div className="space-y-14 sm:space-y-18">
        
        {/* =========================================================================
            SECTION 1: EXPLORE LEG CIRCULATION (3D LOWER-LIMB ANATOMY)
            ========================================================================= */}
        <LegCirculationExplorer3D />

        {/* =========================================================================
            SECTION 2: HEALTHY VALVE VS. VENOUS REFLUX (INTERACTIVE VALVE SIMULATOR)
            ========================================================================= */}
        <VenousValveSimulator3D />

        {/* =========================================================================
            SECTION 3: THE THREE VENOUS NETWORKS (SUPERFICIAL, DEEP & PERFORATORS)
            ========================================================================= */}
        <VenousNetworksSection
          onExploreAnatomyClick={() => {
            const el = document.getElementById('explore-circulation');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* =========================================================================
            SECTION 4: HOW CLINICIANS ASSESS VENOUS CIRCULATION (DUPLEX ULTRASOUND)
            ========================================================================= */}
        <section
          id="clinical-assessment"
          aria-labelledby="clinical-assessment-title"
          className="rounded-3xl border border-mv-outline/70 bg-white overflow-hidden shadow-card"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Clinical Doppler Examination Photography */}
            <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-5 overflow-hidden bg-mv-pale/20 min-h-[300px]">
              <img
                src={CLINICAL_PHOTOS.clinicalDopplerExam.src}
                alt={CLINICAL_PHOTOS.clinicalDopplerExam.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 rounded-md bg-mv-forest/85 px-3 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs flex items-center gap-1.5 shadow-xs">
                <Camera className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                <span>{CLINICAL_PHOTOS.clinicalDopplerExam.clinicalTag}</span>
              </span>
            </div>

            {/* Contextual Narrative & SVS/AVF Standards */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mv-pale text-mv-forest font-mono text-[11px] font-bold tracking-[0.14em] uppercase mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-mv-terracotta" aria-hidden="true" />
                  <span>SECTION 04 &bull; DIAGNOSTIC CONFIRMATION</span>
                </div>

                <h2
                  id="clinical-assessment-title"
                  className="font-serif text-[24px] sm:text-[28px] lg:text-[32px] font-semibold text-mv-forest leading-snug"
                >
                  How Clinicians Assess Venous Circulation
                </h2>

                <p className="mt-3 text-[15px] sm:text-[16px] leading-relaxed text-mv-ink">
                  While 3D educational visualizations show theoretical mechanics, real clinical evaluation relies on <strong>standing venous duplex ultrasound</strong>. High-frequency sound waves measure blood velocity, flow direction, and vessel calibre in real time.
                </p>

                <p className="mt-2.5 text-[14.5px] leading-relaxed text-mv-ink-muted">
                  Under Society for Vascular Surgery (SVS) consensus standards, retrograde flow lasting <strong>&ge; 500 milliseconds (0.5 seconds)</strong> in superficial saphenous veins confirms pathological valvular incompetence. Duplex scanning also verifies that deep veins are fully open and rules out deep vein thrombosis (DVT) before any treatment is planned.
                </p>

                {/* Key Measurement Metrics */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-mv-outline/50">
                  <div className="p-3 rounded-xl bg-mv-ivory border border-mv-outline/50">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-mv-ink-muted block">
                      Reflux Threshold
                    </span>
                    <span className="font-serif text-[17px] font-semibold text-mv-terracotta mt-0.5 block">
                      &ge; 500 ms
                    </span>
                    <span className="text-[11.5px] text-mv-ink-muted block mt-0.5">
                      Superficial saphenous veins
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-mv-ivory border border-mv-outline/50">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-mv-ink-muted block">
                      Deep Vein Patency
                    </span>
                    <span className="font-serif text-[17px] font-semibold text-mv-forest mt-0.5 block">
                      Compressible
                    </span>
                    <span className="text-[11.5px] text-mv-ink-muted block mt-0.5">
                      Confirms absence of DVT
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-mv-ivory border border-mv-outline/50">
                    <span className="font-mono text-[10.5px] uppercase tracking-wider text-mv-ink-muted block">
                      Perforator Calibre
                    </span>
                    <span className="font-serif text-[17px] font-semibold text-amber-800 mt-0.5 block">
                      &ge; 3.5 mm
                    </span>
                    <span className="text-[11.5px] text-mv-ink-muted block mt-0.5">
                      Outward fascia leakage
                    </span>
                  </div>
                </div>
              </div>

              {/* Doppler Scan Guide CTA */}
              <div className="mt-7 pt-4 border-t border-mv-outline/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-mv-ink-muted">
                <span>{CLINICAL_PHOTOS.clinicalDopplerExam.caption}</span>
                <button
                  type="button"
                  onClick={() => onNavigateView('doppler')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-mv-forest text-white text-[13px] font-semibold hover:bg-mv-forest/90 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
                >
                  <span>Read Doppler Scan Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 5: A CLEAR NEXT STEP (REASSURING, NON-SALES PATIENT PATHWAY)
            ========================================================================= */}
        <section
          id="next-steps"
          aria-labelledby="next-steps-title"
          className="rounded-3xl border border-mv-outline/70 bg-[#FAF8F3] p-7 sm:p-9 lg:p-11 shadow-card"
        >
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-mv-outline/60 text-mv-forest font-mono text-[11px] font-bold tracking-[0.14em] uppercase mb-2.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-mv-terracotta" aria-hidden="true" />
              <span>SECTION 05 &bull; WHERE TO GO FROM HERE</span>
            </div>
            <h2
              id="next-steps-title"
              className="font-serif text-[26px] sm:text-[32px] font-semibold text-mv-forest leading-snug"
            >
              Recommended Next Steps
            </h2>
            <p className="mt-2.5 text-[15px] sm:text-[16px] leading-relaxed text-mv-ink-muted">
              Whether you are experiencing leg heaviness, swelling, or visible veins, explore these non-diagnostic clinical guides or connect with accredited vascular specialists.
            </p>
          </div>

          {/* Three Reassuring Pathway Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pathway 1: Symptom Check */}
            <div className="p-6 rounded-2xl bg-white border border-mv-outline/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-mv-pale/70 border border-mv-outline/40 flex items-center justify-center text-mv-forest mb-4">
                  <ClipboardList className="w-5 h-5 text-mv-terracotta" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-[19px] font-semibold text-mv-forest">
                  Check Your Symptoms
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mv-ink-muted">
                  Complete our 2-minute clinical symptom pattern questionnaire to understand how your signs relate to venous circulation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateView('assessment')}
                className="mt-6 pt-3 border-t border-mv-outline/50 inline-flex items-center justify-between text-[13px] font-semibold text-mv-forest hover:text-mv-terracotta transition-colors cursor-pointer w-full"
              >
                <span>Take Symptom Check</span>
                <ArrowRight className="w-4 h-4 text-mv-terracotta" aria-hidden="true" />
              </button>
            </div>

            {/* Pathway 2: Compare Treatments */}
            <div className="p-6 rounded-2xl bg-white border border-mv-outline/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-mv-pale/70 border border-mv-outline/40 flex items-center justify-center text-mv-forest mb-4">
                  <Layers className="w-5 h-5 text-mv-forest" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-[19px] font-semibold text-mv-forest">
                  Compare Treatments
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mv-ink-muted">
                  Compare endovenous laser ablation (EVLA), radiofrequency (RFA), and medical adhesive (VenaSeal) based on NICE and SVS clinical guidelines.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateView('treatments')}
                className="mt-6 pt-3 border-t border-mv-outline/50 inline-flex items-center justify-between text-[13px] font-semibold text-mv-forest hover:text-mv-terracotta transition-colors cursor-pointer w-full"
              >
                <span>View Treatment Comparison</span>
                <ArrowRight className="w-4 h-4 text-mv-terracotta" aria-hidden="true" />
              </button>
            </div>

            {/* Pathway 3: Find Accredited Specialists */}
            <div className="p-6 rounded-2xl bg-white border border-mv-outline/60 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-mv-pale/70 border border-mv-outline/40 flex items-center justify-center text-mv-forest mb-4">
                  <Stethoscope className="w-5 h-5 text-mv-terracotta" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-[19px] font-semibold text-mv-forest">
                  Find Accredited Care
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mv-ink-muted">
                  Learn what questions to ask your vascular specialist and explore hospital facilities equipped with standing duplex ultrasound suites.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateView('specialists')}
                className="mt-6 pt-3 border-t border-mv-outline/50 inline-flex items-center justify-between text-[13px] font-semibold text-mv-forest hover:text-mv-terracotta transition-colors cursor-pointer w-full"
              >
                <span>Browse Doctor Directory</span>
                <ArrowRight className="w-4 h-4 text-mv-terracotta" aria-hidden="true" />
              </button>
            </div>

          </div>

          {/* Assistant Guidance Option */}
          {onAskMeridbot && (
            <div className="mt-8 pt-6 border-t border-mv-outline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-mv-forest shrink-0" aria-hidden="true" />
                <p className="text-[13.5px] text-mv-ink leading-snug">
                  Have a specific question about your leg symptoms or Doppler report?
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAskMeridbot('Can you explain the difference between superficial and deep veins in simple terms?')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-mv-pale/60 border border-mv-outline/60 text-mv-forest text-[13px] font-semibold transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <span>Ask Educational Guide</span>
                <ArrowRight className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
              </button>
            </div>
          )}

        </section>

      </div>
    </LearnTopicLayout>
  );
};
