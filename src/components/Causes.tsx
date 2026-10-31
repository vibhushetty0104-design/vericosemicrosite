import React from 'react';
import {
  Users,
  Briefcase,
  Heart,
  Clock,
  Scale,
  AlertTriangle,
  SunMedium,
  ArrowRight
} from 'lucide-react';
import { GUIDE_LABELS, GuideIcon } from '../content/guideLabels';

interface CausesProps {
  onNavigateToAssessment?: () => void;
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const Causes: React.FC<CausesProps> = ({
  onNavigateToAssessment,
  onOpenAiWithPrompt,
}) => {
  const causesList = [
    {
      icon: Users,
      title: "1. Genetics & Inherited Valve Architecture",
      stat: "Up to 90% Risk",
      statDesc: "If both parents affected (Cornu-Thenard 1994)",
      description: "Genetics dictate baseline vein wall collagen-elastin ratio (COL3A1 gene). When both parents have varicose veins, landmark clinical studies show familial risk reaches ~90% (Cornu-Thenard et al., J Dermatol Surg Oncol 1994). Inherited leaflet weakness predisposes venous valves to stretch under hydrostatic pressure."
    },
    {
      icon: Briefcase,
      title: "2. Indian Occupational Standing & Sitting",
      stat: "Up to 1.8x–2x Risk",
      statDesc: "In sustained static standing (Tüchsen 2000)",
      description: "Teachers, traffic police, surgeons, retail staff, and factory workers stand for hours without walking. Studies indicate up to 1.8×–2× elevated risk of venous disease in sustained static postures (Tüchsen et al., Epidemiology 2000; SVS/AVF guidelines). Desk sitting also reduces calf-pump activation."
    },
    {
      icon: Heart,
      title: "3. Pregnancy & High Progesterone",
      stat: "+40% Blood Volume",
      statDesc: "Maternal plasma surge (SVS/AVF Guidelines)",
      description: "Maternal plasma volume expands 40%–50% during pregnancy (Pritchard 1965). Elevated progesterone relaxes vein wall smooth muscle, while the gravid uterus exerts mechanical pressure on the inferior vena cava and iliac veins (SVS/AVF Guidelines on Venous Disease in Pregnancy)."
    },
    {
      icon: SunMedium,
      title: "4. Tropical Climate & Indian Summers",
      stat: "Vasodilation Load",
      statDesc: "Heat-triggered vein relaxation",
      description: "High ambient temperatures cause peripheral veins to dilate to dissipate heat, drastically increasing pooling volume, evening heaviness, and ankle swelling during hot Indian months."
    },
    {
      icon: Scale,
      title: "5. Elevated Intra-Abdominal Pressure & BMI",
      stat: "1.5x – 2x Risk",
      statDesc: "Central abdominal resistance",
      description: "Elevated body mass, chronic constipation, or heavy weightlifting increases intra-abdominal pressure, raising resistance against which lower limb veins must pump blood toward the heart."
    },
    {
      icon: AlertTriangle,
      title: "6. Prior DVT & Post-Thrombotic Syndrome",
      stat: "Secondary Damage",
      statDesc: "Valvular scarring from clots",
      description: "A prior blood clot in the deep veins damages delicate valve cusps during recanalization, creating permanent post-thrombotic deep venous insufficiency."
    }
  ];

  return (
    <section id="causes" className="py-16 sm:py-24 bg-white border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-mv-ink-muted text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
              <span>ETIOLOGY &amp; PREDISPOSING RISK FACTORS</span>
              <span>·</span>
              <span>EPIDEMIOLOGY</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
              Why Do Varicose Veins Develop?
            </h2>
            <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-mv-ink-muted">
              Varicose veins develop from a confluence of genetic collagen predispositions and environmental hydrostatic loads. Understanding modifiable vs non-modifiable risk factors is the first step toward effective vein health.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            {onNavigateToAssessment && (
              <button
                type="button"
                onClick={onNavigateToAssessment}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-mv-forest px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-mv-forest/90 transition-colors cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest"
              >
                <span>Assess Your Risk Score</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Open Editorial Etiology Matrix (Replacing 6-Card Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {causesList.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between pt-6 border-t border-mv-outline/70 transition-all group"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-mono text-[12px] font-bold text-mv-ink-muted">
                      0{idx + 1}
                    </span>
                    <div className="text-right">
                      <span className="font-serif text-[20px] font-bold text-mv-terracotta block leading-none">
                        {item.stat}
                      </span>
                      <span className="text-[10.5px] font-mono text-mv-ink-muted/80 uppercase tracking-wide block mt-0.5">
                        {item.statDesc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-mv-ivory flex items-center justify-center text-mv-forest shrink-0 border border-mv-outline/50">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif text-[19px] sm:text-[20px] font-semibold text-mv-forest leading-snug group-hover:text-mv-terracotta transition-colors">
                      {item.title.replace(/^\d+\.\s*/, '')}
                    </h3>
                  </div>

                  <p className="mt-2 text-[14.5px] text-mv-ink-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-mv-outline/40 text-[12px] flex items-center justify-between">
                  <span className="font-mono text-mv-ink-muted/70 text-[11px]">Primary Etiology</span>
                  {onOpenAiWithPrompt && (
                    <button
                      type="button"
                      onClick={() => onOpenAiWithPrompt(`Can you explain how ${item.title} causes varicose veins and how to prevent it?`)}
                      className="min-h-[36px] py-1 px-2.5 rounded-lg text-mv-forest font-semibold hover:text-mv-terracotta flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>{GUIDE_LABELS.ask}</span>
                      <GuideIcon className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
