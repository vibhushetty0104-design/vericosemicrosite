import React, { useState } from 'react';
import { FAQS } from '../data/clinicalContent';
import {
  ChevronDown,
  Search,
  HelpCircle,
  } from 'lucide-react';
import { HemoCharacter } from './VascularCharacters';
import { GuideIcon, askGuideAbout } from '../content/guideLabels';

interface FaqSectionProps {
  onOpenAiWithPrompt?: (prompt: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenAiWithPrompt,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaqs = FAQS.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#0A3B32]/10 relative overflow-hidden">
      <div className="container-page max-w-3xl">
        
        {/* Section Header with Refined Spacing & Typography */}
        <div className="relative text-center max-w-2xl mx-auto mb-10 sm:mb-12">

          {/* Subtle floating companion in safe header corner (desktop only, non-overlapping) */}
          <div className="hidden lg:block absolute -top-4 -right-16 pointer-events-none">
            <HemoCharacter size="sm" showBadge={false} />
          </div>

          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-[#E5EDE8] text-[#0A3B32] text-[12px] font-bold tracking-[0.14em] uppercase font-mono mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#0A3B32]" />
            <span>CLINICAL EVIDENCE &amp; PATIENT QUERIES</span>
          </div>

          <h2 className="heading-serif-section text-[#0A3B32]">
            Frequently Asked Vascular Questions
          </h2>

          <p className="mt-3 mx-auto max-w-[36rem] text-[15.5px] sm:text-[16.5px] text-[#4A5563] leading-[1.65]">
            Essential facts on Indian health insurance cashless approval, anatomical blood rerouting, pain management, and long-term vein closure.
          </p>

          {/* Search bar */}
          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-[#0A3B32]/45 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. insurance, ultrasound, pain)..."
              className="w-full bg-white border border-[#0A3B32]/15 rounded-full py-2.5 pl-10 pr-4 text-[14.5px] text-[#1A2421] placeholder:text-[#1A2421]/45 focus:outline-none focus:border-[#0A3B32] shadow-xs"
            />
          </div>
        </div>

        {/* FAQ Accordion List with Disciplined Sizing, 44px Chevrons & Clean Open Typography */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#0A3B32]/10 rounded-2xl shadow-[0_1px_3px_rgba(10,59,50,0.04)] overflow-hidden transition-all duration-200 hover:border-[#0A3B32]/22"
                >
                  <button
                    id={`faq-btn-${idx}`}
                    aria-controls={`faq-panel-${idx}`}
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(idx)}
                    className="tap-tactile focus-cp w-full text-left py-3.5 sm:py-4 px-4.5 sm:px-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2]/60 transition-colors min-h-[52px]"
                  >
                    {/* Editorial Serif Question Text: Generous, legible Source Serif 4 glyphs */}
                    <span className="font-serif text-[16px] sm:text-[17.5px] font-semibold text-[#0A3B32] leading-snug tracking-normal pr-1">
                      {faq.question}
                    </span>

                    {/* Touch-Friendly $\ge 44px$ Precision Chevron Control */}
                    <span
                      aria-hidden="true"
                      className="tap-tactile shrink-0 w-11 h-11 rounded-full bg-[#E5EDE8] text-[#0A3B32] flex items-center justify-center transition-colors duration-200 hover:bg-[#D7E4DC]"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#C85A3F]' : 'text-[#0A3B32]'
                        }`}
                      />
                    </span>
                  </button>

                  {/* Expanded Answer Panel: Generous reading line-height and contrast */}
                  {isOpen && (
                    <div
                      id={`faq-panel-${idx}`}
                      role="region"
                      aria-labelledby={`faq-btn-${idx}`}
                      className="px-4.5 sm:px-6 pb-5 pt-1 text-[15.5px] sm:text-[16.5px] text-[#2D3A35] leading-[1.68] border-t border-[#0A3B32]/8 bg-white"
                    >
                      <p className="mt-2 max-w-[38rem] text-[#3D4A45]">{faq.answer}</p>
                      {onOpenAiWithPrompt && (
                        <div className="mt-4 pt-3 border-t border-[#0A3B32]/8 flex justify-end">
                          <button
                            onClick={() => onOpenAiWithPrompt(`Can you explain more about: "${faq.question}"?`)}
                            className="tap-tactile inline-flex min-h-[44px] items-center gap-1.5 text-[14px] font-semibold text-[#0A3B32] hover:text-[#C85A3F] transition-colors cursor-pointer px-3 rounded-lg hover:bg-[#FAF7F2]"
                          >
                            <GuideIcon className="w-3.5 h-3.5 text-[#C85A3F]" aria-hidden="true" />
                            <span>{askGuideAbout('this question')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-[14.5px] text-[#1A2421]/65 bg-white rounded-2xl border border-[#0A3B32]/10">
              No matching questions found for &ldquo;{searchQuery}&rdquo;. Try another search term or ask the educational guide.
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
