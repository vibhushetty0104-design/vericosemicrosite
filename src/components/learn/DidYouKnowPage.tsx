import React from 'react';
import { AppView } from '../../types';
import { getLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { LearnTopicLayout } from './LearnTopicLayout';
import { DidYouKnow } from '../DidYouKnow';

interface TopicPageProps {
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onAskMeridbot?: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

export const DidYouKnowPage: React.FC<TopicPageProps> = ({
  onNavigateView,
  onNavigateTopic,
  onAskMeridbot,
}) => {
  const topic = getLearnTopic('did-you-know');
  if (!topic) return null;

  return (
    <LearnTopicLayout
      topic={topic}
      onNavigateView={onNavigateView}
      onNavigateTopic={onNavigateTopic}
      onAskMeridbot={onAskMeridbot}
      chips={[
        { label: 'Hydrostatic pressure metrics', href: '#did-you-know' },
        { label: 'Familial genetics evidence', href: '#did-you-know' },
        { label: 'CEAP stage progression', href: '#learn/ceap-stages' },
      ]}
    >
      <DidYouKnow
        onNavigateToProgression={() => onNavigateTopic('ceap-stages')}
      />
    </LearnTopicLayout>
  );
};
