import React, { useEffect, useState } from 'react';
import { AppView, PatientUser } from '../types';
import { Menu, User, ShieldCheck, Stethoscope } from 'lucide-react';
import { GUIDE_LABELS, GuideIcon } from '../content/guideLabels';
import { NAV_ITEMS, hrefForView } from '../content/siteNav';
import { MenuSheet } from './MenuSheet';

interface HeaderProps {
  currentView: AppView;
  onNavigateView: (view: AppView) => void;
  onOpenAssistant: () => void;
  onOpenBooking: () => void;
  hasAssessmentScore?: boolean;
  user?: PatientUser | null;
  onOpenAuth?: () => void;
}

const DESKTOP_QUERY = '(min-width: 1280px)';

/**
 * Solid site header: 56px on phones, 64px from 768px, always visible. Below 1280px it holds the
 * logo and a labelled Menu button; from 1280px it shows the five main links, the guide and the
 * secondary demo request action.
 */
export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateView,
  onOpenAssistant,
  onOpenBooking,
  user,
  onOpenAuth,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // The sheet only exists below 1280px; close it if the window grows past that while open.
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia(DESKTOP_QUERY);
    const handler = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [menuOpen]);

  const desktopItems = NAV_ITEMS.filter((item) => item.desktop);

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-mv-outline/70 bg-mv-ivory/92 backdrop-blur-md md:h-16 shadow-[0_1px_8px_rgba(11,64,54,0.03)] transition-colors">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-5 md:px-8">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigateView('home');
          }}
          className="group flex min-h-[44px] min-w-0 items-center gap-2 rounded-lg sm:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest focus-visible:ring-offset-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mv-forest transition-transform duration-200 group-hover:scale-105 shadow-2xs" aria-hidden="true">
            <svg viewBox="0 0 26 26" fill="none" className="h-5 w-5">
              <path d="M6 4C6 4 8 10 13 13C18 16 20 22 20 22" stroke="#E4ECE6" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="6" cy="4" r="2" fill="#CE5B40" />
              <circle cx="20" cy="22" r="2" fill="#CE5B40" />
            </svg>
          </span>
          <span className="font-serif text-[17px] font-semibold leading-none text-mv-forest min-[360px]:text-[18px] tracking-tight group-hover:text-mv-terracotta transition-colors">Meridian Vascular</span>
        </a>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {desktopItems.map((item) => {
              const isCurrent = currentView === item.view;
              return (
                <li key={item.view}>
                  <a
                    href={hrefForView(item.view)}
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateView(item.view);
                    }}
                    className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-3.5 text-[14.5px] font-semibold transition-all hover:bg-mv-pale/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mv-forest ${
                      isCurrent ? 'text-mv-forest bg-mv-pale/60' : 'text-mv-ink-muted hover:text-mv-forest'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isCurrent && (
                      <span className="absolute inset-x-3.5 bottom-1 h-0.5 rounded-full bg-mv-terracotta" aria-hidden="true" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Patient Portal / Records Profile Indicator */}
          {user ? (
            <button
              type="button"
              onClick={() => onNavigateView('dashboard')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              title="Open Patient Records & Review Status"
            >
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span className="max-w-[100px] truncate">{(user.name || user.fullName || 'Patient').split(' ')[0]}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => (onOpenAuth ? onOpenAuth() : onNavigateView('dashboard'))}
              className="mv-btn mv-btn-quiet hidden whitespace-nowrap xl:inline-flex min-h-[40px] px-3 text-[13.5px] text-[#0B4036] hover:bg-mv-pale/80"
            >
              <User className="h-4 w-4 text-[#0B4036]" />
              <span>Patient Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenBooking}
            className="mv-btn bg-[#A9472F] hover:bg-[#8F3B26] text-white hidden whitespace-nowrap px-4.5 py-2 rounded-lg text-xs font-semibold xl:inline-flex transition-all shadow-sm"
          >
            Book Consultation
          </button>

          <button
            type="button"
            onClick={() => onNavigateView('doctor-portal')}
            className="mv-btn mv-btn-quiet hidden whitespace-nowrap xl:inline-flex min-h-[40px] px-3 text-[13px] text-[#0B4036] hover:bg-mv-pale/80 items-center gap-1.5"
            title="Clinician Access · Doctor Portal"
          >
            <Stethoscope className="h-4 w-4 text-[#0B4036]" />
            <span>Doctor Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-mv-outline-strong px-3 text-[15px] min-[360px]:px-4 font-semibold text-mv-forest transition-colors hover:bg-mv-pale xl:hidden"
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      <MenuSheet
        isOpen={menuOpen}
        currentView={currentView}
        onClose={() => setMenuOpen(false)}
        onNavigateView={onNavigateView}
        onOpenAssistant={onOpenAssistant}
        onOpenBooking={onOpenBooking}
        user={user}
        onOpenAuth={onOpenAuth}
      />
    </header>
  );
};
