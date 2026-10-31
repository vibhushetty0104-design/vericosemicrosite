import React, { useState } from 'react';
import { AppView } from '../types';
import { CLINICAL_PHOTOS } from '../content/photos';
import {
  Compass,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Activity,
  ClipboardCheck,
  FileText,
  Camera
} from 'lucide-react';
import { askGuideAbout } from '../content/guideLabels';

interface VascularCareJourneyProps {
  onNavigateView: (view: AppView) => void;
  onOpenBooking: () => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
}

interface JourneyStage {
  id: string;
  stageNumber: string;
  title: string;
  subtitle: string;
  status: 'Completed' | 'Current' | 'Upcoming';
  statusLabel: string;
  whatHappens: string;
  checklist: string[];
  questionsForDoctor: string[];
  documents: string[];
  primaryAction: {
    label: string;
    view?: AppView;
    action?: 'booking';
  };
}

export const VascularCareJourney: React.FC<VascularCareJourneyProps> = ({
  onNavigateView,
  onOpenBooking,
  onOpenAssistantWithPrompt,
}) => {
  const [expandedStage, setExpandedStage] = useState<string>('stage-02');

  const journeyStages: JourneyStage[] = [
    {
      id: 'stage-01',
      stageNumber: '01',
      title: 'Symptom Recognition & Clinical Inspection',
      subtitle: 'Identification of lower extremity sensations: evening aching, restless legs, spider venules, or visible calf bulges.',
      status: 'Completed',
      statusLabel: 'Completed',
      whatHappens: 'A primary care physician or vein specialist performs a preliminary visual exam and reviews lifestyle risk factors (standing jobs, family history, pregnancy). Early conservative measures like elevating legs and walking are initiated.',
      checklist: [
        'Document when leg heaviness or aching peaks during the day',
        'Record visible vein patterns, spider clusters, or ankle swelling',
        'Check medical history for past DVT, blood clots, or family vein issues'
      ],
      questionsForDoctor: [
        'Are my symptoms typical of superficial venous insufficiency or musculoskeletal strain?',
        'Would medical-grade graduated compression stockings relieve my end-of-day fatigue?',
        'Do I need a specialist ultrasound to see what is happening underneath the skin?'
      ],
      documents: [
        'Primary Care Referral Note',
        'Symptom & Activity Log'
      ],
      primaryAction: {
        label: 'Take Degree Assessment',
        view: 'assessment'
      }
    },
    {
      id: 'stage-02',
      stageNumber: '02',
      title: 'Bilateral Standing Duplex Ultrasound Mapping',
      subtitle: 'Gold-standard non-invasive vascular sonography evaluating valve reflux duration (>0.5s) and saphenous diameters.',
      status: 'Current',
      statusLabel: 'Active Stage · You Are Here',
      whatHappens: 'A registered vascular technologist examines your legs while you stand. Using high-resolution B-mode ultrasound and Doppler color flow, they measure retrograde blood flow velocity in the Great Saphenous Vein (GSV), Small Saphenous Vein (SSV), and perforators after rapid calf squeezes.',
      checklist: [
        'Ensure the ultrasound is performed standing (lying down masks reflux)',
        'Wear comfortable loose shorts or skirt for easy thigh access',
        'Stay well-hydrated to optimize venous volume during scanning'
      ],
      questionsForDoctor: [
        'What was the measured reflux duration at my saphenofemoral junction (SFJ)?',
        'What is the diameter of my saphenous trunk in the thigh and calf?',
        'Were any deep vein blood clots (DVT) or post-thrombotic changes observed?'
      ],
      documents: [
        'Standing Duplex Ultrasound Report & Vein Map',
        'Spectral Doppler Waveform Tracings'
      ],
      primaryAction: {
        label: 'Explore Duplex Simulator & Decoder',
        view: 'doppler'
      }
    },
    {
      id: 'stage-03',
      stageNumber: '03',
      title: 'CEAP Staging & Hemodynamic Classification',
      subtitle: 'Standardized clinical classification (C0 through C6) establishing severity, pathology, and insurance medical necessity.',
      status: 'Upcoming',
      statusLabel: 'Upcoming',
      whatHappens: 'Your vascular surgeon synthesizes your duplex ultrasound measurements with clinical signs to assign your CEAP stage (C1 spider veins, C2 classic varicose trunks, C3 edema, C4 trophic skin discoloration, C5/C6 venous ulcers).',
      checklist: [
        'Obtain an official copy of your CEAP classification and VCSS score',
        'Verify if your insurance provider requires a 6-to-12 week trial of compression before approving treatment',
        'Review skin changes around the medial malleolus (inner ankle)'
      ],
      questionsForDoctor: [
        'What CEAP stage is my venous disease classified as?',
        'Is my condition considered medically necessary for corrective endovenous treatment?',
        'What are the risks of progression if I defer intervention?'
      ],
      documents: [
        'Physician Consultation Summary',
        'CEAP / VCSS Clinical Rating Form'
      ],
      primaryAction: {
        label: 'Take the Symptom Screener',
        view: 'assessment'
      }
    },
    {
      id: 'stage-04',
      stageNumber: '04',
      title: 'Minimally Invasive Treatment Selection',
      subtitle: 'Selecting between modern thermal ablation (EVLA/RFA), medical adhesive (VenaSeal), and foam sclerotherapy.',
      status: 'Upcoming',
      statusLabel: 'Upcoming',
      whatHappens: 'Together with your vascular surgeon, you choose the treatment best suited for your vein caliber, tortuosity, and lifestyle. Painful surgical vein stripping is no longer performed. Modern treatments use tiny needle punctures under ultrasound guidance.',
      checklist: [
        'Compare EVLA/RFA (thermal heat with tumescent fluid) vs. VenaSeal (non-thermal glue with no stocking mandate)',
        'Check insurance pre-authorization requirements for your specific procedure',
        'Arrange a companion or plan your 45-minute clinic visit'
      ],
      questionsForDoctor: [
        'Which procedure offers the highest long-term closure rate for my vein diameter?',
        'Will I need local tumescent anesthesia injections, or can we use medical adhesive?',
        'Will my bulging branch veins be removed simultaneously via micro-phlebectomy?'
      ],
      documents: [
        'Procedure Pre-Authorization Approval',
        'Informed Consent Dossier'
      ],
      primaryAction: {
        label: 'Find Board-Certified Specialists',
        view: 'specialists'
      }
    },
    {
      id: 'stage-05',
      stageNumber: '05',
      title: 'Outpatient Procedure Day',
      subtitle: 'Walk-in, walk-out ambulatory procedure lasting 30 to 45 minutes with zero hospital stay.',
      status: 'Upcoming',
      statusLabel: 'Upcoming',
      whatHappens: 'Under continuous ultrasound guidance, a micro-catheter is introduced into the diseased vein through a 2mm puncture. Energy or adhesive seals the vein shut. Healthy adjacent veins immediately reroute blood flow back to the heart. You walk immediately after completion.',
      checklist: [
        'Eat a light meal before arriving at the vascular center',
        'Wear loose trousers and comfortable walking shoes',
        'Plan for an immediate 15-minute gentle walk around the clinic before discharge'
      ],
      questionsForDoctor: [
        'How many days should I wear my post-procedure compression stocking?',
        'When can I resume gym workouts, running, or heavy lifting?',
        'What mild pulling sensation or bruising is normal over the next 10 days?'
      ],
      documents: [
        'Discharge Instructions & Medication Sheet',
        'Post-Procedure Care Hotline Contact'
      ],
      primaryAction: {
        label: 'Schedule Clinic Consultation',
        action: 'booking'
      }
    },
    {
      id: 'stage-06',
      stageNumber: '06',
      title: 'Surveillance, Compression & Long-Term Health',
      subtitle: 'Post-treatment ultrasound check at 2 to 4 weeks, calf pump maintenance, and lifelong venous wellness.',
      status: 'Upcoming',
      statusLabel: 'Upcoming',
      whatHappens: 'A follow-up duplex ultrasound confirms complete permanent closure of the treated saphenous trunk and patency of the deep venous system. Long-term calf muscle pump conditioning and hydration prevent future tributary recurrences.',
      checklist: [
        'Attend 2-week post-procedure duplex ultrasound check',
        'Incorporate regular calf-raise exercises and daily walking',
        'Wear light travel compression during long-haul flights or prolonged sitting'
      ],
      questionsForDoctor: [
        'Did the follow-up ultrasound confirm complete vein occlusion?',
        'Do I need cosmetic sclerotherapy for any remaining fine spider veins?',
        'How frequently should I schedule surveillance duplex checks in the future?'
      ],
      documents: [
        'Post-Ablation Verification Ultrasound',
        'Venous Wellness Protocol'
      ],
      primaryAction: {
        label: askGuideAbout('recovery'),
        view: 'ai'
      }
    }
  ];

  return (
    <section className="min-h-screen bg-[#FAF7F2] py-12 sm:py-20 text-mv-forest border-b border-mv-outline/60">
      <div className="container-page max-w-5xl">
        
        {/* Breadcrumb & Section Header */}
        <div className="mb-6 flex items-center gap-2 text-xs text-mv-ink-muted font-mono">
          <button
            onClick={() => onNavigateView('home')}
            className="hover:text-mv-forest underline cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-mv-forest font-semibold">Patient Care Journey</span>
        </div>

        <header className="max-w-3xl">
          <span className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-mv-terracotta mb-2.5 block">
            Clinical Milestone Navigation
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mv-forest tracking-tight leading-tight">
            The 6-Stage Vascular Care Pathway
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-mv-ink-muted max-w-2xl">
            Lower extremity vein care follows an orderly clinical progression. Track completed milestones, understand your current diagnostic stage, and prepare targeted questions for your vascular care team.
          </p>
        </header>

        {/* Clinical Environment Photography Banner */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-mv-outline/70 bg-white shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="relative aspect-[16/9] md:aspect-auto md:col-span-5 overflow-hidden bg-mv-pale/20">
              <img
                src={CLINICAL_PHOTOS.careJourneyReception.src}
                alt={CLINICAL_PHOTOS.careJourneyReception.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 rounded-md bg-mv-forest/85 px-2.5 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-mv-terracotta" />
                <span>{CLINICAL_PHOTOS.careJourneyReception.clinicalTag}</span>
              </span>
            </div>
            <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-mv-terracotta block mb-1">
                  Modern Day-Care Experience
                </span>
                <h3 className="font-serif text-[20px] sm:text-[22px] font-semibold text-mv-forest leading-snug">
                  What Does a Day-Care Vascular Clinic Look Like?
                </h3>
                <p className="mt-2 text-[13.5px] sm:text-[14px] leading-relaxed text-mv-ink-muted">
                  Unlike traditional surgical hospital wards, modern vascular centers operate as dedicated ambulatory suites. From ultrasound Doppler scan rooms to day-care procedure suites, every step is designed for patient comfort, natural light, zero overnight stays, and unassisted walking on the same day.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-mv-outline/50 text-[12px] text-mv-ink-muted">
                {CLINICAL_PHOTOS.careJourneyReception.caption}
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer Callout: Pathways Vary */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-white border border-mv-outline/70 text-xs sm:text-[13px] text-mv-ink-muted leading-relaxed shadow-2xs">
          <strong className="text-mv-forest block mb-1">Individualized Clinical Pathway Notice:</strong>
          Every patient&apos;s venous anatomy is distinct. Depending on your standing duplex hemodynamic findings, vein caliber, symptoms, medical history, and clinical judgment, the exact sequence, timeframe, and treatment options will vary. This pathway illustrates standard clinical governance stages rather than a rigid or guaranteed treatment schedule.
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-mv-ink-muted border-b border-mv-outline/60 pb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mv-forest text-[11px] font-bold text-white shadow-2xs">✓</span>
            <span className="text-mv-forest font-medium">Completed milestones</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mv-terracotta text-[10px] font-bold text-white shadow-2xs">●</span>
            <span className="font-semibold text-mv-forest">Active stage (You are here)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-mv-outline/80 bg-white text-[10px] text-mv-ink-muted">○</span>
            <span>Upcoming milestones</span>
          </div>
        </div>

        {/* Milestone Timeline List */}
        <div className="relative mt-12 pl-6 sm:pl-10 md:pl-12">
          
          {/* Vertical Track Line */}
          <div
            aria-hidden="true"
            className="absolute left-[18px] sm:left-[26px] md:left-[30px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-mv-forest via-mv-terracotta to-mv-outline/70"
          />

          <div className="space-y-7">
            {journeyStages.map((stage) => {
              const isExpanded = expandedStage === stage.id;
              const isCurrent = stage.status === 'Current';
              const isDone = stage.status === 'Completed';

              return (
                <div
                  key={stage.id}
                  className={`group relative rounded-3xl border transition-all duration-200 ${
                    isCurrent
                      ? 'border-mv-terracotta/60 bg-white shadow-sm ring-1 ring-mv-terracotta/30'
                      : 'border-mv-outline/70 bg-white shadow-2xs hover:border-mv-forest/40'
                  }`}
                >
                  {/* Timeline Badge Node */}
                  <div
                    className={`absolute -left-[30px] sm:-left-[38px] md:-left-[42px] top-6 z-10 flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-transform ${
                      isDone
                        ? 'bg-mv-forest text-white shadow-xs'
                        : isCurrent
                        ? 'bg-mv-terracotta text-white shadow-sm ring-4 ring-[#FAF7F2] scale-110'
                        : 'border border-mv-outline/80 bg-[#FAF7F2] text-mv-ink-muted'
                    }`}
                  >
                    {isDone ? '✓' : stage.stageNumber}
                  </div>

                  {/* Header Trigger */}
                  <button
                    type="button"
                    onClick={() => setExpandedStage(isExpanded ? '' : stage.id)}
                    aria-expanded={isExpanded}
                    className="flex w-full items-start justify-between p-6 sm:p-7 text-left cursor-pointer tap-tactile"
                  >
                    <div className="pr-4">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-semibold text-mv-ink-muted uppercase">
                          Stage {stage.stageNumber}
                        </span>
                        <span className="text-mv-outline">·</span>
                        <span
                          className={`rounded-full px-3 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                            isDone
                              ? 'bg-mv-pale text-mv-forest border border-mv-forest/20'
                              : isCurrent
                              ? 'bg-mv-terracotta/10 text-mv-terracotta font-bold border border-mv-terracotta/30'
                              : 'bg-mv-cream text-mv-ink-muted border border-mv-outline/60'
                          }`}
                        >
                          {stage.statusLabel}
                        </span>
                      </div>

                      <h2 className="font-serif mt-2 text-xl sm:text-2xl font-bold text-mv-forest leading-snug">
                        {stage.title}
                      </h2>

                      <p className="mt-2 text-xs sm:text-[14px] leading-relaxed text-mv-ink-muted max-w-2xl font-sans">
                        {stage.subtitle}
                      </p>
                    </div>

                    <span
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 ${
                        isExpanded
                          ? 'rotate-180 bg-mv-forest text-white border-mv-forest'
                          : 'border-mv-outline/70 text-mv-forest bg-[#FAF7F2]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {/* Expanded Dossier Content */}
                  {isExpanded && (
                    <div className="border-t border-mv-outline/60 bg-[#FAF7F2] px-6 pb-7 pt-6 sm:px-8 sm:pb-8 rounded-b-3xl animate-in fade-in duration-200">
                      <div className="grid gap-6 md:grid-cols-2">
                        
                        {/* Left Sub-column: Clinical Mechanics & What You Need */}
                        <div className="space-y-4">
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-mv-forest font-bold block mb-1.5">
                              What Happens At This Milestone
                            </span>
                            <p className="text-xs sm:text-[13px] leading-relaxed text-mv-ink-muted bg-white p-4 rounded-2xl border border-mv-outline/60 shadow-2xs">
                              {stage.whatHappens}
                            </p>
                          </div>

                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-mv-forest font-bold block mb-1.5">
                              Patient Preparation Checklist
                            </span>
                            <ul className="space-y-2 text-xs sm:text-[13px] text-mv-ink-muted">
                              {stage.checklist.map((item, cIdx) => (
                                <li key={cIdx} className="flex items-start gap-2">
                                  <span className="text-mv-terracotta font-bold mt-0.5">—</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-mv-forest font-bold block mb-1.5">
                              Key Clinical Documents
                            </span>
                            <div className="space-y-1.5">
                              {stage.documents.map((doc, dIdx) => (
                                <div
                                  key={dIdx}
                                  className="flex items-center justify-between rounded-xl bg-white px-3.5 py-2 text-xs border border-mv-outline/60 text-mv-forest shadow-2xs"
                                >
                                  <span className="font-medium">{doc}</span>
                                  <span className="font-mono text-[10.5px] text-mv-forest font-semibold">Relevant</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Sub-column: Doctor Questions & Stage Actions */}
                        <div className="space-y-4 flex flex-col justify-between">
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-wider text-mv-terracotta font-bold block mb-1.5">
                              Questions To Bring To Your Doctor
                            </span>
                            <ul className="space-y-2.5 text-xs sm:text-[13px] text-mv-ink-muted">
                              {stage.questionsForDoctor.map((q, qIdx) => (
                                <li
                                  key={qIdx}
                                  className="rounded-2xl bg-white p-3.5 border border-mv-outline/60 italic shadow-2xs flex items-start gap-2.5"
                                >
                                  <span className="text-mv-terracotta font-bold not-italic">?</span>
                                  <span>&ldquo;{q}&rdquo;</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Stage Action Links */}
                          <div className="pt-4 border-t border-mv-outline/60 flex flex-wrap items-center gap-3">
                            {stage.primaryAction.action === 'booking' ? (
                              <button
                                onClick={onOpenBooking}
                                className="inline-flex items-center gap-1.5 rounded-full bg-mv-terracotta px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#B34E35] transition-colors cursor-pointer shadow-xs min-h-[44px] tap-tactile"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{stage.primaryAction.label} &rarr;</span>
                              </button>
                            ) : stage.primaryAction.view ? (
                              <button
                                onClick={() => onNavigateView(stage.primaryAction.view!)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-mv-forest px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#073028] transition-colors cursor-pointer shadow-xs min-h-[44px] tap-tactile"
                              >
                                <span>{stage.primaryAction.label} &rarr;</span>
                              </button>
                            ) : null}

                            {onOpenAssistantWithPrompt && (
                              <button
                                onClick={() =>
                                   onOpenAssistantWithPrompt(
                                    `Help me prepare for Stage ${stage.stageNumber}: ${stage.title}`
                                  )
                                }
                                className="text-xs font-semibold text-mv-forest hover:text-mv-terracotta transition-colors cursor-pointer min-h-[44px] flex items-center"
                              >
                                {askGuideAbout('this stage')}
                              </button>
                            )}
                          </div>

                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
