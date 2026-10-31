import React from 'react';
import { AppView } from '../types';
import { LEARN_TOPICS, LearnTopicSlug, hrefForLearnTopic } from '../content/siteNav';
import { PageHero } from './scene/PageHero';
import { VenousSimulation } from './simulation/VenousSimulation';
import {
  LegCirculationPage,
  VaricoseCausesPage,
  SymptomsPage,
  DvtWarningSignsPage,
  LegPainPage,
  CeapStagesPage,
  DidYouKnowPage,
  CirculationHabitsPage,
  TopicExplorerPage,
} from './learn';

interface LearnViewProps {
  learnTopic?: LearnTopicSlug | null;
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
  onAskMeridbot: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

/**
 * Educational hub (#learn) or dedicated topic page (#learn/<slug>).
 * Renders the dedicated page when learnTopic is specified, or the 9-topic visual directory hub when not.
 */
export const LearnView: React.FC<LearnViewProps> = ({
  learnTopic,
  onNavigateView,
  onNavigateTopic,
  onOpenAssistantWithPrompt,
  onAskMeridbot,
  onOpenBooking,
}) => {
  // If a specific topic is active, render its dedicated page component
  if (learnTopic === 'leg-circulation') {
    return (
      <LegCirculationPage
        onNavigateView={onNavigateView}
        onNavigateTopic={onNavigateTopic}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt}
        onAskMeridbot={onAskMeridbot}
        onOpenBooking={onOpenBooking}
      />
    );
  }

  if (learnTopic === 'varicose-veins-causes') {
    return (
      <VaricoseCausesPage
        onNavigateView={onNavigateView}
        onNavigateTopic={onNavigateTopic}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt}
        onAskMeridbot={onAskMeridbot}
        onOpenBooking={onOpenBooking}
      />
    );
  }

  if (learnTopic === 'symptoms') {
    return (
      <SymptomsPage
        onNavigateView={onNavigateView}
        onNavigateTopic={onNavigateTopic}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt}
        onAskMeridbot={onAskMeridbot}
        onOpenBooking={onOpenBooking}
      />
    );
  }

  if (learnTopic === 'dvt-warning-signs') {
    return (
      <DvtWarningSignsPage
        onNavigateView={onNavigateView}
        onNavigateTopic={onNavigateTopic}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt}
        onAskMeridbot={onAskMeridbot}
        onOpenBooking={onOpenBooking}
      />
    );
  }

  if (learnTopic === 'leg-pain') {
    return (
      <LegPainPage
        onNavigateView={onNavigateView}
        onNavigateTopic={onNavigateTopic}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt}
        onAskMeridbot={onAskMeridbot}
        onOpenBooking={onOpenBooking}
      />
    );
  }

  if (learnTopic === 'ceap-stages') {
    return (
      <CeapStagesPage
        onNavigateView={onNavigateView}
        onNavigateTopic={onNavigateTopic}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt}
        onAskMeridbot={onAskMeridbot}
        onOpenBooking={onOpenBooking}
      />
    );
  }

  if (learnTopic === 'did-you-know') {
    return (
      <DidYouKnowPage
        onNavigateView={onNavigateView}
        onNavigateTopic={onNavigateTopic}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt}
        onAskMeridbot={onAskMeridbot}
        onOpenBooking={onOpenBooking}
      />
    );
  }

  if (learnTopic === 'circulation-habits') {
    return (
      <CirculationHabitsPage
        onNavigateView={onNavigateView}
        onNavigateTopic={onNavigateTopic}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt}
        onAskMeridbot={onAskMeridbot}
        onOpenBooking={onOpenBooking}
      />
    );
  }

  if (learnTopic === 'topic-explorer') {
    return (
      <TopicExplorerPage
        onNavigateView={onNavigateView}
        onNavigateTopic={onNavigateTopic}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt}
        onAskMeridbot={onAskMeridbot}
        onOpenBooking={onOpenBooking}
      />
    );
  }

  // Hub overview (#learn)
  return (
    <>
      <PageHero
        id="learn"
        title="Learn about leg veins"
        lede="How leg veins work, what symptoms can mean, which signs are urgent, and how doctors describe stages. General education, not a diagnosis."
        illustrations={['vein-anatomy', 'valve-function', 'risk-factors']}
        meridbotPose="present"
        chips={[
          { label: 'Valve simulation', href: '#valve-simulation' },
          { label: 'Blood clot warning signs', href: '#learn/dvt-warning-signs' },
          { label: 'All 9 topics', href: '#learn-contents' },
        ]}
        onAskMeridbot={() => onAskMeridbot?.('Can you explain leg circulation in simple terms?')}
      />

      <VenousSimulation />

      <nav id="learn-contents" aria-labelledby="learn-contents-title" className="border-b border-mv-outline/60 bg-mv-ivory py-12 sm:py-16">
        <div className="container-page max-w-[1240px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-mv-outline/50 mb-8">
            <div>
              <p className="font-mono text-[12px] font-bold tracking-[0.14em] uppercase text-mv-forest">
                NINE DEDICATED EDUCATIONAL GUIDES
              </p>
              <h2 id="learn-contents-title" className="mt-1 font-serif text-[26px] sm:text-[32px] font-semibold text-mv-forest leading-tight">
                Explore Leg Health Topics
              </h2>
            </div>
            <p className="text-[14px] text-mv-ink-muted max-w-md">
              Select any topic below to open its dedicated guide with interactive anatomical models, clinical summaries, and patient checklists.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {LEARN_TOPICS.map((topic) => (
              <a
                key={topic.slug}
                href={hrefForLearnTopic(topic.slug)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTopic(topic.slug);
                }}
                className="group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white/90 border border-mv-outline/70 shadow-2xs hover:shadow-md hover:border-mv-forest/30 hover:bg-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest min-h-[44px]"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-mv-ivory p-1.5 border border-mv-outline/50 shadow-2xs group-hover:scale-105 transition-transform"
                  aria-hidden="true"
                >
                  <picture>
                    <source srcSet={topic.iconWebp} type="image/webp" />
                    <img
                      src={topic.iconPng}
                      alt=""
                      width={44}
                      height={44}
                      loading="lazy"
                      decoding="async"
                      className="w-11 h-11 object-contain"
                    />
                  </picture>
                </div>

                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-mv-terracotta block">
                    {topic.badge}
                  </span>
                  <h3 className="mt-0.5 font-serif text-[17px] sm:text-[18px] font-semibold text-mv-forest group-hover:text-mv-terracotta transition-colors leading-snug">
                    {topic.shortTitle}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-mv-ink-muted line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};
