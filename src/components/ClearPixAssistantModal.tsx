import React, { useState, useRef, useEffect } from 'react';
import { AppView, AssistantMessage } from '../types';
import { trackEvent } from '../utils/analytics';
import { generateFallbackGuidance, describeGuidanceSource, GuideIntentId } from '../utils/clinicalGuidance';
import { useAccessibleDialog } from '../utils/useAccessibleDialog';
import { EmergencyGuidance } from './EmergencyGuidance';
import { formatEmergencyNumbers } from '../data/emergencyContacts';
import { GUIDE_LABELS } from '../content/guideLabels';
import { INTENT_EXTRAS, MERIDBOT_LABELS, MeridbotPose } from '../content/meridbot';
import { SOURCES, STATUS_LABELS } from '../content/research/sources';
import { Meridbot } from './meridbot/Meridbot';
import { Send, X, RotateCcw, Calendar, ExternalLink, ChevronDown, BookOpen, ArrowRight } from 'lucide-react';

/*
 * Meridbot, the educational guide (stakeholder demo). Answers come from the local pre-written
 * catalogue; nothing is sent to a server or an external service. The short "thinking" pause is a
 * labelled demo effect and is skipped for emergency answers so safety information is never delayed.
 */

interface ClearPixAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  onSelectBooking: () => void;
  /** Page the guide was opened from, for contextual navigation. */
  context?: AppView;
  onNavigateView?: (view: AppView) => void;
}

const WELCOME_TEXT =
  "Hello! I'm Meridbot. I can help you explore information about varicose veins, symptoms, treatment options and navigating this website.";

const ANSWER_TYPE: Record<NonNullable<AssistantMessage['urgencyLevel']>, string> = {
  'Routine Consultation': 'General information',
  'Priority Evaluation': 'See a doctor soon',
  'Urgent Medical Attention': 'Emergency signs',
};

const SUGGESTED_CHIPS = [
  'What are varicose veins?',
  'What symptoms should I look for?',
  'What treatments are available?',
  'How does the severity assessment work?',
  'How can I request an expert review?',
  'How do I book a consultation?',
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const welcomeMessage = (id: string): AssistantMessage => ({
  id,
  sender: 'assistant',
  timestamp: 'Just now',
  source: 'pre-written',
  text: WELCOME_TEXT,
});

const getInitialMessages = (): AssistantMessage[] => {
  try {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem('meridbot_chat_history') : null;
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [welcomeMessage('welcome')];
};

export const ClearPixAssistantModal: React.FC<ClearPixAssistantModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  onSelectBooking,
  context,
  onNavigateView,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>(getInitialMessages);
  const [inputText, setInputText] = useState<string>('');
  const [pending, setPending] = useState(false);
  const [pose, setPose] = useState<MeridbotPose>('idle');
  const [wiggleKey, setWiggleKey] = useState(0);
  const [patReady, setPatReady] = useState(true);
  const [simpleOpen, setSimpleOpen] = useState<Record<string, boolean>>({});
  const [detailsOpen, setDetailsOpen] = useState<Record<string, boolean>>({});
  const [openSource, setOpenSource] = useState<Record<string, string | null>>({});
  const [showPrompts, setShowPrompts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastProcessedPromptRef = useRef<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  useAccessibleDialog(isOpen, onClose, dialogRef, inputRef);

  // Sync messages to sessionStorage for persistence across drawer toggles
  useEffect(() => {
    try {
      sessionStorage.setItem('meridbot_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  // Greet on open (wave), then settle to idle. Timers stop when the panel closes.
  useEffect(() => {
    if (!isOpen) {
      clearTimers();
      setPending(false);
      return;
    }
    setPose('wave');
    later(() => setPose((p) => (p === 'wave' ? 'idle' : p)), 1800);
    return clearTimers;
  }, [isOpen]);

  // Occasional blink while idle (at most every 8–12 s); none under reduced motion.
  useEffect(() => {
    if (!isOpen || pose !== 'idle' || prefersReducedMotion()) return;
    const t = window.setTimeout(() => {
      setPose('blink');
      window.setTimeout(() => setPose((p) => (p === 'blink' ? 'idle' : p)), 160);
    }, 8000 + Math.random() * 4000);
    return () => window.clearTimeout(t);
  }, [isOpen, pose]);

  useEffect(() => {
    if (initialPrompt && isOpen && lastProcessedPromptRef.current !== initialPrompt) {
      lastProcessedPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'end' });
  }, [messages, pending]);

  // Answers come from the local pre-written catalogue. Nothing is sent to a server or an external
  // service, so the message text never leaves the browser.
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || pending) return;

    // Internal event name kept for continuity; only the prompt length is stored, never the text.
    trackEvent('ai_guide_prompt_sent', { promptLength: text.trim().length });

    const userMessage: AssistantMessage = { id: `u-${Date.now()}`, sender: 'user', timestamp: now(), text: text.trim() };
    const guidance = generateFallbackGuidance(userMessage.text);
    const guideMessage: AssistantMessage = {
      id: `g-${Date.now()}`,
      sender: 'assistant',
      timestamp: now(),
      text: guidance.reply,
      recommendedSpecialist: guidance.recommendedSpecialist,
      recommendedSpecialistRole: guidance.recommendedSpecialistRole,
      urgencyLevel: guidance.urgencyLevel,
      suggestedDiagnostic: guidance.suggestedDiagnostic,
      suggestedQuestions: guidance.suggestedQuestions,
      source: guidance.source,
      intent: guidance.intent,
    };
    if (!textToSend) setInputText('');

    // Emergency answers are shown at once: the demo pause never delays safety information.
    if (guidance.urgencyLevel === 'Urgent Medical Attention') {
      setMessages((prev) => [...prev, userMessage, guideMessage]);
      setPose('idle');
      return;
    }
    setMessages((prev) => [...prev, userMessage]);
    setPending(true);
    setPose('thinking');
    later(() => {
      setMessages((prev) => [...prev, guideMessage]);
      setPending(false);
      setPose('present');
      later(() => setPose((p) => (p === 'present' ? 'idle' : p)), 2400);
    }, prefersReducedMotion() ? 350 : 950);
  };

  const handleResetChat = () => {
    clearTimers();
    lastProcessedPromptRef.current = null;
    setPending(false);
    setPose('idle');
    setSimpleOpen({});
    setDetailsOpen({});
    setOpenSource({});
    try {
      sessionStorage.removeItem('meridbot_chat_history');
    } catch {}
    setMessages([welcomeMessage(`welcome-${Date.now()}`)]);
  };

  const handlePat = () => {
    if (!patReady) return;
    setPatReady(false);
    setPose('standing-happy');
    setWiggleKey((k) => k + 1);
    later(() => setPose((p) => (p === 'standing-happy' ? 'idle' : p)), 1600);
    later(() => setPatReady(true), 4000);
  };

  if (!isOpen) return null;

  const hasConversation = messages.some((m) => m.sender === 'user');
  const promptsVisible = !hasConversation || showPrompts;

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col justify-end bg-mv-ink/40 sm:bg-black/15 sm:p-5 sm:justify-end sm:items-end transition-opacity duration-300"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="assistant-dialog-title"
        aria-describedby="assistant-dialog-description"
        tabIndex={-1}
        className="mv-sheet-enter flex w-full flex-col bg-[#FAF7F2] shadow-[0_20px_50px_rgba(11,64,54,0.22)] focus:outline-none rounded-t-3xl sm:rounded-2xl border border-mv-outline/90 max-h-[88vh] h-[520px] sm:w-[380px] sm:max-h-[520px] overflow-hidden"
      >
        {/* Header: Ask Meridbot title, avatar, actions */}
        <div className="flex items-center justify-between border-b border-mv-forest/20 bg-mv-forest px-4 py-3 sm:px-5 shrink-0 text-white">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePat}
              aria-label="Tap Meridbot for a friendly reaction"
              title={patReady ? 'Tap Meridbot!' : 'Meridbot is happy'}
              className="group relative -m-1 cursor-pointer rounded-2xl p-1 transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shrink-0"
            >
              <Meridbot pose={pose} height={46} wiggleKey={wiggleKey} />
              <span
                className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-mv-terracotta text-white shadow-xs text-[9px] transition-transform group-hover:scale-110"
                aria-hidden="true"
              >
                ✨
              </span>
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="assistant-dialog-title" className="font-serif text-[18px] sm:text-[19px] font-semibold leading-tight text-white tracking-wide">
                  Ask Meridbot
                </h2>
                <span className="rounded-full bg-emerald-800/80 px-2 py-0.5 text-[11px] font-medium text-emerald-200 border border-emerald-700/60">Guide</span>
              </div>
              <p id="assistant-dialog-description" className="text-[12px] text-emerald-100/90 leading-tight mt-0.5">
                {GUIDE_LABELS.responseSource} · General education
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleResetChat}
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full text-emerald-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              aria-label="Reset conversation"
              title="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full text-emerald-100 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Ask Meridbot"
              title="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Suggested question chips */}
        <div className="border-b border-mv-outline/70 bg-[#FAF7F2] px-4 py-2.5 sm:px-5 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-semibold text-mv-forest flex items-center gap-1.5">
              <span>Suggested questions</span>
            </p>
            {hasConversation && (
              <button
                type="button"
                aria-expanded={showPrompts}
                onClick={() => setShowPrompts((v) => !v)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-mv-forest hover:text-mv-terracotta transition-colors cursor-pointer"
              >
                <span>{showPrompts ? 'Hide suggestions' : 'Show suggestions'}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showPrompts ? 'rotate-180' : ''}`} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
          {promptsVisible && (
            <div className="mt-2 flex flex-wrap gap-1.5 max-h-[105px] overflow-y-auto no-scrollbar py-0.5">
              {SUGGESTED_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    handleSendMessage(chip);
                  }}
                  className="rounded-full border border-mv-outline/90 bg-white px-3 py-1 text-left text-[12px] font-medium leading-snug text-mv-forest hover:bg-mv-forest hover:text-white hover:border-mv-forest disabled:opacity-60 transition-all shadow-2xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thread */}
        <div className="flex-1 space-y-3.5 overflow-y-auto px-4 py-3.5 sm:px-5" aria-live="polite">
          {messages.map((msg) => {
            const sourceInfo = msg.sender === 'assistant' ? describeGuidanceSource(msg.source) : null;
            const extras = msg.intent ? INTENT_EXTRAS[msg.intent as GuideIntentId] : undefined;
            const selected = openSource[msg.id] ?? null;
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-[18px] rounded-br-[4px] bg-mv-forest px-3.5 py-2.5 text-[14px] leading-relaxed text-white shadow-2xs">
                    <span className="sr-only">You said: </span>
                    {msg.text}
                  </div>
                </div>
              );
            }
            return (
              <div key={msg.id} className="flex items-start gap-2.5">
                <span className="mt-1 hidden shrink-0 rounded-full bg-mv-pale sm:inline-flex">
                  <Meridbot pose="idle" height={36} />
                </span>
                <div className="min-w-0 flex-1 rounded-[18px] rounded-tl-[4px] border border-mv-outline/80 bg-white p-3.5 shadow-2xs editorial-fade-in">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="font-semibold text-mv-forest">{MERIDBOT_LABELS.name}</span>
                    {sourceInfo && (
                      <span className="rounded-full bg-mv-pale px-2 py-0.5 font-medium text-mv-forest" title={sourceInfo.detail}>
                        {sourceInfo.label}
                      </span>
                    )}
                    <span className="text-mv-ink-muted">{msg.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-line text-[14px] leading-relaxed text-mv-ink">{msg.text}</p>

                  {msg.urgencyLevel === 'Urgent Medical Attention' && (
                    <EmergencyGuidance className="mt-3" intro="Seek emergency help now if you have any of these:" />
                  )}

                  {extras && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        aria-expanded={!!simpleOpen[msg.id]}
                        onClick={() => setSimpleOpen((s) => ({ ...s, [msg.id]: !s[msg.id] }))}
                        className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full bg-mv-pale px-3 text-[12px] font-semibold text-mv-forest hover:bg-[#d7e3da] cursor-pointer"
                      >
                        <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        {MERIDBOT_LABELS.explainSimply}
                      </button>
                    </div>
                  )}
                  {extras && simpleOpen[msg.id] && (
                    <div className="mt-2 rounded-xl bg-mv-pale/80 p-2.5">
                      <p className="text-[11px] font-semibold text-mv-ink-muted">{MERIDBOT_LABELS.simpleBadge}</p>
                      <p className="mt-0.5 text-[13.5px] leading-relaxed text-mv-ink">{extras.simple}</p>
                    </div>
                  )}

                  {extras && (
                    <div className="mt-2.5 border-t border-mv-outline/70 pt-2.5">
                      <p className="text-[12px] font-semibold text-mv-ink">{MERIDBOT_LABELS.sourcesHeading}</p>
                      {extras.sources.length === 0 ? (
                        <p className="mt-0.5 text-[12px] text-mv-ink-muted">{MERIDBOT_LABELS.noSources}</p>
                      ) : (
                        <>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {extras.sources.map((id) => {
                              const src = SOURCES[id];
                              if (!src) return null;
                              const isOpen = selected === id;
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  aria-expanded={isOpen}
                                  onClick={() => setOpenSource((s) => ({ ...s, [msg.id]: isOpen ? null : id }))}
                                  className={`rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium transition-colors cursor-pointer ${
                                    isOpen ? 'border-mv-forest bg-mv-forest text-white' : 'border-mv-outline bg-mv-ivory text-mv-forest hover:bg-mv-pale'
                                  }`}
                                >
                                  {src.short}
                                </button>
                              );
                            })}
                          </div>
                          {selected && SOURCES[selected] && (
                            <div className="mt-2 rounded-xl border border-mv-outline bg-mv-ivory p-2.5 text-[12px] text-mv-ink">
                              <p className="font-semibold text-mv-forest">{SOURCES[selected].title}</p>
                              <p className="text-mv-ink-muted">{SOURCES[selected].publisher}</p>
                              <div className="mt-1 flex items-center justify-between text-[11px]">
                                <span className="text-mv-ink-muted">{STATUS_LABELS[SOURCES[selected].status]}</span>
                                {SOURCES[selected].url && (
                                  <a
                                    href={SOURCES[selected].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-mv-forest hover:underline"
                                  >
                                    View source
                                    <ExternalLink className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {msg.suggestedDiagnostic && (
                    <div className="mt-2.5 border-t border-mv-outline/70 pt-2.5">
                      <button
                        type="button"
                        aria-expanded={!!detailsOpen[msg.id]}
                        onClick={() => setDetailsOpen((d) => ({ ...d, [msg.id]: !d[msg.id] }))}
                        className="flex w-full items-center justify-between text-left text-[12px] font-semibold text-mv-forest cursor-pointer"
                      >
                        <span>Diagnostic & specialist details</span>
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${detailsOpen[msg.id] ? 'rotate-180' : ''}`} strokeWidth={1.75} aria-hidden="true" />
                      </button>

                      {detailsOpen[msg.id] && (
                        <div className="mt-2 space-y-2 rounded-xl bg-mv-ivory p-2.5 text-[12px] text-mv-ink">
                          <div>
                            <p className="font-semibold text-mv-forest">Suggested diagnostic consideration</p>
                            <p className="text-mv-ink-muted">{msg.suggestedDiagnostic}</p>
                          </div>
                          {msg.recommendedSpecialist && (
                            <div>
                              <p className="font-semibold text-mv-forest">Recommended specialist</p>
                              <p className="text-mv-ink-muted">
                                {msg.recommendedSpecialist}
                                {msg.recommendedSpecialistRole ? ` — ${msg.recommendedSpecialistRole}` : ''}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contextual navigation action links */}
                  {msg.intent === 'assessment-tool' && onNavigateView && (
                    <div className="mt-2.5 pt-2 border-t border-mv-outline/60 flex justify-start">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateView('assessment');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-mv-forest px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-mv-forest/90 transition-colors cursor-pointer"
                      >
                        <span>Start 3-Minute Assessment</span>
                        <ArrowRight className="h-3.5 w-3.5 text-mv-terracotta" aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  {msg.intent === 'treatment-options' && onNavigateView && (
                    <div className="mt-2.5 pt-2 border-t border-mv-outline/60 flex justify-start">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateView('treatments');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-mv-forest px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-mv-forest/90 transition-colors cursor-pointer"
                      >
                        <span>Compare Treatment Options</span>
                        <ArrowRight className="h-3.5 w-3.5 text-mv-terracotta" aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  {msg.intent === 'expert-review-info' && onNavigateView && (
                    <div className="mt-2.5 pt-2 border-t border-mv-outline/60 flex justify-start">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateView('expert-review');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-mv-forest px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-mv-forest/90 transition-colors cursor-pointer"
                      >
                        <span>Upload Reports for Expert Review</span>
                        <ArrowRight className="h-3.5 w-3.5 text-mv-terracotta" aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  {/* Urgent answers point to emergency care only, never to the demo request. */}
                  {msg.urgencyLevel !== 'Urgent Medical Attention' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          trackEvent('simulated_booking_opened', { from: 'ai_assistant' });
                          onClose();
                          onSelectBooking();
                        }}
                        className="mv-btn mv-btn-quiet border border-mv-outline-strong text-[13px] py-1.5 px-3 cursor-pointer"
                      >
                        <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        <span>Request consultation (demo)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {pending && (
            <div className="flex items-center gap-2.5 rounded-xl bg-mv-pale/80 p-2.5" role="status">
              <Meridbot pose="thinking" height={42} />
              <div>
                <p className="text-[13px] font-semibold text-mv-forest">{MERIDBOT_LABELS.processing}</p>
                <p className="text-[11px] leading-tight text-mv-ink-muted">{MERIDBOT_LABELS.processingNote}</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-mv-outline/80 bg-white px-4 pb-3 pt-2.5 sm:px-5 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              aria-label="Ask Meridbot a question about vein health"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about symptoms, treatments or Doppler reports..."
              className="min-h-[42px] flex-1 rounded-full border border-mv-outline/90 bg-[#FAF7F2] px-3.5 text-[14px] text-mv-ink placeholder:text-mv-ink-muted/80 focus:outline-none focus:ring-2 focus:ring-mv-forest/40 focus:border-mv-forest"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || pending}
              className="inline-flex min-h-[42px] min-w-[42px] items-center justify-center rounded-full bg-mv-terracotta text-white hover:bg-mv-terracotta/90 disabled:opacity-40 transition-colors shrink-0 shadow-2xs cursor-pointer"
              aria-label="Send question"
              title="Send"
            >
              <Send className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </form>
          <p className="mt-1.5 text-[11px] leading-tight text-mv-ink-muted">
            <strong className="font-semibold text-mv-ink">Educational guide:</strong> pre-written guidance only · Not a diagnosis · Emergencies call{' '}
            {formatEmergencyNumbers()}
          </p>
        </div>
      </div>
    </div>
  );
};
