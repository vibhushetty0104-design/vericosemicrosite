import React, { useState } from 'react';
import { CLINICAL_PHOTOS } from '../content/photos';
import {
  Activity,
  CheckSquare,
  Square,
  ShieldCheck,
  ArrowRight,
  FileText,
  Camera
} from 'lucide-react';

interface DopplerEducationGuideProps {
  onNavigateToDoppler?: () => void;
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const DopplerEducationGuide: React.FC<DopplerEducationGuideProps> = ({
  onNavigateToDoppler,
  onOpenAiWithPrompt,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const prepChecklist = [
    {
      title: "Drink 500 – 750 ml of water before your appointment",
      desc: "Good systemic hydration optimizes intravascular volume, helping vascular technicians easily visualize saphenous calibers and valve coaptation."
    },
    {
      title: "Wear loose shorts or comfortable bottoms",
      desc: "The sonographer needs unobstructed access from your upper groin (saphenofemoral junction) down to your inner and outer ankle."
    },
    {
      title: "Do not apply oils, lotions, or moisturizers on scan morning",
      desc: "Oily residues create an acoustic barrier that interferes with water-based acoustic coupling gel, degrading ultrasound image resolution."
    },
    {
      title: "Expect to stand on an elevated platform during the scan",
      desc: "Accurate venous reflux mapping MUST be performed standing. Lying completely flat unloads hydrostatic pressure and masks gravitational valve failure."
    },
    {
      title: "Bring any previous ultrasound reports or vascular records",
      desc: "Comparing current vein diameters with past scans helps your specialist evaluate the chronological rate of venous disease progression."
    }
  ];

  const dopplerTerms = [
    {
      term: "Saphenofemoral Junction (SFJ)",
      definition: "The critical confluence in the groin where the superficial Great Saphenous Vein drains into the deep Common Femoral Vein.",
      clinicalSignificance: "Primary site of valve failure; incompetent in ~75% of primary varicose vein presentations."
    },
    {
      term: "Reflux Duration > 500 ms",
      definition: "Retrograde blood flow lasting longer than 0.5 seconds following manual calf compression and release.",
      clinicalSignificance: "Official international SVS/AVF threshold confirming pathologic valvular failure in superficial saphenous trunks."
    },
    {
      term: "GSV Caliber / Truncal Diameter",
      definition: "The internal measurement of the Great Saphenous Vein, measured in transverse cross-section at the groin, mid-thigh, and calf.",
      clinicalSignificance: "Normal standing caliber is <4–5 mm. Diameters exceeding 6–7 mm indicate chronic luminal stretching due to venous hypertension."
    },
    {
      term: "Deep Vein Compressibility",
      definition: "Direct probe pressure applied to the femoral and popliteal veins to confirm complete luminal collapse.",
      clinicalSignificance: "Complete collapse proves the deep vein is patent; failure to compress indicates an intravascular thrombus (clot)—the hallmark of acute DVT."
    }
  ];

  return (
    <section id="doppler-education" className="py-16 sm:py-24 bg-mv-ivory border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-mv-forest/80 text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
              <Activity className="w-4 h-4 text-mv-forest" aria-hidden="true" />
              <span>Diagnostic Protocol &amp; Clinical Terminology</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
              Preparing for Your Doppler Ultrasound
            </h2>
            <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-mv-ink-muted">
              A standing bilateral venous duplex ultrasound is the definitive non-invasive gold standard for varicose veins. Understand how to prepare and decipher key scan findings.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[12.5px] font-mono text-mv-forest bg-white px-4 py-2 rounded-full border border-mv-outline/60 shrink-0 self-start lg:self-auto shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-mv-forest" aria-hidden="true" />
            <span>Standing Duplex Protocol</span>
          </div>
        </div>

        {/* Clinical Photography Showcase: Standing Duplex Setting */}
        <div className="mb-12 overflow-hidden rounded-3xl border border-mv-outline/70 bg-white shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-5 overflow-hidden bg-mv-pale/20">
              <img
                src={CLINICAL_PHOTOS.clinicalDopplerExam.src}
                alt={CLINICAL_PHOTOS.clinicalDopplerExam.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 rounded-md bg-mv-forest/85 px-2.5 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-mv-terracotta" />
                <span>{CLINICAL_PHOTOS.clinicalDopplerExam.clinicalTag}</span>
              </span>
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-mv-terracotta block mb-1">
                  Clinical Reality
                </span>
                <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest leading-snug">
                  Why Doppler Scans Must Be Performed Standing
                </h3>
                <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-mv-ink-muted">
                  Unlike routine abdominal ultrasounds where patients lie supine, venous reflux mapping in the legs requires you to stand on an elevated examination step. Gravity exposes faulty one-way valve leaflets that fail to close, allowing blood to pool backwards down the limb.
                </p>
                <div className="mt-4 pt-4 border-t border-mv-outline/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] text-mv-ink">
                  <div className="flex items-start gap-2">
                    <span className="text-mv-terracotta font-bold">•</span>
                    <span><strong>Reflux cutoff:</strong> &gt;0.5s in saphenous trunks, &gt;1.0s in femoral/popliteal.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-mv-terracotta font-bold">•</span>
                    <span><strong>Deep system patency:</strong> Verifies no deep vein thrombosis (DVT) before treatment.</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-mv-outline/50 flex items-center justify-between text-[12px] text-mv-ink-muted font-mono">
                <span>Accredited vascular sonography protocol</span>
                <span className="text-mv-forest font-semibold">Non-Invasive · Zero Radiation</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Open Editorial Layout: Preparation Checklist (Left) & Essential Terms (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Editorial Preparation Checklist */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between pb-3 border-b border-mv-outline/70 mb-6">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-mv-ink-muted block">
                  Patient Readiness
                </span>
                <h3 className="font-serif text-[21px] text-mv-forest font-semibold mt-0.5">
                  Scan Day Checklist
                </h3>
              </div>
              <span className="text-[11.5px] font-mono font-semibold text-mv-forest bg-white px-3 py-1 rounded-full border border-mv-outline/60">
                {Object.values(checkedItems).filter(Boolean).length} / {prepChecklist.length} Checked
              </span>
            </div>

            <ol className="divide-y divide-mv-outline/50">
              {prepChecklist.map((item, idx) => {
                const isChecked = !!checkedItems[idx];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className="py-4 flex items-start gap-3.5 cursor-pointer group"
                  >
                    <button
                      type="button"
                      aria-label={isChecked ? `Uncheck: ${item.title}` : `Check: ${item.title}`}
                      className="shrink-0 mt-0.5 text-mv-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest rounded-sm"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-mv-forest" />
                      ) : (
                        <Square className="w-5 h-5 text-mv-outline-strong/70 group-hover:text-mv-forest transition-colors" />
                      )}
                    </button>
                    <div>
                      <h4 className={`text-[14.5px] font-semibold leading-snug transition-colors ${isChecked ? 'line-through text-mv-ink-muted/60' : 'text-mv-forest group-hover:text-mv-terracotta'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[13px] text-mv-ink-muted leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 pt-4 border-t border-mv-outline/60 flex items-center justify-between text-[12.5px] text-mv-ink-muted font-mono">
              <span>Duration: ~30 to 45 minutes</span>
              <span>100% Non-Invasive</span>
            </div>
          </div>

          {/* Right Column: Editorial Terminology Glossary */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between pb-3 border-b border-mv-outline/70 mb-6">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-mv-terracotta block">
                  Report Terminology
                </span>
                <h3 className="font-serif text-[21px] text-mv-forest font-semibold mt-0.5">
                  Common Phrases on Your Doppler Report
                </h3>
              </div>
              {onNavigateToDoppler && (
                <button
                  type="button"
                  onClick={onNavigateToDoppler}
                  className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-mv-forest hover:text-mv-terracotta transition-colors min-h-[44px] cursor-pointer"
                >
                  <span>Full Report Decoder</span>
                  <ArrowRight className="w-4 h-4 text-mv-terracotta" />
                </button>
              )}
            </div>

            {/* Open Editorial Glossary List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dopplerTerms.map((term, idx) => (
                <div
                  key={idx}
                  className="pt-3 border-t-2 border-mv-forest/20 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10.5px] font-mono font-bold uppercase text-mv-ink-muted block mb-1">
                      Term 0{idx + 1}
                    </span>
                    <h4 className="font-serif text-[17.5px] text-mv-forest font-semibold leading-snug">
                      {term.term}
                    </h4>
                    <p className="mt-1.5 text-[13px] text-mv-ink-muted leading-relaxed">
                      {term.definition}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-mv-outline/40 text-[12px] text-mv-forest">
                    <strong>Clinical Role:</strong> {term.clinicalSignificance}
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Decoder Action Banner */}
            <div className="mt-8 rounded-2xl bg-mv-forest text-white p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-mv-sage text-[11px] font-mono uppercase tracking-wider font-semibold">
                  <FileText className="w-4 h-4 text-mv-terracotta" />
                  <span>Clinical Report Parser</span>
                </div>
                <h4 className="font-serif text-[19px] text-white font-semibold mt-1">
                  Have a scanned Doppler ultrasound report from your doctor?
                </h4>
                <p className="text-[13px] text-white/80 mt-1 max-w-xl leading-relaxed">
                  Paste your Doppler excerpt into our clinical decoder to highlight junction incompetence, reflux durations, and questions to ask your specialist.
                </p>
              </div>

              {onNavigateToDoppler && (
                <button
                  type="button"
                  onClick={onNavigateToDoppler}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-mv-terracotta px-5 py-3 text-[13.5px] font-semibold text-white hover:bg-mv-terracotta/90 transition-all shrink-0 cursor-pointer shadow-xs min-h-[44px]"
                >
                  <span>Launch Decoder</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
