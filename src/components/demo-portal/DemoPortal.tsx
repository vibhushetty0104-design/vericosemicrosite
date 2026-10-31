import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, CheckCheck, Clock, KeyRound, LogOut, MessageSquare, ShieldCheck, Smartphone } from 'lucide-react';
import {
  DEMO_REQUEST_STAGES,
  DemoRequest,
  SAMPLE_REQUEST,
  createDemoOtp,
  getDemoPatientId,
  stageFor,
} from '../../demo/demoSession';
import { Meridbot } from '../meridbot/Meridbot';

/*
 * Fictional patient portal flows for the stakeholder demo. Every state is labelled. No SMS,
 * WhatsApp message, booking or record is created; everything stays in this browser.
 */

const OTP_TTL_S = 300;
const RESEND_AFTER_S = 30;
const MAX_ATTEMPTS = 3;

const DemoBanner: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="flex items-start gap-2 rounded-xl bg-mv-warning-surface p-3 text-[14px] leading-relaxed text-mv-warning">
    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
    <span>{children}</span>
  </p>
);

export const DemoSignIn: React.FC<{ onSignedIn: () => void }> = ({ onSignedIn }) => {
  const id = useId();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [code, setCode] = useState('');
  const [expected, setExpected] = useState('');
  const [issuedAt, setIssuedAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [codeError, setCodeError] = useState('');
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 'code') return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (step === 'code') codeRef.current?.focus();
  }, [step]);

  const elapsed = Math.floor((now - issuedAt) / 1000);
  const remaining = Math.max(0, OTP_TTL_S - elapsed);
  const expired = step === 'code' && remaining === 0;
  const locked = attempts >= MAX_ATTEMPTS;
  const canResend = elapsed >= RESEND_AFTER_S || expired || locked;

  const issueCode = () => {
    setExpected(createDemoOtp());
    setIssuedAt(Date.now());
    setNow(Date.now());
    setAttempts(0);
    setCode('');
    setCodeError('');
  };

  const submitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      setPhoneError('Enter a 10-digit mobile number (any digits work in this demo).');
      return;
    }
    setPhoneError('');
    issueCode();
    setStep('code');
  };

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (expired) {
      setCodeError('This demo code has expired. Send a new one.');
      return;
    }
    if (locked) return;
    if (code.trim() === expected) {
      onSignedIn();
      return;
    }
    const left = MAX_ATTEMPTS - attempts - 1;
    setAttempts((a) => a + 1);
    setCodeError(left > 0 ? `That code doesn’t match. ${left} ${left === 1 ? 'try' : 'tries'} left.` : 'Too many tries. Send a new demo code.');
  };

  const mmss = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;

  return (
    <section aria-labelledby={`${id}-title`} className="bg-mv-ivory py-12 lg:py-16">
      <div className="container-page grid max-w-[1000px] items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="inline-block rounded-full bg-mv-warning-surface px-2.5 py-1 text-[13px] font-semibold text-mv-warning">Demo sign-in · fictional</p>
          <h1 id={`${id}-title`} className="mt-3 font-serif text-[32px] font-semibold leading-tight text-mv-forest sm:text-[40px]">
            Your patient portal
          </h1>
          <p className="mt-3 max-w-[30rem] text-[17px] leading-relaxed text-mv-ink-muted">
            See your saved questions, symptom summary and appointment requests in one place. In this demo, sign-in is simulated: no text message is sent and no account is created.
          </p>
          <div className="mt-6 hidden md:block">
            <Meridbot pose="present" height={150} />
          </div>
        </div>

        <div className="rounded-[20px] border border-mv-outline bg-mv-surface p-5 sm:p-7">
          {step === 'phone' ? (
            <form onSubmit={submitPhone} noValidate>
              <h2 className="flex items-center gap-2 font-serif text-[22px] font-semibold text-mv-forest">
                <Smartphone className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" /> Sign in with a code
              </h2>
              <label htmlFor={`${id}-phone`} className="mt-5 block text-[15px] font-semibold text-mv-ink">
                Mobile number <span className="font-normal text-mv-ink-muted">(required)</span>
              </label>
              <div className="mt-1.5 flex gap-2">
                <span className="inline-flex min-h-[48px] items-center rounded-lg border border-mv-outline-strong bg-mv-ivory px-3 text-[16px] text-mv-ink-muted">+91</span>
                <input
                  id={`${id}-phone`}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="off"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={!!phoneError}
                  aria-describedby={`${id}-phone-help${phoneError ? ` ${id}-phone-err` : ''}`}
                  className="min-h-[48px] w-full rounded-lg border border-mv-outline-strong px-3 text-[16px] text-mv-ink"
                />
              </div>
              <p id={`${id}-phone-help`} className="mt-1.5 text-[14px] text-mv-ink-muted">
                Demo only. Please don’t enter your real number; nothing is sent or stored.
              </p>
              <button type="button" onClick={() => setPhone('99999 99999')} className="mt-1 inline-flex min-h-[44px] items-center text-[14px] font-semibold text-mv-forest underline underline-offset-2">
                Use a sample number
              </button>
              {phoneError && (
                <p id={`${id}-phone-err`} role="alert" className="mt-1 text-[14px] font-semibold text-mv-danger">
                  {phoneError}
                </p>
              )}
              <button type="submit" className="mv-btn mv-btn-primary mt-5 w-full">
                Send demo code
              </button>
            </form>
          ) : (
            <form onSubmit={submitCode} noValidate>
              <h2 className="flex items-center gap-2 font-serif text-[22px] font-semibold text-mv-forest">
                <KeyRound className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" /> Enter the 6-digit code
              </h2>
              <div className="mt-4">
                <DemoBanner>
                  No text message was sent. Your demo code is <strong className="font-mono text-[16px] tracking-[0.2em]">{expected}</strong>
                </DemoBanner>
              </div>
              <label htmlFor={`${id}-code`} className="mt-5 block text-[15px] font-semibold text-mv-ink">
                Code
              </label>
              <input
                ref={codeRef}
                id={`${id}-code`}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                aria-invalid={!!codeError}
                aria-describedby={`${id}-code-help${codeError ? ` ${id}-code-err` : ''}`}
                disabled={locked}
                className="mt-1.5 min-h-[48px] w-full rounded-lg border border-mv-outline-strong px-3 text-[20px] tracking-[0.4em] text-mv-ink disabled:bg-mv-outline"
              />
              <p id={`${id}-code-help`} className="mt-1.5 flex items-center gap-1.5 text-[14px] text-mv-ink-muted" aria-live="off">
                <Clock className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                {expired ? 'Code expired' : `Expires in ${mmss}`} · single use · {MAX_ATTEMPTS} tries
              </p>
              {codeError && (
                <p id={`${id}-code-err`} role="alert" className="mt-1 text-[14px] font-semibold text-mv-danger">
                  {codeError}
                </p>
              )}
              <button type="submit" disabled={locked || code.length !== 6} className="mv-btn mv-btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:border-mv-outline-strong disabled:bg-mv-outline disabled:text-mv-ink-muted">
                Sign in (demo)
              </button>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <button type="button" onClick={() => setStep('phone')} className="inline-flex min-h-[44px] items-center text-[14px] font-semibold text-mv-forest underline underline-offset-2">
                  Change number
                </button>
                <button
                  type="button"
                  onClick={issueCode}
                  disabled={!canResend}
                  className="inline-flex min-h-[44px] items-center text-[14px] font-semibold text-mv-forest underline underline-offset-2 disabled:no-underline disabled:text-mv-ink-muted"
                >
                  {canResend ? 'Send a new demo code' : `New code in ${RESEND_AFTER_S - elapsed}s`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Ticks: React.FC<{ state: 0 | 1 | 2 }> = ({ state }) => {
  const label = ['Sent', 'Delivered', 'Read'][state];
  const Icon = state === 0 ? Check : CheckCheck;
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] ${state === 2 ? 'font-semibold text-mv-forest' : 'text-mv-ink-muted'}`}>
      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      {label} <span className="sr-only">(simulated)</span>
    </span>
  );
};

/** Simulated delivery state of message i: sent, then delivered after 1 s, read after 3 s. */
const MESSAGE_AT_S = [0, 6, 14];
function tickState(req: DemoRequest, i: number, now: number): 0 | 1 | 2 {
  if (req.sample) return 2;
  const age = now - (req.createdAt + MESSAGE_AT_S[i] * 1000);
  return age < 1000 ? 0 : age < 3000 ? 1 : 2;
}

const RequestCard: React.FC<{ req: DemoRequest; now: number; patientId: string }> = ({ req, now, patientId }) => {
  const stage = stageFor(req, now);
  const doctor = req.summary.doctorName;
  const messages = [
    `Meridian Vascular (demo): we've received your request to see ${doctor}. Your demo reference is ${req.id}.`,
    `Meridian Vascular (demo): your request has been shared with the clinic. They usually reply within a working day.`,
    `Meridian Vascular (demo): the clinic has replied with a sample time (Tuesday morning). Reply in the portal to accept or ask for another time.`,
  ];
  const ago = (i: number) => (req.sample ? 'Sample' : i === 0 ? 'Just now' : 'Simulated');
  return (
    <li className="rounded-[20px] border border-mv-outline bg-mv-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-serif text-[20px] font-semibold text-mv-forest">{doctor}</p>
          <p className="text-[14px] text-mv-ink-muted">
            Demo profile · fictional · {req.summary.modality === 'in-person' ? 'In-clinic visit' : 'Video consultation'}
          </p>
        </div>
        <span className="rounded-full bg-mv-warning-surface px-2.5 py-1 text-[12px] font-semibold text-mv-warning">
          {req.sample ? 'Sample request (demo data)' : 'Demo request'}
        </span>
      </div>
      <p className="mt-2 text-[14px] text-mv-ink-muted">
        Reference <span className="font-mono text-mv-ink">{req.id}</span> · Patient ID <span className="font-mono text-mv-ink">{patientId}</span>
      </p>

      <ol className="mt-4 grid gap-2 sm:grid-cols-3" aria-label="Request status (simulated)">
        {DEMO_REQUEST_STAGES.map((label, i) => (
          <li
            key={label}
            aria-current={stage === i ? 'step' : undefined}
            className={`rounded-xl border px-3 py-2 text-[14px] ${
              i <= stage ? 'border-mv-forest bg-mv-pale font-semibold text-mv-forest' : 'border-mv-outline text-mv-ink-muted'
            }`}
          >
            <span className="mr-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-mv-surface text-[13px]" aria-hidden="true">
              {i < stage ? <Check className="h-4 w-4" strokeWidth={2} /> : i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <div className="mt-4 rounded-[16px] bg-mv-ivory p-3">
        <p className="flex items-center gap-2 text-[14px] font-semibold text-mv-ink">
          <MessageSquare className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> WhatsApp message preview
        </p>
        <p className="mt-0.5 text-[13px] text-mv-warning">Simulated preview: no WhatsApp message was sent. A real service would ask for your consent first.</p>
        <ul className="mt-3 space-y-2">
          {messages.slice(0, stage + 1).map((m, i) => (
            <li key={i} className="max-w-[34rem] rounded-[14px] rounded-tl-[4px] bg-mv-surface px-3 py-2 text-[14px] leading-relaxed text-mv-ink ring-1 ring-mv-outline">
              {m}
              <span className="mt-1 flex items-center justify-end gap-2 text-[12px] text-mv-ink-muted">
                {ago(i)}
                <Ticks state={tickState(req, i, now)} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export const DemoPortalHeader: React.FC<{ requests: DemoRequest[]; onSignOut: () => void; onRequest: () => void }> = ({
  requests,
  onSignOut,
  onRequest,
}) => {
  const [patientId] = useState(getDemoPatientId);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const list = requests.length ? requests : [SAMPLE_REQUEST];

  return (
    <section aria-labelledby="portal-title" className="border-b border-mv-outline bg-mv-ivory py-10 lg:py-14">
      <div className="container-page max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-mv-pale">
              <Meridbot pose="wave" height={96} />
            </span>
            <div>
              <p className="inline-block rounded-full bg-mv-warning-surface px-2.5 py-1 text-[13px] font-semibold text-mv-warning">Demo patient · fictional</p>
              <h1 id="portal-title" className="mt-2 font-serif text-[32px] font-semibold leading-tight text-mv-forest sm:text-[40px]">
                Welcome back
              </h1>
            </div>
          </div>
          <div className="rounded-[16px] border border-mv-outline bg-mv-surface p-4">
            <p className="text-[13px] font-semibold text-mv-ink-muted">Demo patient ID</p>
            <p className="mt-0.5 font-mono text-[20px] tracking-wider text-mv-forest">{patientId}</p>
            <p className="mt-1 max-w-[17rem] text-[13px] leading-snug text-mv-ink-muted">Random and stored only in this browser. Not linked to your name, birth date or phone.</p>
            <button type="button" onClick={onSignOut} className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-mv-forest underline underline-offset-2">
              <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Sign out (demo)
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-serif text-[26px] font-semibold text-mv-forest">Appointment requests</h2>
          <button type="button" onClick={onRequest} className="mv-btn mv-btn-secondary">
            New request (demo)
          </button>
        </div>
        <p className="mt-1 max-w-[40rem] text-[15px] text-mv-ink-muted">
          Statuses below are simulated on a timer to show how updates would look. No clinic receives these requests.
        </p>
        <ul className="mt-5 space-y-4">
          {list.map((r) => (
            <RequestCard key={r.id} req={r} now={now} patientId={patientId} />
          ))}
        </ul>
      </div>
    </section>
  );
};
