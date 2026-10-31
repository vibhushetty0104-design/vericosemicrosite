import React from 'react';
import { AppView } from '../../types';
import { getLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { CLINICAL_PHOTOS } from '../../content/photos';
import { LearnTopicLayout } from './LearnTopicLayout';
import { DvtAndMisconceptions } from '../DvtAndMisconceptions';
import { AlertTriangle, PhoneCall, Camera } from 'lucide-react';

interface TopicPageProps {
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onAskMeridbot?: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

export const DvtWarningSignsPage: React.FC<TopicPageProps> = ({
  onNavigateView,
  onNavigateTopic,
  onOpenAssistantWithPrompt,
  onAskMeridbot,
}) => {
  const topic = getLearnTopic('dvt-warning-signs');
  if (!topic) return null;

  return (
    <LearnTopicLayout
      topic={topic}
      onNavigateView={onNavigateView}
      onNavigateTopic={onNavigateTopic}
      onAskMeridbot={onAskMeridbot}
      chips={[
        { label: 'Emergency warning signs (Dial 112 / 108)', href: '#dvt-safety' },
        { label: 'DVT vs varicose veins', href: '#dvt-safety' },
        { label: 'Vein myths debunked', href: '#dvt-safety' },
      ]}
    >
      <div className="space-y-10">
        {/* Urgent Clinical Emergency Evaluation Photography Banner */}
        <div className="overflow-hidden rounded-3xl border border-red-200 bg-red-50/40 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-5 overflow-hidden bg-red-100/50">
              <img
                src={CLINICAL_PHOTOS.dvtEmergencyHospital.src}
                alt={CLINICAL_PHOTOS.dvtEmergencyHospital.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 rounded-md bg-red-950/85 px-2.5 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-red-400" />
                <span>{CLINICAL_PHOTOS.dvtEmergencyHospital.clinicalTag}</span>
              </span>
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-[11px] font-mono font-bold tracking-wider uppercase mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                  <span>Immediate Medical Attention Protocol</span>
                </div>
                <h3 className="font-serif text-[22px] sm:text-[24px] font-semibold text-red-950 leading-snug">
                  Emergency Hospital Triage for DVT &amp; Pulmonary Embolism
                </h3>
                <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-red-950/85">
                  Deep vein thrombosis (DVT) and pulmonary embolism (PE) are acute medical emergencies. If you experience sudden, unilateral severe calf or thigh swelling, skin that feels hot to the touch, sudden unexplained shortness of breath, or sharp chest pain that worsens on inspiration, do not wait for an outpatient clinic. Go directly to a tertiary hospital emergency casualty or call national emergency numbers.
                </p>
                <div className="mt-4 pt-4 border-t border-red-200/80 flex flex-wrap items-center gap-4 text-[13px] font-mono">
                  <span className="flex items-center gap-2 bg-red-600 text-white px-3.5 py-1.5 rounded-xl font-bold">
                    <PhoneCall className="w-4 h-4" />
                    <span>Dial 112 / 108 in India</span>
                  </span>
                  <span className="text-red-900 text-xs">Available 24/7 nationwide</span>
                </div>
              </div>
              <div className="mt-6 pt-3 border-t border-red-200/60 text-[12px] text-red-900/70">
                {CLINICAL_PHOTOS.dvtEmergencyHospital.caption}
              </div>
            </div>
          </div>
        </div>

        <DvtAndMisconceptions
          onOpenAiWithPrompt={onOpenAssistantWithPrompt}
          onNavigateToAssessment={() => onNavigateView('assessment')}
        />
      </div>
    </LearnTopicLayout>
  );
};
