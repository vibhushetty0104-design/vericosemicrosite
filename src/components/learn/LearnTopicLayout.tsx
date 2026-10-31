import React from 'react';
import { PageHero, HeroChip } from '../scene/PageHero';
import { LearnTopicConfig, LEARN_TOPICS, hrefForLearnTopic, LearnTopicSlug } from '../../content/siteNav';
import { ArrowLeft, ArrowRight, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { AppView } from '../../types';

interface LearnTopicLayoutProps {
  topic: LearnTopicConfig;
  onNavigateView: (view: AppView) => void;
  onNavigateTopic: (slug: LearnTopicSlug) => void;
  onAskMeridbot?: (prompt?: string) => void;
  chips?: HeroChip[];
  children: React.ReactNode;
}

export const LearnTopicLayout: React.FC<LearnTopicLayoutProps> = ({
  topic,
  onNavigateView,
  onNavigateTopic,
  onAskMeridbot,
  chips = [],
  children,
}) => {
  const currentIndex = LEARN_TOPICS.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIndex > 0 ? LEARN_TOPICS[currentIndex - 1] : null;
  const nextTopic = currentIndex < LEARN_TOPICS.length - 1 ? LEARN_TOPICS[currentIndex + 1] : null;

  return (
    <article aria-labelledby={`topic-${topic.slug}-title`} className="min-h-screen bg-[#FAF7F2]">
      
      {/* Top Breadcrumb Rail */}
      <nav aria-label="Breadcrumb" className="border-b border-mv-outline/60 bg-mv-ivory/80 py-3">
        <div className="container-page max-w-[1200px] flex items-center justify-between text-[13px]">
          <a
            href="#explore-leg-health"
            onClick={(e) => {
              e.preventDefault();
              onNavigateView('home');
              setTimeout(() => {
                const el = document.getElementById('explore-leg-health');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="inline-flex items-center gap-1.5 font-semibold text-mv-forest hover:text-mv-terracotta transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-mv-terracotta" aria-hidden="true" />
            <span>← Back to Explore Leg Health</span>
          </a>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-mv-ink-muted">
            <span>TOPIC 0{currentIndex + 1} OF 09</span>
            <span>·</span>
            <span className="text-mv-forest font-semibold">{topic.badge}</span>
          </div>
        </div>
      </nav>

      {/* Dedicated Page Hero */}
      <PageHero
        id={`topic-${topic.slug}`}
        title={topic.title}
        lede={topic.lede}
        illustrations={[topic.primaryIllustration, topic.secondaryIllustration]}
        tone={topic.tone}
        chips={chips.length > 0 ? chips : [
          { label: 'Explore Leg Health', href: '#explore-leg-health' },
          { label: 'Doppler Scan Guide', href: '#doppler' },
          { label: 'Compare Treatments', href: '#treatments' },
        ]}
        onAskMeridbot={() => onAskMeridbot?.(`Can you explain ${topic.shortTitle} in simple terms?`)}
        meridbotPose="present"
      />

      {/* Primary Educational Content Container */}
      <main className="container-page max-w-[1200px] py-10 sm:py-14">
        {children}
      </main>

      {/* Bottom Educational Navigation & Clinical Assurance */}
      <footer className="border-t border-mv-outline/70 bg-white py-12 sm:py-16">
        <div className="container-page max-w-[1200px]">
          
          {/* Previous / Next Topic Navigator */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 pb-10 border-b border-mv-outline/60">
            {prevTopic ? (
              <a
                href={hrefForLearnTopic(prevTopic.slug)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTopic(prevTopic.slug);
                }}
                className="group flex flex-col items-start p-4 rounded-2xl bg-mv-ivory/60 hover:bg-mv-ivory border border-mv-outline/60 hover:border-mv-forest/30 transition-all flex-1 min-h-[44px]"
              >
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-mv-ink-muted flex items-center gap-1.5 mb-1">
                  <ArrowLeft className="w-3.5 h-3.5 text-mv-terracotta group-hover:-translate-x-1 transition-transform" />
                  Previous Topic
                </span>
                <span className="font-serif text-[17px] font-semibold text-mv-forest group-hover:text-mv-terracotta transition-colors">
                  {prevTopic.shortTitle}
                </span>
              </a>
            ) : (
              <div className="flex-1 hidden sm:block" />
            )}

            <a
              href="#explore-leg-health"
              onClick={(e) => {
                e.preventDefault();
                onNavigateView('home');
                setTimeout(() => {
                  const el = document.getElementById('explore-leg-health');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-mv-forest text-white text-[13.5px] font-semibold hover:bg-mv-forest/90 transition-colors shadow-xs min-h-[44px] shrink-0"
            >
              <Compass className="w-4 h-4 text-mv-terracotta" />
              <span>Explore All 9 Topics</span>
            </a>

            {nextTopic ? (
              <a
                href={hrefForLearnTopic(nextTopic.slug)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTopic(nextTopic.slug);
                }}
                className="group flex flex-col items-end text-right p-4 rounded-2xl bg-mv-ivory/60 hover:bg-mv-ivory border border-mv-outline/60 hover:border-mv-forest/30 transition-all flex-1 min-h-[44px]"
              >
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-mv-ink-muted flex items-center gap-1.5 mb-1">
                  Next Topic
                  <ArrowRight className="w-3.5 h-3.5 text-mv-terracotta group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="font-serif text-[17px] font-semibold text-mv-forest group-hover:text-mv-terracotta transition-colors">
                  {nextTopic.shortTitle}
                </span>
              </a>
            ) : (
              <div className="flex-1 hidden sm:block" />
            )}
          </div>

          {/* Clinical Disclaimer & SVS/AVF Trust Banner */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[13px] text-mv-ink-muted leading-relaxed">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-mv-forest shrink-0" />
              <p>
                <strong>Educational standard:</strong> Content is grounded in clinical guidelines from the American Venous Forum (AVF) and Society for Vascular Surgery (SVS). It is independent health education and not a personal medical diagnosis.
              </p>
            </div>

            <div className="flex items-center gap-4 text-mv-forest font-semibold">
              <a
                href="#doppler"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateView('doppler');
                }}
                className="underline underline-offset-4 hover:text-mv-terracotta min-h-[44px] inline-flex items-center"
              >
                Decode Doppler Report →
              </a>
              <a
                href="#assessment"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateView('assessment');
                }}
                className="underline underline-offset-4 hover:text-mv-terracotta min-h-[44px] inline-flex items-center"
              >
                Check Symptoms →
              </a>
            </div>
          </div>

        </div>
      </footer>
    </article>
  );
};
