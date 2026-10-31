import React from 'react';
import { AppView } from '../../types';
import { getLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { LearnTopicLayout } from './LearnTopicLayout';
import { Causes } from '../Causes';

interface TopicPageProps {
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onAskMeridbot?: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

export const VaricoseCausesPage: React.FC<TopicPageProps> = ({
  onNavigateView,
  onNavigateTopic,
  onOpenAssistantWithPrompt,
  onAskMeridbot,
}) => {
  const topic = getLearnTopic('varicose-veins-causes');
  if (!topic) return null;

  return (
    <LearnTopicLayout
      topic={topic}
      onNavigateView={onNavigateView}
      onNavigateTopic={onNavigateTopic}
      onAskMeridbot={onAskMeridbot}
      chips={[
        { label: 'Familial genetics (90% risk)', href: '#causes' },
        { label: 'Standing occupations in India', href: '#causes' },
        { label: 'Symptom pattern assessment', href: '#assessment' },
      ]}
    >
      <Causes
        onNavigateToAssessment={() => onNavigateView('assessment')}
        onOpenAiWithPrompt={onOpenAssistantWithPrompt}
      />
    </LearnTopicLayout>
  );
};
