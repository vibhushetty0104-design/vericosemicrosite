import React, { useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { CLINICAL_REVIEW_STATUS, SOURCES, STATUS_LABELS } from '../../content/research/sources';
import { useAccessibleDialog } from '../../utils/useAccessibleDialog';

interface SourceDrawerProps {
  sourceId: string | null;
  number?: number;
  citedIn?: string[];
  onClose: () => void;
}

/** Source details for an inline citation: a side panel from 768px, a bottom sheet on phones. */
export const SourceDrawer: React.FC<SourceDrawerProps> = ({ sourceId, number, citedIn = [], onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = !!sourceId;
  useAccessibleDialog(isOpen, onClose, ref);
  if (!sourceId) return null;
  const s = SOURCES[sourceId];
  if (!s) return null;
  const placeholder = s.status === 'demo-placeholder';

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-end bg-mv-ink/40 md:items-stretch"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-drawer-title"
        className="mv-sheet-enter max-h-[85vh] w-full overflow-y-auto rounded-t-[20px] bg-mv-ivory p-5 shadow-[0_24px_48px_rgba(11,64,54,0.16)] md:max-h-none md:max-w-[440px] md:rounded-none md:p-7"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-[14px] font-semibold text-mv-ink-muted">{number ? `Source ${number}` : 'Source'} · {s.kind}</p>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-mv-ink-muted hover:bg-mv-pale hover:text-mv-forest"
            aria-label="Close source details"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
        <h2 id="source-drawer-title" className="mt-1 font-serif text-[22px] font-semibold leading-snug text-mv-forest">
          {s.title}
        </h2>
        <p className="mt-2 text-[16px] text-mv-ink">{s.publisher}</p>
        {s.citation && <p className="text-[15px] text-mv-ink-muted">{s.citation}</p>}

        <dl className="mt-5 space-y-3 text-[15px]">
          <div>
            <dt className="font-semibold text-mv-ink">Status</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[13px] font-semibold ${
                  placeholder ? 'bg-mv-warning-surface text-mv-warning' : 'bg-mv-pale text-mv-forest'
                }`}
              >
                {STATUS_LABELS[s.status]}
              </span>
              <span className="rounded-full bg-mv-surface px-2.5 py-1 text-[13px] font-semibold text-mv-ink-muted ring-1 ring-mv-outline">
                {CLINICAL_REVIEW_STATUS}
              </span>
            </dd>
          </div>
          {s.checked && (
            <div>
              <dt className="font-semibold text-mv-ink">How it was checked</dt>
              <dd className="text-mv-ink-muted">{s.checked}. This confirms the source exists; it doesn’t confirm every sentence that cites it.</dd>
            </div>
          )}
          {s.datesOnSource && (
            <div>
              <dt className="font-semibold text-mv-ink">Dates shown on the source</dt>
              <dd className="text-mv-ink-muted">{s.datesOnSource}</dd>
            </div>
          )}
          {s.note && (
            <div>
              <dt className="font-semibold text-mv-ink">Keep in mind</dt>
              <dd className="text-mv-ink-muted">{s.note}</dd>
            </div>
          )}
          {citedIn.length > 0 && (
            <div>
              <dt className="font-semibold text-mv-ink">Cited in</dt>
              <dd className="text-mv-ink-muted">{citedIn.join(' · ')}</dd>
            </div>
          )}
        </dl>

        {s.url ? (
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="mv-btn mv-btn-secondary mt-6 w-full sm:w-auto">
            Open the source
            <ExternalLink className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <p className="mt-6 rounded-xl bg-mv-warning-surface p-3 text-[14px] text-mv-warning">
            No real source is attached yet. The statement that cites it should be read as unverified.
          </p>
        )}
      </div>
    </div>
  );
};
