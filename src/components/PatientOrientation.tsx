import { AppView } from '../types';
import { ValvyCharacter } from './VascularCharacters';
import { trackEvent } from '../utils/analytics';
import {
  ArrowRight,
  Activity,
  ClipboardCheck,
  Stethoscope,
  Compass,
  Layers,
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface PatientOrientationProps {
  onNavigateView: (view: AppView) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export const PatientOrientation: React.FC<PatientOrientationProps> = ({
  onNavigateView,
}) => {
  const continuumSteps = [
    {
      stepNumber: "01",
      title: "Evaluate Leg Symptoms",
      stage: "Clinical Screener",
      ceapContext: "Self-Reported Symptoms",
      description: "Answer 8 screening questions covering evening heaviness, ankle swelling, venous cords, and skin changes to summarize your symptom pattern (not a diagnosis or CEAP class).",
      view: 'assessment' as AppView,
      icon: ClipboardCheck,
      actionText: "Start Symptom Screener",
      highlight: "8 Questions · 3 Mins",
    },
    {
      stepNumber: "02",
      title: "Decode Doppler Ultrasound",
      stage: "Diagnostic Mapping",
      ceapContext: "Standing Reflux >500ms",
      description: "Understand your scan report: saphenofemoral junction (SFJ) incompetence, valve reflux duration, vein lumen caliber, and deep vein patency.",
      view: 'doppler' as AppView,
      icon: Activity,
      actionText: "Decode Report Terms",
      highlight: "SVS/AVF Thresholds",
    },
    {
      stepNumber: "03",
      title: "Compare Treatment Modalities",
      stage: "Interventional Options",
      ceapContext: "Laser vs RFA vs VenaSeal",
      description: "Review modern outpatient day-care procedures: EVLA, Radiofrequency Ablation, VenaSeal adhesive, and foam sclerotherapy with recovery timelines.",
      view: 'treatments' as AppView,
      icon: Layers,
      actionText: "Compare Modalities",
      highlight: "Day-Care · Zero Stitches",
    },
    {
      stepNumber: "04",
      title: "Discover Indian Specialists",
      stage: "Consultation & OPD",
      ceapContext: "Demo specialist profiles",
      description: "Locate board-certified MCh/DNB vascular surgeons and FVIR interventional radiologists across Bengaluru, Mumbai, Delhi NCR, Hyderabad, and Chennai.",
      view: 'specialists' as AppView,
      icon: Stethoscope,
      actionText: "Find Metro Specialists",
      highlight: "Cashless Mediclaim",
    },
    {
      stepNumber: "05",
      title: "Explore 6-Stage Care Pathway",
      stage: "Patient Trajectory",
      ceapContext: "End-to-End Continuity",
      description: "Walk through the complete patient journey from initial symptom recognition to duplex mapping, outpatient intervention, and long-term surveillance.",
      view: 'journey' as AppView,
      icon: Compass,
      actionText: "View Care Roadmap",
      highlight: "6 Step Milestones",
    },
    {
      stepNumber: "06",
      title: "Patient Preparation Portal",
      stage: "Clinic Readiness",
      ceapContext: "Dossier & Checklist",
      description: "Review your saved symptom score, upload clinical photos or Doppler scan files, and prepare essential questions for your doctor's consultation.",
      view: 'dashboard' as AppView,
      icon: FileText,
      actionText: "Open Patient Portal",
      highlight: "Personalized Briefing",
    },
  ];

  return (
    <section className="border-b border-[#0A3B32]/10 bg-[#FAF7F2] py-16 sm:py-24">
      <div className="container-page">
        
        {/* Section Header */}
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[#0A3B32]/10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#0A3B32]/70 text-[11px] font-bold tracking-[0.14em] uppercase font-mono mb-2">
              <span>MERIDIAN CARE CONTINUUM</span>
              <span>·</span>
              <span>STRUCTURED NAVIGATION</span>
            </div>
            <h2 className="heading-serif-section text-[#0A3B32]">
              Where are you in your vascular care?
            </h2>
            <p className="mt-3 text-[15.5px] sm:text-[16.5px] leading-relaxed text-[#3D4A45]">
              Meridian Vascular organizes vein health into a cohesive, evidence-grounded journey. Jump directly to the stage that reflects your current diagnostic or treatment need.
            </p>
          </div>

          <div className="flex items-center gap-5 self-start md:self-auto shrink-0">
            {/* Friendly Valvy Companion floating gently in safe desktop header space */}
            <div className="hidden lg:block pointer-events-none">
              <ValvyCharacter size="sm" showBadge={true} badgePosition="top" />
            </div>

            <div className="flex items-center gap-2 text-[12px] font-mono text-[#0A3B32] bg-[#E5EDE8] px-3.5 py-2 rounded-full border border-[#0A3B32]/15">
              <ShieldCheck className="w-4 h-4 text-[#0A3B32]" />
              <span>SVS, AVF &amp; AVLS Consensus</span>
            </div>
          </div>
        </div>

        {/* 6-Stage Grid Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {continuumSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.stepNumber}
                className="group relative flex flex-col justify-between rounded-2xl border border-[#0A3B32]/10 bg-white p-6 shadow-[0_1px_4px_rgba(10,59,50,0.04)] hover:shadow-md hover:border-[#0A3B32]/25 transition-all duration-200"
              >
                <div>
                  
                  {/* Step Top Badge Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A3B32] text-white text-[11px] font-mono font-bold">
                        {step.stepNumber}
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#0A3B32]/70">
                        {step.stage}
                      </span>
                    </div>
                    <span className="rounded-full bg-[#E5EDE8] px-2.5 py-0.5 text-[10.5px] font-mono font-semibold text-[#0A3B32]">
                      {step.highlight}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-serif text-[19px] sm:text-[20px] font-semibold text-[#0A3B32] group-hover:text-[#C85A3F] transition-colors leading-snug">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-[12px] font-mono text-[#0A3B32]/65 font-medium">
                    {step.ceapContext}
                  </p>

                  {/* Card Description */}
                  <p className="mt-3 text-[14.5px] sm:text-[15px] leading-relaxed text-[#4A5563]">
                    {step.description}
                  </p>

                </div>

                {/* Card Bottom Action */}
                <div className="mt-6 pt-4 border-t border-[#0A3B32]/8 flex items-center justify-between">
                  <span className="text-[11.5px] font-mono text-[#707E94]">
                    Step {step.stepNumber} of 06
                  </span>
                  <button
                    onClick={() => {
                      trackEvent('page_view', { from: 'continuum_card', stepNumber: step.stepNumber, targetView: step.view });
                      onNavigateView(step.view);
                    }}
                    className="tap-tactile min-h-[44px] py-2 px-3 rounded-full hover:bg-[#FAF7F2] inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[#0A3B32] group-hover:text-[#C85A3F] transition-colors cursor-pointer"
                  >
                    <span>{step.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
