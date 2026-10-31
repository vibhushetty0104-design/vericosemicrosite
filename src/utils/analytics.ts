/**
 * ClearPix Privacy-Conscious Analytics Dispatcher
 *
 * Strict Privacy Architecture:
 * - Zero third-party trackers or external analytics services.
 * - Zero cookies created or read (document.cookie is never touched).
 * - Zero PII (Personally Identifiable Information) collected or transmitted.
 * - Scoped strictly to the active browser session via sessionStorage (with in-memory fallback).
 *   Nothing persists after the browser tab is closed.
 * - Emits lightweight DOM CustomEvents ('clearpix:analytics') for test inspection.
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'hero_primary_cta_click'     // Intent A: Symptom Screener
  | 'hero_secondary_cta_click'   // Intent B: Doppler Decoder
  | 'screener_started'
  | 'screener_question_answered'
  | 'screener_completed'
  | 'pdf_report_downloaded'
  | 'doppler_term_inspected'
  | 'doppler_simulation_toggled'
  | 'treatment_tab_viewed'
  | 'specialist_filter_changed'
  | 'dossier_question_toggled'
  | 'simulated_booking_opened'
  | 'simulated_booking_submitted'
  | 'ai_guide_opened'
  | 'ai_guide_prompt_sent';

export interface AnalyticsEvent {
  event: AnalyticsEventType;
  timestamp: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
}

export interface FunnelSummary {
  screenerStarts: number;
  screenerCompletions: number;
  dopplerInspections: number;
  specialistSearches: number;
  simulatedBookings: number;
  conversionRateScreenerToBooking: string;
}

const SESSION_STORAGE_KEY = 'clearpix_session_analytics_v1';
const MAX_EVENTS_STORED = 60;

// In-memory fallback if sessionStorage is disabled or restricted
const memoryLog: AnalyticsEvent[] = [];

/**
 * Dispatches an event without storing any personal health data.
 * Persists solely within the current browser tab session.
 */
export function trackEvent(
  event: AnalyticsEventType,
  properties?: Record<string, string | number | boolean | null | undefined>
): void {
  const payload: AnalyticsEvent = {
    event,
    timestamp: new Date().toISOString(),
    properties: sanitizeProperties(properties),
  };

  // 1. In-memory buffer
  memoryLog.push(payload);
  if (memoryLog.length > MAX_EVENTS_STORED) {
    memoryLog.shift();
  }

  // 2. Sync to sessionStorage (session-only; discarded on tab close)
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const list: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
      list.push(payload);
      if (list.length > MAX_EVENTS_STORED) {
        list.splice(0, list.length - MAX_EVENTS_STORED);
      }
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // Gracefully handle sandboxed environments or private browsing restrictions
  }

  // 3. Dispatch DOM CustomEvent for browser testing and inspection
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      const customEvt = new CustomEvent('clearpix:analytics', { detail: payload });
      window.dispatchEvent(customEvt);
    } catch {
      // Ignore in non-DOM environments
    }
  }
}

/**
 * Sanitizes properties to strictly exclude personal names, phone numbers, emails, or freeform notes.
 */
function sanitizeProperties(
  props?: Record<string, string | number | boolean | null | undefined>
): Record<string, string | number | boolean | null | undefined> {
  if (!props) return {};
  const cleaned: Record<string, string | number | boolean | null | undefined> = {};

  for (const [key, value] of Object.entries(props)) {
    // Explicitly exclude any PII fields
    if (/name|phone|email|notes|address/i.test(key)) {
      continue;
    }
    // Truncate strings to prevent unintended text payloads
    if (typeof value === 'string' && value.length > 80) {
      cleaned[key] = value.slice(0, 77) + '...';
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Computes live conversion metrics for user funnel performance within this session.
 */
export function getFunnelMetrics(): FunnelSummary {
  let events = memoryLog;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        events = JSON.parse(stored);
      }
    }
  } catch {
    events = memoryLog;
  }

  const screenerStarts = events.filter((e) => e.event === 'screener_started').length;
  const screenerCompletions = events.filter((e) => e.event === 'screener_completed').length;
  const dopplerInspections = events.filter((e) => e.event === 'doppler_term_inspected').length;
  const specialistSearches = events.filter((e) => e.event === 'specialist_filter_changed').length;
  const simulatedBookings = events.filter((e) => e.event === 'simulated_booking_submitted').length;

  const convRate =
    screenerStarts > 0
      ? ((simulatedBookings / screenerStarts) * 100).toFixed(1) + '%'
      : '0.0%';

  return {
    screenerStarts,
    screenerCompletions,
    dopplerInspections,
    specialistSearches,
    simulatedBookings,
    conversionRateScreenerToBooking: convRate,
  };
}
