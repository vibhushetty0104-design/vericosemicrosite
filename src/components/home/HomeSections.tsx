import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { AppView } from '../../types';
import { hrefForView, LearnTopicSlug, hrefForLearnTopic } from '../../content/siteNav';
import { CLINICAL_PHOTOS } from '../../content/photos';
import { FloatingIconCard, FloatingAnimationType } from './FloatingIconCard';

type Navigate = (view: AppView) => void;

interface ExploreCareGridProps {
  onNavigateView: Navigate;
  onNavigateSection?: (view: AppView, sectionId: string) => void;
  onNavigateTopic?: (slug: LearnTopicSlug) => void;
  onOpenAssistant: () => void;
  onOpenBooking?: () => void;
}

const SectionHeader: React.FC<{
  id: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  centered?: boolean;
}> = ({ id, eyebrow, title, lede, centered = false }) => (
  <div className={`max-w-[50rem] ${centered ? 'mx-auto text-center' : ''}`}>
    {eyebrow && (
      <p className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-mv-forest">
        {eyebrow}
      </p>
    )}
    <h2
      id={id}
      className="mt-2 font-serif text-[28px] font-semibold leading-[1.16] tracking-[-0.015em] text-mv-forest sm:text-[34px] lg:text-[42px]"
    >
      {title}
    </h2>
    {lede && (
      <p className="mt-3 text-[16px] sm:text-[18px] leading-relaxed text-mv-ink-muted">
        {lede}
      </p>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// 1. EXPLORE LEG HEALTH (Visual Healthcare Directory)
// ---------------------------------------------------------------------------

export type TopicGroup = 'anatomy' | 'treatments' | 'tools' | 'all';

export interface VisualTopicItem {
  id: string;
  group: 'anatomy' | 'treatments' | 'tools';
  animationType: FloatingAnimationType;
  iconWebp: string;
  iconPng: string;
  title: string;
  category: string;
  description: string;
  actionLabel: string;
  targetType?: 'view' | 'section' | 'assistant' | 'booking' | 'learn-topic';
  targetView?: AppView;
  targetSection?: string;
  learnSlug?: LearnTopicSlug;
  badge?: string;
  clinicalNote?: string;
}

export const ALL_VASCULAR_TOPICS: VisualTopicItem[] = [
  // GROUP 1: The Dedicated Educational Topics (Anatomy & Care Guides)
  {
    id: 'circulation',
    group: 'anatomy',
    animationType: 'anatomy',
    iconWebp: '/assets/icons2/mv-icon-vein-anatomy.webp',
    iconPng: '/assets/icons2/mv-icon-vein-anatomy.png',
    title: 'How Leg Circulation Works',
    category: 'Venous Anatomy',
    badge: 'Anatomy guide',
    description: 'Explore how deep and superficial veins, delicate one-way bicuspid valves, and the calf muscle pump return blood upwards against gravity.',
    actionLabel: 'Explore circulation',
    targetType: 'learn-topic',
    learnSlug: 'leg-circulation',
    clinicalNote: 'Understanding normal valvular function explains why stretched vein walls allow retrograde blood pooling in dependent limbs.',
  },
  {
    id: 'causes',
    group: 'anatomy',
    animationType: 'vein',
    iconWebp: '/assets/icons2/mv-icon-venous-reflux.webp',
    iconPng: '/assets/icons2/mv-icon-venous-reflux.png',
    title: 'Why Varicose Veins Develop',
    category: 'Causes & Risk Factors',
    badge: 'Causes & risks',
    description: 'The roles of genetics (up to 90% risk), prolonged standing jobs in India, and tropical climate load.',
    actionLabel: 'Understand causes',
    targetType: 'learn-topic',
    learnSlug: 'varicose-veins-causes',
    clinicalNote: 'Prolonged hydrostatic pressure stretches thin vein walls, separating valve leaflets and causing chronic venous reflux.',
  },
  {
    id: 'symptoms',
    group: 'anatomy',
    animationType: 'vein',
    iconWebp: '/assets/icons2/mv-icon-varicose-veins.webp',
    iconPng: '/assets/icons2/mv-icon-varicose-veins.png',
    title: 'Symptoms & Care Triggers',
    category: 'Symptom Recognition',
    badge: 'Symptom guide',
    description: 'Recognise heaviness, late-day ankle swelling, throbbing, nocturnal calf cramps, and visible bulging vein cords.',
    actionLabel: 'Review symptoms',
    targetType: 'learn-topic',
    learnSlug: 'symptoms',
    clinicalNote: 'Early self-recognition helps prevent progressive skin discoloration (hemosiderin) and irreversible dermal fibrosis.',
  },
  {
    id: 'dvt',
    group: 'anatomy',
    animationType: 'warning',
    iconWebp: '/assets/icons2/mv-icon-emergency-warning.webp',
    iconPng: '/assets/icons2/mv-icon-emergency-warning.png',
    title: 'Blood Clot (DVT) Warning Signs & Myths',
    category: 'Emergency Safety',
    badge: 'Emergency safety',
    description: 'Critical emergency signs requiring hospital care (Dial 112 / 108 in India) versus routine superficial vein aching.',
    actionLabel: 'View red flags',
    targetType: 'learn-topic',
    learnSlug: 'dvt-warning-signs',
    clinicalNote: 'Acute deep vein thrombosis is a medical emergency requiring immediate evaluation at a hospital emergency room (Dial 112 / 108 in India).',
  },
  {
    id: 'differential',
    group: 'anatomy',
    animationType: 'research',
    iconWebp: '/assets/icons2/mv-icon-medical-reports.webp',
    iconPng: '/assets/icons2/mv-icon-medical-reports.png',
    title: 'Vein Pain or Another Cause?',
    category: 'Differential Evaluation',
    badge: 'Differential guide',
    description: 'Distinguish vein pain from muscle fatigue, sciatica nerve compression, or peripheral arterial disease.',
    actionLabel: 'Compare pain causes',
    targetType: 'learn-topic',
    learnSlug: 'leg-pain',
    clinicalNote: 'Vascular aching typically improves with elevation and calf pump exercise, whereas neurogenic or arterial claudication follow different symptom patterns.',
  },
  {
    id: 'ceap',
    group: 'anatomy',
    animationType: 'specialist',
    iconWebp: '/assets/icons2/mv-icon-risk-factors.webp',
    iconPng: '/assets/icons2/mv-icon-risk-factors.png',
    title: 'CEAP Stages (C0 to C6)',
    category: 'Clinical Staging',
    badge: 'Clinical staging',
    description: 'Follow the clinical progression from C1 spider veins to C3 swelling, C4 skin changes, and C6 ulcers.',
    actionLabel: 'Explore CEAP stages',
    targetType: 'learn-topic',
    learnSlug: 'ceap-stages',
    clinicalNote: 'The American Venous Forum CEAP tool helps physicians classify clinical severity and determine medical necessity for intervention.',
  },
  {
    id: 'science',
    group: 'anatomy',
    animationType: 'research',
    iconWebp: '/assets/icons2/mv-icon-research-library.webp',
    iconPng: '/assets/icons2/mv-icon-research-library.png',
    title: 'Did You Know? Vein Science',
    category: 'Hemodynamic Evidence',
    badge: 'Evidence facts',
    description: 'Evidence-backed metrics on hydrostatic pressure, standing work risks, and therapeutic elevation.',
    actionLabel: 'Read vein science',
    targetType: 'learn-topic',
    learnSlug: 'did-you-know',
    clinicalNote: 'Grounded in published vascular biomechanics and epidemiological studies of occupational standing.',
  },
  {
    id: 'habits',
    group: 'anatomy',
    animationType: 'prevention',
    iconWebp: '/assets/icons2/mv-icon-prevention.webp',
    iconPng: '/assets/icons2/mv-icon-prevention.png',
    title: 'Everyday Habits for Circulation',
    category: 'Circulation Habits',
    badge: 'Self-care habits',
    description: 'Daily non-surgical habits: leg elevation, fitted compression, hydration, and calf pump routines.',
    actionLabel: 'Learn daily habits',
    targetType: 'learn-topic',
    learnSlug: 'circulation-habits',
    clinicalNote: 'Active walking activates the gastrocnemius muscle pump—the "peripheral heart"—ejecting pooled blood back toward the heart.',
  },
  {
    id: 'curriculum',
    group: 'anatomy',
    animationType: 'pathway',
    iconWebp: '/assets/icons2/mv-icon-educational-guide.webp',
    iconPng: '/assets/icons2/mv-icon-educational-guide.png',
    title: 'Vascular Topic Explorer',
    category: 'Educational Curriculum',
    badge: 'Curriculum',
    description: 'Comprehensive interactive curriculum and cross-topic deep-dives for patients and families.',
    actionLabel: 'Open curriculum',
    targetType: 'learn-topic',
    learnSlug: 'topic-explorer',
    clinicalNote: 'Structured topic navigation aligning clinical guidelines from SVS and the American Venous Forum.',
  },

  // GROUP 2: Treatments (1)
  {
    id: 'treatments',
    group: 'treatments',
    animationType: 'treatment',
    iconWebp: '/assets/icons2/mv-icon-treatment-options.webp',
    iconPng: '/assets/icons2/mv-icon-treatment-options.png',
    title: 'Treatment Options & Comparison',
    category: 'Modern Day-Care',
    badge: 'Minimally invasive',
    description: 'Compare EVLA laser, radiofrequency ablation (RFA), medical adhesive glue (VenaSeal), foam sclerotherapy, and post-procedure recovery.',
    actionLabel: 'Compare options',
    targetType: 'view',
    targetView: 'treatments',
    clinicalNote: 'Modern endovenous treatments require pinhole entry and local anesthesia, eliminating open surgical stripping and prolonged bed rest.',
  },

  // GROUP 3: Interactive Tools & Expert Review (4)
  {
    id: 'assessment',
    group: 'tools',
    animationType: 'assessment',
    iconWebp: '/assets/icons2/mv-icon-educational-guide.webp',
    iconPng: '/assets/icons2/mv-icon-educational-guide.png',
    title: 'Symptom Pattern Assessment',
    category: 'Interactive Screener',
    badge: '3 min screener',
    description: 'A structured, 3-minute CEAP-aligned clinical questionnaire with private on-device photo & video vault for consultation preparation.',
    actionLabel: 'Start screener',
    targetType: 'view',
    targetView: 'assessment',
    clinicalNote: 'Educational symptom screener only; provides structured self-reflection, not a medical diagnosis or treatment prescription.',
  },
  {
    id: 'expert-review',
    group: 'tools',
    animationType: 'research',
    iconWebp: '/assets/icons2/mv-icon-medical-reports.webp',
    iconPng: '/assets/icons2/mv-icon-medical-reports.png',
    title: 'Upload Reports for Expert Review',
    category: 'Specialist Triage',
    badge: 'Clinician review',
    description: 'Submit your Doppler ultrasound scans, hospital summaries, or leg photos securely for evaluation by senior vascular surgeons.',
    actionLabel: 'Request expert review',
    targetType: 'view',
    targetView: 'expert-review',
    clinicalNote: 'Evaluated by experienced human vascular surgeons; not automated AI algorithms.',
  },
  {
    id: 'booking',
    group: 'tools',
    animationType: 'appointment',
    iconWebp: '/assets/icons2/mv-icon-laser-treatment.webp',
    iconPng: '/assets/icons2/mv-icon-laser-treatment.png',
    title: 'Consultation Request',
    category: 'Clinic Booking',
    badge: 'In-person clinic',
    description: 'Schedule an in-person vascular duplex ultrasound examination and clinical consultation at our clinic in Bengaluru.',
    actionLabel: 'Request consultation',
    targetType: 'booking',
    clinicalNote: 'Full duplex ultrasound scan and vascular surgeon evaluation.',
  },
];

export const ExploreCareGrid: React.FC<ExploreCareGridProps> = ({
  onNavigateView,
  onNavigateSection,
  onNavigateTopic,
  onOpenAssistant,
  onOpenBooking,
}) => {
  // Default to All Destinations so all icons show at once when anyone opens the website
  const [activeFilter, setActiveFilter] = useState<TopicGroup>('all');

  const filterTabs: { id: TopicGroup; label: string; count: number }[] = [
    { id: 'all', label: 'All Destinations', count: ALL_VASCULAR_TOPICS.length },
    { id: 'anatomy', label: 'Leg Health Guides', count: ALL_VASCULAR_TOPICS.filter(t => t.group === 'anatomy').length },
    { id: 'treatments', label: 'Treatments', count: ALL_VASCULAR_TOPICS.filter(t => t.group === 'treatments').length },
    { id: 'tools', label: 'Tools & Review', count: ALL_VASCULAR_TOPICS.filter(t => t.group === 'tools').length },
  ];

  const displayedTopics = activeFilter === 'all'
    ? ALL_VASCULAR_TOPICS
    : ALL_VASCULAR_TOPICS.filter((t) => t.group === activeFilter);

  const handleCardClick = (item: VisualTopicItem, e: React.MouseEvent) => {
    e.preventDefault();
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

  return (
    <section id="explore-leg-health" aria-labelledby="explore-title" className="bg-[#FAF7F2] pt-12 sm:pt-20 pb-16 sm:pb-28 lg:pb-32 border-b border-mv-outline/50 scroll-mt-20 overflow-hidden">
      <div className="container-page max-w-[1240px] px-3.5 min-[360px]:px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-mv-outline/60">
          <SectionHeader
            id="explore-title"
            eyebrow="Explore Leg Health"
            title="Explore Leg Health"
            lede="Understand your circulation, recognise symptoms and explore your care options through our illustrated guides."
          />

          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0 px-4 py-2 rounded-full bg-white/80 border border-mv-outline/70 shadow-2xs text-[12.5px] font-mono text-mv-forest">
            <Sparkles className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
            <span>{displayedTopics.length} Visual Destinations</span>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-6 sm:mt-8 flex items-center gap-2 overflow-x-auto pb-2 -mx-3.5 px-3.5 min-[360px]:-mx-4 min-[360px]:px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <span className="text-[12px] font-mono uppercase tracking-wider text-mv-ink-muted mr-1 shrink-0 flex items-center gap-1.5 hidden sm:flex">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            Explore:
          </span>

          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-[13px] sm:text-[13.5px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                  isActive
                    ? 'bg-mv-forest text-white shadow-xs'
                    : 'bg-white/80 text-mv-forest/80 hover:bg-white hover:text-mv-forest border border-mv-outline/60'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-mv-ivory text-mv-ink-muted'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floating Visual Destination Cards */}
        <div id="explore-cards-grid" className="mt-6 sm:mt-12 grid grid-cols-2 gap-2.5 min-[360px]:gap-3 min-[431px]:gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedTopics.map((feature) => (
            <FloatingIconCard
              key={feature.id}
              id={feature.id}
              animationType={feature.animationType}
              iconWebp={feature.iconWebp}
              iconPng={feature.iconPng}
              title={feature.title}
              category={feature.category}
              description={feature.description}
              actionLabel={feature.actionLabel}
              href={getHref(feature)}
              onClick={(e) => handleCardClick(feature, e)}
              badge={feature.badge}
              clinicalNote={feature.clinicalNote}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 2. CARE PATHWAY SEQUENCE (Open, Editorial 5-Step Linear Sequence)
// ---------------------------------------------------------------------------

interface PathwayStep {
  step: number;
  iconWebp: string;
  iconPng: string;
  title: string;
  summary: string;
}

const PATHWAY_STEPS: PathwayStep[] = [
  {
    step: 1,
    iconWebp: '/assets/icons2/mv-icon-varicose-veins.webp',
    iconPng: '/assets/icons2/mv-icon-varicose-veins.png',
    title: 'Notice symptoms',
    summary: 'Aching, heavy legs, ankle swelling or visible bulging veins that worsen towards evening.',
  },
  {
    step: 2,
    iconWebp: '/assets/icons2/mv-icon-doppler-report.webp',
    iconPng: '/assets/icons2/mv-icon-doppler-report.png',
    title: 'Doppler scan',
    summary: 'A standing venous duplex ultrasound maps valve function and tests for reflux duration or clots.',
  },
  {
    step: 3,
    iconWebp: '/assets/icons2/mv-icon-treatment-options.webp',
    iconPng: '/assets/icons2/mv-icon-treatment-options.png',
    title: 'Compare options',
    summary: 'Review conservative measures (stockings, elevation) versus minimally invasive catheter closure.',
  },
  {
    step: 4,
    iconWebp: '/assets/icons2/mv-icon-consultation.webp',
    iconPng: '/assets/icons2/mv-icon-consultation.png',
    title: 'Specialist visit',
    summary: 'A consultation with a vascular surgeon or interventional radiologist to agree a care plan.',
  },
  {
    step: 5,
    iconWebp: '/assets/icons2/mv-icon-prevention.webp',
    iconPng: '/assets/icons2/mv-icon-prevention.png',
    title: 'Swift recovery',
    summary: 'Modern endovenous treatments require no general anaesthesia and enable walking on the same day.',
  },
];

interface ImageLedService {
  id: string;
  category: string;
  title: string;
  description: string;
  photoSrc: string;
  photoAlt: string;
  clinicalTag: string;
  highlights: string[];
  actionLabel: string;
  actionView?: AppView;
  actionTopic?: LearnTopicSlug;
}

const IMAGE_LED_SERVICES: ImageLedService[] = [
  {
    id: 'doppler-scan',
    category: 'Gold Standard Diagnosis',
    title: 'Standing Venous Duplex Ultrasound',
    description: 'Bilateral non-invasive soundwave mapping while standing to measure retrograde valve reflux duration (> 0.5 sec) and confirm deep vein patency.',
    photoSrc: CLINICAL_PHOTOS.clinicalDopplerExam.src,
    photoAlt: CLINICAL_PHOTOS.clinicalDopplerExam.alt,
    clinicalTag: CLINICAL_PHOTOS.clinicalDopplerExam.clinicalTag,
    highlights: [
      'Painless standing scan (~30–45 mins)',
      'Maps Great & Small Saphenous veins',
      'Definitive pre-procedure anatomic roadmap',
    ],
    actionLabel: 'Upload scan for expert review',
    actionView: 'expert-review',
  },
  {
    id: 'specialist-consult',
    category: 'Clinical Assessment',
    title: 'Vascular Specialist Consultation',
    description: 'One-on-one clinical evaluation with a vascular surgeon in Bengaluru to review ultrasound findings, check vein diameter, and agree on a care plan.',
    photoSrc: CLINICAL_PHOTOS.clinicalConsultation.src,
    photoAlt: CLINICAL_PHOTOS.clinicalConsultation.alt,
    clinicalTag: CLINICAL_PHOTOS.clinicalConsultation.clinicalTag,
    highlights: [
      'Physical inspection & CEAP staging',
      'Plain-language scan interpretation',
      'Personalized treatment recommendations',
    ],
    actionLabel: 'Explore treatments',
    actionView: 'treatments',
  },
  {
    id: 'modern-procedures',
    category: 'Minimally Invasive Interventions',
    title: 'Day-Care Laser & Thermal Closure',
    description: 'Catheter-based therapies (EVLA, RFA, VenaSeal) performed under local tumescent anaesthesia that permanently seal diseased saphenous veins.',
    photoSrc: CLINICAL_PHOTOS.treatmentLaserEvla.src,
    photoAlt: CLINICAL_PHOTOS.treatmentLaserEvla.alt,
    clinicalTag: CLINICAL_PHOTOS.treatmentLaserEvla.clinicalTag,
    highlights: [
      '45-minute outpatient day-care session',
      'Zero surgical incisions or general anaesthesia',
      'Immediate unassisted walking on same day',
    ],
    actionLabel: 'Compare treatments',
    actionView: 'treatments',
  },
  {
    id: 'circulation-recovery',
    category: 'Lifestyle & Recovery',
    title: 'Circulation Habits & Compression',
    description: 'Medical graduated compression stockings (Class 2), 15-minute gravity elevation routines, and active calf muscle pump exercises for symptom control.',
    photoSrc: CLINICAL_PHOTOS.habitsElevation.src,
    photoAlt: CLINICAL_PHOTOS.habitsElevation.alt,
    clinicalTag: CLINICAL_PHOTOS.habitsElevation.clinicalTag,
    highlights: [
      'Relieves end-of-day swelling & heaviness',
      'Prevents post-procedure venous pooling',
      'Supports healthy blood return to heart',
    ],
    actionLabel: 'View circulation habits',
    actionTopic: 'circulation-habits',
  },
];

export const CarePathwaySequence: React.FC<{
  onNavigateView: Navigate;
  onNavigateTopic?: (slug: LearnTopicSlug) => void;
}> = ({ onNavigateView, onNavigateTopic }) => {
  return (
    <section aria-labelledby="pathway-title" className="bg-white py-14 sm:py-20 lg:py-24 border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeader
            id="pathway-title"
            eyebrow="Clinical care pathway"
            title="Evidence-based care, from diagnosis to recovery"
            lede="Real-world vascular medicine combines precise ultrasound diagnosis, expert clinical evaluation, and gentle day-care interventions."
          />

          <a
            href={hrefForView('journey')}
            onClick={(e) => {
              e.preventDefault();
              onNavigateView('journey');
            }}
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-mv-forest hover:text-mv-terracotta min-h-[44px] py-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest rounded-md transition-colors"
          >
            <span>View complete patient pathway</span>
            <ArrowRight className="h-4 w-4 text-mv-terracotta" strokeWidth={2} aria-hidden="true" />
          </a>
        </div>

        {/* Image-Led Flagship Service Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {IMAGE_LED_SERVICES.map((card) => (
            <article
              key={card.id}
              className="group flex flex-col rounded-3xl bg-[#FAF7F2] border border-mv-outline/70 overflow-hidden shadow-2xs hover:shadow-md hover:border-mv-forest/40 transition-all duration-300"
            >
              {/* Image Container with Consistent 16:10 Aspect Ratio & Clinical Tag */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-mv-pale/40 border-b border-mv-outline/60">
                <img
                  src={card.photoSrc}
                  alt={card.photoAlt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 rounded-md bg-mv-forest/85 px-2 py-0.5 text-[10.5px] font-mono font-medium tracking-wide text-white backdrop-blur-xs">
                  {card.clinicalTag}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-5 sm:p-5.5">
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-mv-terracotta block mb-1">
                  {card.category}
                </span>

                <h3 className="font-serif text-[18px] sm:text-[19px] font-semibold text-mv-forest leading-snug group-hover:text-mv-terracotta transition-colors">
                  {card.title}
                </h3>

                <p className="mt-2 text-[13.5px] leading-relaxed text-mv-ink-muted line-clamp-3">
                  {card.description}
                </p>

                {/* Verified Clinical Highlights Checklist */}
                <div className="mt-4 pt-3.5 border-t border-mv-outline/60 space-y-2 flex-1">
                  {card.highlights.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-[12.5px] text-mv-ink">
                      <CheckCircle2 className="w-3.5 h-3.5 text-mv-forest shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Primary Card Action */}
                <div className="mt-5 pt-3">
                  <a
                    href={
                      card.actionTopic
                        ? hrefForLearnTopic(card.actionTopic)
                        : card.actionView
                        ? hrefForView(card.actionView)
                        : '#pathway'
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      if (card.actionTopic && onNavigateTopic) {
                        onNavigateTopic(card.actionTopic);
                      } else if (card.actionView) {
                        onNavigateView(card.actionView);
                      }
                    }}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-white px-4 py-2.5 text-[13.5px] font-semibold text-mv-forest border border-mv-outline/70 shadow-2xs hover:bg-mv-forest hover:text-white hover:border-mv-forest min-h-[44px] transition-all"
                  >
                    <span>{card.actionLabel}</span>
                    <ArrowRight className="h-4 w-4 text-mv-terracotta group-hover:translate-x-0.5 group-hover:text-white transition-all" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 5-Step Editorial Roadmap Progression */}
        <div className="mt-16 pt-12 border-t border-mv-outline/60">
          <div className="mb-6">
            <span className="font-mono text-[11px] font-bold text-mv-forest tracking-wider uppercase">
              Step-by-step roadmap
            </span>
            <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest mt-1">
              What to expect at each stage
            </h3>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-gradient-to-r from-mv-terracotta/25 via-mv-forest/30 to-mv-terracotta/25 z-0"
            />

            <ol className="relative z-10 grid gap-8 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              {PATHWAY_STEPS.map((item) => (
                <li
                  key={item.step}
                  className="group flex flex-col items-start lg:items-center lg:text-center"
                >
                  <div className="flex items-center gap-3 lg:flex-col lg:gap-2">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF7F2] p-1.5 shadow-xs border border-mv-outline/60 group-hover:scale-105 group-hover:border-mv-terracotta/40 transition-all duration-200"
                      aria-hidden="true"
                    >
                      <picture>
                        <source srcSet={item.iconWebp} type="image/webp" />
                        <img
                          src={item.iconPng}
                          alt=""
                          width={40}
                          height={40}
                          loading="lazy"
                          decoding="async"
                          className="w-9 h-9 object-contain"
                        />
                      </picture>
                    </div>

                    <span className="font-mono text-[11px] font-bold text-mv-terracotta tracking-wider uppercase">
                      Step 0{item.step}
                    </span>
                  </div>

                  <h4 className="mt-3 font-serif text-[17px] font-semibold leading-snug text-mv-forest group-hover:text-mv-terracotta transition-colors">
                    {item.title}
                  </h4>

                  <p className="mt-1.5 text-[13px] leading-relaxed text-mv-ink-muted">
                    {item.summary}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="mt-10 text-[13px] text-mv-ink-muted/80 leading-relaxed max-w-2xl">
          * Note: This sequence represents a general educational journey. Not every patient requires every step, and treatment decisions must always be guided by an in-person clinical assessment.
        </p>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 3. TRUST & EDUCATIONAL VALUE (Editorial Multi-Column Layout)
// ---------------------------------------------------------------------------

interface TrustPillar {
  iconWebp: string;
  iconPng: string;
  title: string;
  text: string;
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    iconWebp: '/assets/icons2/mv-icon-research-library.webp',
    iconPng: '/assets/icons2/mv-icon-research-library.png',
    title: 'Evidence-based consensus',
    text: 'Grounded in published clinical guidelines from the American Venous Forum (AVF) and Society for Vascular Surgery (SVS).',
  },
  {
    iconWebp: '/assets/icons2/mv-icon-valve-function.webp',
    iconPng: '/assets/icons2/mv-icon-valve-function.png',
    title: 'Anatomy in plain language',
    text: 'We explain venous reflux, perforators and deep systems using plain concepts so you understand what your scan describes.',
  },
  {
    iconWebp: '/assets/icons2/mv-icon-health-insurance.webp',
    iconPng: '/assets/icons2/mv-icon-health-insurance.png',
    title: 'Indian healthcare context',
    text: 'Guidance tailored to local clinic workflows, ultrasound Doppler expectations and Indian cashless health insurance policies.',
  },
  {
    iconWebp: '/assets/icons2/mv-icon-emergency-warning.webp',
    iconPng: '/assets/icons2/mv-icon-emergency-warning.png',
    title: 'Honest safety boundaries',
    text: 'Clear separation between routine outpatient vein concerns and urgent red flags like deep vein thrombosis (DVT) with emergency numbers (112 / 108).',
  },
];

export const TrustAndValueSection: React.FC<{ onNavigateView: Navigate }> = ({ onNavigateView }) => {
  return (
    <section aria-labelledby="trust-title" className="bg-[#FAF7F2] py-14 sm:py-20 lg:py-24 border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        <SectionHeader
          id="trust-title"
          eyebrow="Our educational standards"
          title="Clinical clarity you can trust"
          lede="Independent, patient-first health education created to inform consultations, not replace them."
        />

        <div className="mt-10 sm:mt-12 grid gap-8 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col items-start pt-3 border-t-2 border-mv-forest/20"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1 border border-mv-outline/50 shadow-2xs mb-3"
                aria-hidden="true"
              >
                <picture>
                  <source srcSet={pillar.iconWebp} type="image/webp" />
                  <img
                    src={pillar.iconPng}
                    alt=""
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="w-8 h-8 object-contain"
                  />
                </picture>
              </div>

              <h3 className="font-serif text-[18px] font-semibold text-mv-forest leading-snug">
                {pillar.title}
              </h3>

              <p className="mt-2 text-[14px] leading-relaxed text-mv-ink-muted">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white/80 border border-mv-outline/70">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mv-ivory p-1 border border-mv-outline/40 shadow-2xs" aria-hidden="true">
              <picture>
                <source srcSet="/assets/icons2/mv-icon-educational-guide.webp" type="image/webp" />
                <img
                  src="/assets/icons2/mv-icon-educational-guide.png"
                  alt=""
                  width={30}
                  height={30}
                  loading="lazy"
                  decoding="async"
                  className="w-7 h-7 object-contain"
                />
              </picture>
            </div>
            <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-mv-ink max-w-2xl">
              <strong className="text-mv-forest">Non-diagnostic promise:</strong> Meridian Vascular provides educational guidance only. We do not provide medical diagnosis, prescribe medications, or replace physical duplex ultrasound examinations.
            </p>
          </div>

          <a
            href={hrefForView('learn')}
            onClick={(e) => {
              e.preventDefault();
              onNavigateView('learn');
            }}
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-mv-forest underline underline-offset-4 hover:text-mv-terracotta min-h-[44px] py-2 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest rounded-md"
          >
            <span>Read clinical curriculum</span>
            <ArrowRight className="h-4 w-4 text-mv-terracotta" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// 4. CURATED FAQS (Clean Editorial Hairline Dividers)
// ---------------------------------------------------------------------------

interface FaqItem {
  q: string;
  a: string;
  tag: string;
}

const CURATED_FAQS: FaqItem[] = [
  {
    tag: 'Causes & Origins',
    q: 'What causes varicose veins?',
    a: 'Varicose veins occur when one-way valves inside superficial leg veins fail. Instead of pumping blood upwards against gravity toward the heart, faulty valves permit blood to pool downwards (reflux). Risk factors include genetic predisposition, prolonged standing occupations, pregnancy, and aging.',
  },
  {
    tag: 'Clinical Severity',
    q: 'Are varicose veins just a cosmetic issue?',
    a: 'No. While early spider veins can be purely cosmetic, true varicose veins indicate underlying chronic venous disease (CVD). Left untreated, progressive reflux causes chronic lower leg swelling, skin darkening (hemosiderin), lipodermatosclerosis (hardening), and painful venous leg ulcers.',
  },
  {
    tag: 'When to Seek Care',
    q: 'When should I see a vascular specialist?',
    a: 'You should consult a vascular specialist if you experience persistent leg heaviness, throbbing, evening ankle swelling, nighttime calf cramps, visible rope-like bulging veins, skin discoloration around the ankle, or any non-healing sore.',
  },
  {
    tag: 'Diagnostic Scanning',
    q: 'What is a duplex ultrasound scan and does it hurt?',
    a: 'A venous duplex ultrasound is the painless gold-standard diagnostic scan. It uses soundwaves to map both deep and superficial veins while you stand, measuring the exact location and duration of valve reflux (>0.5 seconds indicates incompetence) and ruling out deep vein clots.',
  },
  {
    tag: 'Modern Interventions',
    q: 'Can varicose veins be treated without open surgery?',
    a: 'Yes. Modern vascular care has completely replaced traumatic surgical vein stripping. Today, minimally invasive outpatient procedures like Endovenous Laser Ablation (EVLA), Radiofrequency Ablation (RFA), and VenaSeal Medical Superglue are performed through a tiny pinhole under local anesthesia in 45 minutes.',
  },
  {
    tag: 'EVLA vs Medical Glue',
    q: 'How do Endovenous Laser (EVLA) and Medical Superglue (VenaSeal) compare?',
    a: 'Both achieve >95% long-term vein closure. EVLA uses targeted thermal laser light and requires local tumescent fluid for cooling, followed by compression stockings for 1–2 weeks. VenaSeal uses a medical bioadhesive polymer requiring zero heat, minimal local anesthesia, and often no post-procedure compression stockings.',
  },
  {
    tag: 'Expert Report Review',
    q: 'Can I upload my Doppler ultrasound or medical reports for an expert opinion?',
    a: 'Yes. You can securely upload your ultrasound scan images, Doppler reports, or discharge summaries through our portal. Our senior vascular surgeons review your findings and provide a clinical second opinion and treatment roadmap.',
  },
  {
    tag: 'Photo Review & Privacy',
    q: 'How does the photo review work and is my privacy protected?',
    a: 'You may optionally upload high-resolution photographs of your leg veins from different angles. Your photographs are encrypted and evaluated directly by certified vascular clinicians. In accordance with the Digital Personal Data Protection Act (DPDPA), your data is never sold, publicly shared, or used by third-party advertisers.',
  },
  {
    tag: 'Long-Term Recurrence',
    q: 'Will varicose veins come back after treatment?',
    a: 'Treated and sealed veins cannot reopen. However, because venous disease is chronic, previously normal secondary veins can develop reflux over years, especially with genetic predisposition. Regular walking, weight control, and periodic check-ups keep recurrence risk under 5%.',
  },
  {
    tag: 'Recovery & Downtime',
    q: 'How quickly can I resume normal activities after treatment?',
    a: 'Immediately. Because modern treatments require only a tiny pinhole and local anesthesia, patients walk out of the clinic right after the procedure. Most patients return to desk work the next day and resume light exercise within 3 to 5 days.',
  },
];

export const CuratedFaqSection: React.FC<{
  onOpenAssistant: () => void;
  onNavigateView: Navigate;
}> = ({ onOpenAssistant, onNavigateView }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" aria-labelledby="curated-faq-title" className="bg-white py-14 sm:py-20 lg:py-24 border-b border-mv-outline/50">
      <div className="container-page max-w-[860px]">
        <SectionHeader
          id="curated-faq-title"
          eyebrow="Frequently asked questions"
          title="Essential questions, clearly answered"
          lede="Quick answers to the most common questions patients ask about symptoms, Doppler scans, and treatment."
          centered
        />

        <div className="mt-10 divide-y divide-mv-outline/60">
          {CURATED_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q} className={`py-4 sm:py-5 transition-colors ${isOpen ? 'bg-mv-pale/25 -mx-4 px-4 rounded-xl' : ''}`}>
                <button
                  type="button"
                  id={`home-faq-btn-${idx}`}
                  aria-controls={`home-faq-panel-${idx}`}
                  aria-expanded={isOpen}
                  onClick={() => toggle(idx)}
                  className="flex w-full items-start justify-between gap-4 text-left min-h-[52px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest rounded-sm"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-mv-terracotta">
                      {faq.tag}
                    </span>
                    <h3 className="mt-1 font-serif text-[18px] sm:text-[20px] font-semibold text-mv-forest leading-snug">
                      {faq.q}
                    </h3>
                  </div>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mv-ivory text-mv-forest transition-transform duration-200 border border-mv-outline/60 shadow-2xs ${
                      isOpen ? 'rotate-180 text-mv-terracotta border-mv-terracotta/40' : ''
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="h-4 w-4" strokeWidth={2} />
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`home-faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`home-faq-btn-${idx}`}
                    className="pt-3 pb-2 text-[14.5px] sm:text-[15.5px] leading-relaxed text-mv-ink animate-in fade-in duration-200"
                  >
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FAF7F2] border border-mv-outline/70">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-2xs border border-mv-outline/40" aria-hidden="true">
              <picture>
                <source srcSet="/assets/icons2/mv-icon-faq.webp" type="image/webp" />
                <img
                  src="/assets/icons2/mv-icon-faq.png"
                  alt=""
                  width={34}
                  height={34}
                  loading="lazy"
                  decoding="async"
                  className="w-8 h-8 object-contain"
                />
              </picture>
            </div>
            <div>
              <p className="font-serif text-[16.5px] font-semibold text-mv-forest">
                Have a question not listed here?
              </p>
              <p className="text-[13.5px] text-mv-ink-muted">
                Our educational guide has pre-written answers on Doppler terms, symptoms and insurance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateView('learn')}
            className="inline-flex items-center gap-2 rounded-xl bg-mv-forest px-5 py-2.5 text-[14px] font-semibold text-white shadow-2xs hover:bg-mv-forest/90 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest focus-visible:ring-offset-2 shrink-0 transition-colors"
          >
            <span>Explore Educational Guides</span>
            <ArrowRight className="h-4 w-4 text-mv-terracotta" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};


// Re-export new strategic homepage sections
export { PatientFirstSection } from './PatientFirstSection';
export { CoreBusinessFocusSection } from './CoreBusinessFocusSection';
export { SustainableBusinessSection } from './SustainableBusinessSection';
