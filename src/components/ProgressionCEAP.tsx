import React, { useState } from 'react';
import { CEAP_STAGES } from '../data/clinicalContent';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';
import { GUIDE_LABELS, GuideIcon } from '../content/guideLabels';

interface ProgressionCEAPProps {
  onNavigateToAssessment?: () => void;
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const ProgressionCEAP: React.FC<ProgressionCEAPProps> = ({
  onNavigateToAssessment,
  onOpenAiWithPrompt,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(2); // Default to C2 (Varicose Veins)
  const currentStage = CEAP_STAGES[selectedStageIndex];

  return (
    <section id="progression" className="py-16 sm:py-24 bg-white border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-mv-ink-muted text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
              <span>INTERNATIONAL STAGING STANDARD</span>
              <span>·</span>
              <span>AMERICAN VENOUS FORUM</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
              Disease Progression: The CEAP Classification (C0 – C6)
            </h2>
            <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-mv-ink-muted">
              Venous disease exists along a clinical spectrum. While untreated hemodynamic reflux can progress in some individuals, many patients remain stable with conservative measures. The CEAP classification helps clinicians standardize clinical severity from early spider veins to advanced trophic changes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-mono text-mv-forest bg-mv-ivory px-3.5 py-1.5 rounded-full border border-mv-outline shrink-0 self-start lg:self-auto">
            <span>Clinical Staging Tool</span>
          </div>
        </div>

        {/* Step Indicator Bar (Editorial Progression Rail) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-10 bg-mv-ivory p-1.5 rounded-2xl border border-mv-outline/70">
          {CEAP_STAGES.map((s, idx) => {
            const isSelected = selectedStageIndex === idx;
            return (
              <button
                key={s.stage}
                type="button"
                onClick={() => setSelectedStageIndex(idx)}
                className={`py-2.5 px-1 text-center rounded-xl transition-all cursor-pointer flex flex-col items-center min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                  isSelected
                    ? 'bg-mv-forest text-white shadow-xs font-bold'
                    : 'text-mv-ink-muted hover:bg-white hover:text-mv-forest'
                }`}
              >
                <span className="font-serif text-[16px] sm:text-[18px] block">
                  {s.stage}
                </span>
                <span className="text-[10.5px] truncate max-w-full font-mono font-medium hidden md:inline">
                  {s.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail (Open Editorial Layout, No Nested Boxes) */}
        <div className="rounded-3xl border border-mv-outline/70 bg-[#FAF7F2] p-6 lg:p-10 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-mv-outline/60 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-serif text-[30px] sm:text-[34px] font-bold text-mv-terracotta leading-none">
                  Stage {currentStage.stage}
                </span>
                <span className="font-serif text-[22px] sm:text-[24px] font-semibold text-mv-forest">
                  — {currentStage.name}
                </span>
              </div>
              <p className="text-[14.5px] text-mv-ink-muted mt-2 leading-relaxed max-w-2xl">
                {currentStage.clinicalDescription}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              <span className={`text-[11.5px] font-mono font-bold px-3.5 py-1.5 rounded-full ${
                currentStage.urgency === 'Immediate'
                  ? 'bg-red-100 text-red-800'
                  : currentStage.urgency === 'High'
                  ? 'bg-amber-100 text-amber-900'
                  : currentStage.urgency === 'Moderate'
                  ? 'bg-yellow-100 text-yellow-900'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                Urgency: {currentStage.urgency}
              </span>
            </div>
          </div>

          {/* 3-Column Detailed Anatomical Matrix (Open Columns with Hairline Dividers) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Physical Manifestations */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-mv-forest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mv-terracotta" />
                  <span>Physical Manifestations</span>
                </div>
                <ul className="space-y-2.5 text-[13.5px] text-mv-ink-muted">
                  {currentStage.physicalManifestations.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-mv-terracotta font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reflux Mechanism */}
            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-mv-outline/60 pt-6 md:pt-0 md:pl-8">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-mv-forest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span>Hemodynamic Mechanism</span>
                </div>
                <p className="text-[13.5px] text-mv-ink-muted leading-relaxed">
                  {currentStage.refluxMechanism}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-mv-outline/40 text-[12px] text-mv-forest font-mono">
                <strong>Reversibility:</strong> {currentStage.reversibility}
              </div>
            </div>

            {/* Recommended Treatments */}
            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-mv-outline/60 pt-6 md:pt-0 md:pl-8">
              <div>
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-mv-forest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-mv-forest" />
                  <span>Common Clinical Treatments</span>
                </div>
                <ul className="space-y-2.5 text-[13.5px] text-mv-ink-muted">
                  {currentStage.treatmentApproaches.map((tx, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tx}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Bottom Stage Navigation Bar & Interactive Actions */}
          <div className="mt-10 pt-6 border-t border-mv-outline/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSelectedStageIndex(Math.max(0, selectedStageIndex - 1))}
                disabled={selectedStageIndex === 0}
                className="text-[13px] font-semibold text-mv-forest hover:text-mv-terracotta disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer min-h-[44px]"
              >
                ← Previous ({selectedStageIndex > 0 ? CEAP_STAGES[selectedStageIndex - 1].stage : 'Start'})
              </button>

              <span className="text-[12px] font-mono text-mv-ink-muted">
                Stage {selectedStageIndex + 1} of {CEAP_STAGES.length}
              </span>

              <button
                type="button"
                onClick={() => setSelectedStageIndex(Math.min(CEAP_STAGES.length - 1, selectedStageIndex + 1))}
                disabled={selectedStageIndex === CEAP_STAGES.length - 1}
                className="text-[13px] font-semibold text-mv-forest hover:text-mv-terracotta disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer min-h-[44px]"
              >
                Next ({selectedStageIndex < CEAP_STAGES.length - 1 ? CEAP_STAGES[selectedStageIndex + 1].stage : 'End'}) →
              </button>
            </div>

            <div className="flex items-center gap-3">
              {onNavigateToAssessment && (
                <button
                  type="button"
                  onClick={onNavigateToAssessment}
                  className="min-h-[44px] inline-flex items-center gap-2 text-[13px] font-semibold text-white bg-mv-forest px-4.5 py-2 rounded-full hover:bg-mv-forest/90 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Check Your CEAP Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {onOpenAiWithPrompt && (
                <button
                  type="button"
                  onClick={() => onOpenAiWithPrompt(`What does CEAP Stage ${currentStage.stage} (${currentStage.name}) mean for long-term health and treatment?`)}
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-mv-forest bg-mv-ivory px-4 py-2 rounded-full hover:bg-mv-forest hover:text-white transition-all cursor-pointer border border-mv-outline/70"
                  title={GUIDE_LABELS.open}
                >
                  <GuideIcon className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                  <span>Ask the guide about {currentStage.stage}</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
