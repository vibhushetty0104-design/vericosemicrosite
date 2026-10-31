import React, { useState, useEffect, useRef } from 'react';
import { HeartHandshake } from 'lucide-react';

interface PatientFirstSectionProps {
  className?: string;
}

interface PrincipleItem {
  id: string;
  num: string;
  title: string;
  description: string;
  iconWebp: string;
  iconPng: string;
  badge: string;
}

const PATIENT_PRINCIPLES: PrincipleItem[] = [
  {
    id: 'listen',
    num: '01',
    title: "Listen carefully to the patient's requirements.",
    description:
      "Every patient's clinical situation, daily routine, and personal priorities are unique. We take the time to listen and understand your specific circumstances before suggesting any diagnostic or clinical step.",
    iconWebp: '/assets/icons2/mv-icon-consultation.webp',
    iconPng: '/assets/icons2/mv-icon-consultation.png',
    badge: 'Active Listening',
  },
  {
    id: 'clear-info',
    num: '02',
    title: 'Provide clear information about available services.',
    description:
      'We explain vascular care pathways, duplex ultrasound scans, and evidence-based clinical options in plain, patient-friendly language without intimidating technical jargon.',
    iconWebp: '/assets/icons2/mv-icon-educational-guide.webp',
    iconPng: '/assets/icons2/mv-icon-educational-guide.png',
    badge: 'Educational Clarity',
  },
  {
    id: 'respect-choice',
    num: '03',
    title: "Respect the patient's choice of doctor and hospital.",
    description:
      'Your autonomy is absolute. We coordinate with the accredited vascular specialist, interventional radiologist, or hospital facility you prefer, with zero commercial steering.',
    iconWebp: '/assets/icons2/mv-icon-appointment.webp',
    iconPng: '/assets/icons2/mv-icon-appointment.png',
    badge: 'Patient Autonomy',
  },
  {
    id: 'transparent-costs',
    num: '04',
    title: 'Communicate costs and administrative requirements as transparently as possible.',
    description:
      'We facilitate clear upfront access to hospital billing estimates, cashless insurance documentation, and administrative steps before any procedure takes place.',
    iconWebp: '/assets/icons2/mv-icon-health-insurance.webp',
    iconPng: '/assets/icons2/mv-icon-health-insurance.png',
    badge: 'Financial Transparency',
  },
  {
    id: 'protect-data',
    num: '05',
    title: 'Protect personal and medical information.',
    description:
      'Your ultrasound images, Doppler reports, and health history are guarded with strict patient privacy protocols and secure, private data handling.',
    iconWebp: '/assets/icons2/mv-icon-medical-reports.webp',
    iconPng: '/assets/icons2/mv-icon-medical-reports.png',
    badge: 'Privacy & Security',
  },
  {
    id: 'avoid-promises',
    num: '06',
    title: 'Avoid making promises about surgical outcomes.',
    description:
      'Every patient’s vascular anatomy, vein elasticity, and recovery trajectory are unique. We maintain ethical clinical communication and never make speculative promises about results.',
    iconWebp: '/assets/icons2/mv-icon-treatment-options.webp',
    iconPng: '/assets/icons2/mv-icon-treatment-options.png',
    badge: 'Ethical Standards',
  },
  {
    id: 'encourage-opinions',
    num: '07',
    title: 'Encourage patients to seek appropriate medical opinions before making important treatment decisions.',
    description:
      'We actively encourage thorough consultations, complete duplex Doppler examinations, and independent second opinions with qualified vascular surgeons prior to invasive care.',
    iconWebp: '/assets/icons2/mv-icon-doppler-report.webp',
    iconPng: '/assets/icons2/mv-icon-doppler-report.png',
    badge: 'Informed Decisions',
  },
  {
    id: 'maintain-communication',
    num: '08',
    title: 'Maintain communication throughout the coordination process.',
    description:
      'From your first questions about leg symptoms to post-procedure follow-ups, our dedicated care coordination team provides prompt, reliable support at every step.',
    iconWebp: '/assets/icons2/mv-icon-patient-journey.webp',
    iconPng: '/assets/icons2/mv-icon-patient-journey.png',
    badge: 'Continuous Guidance',
  },
];

const FULL_HEADING = 'ABOUT US';
const CHAR_SPEED_MS = 90; // Natural, polished typing speed (75-110ms range)

export const PatientFirstSection: React.FC<PatientFirstSectionProps> = ({ className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [isCursorBlinking, setIsCursorBlinking] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const hasAnimatedRef = useRef(false);
  const startTimerRef = useRef<number | null>(null);
  const typeTimerRef = useRef<number | null>(null);
  const cursorStopTimerRef = useRef<number | null>(null);
  const cursorHideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setCharIndex(FULL_HEADING.length);
      setIsTyping(false);
      setShowCursor(false);
      setIsCursorBlinking(false);
      setIsRevealed(true);
      hasAnimatedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          // Controlled pause before typing begins (120ms)
          startTimerRef.current = window.setTimeout(() => {
            setIsTyping(true);
            setShowCursor(true);
            setIsCursorBlinking(true);

            let current = 0;
            const typeNext = () => {
              current += 1;
              setCharIndex(current);

              // Reveal accompanying editorial content halfway through typing for seamless pacing
              if (current >= 4) {
                setIsRevealed(true);
              }

              if (current < FULL_HEADING.length) {
                typeTimerRef.current = window.setTimeout(typeNext, CHAR_SPEED_MS);
              } else {
                // Completed typing
                setIsTyping(false);
                setIsRevealed(true);

                // Allow cursor to blink for 450ms after the final letter, then fade out
                cursorStopTimerRef.current = window.setTimeout(() => {
                  setIsCursorBlinking(false);
                  cursorHideTimerRef.current = window.setTimeout(() => {
                    setShowCursor(false);
                  }, 350);
                }, 450);
              }
            };

            typeTimerRef.current = window.setTimeout(typeNext, CHAR_SPEED_MS);
          }, 120);
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentTarget = sectionRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      observer.disconnect();
      if (startTimerRef.current) window.clearTimeout(startTimerRef.current);
      if (typeTimerRef.current) window.clearTimeout(typeTimerRef.current);
      if (cursorStopTimerRef.current) window.clearTimeout(cursorStopTimerRef.current);
      if (cursorHideTimerRef.current) window.clearTimeout(cursorHideTimerRef.current);
    };
  }, []);

  const displayedText = FULL_HEADING.slice(0, charIndex);

  return (
    <section
      ref={sectionRef}
      id="patient-first"
      aria-labelledby="patient-first-title"
      className={`bg-mv-ivory border-b border-mv-outline/50 py-20 sm:py-24 lg:py-32 relative overflow-hidden ${className}`}
    >
      {/* Subtle organic circulation-inspired vector background motif */}
      <div className="absolute inset-0 pointer-events-none opacity-35" aria-hidden="true">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <path
            d="M-40,240 C340,160 520,480 880,320 C1160,200 1280,440 1480,380"
            fill="none"
            stroke="#8DAA9D"
            strokeWidth="1.25"
            strokeDasharray="6 10"
          />
          <path
            d="M-40,680 C300,600 580,820 1000,640 C1220,540 1320,720 1480,660"
            fill="none"
            stroke="#CE5B40"
            strokeWidth="1"
            strokeDasharray="5 12"
            opacity="0.45"
          />
        </svg>
      </div>

      <div className="container-page max-w-[1240px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Prominent About Us & Editorial Philosophy */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            
            {/* Prominent Editorial "ABOUT US" Heading with Viewport-Triggered Typing Animation */}
            <div className="mb-3 sm:mb-4">
              <h2
                id="patient-first-title"
                className="font-serif text-[42px] sm:text-[56px] md:text-[68px] lg:text-[76px] xl:text-[84px] font-bold text-mv-forest tracking-[-0.03em] leading-[0.98] select-none"
              >
                {/* Accessible screen reader announcement: reads complete heading normally */}
                <span className="sr-only">About Us</span>

                {/* Visual layout reservation: prevents any layout shift (CLS = 0) */}
                <span className="relative inline-block" aria-hidden="true">
                  <span className="invisible select-none opacity-0 block">
                    {FULL_HEADING}
                    <span className="inline-block w-[3px] sm:w-[4px] lg:w-[5px] ml-1.5 sm:ml-2">&nbsp;</span>
                  </span>

                  {/* Live typed text with subtle blinking terracotta cursor */}
                  <span className="absolute inset-0 flex items-baseline whitespace-nowrap">
                    <span>{displayedText}</span>
                    {showCursor && (
                      <span
                        className={`inline-block w-[3px] sm:w-[4px] lg:w-[5px] h-[0.76em] bg-mv-terracotta ml-1.5 sm:ml-2 rounded-[1px] align-baseline transition-opacity duration-300 ${
                          isCursorBlinking ? 'animate-cursor-blink' : 'opacity-0'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </span>
              </h2>

              {/* Subheading: The Patient Comes First */}
              <h3 className="font-serif text-[24px] sm:text-[30px] lg:text-[34px] font-semibold leading-[1.2] text-mv-forest/90 tracking-[-0.015em] mt-3 sm:mt-4">
                The Patient Comes First
              </h3>
            </div>

            {/* Signature terracotta architectural rule */}
            <div className="w-20 h-[3px] bg-mv-terracotta rounded-full my-5 sm:my-6" aria-hidden="true" />

            {/* Intro Copy with restrained coordinated fade-in */}
            <div
              className={`space-y-4 text-mv-ink text-[17px] sm:text-[18px] leading-[1.7] transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
                isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <p>
                Every patient has a different requirement. Some patients know exactly which specialist they
                want to consult, while others are unsure about where to begin.
              </p>
              <p className="text-mv-ink-muted">
                We want to make it easier for patients to understand their available options without creating
                unnecessary pressure or confusion.
              </p>
              <p className="font-medium text-mv-forest pt-2">
                Our approach is guided by a few practical principles:
              </p>
            </div>

            {/* Patient-Led Coordination Callout Plaque */}
            <div
              className={`mt-10 p-6 sm:p-7 rounded-2xl bg-white/90 border border-mv-outline/70 shadow-xs backdrop-blur-xs transition-all duration-700 delay-100 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
                isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-mv-pale text-mv-forest flex items-center justify-center shrink-0 border border-mv-outline/50 shadow-2xs">
                  <HeartHandshake className="w-6 h-6 text-mv-terracotta" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-serif text-[18px] sm:text-[19px] font-semibold text-mv-forest">
                    Patient-Led Coordination
                  </h4>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-mv-ink-muted">
                    No forced referral loops, no hidden commission ties, and no promotional pressure. Your clinical care pathway is decided entirely by you and your treating doctor.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: All 8 Principles with coordinated staggered reveal */}
          <div className="lg:col-span-7 pt-1 sm:pt-2">
            <div className="space-y-4">
              {PATIENT_PRINCIPLES.map((principle, index) => (
                <article
                  key={principle.id}
                  style={{
                    transitionDelay: isRevealed ? `${index * 60}ms` : '0ms',
                  }}
                  className={`group p-6 sm:p-7 rounded-2xl bg-white/90 border border-mv-outline/70 shadow-2xs hover:shadow-card hover:border-mv-sage/90 hover:bg-white transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
                    isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {/* Approved 2.5D Medical Illustration Icon */}
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-mv-pale/70 border border-mv-outline/60 p-2.5 flex items-center justify-center shrink-0 group-hover:bg-mv-pale group-hover:scale-105 transition-all duration-300 shadow-2xs">
                      <picture>
                        <source srcSet={principle.iconWebp} type="image/webp" />
                        <img
                          src={principle.iconPng}
                          alt=""
                          width={52}
                          height={52}
                          loading="lazy"
                          className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                        />
                      </picture>
                    </div>

                    {/* Content Area */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className="font-mono text-[13px] font-bold text-mv-terracotta tracking-wider">
                          Principle {principle.num}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-mv-pale text-mv-forest font-mono text-[11px] font-semibold tracking-wide">
                          {principle.badge}
                        </span>
                      </div>

                      <h4 className="font-serif text-[19px] sm:text-[21px] font-semibold text-mv-forest group-hover:text-mv-terracotta transition-colors duration-200 leading-snug">
                        {principle.title}
                      </h4>

                      <p className="mt-2 text-[15px] sm:text-[16px] leading-[1.65] text-mv-ink-muted">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
