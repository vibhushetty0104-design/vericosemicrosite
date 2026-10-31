/**
 * Emergency contact numbers shown alongside urgent symptom guidance.
 *
 * The site is localized for India, so Indian numbers are listed first. Visitors elsewhere
 * are told to use their own local emergency number rather than being shown a wrong one.
 */

export interface EmergencyNumber {
  number: string;
  label: string;
}

export const EMERGENCY_REGION = 'India';

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { number: '112', label: 'National emergency number' },
  { number: '108', label: 'Emergency ambulance (most states)' },
];

export const OUTSIDE_REGION_NOTE =
  'Outside India, call your local emergency number (for example 911 in the US and Canada, 999 in the UK, or 112 in the EU).';

export const EMERGENCY_WARNING_SIGNS: string[] = [
  'Chest pain, sudden shortness of breath, or coughing up blood',
  'Sudden swelling, pain, warmth or redness in one leg',
  'Heavy bleeding from a vein that does not stop with firm pressure and leg elevation',
];

export function formatEmergencyNumbers(): string {
  return EMERGENCY_NUMBERS.map((n) => n.number).join(' / ');
}
