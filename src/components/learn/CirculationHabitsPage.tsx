import React from 'react';
import { AppView } from '../../types';
import { getLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { CLINICAL_PHOTOS } from '../../content/photos';
import { LearnTopicLayout } from './LearnTopicLayout';
import { CampaignSection } from '../CampaignSection';
import { HeartPulse, Camera, ArrowRight, Activity } from 'lucide-react';

interface TopicPageProps {
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onAskMeridbot?: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

export const CirculationHabitsPage: React.FC<TopicPageProps> = ({
  onNavigateView,
  onNavigateTopic,
  onAskMeridbot,
}) => {
  const topic = getLearnTopic('circulation-habits');
  if (!topic) return null;

  return (
    <LearnTopicLayout
      topic={topic}
      onNavigateView={onNavigateView}
      onNavigateTopic={onNavigateTopic}
      onAskMeridbot={onAskMeridbot}
      chips={[
        { label: 'Calf muscle activation', href: '#campaign' },
        { label: 'Therapeutic leg elevation', href: '#campaign' },
        { label: 'Graduated compression wear', href: '#campaign' },
      ]}
    >
      <div className="space-y-12">
        {/* Lifestyle & Recovery Photography Dual Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Elevation Feature */}
          <div className="overflow-hidden rounded-3xl border border-mv-outline/70 bg-white shadow-2xs flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-mv-pale/20">
              <img
                src={CLINICAL_PHOTOS.habitsElevation.src}
                alt={CLINICAL_PHOTOS.habitsElevation.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 rounded-md bg-mv-forest/85 px-2.5 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-mv-terracotta" />
                <span>{CLINICAL_PHOTOS.habitsElevation.clinicalTag}</span>
              </span>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-mv-terracotta block mb-1">
                  Gravity Assistance
                </span>
                <h3 className="font-serif text-[20px] font-semibold text-mv-forest leading-snug">
                  15-Minute Daily Leg Elevation
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mv-ink-muted">
                  Elevating your feet above the level of your heart for 15 minutes in the late afternoon allows hydrostatic pressure to drop, encouraging stagnant blood pooled in lower calf veins to drain effortlessly towards the central venous circulation.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-mv-outline/50 text-[12px] text-mv-ink-muted">
                {CLINICAL_PHOTOS.habitsElevation.caption}
              </div>
            </div>
          </div>

          {/* Graduated Compression Feature */}
          <div className="overflow-hidden rounded-3xl border border-mv-outline/70 bg-white shadow-2xs flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-mv-pale/20">
              <img
                src={CLINICAL_PHOTOS.treatmentCompression.src}
                alt={CLINICAL_PHOTOS.treatmentCompression.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 rounded-md bg-mv-forest/85 px-2.5 py-1 text-[11px] font-mono font-medium text-white backdrop-blur-xs flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-mv-terracotta" />
                <span>{CLINICAL_PHOTOS.treatmentCompression.clinicalTag}</span>
              </span>
            </div>
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-mv-terracotta block mb-1">
                  Mechanical Counter-Pressure
                </span>
                <h3 className="font-serif text-[20px] font-semibold text-mv-forest leading-snug">
                  Graduated Medical Compression Wear
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mv-ink-muted">
                  True medical compression stockings exert highest pressure at the ankle (e.g. 20–30 mmHg for Class 2) that gradually decreases up the calf. This narrows vein diameter and accelerates linear blood flow velocity even during sedentary hours.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-mv-outline/50 text-[12px] text-mv-ink-muted">
                {CLINICAL_PHOTOS.treatmentCompression.caption}
              </div>
            </div>
          </div>
        </div>

        <CampaignSection />

        {/* Calf Muscle Pump Anatomical Education Cross-Link */}
        <div className="rounded-3xl border border-mv-outline/80 bg-white p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-mv-terracotta block mb-1">
              Physiological Deep-Dive
            </span>
            <h4 className="font-serif text-[20px] sm:text-[22px] font-semibold text-mv-forest">
              See How the Calf-Muscle Pump Drives Blood Upward
            </h4>
            <p className="mt-2 text-[14px] text-mv-ink-muted leading-relaxed">
              Explore our interactive 5-stage anatomical animation to see exactly how contracting calf muscles compress deep veins and how healthy vs incompetent valves regulate blood flow.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTopic('leg-circulation')}
            className="self-start sm:self-auto min-h-[44px] px-5 py-2.5 rounded-full bg-mv-forest text-white font-mono text-[12.5px] font-semibold hover:bg-mv-forest/90 transition-all cursor-pointer flex items-center gap-2 shadow-xs shrink-0"
          >
            <Activity className="w-4 h-4 text-mv-terracotta" />
            <span>Launch Anatomical Animation</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </LearnTopicLayout>
  );
};
