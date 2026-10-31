/**
 * Fictional, client-side demo session for the stakeholder demo.
 *
 * Nothing here authenticates anyone or leaves the browser: no SMS is sent, no WhatsApp message is
 * sent, and no clinic receives anything. The demo patient ID is random and never derived from a
 * name, birth date or phone number. See docs/demo-boundary.md for what a real service would need.
 */
import type { DemoRequestSummary } from '../components/AppointmentModal';

const ID_KEY = 'mv-demo-patient-id';
const SESSION_KEY = 'mv-demo-signed-in';
const REQUESTS_KEY = 'mv-demo-requests';

// Crockford-style alphabet without easily confused characters (no I, L, O, U, 0, 1).
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';

function randomChars(n: number): string {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

const safeGet = (store: Storage | undefined, key: string): string | null => {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
};
const safeSet = (store: Storage | undefined, key: string, value: string) => {
  try {
    store?.setItem(key, value);
  } catch {
    /* storage unavailable: the demo still works for this page view */
  }
};
const local = () => (typeof window !== 'undefined' ? window.localStorage : undefined);
const session = () => (typeof window !== 'undefined' ? window.sessionStorage : undefined);

/** Stable for this browser across demo sign-ins; random and non-identifying. */
export function getDemoPatientId(): string {
  const existing = safeGet(local(), ID_KEY);
  if (existing && /^MV-DEMO-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(existing)) return existing;
  const id = `MV-DEMO-${randomChars(4)}-${randomChars(4)}`;
  safeSet(local(), ID_KEY, id);
  return id;
}

export function isDemoSignedIn(): boolean {
  return safeGet(session(), SESSION_KEY) === '1';
}
export function setDemoSignedIn(on: boolean) {
  if (on) safeSet(session(), SESSION_KEY, '1');
  else {
    try {
      session()?.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }
}

/** Six-digit demo code, shown on screen because no SMS is sent. */
export function createDemoOtp(): string {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(100000 + (bytes[0] % 900000));
}

export interface DemoRequest {
  id: string;
  summary: DemoRequestSummary;
  createdAt: number;
  /** Seeded example so the portal is never empty during a presentation. */
  sample?: boolean;
}

export type DemoRequestStage = 0 | 1 | 2;

export const DEMO_REQUEST_STAGES = [
  'Request created (demo)',
  'Shared with the clinic (simulated)',
  'Clinic replied (simulated)',
] as const;

/** Simulated progress: stages advance on timers while the portal is open. */
export function stageFor(req: DemoRequest, now: number): DemoRequestStage {
  if (req.sample) return 2;
  const s = (now - req.createdAt) / 1000;
  return s < 6 ? 0 : s < 14 ? 1 : 2;
}

export function createDemoRequest(summary: DemoRequestSummary): DemoRequest {
  return { id: `MV-DEMO-REQ-${randomChars(4)}`, summary, createdAt: Date.now() };
}

export function loadDemoRequests(): DemoRequest[] {
  try {
    const raw = safeGet(session(), REQUESTS_KEY);
    return raw ? (JSON.parse(raw) as DemoRequest[]) : [];
  } catch {
    return [];
  }
}
export function saveDemoRequests(list: DemoRequest[]) {
  safeSet(session(), REQUESTS_KEY, JSON.stringify(list));
}

export const SAMPLE_REQUEST: DemoRequest = {
  id: 'MV-DEMO-REQ-SAMPLE',
  sample: true,
  createdAt: 0,
  summary: {
    doctorName: 'Dr. Arvind Rao',
    modality: 'in-person',
    consultationType: 'Comprehensive Venous Duplex Ultrasound & Clinical Consultation',
    location: 'Bengaluru (demo listing, no real clinic address)',
    timing: 'Sample time: Tuesday, morning',
  },
};
