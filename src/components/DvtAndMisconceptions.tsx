import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  PhoneCall,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface DvtAndMisconceptionsProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
  onNavigateToAssessment?: () => void;
}

export const DvtAndMisconceptions: React.FC<DvtAndMisconceptionsProps> = ({
  onOpenAiWithPrompt,
  onNavigateToAssessment,
}) => {
  const [activeTab, setActiveTab] = useState<'dvt' | 'misconceptions'>('dvt');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const indianMisconceptions = [
    {
      myth: "Vigorous hot oil or deep tissue massage will dissolve varicose veins.",
      fact: "Deep, forceful calf massage over varicose veins is dangerous. It cannot repair damaged one-way valves and carries a significant risk of rupturing thinned vein walls or dislodging a superficial or deep blood clot into the circulation.",
      clinicalContext: "Venous valves fail mechanically; topical oils cannot penetrate vessel walls or restore elastin."
    },
    {
      myth: "Varicose veins are purely cosmetic and don't need medical evaluation.",
      fact: "While early spider veins (C1) may be primarily cosmetic, varicose veins (C2) represent chronic venous insufficiency. Untreated reflux can progress over years into ankle edema (C3), irreversible brown iron skin staining (C4), and chronic non-healing venous ulcers (C6).",
      clinicalContext: "Early standing duplex ultrasound mapping identifies underlying saphenous reflux before skin damage occurs."
    },
    {
      myth: "Varicose vein treatment requires painful open surgery and weeks of bed rest.",
      fact: "Old-fashioned surgical vein stripping under spinal anesthesia has been largely replaced. Modern treatments—Endovenous Laser (EVLA), Radiofrequency Ablation (RFA), and VenaSeal medical adhesive—are day-care, pinhole catheter procedures performed under local anesthesia. Patients walk immediately and return to desk work the next day.",
      clinicalContext: "Endovenous ablation is the recommended first-line treatment in international SVS/AVF guidelines."
    },
    {
      myth: "Physical exercise like walking or cycling damages diseased veins.",
      fact: "Low-impact calf exercises are the best non-invasive way to manage vein symptoms. The gastrocnemius calf muscle is the 'peripheral heart' of the body; every step compresses intramuscular veins and propels stagnant blood upward.",
      clinicalContext: "Prolonged static standing or sitting is what harms valves, not active walking."
    },
    {
      myth: "Any tight elastic sock or knee band works just as well as medical compression stockings.",
      fact: "Regular tight socks or elastic garters compress evenly or tightly around the calf top, acting like a tourniquet and trapping blood in the lower leg. Medical compression stockings are graduated—exerting the highest pressure at the ankle (e.g. 20–30 mmHg for Class II) and gradually decreasing toward the knee.",
      clinicalContext: "Graduated pressure gradient is clinically required to assist directional upward return."
    }
  ];

  const dvtRedFlags = [
    {
      title: "Acute, Sudden Unilateral Swelling",
      description: "One calf or thigh suddenly swells noticeably over hours or 1–2 days, creating a marked size difference between legs. Superficial varicose edema is typically bilateral and develops gradually by evening.",
      urgency: "Immediate Emergency OPD"
    },
    {
      title: "Severe Deep Calf Pain & Tenderness",
      description: "Persistent, deep aching or sharp calf cramp that intensifies when standing or flexing the foot upward (Dorsiflexion / Homans sign). Distinct from routine end-of-day venous tiredness.",
      urgency: "Same-Day Ultrasound Rule-Out"
    },
    {
      title: "Erythema & Localized Heat",
      description: "The swollen calf feels significantly warmer to the touch than the opposite limb, often with reddish or purplish skin discoloration over deep venous tracts.",
      urgency: "Immediate Medical Attention"
    },
    {
      title: "Recent High-Risk Exposure (Wells Criteria)",
      description: "Recent major pelvic or orthopedic surgery, prolonged immobility (bed rest >3 days or flights >6 hours), active cancer, pregnancy, or oral contraceptive therapy.",
      urgency: "High Clinical Suspicion"
    }
  ];

  return (
    <section id="dvt-safety" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-mv-terracotta text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
              <AlertTriangle className="w-4 h-4 text-mv-terracotta" />
              <span>CLINICAL SAFETY &amp; COMMON MISCONCEPTIONS</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
              DVT Warning Signs &amp; Debunking Vein Myths
            </h2>
            <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-mv-ink-muted">
              Understanding the critical difference between superficial chronic venous disease and acute deep vein blood clots saves lives. Explore urgent DVT indicators and prevalent myths in Indian healthcare.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-mv-ivory p-1.5 rounded-full border border-mv-outline/70 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('dvt')}
              className={`min-h-[44px] px-4.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                activeTab === 'dvt'
                  ? 'bg-mv-forest text-white shadow-xs'
                  : 'text-mv-ink-muted hover:text-mv-forest'
              }`}
            >
              🚨 DVT Red Flags (Emergency)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('misconceptions')}
              className={`min-h-[44px] px-4.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                activeTab === 'misconceptions'
                  ? 'bg-mv-forest text-white shadow-xs'
                  : 'text-mv-ink-muted hover:text-mv-forest'
              }`}
            >
              Debunking Vein Myths (5)
            </button>
          </div>
        </div>

        {/* TAB 1: DVT URGENT RED FLAGS */}
        {activeTab === 'dvt' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            
            {/* High Urgency Critical Callout Banner (Preserved Exact 112/108 Safety Protocol) */}
            <div className="rounded-3xl border border-red-500/40 bg-red-50/70 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-red-100 text-red-700 shrink-0 mt-0.5">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-800 block">
                      Emergency Alert Protocol
                    </span>
                    <h3 className="font-serif text-[22px] sm:text-[24px] text-red-950 font-semibold mt-0.5">
                      When to Seek Immediate Emergency Hospital Care
                    </h3>
                    <p className="mt-2 text-[14px] text-red-900/90 leading-relaxed max-w-2xl">
                      A blood clot in the deep veins (Deep Vein Thrombosis) can dislodge and travel to the lungs, causing a potentially fatal <strong>Pulmonary Embolism (PE)</strong>. If you experience sudden unilateral leg swelling accompanied by sudden shortness of breath, sharp chest pain when inhaling, or coughing blood, call emergency services (112 / 108 in India) immediately.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0 self-stretch sm:self-auto">
                  <a
                    href="tel:112"
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-[13.5px] font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call 112 / 108 (India)</span>
                  </a>
                  <span className="text-[11px] font-mono text-center text-red-700">
                    National Emergency Helpline
                  </span>
                </div>
              </div>
            </div>

            {/* 4 DVT Warning Indicators (Open Editorial Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {dvtRedFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="pt-6 border-t border-mv-outline/70 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[12px] font-bold text-red-800 bg-red-100/70 px-2 py-0.5 rounded-md">
                        0{idx + 1}
                      </span>
                      <span className="rounded-full bg-red-100 px-3 py-0.5 text-[11px] font-mono font-bold text-red-800">
                        {flag.urgency}
                      </span>
                    </div>

                    <h4 className="font-serif text-[19px] sm:text-[20px] font-semibold text-mv-forest">
                      {flag.title}
                    </h4>

                    <p className="mt-2 text-[14px] text-mv-ink-muted leading-relaxed">
                      {flag.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-mv-outline/40 flex items-center justify-between text-[12px] text-mv-ink-muted/80 font-mono">
                    <span>Clinical Sign</span>
                    <span>Requires Duplex Sonography</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Superficial vs Deep DVT Comparison Table (Open Editorial Table) */}
            <div className="pt-8 border-t border-mv-outline/60">
              <h4 className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest mb-4">
                How to Distinguish Varicose Veins from Deep Vein Thrombosis
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-mv-outline/60 bg-white">
                <table className="w-full text-left text-[13.5px] border-collapse">
                  <thead>
                    <tr className="border-b border-mv-outline/60 bg-mv-ivory text-mv-forest font-mono text-[11px] uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-bold">Clinical Characteristic</th>
                      <th className="py-3.5 px-4 font-bold">Superficial Varicose Veins</th>
                      <th className="py-3.5 px-4 font-bold text-red-700">Deep Vein Thrombosis (DVT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mv-outline/40 text-mv-ink-muted">
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-mv-forest">Onset &amp; Timeline</td>
                      <td className="py-3.5 px-4">Gradual progression over months to years</td>
                      <td className="py-3.5 px-4 font-semibold text-red-800">Acute; sudden onset within hours or 1–2 days</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-mv-forest">Leg Symmetry</td>
                      <td className="py-3.5 px-4">Often bilateral; asymmetric bulging possible</td>
                      <td className="py-3.5 px-4 font-semibold text-red-800">Almost always strictly unilateral (one leg)</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-mv-forest">Swelling Pattern</td>
                      <td className="py-3.5 px-4">Mild ankle edema peaking in evening, gone by morning</td>
                      <td className="py-3.5 px-4 font-semibold text-red-800">Severe calf/thigh swelling persisting 24/7</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-mv-forest">Pain Quality</td>
                      <td className="py-3.5 px-4">Dull gravitational ache, heaviness after standing</td>
                      <td className="py-3.5 px-4 font-semibold text-red-800">Intense, constant calf cramp or deep throbbing</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-semibold text-mv-forest">Recommended Action</td>
                      <td className="py-3.5 px-4">Elective vascular specialist consultation</td>
                      <td className="py-3.5 px-4 font-semibold text-red-800">Immediate emergency room / urgent ultrasound</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DEBUNKING INDIAN VEIN MYTHS (Open Editorial Layout) */}
        {activeTab === 'misconceptions' && (
          <div className="divide-y divide-mv-outline/60 animate-in fade-in duration-200">
            {indianMisconceptions.map((item, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="py-6 first:pt-0 last:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full flex items-start justify-between gap-4 text-left cursor-pointer min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest rounded-xl"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-mv-terracotta text-[12px] font-bold font-mono shrink-0 mt-0.5">
                        ✕
                      </span>
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wide text-mv-terracotta block">
                          Prevalent Misconception #{idx + 1}
                        </span>
                        <h4 className="font-serif text-[19px] sm:text-[20px] font-semibold text-mv-forest mt-0.5 leading-snug">
                          "{item.myth}"
                        </h4>
                      </div>
                    </div>

                    <div className="min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-full bg-mv-ivory text-mv-forest shrink-0 border border-mv-outline/60">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-mv-outline/40 pl-10 space-y-3.5">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[14px] font-semibold text-mv-forest block">
                            Evidence-Based Reality:
                          </strong>
                          <p className="text-[15px] sm:text-[15.5px] text-mv-ink-muted leading-relaxed mt-1">
                            {item.fact}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-mv-ivory p-3.5 text-[13px] text-mv-ink-muted border border-mv-outline/60 leading-relaxed">
                        <strong className="text-mv-forest">Clinical Rationale:</strong> {item.clinicalContext}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
