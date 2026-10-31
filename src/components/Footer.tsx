import React from 'react';
import { AppView } from '../types';
import { GUIDE_LABELS } from '../content/guideLabels';
import { hrefForView } from '../content/siteNav';

interface FooterProps {
  onNavigateView: (view: AppView) => void;
  onOpenAssistant: () => void;
  onOpenBooking: () => void;
}

type FooterLink = { label: string; href?: string; view?: AppView; onClick?: () => void };

const linkClass =
  'inline-flex min-h-[44px] items-center text-left text-[15px] text-mv-ivory underline-offset-4 hover:underline cursor-pointer';

export const Footer: React.FC<FooterProps> = ({ onNavigateView, onOpenAssistant, onOpenBooking }) => {
  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Leg Health Guides',
      links: [
        { label: 'How leg circulation works', view: 'learn' },
        { label: 'Why varicose veins develop', view: 'learn' },
        { label: 'Symptoms & warning signs', view: 'learn' },
        { label: 'Blood clot (DVT) red flags', view: 'learn' },
        { label: 'CEAP clinical stages', view: 'learn' },
        { label: 'Everyday circulation habits', view: 'learn' },
      ],
    },
    {
      title: 'Clinical Services',
      links: [
        { label: 'Symptoms & severity assessment', view: 'assessment' },
        { label: 'Modern treatments (EVLA, Glue)', view: 'treatments' },
        { label: 'Upload reports for expert review', view: 'expert-review' },
        { label: 'Patient portal & records', view: 'dashboard' },
        { label: 'Clinical care pathway', view: 'journey' },
      ],
    },
    {
      title: 'Consultation & Help',
      links: [
        { label: 'Frequently asked questions', href: '#faq' },
        { label: 'Ask Meridbot guide', onClick: onOpenAssistant },
        { label: 'Book a consultation', onClick: onOpenBooking },
      ],
    },
  ];

  const renderLink = (link: FooterLink) => {
    if (link.onClick) {
      return (
        <button type="button" onClick={link.onClick} className={linkClass}>
          {link.label}
        </button>
      );
    }
    if (link.view) {
      const view = link.view;
      return (
        <a
          href={hrefForView(view)}
          onClick={(e) => {
            e.preventDefault();
            onNavigateView(view);
          }}
          className={linkClass}
        >
          {link.label}
        </a>
      );
    }
    return (
      <a href={link.href} className={linkClass}>
        {link.label}
      </a>
    );
  };

  return (
    <footer id="book" className="mv-on-dark bg-mv-forest text-mv-ivory">
      <div className="container-page max-w-[1200px] py-16 lg:py-20">
        <div className="grid gap-10 border-b border-mv-sage/30 pb-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mv-ivory" aria-hidden="true">
                <svg viewBox="0 0 26 26" fill="none" className="h-5 w-5">
                  <path d="M6 4C6 4 8 10 13 13C18 16 20 22 20 22" stroke="#0B4036" strokeWidth="2.2" strokeLinecap="round" />
                  <circle cx="6" cy="4" r="2" fill="#CE5B40" />
                  <circle cx="20" cy="22" r="2" fill="#CE5B40" />
                </svg>
              </span>
              <span className="font-serif text-[20px] font-semibold text-white">Meridian Vascular</span>
            </div>
            <p className="mt-3 font-serif text-[17px] italic text-mv-pale">Better clarity. Better-informed care.</p>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-mv-sage">
              An educational demo about leg veins, Doppler ultrasound and treatment options, built for patients in Bengaluru. It is not a clinic and does not provide medical care.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={`Footer: ${col.title}`} className="lg:col-span-3">
              <h2 className="font-serif text-[18px] font-semibold text-white">{col.title}</h2>
              <ul className="mt-2">
                {col.links.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
            </nav>
          ))}
        </div>


        {/* Medical disclaimer and governance */}
        <div className="mt-8 max-w-[68ch] space-y-3 text-[14px] leading-relaxed text-mv-sage">
          <p>
            <strong className="font-semibold text-mv-ivory">Sources &amp; review status:</strong> Educational content refers to clinical practice guidelines published by the Society for Vascular Surgery (SVS), the American Venous Forum (AVF), and the European Society for Vascular Surgery (ESVS 2022), such as the 500 ms reflux threshold. It has not yet been reviewed by a clinician.
          </p>
          <p>
            <strong className="font-semibold text-mv-ivory">Medical Disclaimer:</strong> The educational content, clinical descriptions, duplex ultrasound simulations, and symptom screener on this website are provided exclusively for informational and educational orientation by Meridian Vascular. They do not constitute the practice of medicine, nursing, or other professional health care services, and are not a substitute for formal clinical diagnosis, standing ultrasound evaluation, or treatment by a board-certified vascular surgeon or phlebologist. Always seek the advice of your physician regarding any medical condition.
          </p>
          <p>
            <strong className="font-semibold text-mv-ivory">Provider Disclosure:</strong> Specialist directory listings are fictional demo profiles, and the appointment request is a demo that is not sent to any clinic. They do not represent real doctors, real clinic scheduling or endorsement.
          </p>
        </div>
        <p className="mt-8 border-t border-mv-sage/30 pt-6 text-[14px] text-mv-sage">
          &copy; {new Date().getFullYear()} Meridian Vascular. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
