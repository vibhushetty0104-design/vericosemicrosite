import React, { useState } from 'react';
import { DOCTOR_VISIT_QUESTIONS } from '../data/clinicalContent';
import { CLINICAL_PHOTOS } from '../content/photos';
import { FluxCharacter } from './VascularCharacters';
import {
  Stethoscope,
  CheckSquare,
  Square,
  Copy,
  Check,
  Plus,
  Info,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Camera
} from 'lucide-react';

interface DoctorVisitGuideProps {
  onOpenBooking?: () => void;
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const DoctorVisitGuide: React.FC<DoctorVisitGuideProps> = ({
  onOpenBooking,
  onOpenAiWithPrompt,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'diagnosis' | 'treatment' | 'insurance' | 'recovery'>('all');
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [newQuestionInput, setNewQuestionInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const categorizedQuestions = [
    {
      id: 'q1',
      category: 'diagnosis',
      question: "Which specific venous junctions (SFJ or SPJ) are incompetent on my standing ultrasound?",
      context: "Identifies whether the Great or Small Saphenous Vein is the root source of reflux."
    },
    {
      id: 'q2',
      category: 'diagnosis',
      question: "Are my deep femoral and popliteal veins completely open and healthy?",
      context: "Crucial rule-out to verify deep drainage is preserved before superficial ablation."
    },
    {
      id: 'q3',
      category: 'treatment',
      question: "Between Laser (EVLA), Radiofrequency (RFA), and VenaSeal adhesive, which modality fits my vein caliber best?",
      context: "Certain tortuous or very wide veins respond better to thermal laser vs medical glue."
    },
    {
      id: 'q4',
      category: 'treatment',
      question: "Will tributary or bulging calf clusters need foam sclerotherapy or micro-phlebectomy in the same session?",
      context: "Ensures comprehensive trunk + branch treatment rather than leaving painful bulging branches behind."
    },
    {
      id: 'q5',
      category: 'insurance',
      question: "Can your clinic provide the standing Doppler report and clinical notes for Cashless Mediclaim TPA pre-authorization?",
      context: "Indian health insurance requires documented reflux >500ms and symptomatic CEAP grade."
    },
    {
      id: 'q6',
      category: 'recovery',
      question: "What compression stocking grade (Class I vs Class II 20–30 mmHg) should I wear after the procedure, and for how many days?",
      context: "Duration (often 1–2 weeks for thermal EVLA/RFA vs minimal for VenaSeal) depends on the chosen modality; your surgeon's specific postoperative order takes precedence."
    },
    {
      id: 'q7',
      category: 'recovery',
      question: "How soon after the catheter procedure can I resume daily walking, stair-climbing, and work?",
      context: "Walking is typically encouraged within 1–2 hours, while vigorous gym squats are deferred ~1 week."
    },
    {
      id: 'q8',
      category: 'recovery',
      question: "When should we schedule my 1-week or 1-month surveillance Doppler scan to confirm vein closure?",
      context: "Formal follow-up duplex ultrasound confirms complete truncal occlusion."
    }
  ];

  const filteredQuestions = categorizedQuestions.filter(q => {
    if (selectedCategory === 'all') return true;
    return q.category === selectedCategory;
  });

  const allQuestionsToCopy = [
    ...categorizedQuestions.map(q => q.question),
    ...customQuestions
  ];

  const toggleCheck = (id: string) => {
    setCheckedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCustomQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionInput.trim()) return;
    setCustomQuestions(prev => [...prev, newQuestionInput.trim()]);
    setNewQuestionInput('');
  };

  const handleCopyQuestions = () => {
    const textToCopy = allQuestionsToCopy.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="doctor-visit" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-mv-outline/60 relative overflow-hidden">
      <div className="container-page">
        
        {/* Header with Flux Companion */}
        <div className="relative flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-mv-forest text-[11px] font-bold tracking-[0.14em] uppercase font-mono mb-2">
              <Stethoscope className="w-4 h-4 text-mv-forest" />
              <span>CONSULTATION PREPARATION &amp; CLINICAL DIALOGUE</span>
            </div>
            <h2 className="heading-serif-section text-mv-forest">
              Consultation Question Builder: What to Ask Your Specialist
            </h2>
            <p className="mt-3.5 text-[15.5px] sm:text-[16.5px] leading-relaxed text-mv-ink-muted">
              An empowered patient receives better care. Use our interactive question builder to select, customize, and export targeted questions for your vascular surgeon or interventional radiologist.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start lg:self-auto shrink-0">
            {/* Flux Companion in safe header margin */}
            <div className="hidden lg:block pointer-events-none">
              <FluxCharacter size="sm" showBadge={true} badgePosition="top" />
            </div>

            <button
              onClick={handleCopyQuestions}
              className="tap-tactile min-h-[44px] inline-flex items-center gap-2 rounded-full bg-mv-forest px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#073028] transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-mv-pale" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy All Questions'}</span>
            </button>
          </div>
        </div>

        {/* Clinical Photography: In-Person Specialist Evaluation Setting */}
        <div className="mb-12 overflow-hidden rounded-3xl border border-mv-outline/70 bg-white shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-5 overflow-hidden bg-mv-pale/20">
              <img
                src={CLINICAL_PHOTOS.clinicalConsultation.src}
                alt={CLINICAL_PHOTOS.clinicalConsultation.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 rounded-md bg-mv-forest/85 px-2.5 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-mv-terracotta" />
                <span>{CLINICAL_PHOTOS.clinicalConsultation.clinicalTag}</span>
              </span>
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-mv-terracotta block mb-1">
                  Shared Decision-Making
                </span>
                <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest leading-snug">
                  What Happens During a Vein Specialist Consultation?
                </h3>
                <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-mv-ink-muted">
                  A vascular consultation is a collaborative evaluation. Your specialist reviews standing ultrasound Doppler maps with you, inspects skin changes (CEAP clinical classification), and tailors treatment recommendations specifically to your symptoms, occupational load, and long-term health goals.
                </p>
                <div className="mt-4 pt-4 border-t border-mv-outline/60 flex flex-wrap gap-4 text-[12.5px] text-mv-ink font-mono">
                  <span className="bg-mv-ivory px-3 py-1 rounded-md border border-mv-outline/50">Duplex Map Review</span>
                  <span className="bg-mv-ivory px-3 py-1 rounded-md border border-mv-outline/50">CEAP Physical Exam</span>
                  <span className="bg-mv-ivory px-3 py-1 rounded-md border border-mv-outline/50">TPA Insurance Estimation</span>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-mv-outline/50 text-[12px] text-mv-ink-muted">
                {CLINICAL_PHOTOS.clinicalConsultation.caption}
              </div>
            </div>
          </div>
        </div>

        {/* 3-Step Exam Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="rounded-3xl border border-mv-outline/70 bg-white p-7 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-mv-cream border border-mv-outline/60 text-mv-forest font-mono font-bold flex items-center justify-center mb-3.5">
              1
            </div>
            <h3 className="font-serif text-[18px] sm:text-[19px] font-semibold text-mv-forest mb-2 leading-snug">
              Standing Clinical Inspection
            </h3>
            <p className="text-[14px] text-mv-ink-muted leading-[1.6]">
              You will stand on an elevated platform so the specialist can inspect skin firmness, hemosiderin pigmentation, ankle edema, and palpate bulging veins.
            </p>
          </div>

          <div className="rounded-3xl border border-mv-outline/70 bg-white p-7 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-mv-cream border border-mv-outline/60 text-mv-forest font-mono font-bold flex items-center justify-center mb-3.5">
              2
            </div>
            <h3 className="font-serif text-[18px] sm:text-[19px] font-semibold text-mv-forest mb-2 leading-snug">
              Standing Bilateral Duplex
            </h3>
            <p className="text-[14px] text-mv-ink-muted leading-[1.6]">
              Ultrasound transducer measures saphenous calibers, maps incompetent perforators, and confirms reflux duration &gt;500ms under calf compression.
            </p>
          </div>

          <div className="rounded-3xl border border-mv-outline/70 bg-white p-7 shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-mv-cream border border-mv-outline/60 text-mv-forest font-mono font-bold flex items-center justify-center mb-3.5">
              3
            </div>
            <h3 className="font-serif text-[18px] sm:text-[19px] font-semibold text-mv-forest mb-2 leading-snug">
              Customized Treatment &amp; TPA
            </h3>
            <p className="text-[14px] text-mv-ink-muted leading-[1.6]">
              The doctor explains whether Laser, RFA, or VenaSeal is suitable, calculates your CEAP grade, and prepares documents for cashless mediclaim pre-authorization.
            </p>
          </div>

        </div>

        {/* Interactive Question Builder Area */}
        <div className="rounded-3xl border border-mv-outline/70 bg-white p-7 sm:p-9 shadow-2xs">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-mv-outline/60">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-mv-forest">
                Key Questions to Bring to Your OPD Visit
              </h3>
              <p className="text-xs text-mv-ink-muted mt-1">
                Filter by topic or add your own specific health concerns below.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-full border border-mv-outline/60">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer tap-tactile min-h-[36px] ${
                  selectedCategory === 'all'
                    ? 'bg-mv-forest text-white shadow-xs'
                    : 'text-mv-ink-muted hover:text-mv-forest'
                }`}
              >
                All ({categorizedQuestions.length})
              </button>
              <button
                onClick={() => setSelectedCategory('diagnosis')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer tap-tactile min-h-[36px] ${
                  selectedCategory === 'diagnosis'
                    ? 'bg-mv-forest text-white shadow-xs'
                    : 'text-mv-ink-muted hover:text-mv-forest'
                }`}
              >
                Diagnosis
              </button>
              <button
                onClick={() => setSelectedCategory('treatment')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer tap-tactile min-h-[36px] ${
                  selectedCategory === 'treatment'
                    ? 'bg-mv-forest text-white shadow-xs'
                    : 'text-mv-ink-muted hover:text-mv-forest'
                }`}
              >
                Treatment Choice
              </button>
              <button
                onClick={() => setSelectedCategory('insurance')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer tap-tactile min-h-[36px] ${
                  selectedCategory === 'insurance'
                    ? 'bg-mv-forest text-white shadow-xs'
                    : 'text-mv-ink-muted hover:text-mv-forest'
                }`}
              >
                Mediclaim &amp; TPA
              </button>
              <button
                onClick={() => setSelectedCategory('recovery')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer tap-tactile min-h-[36px] ${
                  selectedCategory === 'recovery'
                    ? 'bg-mv-forest text-white shadow-xs'
                    : 'text-mv-ink-muted hover:text-mv-forest'
                }`}
              >
                Recovery
              </button>
            </div>
          </div>

          {/* Question Items Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => {
              const isChecked = !!checkedQuestions[q.id];
              return (
                <div
                  key={q.id}
                  onClick={() => toggleCheck(q.id)}
                  className={`tap-tactile p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-mv-cream/70 border-mv-forest/40 text-mv-ink-muted/70'
                      : 'bg-[#FAF7F2] border-mv-outline/60 hover:border-mv-forest/30 text-mv-forest'
                  }`}
                >
                  <div className="shrink-0 mt-0.5 text-mv-forest">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-mv-forest" />
                    ) : (
                      <Square className="w-4 h-4 text-mv-outline/90" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-[15px] sm:text-[15.5px] font-semibold leading-snug ${isChecked ? 'line-through text-mv-ink-muted/50' : 'text-mv-forest'}`}>
                      {q.question}
                    </h4>
                    <p className="text-[13px] sm:text-[13.5px] text-mv-ink-muted leading-relaxed mt-1.5">
                      {q.context}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Custom User-Added Questions */}
            {customQuestions.map((customQ, idx) => (
              <div
                key={`custom-${idx}`}
                className="p-5 rounded-2xl border border-amber-300/80 bg-amber-50/60 flex items-start gap-3.5 shadow-2xs"
              >
                <div className="shrink-0 mt-0.5 text-mv-terracotta">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10.5px] font-mono font-bold uppercase text-mv-terracotta block">
                    Your Personal Question
                  </span>
                  <h4 className="text-[15px] font-semibold text-mv-forest leading-snug mt-1">
                    {customQ}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Question Form */}
          <form onSubmit={handleAddCustomQuestion} className="mt-8 pt-6 border-t border-mv-outline/60 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={newQuestionInput}
              onChange={(e) => setNewQuestionInput(e.target.value)}
              placeholder="Type your own question (e.g. Can I take a long flight next month?)"
              className="flex-1 w-full rounded-full border border-mv-outline/70 bg-[#FAF7F2] px-5 py-2.5 text-[14px] text-mv-forest placeholder:text-mv-ink-muted/60 focus:border-mv-forest focus:outline-none min-h-[44px]"
            />
            <button
              type="submit"
              className="tap-tactile min-h-[44px] inline-flex items-center gap-1.5 rounded-full bg-mv-forest px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#073028] transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Question</span>
            </button>
          </form>

        </div>

      </div>
    </section>
  );
};
