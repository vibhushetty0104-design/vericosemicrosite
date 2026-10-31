import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Info,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  RotateCcw,
  BookOpen,
  ClipboardPaste,
  Layers,
  Copy
} from 'lucide-react';
import {
  DOPPLER_DICTIONARY,
  SYNTHETIC_DOPPLER_REPORTS,
  DopplerTermDefinition,
  SyntheticDopplerReport
} from '../data/dopplerTerminology';
import { analyzeClinicalExcerpt } from '../utils/clinicalReportParser';
import { trackEvent } from '../utils/analytics';
import { GuideIcon, askGuideAbout } from '../content/guideLabels';

interface DopplerReportDecoderProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  onBookConsultation?: () => void;
  onNavigateToTreatments?: () => void;
  onAddQuestionsToDossier?: (questions: string[], sourceName: string) => void;
}

export const DopplerReportDecoder: React.FC<DopplerReportDecoderProps> = ({
  onOpenAiWithPrompt,
  onBookConsultation,
  onNavigateToTreatments,
  onAddQuestionsToDossier,
}) => {
  const [activeTab, setActiveTab] = useState<'sample' | 'custom'>('sample');
  const [selectedReportId, setSelectedReportId] = useState<string>(SYNTHETIC_DOPPLER_REPORTS[0].id);
  const [selectedTermId, setSelectedTermId] = useState<string>('sfj-incompetence');
  const [dossierToast, setDossierToast] = useState<string | null>(null);
  
  // Custom pasted report text state
  const [customText, setCustomText] = useState<string>('');
  const [customTextSubmitted, setCustomTextSubmitted] = useState<boolean>(false);

  const handleSaveTermQuestions = (term: DopplerTermDefinition) => {
    if (onAddQuestionsToDossier && term.questionsForDoctor?.length > 0) {
      trackEvent('dossier_question_toggled', { term: term.term, count: term.questionsForDoctor.length });
      onAddQuestionsToDossier(term.questionsForDoctor, `Doppler: ${term.term}`);
      setDossierToast(`Saved ${term.questionsForDoctor.length} questions for "${term.term}" to your Visit Dossier`);
      setTimeout(() => setDossierToast(null), 3500);
    }
  };

  // Active sample report
  const activeReport = useMemo<SyntheticDopplerReport>(() => {
    return (
      SYNTHETIC_DOPPLER_REPORTS.find((r) => r.id === selectedReportId) ||
      SYNTHETIC_DOPPLER_REPORTS[0]
    );
  }, [selectedReportId]);

  // Selected term definition
  const selectedTerm = useMemo<DopplerTermDefinition | null>(() => {
    return DOPPLER_DICTIONARY[selectedTermId] || null;
  }, [selectedTermId]);

  // Analyze custom pasted text using verified clinical parser
  const customAnalysis = useMemo(() => {
    return analyzeClinicalExcerpt(customText);
  }, [customText]);

  const handleSelectTerm = (termId: string) => {
    trackEvent('doppler_term_inspected', { termId });
    setSelectedTermId(termId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const el = document.getElementById('doppler-term-decoder-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleCopyQuestions = (term: DopplerTermDefinition) => {
    if (term.questionsForDoctor?.length > 0) {
      const text = `Questions for Vascular Specialist regarding "${term.term}":\n` +
        term.questionsForDoctor.map((q, i) => `${i + 1}. ${q}`).join('\n');
      navigator.clipboard.writeText(text);
      setDossierToast(`Copied ${term.questionsForDoctor.length} questions for "${term.term}" to clipboard`);
      setTimeout(() => setDossierToast(null), 3500);
    }
  };

  const handleAskAiAboutTerm = (term: DopplerTermDefinition) => {
    if (onOpenAiWithPrompt) {
      const prompt = `Can you explain what "${term.term}" means on a lower extremity venous Doppler ultrasound report? What are the clinical implications and what questions should I ask my vascular specialist?`;
      onOpenAiWithPrompt(prompt);
    }
  };

  const handleAskAiAboutCustomExcerpt = () => {
    if (onOpenAiWithPrompt && customText.trim()) {
      const prompt = `I have the following excerpt from my lower extremity venous duplex ultrasound report:\n\n"${customText.trim()}"\n\nCould you please explain what these findings indicate in plain, reassuring English without diagnosing, and what key questions I should ask my doctor during my consultation?`;
      onOpenAiWithPrompt(prompt);
    }
  };

  return (
    <section id="doppler-decoder" className="py-12 sm:py-16 bg-[#FAF7F2] border-b border-[#063B36]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating Toast Notification */}
        {dossierToast && (
          <div className="fixed bottom-24 right-5 z-50 bg-[#0A3B32] text-white px-4 py-2.5 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2 border border-mv-forest/30 animate-in fade-in slide-in-from-bottom-2">
            <BookOpen className="w-4 h-4 text-mv-terracotta" />
            <span>{dossierToast}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mv-pale text-mv-forest text-xs font-semibold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-mv-forest" />
            <span>Educational Report Decoder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-mv-forest tracking-tight">
            Venous Doppler Report Decoder
          </h2>
          <p className="mt-3 text-base text-mv-ink-muted leading-relaxed">
            Duplex ultrasound reports are filled with technical hemodynamic jargon like &ldquo;retrograde reflux &gt;500ms&rdquo;, &ldquo;SFJ incompetence&rdquo;, and &ldquo;perforator caliber&rdquo;. Explore sample synthetic case studies or paste excerpts from your own report to decode findings into plain, clinically grounded English.
          </p>
        </div>

        {/* Tab Switcher: Curated Synthetic Samples vs Custom Paste */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('sample')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-mv-forest text-white shadow-xs'
                : 'bg-white text-mv-forest border border-mv-outline/70 hover:bg-mv-pale/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Curated Case Studies (Synthetic)</span>
          </button>
          
          <button
            onClick={() => setActiveTab('custom')}
            className={`inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-mv-forest text-white shadow-xs'
                : 'bg-white text-mv-forest border border-mv-outline/70 hover:bg-mv-pale/60'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            <span>Paste Your Report Excerpt</span>
          </button>

          <span className="text-xs text-mv-ink-muted ml-auto hidden md:inline-flex items-center gap-1.5 bg-white/90 px-3.5 py-1.5 rounded-full border border-mv-outline/70 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-mv-forest" />
            <span>Source-backed by American Venous Forum (AVF) consensus</span>
          </span>
        </div>

        {/* TAB 1: CURATED SYNTHETIC SAMPLES */}
        {activeTab === 'sample' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Prominent Clinical Safety & Diagnostic Boundary Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-amber-950 block mb-0.5">
                  Clinical Safety &amp; Diagnostic Boundary (Duplex Imaging vs. Educational Decoder)
                </span>
                <p className="text-amber-900/90 leading-relaxed">
                  Venous Doppler numbers (reflux &gt;500ms, GSV caliber, compressibility) require clinical correlation with a hands-on physical exam. Automated decoders and educational guides <strong>cannot rule out Deep Vein Thrombosis (DVT)</strong>, verify technical scan completeness, or substitute for in-person review of complete duplex cine loops by a qualified vascular specialist.
                </p>
              </div>
            </div>

            {/* Synthetic Sample Selector Pills */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-mv-outline/70 shadow-xs">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <span className="text-xs font-semibold text-mv-ink-muted uppercase tracking-wider">
                  Select a Curated Synthetic Case Study:
                </span>
                <span className="text-[11px] font-mono text-mv-forest font-semibold bg-mv-pale px-2.5 py-0.5 rounded-full">
                  Standardized Clinical Scenarios
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SYNTHETIC_DOPPLER_REPORTS.map((report) => {
                  const isSelected = selectedReportId === report.id;
                  const isUrgent = report.id === 'report-dvt-safety-alert';
                  return (
                    <button
                      key={report.id}
                      onClick={() => {
                        setSelectedReportId(report.id);
                        // default to first highlighted term in the report
                        const firstTerm = report.excerptHtml[0]?.termId;
                        if (firstTerm) setSelectedTermId(firstTerm);
                      }}
                      className={`text-left p-3.5 min-h-[44px] rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? isUrgent
                            ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-200'
                            : 'bg-mv-pale/70 border-mv-forest ring-2 ring-mv-forest/20'
                          : 'bg-mv-ivory/60 border-mv-outline/60 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                          isUrgent ? 'bg-rose-200 text-rose-900 font-bold' : 'bg-mv-forest/10 text-mv-forest font-medium'
                        }`}>
                          {report.patientReference.split('·')[0].trim()}
                        </span>
                        {isUrgent && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-rose-600">
                            <AlertTriangle className="w-3 h-3" /> Red Flag Case
                          </span>
                        )}
                      </div>
                      <div className="font-serif text-sm font-bold text-mv-forest line-clamp-1">
                        {report.title}
                      </div>
                      <div className="text-xs text-mv-ink-muted mt-1 line-clamp-1">
                        {report.indication}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* High-Level Findings Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {activeReport.findingsSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-[16px] border border-[#063B36]/10 shadow-xs flex flex-col justify-between"
                >
                  <span className="text-[11px] font-medium text-[#707E94] uppercase tracking-wide">
                    {item.label}
                  </span>
                  <span className={`font-serif text-base sm:text-lg font-bold mt-1.5 ${item.highlightColor}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Main Interactive Stage: Report Document (Left) + Educational Explanation Drawer (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: Annotated Clinical Report Excerpt */}
              <div className="lg:col-span-7 bg-white rounded-[24px] border border-[#063B36]/15 shadow-sm p-6 sm:p-8">
                
                {/* Document Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#063B36]/10 gap-2 mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#063B36]" />
                      <span className="text-xs font-mono uppercase tracking-wider text-[#707E94]">
                        Sample report (synthetic)
                      </span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#063B36] mt-1">
                      {activeReport.title}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-mono text-[#707E94] block">
                      {activeReport.facility}
                    </span>
                    <span className="text-xs font-mono text-[#063B36] font-semibold">
                      Date: {activeReport.date}
                    </span>
                  </div>
                </div>

                {/* Patient Indication and Protocol Info */}
                <div className="bg-[#FAF7F2] p-4 rounded-[16px] border border-[#063B36]/10 mb-6 space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-[#063B36]">Clinical Indication: </span>
                    <span className="text-[#4A5563]">{activeReport.indication}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#063B36]">Scanning Protocol: </span>
                    <span className="text-[#4A5563]">{activeReport.protocol}</span>
                  </div>
                </div>

                {/* Interactive Transcript Body with Clickable Terms */}
                <div className="mb-6">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#707E94] mb-3 flex items-center justify-between">
                    <span>Annotated Sonographic Text (Click Any Term to Inspect)</span>
                    <span className="text-[11px] text-[#063B36] font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#E88970]" /> Selectable Highlights
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 bg-[#FAF7F2]/60 rounded-[18px] border border-[#063B36]/10 font-sans text-sm leading-relaxed text-[#1B2430]">
                    {activeReport.excerptHtml.map((chunk, index) => {
                      const isTermSelected = selectedTermId === chunk.termId;
                      const termData = DOPPLER_DICTIONARY[chunk.termId];
                      const isAlert = chunk.termId === 'non-compressible-alert';
                      return (
                        <React.Fragment key={index}>
                          {chunk.textBefore}
                          <button
                            onClick={() => handleSelectTerm(chunk.termId)}
                            title={`Click to inspect: ${chunk.termLabel}`}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 my-1 rounded-md text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                              isTermSelected
                                ? isAlert
                                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400'
                                  : 'bg-[#063B36] text-[#FAF7F2] shadow-sm ring-2 ring-[#7FD4D0]'
                                : isAlert
                                ? 'bg-rose-100 text-rose-900 border border-rose-300 hover:bg-rose-200'
                                : 'bg-[#E4ECE8] text-[#063B36] border border-[#063B36]/25 hover:bg-[#7FD4D0]/30 hover:border-[#063B36]'
                            }`}
                          >
                            <span>{chunk.termLabel}</span>
                            <Info className="w-3 h-3 opacity-80" />
                          </button>
                          {chunk.textAfter}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  {/* Mobile active finding helper chip */}
                  {selectedTerm && (
                    <div className="lg:hidden mt-3 p-3 bg-[#E4ECE8] rounded-xl flex items-center justify-between text-xs text-[#063B36] border border-[#063B36]/15">
                      <span className="font-medium truncate mr-2">
                        Inspecting finding: <strong className="font-bold">{selectedTerm.term}</strong>
                      </span>
                      <a
                        href="#doppler-term-decoder-panel"
                        className="inline-flex items-center gap-1 font-semibold text-[#0A3B32] hover:text-[#084D46] underline shrink-0 cursor-pointer"
                      >
                        Inspect Definition &darr;
                      </a>
                    </div>
                  )}
                </div>

                {/* Sonographer Impression Box */}
                <div className="p-4 rounded-[14px] bg-[#E4ECE8]/40 border border-[#063B36]/15 flex items-start gap-3">
                  <Stethoscope className="w-4 h-4 text-[#063B36] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-[#063B36] block mb-0.5">Sonographer Summary Impression:</span>
                    <span className="text-[#4A5563] italic">&ldquo;{activeReport.sonographerNotes}&rdquo;</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Plain-English Term Decoder Side Panel */}
              <div id="doppler-term-decoder-panel" className="lg:col-span-5 bg-white rounded-[24px] border border-[#063B36]/15 shadow-sm p-6 sm:p-7 sticky top-24 scroll-mt-28">
                {selectedTerm ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#063B36]/10 text-[#063B36] font-semibold">
                          {selectedTerm.category}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${selectedTerm.urgencyBadgeColor}`}>
                          {selectedTerm.urgencyLevel}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#063B36] leading-snug">
                        {selectedTerm.term}
                      </h3>
                    </div>

                    {/* Urgent DVT Alert Warning Box if critical finding */}
                    {selectedTerm.id === 'non-compressible-alert' && (
                      <div className="p-4 rounded-[14px] bg-rose-50 border border-rose-300 text-rose-900 text-xs space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-rose-700">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>HIGH URGENCY CLINICAL FINDING</span>
                        </div>
                        <p className="leading-relaxed">
                          A non-compressible deep vein indicates a blood clot (DVT). This requires immediate professional medical assessment to initiate anticoagulation therapy. If accompanied by shortness of breath or chest pain, seek emergency care immediately.
                        </p>
                      </div>
                    )}

                    {/* Plain English Translation */}
                    <div className="p-4 rounded-[16px] bg-[#FAF7F2] border border-[#063B36]/10">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#063B36] block mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#063B36]" />
                        <span>Plain-English Translation</span>
                      </span>
                      <p className="text-xs sm:text-sm text-[#4A5563] leading-relaxed">
                        {selectedTerm.plainEnglish}
                      </p>
                    </div>

                    {/* Anatomical Context */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#707E94] block mb-1">
                        Anatomical Location:
                      </span>
                      <p className="text-xs text-[#4A5563] leading-relaxed">
                        {selectedTerm.anatomicalContext}
                      </p>
                    </div>

                    {/* Clinical Threshold Metric */}
                    <div className="p-3.5 rounded-[12px] bg-[#E4ECE8]/50 border border-[#063B36]/15">
                      <span className="text-[11px] font-semibold text-[#063B36] uppercase tracking-wide block mb-1">
                        Clinical Guideline Threshold:
                      </span>
                      <p className="text-xs text-[#1B2430] font-mono leading-relaxed">
                        {selectedTerm.clinicalThreshold}
                      </p>
                    </div>

                    {/* Questions to Discuss with your Physician */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#063B36] block mb-2 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#E88970]" />
                        <span>Questions for Your Doctor:</span>
                      </span>
                      <ul className="space-y-2">
                        {selectedTerm.questionsForDoctor.map((q, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-[#4A5563] pl-3.5 relative before:content-['•'] before:absolute before:left-0 before:text-[#063B36] before:font-bold"
                          >
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contextual Action Journey Buttons */}
                    <div className="pt-2 border-t border-[#063B36]/10 flex flex-col gap-2">
                      {selectedTerm.questionsForDoctor && selectedTerm.questionsForDoctor.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            onClick={() => handleSaveTermQuestions(selectedTerm)}
                            className="tap-tactile min-h-[44px] w-full py-2.5 px-3 rounded-full bg-[#063B36] hover:bg-[#084D46] text-[#FAF7F2] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-mv-terracotta shrink-0" />
                            <span className="truncate">Save to Dossier</span>
                          </button>
                          <button
                            onClick={() => handleCopyQuestions(selectedTerm)}
                            className="tap-tactile min-h-[44px] w-full py-2.5 px-3 rounded-full bg-[#FAF7F2] hover:bg-[#E4ECE8] text-[#063B36] border border-[#063B36]/20 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Copy className="w-3.5 h-3.5 text-[#063B36] shrink-0" />
                            <span className="truncate">Copy Questions</span>
                          </button>
                        </div>
                      )}

                      {onNavigateToTreatments && (
                        <button
                          onClick={onNavigateToTreatments}
                          className="tap-tactile min-h-[44px] w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#063B36] border border-[#063B36]/20 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Explore Treatments for this Finding</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleAskAiAboutTerm(selectedTerm)}
                        className="tap-tactile min-h-[44px] w-full py-2 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#E4ECE8] text-[#063B36] text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <GuideIcon className="w-3.5 h-3.5 text-[#C85A3F]" aria-hidden="true" />
                        <span>{askGuideAbout('this finding')}</span>
                      </button>

                      {onBookConsultation && (
                        <button
                          onClick={onBookConsultation}
                          className="tap-tactile min-h-[44px] w-full py-2 px-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#54635D] text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Request an appointment (demo) &rarr;</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#707E94]">
                    <Search className="w-8 h-8 mx-auto text-[#063B36]/30 mb-2" />
                    <p className="text-sm">Select any highlighted term on the left to view its explanation.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM REPORT EXCERPT PASTE */}
        {activeTab === 'custom' && (
          <div className="bg-white rounded-[24px] border border-[#063B36]/15 shadow-sm p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="max-w-3xl mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#063B36]">
                Analyze Your Own Doppler Ultrasound Report Excerpt
              </h2>
              <p className="text-sm text-[#4A5563] mt-2 leading-relaxed">
                Copy and paste a sentence or paragraph from your lower extremity duplex examination. Meridian Vascular scans against verified vascular anatomy and hemodynamic thresholds to identify recognized medical terms and potential safety red flags.
              </p>
            </div>

            {/* Privacy & Safety Callout */}
            <div className="p-4 rounded-[16px] bg-[#FAF7F2] border border-[#063B36]/10 mb-6 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#063B36] shrink-0 mt-0.5" />
              <div className="text-xs text-[#4A5563] space-y-1">
                <span className="font-bold text-[#063B36] block">Strict Patient Privacy Notice:</span>
                <p>
                  Do not paste identifying personal information (such as full names, social security numbers, or addresses). Your pasted excerpt is analyzed in your browser for recognized medical terms; we do not store your medical documents without your explicit permission.
                </p>
              </div>
            </div>

            {/* Textarea Input */}
            <div className="mb-6">
              <label htmlFor="custom-report-text" className="block text-xs font-semibold text-[#063B36] uppercase tracking-wider mb-2">
                Report Text Excerpt:
              </label>
              <textarea
                id="custom-report-text"
                rows={5}
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setCustomTextSubmitted(false);
                }}
                placeholder="Example: 'Right leg venous duplex demonstrates saphenofemoral junction incompetence with retrograde reflux of 2.1 seconds in the proximal great saphenous vein. The common femoral vein is compressible and patent with no deep vein thrombosis.'"
                className="w-full p-4 rounded-[16px] border border-[#063B36]/20 bg-[#FAF7F2]/50 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#063B36] focus:border-transparent transition-all"
              />
              <div className="flex items-center justify-between text-xs text-[#707E94] mt-2">
                <span>{customText.trim() ? `${customText.trim().split(/\s+/).length} words entered` : 'Ready for input'}</span>
                {customText.length > 0 && (
                  <button
                    onClick={() => {
                      setCustomText('');
                      setCustomTextSubmitted(false);
                    }}
                    className="text-xs text-[#707E94] hover:text-[#063B36] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear Text
                  </button>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                onClick={() => setCustomTextSubmitted(true)}
                disabled={!customText.trim()}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  customText.trim()
                    ? 'bg-[#063B36] text-[#FAF7F2] hover:bg-[#084D46] shadow-sm'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Scan for Known Hemodynamic Terms</span>
              </button>

              {customAnalysis && customAnalysis.detectedTerms.length > 0 && (
                <button
                  onClick={handleAskAiAboutCustomExcerpt}
                  className="px-5 py-2.5 rounded-full bg-[#E4ECE8] text-[#063B36] hover:bg-[#7FD4D0]/30 border border-[#063B36]/20 text-sm font-medium transition-all flex items-center gap-2 cursor-pointer"
                >
                  <GuideIcon className="w-4 h-4 text-[#E88970]" aria-hidden="true" />
                  <span>{askGuideAbout('this excerpt')}</span>
                </button>
              )}
            </div>

            {/* Analysis Results Display */}
            {customTextSubmitted && customAnalysis && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                {/* 1. Acute DVT Red Flag Notice (True Positive Only) */}
                {customAnalysis.hasUrgentDvtFinding && (
                  <div className="p-5 rounded-[18px] bg-rose-50 border border-rose-400 text-rose-900 space-y-2">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>URGENT SAFETY ALERT: Potential Deep Vein Thrombosis (DVT) Finding</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Your excerpt describes an uncompressed vein segment or intraluminal thrombus. In lower extremity ultrasound, failure of a deep vein to compress under transducer pressure is the cardinal diagnostic finding of Deep Vein Thrombosis. This requires <strong>urgent professional physician evaluation</strong> to evaluate anticoagulation. If accompanied by sudden severe calf swelling or acute chest discomfort, seek emergency evaluation immediately.
                    </p>
                  </div>
                )}

                {/* 2. Neutral Description of Explicit Negation / Compressibility in Text */}
                {customAnalysis.hasNegatedDvtFinding && !customAnalysis.hasUrgentDvtFinding && (
                  <div className="p-4 rounded-[18px] bg-slate-50 border border-slate-200 text-slate-800 flex items-start gap-3">
                    <Info className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        Report Excerpt Text: Described as Negative for Clot / Compressible
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        The supplied text fragment explicitly describes deep veins as compressible or negative for DVT. <strong>Important Note:</strong> This summary reflects solely the words in the provided text excerpt. It cannot establish overall clinical normalcy, complete exam adequacy, or rule out venous disease without an in-person review of complete Doppler cine loops and clinical correlation by your vascular specialist.
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. Incomplete / Truncated Text Warning */}
                {customAnalysis.isIncompleteOrShort && (
                  <div className="p-4 rounded-[16px] bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold block mb-0.5">Brief / Truncated Excerpt:</span>
                      <p className="leading-relaxed">
                        The entered text is very brief (under 5 words). Formal vascular ultrasound reports typically identify specific named vein segments (e.g. SFJ, GSV, Popliteal) alongside numerical reflux durations and vein calibers in millimeters.
                      </p>
                    </div>
                  </div>
                )}

                {/* 4. Matched Vocabulary Cards */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif text-lg font-bold text-[#063B36]">
                      Identified Vascular Terminology ({customAnalysis.detectedTerms.length})
                    </h3>
                    <span className="text-[11px] font-mono text-[#707E94]">
                      Status: {customAnalysis.detectedTerms.length > 0 ? 'Mapped' : 'No Matches'}
                    </span>
                  </div>

                  {customAnalysis.detectedTerms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customAnalysis.detectedTerms.map((termMatch, i) => {
                        const termDef = DOPPLER_DICTIONARY[termMatch.termId];
                        return (
                          <div
                            key={i}
                            className="p-5 rounded-[18px] bg-[#FAF7F2] border border-[#063B36]/15 flex flex-col justify-between space-y-3"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                                <span className="text-[10px] font-mono uppercase bg-[#063B36]/10 text-[#063B36] px-2 py-0.5 rounded-full font-semibold">
                                  {termDef ? termDef.category : 'Vascular Term'}
                                </span>
                                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                                  termMatch.status === 'urgent'
                                    ? 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
                                    : termMatch.status === 'negated' || termMatch.status === 'reported-negative'
                                    ? 'bg-slate-100 text-slate-800 border-slate-300 font-medium'
                                    : 'bg-amber-100 text-amber-900 border-amber-300 font-medium'
                                }`}>
                                  {termMatch.status === 'urgent'
                                    ? 'High Urgency'
                                    : termMatch.status === 'negated'
                                    ? 'Negated in Text'
                                    : termMatch.status === 'reported-negative'
                                    ? 'Described Negative in Text'
                                    : 'Reflux Documented'}
                                </span>
                              </div>

                              <div className="font-serif text-base font-bold text-[#063B36]">
                                {termMatch.termLabel}
                              </div>

                              <div className="text-[11px] font-mono text-[#707E94] bg-white/80 p-2 rounded-md my-2 border border-[#063B36]/8">
                                <span className="font-semibold text-[#063B36]">Excerpt matched: </span>
                                &ldquo;{termMatch.sourceClause}&rdquo;
                              </div>

                              <p className="text-xs text-[#4A5563] leading-relaxed">
                                {termMatch.explanation}
                              </p>
                            </div>

                            {termDef && (
                              <button
                                onClick={() => handleAskAiAboutTerm(termDef)}
                                className="self-start text-xs font-semibold text-[#063B36] hover:underline flex items-center gap-1 cursor-pointer pt-2"
                              >
                                <span>Explore in the guide</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-6 rounded-[18px] bg-[#FAF7F2] border border-[#063B36]/10 text-center">
                      <Info className="w-6 h-6 text-[#707E94] mx-auto mb-2" />
                      <p className="text-sm text-[#4A5563] font-medium">
                        No standard varicose hemodynamic keywords (e.g. SFJ, reflux, caliber, perforator, DVT) were matched in this excerpt.
                      </p>
                      <p className="text-xs text-[#707E94] mt-1 max-w-lg mx-auto">
                        Meridian Vascular only highlights verified vascular terms from published consensus criteria (SVS/AVF). We never guess or fabricate clinical interpretations. You can open this excerpt in the educational guide for general, pre-written explanations.
                      </p>
                    </div>
                  )}
                </div>

                {/* Explicit Non-Diagnostic Disclaimer Box */}
                <div className="p-4 rounded-[14px] bg-[#FAF7F2] border border-[#063B36]/10 text-[11px] text-[#707E94] leading-relaxed">
                  <span className="font-bold text-[#063B36] block mb-0.5">Educational Terminology Explorer (Non-Diagnostic):</span>
                  This tool performs educational pattern matching against published clinical guidelines (SVS/AVF/AVLS). It is not a diagnostic device or a substitute for professional interpretation by an accredited vascular technologist and interpreting physician.
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
