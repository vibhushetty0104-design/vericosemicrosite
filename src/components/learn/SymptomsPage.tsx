import React from 'react';
import { AppView } from '../../types';
import { getLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { LearnTopicLayout } from './LearnTopicLayout';
import { Symptoms } from '../Symptoms';

interface TopicPageProps {
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onAskMeridbot?: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

export const SymptomsPage: React.FC<TopicPageProps> = ({
  onNavigateView,
  onNavigateTopic,
  onOpenAssistantWithPrompt,
  onAskMeridbot,
}) => {
  const topic = getLearnTopic('symptoms');
  if (!topic) return null;

  return (
    <LearnTopicLayout
      topic={topic}
      onNavigateView={onNavigateView}
      onNavigateTopic={onNavigateTopic}
      onAskMeridbot={onAskMeridbot}
      chips={[
        { label: 'Sensory vs visible symptoms', href: '#symptoms' },
        { label: 'When to see a doctor', href: '#symptoms' },
        { label: 'Start symptom assessment', href: '#assessment' },
      ]}
    >
      <Symptoms
        onNavigateToAssessment={() => onNavigateView('assessment')}
        onOpenAiWithPrompt={onOpenAssistantWithPrompt}
      />
    </LearnTopicLayout>
  );
};
