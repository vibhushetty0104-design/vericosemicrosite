/**
 * Meridbot: the canonical 2.5D pose set and the demo content around the pre-written guide.
 *
 * Meridbot answers only from the pre-written catalogue in src/utils/clinicalGuidance.ts. The short
 * "thinking" pause in the demo is simulated and labelled as such; nothing is searched, retrieved
 * or generated live. Sources listed for a topic were linked by the demo team, not found at runtime.
 */
import type { AppView } from '../types';
import type { GuideIntentId } from '../utils/clinicalGuidance';

export type MeridbotPose = 'idle' | 'blink' | 'thinking' | 'present' | 'wave' | 'happy' | 'standing-happy';

/** Canonical 2.5D set (public/assets/meridbot-25d). All poses share one canvas and registration. */
export const MERIDBOT_POSES: Record<MeridbotPose, string> = {
  idle: '/assets/meridbot-25d/meridbot-idle.png',
  blink: '/assets/meridbot-25d/meridbot-blink.png',
  thinking: '/assets/meridbot-25d/meridbot-thinking.png',
  present: '/assets/meridbot-25d/meridbot-present.png',
  wave: '/assets/meridbot-25d/meridbot-wave.png',
  happy: '/assets/meridbot-25d/meridbot-happy.png',
  'standing-happy': '/assets/meridbot-25d/meridbot-standing-happy.png',
};

export const MERIDBOT_LABELS = {
  name: 'Meridbot',
  role: 'Educational guide · demo',
  processing: 'Choosing a pre-written answer (simulated)',
  processingNote: 'This short pause is a demo effect. Answers are pre-written; nothing is searched or generated live.',
  sourcesHeading: 'Related sources',
  sourcesNote: 'Linked to this topic by the demo team, not retrieved live. The answer text has not been clinically reviewed.',
  noSources: 'No source is linked to this answer yet.',
  explainSimply: 'Explain this simply',
  simpleBadge: 'Plain-language version · pre-written',
  pat: 'Give Meridbot a pat',
  patCooling: 'Meridbot is still enjoying that',
} as const;

export interface IntentExtras {
  simple: string;
  sources: string[];
}

export const INTENT_EXTRAS: Record<GuideIntentId, IntentExtras> = {
  emergency: {
    simple:
      'Some leg symptoms can mean a blood clot. If one leg suddenly swells or hurts, or you have chest pain or trouble breathing, call 112 or 108 now.',
    sources: ['nhs-dvt'],
  },
  'safety-refusal': {
    simple: 'Meridbot can only share general information. It can’t prescribe, diagnose or tell you what to do about your own health.',
    sources: [],
  },
  'negative-dvt-scan': {
    simple: 'A scan that shows no clot describes that moment. New or worse symptoms still need a doctor.',
    sources: ['nhs-dvt'],
  },
  'possible-dvt': {
    simple: 'Some words on a scan report can describe a clot. That needs a doctor’s advice today, not later.',
    sources: ['nhs-dvt'],
  },
  'doppler-terms': {
    simple:
      'A Doppler report describes which way blood moves in your leg veins and whether some of it flows backward. Your doctor explains what your own numbers mean.',
    sources: ['nice-cg168', 'esvs-2022'],
  },
  'treatment-options': {
    simple: 'Most treatments close or remove the faulty vein so blood uses healthy veins instead. Your specialist helps choose what suits you.',
    sources: ['nice-cg168', 'nhs-varicose'],
  },
  'wound-or-bleeding': {
    simple:
      'A sore that won’t heal, or a vein that bleeds, needs a doctor soon. If bleeding is heavy and won’t stop with firm pressure and your leg raised, get emergency help.',
    sources: ['nhs-varicose', 'nice-cg168'],
  },
  'swelling-or-skin-changes': {
    simple: 'Swelling and brown skin near the ankle can mean leg veins have been struggling for a while. A doctor can check the cause.',
    sources: ['nhs-varicose'],
  },
  'spider-veins': {
    simple: 'Spider veins are tiny, thread-like veins you can see near the skin. A doctor can check whether bigger veins are involved.',
    sources: ['medlineplus-varicose'],
  },
  'general-vein-symptoms': {
    simple: 'Heavy, achy legs that feel better with your feet up are common with vein problems. A doctor can check what is going on.',
    sources: ['nhs-varicose', 'medlineplus-varicose'],
  },
  'assessment-tool': {
    simple: 'The 3-minute assessment helps you organize your symptoms and prepare notes for your vein specialist.',
    sources: ['nice-cg168'],
  },
  'expert-review-info': {
    simple: 'You can submit Doppler reports and clinical photos for review by qualified vascular specialists.',
    sources: ['nice-cg168'],
  },
  'booking-info': {
    simple: 'Schedule an in-person vascular exam and standing duplex scan at our clinic.',
    sources: [],
  },
  unmatched: {
    simple: 'Meridbot only has pre-written answers on a few topics. Try one of the suggestions, or ask a doctor.',
    sources: [],
  },
};

/** Contextual prompts per page. Each one is matched by a pre-written answer (checked in tests). */
export const PAGE_PROMPTS: Partial<Record<AppView, string[]>> & { default: string[] } = {
  default: [
    'Why do my legs feel heavy by the evening?',
    'What does reflux on a Doppler report mean?',
    'When is leg swelling an emergency?',
  ],
  learn: ['Why do my legs feel heavy by the evening?', 'What are spider veins?', 'When is leg swelling an emergency?'],
  research: ['What does reflux on a Doppler report mean?', 'When is leg swelling an emergency?', 'What are spider veins?'],
  assessment: [
    'Why do my legs feel heavy by the evening?',
    'What do swelling and brown skin near the ankle mean?',
    'When is leg swelling an emergency?',
  ],
  doppler: [
    'What does reflux on a Doppler report mean?',
    'What does SFJ reflux mean on my Doppler report?',
    'My scan said no DVT, what does that mean?',
  ],
  treatments: [
    'How do laser (EVLA), radiofrequency and VenaSeal treatments differ?',
    'What do swelling and brown skin near the ankle mean?',
    'When is leg swelling an emergency?',
  ],
  specialists: [
    'How do laser (EVLA), radiofrequency and VenaSeal treatments differ?',
    'What does reflux on a Doppler report mean?',
    'When is leg swelling an emergency?',
  ],
};

export function promptsFor(view: AppView | undefined): string[] {
  return (view && PAGE_PROMPTS[view]) || PAGE_PROMPTS.default;
}
