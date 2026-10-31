import React from 'react';
import { AppView } from '../../types';
import { getLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { LearnTopicLayout } from './LearnTopicLayout';
import { VascularTopicExplorer } from '../VascularTopicExplorer';

interface TopicPageProps {
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onOpenAssistantWithPrompt?: (prompt: string) => void;
  onAskMeridbot?: (prompt?: string) => void;
  onOpenBooking?: () => void;
}

export const TopicExplorerPage: React.FC<TopicPageProps> = ({
  onNavigateView,
  onNavigateTopic,
  onOpenAssistantWithPrompt,
  onAskMeridbot,
}) => {
  const topic = getLearnTopic('topic-explorer');
  if (!topic) return null;

  return (
    <LearnTopicLayout
      topic={topic}
      onNavigateView={onNavigateView}
      onNavigateTopic={onNavigateTopic}
      onAskMeridbot={onAskMeridbot}
      chips={[
        { label: 'Interactive curriculum tabs', href: '#topic-explorer' },
        { label: 'SVS & AVF guidelines', href: '#topic-explorer' },
        { label: 'Care pathway sequence', href: '#journey' },
      ]}
    >
      <VascularTopicExplorer
        onNavigateView={onNavigateView}
        onOpenAssistantWithPrompt={onOpenAssistantWithPrompt || (() => {})}
      />
    </LearnTopicLayout>
  );
};
