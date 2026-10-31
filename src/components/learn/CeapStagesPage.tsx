import React from 'react';
import { AppView } from '../../types';
import { getLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { LearnTopicLayout } from './LearnTopicLayout';
import { ProgressionCEAP } from '../ProgressionCEAP';

interface TopicPageProps {
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onAskMeridbot?: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

export const CeapStagesPage: React.FC<TopicPageProps> = ({
  onNavigateView,
  onNavigateTopic,
  onOpenAssistantWithPrompt,
  onAskMeridbot,
}) => {
  const topic = getLearnTopic('ceap-stages');
  if (!topic) return null;

  return (
    <LearnTopicLayout
      topic={topic}
      onNavigateView={onNavigateView}
      onNavigateTopic={onNavigateTopic}
      onAskMeridbot={onAskMeridbot}
      chips={[
        { label: 'C0 – C1: Spider veins', href: '#progression' },
        { label: 'C2 – C3: Varicose cords & edema', href: '#progression' },
        { label: 'C4 – C6: Skin changes & ulcers', href: '#progression' },
      ]}
    >
      <ProgressionCEAP
        onNavigateToAssessment={() => onNavigateView('assessment')}
        onOpenAiWithPrompt={onOpenAssistantWithPrompt}
      />
    </LearnTopicLayout>
  );
};
