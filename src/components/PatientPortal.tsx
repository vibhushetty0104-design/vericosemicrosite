import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  ClipboardList,
  Copy,
  Check,
  Trash2,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Printer,
  Download
} from 'lucide-react';
import { UploadedMediaItem } from './MediaUploader';
import { DoctorProfile } from '../data/doctorsData';
import { SymptomSeverityLevel } from '../types';
import { symptomPatternLabel, SYMPTOM_PATTERN_DISCLAIMER } from '../data/assessmentQuestions';
import { GUIDE_LABELS, GuideIcon, askGuideAbout } from '../content/guideLabels';
import { LivingPageBackground } from './scene/LivingPageBackground';

export interface SavedDossierQuestion {
  id: string;
  text: string;
  source: string;
}

interface PatientPortalProps {
  bookingScore: number | null;
  bookingPattern: SymptomSeverityLevel | null;
  mediaItems: UploadedMediaItem[];
  savedQuestions?: SavedDossierQuestion[];
  onRemoveSavedQuestion?: (id: string) => void;
  onNavigateToAssessment: () => void;
  onNavigateToDoppler: () => void;
  onNavigateToJourney: () => void;
  onOpenBooking: () => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
  onClearSessionData?: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  bookingScore,
  bookingPattern,
  mediaItems,
  savedQuestions = [],
  onRemoveSavedQuestion,
  onNavigateToAssessment,
  onNavigateToDoppler,
  onNavigateToJourney,
  onOpenBooking,
  onOpenAssistantWithPrompt,
  onClearSessionData
}) => {
  const [copiedQuestions, setCopiedQuestions] = useState(false);

  // Suggested pre-consultation questions based on the self-reported symptom pattern + journey-saved questions
  const baseBriefingQuestions = React.useMemo(() => {
    const base = [
      'What was the measured reflux duration (in seconds) at my saphenofemoral junction (SFJ)?',
      'Are my deep femoral and popliteal veins confirmed completely compressible and free of clot?',
      'Which treatment modality (EVLA, RFA, VenaSeal, or Foam) is most appropriate for my vein anatomy?'
    ];

    if (bookingPattern === 'Moderate' || bookingPattern === 'Advanced' || bookingPattern === 'Severe') {
      base.push('Are incompetent perforator veins in my lower calf contributing to my skin changes or swelling?');
      base.push('Do I require graduated medical compression stockings (20-30 mmHg) before or after treatment?');
    }

    if (bookingPattern === 'Minimal' || bookingPattern === 'Mild') {
      base.push('Are my visible spider and reticular veins being fed by underlying saphenous reflux, or are they isolated?');
    }

    return base;
  }, [bookingPattern]);

  const handleCopyQuestions = () => {
    const all = [
      ...baseBriefingQuestions.map((q, i) => `${i + 1}. ${q}`),
      ...(savedQuestions.length > 0 ? ['\n--- Questions from Your Journey ---'] : []),
      ...savedQuestions.map((sq, i) => `• [${sq.source}] ${sq.text}`)
    ];
    navigator.clipboard.writeText(all.join('\n'));
    setCopiedQuestions(true);
    setTimeout(() => setCopiedQuestions(false), 2500);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="relative pt-12 sm:pt-16 pb-24 container-page max-w-6xl overflow-hidden">
      <LivingPageBackground variant="dashboard" className="opacity-40" />
      <div className="relative z-10">
      
      {/* 1. Mandatory Prototype Status Disclosure Banner */}
      <div className="mb-10 p-6 rounded-3xl bg-white border border-mv-outline/70 text-mv-ink shadow-2xs">
        <div className="flex items-start gap-4">
          <ShieldAlert className="w-5 h-5 text-mv-forest shrink-0 mt-0.5" />
          <div className="text-xs sm:text-[13px] leading-relaxed">
            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
              <span className="font-semibold text-mv-forest text-sm">
                Interactive UI Prototype Session · No Backend PHI Stored
              </span>
              <span className="text-[10px] font-mono uppercase bg-mv-cream text-mv-forest px-2.5 py-0.5 rounded-full font-bold border border-mv-outline/60">
                Client-Side State Only
              </span>
            </div>
            <p className="text-mv-ink-muted">
              This patient portal is a <strong>front-end UI prototype</strong> demonstrating clinical navigation, symptom-screener results, media previews, and pre-consultation briefings. <strong>No real Protected Health Information (PHI) is transmitted or persisted</strong> to an encrypted database or EHR. All data shown here exists only in temporary browser memory for testing and design evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Portal Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-mv-outline/60 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-mv-terracotta bg-mv-terracotta/10 px-3 py-1 rounded-full">
              Patient Command Center
            </span>
            <span className="text-xs font-mono text-mv-ink-muted">
              Session Prototype
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mv-forest tracking-tight">
            Vascular Care Portal
          </h1>
          <p className="mt-3 text-sm sm:text-base text-mv-ink-muted max-w-2xl leading-relaxed">
            Review your self-reported symptom pattern, visual evidence, standing duplex ultrasound preparation, and specialist consultation checklist.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrintDossier}
            className="tap-tactile min-h-[44px] rounded-full border border-mv-outline/70 bg-white px-5 py-2.5 text-xs font-semibold text-mv-forest hover:bg-mv-cream transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
            title="Print or save this dossier as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-mv-forest" />
            <span>Export Dossier (Print / PDF)</span>
          </button>
          <button
            onClick={onNavigateToJourney}
            className="tap-tactile min-h-[44px] rounded-full border border-mv-outline/70 bg-white px-5 py-2.5 text-xs font-semibold text-mv-forest hover:bg-mv-cream transition-colors cursor-pointer"
          >
            Care Journey Map &rarr;
          </button>
          <button
            onClick={onOpenBooking}
            className="tap-tactile min-h-[44px] rounded-full bg-mv-forest px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#073028] transition-colors cursor-pointer shadow-xs"
          >
            Schedule Consultation (Demo)
          </button>
        </div>
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
        
        {/* LEFT COLUMN: Assessment, Next Step, Checklist (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Card A: Self-Reported Symptom Pattern */}
          <div className="rounded-3xl border border-mv-outline/70 bg-white p-7 sm:p-8 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-mv-outline/60">
              <span className="text-[11px] font-mono uppercase font-bold text-mv-terracotta tracking-wider">
                Symptom Screener Result
              </span>
              <span className="text-[11px] font-mono text-mv-ink-muted bg-[#FAF7F2] px-3 py-1 rounded-full border border-mv-outline/60">
                Self-reported · Not a diagnosis
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <h2 className="font-serif text-2xl sm:text-3xl text-mv-forest font-bold">
                {bookingPattern ? symptomPatternLabel(bookingPattern) : 'Pre-Screening Status'}
              </h2>
              <span className="rounded-full bg-mv-cream border border-mv-outline/60 px-3 py-1 text-xs font-semibold text-mv-forest">
                {bookingScore !== null ? `Evaluation Score: ${bookingScore} / 24 pts` : 'No Screener Taken Yet'}
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-[13.5px] leading-relaxed text-mv-ink-muted">
              {bookingPattern ? (
                <>
                  Your answers match a <strong>{symptomPatternLabel(bookingPattern).toLowerCase()}</strong>. {SYMPTOM_PATTERN_DISCLAIMER} Clinicians use CEAP to record findings from spider veins (C1) and varicose veins (C2) to swelling (C3) and skin changes (C4–C6).
                </>
              ) : (
                'You have not yet completed the 8-question symptom screener. Taking it summarizes your reported symptoms and pre-populates your ultrasound briefing.'
              )}
            </p>

            <div className="mt-6 pt-5 border-t border-mv-outline/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-mv-ink-muted font-mono">
                {mediaItems.length} visual record(s) attached
              </span>
              <div className="flex items-center gap-3">
                {bookingPattern && (
                  <button
                    onClick={() => onOpenAssistantWithPrompt(`My vein symptom screener showed a ${symptomPatternLabel(bookingPattern).toLowerCase()}. What should I ask a clinician about my symptoms and possible tests?`)}
                    className="text-mv-forest font-semibold hover:text-mv-terracotta flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-mv-terracotta" />
                    <span>Discuss in Education Guide</span>
                  </button>
                )}
                <button
                  onClick={onNavigateToAssessment}
                  className="font-bold text-mv-forest hover:text-mv-terracotta transition-colors cursor-pointer"
                >
                  {bookingScore !== null ? 'Retake Screener &rarr;' : 'Take 8-Question Screener &rarr;'}
                </button>
              </div>
            </div>
          </div>

          {/* Card B: Standing Duplex Ultrasound Preparation Checklist */}
          <div className="rounded-3xl border border-mv-outline/70 bg-white p-7 sm:p-8 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase font-bold text-mv-forest tracking-wider block mb-1">
                  Clinical Preparation Protocol
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-mv-forest">
                  Standing Duplex Ultrasound Readiness
                </h3>
              </div>
              <button
                onClick={onNavigateToDoppler}
                className="text-xs font-semibold text-mv-forest hover:text-mv-terracotta flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Interactive Doppler Tool</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs sm:text-[13.5px] text-mv-ink-muted leading-relaxed">
              International guidelines require ultrasound mapping to be conducted with the patient in a <strong>standing position</strong> to accurately elicit gravity-dependent venous reflux. Prepare for your appointment with these protocol steps:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-mv-forest block mb-0.5">Hydration (500–750 ml)</strong>
                  <span className="text-mv-ink-muted leading-relaxed">Drink water 1 hour prior. Dehydration causes vein constriction and can mask reflux calibers.</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-mv-forest block mb-0.5">Loose-Fitting Clothing</strong>
                  <span className="text-mv-ink-muted leading-relaxed">Wear loose shorts or pants that easily roll above the groin for full SFJ transducer access.</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-mv-forest block mb-0.5">Avoid Creams &amp; Lotions</strong>
                  <span className="text-mv-ink-muted leading-relaxed">Do not apply body moisturizers on the day of scanning, as oils interfere with acoustic gel transmission.</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-mv-forest shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-mv-forest block mb-0.5">Prior Imaging Records</strong>
                  <span className="text-mv-ink-muted leading-relaxed">Bring prior Doppler transcripts or DVT records to compare vein diameters and valve patency over time.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card C: Doctor Consultation Briefing & Questions Generator */}
          <div className="rounded-3xl border border-mv-outline/70 bg-white p-7 sm:p-8 space-y-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-mv-outline/60">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-5 h-5 text-mv-forest" />
                <h3 className="font-serif text-lg sm:text-xl font-bold text-mv-forest">
                  Pre-Consultation Physician Briefing
                </h3>
              </div>
              <button
                onClick={handleCopyQuestions}
                className="tap-tactile min-h-[38px] px-4 py-1.5 rounded-full bg-white border border-mv-outline/70 hover:bg-mv-cream text-mv-forest text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedQuestions ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Questions</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-[13px] text-mv-ink-muted leading-relaxed">
              These questions are suggested from your self-reported symptom pattern, Doppler findings, and chosen treatment modalities to guide your discussion with your vascular specialist:
            </p>

            {/* Stage-based standard questions */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-mv-forest font-bold block">
                Standard Diagnostic Questions:
              </span>
              <ul className="space-y-2.5">
                {baseBriefingQuestions.map((question, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60 text-xs text-mv-forest flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-mv-cream text-mv-forest font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-mv-outline/60">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{question}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Saved journey questions */}
            {savedQuestions.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-mv-outline/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-mv-terracotta font-bold block">
                    Questions Added Along Your Journey ({savedQuestions.length}):
                  </span>
                  <span className="text-[10px] text-mv-ink-muted font-mono">
                    Doppler &amp; Modality Sourced
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {savedQuestions.map((sq) => (
                    <li
                      key={sq.id}
                      className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60 text-xs text-mv-forest flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase bg-mv-cream text-mv-forest font-semibold px-2.5 py-0.5 rounded-full inline-block border border-mv-outline/60">
                          {sq.source}
                        </span>
                        <p className="leading-relaxed">{sq.text}</p>
                      </div>
                      {onRemoveSavedQuestion && (
                        <button
                          onClick={() => onRemoveSavedQuestion(sq.id)}
                          className="text-mv-ink-muted hover:text-rose-600 p-1 shrink-0 cursor-pointer transition-colors"
                          title="Remove question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Media Locker, AI Assistant Quick Link, Session Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card D: Attached Clinical Media Review */}
          <div className="rounded-3xl border border-mv-outline/70 bg-white p-6 sm:p-7 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-mv-outline/60">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-mv-forest" />
                <span className="text-xs font-bold text-mv-forest uppercase tracking-wider font-mono">
                  Visual Evidence ({mediaItems.length})
                </span>
              </div>
              <button
                onClick={onNavigateToAssessment}
                className="text-xs font-semibold text-mv-forest hover:text-mv-terracotta cursor-pointer transition-colors"
              >
                Upload
              </button>
            </div>

            {mediaItems.length === 0 ? (
              <div className="bg-[#FAF7F2] border border-mv-outline/60 rounded-2xl p-6 text-center text-xs text-mv-ink-muted space-y-2">
                <Camera className="w-8 h-8 mx-auto text-mv-ink-muted/50" />
                <span className="block font-medium text-mv-forest">No leg photos attached yet</span>
                <p className="text-[11px] leading-relaxed">
                  Uploading photos of visible varicosities, ankle swelling, or skin darkening provides context for your duplex ultrasound appointment.
                </p>
                <button
                  onClick={onNavigateToAssessment}
                  className="mt-2 px-4 py-2 bg-mv-forest text-white rounded-full text-xs font-semibold cursor-pointer tap-tactile"
                >
                  Attach Photos
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl bg-[#FAF7F2] p-3 text-xs border border-mv-outline/60"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {item.type.startsWith('image') ? (
                        <img
                          src={item.dataUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-mv-outline/60 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-mv-cream flex items-center justify-center text-mv-forest font-bold text-xs shrink-0 border border-mv-outline/60">
                          VID
                        </div>
                      )}
                      <div className="truncate">
                        <span className="block font-medium text-mv-forest truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-mv-ink-muted font-mono">
                          {item.size}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-mv-ink-muted italic pt-1 leading-relaxed">
                  * Note: Visual attachments are held in local browser session memory and are never uploaded to a remote server in this prototype.
                </p>
              </div>
            )}
          </div>

          {/* Card E: AI Assistant Consultation Prep */}
          <div className="rounded-3xl bg-white border border-mv-outline/70 p-6 sm:p-7 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <GuideIcon className="w-4 h-4 text-mv-terracotta" aria-hidden="true" />
              <span className="text-xs font-mono uppercase tracking-widest text-mv-forest font-bold">
                {GUIDE_LABELS.name}
              </span>
            </div>

            <h4 className="font-serif text-xl sm:text-2xl font-bold text-mv-forest leading-snug">
              Prepare for Your Appointment
            </h4>

            <p className="text-xs leading-relaxed text-mv-ink-muted">
              Have questions about outpatient recovery, laser vs VenaSeal adhesive, or insurance pre-authorization rules? Ask the educational guide for general, pre-written explanations.
            </p>

            <button
              onClick={() => onOpenAssistantWithPrompt('What clinical guidelines (NICE, SVS, AVF) recommend endovenous thermal ablation over surgical stripping for varicose veins?')}
              className="w-full py-2.5 px-4 bg-mv-forest hover:bg-[#073028] text-white rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs min-h-[44px] tap-tactile"
            >
              <span>{askGuideAbout('treatments')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card F: Reset Prototype Session */}
          <div className="p-5 rounded-3xl bg-white border border-mv-outline/70 text-center shadow-2xs space-y-2">
            <span className="text-[11px] font-mono uppercase text-mv-ink-muted block font-semibold">
              Privacy &amp; Local Storage
            </span>
            <p className="text-[11.5px] text-mv-ink-muted leading-relaxed">
              All assessment scores, attached photos, and saved questions are held only in your active browser tab&apos;s temporary memory. Nothing is sent to an external server.
            </p>
            {onClearSessionData && (
              <button
                onClick={onClearSessionData}
                className="mt-2 text-xs text-rose-700 hover:text-rose-900 font-semibold flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer py-1.5 px-3.5 rounded-full hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Session Data</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  </div>
  );
};
