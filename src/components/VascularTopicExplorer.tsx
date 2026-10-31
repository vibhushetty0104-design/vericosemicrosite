import React, { useState } from 'react';
import { AppView } from '../types';
import {
  BookOpen,
  Activity,
  ShieldAlert,
  Layers,
  HeartPulse,
  Clock,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  ClipboardCheck,
  FileText
} from 'lucide-react';
import { GuideIcon, askGuideAbout } from '../content/guideLabels';

interface VascularTopicExplorerProps {
  onNavigateView: (view: AppView) => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
}

type TopicId = 'circulation' | 'dvt' | 'differential' | 'ceap' | 'doppler' | 'treatments' | 'recovery';

interface TopicItem {
  id: TopicId;
  label: string;
  badge: string;
  title: string;
  summary: string;
  details: string[];
  actionLabel: string;
  actionTarget: () => void;
  aiPrompt: string;
  related: TopicId[];
}

export const VascularTopicExplorer: React.FC<VascularTopicExplorerProps> = ({
  onNavigateView,
  onOpenAssistantWithPrompt,
}) => {
  const [activeTopic, setActiveTopic] = useState<TopicId>('circulation');

  const topics: TopicItem[] = [
    {
      id: 'circulation' as const,
      label: 'Leg Circulation',
      badge: 'Hemodynamics',
      title: 'How Calf Pumps & Bicuspid Valves Return Blood',
      summary: 'Leg veins are low-pressure capacitance vessels that return 90%+ of lower limb blood to the heart via the calf muscle pump.',
      details: [
        'Bicuspid endothelial valves close within 0.5 seconds to block gravitational backflow.',
        'Inactive standing maintains a continuous 90 mmHg column pressure on the ankle veins.',
        'Walking contracts deep sinusoids, instantly lowering ankle pressure to 20–30 mmHg.'
      ],
      actionLabel: 'Explore Circulation Simulation',
      actionTarget: () => {
        const el = document.getElementById('circulation-education');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      aiPrompt: 'Can you explain how the calf muscle pump and venous valves work together?',
      related: ['ceap', 'doppler']
    },
    {
      id: 'dvt' as const,
      label: 'DVT Warning Signs',
      badge: 'Emergency',
      title: 'Deep Vein Thrombosis & Urgent Pulmonary Embolism',
      summary: 'A blood clot in the deep femoral or popliteal veins is a medical emergency distinct from superficial varicose veins.',
      details: [
        'Acute, sudden unilateral swelling of one calf within 24–48 hours.',
        'Severe deep calf pain that worsens when flexing the foot upward (dorsiflexion).',
        'If accompanied by sudden breathlessness or sharp chest pain, call 112 / 108 immediately.'
      ],
      actionLabel: 'View Emergency Red Flags',
      actionTarget: () => {
        const el = document.getElementById('dvt-safety');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      aiPrompt: 'What is the difference between superficial varicose veins and acute DVT?',
      related: ['differential', 'doppler']
    },
    {
      id: 'differential' as const,
      label: 'Venous vs Arterial',
      badge: 'Diagnosis',
      title: 'Distinguishing Venous, Arterial & Sciatic Pain',
      summary: 'Not all leg aches stem from veins. Knowing whether pain is venous, arterial claudication, or spinal nerve compression determines the right imaging.',
      details: [
        'Venous pain worsens with standing and relieves with 15 minutes of leg elevation above heart level.',
        'Arterial pain (PAD) worsens with leg elevation and causes calf cramps during brisk walking that stop with rest.',
        'Sciatica produces sharp electrical shooting pain down the back of the leg to the foot.'
      ],
      actionLabel: 'Compare Differential Guide',
      actionTarget: () => {
        const el = document.getElementById('leg-pain-differential');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
      aiPrompt: 'How can I tell if my leg pain is venous insufficiency or arterial claudication?',
      related: ['circulation', 'ceap']
    },
    {
      id: 'ceap' as const,
      label: 'CEAP Classification',
      badge: 'Staging C0–C6',
      title: 'The 7 Stages of Chronic Venous Disease',
      summary: 'Standardized by the American Venous Forum to classify vein disease from asymptomatic spider veins (C1) to active venous ulcers (C6).',
      details: [
        'C0–C1: Subjective leg heaviness or cosmetic spider/reticular veins under 3 mm.',
        'C2–C3: Palpable varicose cords >3 mm and evening pitting ankle edema.',
        'C4–C6: Permanent brown skin staining (hemosiderin), lipodermatosclerosis, and open ulceration.'
      ],
      actionLabel: 'Take 8-Question Symptom Screener',
      actionTarget: () => onNavigateView('assessment'),
      aiPrompt: 'What does my CEAP stage mean for disease progression and treatment options?',
      related: ['circulation', 'treatments']
    },
    {
      id: 'doppler' as const,
      label: 'Doppler Ultrasound',
      badge: 'Diagnostic Gold Standard',
      title: 'Standing Bilateral Duplex Sonography Protocol',
      summary: 'Ultrasound is the non-invasive gold standard required to map reflux, measure lumen calibers, and approve cashless insurance pre-authorization.',
      details: [
        'Must be conducted in an upright standing posture to measure gravity-dependent reflux.',
        'Pathologic reflux cut-off: >500 ms in superficial saphenous trunks; >1000 ms in deep veins.',
        'Lumen diameter >5.5 mm at the saphenofemoral junction predicts significant truncal disease.'
      ],
      actionLabel: 'Launch Doppler Decoder',
      actionTarget: () => onNavigateView('doppler'),
      aiPrompt: 'Can you help me understand standing duplex ultrasound reflux measurements?',
      related: ['treatments', 'circulation']
    },
    {
      id: 'treatments' as const,
      label: 'Treatment Options',
      badge: 'Outpatient Care',
      title: 'Day-Care Endovenous Ablation (Laser, RFA, VenaSeal)',
      summary: 'Open surgical stripping has been replaced by pinhole catheter interventions performed under local anesthesia with same-day walking.',
      details: [
        'EVLA (Endovenous Laser): 1470nm radial laser collapses the diseased saphenous lumen with heat.',
        'RFA (Radiofrequency Ablation): Controlled 120°C segmental thermal energy seals the vein wall.',
        'VenaSeal: Non-thermal medical cyanoacrylate glue with zero tumescent injections and minimal stockings.'
      ],
      actionLabel: 'Compare Treatment Modalities',
      actionTarget: () => onNavigateView('treatments'),
      aiPrompt: 'How do Laser, RFA, and VenaSeal compare in terms of recovery and pain?',
      related: ['recovery', 'doppler']
    },
    {
      id: 'recovery' as const,
      label: 'Recovery & Stockings',
      badge: 'Follow-Up',
      title: 'Compression Stocking Protocol & Ambulatory Milestones',
      summary: 'Modern endovenous procedures require immediate walking within 1–2 hours, followed by tailored compression and surveillance ultrasound.',
      details: [
        'Walking: Patients walk out of the clinic the same afternoon and return to desk work next day.',
        'Compression: Class II (20–30 mmHg) graduated stockings typically worn 1–2 weeks for thermal procedures.',
        'Surveillance: A 1-week or 1-month follow-up duplex confirms complete truncal occlusion.'
      ],
      actionLabel: 'Consult a Specialist',
      actionTarget: () => onNavigateView('specialists'),
      aiPrompt: 'What is the recommended recovery timeline and compression protocol after vein ablation?',
      related: ['treatments', 'doppler']
    }
  ];

  const currentTopic = topics.find(t => t.id === activeTopic) || topics[0];

  return (
    <section id="topic-explorer" className="py-16 sm:py-24 bg-white border-b border-mv-outline/50">
      <div className="container-page max-w-[1200px]">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pb-6 border-b border-mv-outline/60">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-mv-ink-muted text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
              <BookOpen className="w-4 h-4 text-mv-forest" />
              <span>NAVIGABLE VASCULAR KNOWLEDGE BASE · PATIENT EDUCATION</span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
              Vascular Topic Explorer
            </h2>
            <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-mv-ink-muted">
              Browse dedicated clinical explanations across all aspects of lower extremity vein care. Jump between topics or connect directly to diagnostic tools and specialist consultation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-mono text-mv-forest bg-mv-ivory px-3.5 py-1.5 rounded-full border border-mv-outline shrink-0 self-start lg:self-auto">
            <span>7 Core Clinical Topics</span>
          </div>
        </div>

        {/* Topic Tabs Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none border-b border-mv-outline/60 mb-10">
          {topics.map((t) => {
            const isActive = activeTopic === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTopic(t.id)}
                className={`min-h-[44px] px-5 py-2.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                  isActive
                    ? 'bg-mv-forest text-white shadow-xs'
                    : 'bg-mv-ivory text-mv-ink-muted hover:bg-white hover:text-mv-forest border border-mv-outline/70'
                }`}
              >
                <span>{t.label}</span>
                {t.badge === 'Emergency' && (
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Topic Content Panel (Open Editorial Layout) */}
        <div className="rounded-3xl border border-mv-outline/70 bg-[#FAF7F2] p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left 7 Columns: Topic Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-mv-ivory px-3 py-0.5 text-[11px] font-mono font-semibold text-mv-forest border border-mv-outline/60">
                  {currentTopic.badge}
                </span>
                <span className="text-[12px] font-mono text-mv-ink-muted">
                  Topic Guide
                </span>
              </div>

              <h3 className="font-serif text-[26px] sm:text-[30px] font-semibold text-mv-forest leading-tight">
                {currentTopic.title}
              </h3>

              <p className="text-[15.5px] sm:text-[16.5px] text-mv-ink-muted leading-relaxed">
                {currentTopic.summary}
              </p>

              {/* Bulleted Clinical Insights */}
              <div className="rounded-2xl bg-white p-6 border border-mv-outline/60 space-y-3.5 shadow-2xs">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-mv-forest block">
                  Key Clinical Takeaways:
                </span>
                <ul className="space-y-3 text-[13.5px] text-mv-ink-muted">
                  {currentTopic.details.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={currentTopic.actionTarget}
                  className="min-h-[44px] inline-flex items-center gap-2 rounded-full bg-mv-forest px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-mv-forest/90 transition-colors cursor-pointer shadow-xs"
                >
                  <span>{currentTopic.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAssistantWithPrompt(currentTopic.aiPrompt)}
                  className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-mv-outline bg-white px-4 py-2 text-[12.5px] font-semibold text-mv-forest hover:bg-mv-ivory transition-colors cursor-pointer"
                >
                  <GuideIcon className="w-3.5 h-3.5 text-mv-terracotta" aria-hidden="true" />
                  <span>{askGuideAbout('this topic')}</span>
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Related Topics & Next Journey Steps */}
            <div className="lg:col-span-5 rounded-2xl border border-mv-outline/60 bg-white p-6 sm:p-7 shadow-2xs space-y-6">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-mv-forest block mb-1">
                  Connected Patient Journey
                </span>
                <h4 className="font-serif text-[19px] sm:text-[20px] font-semibold text-mv-forest">
                  Recommended Next Steps
                </h4>
                <p className="text-[13px] text-mv-ink-muted mt-1 leading-relaxed">
                  Connect your symptoms with the appropriate diagnostic and treatment milestones.
                </p>
              </div>

              <div className="space-y-3">
                {currentTopic.related.map((relId) => {
                  const relTopic = topics.find(t => t.id === relId);
                  if (!relTopic) return null;
                  return (
                    <button
                      key={relId}
                      type="button"
                      onClick={() => setActiveTopic(relId)}
                      className="w-full text-left p-4 rounded-xl border border-mv-outline/60 bg-mv-ivory/60 hover:bg-white hover:border-mv-forest/40 transition-colors cursor-pointer flex items-center justify-between group min-h-[44px]"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-mv-terracotta block">
                          Related: {relTopic.badge}
                        </span>
                        <span className="text-[13.5px] font-semibold text-mv-forest group-hover:text-mv-terracotta transition-colors">
                          {relTopic.label}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-mv-forest/40 group-hover:text-mv-terracotta group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })}
              </div>

              {/* Direct Booking Link */}
              <div className="pt-3 border-t border-mv-outline/50">
                <button
                  type="button"
                  onClick={() => onNavigateView('specialists')}
                  className="min-h-[44px] w-full text-center py-2.5 px-4 rounded-full border border-mv-forest/30 bg-white hover:bg-mv-forest hover:text-white text-[13px] font-semibold text-mv-forest transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Find a Certified Specialist in Your City</span>
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
