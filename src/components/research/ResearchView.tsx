import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, MessageCircleQuestion, X } from 'lucide-react';
import { ARTICLES, Article, citationOrder, getArticle, parseParagraph } from '../../content/research/articles';
import { CLINICAL_REVIEW_STATUS, SOURCES, STATUS_LABELS } from '../../content/research/sources';
import { ILLUSTRATIONS } from '../../content/illustrations';
import { MERIDBOT_LABELS } from '../../content/meridbot';
import { Meridbot } from '../meridbot/Meridbot';
import { PageHero } from '../scene/PageHero';
import { UrgentHelp } from '../UrgentHelp';
import { SourceDrawer } from './SourceDrawer';

interface ResearchViewProps {
  articleSlug: string | null;
  onOpenArticle: (slug: string | null) => void;
  onAskMeridbot: (prompt?: string) => void;
}

const LEGEND: { label: string; tone: 'pale' | 'warn' | 'outline'; text: string }[] = [
  { label: 'Link checked', tone: 'pale', text: 'We opened the source on the date shown. It exists and says what its title says.' },
  { label: 'Demo placeholder', tone: 'warn', text: 'Stands in for a source still to be found. The statement it supports is unverified.' },
  { label: 'Illustrative', tone: 'warn', text: 'An example made for this demo, not a research result.' },
  { label: 'Not yet checked against full text', tone: 'warn', text: 'A real source, but we have not yet confirmed it says exactly this.' },
  { label: CLINICAL_REVIEW_STATUS, tone: 'outline', text: 'No clinician has reviewed these articles yet.' },
];

const pill = (tone: 'pale' | 'warn' | 'outline') =>
  tone === 'pale'
    ? 'bg-mv-pale text-mv-forest'
    : tone === 'warn'
      ? 'bg-mv-warning-surface text-mv-warning'
      : 'bg-mv-surface text-mv-ink-muted ring-1 ring-mv-outline';

export const ResearchView: React.FC<ResearchViewProps> = ({ articleSlug, onOpenArticle, onAskMeridbot }) => {
  const article = articleSlug ? getArticle(articleSlug) : undefined;
  if (article) return <ResearchArticle article={article} onOpenArticle={onOpenArticle} onAskMeridbot={onAskMeridbot} />;
  return <ResearchLibrary onOpenArticle={onOpenArticle} onAskMeridbot={onAskMeridbot} />;
};

const ResearchLibrary: React.FC<Omit<ResearchViewProps, 'articleSlug'>> = ({ onOpenArticle, onAskMeridbot }) => {
  const [featured, ...rest] = ARTICLES;
  const openLink = (slug: string) => ({
    href: `#research/${slug}`,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      onOpenArticle(slug);
    },
  });
  return (
    <>
      <PageHero
        id="research"
        title="Research library"
        lede="Plain-language articles that show where each statement comes from. Every citation opens the source, with how and when we checked it."
        illustrations={['research-library', 'educational-guide', 'medical-reports']}
        meridbotPose="present"
        chips={[
          { label: 'Articles', href: '#research-articles' },
          { label: 'How to read the labels', href: '#research-labels' },
          { label: 'Source register', href: '#research-sources' },
        ]}
        onAskMeridbot={() => onAskMeridbot()}
      />

      <section id="research-articles" aria-labelledby="research-articles-title" className="bg-mv-ivory py-12 lg:py-16">
        <div className="container-page max-w-[1200px]">
          <h2 id="research-articles-title" className="font-serif text-[26px] font-semibold text-mv-forest sm:text-[32px]">
            Articles
          </h2>
          <a
            {...openLink(featured.slug)}
            className="group mt-6 grid gap-6 rounded-[20px] border border-mv-outline bg-mv-surface p-5 transition-colors hover:border-mv-outline-strong sm:p-7 md:grid-cols-[minmax(0,1fr)_220px] md:items-center"
          >
            <div>
              <p className="text-[14px] font-semibold text-mv-cta">Featured · {featured.readMinutes} min read</p>
              <h3 className="mt-1 font-serif text-[24px] font-semibold leading-snug text-mv-forest sm:text-[28px]">{featured.title}</h3>
              <p className="mt-2 max-w-[36rem] text-[16px] leading-relaxed text-mv-ink-muted">{featured.summary}</p>
              <p className="mt-3 text-[14px] text-mv-ink-muted">Demo article · {CLINICAL_REVIEW_STATUS} · Last edited {featured.lastEdited}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[16px] font-semibold text-mv-forest underline underline-offset-4">
                Read the article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
              </span>
            </div>
            <img src={ILLUSTRATIONS[featured.icon]} alt="" className="mx-auto w-40 drop-shadow-[0_12px_14px_rgba(11,64,54,0.16)] md:w-full" loading="lazy" />
          </a>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {rest.map((a) => (
              <li key={a.slug}>
                <a
                  {...openLink(a.slug)}
                  className="group flex h-full items-start gap-4 rounded-[20px] border border-mv-outline bg-mv-surface p-5 transition-colors hover:border-mv-outline-strong"
                >
                  <img src={ILLUSTRATIONS[a.icon]} alt="" className="h-20 w-20 shrink-0 drop-shadow-[0_8px_10px_rgba(11,64,54,0.14)]" loading="lazy" />
                  <span className="min-w-0">
                    <span className="block font-serif text-[20px] font-semibold leading-snug text-mv-forest">{a.title}</span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-mv-ink-muted">{a.summary}</span>
                    <span className="mt-2 block text-[14px] text-mv-ink-muted">{a.readMinutes} min read · Demo article</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="research-labels" aria-labelledby="research-labels-title" className="border-y border-mv-outline bg-mv-surface py-12">
        <div className="container-page max-w-[1200px]">
          <h2 id="research-labels-title" className="font-serif text-[26px] font-semibold text-mv-forest">
            How to read the labels
          </h2>
          <p className="mt-2 max-w-[38rem] text-[16px] leading-relaxed text-mv-ink-muted">
            This is a demonstration. Some content is real and checked, some is illustrative, and none of it has been clinically reviewed yet. The labels say which is which.
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEGEND.map((l) => (
              <div key={l.label}>
                <dt>
                  <span className={`inline-block rounded-full px-2.5 py-1 text-[13px] font-semibold ${pill(l.tone)}`}>{l.label}</span>
                </dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-mv-ink-muted">{l.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="research-sources" aria-labelledby="research-sources-title" className="bg-mv-ivory py-12 lg:py-16">
        <div className="container-page max-w-[1200px]">
          <h2 id="research-sources-title" className="font-serif text-[26px] font-semibold text-mv-forest">
            Source register
          </h2>
          <p className="mt-2 max-w-[38rem] text-[16px] leading-relaxed text-mv-ink-muted">Every source the demo uses, with its status.</p>
          <ul className="mt-6 divide-y divide-mv-outline rounded-[20px] border border-mv-outline bg-mv-surface">
            {Object.values(SOURCES).map((s) => (
              <li key={s.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold leading-snug text-mv-ink">{s.title}</p>
                  <p className="text-[14px] text-mv-ink-muted">
                    {s.publisher}
                    {s.citation ? ` · ${s.citation}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[13px] font-semibold ${pill(s.status === 'demo-placeholder' ? 'warn' : 'pale')}`}>
                    {STATUS_LABELS[s.status]}
                  </span>
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1 text-[14px] font-semibold text-mv-forest underline underline-offset-2"
                    >
                      Open <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                      <span className="sr-only">{s.title} (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

const ResearchArticle: React.FC<{ article: Article } & Omit<ResearchViewProps, 'articleSlug'>> = ({ article, onOpenArticle, onAskMeridbot }) => {
  const order = useMemo(() => citationOrder(article), [article]);
  const [drawer, setDrawer] = useState<string | null>(null);
  const [simple, setSimple] = useState<Record<string, boolean>>({});
  const index = ARTICLES.findIndex((a) => a.slug === article.slug);
  const next = ARTICLES[(index + 1) % ARTICLES.length];

  const citedIn = (id: string) =>
    article.sections.filter((s) => s.paragraphs.some((p) => p.includes(`[[${id}]]`))).map((s) => s.heading);

  const renderParagraph = (text: string, key: string) => (
    <p key={key} className="mt-4 text-[17px] leading-[1.75] text-mv-ink">
      {parseParagraph(text).map((part, i) => {
        if (part.kind === 'text') return <Fragment key={i}>{part.value}</Fragment>;
        if (part.kind === 'illustrative')
          return (
            <span key={i} className="mx-1 inline-block rounded-full bg-mv-warning-surface px-2 py-0.5 align-[2px] text-[12px] font-semibold text-mv-warning">
              Illustrative
            </span>
          );
        if (part.kind === 'unverified')
          return (
            <span key={i} className="mx-1 inline-block rounded-full bg-mv-warning-surface px-2 py-0.5 align-[2px] text-[12px] font-semibold text-mv-warning">
              Not yet checked against full text
            </span>
          );
        const n = order.indexOf(part.id) + 1;
        const s = SOURCES[part.id];
        return (
          <button
            key={i}
            type="button"
            onClick={() => setDrawer(part.id)}
            aria-haspopup="dialog"
            aria-label={`Source ${n}: ${s.short}, ${s.title}`}
            className={`mv-cite ${s.status === 'demo-placeholder' ? 'is-placeholder' : ''}`}
          >
            {n}
          </button>
        );
      })}
    </p>
  );

  return (
    <article aria-labelledby="article-title" className="bg-mv-ivory">
      <header className="border-b border-mv-outline">
        <div className="container-page grid max-w-[1200px] gap-6 py-8 md:grid-cols-[minmax(0,1fr)_200px] md:items-center lg:py-12">
          <div>
            <a
              href="#research"
              onClick={(e) => {
                e.preventDefault();
                onOpenArticle(null);
              }}
              className="-ml-1 inline-flex min-h-[44px] items-center gap-1.5 px-1 text-[15px] font-semibold text-mv-forest underline-offset-4 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /> Research library
            </a>
            <h1 id="article-title" className="mt-2 font-serif text-[32px] font-semibold leading-[1.12] tracking-[-0.015em] text-mv-forest text-balance sm:text-[42px]">
              {article.title}
            </h1>
            <p className="mt-3 max-w-[38rem] text-[18px] leading-relaxed text-mv-ink-muted">{article.summary}</p>
            <ul className="mt-4 flex flex-wrap gap-2 text-[13px] font-semibold">
              <li className={`rounded-full px-2.5 py-1 ${pill('warn')}`}>Demo article</li>
              <li className={`rounded-full px-2.5 py-1 ${pill('outline')}`}>{CLINICAL_REVIEW_STATUS}</li>
              <li className={`rounded-full px-2.5 py-1 ${pill('outline')}`}>Last edited {article.lastEdited}</li>
              <li className={`rounded-full px-2.5 py-1 ${pill('outline')}`}>{article.readMinutes} min read</li>
            </ul>
            <p className="mt-3 max-w-[38rem] text-[15px] leading-relaxed text-mv-ink-muted">
              <strong className="font-semibold text-mv-ink">Evidence used:</strong> {article.evidenceNote}
            </p>
          </div>
          <img src={ILLUSTRATIONS[article.icon]} alt="" className="mx-auto hidden w-48 drop-shadow-[0_14px_16px_rgba(11,64,54,0.16)] md:block" />
        </div>
      </header>

      <div className="container-page grid max-w-[1200px] gap-10 py-10 lg:grid-cols-[220px_minmax(0,40rem)] lg:py-14">
        <nav aria-label="Article contents" className="hidden lg:block">
          <div className="sticky top-[88px]">
            <p className="text-[14px] font-semibold text-mv-ink-muted">On this page</p>
            <ul className="mt-2 space-y-1 border-l-2 border-mv-outline">
              {[...article.sections.map((s) => ({ id: s.id, label: s.heading })), { id: 'article-limits', label: 'Limitations' }, { id: 'article-refs', label: 'References' }].map(
                (l) => (
                  <li key={l.id}>
                    <a href={`#${l.id}`} className="-ml-0.5 flex min-h-[44px] items-center border-l-2 border-transparent pl-3 text-[15px] text-mv-forest hover:border-mv-terracotta">
                      {l.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </nav>

        <div className="min-w-0">
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="mb-10">
              <h2 id={`${section.id}-h`} className="font-serif text-[26px] font-semibold leading-snug text-mv-forest">
                {section.heading}
              </h2>
              {section.block === 'urgent' && (
                <div className="mt-4">
                  <UrgentHelp variant="compact" />
                </div>
              )}
              {section.paragraphs.map((p, i) => renderParagraph(p, `${section.id}-${i}`))}

              {section.block === 'valve-link' && (
                <a
                  href="#valve-simulation"
                  className="mt-5 flex items-center gap-4 rounded-[20px] border border-mv-outline bg-mv-surface p-4 transition-colors hover:border-mv-outline-strong"
                >
                  <img src={ILLUSTRATIONS['valve-function']} alt="" className="h-16 w-16 shrink-0" loading="lazy" />
                  <span>
                    <span className="block font-semibold text-mv-forest">See it move: the valve simulation</span>
                    <span className="block text-[15px] text-mv-ink-muted">An educational animation of healthy and leaky valves, in Learn.</span>
                  </span>
                  <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-mv-forest" strokeWidth={1.5} aria-hidden="true" />
                </a>
              )}

              {section.block === 'treatment-table' && article.table && (
                <div className="mt-5 overflow-x-auto rounded-[16px] border border-mv-outline bg-mv-surface">
                  <table className="w-full min-w-[560px] border-collapse text-left text-[15px]">
                    <caption className="px-4 pb-2 pt-4 text-left text-[14px] text-mv-ink-muted">
                      {article.table.caption}
                      <button
                        type="button"
                        onClick={() => setDrawer('demo-placeholder-recovery')}
                        aria-haspopup="dialog"
                        aria-label="Source for the illustrative column: demo placeholder"
                        className="mv-cite is-placeholder"
                      >
                        ?
                      </button>
                    </caption>
                    <thead>
                      <tr className="border-y border-mv-outline bg-mv-ivory text-[14px] text-mv-ink">
                        <th scope="col" className="px-4 py-2 font-semibold">Option</th>
                        <th scope="col" className="px-4 py-2 font-semibold">How it works</th>
                        <th scope="col" className="px-4 py-2 font-semibold">Typical setting</th>
                        <th scope="col" className="px-4 py-2 font-semibold">
                          Back to usual activity <span className="font-normal text-mv-warning">(illustrative)</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {article.table.rows.map((r) => (
                        <tr key={r.option} className="border-b border-mv-outline last:border-0">
                          <th scope="row" className="px-4 py-3 font-semibold text-mv-forest">{r.option}</th>
                          <td className="px-4 py-3 text-mv-ink">{r.how}</td>
                          <td className="px-4 py-3 text-mv-ink">{r.setting}</td>
                          <td className="px-4 py-3 text-mv-warning">{r.illustrativeReturn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="button"
                aria-expanded={!!simple[section.id]}
                onClick={() => setSimple((s) => ({ ...s, [section.id]: !s[section.id] }))}
                className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-mv-pale px-4 text-[15px] font-semibold text-mv-forest hover:bg-[#d7e3da]"
              >
                <BookOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                {MERIDBOT_LABELS.explainSimply}
              </button>
              {simple[section.id] && (
                <div className="mt-3 flex items-start gap-3 rounded-[16px] bg-mv-pale p-4">
                  <Meridbot pose="present" height={56} />
                  <div>
                    <p className="text-[13px] font-semibold text-mv-ink-muted">{MERIDBOT_LABELS.simpleBadge}</p>
                    <p className="mt-1 text-[16px] leading-relaxed text-mv-ink">{section.simple}</p>
                  </div>
                </div>
              )}
            </section>
          ))}

          <section id="article-limits" aria-labelledby="article-limits-h" className="rounded-[16px] border border-mv-outline bg-mv-surface p-5">
            <h2 id="article-limits-h" className="font-serif text-[22px] font-semibold text-mv-forest">
              Limitations
            </h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[16px] leading-relaxed text-mv-ink">
              {article.limitations.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <p className="mt-3 text-[14px] leading-relaxed text-mv-ink-muted">
              Educational information only, not a diagnosis or medical advice. For sudden swelling or pain in one leg, chest pain or breathlessness, call 112 or 108 in India now.
            </p>
          </section>

          <section id="article-refs" aria-labelledby="article-refs-h" className="mt-10">
            <h2 id="article-refs-h" className="font-serif text-[26px] font-semibold text-mv-forest">
              References
            </h2>
            <ol className="mt-4 space-y-4">
              {order.map((id, i) => {
                const s = SOURCES[id];
                return (
                  <li key={id} id={`ref-${id}`} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mv-pale text-[14px] font-semibold text-mv-forest" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="min-w-0 text-[15px] leading-relaxed">
                      <span className="sr-only">Reference {i + 1}: </span>
                      {s.url ? (
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-mv-forest underline underline-offset-2">
                          {s.title}
                          <ExternalLink className="ml-1 inline h-4 w-4 align-[-2px]" strokeWidth={1.75} aria-hidden="true" />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <span className="font-semibold text-mv-ink">{s.title}</span>
                      )}
                      <p className="text-mv-ink-muted">
                        {s.publisher}
                        {s.citation ? `. ${s.citation}` : ''}
                        {s.datesOnSource ? `. ${s.datesOnSource}` : ''}
                      </p>
                      <p className="mt-1 flex flex-wrap gap-2 text-[12px] font-semibold">
                        <span className={`rounded-full px-2 py-0.5 ${pill(s.status === 'demo-placeholder' ? 'warn' : 'pale')}`}>{STATUS_LABELS[s.status]}</span>
                        <span className={`rounded-full px-2 py-0.5 ${pill('outline')}`}>{s.kind}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <div className="mt-10 flex flex-col gap-4 rounded-[20px] bg-mv-pale p-5 sm:flex-row sm:items-center">
            <Meridbot pose="wave" height={80} />
            <div className="flex-1">
              <p className="font-serif text-[20px] font-semibold text-mv-forest">Questions about this article?</p>
              <p className="text-[15px] text-mv-ink-muted">Meridbot answers from pre-written guidance, not live research.</p>
            </div>
            <button type="button" onClick={() => onAskMeridbot()} className="mv-btn mv-btn-secondary">
              <MessageCircleQuestion className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" /> Ask Meridbot
            </button>
          </div>

          <a
            href={`#research/${next.slug}`}
            onClick={(e) => {
              e.preventDefault();
              onOpenArticle(next.slug);
            }}
            className="mt-6 flex min-h-[44px] items-center justify-between gap-3 rounded-[16px] border border-mv-outline bg-mv-surface p-4 font-semibold text-mv-forest hover:border-mv-outline-strong"
          >
            <span>
              <span className="block text-[13px] text-mv-ink-muted">Next article</span>
              {next.title}
            </span>
            <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>

      <FloatingMeridbot onAsk={() => onAskMeridbot()} />
      <SourceDrawer
        sourceId={drawer}
        number={drawer ? order.indexOf(drawer) + 1 || undefined : undefined}
        citedIn={drawer ? citedIn(drawer) : []}
        onClose={() => setDrawer(null)}
      />
    </article>
  );
};

const DISMISS_KEY = 'mv-demo-floating-meridbot-dismissed';

/** Desktop-only (≥1280px) minimised Meridbot; dismissible; hides while the footer is in view. */
const FloatingMeridbot: React.FC<{ onAsk: () => void }> = ({ onAsk }) => {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (dismissed || footerVisible) return null;
  return (
    <aside aria-label="Meridbot" className="fixed bottom-6 right-6 z-40 hidden items-center gap-1 rounded-full border border-mv-outline bg-mv-surface py-1 pl-1 pr-1 shadow-[0_12px_28px_rgba(11,64,54,0.14)] xl:flex">
      <span className="rounded-full bg-mv-pale">
        <Meridbot pose="idle" height={52} />
      </span>
      <button type="button" onClick={onAsk} className="inline-flex min-h-[44px] items-center rounded-full px-3 text-[15px] font-semibold text-mv-forest hover:bg-mv-pale">
        Ask Meridbot
      </button>
      <button
        type="button"
        onClick={() => {
          setDismissed(true);
          try {
            sessionStorage.setItem(DISMISS_KEY, '1');
          } catch {
            /* storage unavailable: dismissal lasts until reload */
          }
        }}
        aria-label="Hide Meridbot"
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-mv-ink-muted hover:bg-mv-pale hover:text-mv-forest"
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </aside>
  );
};
