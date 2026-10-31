import React from 'react';
import { DID_YOU_KNOW_FACTS } from '../data/clinicalContent';
import { Info, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface DidYouKnowProps {
  onNavigateToProgression?: () => void;
}

export const DidYouKnow: React.FC<DidYouKnowProps> = ({
  onNavigateToProgression,
}) => {
  return (
    <section id="did-you-know" className="py-16 sm:py-20 bg-white border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div>
            <div className="flex items-center gap-2 text-mv-ink-muted text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
              <span>EPIDEMIOLOGY &amp; VASCULAR BIOPHYSICS</span>
              <span>·</span>
              <span>EVIDENCE SUMMARY</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
              Did You Know? The Science of Vein Health
            </h2>
          </div>
          <p className="text-[15px] text-mv-ink-muted max-w-md leading-relaxed">
            Veins are thin-walled, low-pressure capacitance vessels that rely on muscular pumps and delicate bicuspid valves to return blood toward your heart.
          </p>
        </div>

        {/* Fact Cards Open 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DID_YOU_KNOW_FACTS.map((fact, index) => (
            <div
              key={index}
              className="pt-6 border-t border-mv-outline/70 flex flex-col justify-between"
            >
              <div>
                <div className="font-serif text-[36px] sm:text-[40px] font-bold text-mv-terracotta tabular-nums tracking-tight leading-none">
                  {fact.metric}
                </div>
                <div className="text-[14px] font-semibold text-mv-forest mt-2 mb-2 font-serif">
                  {fact.label}
                </div>
                <p className="text-[13px] text-mv-ink-muted leading-relaxed">
                  {fact.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-mv-outline/40 flex items-center gap-1.5 text-[11px] text-mv-ink-muted/70 font-mono">
                <Info className="w-3.5 h-3.5 text-mv-forest" />
                <span>Illustrative figure · sources to be confirmed</span>
              </div>
            </div>
          ))}
        </div>

        {/* Key Takeaway Callout (Open Editorial Callout) */}
        <div className="mt-12 rounded-3xl border border-mv-outline/70 bg-[#FAF7F2] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-start gap-3.5">
            <HelpCircle className="w-5 h-5 text-mv-forest shrink-0 mt-0.5" />
            <div className="text-[13.5px] text-mv-ink-muted leading-relaxed">
              <strong className="font-semibold text-mv-forest">Clinical Fact:</strong> Varicose veins are not merely a cosmetic blemish. Without intervention, continuous venous hypertension leads to subcutaneous hemosiderin tattooing, painful lipodermatosclerosis, and chronic non-healing venous ulcers.
            </div>
          </div>
          {onNavigateToProgression && (
            <button
              type="button"
              onClick={onNavigateToProgression}
              className="text-[13px] font-bold text-mv-forest hover:text-mv-terracotta whitespace-nowrap flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 min-h-[44px]"
            >
              <span>Explore CEAP Stages</span>
              <ArrowRight className="w-4 h-4 text-mv-terracotta" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
