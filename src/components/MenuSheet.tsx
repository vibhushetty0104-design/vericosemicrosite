import React, { useRef } from 'react';
import { Calendar, ChevronRight, X, User, Stethoscope } from 'lucide-react';
import { AppView, PatientUser } from '../types';
import { NAV_ITEMS, hrefForView } from '../content/siteNav';
import { GUIDE_LABELS, GuideIcon } from '../content/guideLabels';
import { useAccessibleDialog } from '../utils/useAccessibleDialog';
import { UrgentHelp } from './UrgentHelp';

interface MenuSheetProps {
  isOpen: boolean;
  currentView: AppView;
  onClose: () => void;
  onNavigateView: (view: AppView) => void;
  onOpenAssistant: () => void;
  onOpenBooking: () => void;
  user?: PatientUser | null;
  onOpenAuth?: () => void;
}

/**
 * Site menu below 1280px: a modal sheet (full screen on phones, a 420px side panel from 640px).
 * Focus moves to the Close button on open, Tab stays inside, Escape closes, and focus returns to
 * the Menu button (useAccessibleDialog). The urgent notice is always first.
 */
export const MenuSheet: React.FC<MenuSheetProps> = ({
  isOpen,
  currentView,
  onClose,
  onNavigateView,
  onOpenAssistant,
  onOpenBooking,
  user,
  onOpenAuth,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useAccessibleDialog(isOpen, onClose, dialogRef);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] xl:hidden">
      <div className="absolute inset-0 bg-mv-ink/40" onClick={onClose} aria-hidden="true" />
      <div
        id="site-menu"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-menu-title"
        className="mv-sheet-enter absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-mv-ivory shadow-[0_24px_48px_rgba(11,64,54,0.16)] sm:max-w-[420px]"
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-mv-outline px-4 md:h-16 md:px-6">
          <h2 id="site-menu-title" className="font-serif text-[20px] font-semibold text-mv-forest">
            Menu
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full px-3 text-[15px] font-semibold text-mv-forest hover:bg-mv-pale"
          >
            <X className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            <span>Close</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 px-4 py-5 md:px-6">
          <UrgentHelp variant="compact" onNavigate={onClose} />

          {/* User Sign In / Profile Quick Bar */}
          <div className="p-3 bg-white border border-[#8DAA9D]/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0B4036]/10 text-[#0B4036] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="text-xs">
                {user ? (
                  <>
                    <p className="font-semibold text-[#0B4036]">{user.name || user.fullName}</p>
                    <p className="text-[11px] text-gray-500">Patient Records Linked</p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-[#0B4036]">Patient Portal</p>
                    <p className="text-[11px] text-gray-500">Track reviews & consultations</p>
                  </>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (user) {
                  onNavigateView('dashboard');
                } else if (onOpenAuth) {
                  onOpenAuth();
                } else {
                  onNavigateView('dashboard');
                }
              }}
              className="px-3 py-1.5 bg-[#0B4036] text-white text-xs font-semibold rounded-lg hover:bg-[#072B24]"
            >
              {user ? 'My Records' : 'Sign In'}
            </button>
          </div>

          {/* Doctor Portal Quick Access */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateView('doctor-portal');
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#8DAA9D]/30 text-xs font-semibold text-[#0B4036] hover:bg-[#E4ECE6] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#0B4036]" />
              <span>Doctor Portal & Clinical Workstation</span>
            </span>
            <span className="text-[11px] font-bold text-[#CE5B40]">Access →</span>
          </button>

          <nav aria-label="Main">
            <ul className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isCurrent = currentView === item.view;
                return (
                  <li key={item.view}>
                    <a
                      href={hrefForView(item.view)}
                      aria-current={isCurrent ? 'page' : undefined}
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        onNavigateView(item.view);
                      }}
                      className={`flex min-h-[88px] flex-col items-start justify-between gap-2 rounded-xl border p-3 text-[15px] font-semibold leading-snug transition-colors ${
                        isCurrent
                          ? 'border-mv-forest bg-mv-forest text-white'
                          : 'border-transparent bg-mv-pale text-mv-forest hover:border-mv-outline-strong'
                      }`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="mv-btn bg-[#A9472F] text-white hover:bg-[#8F3B26] w-full py-3 rounded-lg font-semibold text-sm shadow-sm"
            >
              <Calendar className="h-4.5 w-4.5" strokeWidth={1.75} aria-hidden="true" />
              <span>Book Consultation</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAssistant();
              }}
              className="mv-btn mv-btn-quiet w-full border border-mv-outline"
            >
              <GuideIcon className="h-5 w-5 text-mv-terracotta" strokeWidth={1.5} aria-hidden="true" />
              <span>{GUIDE_LABELS.ask}</span>
            </button>
          </div>

          <a
            href="#faq"
            onClick={onClose}
            className="mt-auto inline-flex min-h-[44px] items-center gap-1 self-start text-[15px] font-semibold text-mv-forest underline underline-offset-4"
          >
            <span>Questions people ask</span>
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
};
