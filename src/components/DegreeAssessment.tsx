import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS, calculateAssessmentResult, symptomPatternLabel, SYMPTOM_PATTERN_DISCLAIMER } from '../data/assessmentQuestions';
import { AssessmentResult, SymptomSeverityLevel } from '../types';
import { EmergencyGuidance } from './EmergencyGuidance';
import { formatEmergencyNumbers } from '../data/emergencyContacts';
import { MediaUploader, UploadedMediaItem } from './MediaUploader';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  FileDown,
  Calendar,
  Info,
  ShieldCheck,
  Camera,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Activity,
  Compass,
  Stethoscope
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { GuideIcon, askGuideAbout } from '../content/guideLabels';

interface DegreeAssessmentProps {
  onOpenBookingWithScore: (score: number, symptomPattern: SymptomSeverityLevel, mediaCount: number) => void;
  onOpenAssistantWithContext: (contextPrompt: string) => void;
  mediaItems: UploadedMediaItem[];
  onAddMedia: (item: UploadedMediaItem) => void;
  onRemoveMedia: (id: string) => void;
  onNavigateToDoppler?: () => void;
  onNavigateToTreatments?: () => void;
  onNavigateToSpecialists?: () => void;
  savedAnswers?: Record<number, number>;
  savedResult?: AssessmentResult | null;
  savedPatientName?: string;
  onSaveAssessmentState?: (answers: Record<number, number>, result: AssessmentResult | null, patientName: string) => void;
}

export const DegreeAssessment: React.FC<DegreeAssessmentProps> = ({
  onOpenBookingWithScore,
  onOpenAssistantWithContext,
  mediaItems,
  onAddMedia,
  onRemoveMedia,
  onNavigateToDoppler,
  onNavigateToTreatments,
  onNavigateToSpecialists,
  savedAnswers,
  savedResult,
  savedPatientName,
  onSaveAssessmentState,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    if (savedResult) return 0;
    const answeredCount = Object.keys(savedAnswers || {}).length;
    return answeredCount < ASSESSMENT_QUESTIONS.length ? answeredCount : 0;
  });
  const [answers, setAnswers] = useState<Record<number, number>>(savedAnswers || {});
  const [result, setResult] = useState<AssessmentResult | null>(savedResult || null);
  const [patientName, setPatientName] = useState<string>(savedPatientName || '');
  const [showMediaUploader, setShowMediaUploader] = useState<boolean>(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);

  const currentQ = ASSESSMENT_QUESTIONS[currentQuestionIndex];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (score: number) => {
    if (currentQuestionIndex === 0 && Object.keys(answers).length === 0) {
      trackEvent('screener_started', { firstQuestion: currentQ.id });
    }
    trackEvent('screener_question_answered', { questionId: currentQ.id, questionIndex: currentQuestionIndex + 1 });

    const updatedAnswers = { ...answers, [currentQ.id]: score };
    setAnswers(updatedAnswers);

    // Auto-advance if not on last question
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      onSaveAssessmentState?.(updatedAnswers, result, patientName);
    } else {
      // Calculate final result
      const calculated = calculateAssessmentResult(updatedAnswers);
      setResult(calculated);
      onSaveAssessmentState?.(updatedAnswers, calculated, patientName);
      // Symptom answers, scores and patterns are not recorded in analytics.
      trackEvent('screener_completed');
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setShowMediaUploader(false);
    onSaveAssessmentState?.({}, null, patientName);
  };

  const handleDownloadPdf = async () => {
    if (!result) return;
    setIsPdfGenerating(true);
    trackEvent('pdf_report_downloaded');
    try {
      const { generatePdfReport } = await import('../utils/generatePdfReport');
      const imagesCount = mediaItems.filter(m => m.type === 'image').length;
      const videosCount = mediaItems.filter(m => m.type === 'video').length;

      generatePdfReport({
        result,
        answers,
        patientName: patientName.trim() || 'Patient Self-Evaluation',
        imageCount: imagesCount,
        videoCount: videosCount,
      });
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <section id="degree-assessment" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-mv-outline/50 scroll-mt-20">
      <div className="container-page max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-mv-ink-muted text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
            <ClipboardCheck className="w-3.5 h-3.5 text-mv-forest" />
            <span>INTERACTIVE CLINICAL ASSESSMENT · SELF-EVALUATION</span>
          </div>
          <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[42px] font-semibold text-mv-forest leading-tight">
            Vein Symptom Screener
          </h2>
          <p className="mt-3 text-[15px] sm:text-[16px] text-mv-ink-muted leading-relaxed">
            Answer 8 questions about your symptoms to see which symptom pattern they match, get questions to bring to a clinician, and optionally attach photos or videos. This screener does not diagnose you or assign a CEAP class.
          </p>

          {/* Quick jump banner to Media Upload section */}
          <div className="mt-5 inline-flex items-center gap-2 bg-white border border-mv-outline/70 rounded-full px-4 py-2 text-[12.5px] text-mv-forest shadow-2xs">
            <Camera className="w-4 h-4 text-mv-terracotta" />
            <span>Want to upload photos or videos first?</span>
            <a href="#media-upload" className="font-bold text-mv-forest hover:text-mv-terracotta underline flex items-center gap-1 transition-colors">
              <span>Go to Media Uploader ({mediaItems.length} on this device)</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Emergency Triage Safety Banner */}
        <div className="mb-8 p-5 rounded-3xl bg-rose-50/80 border border-rose-300 text-rose-950 flex items-start gap-4 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-[13px] sm:text-[13.5px]">
            <span className="font-bold text-rose-900 block mb-0.5">
              Emergency Warning Signs
            </span>
            <p className="text-rose-900/90 leading-relaxed">
              This screening tool evaluates <strong>chronic superficial varicose veins and venous hypertension</strong> only. If you are experiencing sudden unilateral leg swelling, intense calf pain, localized redness/warmth, or acute shortness of breath / chest discomfort, <strong>do not wait to finish this questionnaire</strong>. In India, call <a href="tel:112" className="font-bold underline">112</a> or <a href="tel:108" className="font-bold underline">108</a> (elsewhere, your local emergency number) or go to the nearest emergency department to be checked for a blood clot in the leg (DVT) or lungs (PE).
            </p>
          </div>
        </div>

        {/* Assessment Card Container (Warm Editorial Consultation Stage) */}
        <div className="bg-white border border-mv-outline/70 rounded-3xl shadow-xs overflow-hidden">
          
          {/* Header Progress Bar */}
          <div className="bg-mv-ivory p-4 sm:p-5 border-b border-mv-outline/60">
            <div className="flex items-center justify-between text-[12.5px] font-semibold text-mv-forest mb-2.5">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-mv-forest" />
                <span>Meridian Clinical Screener</span>
              </span>
              <span className="font-mono text-mv-ink-muted">
                {result ? "Assessment Complete" : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-mv-outline/50 h-2 rounded-full overflow-hidden">
              <div
                className="bg-mv-forest h-full transition-all duration-300"
                style={{ width: `${result ? 100 : progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* ACTIVE QUESTION VIEW */}
          {!result ? (
            <div className="p-6 sm:p-10">
              
              {/* Question Title & Description */}
              <div className="mb-8">
                <span className="text-[11px] font-mono font-bold text-mv-terracotta tracking-wider uppercase block mb-1.5">
                  Item 0{currentQ.id}
                </span>
                <h2 className="font-serif text-[22px] sm:text-[26px] font-semibold text-mv-forest leading-snug">
                  {currentQ.desc}
                </h2>
                <div className="mt-2.5 flex items-center gap-2 text-[12.5px] text-mv-ink-muted">
                  <Info className="w-4 h-4 text-mv-forest shrink-0" />
                  <span>Clinical significance: {currentQ.clinicalSignificance}</span>
                </div>
              </div>

              {/* Options Grid */}
              <div className="space-y-3.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id] === opt.score;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(opt.score)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start justify-between group cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                        isSelected
                          ? 'bg-mv-ivory border-mv-forest shadow-xs'
                          : 'bg-white border-mv-outline/60 hover:bg-mv-ivory/50 hover:border-mv-forest/40'
                      }`}
                    >
                      <div className="pr-4">
                        <div className="text-[15px] sm:text-[16px] font-semibold text-mv-forest group-hover:text-mv-terracotta transition-colors">
                          {opt.label}
                        </div>
                        {opt.description && (
                          <div className="text-[13px] text-mv-ink-muted mt-1 leading-relaxed">
                            {opt.description}
                          </div>
                        )}
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-mv-forest border-mv-forest text-white'
                          : 'border-mv-outline bg-white group-hover:border-mv-forest'
                      }`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Nav Controls */}
              <div className="mt-8 pt-6 border-t border-mv-outline/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 text-[13px] font-semibold text-mv-forest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-mv-ivory rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {answers[currentQ.id] !== undefined && currentQuestionIndex < totalQuestions - 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    className="px-5 py-2.5 text-[13px] font-semibold text-white bg-mv-forest hover:bg-mv-forest/90 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs min-h-[44px]"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* COMPLETED RESULT REPORT VIEW */
            <div className="p-6 sm:p-10 animate-in fade-in duration-200">
              
              {/* Result Summary Banner */}
              <div className="bg-[#FAF7F2] border border-mv-outline/70 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-mv-outline/60">
                  <div>
                    <div className="text-[11px] font-mono font-bold uppercase text-mv-ink-muted tracking-wider">
                      Your Symptom Pattern (Not a Diagnosis)
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="font-serif text-[26px] sm:text-[32px] font-bold text-mv-forest">
                        {symptomPatternLabel(result.severityLevel)}
                      </span>
                      <span
                        className="text-[11px] font-bold px-3 py-1 rounded-full text-white font-mono"
                        style={{ backgroundColor: result.severityColor }}
                      >
                        Self-reported
                      </span>
                    </div>
                    <div className="text-[14px] sm:text-[15px] font-serif font-medium text-mv-ink-muted mt-1">
                      {result.symptomPatternTitle}
                    </div>
                  </div>

                  {/* Score Gauge */}
                  <div className="text-left md:text-right bg-white p-4 rounded-2xl border border-mv-outline/60 shadow-2xs">
                    <span className="text-[11px] text-mv-ink-muted block uppercase font-mono font-bold">Reported Symptom Load</span>
                    <span className="text-[26px] font-serif font-bold text-mv-forest tabular-nums">
                      {result.totalScore} <span className="text-sm font-sans font-normal text-mv-ink-muted">/ {result.maxScore} pts</span>
                    </span>
                    <span className="text-[11.5px] text-mv-forest font-semibold block mt-0.5">
                      Self-reported responses only
                    </span>
                  </div>
                </div>

                {/* Clinical Interpretation */}
                <div className="mt-5 space-y-3.5 text-[14px] text-mv-ink-muted leading-relaxed">
                  <p>
                    <strong className="text-mv-forest font-semibold">Summary: </strong>
                    {result.summary}
                  </p>
                  <p>
                    <strong className="text-mv-forest font-semibold">What this can mean: </strong>
                    {result.pathologyDetails}
                  </p>
                </div>

                {/* Non-Diagnostic Orientation Notice */}
                <div className="mt-5 pt-4 border-t border-mv-outline/50 text-[12px] text-mv-ink-muted leading-relaxed">
                  <strong className="text-mv-forest">About this result:</strong> {SYMPTOM_PATTERN_DISCLAIMER} It is an educational tool, not a diagnostic medical device.
                </div>
              </div>

              {result.urgentCareAdvised && (
                <EmergencyGuidance
                  className="mb-8"
                  heading="Your answers suggest you need a prompt in-person assessment"
                  intro={`Arrange to see a doctor soon. Call ${formatEmergencyNumbers()} in India (or your local emergency number) immediately if you have any of these:`}
                />
              )}

              {/* Action Recommendations Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                {/* Specialist Recommendation */}
                <div className="bg-[#FAF7F2] border border-mv-outline/70 rounded-3xl p-6 shadow-xs">
                  <span className="text-[11px] font-mono font-bold uppercase text-mv-forest block mb-1.5">
                    Recommended Specialist
                  </span>
                  <div className="font-serif text-[19px] font-semibold text-mv-forest mb-2">
                    {result.suggestedSpecialist}
                  </div>
                  <p className="text-[13.5px] text-mv-ink-muted leading-relaxed mb-3">
                    {result.recommendedAction}
                  </p>
                  <div className="pt-2.5 border-t border-mv-outline/50 text-[12px] text-mv-ink-muted">
                    <strong className="text-mv-forest">Possible next test:</strong> {result.diagnosticRecommendation}
                  </div>
                </div>

                {/* Conservative Lifestyle Checklist */}
                <div className="bg-[#FAF7F2] border border-mv-outline/70 rounded-3xl p-6 shadow-xs">
                  <span className="text-[11px] font-mono font-bold uppercase text-mv-terracotta block mb-2.5">
                    Conservative Self-Care Plan
                  </span>
                  <ul className="space-y-2.5 text-[13.5px] text-mv-ink-muted">
                    {result.lifestyleMeasures.map((measure, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Patient Name & Visual Evidence Accordion Panel */}
              <div className="mb-8 space-y-4">
                
                <div className="bg-[#FAF7F2] border border-mv-outline/70 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-[13px] font-semibold text-mv-forest mb-1.5">
                      Patient Name for Clinical Report &amp; PDF:
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPatientName(val);
                        onSaveAssessmentState?.(answers, result, val);
                      }}
                      placeholder="e.g. Jane Doe (optional for report personalization)"
                      className="w-full bg-white border border-mv-outline/70 rounded-xl px-4 py-2.5 text-[13px] text-mv-forest focus:outline-none focus:ring-2 focus:ring-mv-forest/40"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMediaUploader(!showMediaUploader)}
                    className="self-end sm:self-center px-4.5 py-2.5 text-[13px] font-semibold text-mv-forest bg-white hover:bg-mv-forest hover:text-white border border-mv-outline/70 rounded-full flex items-center gap-2 transition-colors cursor-pointer min-h-[44px]"
                  >
                    <Camera className="w-4 h-4 text-mv-terracotta" />
                    <span>
                      {showMediaUploader ? 'Hide Media Attachments' : `Attach / Review Photos & Videos (${mediaItems.length})`}
                    </span>
                    {showMediaUploader ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Media Uploader Section */}
                {showMediaUploader && (
                  <div className="animate-in fade-in duration-200">
                    <MediaUploader
                      mediaItems={mediaItems}
                      onAddMedia={onAddMedia}
                      onRemoveMedia={onRemoveMedia}
                    />
                  </div>
                )}

              </div>

              {/* Connected Clinical Pathway: Bridge to Next Care Steps */}
              <div className="mb-8 rounded-3xl border border-mv-outline/70 bg-[#FAF7F2] p-6 sm:p-7">
                <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-mv-forest font-bold block mb-2">
                  Recommended Sequential Clinical Pathway
                </span>
                <p className="text-[13px] text-mv-ink-muted mb-5 leading-relaxed">
                  A symptom assessment provides clinical orientation, but definitive planning requires objective hemodynamic imaging and specialist evaluation:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {/* Step 2: Duplex Scan */}
                  <div className="bg-white border border-mv-outline/60 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-mv-ink-muted mb-2">
                        <span>STEP 02</span>
                        <Activity className="w-3.5 h-3.5 text-mv-forest" />
                      </div>
                      <strong className="text-mv-forest text-sm font-semibold block mb-1.5">Standing Duplex Scan</strong>
                      <p className="text-[12px] text-mv-ink-muted leading-relaxed">
                        Quantify reflux duration (&gt;500ms cutoff) and measure GSV/SSV caliber in standing position.
                      </p>
                    </div>
                    {onNavigateToDoppler && (
                      <button
                        onClick={onNavigateToDoppler}
                        className="mt-4 text-[12px] font-semibold text-mv-forest hover:text-mv-terracotta flex items-center gap-1.5 cursor-pointer tap-tactile transition-colors"
                      >
                        <span>Upload or Decode Scan</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Step 3: Treatment Options */}
                  <div className="bg-white border border-mv-outline/60 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-mv-ink-muted mb-2">
                        <span>STEP 03</span>
                        <Compass className="w-3.5 h-3.5 text-mv-terracotta" />
                      </div>
                      <strong className="text-mv-forest text-sm font-semibold block mb-1.5">Treatment Modalities</strong>
                      <p className="text-[12px] text-mv-ink-muted leading-relaxed">
                        Learn how day-care EVLA, RFA, and VenaSeal medical adhesive compare, if treatment is recommended.
                      </p>
                    </div>
                    {onNavigateToTreatments && (
                      <button
                        onClick={onNavigateToTreatments}
                        className="mt-4 text-[12px] font-semibold text-mv-forest hover:text-mv-terracotta flex items-center gap-1.5 cursor-pointer tap-tactile transition-colors"
                      >
                        <span>Compare Modalities</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Step 4: In-Person Specialist Consultation */}
                  <div className="bg-white border border-mv-outline/60 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-mv-ink-muted mb-2">
                        <span>STEP 04</span>
                        <Stethoscope className="w-3.5 h-3.5 text-mv-forest" />
                      </div>
                      <strong className="text-mv-forest text-sm font-semibold block mb-1.5">Specialist Consultation</strong>
                      <p className="text-[12px] text-mv-ink-muted leading-relaxed">
                        Consult with senior vascular surgeons in Bengaluru for standing duplex examination and personalised care.
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenBookingWithScore(result.totalScore, result.severityLevel, mediaItems.length)}
                      className="mt-4 text-[12px] font-semibold text-[#A9472F] hover:text-[#8F3B26] flex items-center gap-1.5 cursor-pointer tap-tactile transition-colors"
                    >
                      <span>Request Consultation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>

              {/* Result Action Buttons: PDF Generation, Appointment, AI Assistant */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-mv-outline/60">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 text-xs font-semibold text-mv-forest bg-white border border-mv-outline/70 rounded-full hover:bg-mv-cream flex items-center gap-1.5 transition-colors cursor-pointer tap-tactile min-h-[44px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake Screener</span>
                  </button>

                  {/* Client-Side Downloadable PDF Report */}
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isPdfGenerating}
                    className="px-4.5 py-2.5 text-xs font-semibold text-white bg-mv-forest hover:bg-[#073028] rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs tap-tactile min-h-[44px]"
                    title="Download a PDF summary of your answers and symptom pattern"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isPdfGenerating ? 'Generating PDF...' : 'Download Symptom Summary PDF'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => onOpenAssistantWithContext(
                      `I completed the Meridian Vascular degree assessment with a score of ${result.totalScore}/24 (${symptomPatternLabel(result.severityLevel).toLowerCase()}, self-reported) and have ${mediaItems.length} photos/videos attached. What specific questions should I ask during my ultrasound consultation?`
                    )}
                    className="px-4 py-2.5 text-xs font-semibold text-mv-forest bg-white border border-mv-outline/70 rounded-full hover:bg-mv-forest hover:text-white flex items-center gap-1.5 transition-all cursor-pointer tap-tactile min-h-[44px]"
                  >
                    <GuideIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{askGuideAbout('my result')}</span>
                  </button>

                  <button
                    onClick={() => {
                      trackEvent('simulated_booking_opened', { from: 'screener_result' });
                      onOpenBookingWithScore(result.totalScore, result.severityLevel, mediaItems.length);
                    }}
                    className="px-4.5 py-2.5 text-xs font-semibold text-white bg-mv-terracotta hover:bg-[#B34E35] rounded-full flex items-center gap-2 transition-all shadow-xs cursor-pointer tap-tactile min-h-[44px]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Request an appointment (demo)</span>
                    <span className="text-[9px] font-mono uppercase bg-white/20 px-1.5 py-0.5 rounded-full text-white/95">
                      Demo
                    </span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};
