import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Activity,
  Eye,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface SymptomsProps {
  onNavigateToAssessment?: () => void;
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const Symptoms: React.FC<SymptomsProps> = ({
  onNavigateToAssessment,
  onOpenAiWithPrompt,
}) => {
  const [symptomView, setSymptomView] = useState<'sensory' | 'visible'>('sensory');

  const sensorySymptoms = [
    {
      title: "Leg Heaviness & Leaden Fatigue",
      description: "A profound sensation of heaviness in calves and thighs, making routine stair-climbing exhausting after prolonged standing or desk sitting.",
      hemodynamics: "Accumulated hydrostatic blood volume stretching perivascular pressure receptors in the venous wall."
    },
    {
      title: "Deep Throbbing & Dull Calf Ache",
      description: "A persistent, low-grade ache localized along the saphenous vein tract that peaks in late afternoon and evening hours.",
      hemodynamics: "Elevated venous wall tension and localized tissue hypoxia caused by stagnant deoxygenated blood pooling."
    },
    {
      title: "Nocturnal Calf & Foot Cramps",
      description: "Sudden, painful involuntary spasms in the gastrocnemius (calf) muscle that abruptly awaken patients from sleep.",
      hemodynamics: "Accumulation of lactic acid and metabolic waste products due to sluggish microvascular return during daytime."
    },
    {
      title: "Burning Sensation & Intense Itching (Pruritus)",
      description: "Localized warmth or intense itching overlying visible veins, frequently misdiagnosed as simple dry skin or eczema.",
      hemodynamics: "Venous stasis triggers leukocyte trapping, degranulation, and inflammatory histamine release into surrounding skin."
    },
    {
      title: "Restless Leg Sensations at Bedtime",
      description: "An irresistible urge to move or kick the legs when resting in bed, accompanied by crawling or tingling sensations.",
      hemodynamics: "Subtle venous compartment hypertension irritating sensory peripheral nerve endings."
    }
  ];

  const visibleSigns = [
    {
      title: "Bulging Subcutaneous Varicose Cords",
      description: "Elevated, bluish-green tortuous veins (>3 mm) that protrude prominently while standing and collapse when elevated.",
      hemodynamics: "Complete loss of valvular coaptation with vein wall elastin and collagen degradation under gravity."
    },
    {
      title: "Spider Veins (Telangiectasias) & Reticular Feeders",
      description: "Fine purple/red spider-web networks (<1 mm) and bluish reticular veins (1–3 mm) spread across the thighs and calves.",
      hemodynamics: "Intradermal capillary bed hypertension fed by underlying incompetent reticular or saphenous branches."
    },
    {
      title: "Pitting Ankle Edema & Sock Indentations",
      description: "Fluid swelling around the inner and outer ankle that leaves a deep thumb imprint and tight sock rings at the end of the day.",
      hemodynamics: "Capillary filtration pressure exceeds lymphatic drainage capacity, flooding interstitial subcutaneous tissues."
    },
    {
      title: "Hemosiderin Pigmentation (Brown Staining)",
      description: "Permanent brown, rust-colored, or bronze discoloration on the lower calf and gaiter area that does not wash off.",
      hemodynamics: "Red blood cells extravasate through stretched capillary pores (diapedesis) and break down, releasing iron pigment into the dermis."
    },
    {
      title: "Lipodermatosclerosis ('Champagne Bottle' Leg)",
      description: "Subcutaneous fat becomes woody, tight, and fibrotic, creating a tapered contour where the calf narrows sharply above the ankle.",
      hemodynamics: "Chronic chronic dermal inflammation leads to dense collagen fibrosis and microvascular occlusion."
    }
  ];

  return (
    <section id="symptoms" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-mv-ink-muted text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
              <span>CLINICAL HALLMARKS &amp; SENSORY PATTERNS</span>
              <span>·</span>
              <span>SYMPTOM RECOGNITION</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
              Symptoms of Chronic Venous Disease
            </h2>
            <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-mv-ink-muted">
              Venous disease produces both subtle sensory discomfort and progressive skin changes. Toggle between internal physical sensations and visible external signs.
            </p>
          </div>

          {/* Toggle between Sensory and Visible */}
          <div className="flex items-center gap-1.5 bg-mv-ivory p-1.5 rounded-full border border-mv-outline/70 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setSymptomView('sensory')}
              className={`min-h-[44px] px-4.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                symptomView === 'sensory'
                  ? 'bg-mv-forest text-white shadow-xs'
                  : 'text-mv-ink-muted hover:text-mv-forest'
              }`}
            >
              Sensory Discomfort ({sensorySymptoms.length})
            </button>
            <button
              type="button"
              onClick={() => setSymptomView('visible')}
              className={`min-h-[44px] px-4.5 py-2 rounded-full text-[13px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                symptomView === 'visible'
                  ? 'bg-mv-forest text-white shadow-xs'
                  : 'text-mv-ink-muted hover:text-mv-forest'
              }`}
            >
              Visible &amp; Skin Changes ({visibleSigns.length})
            </button>
          </div>
        </div>

        {/* Symptoms Open Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {(symptomView === 'sensory' ? sensorySymptoms : visibleSigns).map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between pt-6 border-t border-mv-outline/70 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[12px] font-bold text-mv-ink-muted">
                    0{idx + 1}
                  </span>
                  <span className="text-[11px] font-mono uppercase text-mv-terracotta font-semibold">
                    {symptomView === 'sensory' ? 'Sensory Pattern' : 'Dermatologic Sign'}
                  </span>
                </div>

                <h3 className="font-serif text-[19px] sm:text-[20px] font-semibold text-mv-forest mb-2 leading-snug group-hover:text-mv-terracotta transition-colors">
                  {item.title}
                </h3>

                <p className="text-[14.5px] sm:text-[15px] text-mv-ink-muted leading-[1.6]">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-mv-outline/40">
                <span className="text-[10.5px] font-mono font-bold uppercase text-mv-forest block mb-1">
                  Hemodynamic Mechanism:
                </span>
                <p className="text-[13px] text-mv-ink-muted/90 leading-relaxed">
                  {item.hemodynamics}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Diurnal Rhythm Open Editorial Section: Morning vs Evening */}
        <div className="mt-16 pt-10 border-t border-mv-outline/60">
          <div className="flex items-center gap-2 text-mv-ink-muted text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <span>DIURNAL RHYTHM</span>
            <span>·</span>
            <span>HYDROSTATIC TIMING</span>
          </div>
          <h3 className="font-serif text-[24px] sm:text-[28px] font-semibold text-mv-forest mb-6">
            Why Vein Symptoms Are Mild in the Morning &amp; Peak by Evening
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4 p-6 bg-white/80 rounded-2xl border border-mv-outline/60 shadow-2xs">
              <div className="p-2.5 rounded-full bg-amber-100 text-amber-900 shrink-0 mt-0.5">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-[18px] font-semibold text-mv-forest">
                  08:00 AM (Morning Wake-Up)
                </h4>
                <p className="text-[13.5px] text-mv-ink-muted mt-1.5 leading-relaxed">
                  After 7–8 hours of horizontal recumbent sleep, gravity has not pulled blood downward. Hydrostatic pressure in leg veins has normalized, ankle edema is absent, and legs feel light and painless.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/80 rounded-2xl border border-mv-outline/60 shadow-2xs">
              <div className="p-2.5 rounded-full bg-mv-forest text-white shrink-0 mt-0.5">
                <Moon className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-serif text-[18px] font-semibold text-mv-forest">
                  07:00 PM (End of Workday)
                </h4>
                <p className="text-[13.5px] text-mv-ink-muted mt-1.5 leading-relaxed">
                  After 10+ hours of static standing or chair sitting, failing valves have allowed continuous gravitational reflux. Capillaries leak protein-rich fluid into tissues, causing deep throbbing, tight socks, and calf fatigue.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-mv-outline/50 flex flex-wrap items-center justify-between gap-4">
            <span className="text-[13px] text-mv-ink-muted">
              Notice this pattern? A 15-minute leg elevation above heart level provides temporary gravitational relief.
            </span>
            {onNavigateToAssessment && (
              <button
                type="button"
                onClick={onNavigateToAssessment}
                className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-mv-forest hover:text-mv-terracotta transition-colors cursor-pointer min-h-[44px]"
              >
                <span>Check Your Vein Symptom Pattern</span>
                <ArrowRight className="w-4 h-4 text-mv-terracotta" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
