/**
 * Site navigation: one list of views, labels and in-page sections, shared by the header,
 * the menu sheet, the footer and the hash router in App.tsx so labels never drift apart.
 */
import type { LucideIcon } from 'lucide-react';
import { Activity, BookOpen, ClipboardList, FileText, Home, Layers, Library, Route, ShieldCheck, Stethoscope } from 'lucide-react';
import { AppView } from '../types';
import { IllustrationKey } from './illustrations';

export interface NavItem {
  view: AppView;
  label: string;
  icon: LucideIcon;
  /** Shown in the header bar from 1280px; everything is in the menu sheet below that. */
  desktop?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { view: 'home', label: 'Home', icon: Home, desktop: true },
  { view: 'assessment', label: 'Symptoms & Severity', icon: ClipboardList, desktop: true },
  { view: 'treatments', label: 'Treatments', icon: Layers, desktop: true },
  { view: 'learn', label: 'Learn Guides', icon: BookOpen, desktop: true },
  { view: 'expert-review', label: 'Expert Review', icon: FileText, desktop: true },
];

/** Hash views the router accepts (besides the empty hash for home). */
export const ROUTED_VIEWS: AppView[] = [
  'learn',
  'assessment',
  'leg-assessment',
  'treatments',
  'expert-review',
  'dashboard',
  'journey',
  'doppler',
  'specialists',
  'insurance',
  'research',
];

/** The 9 dedicated educational topics converted into independent pages */
export type LearnTopicSlug =
  | 'leg-circulation'
  | 'varicose-veins-causes'
  | 'symptoms'
  | 'dvt-warning-signs'
  | 'leg-pain'
  | 'ceap-stages'
  | 'did-you-know'
  | 'circulation-habits'
  | 'topic-explorer';

export interface LearnTopicConfig {
  slug: LearnTopicSlug;
  title: string;
  shortTitle: string;
  eyebrow: string;
  lede: string;
  description: string;
  badge: string;
  iconWebp: string;
  iconPng: string;
  primaryIllustration: IllustrationKey;
  secondaryIllustration?: IllustrationKey;
  tone: 'sage' | 'clay' | 'forest';
  legacyAnchor: string;
}

export const LEARN_TOPICS: LearnTopicConfig[] = [
  {
    slug: 'leg-circulation',
    title: 'How Leg Circulation Works: Venous Anatomy & Valves',
    shortTitle: 'How Leg Circulation Works',
    eyebrow: 'Venous Anatomy & Hemodynamics',
    lede: 'Understand how deep and superficial veins, one-way bicuspid valves, and the calf muscle pump return blood against gravity to your heart.',
    description: 'How one-way bicuspid valves and the calf muscle pump return blood against gravity to your heart.',
    badge: 'Anatomy guide',
    iconWebp: '/assets/icons2/mv-icon-vein-anatomy.webp',
    iconPng: '/assets/icons2/mv-icon-vein-anatomy.png',
    primaryIllustration: 'vein-anatomy',
    secondaryIllustration: 'valve-function',
    tone: 'forest',
    legacyAnchor: 'circulation-education',
  },
  {
    slug: 'varicose-veins-causes',
    title: 'Why Do Varicose Veins Develop? Causes & Risk Factors',
    shortTitle: 'Why Varicose Veins Develop',
    eyebrow: 'Etiology & Risk Factors',
    lede: 'Explore how genetic collagen predispositions (up to 90% risk), prolonged static standing in Indian professions, and tropical summer heat weaken venous walls.',
    description: 'The roles of genetics (up to 90% risk), prolonged standing jobs in India, and tropical climate load.',
    badge: 'Causes & risks',
    iconWebp: '/assets/icons2/mv-icon-varicose-veins.webp',
    iconPng: '/assets/icons2/mv-icon-varicose-veins.png',
    primaryIllustration: 'varicose-veins',
    secondaryIllustration: 'risk-factors',
    tone: 'clay',
    legacyAnchor: 'causes',
  },
  {
    slug: 'symptoms',
    title: 'Vein Symptoms: What Your Legs Are Telling You',
    shortTitle: 'Symptoms & Care Triggers',
    eyebrow: 'Clinical Symptom Recognition',
    lede: 'Learn to distinguish sensory leg sensations—evening heaviness, deep throbbing, and nocturnal cramps—from visible bulging varicose cords and skin discoloration.',
    description: 'Recognise heaviness, late-day ankle swelling, throbbing, cramps, and visible bulging vein cords.',
    badge: 'Symptom guide',
    iconWebp: '/assets/icons2/mv-icon-vein-anatomy.webp',
    iconPng: '/assets/icons2/mv-icon-vein-anatomy.png',
    primaryIllustration: 'varicose-veins',
    secondaryIllustration: 'vein-anatomy',
    tone: 'clay',
    legacyAnchor: 'symptoms',
  },
  {
    slug: 'dvt-warning-signs',
    title: 'Deep Vein Thrombosis (DVT) Warning Signs & Vein Myths',
    shortTitle: 'DVT Warning Signs & Myths',
    eyebrow: 'Urgent Clinical Safety',
    lede: 'Distinguish routine superficial varicose vein aching from acute deep vein blood clots requiring emergency hospital attention (Dial 112 / 108 in India).',
    description: 'Critical emergency signs requiring hospital care (Dial 112 / 108) versus routine superficial vein aching.',
    badge: 'Emergency safety',
    iconWebp: '/assets/icons2/mv-icon-emergency-warning.webp',
    iconPng: '/assets/icons2/mv-icon-emergency-warning.png',
    primaryIllustration: 'dvt-awareness',
    secondaryIllustration: 'risk-factors',
    tone: 'clay',
    legacyAnchor: 'dvt-safety',
  },
  {
    slug: 'leg-pain',
    title: 'Leg Pain Differential: Is It Veins, Muscles, or Nerves?',
    shortTitle: 'Vein Pain or Another Cause?',
    eyebrow: 'Differential Evaluation',
    lede: 'Learn how vascular clinicians differentiate chronic venous insufficiency from sciatica nerve compression, lumbar radiculopathy, and arterial claudication.',
    description: 'Distinguish vein pain from muscle fatigue, sciatica nerve compression, or peripheral arterial disease.',
    badge: 'Differential guide',
    iconWebp: '/assets/icons2/mv-icon-medical-reports.webp',
    iconPng: '/assets/icons2/mv-icon-medical-reports.png',
    primaryIllustration: 'medical-reports',
    secondaryIllustration: 'risk-factors',
    tone: 'sage',
    legacyAnchor: 'leg-pain-differential',
  },
  {
    slug: 'ceap-stages',
    title: 'Disease Progression: The CEAP Classification (C0 – C6)',
    shortTitle: 'CEAP Stages (C0 to C6)',
    eyebrow: 'Clinical Staging Standard',
    lede: 'Explore the international clinical classification standard from C1 spider veins through C3 ankle edema, C4 brown skin changes, and C6 active ulcers.',
    description: 'Follow the clinical progression from C1 spider veins to C3 swelling, C4 skin changes, and C6 ulcers.',
    badge: 'Clinical staging',
    iconWebp: '/assets/icons2/mv-icon-risk-factors.webp',
    iconPng: '/assets/icons2/mv-icon-risk-factors.png',
    primaryIllustration: 'risk-factors',
    secondaryIllustration: 'venous-reflux',
    tone: 'forest',
    legacyAnchor: 'progression',
  },
  {
    slug: 'did-you-know',
    title: 'Did You Know? The Science of Vein Health',
    shortTitle: 'Did You Know? Vein Science',
    eyebrow: 'Hemodynamic Facts & Evidence',
    lede: 'Evidence-backed physiological metrics, hydrostatic pressure dynamics, and clinical findings behind lower limb vascular circulation.',
    description: 'Evidence-backed metrics on hydrostatic pressure, standing work risks, and therapeutic elevation.',
    badge: 'Evidence facts',
    iconWebp: '/assets/icons2/mv-icon-research-library.webp',
    iconPng: '/assets/icons2/mv-icon-research-library.png',
    primaryIllustration: 'research-library',
    secondaryIllustration: 'valve-function',
    tone: 'sage',
    legacyAnchor: 'did-you-know',
  },
  {
    slug: 'circulation-habits',
    title: 'Everyday Habits for Healthier Circulation',
    shortTitle: 'Everyday Habits for Circulation',
    eyebrow: 'Conservative Self-Care',
    lede: 'Simple, clinician-approved daily habits: calf muscle pump activation, 15-minute evening leg elevation, and properly measured compression wear.',
    description: 'Simple routines: regular calf-pump activation, evening elevation, and properly fitted compression wear.',
    badge: 'Conservative care',
    iconWebp: '/assets/icons2/mv-icon-prevention.webp',
    iconPng: '/assets/icons2/mv-icon-prevention.png',
    primaryIllustration: 'compression-therapy',
    secondaryIllustration: 'valve-function',
    tone: 'forest',
    legacyAnchor: 'campaign',
  },
  {
    slug: 'topic-explorer',
    title: 'Vascular Topic Explorer & Learning Curriculum',
    shortTitle: 'Vascular Topic Explorer',
    eyebrow: 'Educational Curriculum Index',
    lede: 'An organized visual directory of all educational modules, interactive simulations, ultrasound guides, and evidence summaries across Meridian Vascular.',
    description: 'Browse the complete learning curriculum and access our full index of clinical educational resources.',
    badge: 'Full curriculum',
    iconWebp: '/assets/icons2/mv-icon-educational-guide.webp',
    iconPng: '/assets/icons2/mv-icon-educational-guide.png',
    primaryIllustration: 'educational-guide',
    secondaryIllustration: 'research-library',
    tone: 'sage',
    legacyAnchor: 'topic-explorer',
  },
];

export const LEARN_TOPIC_SLUGS = LEARN_TOPICS.map((t) => t.slug);

export function getLearnTopic(slug: string): LearnTopicConfig | undefined {
  return LEARN_TOPICS.find((t) => t.slug === slug);
}

export function hrefForLearnTopic(slug: LearnTopicSlug): string {
  return `#learn/${slug}`;
}

/**
 * In-page sections that can be linked with a plain `#id` (footer, learn contents, older links).
 * The router switches to the owning view or dedicated topic page, then scrolls the section into view.
 */
export const SECTION_VIEWS: Record<string, AppView> = {
  'topic-explorer': 'learn',
  'valve-simulation': 'learn',
  'learn-contents': 'learn',
  'research-articles': 'research',
  'research-labels': 'research',
  'research-sources': 'research',
  'circulation-education': 'learn',
  'what-are': 'learn',
  causes: 'learn',
  symptoms: 'learn',
  'dvt-safety': 'learn',
  'leg-pain-differential': 'learn',
  'leg-pain': 'learn',
  progression: 'learn',
  'did-you-know': 'learn',
  campaign: 'learn',
  'doppler-decoder': 'doppler',
  'doppler-education': 'doppler',
  'duplex-scan': 'doppler',
  'doppler-term-decoder-panel': 'doppler',
  'treatment-comparison': 'treatments',
  treatment: 'treatments',
  'degree-assessment': 'assessment',
  'leg-assessment': 'leg-assessment',
  'leg-severity': 'leg-assessment',
  'media-upload': 'assessment',
  'doctor-visit': 'specialists',
  'insurance-guide': 'insurance',
  'insurance-checklist': 'insurance',
  'expert-review': 'expert-review',
  'medical-reports': 'expert-review',
  'report-upload': 'expert-review',
  faq: 'home',
  'urgent-help': 'home',
  'explore-leg-health': 'home',
};

/** Maps legacy anchor IDs to the new dedicated topic slugs */
export const ANCHOR_TO_LEARN_SLUG: Record<string, LearnTopicSlug> = {
  'circulation-education': 'leg-circulation',
  'what-are': 'leg-circulation',
  causes: 'varicose-veins-causes',
  symptoms: 'symptoms',
  'dvt-safety': 'dvt-warning-signs',
  'leg-pain-differential': 'leg-pain',
  'leg-pain': 'leg-pain',
  progression: 'ceap-stages',
  'did-you-know': 'did-you-know',
  campaign: 'circulation-habits',
  'topic-explorer': 'topic-explorer',
  'learn-contents': 'topic-explorer',
};

/** Old footer anchors that never matched an element, mapped to the section they meant. */
export const SECTION_ALIASES: Record<string, string> = {
  'what-are': 'circulation-education',
  'leg-pain': 'leg-pain-differential',
};

/** document.title per view. */
export const VIEW_TITLES: Record<string, string> = {
  home: 'Varicose Veins Clinic & Education | Meridian Vascular',
  learn: 'Varicose Veins & Venous Circulation Guides | Meridian Vascular',
  research: 'Varicose Veins Clinical Library | Meridian Vascular',
  assessment: 'Varicose Vein Symptoms & Severity Assessment | Meridian Vascular',
  doppler: 'Venous Doppler Ultrasound & Scan Guide | Meridian Vascular',
  treatments: 'Modern Varicose Vein Treatments | Meridian Vascular',
  specialists: 'Vascular Consultation | Meridian Vascular',
  insurance: 'Insurance & Procedure Support | Meridian Vascular',
  journey: 'Varicose Veins Care Pathway | Meridian Vascular',
  dashboard: 'Patient Dashboard | Meridian Vascular',
  'leg-assessment': 'Understand Your Leg Symptoms & Expert Review | Meridian Vascular',
  'expert-review': 'Upload Medical Reports for Expert Review | Meridian Vascular',
};

export function hrefForView(view: AppView): string {
  return view === 'home' ? '#' : `#${view}`;
}
