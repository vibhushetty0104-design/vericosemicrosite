/**
 * User-facing names for the educational guide.
 *
 * The guide answers from pre-written rules (src/utils/clinicalGuidance.ts); no language model is
 * involved, so nothing here may describe it as AI. Keep every guide label in this file so the
 * wording stays consistent across entry points.
 */
export { MessageCircleQuestion as GuideIcon } from 'lucide-react';

export const GUIDE_LABELS = {
  /** Short feature name, used in navigation and message headers. */
  name: 'Educational guide',
  /** Title of the guide panel. */
  panelTitle: 'Meridian Vascular educational guide',
  /** Badge shown on every guide answer. */
  responseSource: 'Pre-written guidance',
  /** Generic entry-point button. */
  ask: 'Ask the guide',
  /** Accessible name for buttons that only open the guide. */
  open: 'Open the educational guide',
  /** Contextual entry point next to a topic, finding or treatment. */
  askAboutThis: 'Ask the guide about this',
} as const;

/** Contextual entry-point label, e.g. "Ask the guide about recovery". */
export function askGuideAbout(topic: string): string {
  return `Ask the guide about ${topic}`;
}
