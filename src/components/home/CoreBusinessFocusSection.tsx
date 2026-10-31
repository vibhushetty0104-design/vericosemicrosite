import React from 'react';
import { ArrowUpRight, ShieldCheck, Stethoscope } from 'lucide-react';
import { AppView } from '../../types';

interface CoreBusinessFocusSectionProps {
  className?: string;
  onNavigateView?: (view: AppView) => void;
}

interface ServiceArea {
  id: string;
  number: string;
  title: string;
  description: string;
  iconWebp: string;
  iconPng: string;
  tag: string;
}

const SERVICE_AREAS: ServiceArea[] = [
  {
    id: 'consultation-coordination',
    number: '01',
    title: 'Surgical Consultation & Coordination',
    description:
      'Helping patients arrange consultations with appropriate specialists and understand the steps involved in seeking a surgical opinion.',
    iconWebp: '/assets/icons2/mv-icon-consultation.webp',
    iconPng: '/assets/icons2/mv-icon-consultation.png',
    tag: 'Specialist Access',
  },
  {
    id: 'hospital-coordination',
    number: '02',
    title: 'Hospital Identification & Coordination',
    description:
      'Assisting patients in identifying suitable healthcare facilities based on their medical requirements, location, preferences, and available options.',
    iconWebp: '/assets/icons2/mv-icon-appointment.webp',
    iconPng: '/assets/icons2/mv-icon-appointment.png',
    tag: 'Facility Choice',
  },
  {
    id: 'treatment-planning',
    number: '03',
    title: 'Treatment Planning Support',
    description:
      'Helping patients coordinate consultations, investigations, documentation, hospital admission, and other practical requirements as advised by their treating medical team.',
    iconWebp: '/assets/icons2/mv-icon-treatment-options.webp',
    iconPng: '/assets/icons2/mv-icon-treatment-options.png',
    tag: 'Clinical Roadmap',
  },
  {
    id: 'financial-coordination',
    number: '04',
    title: 'Cost & Financial Coordination',
    description:
      'Facilitating access to available treatment estimates and helping patients understand the administrative aspects of insurance, cashless facilities, and payment procedures, subject to the policies of the respective hospitals and insurers.',
    iconWebp: '/assets/icons2/mv-icon-health-insurance.webp',
    iconPng: '/assets/icons2/mv-icon-health-insurance.png',
    tag: 'Transparent Estimates',
  },
  {
    id: 'pre-op-assistance',
    number: '05',
    title: 'Pre-operative Assistance',
    description:
      'Supporting patients with appointment schedules, documentation, investigations prescribed by their doctors, and hospital admission formalities.',
    iconWebp: '/assets/icons2/mv-icon-medical-reports.webp',
    iconPng: '/assets/icons2/mv-icon-medical-reports.png',
    tag: 'Admission Logistics',
  },
  {
    id: 'post-op-coordination',
    number: '06',
    title: 'Post-operative Coordination',
    description:
      'Helping patients arrange follow-up appointments, obtain discharge instructions from their treating team, and coordinate recommended rehabilitation or home-care services where available.',
    iconWebp: '/assets/icons2/mv-icon-patient-journey.webp',
    iconPng: '/assets/icons2/mv-icon-patient-journey.png',
    tag: 'Discharge & Recovery',
  },
];

export const CoreBusinessFocusSection: React.FC<CoreBusinessFocusSectionProps> = ({
  className = '',
}) => {
  return (
    <section
      id="core-business"
      aria-labelledby="core-business-title"
      className={`bg-[#EDF3EE] border-b border-mv-outline/50 py-20 sm:py-24 lg:py-32 relative overflow-hidden ${className}`}
    >
      {/* Decorative subtle vascular circulation background motif */}
      <div className="absolute inset-0 pointer-events-none opacity-25" aria-hidden="true">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <path
            d="M0,450 C320,380 480,520 720,440 C960,360 1120,490 1440,420"
            fill="none"
            stroke="#0B4036"
            strokeWidth="1.5"
            strokeDasharray="6 10"
          />
          <path
            d="M0,520 C360,460 520,600 760,510 C1000,420 1200,560 1440,490"
            fill="none"
            stroke="#CE5B40"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.35"
          />
          <circle cx="720" cy="440" r="4" fill="#CE5B40" opacity="0.6" />
          <circle cx="1120" cy="490" r="3" fill="#0B4036" opacity="0.5" />
        </svg>
      </div>

      <div className="container-page max-w-[1240px] relative z-10">
        
        {/* Section Header */}
        <div className="max-w-[54rem] mx-auto text-center mb-16 sm:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-mv-outline/60 text-mv-forest mb-5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-mv-terracotta" aria-hidden="true" />
            <p className="font-mono text-[11.5px] sm:text-[12.5px] font-bold tracking-[0.14em] uppercase text-mv-forest">
              WHAT WE DO
            </p>
          </div>

          <h2
            id="core-business-title"
            className="font-serif text-[36px] sm:text-[44px] lg:text-[50px] font-semibold leading-[1.12] text-mv-forest tracking-[-0.02em]"
          >
            Supporting Every Step of the Surgical Journey
          </h2>

          <div className="mt-4 flex items-center justify-center gap-2.5">
            <span className="h-[1.5px] w-10 bg-mv-terracotta/70" aria-hidden="true" />
            <p className="font-mono text-[12.5px] sm:text-[13.5px] font-semibold tracking-[0.12em] uppercase text-mv-terracotta">
              Our Core Business Focus
            </p>
            <span className="h-[1.5px] w-10 bg-mv-terracotta/70" aria-hidden="true" />
          </div>

          <p className="mt-5 text-[18px] sm:text-[20px] leading-relaxed text-mv-ink font-serif font-medium max-w-[46rem] mx-auto">
            “Our principal focus is surgical healthcare and the services surrounding it.”
          </p>

          <p className="mt-3 text-[16px] sm:text-[17px] leading-relaxed text-mv-ink-muted max-w-[44rem] mx-auto">
            Our specific activities and coordination workflows depend on the operational frameworks and clinical standards of our accredited hospital and medical specialist partners across India.
          </p>
        </div>

        {/* 6 Core Service Areas in a Spacious 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {SERVICE_AREAS.map((service, idx) => (
            <article
              key={service.id}
              className={`group bg-white rounded-2xl p-7 sm:p-8 lg:p-9 border border-mv-outline/70 shadow-xs hover:shadow-card hover:border-mv-sage/80 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                idx === 0 || idx === 3 ? 'lg:border-l-4 lg:border-l-mv-terracotta' : ''
              }`}
            >
              {/* Card top accent line on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-mv-forest/40 via-mv-terracotta to-mv-forest/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />

              <div>
                {/* Header: Service Number, Badge and 2.5D Illustration Icon */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#F4F8F5] border border-mv-outline/60 p-2.5 flex items-center justify-center shrink-0 group-hover:bg-[#EAF3EC] group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <picture>
                      <source srcSet={service.iconWebp} type="image/webp" />
                      <img
                        src={service.iconPng}
                        alt=""
                        width={56}
                        height={56}
                        loading="lazy"
                        className="w-14 h-14 sm:w-15 sm:h-15 object-contain"
                      />
                    </picture>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[15px] sm:text-[16px] font-bold text-mv-terracotta tracking-wider">
                      {service.number}
                    </span>
                    <span className="mt-1 px-3 py-0.5 rounded-full bg-mv-pale text-mv-forest font-mono text-[11px] font-semibold tracking-wide">
                      {service.tag}
                    </span>
                  </div>
                </div>

                {/* Service Title */}
                <h3 className="font-serif text-[21px] sm:text-[23px] font-semibold text-mv-forest group-hover:text-mv-terracotta transition-colors duration-200 leading-[1.25]">
                  {service.title}
                </h3>

                {/* Service Description (Readable ~16px, line-height 1.7) */}
                <p className="mt-3.5 text-[15.5px] sm:text-[16.5px] leading-[1.7] text-mv-ink-muted">
                  {service.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-7 pt-4 border-t border-mv-outline/50 flex items-center justify-between text-mv-ink-muted group-hover:text-mv-forest transition-colors duration-200">
                <span className="text-[12.5px] font-mono uppercase tracking-wider text-mv-ink-muted/80">
                  Coordination scope
                </span>
                <span className="w-7 h-7 rounded-full bg-mv-pale group-hover:bg-mv-forest group-hover:text-mv-ivory text-mv-forest flex items-center justify-center transition-colors duration-300">
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Distinctive Full-Width Forest-Green Responsibility Statement Panel */}
        <div className="mt-14 sm:mt-18 lg:mt-22 rounded-3xl bg-mv-forest text-mv-ivory p-8 sm:p-10 lg:p-12 border border-mv-forest-press shadow-card relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div
            className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-mv-sage/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex items-start gap-5 sm:gap-6 max-w-[50rem]">
              <div className="w-14 h-14 rounded-2xl bg-mv-terracotta/20 border border-mv-terracotta/40 text-mv-terracotta flex items-center justify-center shrink-0 mt-1">
                <Stethoscope className="w-7 h-7 text-mv-terracotta" aria-hidden="true" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-mv-sage font-mono text-[11.5px] font-semibold tracking-[0.14em] uppercase mb-3">
                  <ShieldCheck className="w-4 h-4 text-mv-terracotta" aria-hidden="true" />
                  <span>Clinical Responsibility & Boundary</span>
                </div>
                <blockquote className="font-serif text-[20px] sm:text-[23px] lg:text-[26px] font-medium leading-[1.3] text-mv-ivory">
                  “Our role is to support the process and improve coordination. Medical decisions, surgical
                  recommendations, and clinical treatment remain the responsibility of qualified healthcare
                  professionals.”
                </blockquote>
                <p className="mt-3 text-[15px] sm:text-[16px] leading-relaxed text-mv-pale/90">
                  Meridian Vascular provides educational guidance and logistical coordination. We do not practice medicine, prescribe treatment, or alter hospital clinical decisions.
                </p>
              </div>
            </div>

            <div className="shrink-0 self-stretch lg:self-center border-t lg:border-t-0 lg:border-l border-white/15 pt-5 lg:pt-0 lg:pl-10 flex flex-col justify-center">
              <span className="font-mono text-[11.5px] uppercase tracking-wider text-mv-sage block">
                Clinical Standard
              </span>
              <span className="font-serif text-[18px] sm:text-[20px] font-semibold text-mv-ivory mt-1 block">
                Independent Medical Authority
              </span>
              <span className="font-mono text-[12px] text-mv-pale/70 mt-1 block">
                Partner Hospital Governed
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
