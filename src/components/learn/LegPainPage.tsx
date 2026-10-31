import React from 'react';
import { AppView } from '../../types';
import { getLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { LearnTopicLayout } from './LearnTopicLayout';
import { LegPainDifferential } from '../LegPainDifferential';

interface TopicPageProps {
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onAskMeridbot?: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

export const LegPainPage: React.FC<TopicPageProps> = ({
  onNavigateView,
  onNavigateTopic,
  onOpenAssistantWithPrompt,
  onAskMeridbot,
}) => {
  const topic = getLearnTopic('leg-pain');
  if (!topic) return null;

  return (
    <LearnTopicLayout
      topic={topic}
      onNavigateView={onNavigateView}
      onNavigateTopic={onNavigateTopic}
      onAskMeridbot={onAskMeridbot}
      chips={[
        { label: 'Vein vs nerve pain differential', href: '#leg-pain-differential' },
        { label: 'Muscle fatigue & cramps', href: '#leg-pain-differential' },
        { label: 'Peripheral arterial claudication', href: '#leg-pain-differential' },
      ]}
    >
      <LegPainDifferential
        onNavigateToAssessment={() => onNavigateView('assessment')}
        onOpenAiWithPrompt={onOpenAssistantWithPrompt}
      />
    </LearnTopicLayout>
  );
};
