import React, { useState } from 'react';
import {
  Scale,
  Shield,
  Clock,
  Activity,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  Info,
  ExternalLink,
  SlidersHorizontal,
  BookmarkCheck
} from 'lucide-react';
import { GUIDE_LABELS, GuideIcon } from '../content/guideLabels';

export interface TreatmentModalityDetail {
  id: string;
  name: string;
  shortName: string;
  category: 'Thermal Ablation' | 'Non-Thermal Non-Tumescent' | 'Chemical Ablation' | 'Micro-Surgical' | 'Clinical Standards';
  mechanism: string;
  idealAnatomy: string;
  anesthesiaType: string;
  compressionStockings: string;
  recoveryTimeline: string;
  limitationsAndRisks: string[];
  evidenceBasis: string;
  guidelineRecommendation: string;
  pricingNotice: string;
  keyQuestionsForDoctor: string[];
}

export const TREATMENT_COMPARISON_DATA: TreatmentModalityDetail[] = [
  {
    id: 'parameter',
    name: 'Clinical Parameters & Modality Selection',
    shortName: 'Parameter',
    category: 'Clinical Standards',
    mechanism: 'Evidence-based hemodynamic and anatomical parameters (including standing duplex reflux duration >=500ms, vein caliber 5-15mm, vessel tortuosity, and skin proximity) synthesized from SVS, AVF, and NICE CG168 consensus standards to guide optimal procedure selection.',
    idealAnatomy: 'Baseline clinical assessment parameters applied across all CEAP stages (C2 to C6) to determine whether axial saphenous trunks, branch varicosities, or perforators are indicated for treatment.',
    anesthesiaType: 'Outpatient parameters range from perivenous tumescent anesthesia (EVLA, RFA) to targeted local numbing (Micro-Phlebectomy, VenaSeal) or needleless foam delivery (UGFS).',
    compressionStockings: 'Graduated compression therapy (20-30 mmHg or 30-40 mmHg) prescribed according to procedural modality, edema severity, and ulcer healing needs.',
    recoveryTimeline: 'All modern endovenous parameters are designed for immediate unassisted ambulation and same-day discharge within 45-60 minutes.',
    limitationsAndRisks: [
      'Anatomical parameters must be verified via standing bilateral venous duplex ultrasound before procedural selection',
      'Tortuous veins with severe acute angulation (>60°) preclude rigid laser or RFA catheter navigation',
      'Veins situated less than 5mm beneath the skin surface carry higher cutaneous heat risk with thermal modalities'
    ],
    evidenceBasis: 'Synthesized from international consensus guidelines: Society for Vascular Surgery (SVS), American Venous Forum (AVF), and NICE Guideline CG168.',
    guidelineRecommendation: 'SVS / AVF & NICE Consensus Benchmark',
    pricingNotice: 'Diagnostic duplex ultrasound parameters are cashless-covered under all major Indian TPAs (Star Health, ICICI Lombard, HDFC ERGO, Care Health, Niva Bupa) for procedural pre-authorization.',
    keyQuestionsForDoctor: [
      'What specific ultrasound parameters (reflux duration and vein diameter) determine which treatment is best for me?',
      'Does my vein depth or tortuosity eliminate any of the thermal or adhesive options?',
      'Will my procedure require a single modality or a combination of trunk ablation and branch removal?'
    ]
  },
  {
    id: 'phlebectomy',
    name: 'Ambulatory Micro-Phlebectomy',
    shortName: 'Micro-Phlebectomy',
    category: 'Micro-Surgical',
    mechanism: 'Through tiny 1-2 mm micro-incisions made under local numbing, specialized micro-hooks extract bulging, twisted surface varicosities segment by segment. The tiny punctures close with sterile adhesive strips (no stitches required).',
    idealAnatomy: 'Bulging, rope-like, prominent surface varicosities that are too convoluted or dilated for laser fibers or simple sclerotherapy.',
    anesthesiaType: 'Local infiltration anesthesia along the targeted skin clusters.',
    compressionStockings: 'Pressure dressing for 48 hours, followed by graduated compression stockings for 1 to 2 weeks.',
    recoveryTimeline: 'Immediate relief from painful bulging veins and heavy contour distortion. Minor bruising resolves over 2-3 weeks.',
    limitationsAndRisks: [
      'Requires micro-incisions (though typically invisible once healed)',
      'Transient localized bruising and small hematomas along the extraction tracts',
      'Temporary tiny skin numbness patches near the micro-punctures',
      'Does NOT fix the underlying saphenous reflux trunk—must be combined with EVLA, RFA, or VenaSeal if axial reflux is present'
    ],
    evidenceBasis: 'Direct physical excision yields extremely low local recurrence (<5%) for removed vein clusters; does not prevent adjacent untreated refluxing veins from dilating.',
    guidelineRecommendation: 'Gold standard for large, bulging symptomatic tributary varicosities.',
    pricingNotice: 'Covered by Indian mediclaim when performed concurrently with truncal ablation for symptomatic, bulging branch varicosities.',
    keyQuestionsForDoctor: [
      'Will micro-phlebectomy be performed during the same appointment as my saphenous ablation?',
      'How noticeable will the tiny puncture marks be once completely healed?',
      'How soon can I shower and remove the initial pressure bandages?'
    ]
  },
  {
    id: 'ugfs',
    name: 'Ultrasound-Guided Foam Sclerotherapy (UGFS)',
    shortName: 'Foam Sclerotherapy',
    category: 'Chemical Ablation',
    mechanism: 'A liquid sclerosant (such as Polidocanol or Sodium Tetradecyl Sulfate) is mixed with physiological gas to create a microfoam. Under live ultrasound visualization, the foam is injected into tortuous or recurrent veins, displacing blood and causing chemical endothelia spasm and closure.',
    idealAnatomy: 'Tortuous, curved branch varicosities, veins recurrent after past surgery, perforator veins, or venous ulcer bed feeder vessels.',
    anesthesiaType: 'None required. The micro-injections use tiny needles and cause minimal sensation.',
    compressionStockings: 'Strict compression (bandages or 30-40 mmHg stockings) is crucial for 1 to 2 weeks to keep the vein collapsed during healing.',
    recoveryTimeline: 'Immediate walking. Avoid hot baths, saunas, and intense sun exposure to prevent skin pigmentation.',
    limitationsAndRisks: [
      'Higher long-term reopening rate (occlusion ranges 65-80% at 5 years) when used alone in large primary saphenous trunks',
      'Risk of superficial trapped blood pockets (thrombophlebitis) requiring needle evacuation',
      'Temporary brownish hemosiderin skin staining (hyperpigmentation) in 10-20% of patients',
      'Very rare transient visual scotoma or migraine-like aura due to micro-bubbles'
    ],
    evidenceBasis: 'Clinical practice guidelines (SVS/AVF, NICE CG168) recommend UGFS primarily for branch varicosities, perforators, or as an adjunct to thermal trunk ablation, rather than sole therapy for large straight saphenous trunks.',
    guidelineRecommendation: 'Class 1B recommendation for tributary varicosities and recurrent veins.',
    pricingNotice: 'In-office procedure. Typically covered by Indian health policies when treating symptomatic branch varicosities associated with documented venous insufficiency.',
    keyQuestionsForDoctor: [
      'Will foam sclerotherapy be used as an adjunct alongside laser/radiofrequency or as a stand-alone treatment?',
      'What is my personal risk of temporary skin staining or brown discoloration?',
      'How many follow-up sessions might be needed to eliminate all residual branches?'
    ]
  },
  {
    id: 'rfa',
    name: 'Radiofrequency Ablation (RFA / ClosureFast)',
    shortName: 'Radiofrequency (RFA)',
    category: 'Thermal Ablation',
    mechanism: 'A 7cm bipolar catheter element delivers controlled 120°C thermal energy in repeatable 20-second segments, denaturing collagen in the vein wall and inducing complete luminal contraction without charring.',
    idealAnatomy: 'Relatively straight Great Saphenous Vein or Anterior Accessory Saphenous Vein with documented axial reflux.',
    anesthesiaType: 'Tumescent local anesthesia required along the perivascular sheath for thermal heat absorption.',
    compressionStockings: 'Prescription compression stockings (20-30 mmHg) for 7 to 10 days post-procedure.',
    recoveryTimeline: 'Immediate walking. Most patients report less post-operative tenderness and bruising than earlier-generation bare lasers. Resume desk duties in 24-48 hours.',
    limitationsAndRisks: [
      'Requires straight anatomical segments of at least 7cm length for catheter heating element deployment',
      'Requires tumescent infiltration needle punctures',
      'Slight vein induration / cord sensation during the second week as body resorbs sealed vein'
    ],
    evidenceBasis: 'Comparative trials (e.g. CLOSURE and EVLA vs RFA trials) show 90%–94% 5-year occlusion, demonstrating equivalent clinical efficacy to laser ablation with reduced immediate post-op discomfort scores.',
    guidelineRecommendation: 'Class 1A first-line treatment for saphenous vein reflux.',
    pricingNotice: 'Standard coverage across leading Indian health insurers and corporate mediclaim policies for documented saphenous insufficiency. Day-care procedure requiring zero overnight hospitalization.',
    keyQuestionsForDoctor: [
      'Is RFA or laser preferred based on the depth of my vein beneath the skin?',
      'How does the 20-second segment heating process feel during the procedure?',
      'Will I be able to drive home, or should I arrange transport?'
    ]
  },
  {
    id: 'evla',
    name: 'Endovenous Laser Ablation (EVLA / EVLT)',
    shortName: 'Laser (EVLA)',
    category: 'Thermal Ablation',
    mechanism: 'A hair-thin radial laser fiber emits targeted wavelength thermal energy (typically 1470nm), boiling blood water and collapsing the inner vein wall (endothelium) to seal the vessel shut permanently.',
    idealAnatomy: 'Straight, non-tortuous Great or Small Saphenous Veins with significant axial reflux and diameters typically between 5 mm and 15 mm.',
    anesthesiaType: 'Tumescent local anesthesia (multiple saline/lidocaine injections around the vein sheath to cushion adjacent tissues from heat).',
    compressionStockings: 'Graduated compression (20-30 mmHg) typically advised for 7 to 14 days post-procedure.',
    recoveryTimeline: 'Immediate ambulation; patients walk out unassisted. Desk work resumed next day. Heavy lifting and high-impact cardio paused for 5-7 days.',
    limitationsAndRisks: [
      'Not suitable for highly twisted, corkscrew superficial tortuosities (laser fiber cannot navigate sharp curves)',
      'Transient bruising, tightness along the inner thigh (vein cord sensation)',
      'Rare risk of temporary sensory nerve numbness (saphenous or sural nerve irritation) if treated below mid-calf'
    ],
    evidenceBasis: 'Randomized controlled trials (e.g. CLASS trial, Rass et al.) demonstrate 90%–95% 5-year anatomical occlusion. Endorsed as first-line Class 1A therapy by NICE CG168 and SVS/AVF guidelines.',
    guidelineRecommendation: 'Class 1A first-line recommendation for axial saphenous incompetence.',
    pricingNotice: 'Eligible for cashless mediclaim pre-authorization under major Indian TPAs (Star Health, ICICI Lombard, HDFC ERGO, Care Health, Niva Bupa) when standing duplex confirms pathologic reflux (>500ms) and symptomatic presentation (CEAP C2–C6). Day-care admission typically approved within 3–4 hours.',
    keyQuestionsForDoctor: [
      'What laser wavelength is utilized (e.g. 1470nm radial vs bare tip) to minimize post-treatment bruising?',
      'How much tumescent anesthesia fluid will be needed along my thigh?',
      'Does my saphenous vein remain straight enough below the knee for safe catheter passage?'
    ]
  },
  {
    id: 'venaseal',
    name: 'VenaSeal Medical Cyanoacrylate Adhesive',
    shortName: 'VenaSeal (Glue)',
    category: 'Non-Thermal Non-Tumescent',
    mechanism: 'A specially formulated medical-grade cyanoacrylate polymer is micro-dispensed through a dispenser catheter while external ultrasound compression is applied. The adhesive polymerizes upon contact with blood, gluing the vein closed without heat.',
    idealAnatomy: 'Incompetent Great or Small Saphenous Veins, particularly when avoiding multiple needle sticks or compression stockings is clinically indicated.',
    anesthesiaType: 'Single local anesthetic numbing injection at catheter access site only (eliminates extensive tumescent fluid sticks along the leg).',
    compressionStockings: 'Post-procedure compression stockings are not mandated by manufacturer protocol, though light compression may be advised by individual clinicians for concomitant branch varicosities.',
    recoveryTimeline: 'Immediate return to daily activities and light exercise. Pause strenuous heavy lifting and high-impact sports for 3 to 7 days. Zero risk of thermal burn.',
    limitationsAndRisks: [
      'Approximately 5-10% of patients experience a transient localized inflammatory reaction (phlebitis-like redness or itching) as the immune system responds to the polymer',
      'The polymerized adhesive remains permanently inside the vein body (inert foreign material)',
      'Not recommended for patients with known hypersensitivity to cyanoacrylates'
    ],
    evidenceBasis: 'The 5-year randomized VeClose trial reported 94.6% occlusion, demonstrating non-inferiority to radiofrequency ablation.',
    guidelineRecommendation: 'Recognized as an effective non-thermal alternative in updated international venous guidelines.',
    pricingNotice: 'Covered under select comprehensive corporate policies and modern private health insurances; some traditional TPAs may classify medical glue as an advanced non-thermal implant requiring specific clinician justification.',
    keyQuestionsForDoctor: [
      'Does my individual insurance plan cover VenaSeal or will prior authorization be needed?',
      'What is the likelihood of a temporary inflammatory or allergic skin reaction?',
      'Is VenaSeal suitable if my vein is very close to the skin surface?'
    ]
  }
];

interface TreatmentComparisonProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  onBookConsultation?: () => void;
  onNavigateToSpecialists?: () => void;
  onAddQuestionsToDossier?: (questions: string[], sourceName: string) => void;
}

export const TreatmentComparison: React.FC<TreatmentComparisonProps> = ({
  onOpenAiWithPrompt,
  onBookConsultation,
  onNavigateToSpecialists,
  onAddQuestionsToDossier,
}) => {
  const [selectedTxId, setSelectedTxId] = useState<string>('parameter');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const selectedModality = TREATMENT_COMPARISON_DATA.find((t) => t.id === selectedTxId) || TREATMENT_COMPARISON_DATA[0];

  const handleAskAiAboutModality = (modality: TreatmentModalityDetail) => {
    if (onOpenAiWithPrompt) {
      const prompt = `I am researching varicose vein treatments and would like to learn more about ${modality.name}. How does it compare to other options regarding anesthesia, recovery, and suitability for my vein anatomy? What questions should I bring to my consultation?`;
      onOpenAiWithPrompt(prompt);
    }
  };

  const handleSaveQuestionsToDossier = (modality: TreatmentModalityDetail) => {
    if (onAddQuestionsToDossier) {
      onAddQuestionsToDossier(modality.keyQuestionsForDoctor, modality.shortName);
      setSavedToast(`Added ${modality.keyQuestionsForDoctor.length} questions to your Doctor Visit Dossier`);
      setTimeout(() => setSavedToast(null), 3500);
    }
  };

  return (
    <section id="treatment-comparison" className="py-14 sm:py-20 bg-[#FAF7F2] border-b border-mv-outline/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating Toast Notification */}
        {savedToast && (
          <div className="fixed bottom-24 right-5 z-50 bg-mv-forest text-white px-5 py-3 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2 border border-mv-forest/20 animate-in fade-in slide-in-from-bottom-2">
            <BookmarkCheck className="w-4 h-4 text-mv-terracotta" />
            <span>{savedToast}</span>
          </div>
        )}

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mv-cream border border-mv-outline/70 text-mv-forest text-[11px] font-mono font-semibold uppercase tracking-[0.14em] mb-4">
            <Scale className="w-3.5 h-3.5 text-mv-forest" />
            <span>Clinical Modality Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-mv-forest tracking-tight">
            Clinical Treatment Modality Comparison
          </h2>
          <p className="mt-4 text-base sm:text-lg text-mv-ink-muted leading-relaxed">
            Painful surgical vein stripping is historically obsolete. Modern vein care relies on outpatient, minimally invasive techniques tailored to your specific vein anatomy, caliber, and lifestyle. Compare mechanisms, recovery requirements, and clinical guidelines below.
          </p>
        </div>

        {/* Educational Modality Notice vs Individual Prescription */}
        <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-white border border-mv-outline/70 text-mv-ink flex items-start gap-3.5 shadow-2xs">
          <Info className="w-5 h-5 text-mv-forest shrink-0 mt-0.5" />
          <div className="text-xs sm:text-[13px] leading-relaxed">
            <span className="font-semibold text-mv-forest block mb-1">
              Educational Modality Comparison · Not a Personalized Surgical Recommendation
            </span>
            <p className="text-mv-ink-muted">
              These parameters (ablation mechanisms, tumescent anesthesia needs, compression requirements, and anatomical guidelines) are synthesized from international consensus standards (SVS, AVF, NICE CG168). <strong>They do not constitute personalized medical recommendations.</strong> The appropriate procedure for your legs depends strictly on your standing duplex ultrasound map, vein depth, tortuosity, and direct examination by your treating vascular specialist.
            </p>
          </div>
        </div>

        {/* View Mode Switcher & Modality Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-mv-outline/60">
          {/* Modality Selector Tabs */}
          <div className="flex flex-wrap gap-2.5">
            {TREATMENT_COMPARISON_DATA.map((tx) => {
              const isSelected = selectedTxId === tx.id;
              return (
                <button
                  key={tx.id}
                  onClick={() => {
                    setSelectedTxId(tx.id);
                    if (viewMode === 'matrix') setViewMode('cards');
                  }}
                  className={`tap-tactile min-h-[44px] px-4.5 py-2.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                    isSelected && viewMode === 'cards'
                      ? 'bg-mv-forest text-white shadow-xs'
                      : 'bg-white text-mv-forest border border-mv-outline/70 hover:bg-mv-cream'
                  }`}
                >
                  {tx.shortName}
                </button>
              );
            })}
          </div>

          {/* Segmented Control for View Mode */}
          <div className="inline-flex p-1 rounded-full bg-white border border-mv-outline/70 shadow-2xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`tap-tactile min-h-[38px] px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-mv-forest text-white shadow-xs'
                  : 'text-mv-ink-muted hover:text-mv-forest'
              }`}
            >
              Detailed Dossiers
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`tap-tactile min-h-[38px] px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                viewMode === 'matrix'
                  ? 'bg-mv-forest text-white shadow-xs'
                  : 'text-mv-ink-muted hover:text-mv-forest'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Side-by-Side Table</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: DETAILED DOSSIER CARD */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            
            {/* Left: Comprehensive Modality Dossier */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-mv-outline/70 shadow-2xs p-7 sm:p-9 space-y-7">
              
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-mv-outline/60 gap-3">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-mv-terracotta font-bold block mb-1">
                    {selectedModality.category}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-mv-forest tracking-tight">
                    {selectedModality.name}
                  </h2>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-mv-cream text-mv-forest border border-mv-outline/70">
                    {selectedModality.guidelineRecommendation}
                  </span>
                </div>
              </div>

              {/* Principle & Mechanism */}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-mv-forest font-bold block mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-mv-forest" />
                  <span>How It Works (Mechanism):</span>
                </span>
                <p className="text-[14px] text-mv-ink-muted leading-relaxed">
                  {selectedModality.mechanism}
                </p>
              </div>

              {/* 3-Column Quick Metrics Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4.5 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60">
                  <span className="text-[11px] font-mono font-semibold text-mv-ink-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-mv-forest" /> Anesthesia
                  </span>
                  <p className="text-xs text-mv-forest font-medium leading-relaxed">
                    {selectedModality.anesthesiaType}
                  </p>
                </div>

                <div className="p-4.5 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60">
                  <span className="text-[11px] font-mono font-semibold text-mv-ink-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-mv-forest" /> Compression
                  </span>
                  <p className="text-xs text-mv-forest font-medium leading-relaxed">
                    {selectedModality.compressionStockings}
                  </p>
                </div>

                <div className="p-4.5 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60">
                  <span className="text-[11px] font-mono font-semibold text-mv-ink-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mv-forest" /> Recovery
                  </span>
                  <p className="text-xs text-mv-forest font-medium leading-relaxed">
                    {selectedModality.recoveryTimeline}
                  </p>
                </div>
              </div>

              {/* Ideal Anatomical Candidates */}
              <div className="p-5 rounded-2xl bg-mv-cream/70 border border-mv-outline/70">
                <span className="text-xs font-mono font-bold text-mv-forest uppercase tracking-wider block mb-1.5">
                  Optimal Vein Anatomy &amp; Suitability:
                </span>
                <p className="text-xs sm:text-[13px] text-mv-ink-muted leading-relaxed">
                  {selectedModality.idealAnatomy}
                </p>
              </div>

              {/* Limitations & Risks */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-mv-terracotta block mb-2.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-mv-terracotta" />
                  <span>Clinical Limitations &amp; Considerations:</span>
                </span>
                <ul className="space-y-2">
                  {selectedModality.limitationsAndRisks.map((risk, i) => (
                    <li
                      key={i}
                      className="text-xs sm:text-[13px] text-mv-ink-muted pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-mv-terracotta before:font-bold leading-relaxed"
                    >
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Clinical Evidence & Coverage Transparency */}
              <div className="pt-5 border-t border-mv-outline/60 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <span className="font-semibold text-mv-forest block mb-1">Published Evidence Basis:</span>
                  <p className="text-mv-ink-muted leading-relaxed">{selectedModality.evidenceBasis}</p>
                </div>
                <div>
                  <span className="font-semibold text-mv-forest block mb-1">Insurance &amp; Financial Transparency:</span>
                  <p className="text-mv-ink-muted leading-relaxed">{selectedModality.pricingNotice}</p>
                </div>
              </div>
            </div>

            {/* Right: Questions for Doctor & Actions */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Specialist Questions Card */}
              <div className="bg-white rounded-3xl border border-mv-outline/70 shadow-2xs p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-mv-terracotta" />
                  <h3 className="font-serif text-lg font-bold text-mv-forest">
                    Questions to Ask Your Specialist
                  </h3>
                </div>
                <p className="text-xs text-mv-ink-muted leading-relaxed">
                  Take these targeted questions to your clinical consultation regarding {selectedModality.shortName}:
                </p>

                <ul className="space-y-2.5">
                  {selectedModality.keyQuestionsForDoctor.map((q, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-mv-ink-muted p-3.5 rounded-2xl bg-[#FAF7F2] border border-mv-outline/60 leading-relaxed"
                    >
                      &ldquo;{q}&rdquo;
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    onClick={() => handleSaveQuestionsToDossier(selectedModality)}
                    className="tap-tactile min-h-[44px] w-full py-2.5 px-4 rounded-full bg-mv-forest hover:bg-[#073028] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5 text-mv-terracotta" />
                    <span>Save Questions to Doctor Visit Dossier</span>
                  </button>

                  <button
                    onClick={() => handleAskAiAboutModality(selectedModality)}
                    className="tap-tactile min-h-[44px] w-full py-2.5 px-4 rounded-full bg-white hover:bg-mv-cream text-mv-forest border border-mv-outline/70 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <GuideIcon className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                    <span>Ask the guide about {selectedModality.shortName}</span>
                  </button>
                </div>
              </div>

              {/* Consultation Booking & Specialist Card */}
              <div className="bg-white rounded-3xl border border-mv-outline/70 p-6 sm:p-7 shadow-2xs space-y-3.5">
                <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-mv-terracotta font-bold">
                  In-Person Clinical Evaluation
                </div>
                <h3 className="font-serif text-xl font-bold text-mv-forest">
                  Need Help Deciding?
                </h3>
                <p className="text-xs text-mv-ink-muted leading-relaxed">
                  A standing venous duplex ultrasound is required to measure vein caliber and exact reflux duration before determining if thermal, adhesive, or micro-surgical treatment is optimal for your anatomy.
                </p>
                <div className="flex flex-col gap-2.5 pt-1">
                  {onNavigateToSpecialists && (
                    <button
                      onClick={onNavigateToSpecialists}
                      className="tap-tactile min-h-[44px] w-full py-2.5 px-4 rounded-full bg-mv-forest hover:bg-[#073028] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Find Metro Specialists Offering This</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onBookConsultation && (
                    <button
                      onClick={onBookConsultation}
                      className="tap-tactile min-h-[44px] w-full py-2.5 px-4 rounded-full bg-white hover:bg-mv-cream text-mv-forest border border-mv-outline/70 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Request an appointment (demo)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: SIDE-BY-SIDE MATRIX (RESPONSIVE STACKED FOR MOBILE, TABLE FOR DESKTOP) */}
        {viewMode === 'matrix' && (
          <div className="bg-white rounded-3xl border border-mv-outline/70 shadow-2xs overflow-hidden animate-in fade-in duration-200">
            <div className="p-6 sm:p-7 border-b border-mv-outline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-mv-forest">
                  Side-by-Side Modality Matrix
                </h2>
                <p className="text-xs text-mv-ink-muted mt-1">
                  Direct clinical comparison across all 5 outpatient modalities
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-mv-forest bg-mv-cream border border-mv-outline/70 px-3 py-1 rounded-full">
                SVS / AVF Clinical Consensus
              </span>
            </div>

            {/* Mobile Stacked Modality Cards (< 768px): Zero Horizontal Scrolling Required */}
            <div className="block md:hidden p-5 space-y-4">
              <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-mv-outline/60 text-xs text-mv-ink-muted leading-relaxed">
                <strong className="text-mv-forest">Mobile Comparison View:</strong> All modalities arranged vertically with touch-friendly parameter breakdown.
              </div>
              {TREATMENT_COMPARISON_DATA.map((tx) => (
                <div key={tx.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-mv-outline/70 space-y-3.5 shadow-2xs">
                  <div className="flex items-start justify-between gap-2 border-b border-mv-outline/60 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-mv-terracotta font-bold block mb-0.5">
                        {tx.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-mv-forest">
                        {tx.shortName}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-mv-cream text-mv-forest border border-mv-outline/60 shrink-0">
                      {tx.guidelineRecommendation}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-mv-outline/60">
                      <span className="text-[10px] font-mono font-semibold text-mv-ink-muted uppercase block">Anesthesia</span>
                      <p className="text-[11.5px] text-mv-forest font-medium mt-0.5">{tx.anesthesiaType}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-mv-outline/60">
                      <span className="text-[10px] font-mono font-semibold text-mv-ink-muted uppercase block">Recovery</span>
                      <p className="text-[11.5px] text-mv-forest font-medium mt-0.5">{tx.recoveryTimeline}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-mv-outline/60 col-span-2">
                      <span className="text-[10px] font-mono font-semibold text-mv-ink-muted uppercase block">Compression Stockings</span>
                      <p className="text-[11.5px] text-mv-forest font-medium mt-0.5">{tx.compressionStockings}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-mv-outline/60 col-span-2">
                      <span className="text-[10px] font-mono font-semibold text-mv-ink-muted uppercase block">Optimal Anatomy</span>
                      <p className="text-[11.5px] text-mv-forest font-medium mt-0.5">{tx.idealAnatomy}</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-mv-outline/60 col-span-2">
                      <span className="text-[10px] font-mono font-semibold text-mv-forest uppercase block">Indian Mediclaim / Cashless TPA</span>
                      <p className="text-[11px] text-mv-ink-muted mt-0.5 leading-relaxed">{tx.pricingNotice}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-mv-outline/60">
                    <button
                      onClick={() => {
                        setSelectedTxId(tx.id);
                        setViewMode('cards');
                      }}
                      className="tap-tactile flex-1 min-h-[44px] px-3.5 py-2 rounded-full bg-white hover:bg-mv-cream border border-mv-outline/70 text-mv-forest text-xs font-semibold text-center"
                    >
                      Full Dossier
                    </button>
                    <button
                      onClick={() => handleSaveQuestionsToDossier(tx)}
                      className="tap-tactile min-h-[44px] px-4 py-2 rounded-full bg-mv-forest text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5 text-mv-terracotta" />
                      <span>Save Questions</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= 768px): Full Side-by-Side Matrix */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-mv-outline/60 text-mv-forest">
                    <th className="p-4.5 font-bold uppercase tracking-wider text-[11px] min-w-[140px]">
                      Parameter
                    </th>
                    {TREATMENT_COMPARISON_DATA.filter((tx) => tx.id !== 'parameter').map((tx) => (
                      <th key={tx.id} className="p-4.5 font-bold min-w-[200px]">
                        <div className="font-serif text-sm text-mv-forest">{tx.shortName}</div>
                        <div className="text-[10px] text-mv-ink-muted font-normal">{tx.category}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-mv-outline/60 text-mv-ink-muted">
                  <tr>
                    <td className="p-4.5 font-bold text-mv-forest bg-[#FAF7F2]/60">Anesthesia</td>
                    {TREATMENT_COMPARISON_DATA.filter((tx) => tx.id !== 'parameter').map((tx) => (
                      <td key={tx.id} className="p-4.5 leading-relaxed">
                        {tx.anesthesiaType}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4.5 font-bold text-mv-forest bg-[#FAF7F2]/60">Compression Stockings</td>
                    {TREATMENT_COMPARISON_DATA.filter((tx) => tx.id !== 'parameter').map((tx) => (
                      <td key={tx.id} className="p-4.5 leading-relaxed">
                        {tx.compressionStockings}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4.5 font-bold text-mv-forest bg-[#FAF7F2]/60">Optimal Anatomy</td>
                    {TREATMENT_COMPARISON_DATA.filter((tx) => tx.id !== 'parameter').map((tx) => (
                      <td key={tx.id} className="p-4.5 leading-relaxed">
                        {tx.idealAnatomy}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4.5 font-bold text-mv-forest bg-[#FAF7F2]/60">Recovery &amp; Downtime</td>
                    {TREATMENT_COMPARISON_DATA.filter((tx) => tx.id !== 'parameter').map((tx) => (
                      <td key={tx.id} className="p-4.5 leading-relaxed">
                        {tx.recoveryTimeline}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4.5 font-bold text-mv-forest bg-[#FAF7F2]/60">Guideline Status</td>
                    {TREATMENT_COMPARISON_DATA.filter((tx) => tx.id !== 'parameter').map((tx) => (
                      <td key={tx.id} className="p-4.5">
                        <span className="font-mono font-semibold text-mv-forest bg-mv-cream border border-mv-outline/60 px-2.5 py-0.5 rounded-full text-[10px]">
                          {tx.guidelineRecommendation}
                        </span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-4.5 font-bold text-mv-forest bg-[#FAF7F2]/60">Actions</td>
                    {TREATMENT_COMPARISON_DATA.filter((tx) => tx.id !== 'parameter').map((tx) => (
                      <td key={tx.id} className="p-4.5">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleSaveQuestionsToDossier(tx)}
                            className="text-xs font-semibold text-mv-forest hover:text-mv-terracotta flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <BookmarkCheck className="w-3.5 h-3.5 text-mv-cta" />
                            <span>Save Questions</span>
                          </button>
                          <button
                            onClick={() => handleAskAiAboutModality(tx)}
                            className="text-xs font-semibold text-mv-ink-muted hover:text-mv-forest flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <GuideIcon className="w-3 h-3 text-mv-terracotta" aria-hidden="true" />
                            <span>{GUIDE_LABELS.ask}</span>
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Traceable Clinical Governance References & Review Metadata */}
        <div className="mt-12 p-7 sm:p-8 rounded-3xl bg-white border border-mv-outline/70 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mv-outline/60 gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <BookmarkCheck className="w-4 h-4 text-mv-forest" />
              <h3 className="font-serif text-base font-bold text-mv-forest">
                Clinical Governance &amp; Traceable Guidelines
              </h3>
            </div>
            <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-mv-cream border border-mv-outline/70 text-mv-forest">
              Clinical Review: October 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-mv-ink-muted leading-relaxed">
            <div className="space-y-2.5">
              <p>
                <strong className="text-mv-forest">1. SVS / AVF Consensus Guidelines:</strong> Gloviczki P, Comerota AJ, Dalsing MC, et al. <em>The care of patients with varicose veins and associated chronic venous diseases: Clinical practice guidelines of the Society for Vascular Surgery and the American Venous Forum.</em> J Vasc Surg. 2011;53(5 Suppl):2S-48S.
              </p>
              <p>
                <strong className="text-mv-forest">2. NICE Guideline CG168:</strong> National Institute for Health and Care Excellence. <em>Varicose veins in the legs: diagnosis and management.</em> Clinical Guideline [CG168]. Reaffirmed consensus.
              </p>
            </div>
            <div className="space-y-2.5">
              <p>
                <strong className="text-mv-forest">3. VeClose 5-Year Randomized Study:</strong> Morrison N, Gibson K, Vasquez M, et al. <em>Five-year extension study of patients from a randomized clinical trial of cyanoacrylate closure versus radiofrequency ablation.</em> J Vasc Surg Venous Lymphat Disord. 2020;8(6):978-989.
              </p>
              <p>
                <strong className="text-mv-forest">4. CLASS Randomized Trial:</strong> Brittenden J, Cotton SC, Elders A, et al. <em>A Randomized Trial of Laser, Sclerotherapy, or Surgery for Varicose Veins.</em> N Engl J Med. 2014;371:1218-1227.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-mv-outline/60 text-[11px] text-mv-ink-muted flex items-center justify-between flex-wrap gap-2">
            <span>Reported clinical ranges reflect published guidelines and literature. Individual anatomical candidacy must be confirmed by diagnostic ultrasound.</span>
            <span className="font-mono text-mv-forest font-semibold">Meridian Vascular Clinical Board</span>
          </div>
        </div>

      </div>
    </section>
  );
};
