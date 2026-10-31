import React from 'react';
import { Phone, ShieldAlert } from 'lucide-react';
import { EMERGENCY_NUMBERS } from '../data/emergencyContacts';

interface UrgentHelpProps {
  /** "strip" is the home-page band under the hero; "compact" sits at the top of the menu sheet. */
  variant?: 'strip' | 'compact';
  /** Called before following the "all warning signs" link (the menu sheet closes itself). */
  onNavigate?: () => void;
}

// Short visible labels keep both buttons on one row at 320px; the full description is read out too.
const CALL_LABELS: Record<string, string> = {
  '112': 'Call 112',
  '108': 'Ambulance 108',
};

/**
 * Static urgent-signs notice with tap-to-call links. It always sits in normal page flow and is
 * never placed inside an accordion, tab, carousel or animation (DESIGN.md "Notice").
 */
export const UrgentHelp: React.FC<UrgentHelpProps> = ({ variant = 'strip', onNavigate }) => {
  const isStrip = variant === 'strip';
  const Heading = isStrip ? 'h2' : 'p';

  const content = (
    <div className={`flex items-start ${isStrip ? 'gap-3' : 'gap-2'}`}>
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-mv-danger" strokeWidth={1.75} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {/* Signs and call buttons come first so they reach the first screen on small phones. */}
        <Heading id={isStrip ? 'urgent-help-title' : undefined} className="max-w-[34rem] text-[16px] font-semibold leading-snug text-mv-danger">
          Sudden swelling, pain or warmth in one leg, chest pain or sudden breathlessness?
        </Heading>
        <div className="mt-2 flex flex-wrap gap-2">
          {EMERGENCY_NUMBERS.map((n) => (
            <a
              key={n.number}
              href={`tel:${n.number}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-mv-danger px-4 text-[15px] font-semibold text-white underline-offset-2 hover:underline"
            >
              <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span>{CALL_LABELS[n.number] ?? `Call ${n.number}`}</span>
              <span className="sr-only">: call {n.number}, {n.label}</span>
            </a>
          ))}
        </div>
        {isStrip ? (
          <p className="mt-2 max-w-[34rem] text-[15px] leading-relaxed text-mv-danger">
            These can be signs of a blood clot or another emergency. Get emergency care now, not an
            appointment or an online tool. Numbers are for India; elsewhere, call your local emergency
            number. If you&rsquo;re unsure, go to the nearest emergency department.
          </p>
        ) : (
          <p className="mt-2 text-[14px] leading-relaxed text-mv-danger">
            Get emergency care now. Numbers are for India; elsewhere, call your local emergency number
            or go to the nearest emergency department.
          </p>
        )}
        <a
          href="#dvt-safety"
          onClick={onNavigate}
          className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-mv-danger underline underline-offset-2"
        >
          All warning signs
        </a>
      </div>
    </div>
  );

  if (!isStrip) {
    return <div className="rounded-xl border border-mv-danger/25 bg-mv-danger-surface p-3">{content}</div>;
  }

  return (
    <section
      id="urgent-help"
      aria-labelledby="urgent-help-title"
      data-urgent
      className="border-b border-mv-danger/20 bg-mv-danger-surface"
    >
      <div className="container-page max-w-[1200px] py-3 sm:py-5">{content}</div>
    </section>
  );
};
