import React, { useState } from 'react';
import { TREATMENT_MODALITIES } from '../data/clinicalContent';
import { CLINICAL_PHOTOS, MedicalPhoto } from '../content/photos';
import { Shield, Clock, Zap, CheckCircle2, ChevronRight, Camera } from 'lucide-react';

function getModalityPhoto(index: number): MedicalPhoto {
  switch (index) {
    case 0: // Parameter
      return CLINICAL_PHOTOS.clinicalDopplerExam;
    case 1: // Micro-Phlebectomy
      return CLINICAL_PHOTOS.clinicalConsultation;
    case 2: // Foam Sclerotherapy
      return CLINICAL_PHOTOS.clinicalDopplerExam;
    case 3: // Radiofrequency Ablation (RFA)
      return CLINICAL_PHOTOS.treatmentLaserEvla;
    case 4: // Laser Ablation (EVLA)
      return CLINICAL_PHOTOS.treatmentLaserEvla;
    case 5: // VenaSeal (Glue)
      return CLINICAL_PHOTOS.treatmentVenasealGlue;
    default:
      return CLINICAL_PHOTOS.clinicalDopplerExam;
  }
}

export const TreatmentModalities: React.FC = () => {
  const [selectedTx, setSelectedTx] = useState<number>(0);
  const current = TREATMENT_MODALITIES[selectedTx];

  return (
    <section id="treatment" className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-mv-outline/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] font-semibold text-mv-terracotta mb-2">
            Minimally Invasive Outpatient Therapies
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-mv-forest tracking-tight">
            Modern Treatment Options: No Hospital Stays, No Stripping
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-mv-ink-muted leading-relaxed">
            Painful vein stripping surgeries with weeks of bedrest are obsolete. Today&apos;s outpatient endovenous procedures seal diseased saphenous veins through a tiny needle puncture in under 45 minutes, allowing you to walk out immediately.
          </p>
        </div>

        {/* Treatment Selector Tabs + Detail Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Treatment Selector List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {TREATMENT_MODALITIES.map((tx, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTx(idx)}
                className={`w-full text-left p-4.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer min-h-[56px] tap-tactile ${
                  selectedTx === idx
                    ? 'bg-white border-mv-forest/50 shadow-2xs ring-1 ring-mv-forest/30'
                    : 'bg-white/60 border-mv-outline/70 hover:bg-white text-mv-ink-muted'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono text-mv-ink-muted uppercase tracking-wider block mb-0.5">
                    {tx.category}
                  </span>
                  <span className="font-serif text-sm sm:text-base font-bold text-mv-forest">
                    {tx.name}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  selectedTx === idx ? 'text-mv-forest translate-x-1' : 'text-mv-ink-muted/60'
                }`} />
              </button>
            ))}
          </div>

          {/* Right Column: Detailed Treatment Dossier */}
          <div className="lg:col-span-7 bg-white border border-mv-outline/70 rounded-3xl p-7 sm:p-9 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-mv-outline/60 gap-3 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] font-semibold text-mv-terracotta">
                  {current.category}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-mv-forest mt-0.5">
                  {current.name}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-mv-cream border border-mv-outline/70 text-mv-forest px-3 py-1 rounded-full self-start sm:self-center">
                {current.successRate}
              </span>
            </div>

            {/* Clinical Setting Photograph */}
            {(() => {
              const photo = getModalityPhoto(selectedTx);
              return (
                <div className="mb-6 overflow-hidden rounded-2xl border border-mv-outline/70 bg-mv-pale/20 shadow-2xs">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center transition-all duration-300"
                    />
                    <span className="absolute top-3 left-3 rounded-md bg-mv-forest/85 px-2.5 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs flex items-center gap-1.5">
                      <Camera className="w-3 h-3 text-mv-terracotta" />
                      <span>{photo.clinicalTag}</span>
                    </span>
                  </div>
                  <div className="px-4 py-2.5 bg-mv-ivory/60 border-t border-mv-outline/60 text-[12px] text-mv-ink-muted">
                    <span>{photo.caption}</span>
                  </div>
                </div>
              );
            })()}

            {/* How it works */}
            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-mv-forest block mb-1.5">
                How It Works:
              </span>
              <p className="text-xs sm:text-sm text-mv-ink-muted leading-relaxed">
                {current.howItWorks}
              </p>
            </div>

            {/* 3-Cell Metadata Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-mv-outline/60">
                <span className="text-[11px] font-mono text-mv-ink-muted uppercase block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-mv-forest" />
                  <span>Duration</span>
                </span>
                <span className="font-serif text-sm font-bold text-mv-forest mt-1.5 block">
                  {current.duration}
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-mv-outline/60">
                <span className="text-[11px] font-mono text-mv-ink-muted uppercase block flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-mv-terracotta" />
                  <span>Anesthesia</span>
                </span>
                <span className="font-serif text-xs font-bold text-mv-forest mt-1.5 block leading-snug">
                  {current.anesthesia}
                </span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-mv-outline/60">
                <span className="text-[11px] font-mono text-mv-ink-muted uppercase block flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-mv-forest" />
                  <span>Ambulation</span>
                </span>
                <span className="font-serif text-xs font-bold text-mv-forest mt-1.5 block leading-snug">
                  Immediate (Walk out)
                </span>
              </div>
            </div>

            {/* Recovery & Ideal Candidacy */}
            <div className="space-y-3.5 text-xs sm:text-sm pt-5 border-t border-mv-outline/60">
              <div>
                <strong className="text-mv-forest">Post-Procedure Recovery: </strong>
                <span className="text-mv-ink-muted leading-relaxed">{current.recovery}</span>
              </div>
              <div>
                <strong className="text-mv-forest">Ideal Clinical Candidacy: </strong>
                <span className="text-mv-ink-muted leading-relaxed">{current.idealFor}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
