import React from 'react';
import { Phone, AlertTriangle } from 'lucide-react';
import {
  EMERGENCY_NUMBERS,
  EMERGENCY_REGION,
  EMERGENCY_WARNING_SIGNS,
  OUTSIDE_REGION_NOTE,
} from '../data/emergencyContacts';

interface EmergencyGuidanceProps {
  heading?: string;
  intro?: string;
  className?: string;
}

export const EmergencyGuidance: React.FC<EmergencyGuidanceProps> = ({
  heading = 'When to call emergency services',
  intro = 'Do not wait for an appointment or finish this tool if you have any of these:',
  className = '',
}) => (
  <div
    role="alert"
    className={`p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs sm:text-sm ${className}`}
  >
    <div className="flex items-start gap-2.5">
      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="space-y-2">
        <strong className="block text-rose-800">{heading}</strong>
        <p className="leading-relaxed">{intro}</p>
        <ul className="list-disc pl-4 space-y-0.5 leading-relaxed">
          {EMERGENCY_WARNING_SIGNS.map((sign) => (
            <li key={sign}>{sign}</li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="font-semibold">In {EMERGENCY_REGION}, call:</span>
          {EMERGENCY_NUMBERS.map((n) => (
            <a
              key={n.number}
              href={`tel:${n.number}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-bold focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-1"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{n.number}</span>
              <span className="font-normal text-white/90">· {n.label}</span>
            </a>
          ))}
        </div>
        <p className="text-[11px] text-rose-900/80 leading-relaxed">{OUTSIDE_REGION_NOTE}</p>
      </div>
    </div>
  </div>
);
