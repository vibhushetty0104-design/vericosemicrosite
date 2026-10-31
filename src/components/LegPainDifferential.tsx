import React, { useState } from 'react';
import { LEG_PAIN_DIFFERENTIAL } from '../data/clinicalContent';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { GUIDE_LABELS, GuideIcon } from '../content/guideLabels';

interface LegPainDifferentialProps {
  onNavigateToAssessment?: () => void;
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const LegPainDifferential: React.FC<LegPainDifferentialProps> = ({
  onNavigateToAssessment,
  onOpenAiWithPrompt,
}) => {
  const [selectedCondition, setSelectedCondition] = useState<number>(0);

  return (
    <section id="leg-pain-differential" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-mv-terracotta text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
              <ShieldAlert className="w-4 h-4 text-mv-terracotta" />
              <span>CLINICAL DIFFERENTIAL DIAGNOSIS</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
              Is Your Leg Pain Venous, Arterial, or Neurological?
            </h2>
            <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-mv-ink-muted">
              Not all leg pain stems from varicose veins. Distinguishing between venous hypertension, arterial insufficiency (claudication), sciatica, and osteoarthritis ensures you receive the correct diagnostic imaging and treatment.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-mono text-mv-forest bg-mv-ivory px-3.5 py-1.5 rounded-full border border-mv-outline shrink-0 self-start lg:self-auto">
            <span>Clinical Hallmark Assessment</span>
          </div>
        </div>

        {/* Desktop Table View (Editorial Layout) */}
        <div className="hidden lg:block overflow-x-auto bg-white border border-mv-outline/70 rounded-3xl shadow-xs">
          <table className="w-full text-left border-collapse text-[13.5px]">
            <thead>
              <tr className="bg-mv-ivory border-b border-mv-outline/60 text-mv-forest font-mono text-[11px] uppercase tracking-wider">
                <th className="py-4 px-5 font-bold w-1/5">Condition</th>
                <th className="py-4 px-5 font-bold w-1/5">Pain Onset &amp; Quality</th>
                <th className="py-4 px-5 font-bold w-1/5">What Aggravates It</th>
                <th className="py-4 px-5 font-bold w-1/5">What Relieves It</th>
                <th className="py-4 px-5 font-bold w-1/5">Defining Clinical Sign</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mv-outline/40 text-mv-ink-muted">
              {LEG_PAIN_DIFFERENTIAL.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    idx === 0
                      ? 'bg-mv-forest/5 font-medium'
                      : 'hover:bg-mv-ivory/60'
                  }`}
                >
                  <td className="py-4 px-5 font-semibold text-mv-forest">
                    <div className="flex items-center gap-2">
                      {idx === 0 && <span className="w-2 h-2 rounded-full bg-mv-forest" />}
                      <span>{row.feature}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 leading-relaxed">{row.onset}</td>
                  <td className="py-4 px-5 leading-relaxed">{row.aggravating}</td>
                  <td className="py-4 px-5 leading-relaxed">{row.relieving}</td>
                  <td className="py-4 px-5 font-medium text-mv-forest leading-relaxed">{row.keySign}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Segmented Cards View */}
        <div className="lg:hidden flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 bg-mv-ivory p-1.5 rounded-2xl border border-mv-outline/60">
            {LEG_PAIN_DIFFERENTIAL.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedCondition(idx)}
                className={`py-2 px-3 text-[12.5px] font-semibold rounded-xl text-center transition-all cursor-pointer min-h-[44px] ${
                  selectedCondition === idx
                    ? 'bg-mv-forest text-white shadow-xs'
                    : 'text-mv-ink-muted hover:text-mv-forest'
                }`}
              >
                {item.feature.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="bg-white border border-mv-outline/70 rounded-2xl p-5 shadow-xs">
            <h3 className="font-serif text-[19px] font-semibold text-mv-forest mb-3 pb-2 border-b border-mv-outline/50 flex items-center justify-between">
              <span>{LEG_PAIN_DIFFERENTIAL[selectedCondition].feature}</span>
              {selectedCondition === 0 && (
                <span className="text-[10.5px] bg-mv-forest/10 text-mv-forest px-2.5 py-0.5 rounded-full font-mono">
                  Primary Venous Focus
                </span>
              )}
            </h3>

            <div className="space-y-3 text-[13px]">
              <div>
                <span className="font-semibold text-mv-forest block">Onset &amp; Timing:</span>
                <span className="text-mv-ink-muted">{LEG_PAIN_DIFFERENTIAL[selectedCondition].onset}</span>
              </div>
              <div>
                <span className="font-semibold text-mv-forest block">Aggravated By:</span>
                <span className="text-mv-ink-muted">{LEG_PAIN_DIFFERENTIAL[selectedCondition].aggravating}</span>
              </div>
              <div>
                <span className="font-semibold text-mv-forest block">Relieved By:</span>
                <span className="text-mv-ink-muted">{LEG_PAIN_DIFFERENTIAL[selectedCondition].relieving}</span>
              </div>
              <div className="pt-2 border-t border-mv-outline/40">
                <span className="font-semibold text-mv-terracotta block">Hallmark Clinical Indicator:</span>
                <span className="text-mv-forest font-medium">{LEG_PAIN_DIFFERENTIAL[selectedCondition].keySign}</span>
              </div>
            </div>
          </div>
        </div>

        {/* The 15-Minute Postural Relief Observation (Educational Bedside Tip) */}
        <div className="mt-10 rounded-3xl border border-mv-outline/70 bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-full bg-mv-ivory text-mv-forest shrink-0 mt-0.5 border border-mv-outline/60">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] sm:text-[19px] text-mv-forest font-semibold">
                The 15-Minute Postural Relief Observation (Educational Bedside Tip)
              </h3>
              <p className="text-[13.5px] text-mv-ink-muted leading-relaxed mt-1 max-w-2xl">
                If resting flat and elevating your legs above heart level for 15 minutes noticeably eases dull aching and heaviness, it strongly suggests a <strong>gravitational venous component</strong> (facilitating passive drainage of stagnant blood). Conversely, if elevating your legs intensifies ischemic calf ache, numbness, or pale coldness, prompt <strong>arterial evaluation</strong> is indicated to rule out peripheral artery disease (PAD). <em>Note: This is an educational observation to discuss with a clinician, not a definitive diagnostic test.</em>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            {onNavigateToAssessment && (
              <button
                type="button"
                onClick={onNavigateToAssessment}
                className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-mv-forest px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-mv-forest/90 transition-colors cursor-pointer shadow-xs"
              >
                <span>Take Symptom Screener</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onOpenAiWithPrompt && (
              <button
                type="button"
                onClick={() => onOpenAiWithPrompt("How can I tell if my leg pain is from varicose veins or an arterial problem?")}
                className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-mv-outline px-4 py-2 text-[12.5px] font-semibold text-mv-forest hover:bg-mv-ivory transition-colors cursor-pointer"
                title={GUIDE_LABELS.open}
              >
                <GuideIcon className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                <span className="hidden sm:inline">{GUIDE_LABELS.ask}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
