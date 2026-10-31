import React from 'react';
import { Network, Cpu, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

interface SustainableBusinessSectionProps {
  className?: string;
}

interface StrategicPriority {
  id: string;
  number: string;
  title: string;
  summary: string;
  fullNarrative: string;
  icon: React.ComponentType<{ className?: string }>;
  metricLabel: string;
}

const STRATEGIC_PRIORITIES: StrategicPriority[] = [
  {
    id: 'partnerships',
    number: '01',
    title: 'Dependable Partnerships',
    summary: 'Building the right hospital relationships and strengthening our specialist network.',
    fullNarrative:
      'We intend to focus on building the right partnerships with accredited surgical hospitals and qualified vascular surgeons, ensuring aligned clinical ethics and coordinated patient pathways.',
    icon: Network,
    metricLabel: 'Hospital Network',
  },
  {
    id: 'operational-excellence',
    number: '02',
    title: 'Operational Excellence',
    summary:
      'Establishing standard operating procedures, efficient coordination, professional service standards, and a reliable service team.',
    fullNarrative:
      'Our approach is to develop a business model that can grow through dependable hospital relationships, efficient coordination, professional service standards, and a clear understanding of patient requirements.',
    icon: CheckCircle2,
    metricLabel: 'Standard Operating Procedures',
  },
  {
    id: 'patient-support',
    number: '03',
    title: 'Connected Patient Support',
    summary: 'Using appropriate technology to manage enquiries, appointments, documentation, and follow-ups.',
    fullNarrative:
      'We intend to focus on developing a reliable service team and using appropriate technology to manage enquiries, appointments, documentation, and follow-ups without replacing human empathy.',
    icon: Cpu,
    metricLabel: 'Care Technology',
  },
  {
    id: 'responsible-expansion',
    number: '04',
    title: 'Responsible Expansion',
    summary:
      'Evaluating opportunities to expand geographical presence and introduce additional services based on demonstrated demand.',
    fullNarrative:
      'As the business develops, we will evaluate opportunities to expand our geographical presence, strengthen our specialist network, and introduce additional services based on demonstrated demand.',
    icon: TrendingUp,
    metricLabel: 'Phased Growth',
  },
];

export const SustainableBusinessSection: React.FC<SustainableBusinessSectionProps> = ({
  className = '',
}) => {
  return (
    <section
      id="sustainable-business"
      aria-labelledby="sustainable-business-title"
      className={`bg-mv-forest text-mv-ivory border-b border-mv-forest-press py-20 sm:py-24 lg:py-32 relative overflow-hidden ${className}`}
    >
      {/* Background radial glow for atmospheric depth */}
      <div
        className="absolute top-0 right-1/4 w-[550px] h-[550px] rounded-full bg-mv-sage/10 blur-[130px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 w-[450px] h-[450px] rounded-full bg-mv-terracotta/10 blur-[110px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-page max-w-[1240px] relative z-10">
        
        {/* Spacious 2-Column Editorial Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-14 xl:gap-18 items-start">
          
          {/* Left Column: Our Approach & Full Philosophical Narrative (5 cols) */}
          <div className="lg:col-span-5 mb-14 lg:mb-0">
            <div className="lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-mv-sage mb-5 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-mv-terracotta" aria-hidden="true" />
                <p className="font-mono text-[11.5px] sm:text-[12.5px] font-bold tracking-[0.14em] uppercase text-mv-sage">
                  OUR APPROACH
                </p>
              </div>

              <h2
                id="sustainable-business-title"
                className="font-serif text-[36px] sm:text-[44px] lg:text-[48px] font-semibold leading-[1.12] text-mv-ivory tracking-[-0.02em]"
              >
                Building a Sustainable Healthcare Business
              </h2>

              <div className="w-20 h-[3px] bg-mv-terracotta rounded-full my-6" aria-hidden="true" />

              {/* Complete Narrative Text at Generous Size */}
              <div className="space-y-4 text-mv-ivory/90">
                <p className="font-serif text-[19px] sm:text-[21px] leading-snug text-mv-ivory font-medium">
                  “A healthcare company must balance patient service with operational discipline and financial sustainability.”
                </p>

                <p className="text-[16px] sm:text-[17px] leading-[1.7] text-mv-pale/85">
                  Our approach is to develop a business model that can grow through dependable hospital relationships, efficient coordination, professional service standards, and a clear understanding of patient requirements.
                </p>

                <p className="text-[16px] sm:text-[17px] leading-[1.7] text-mv-pale/85">
                  We believe that sustainable growth in healthcare comes from delivering value consistently and building credibility over time.
                </p>
              </div>

              {/* Highlight callout pill */}
              <div className="mt-8 p-4 rounded-xl bg-white/[0.06] border border-white/15 flex items-center gap-3.5">
                <div className="w-2.5 h-2.5 rounded-full bg-mv-terracotta shrink-0" aria-hidden="true" />
                <p className="text-[13.5px] font-mono text-mv-pale uppercase tracking-wider">
                  Ethical Governance &bull; Quality-First Scalability
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Strategic Priorities in a 2x2 Grid (7 cols) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {STRATEGIC_PRIORITIES.map((priority) => {
                const Icon = priority.icon;
                return (
                  <article
                    key={priority.id}
                    className="group rounded-2xl p-7 sm:p-8 bg-white/[0.05] hover:bg-white/[0.09] border border-white/12 hover:border-mv-sage/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Accent line on hover */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-mv-terracotta to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-hidden="true"
                    />

                    <div>
                      {/* Top Bar: Icon, Metric Label and Number */}
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <div className="w-13 h-13 rounded-xl bg-white/10 group-hover:bg-mv-terracotta/25 group-hover:text-mv-terracotta text-mv-sage flex items-center justify-center border border-white/15 transition-all duration-300">
                          <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-mv-sage/80">
                            {priority.metricLabel}
                          </span>
                          <span className="font-mono text-[15px] font-bold text-mv-terracotta">
                            {priority.number}
                          </span>
                        </div>
                      </div>

                      {/* Priority Title */}
                      <h3 className="font-serif text-[22px] sm:text-[23px] font-semibold text-mv-ivory group-hover:text-mv-terracotta transition-colors duration-200 leading-[1.25]">
                        {priority.title}
                      </h3>

                      {/* Summary */}
                      <p className="mt-2.5 text-[15.5px] font-medium text-mv-pale leading-snug">
                        {priority.summary}
                      </p>

                      {/* Full Original Narrative */}
                      <p className="mt-3.5 text-[14.5px] leading-[1.65] text-mv-pale/75 pt-3.5 border-t border-white/10">
                        {priority.fullNarrative}
                      </p>
                    </div>

                    {/* Card Footer Tag */}
                    <div className="mt-6 pt-3.5 border-t border-white/10 flex items-center justify-between text-mv-sage text-[12.5px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-mv-sage/60" aria-hidden="true" />
                        <span>Strategic Foundation</span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" aria-hidden="true" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

        </div>

        {/* Concluding Statement in Large Source Serif 4 Typography */}
        <div className="mt-16 sm:mt-20 lg:mt-26 pt-12 sm:pt-16 border-t border-white/15">
          <div className="max-w-[54rem] mx-auto text-center">
            <span className="font-mono text-[11.5px] font-bold tracking-[0.16em] uppercase text-mv-terracotta block mb-4">
              Long-Term Perspective
            </span>
            <blockquote className="font-serif text-[24px] sm:text-[32px] lg:text-[38px] font-medium leading-[1.25] text-mv-ivory tracking-[-0.015em]">
              “We believe that sustainable growth in healthcare comes from delivering value consistently and building credibility over time.”
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="w-10 h-[2px] bg-mv-terracotta rounded-full" aria-hidden="true" />
              <span className="font-mono text-[12.5px] tracking-wider text-mv-sage uppercase">
                Meridian Vascular Founding Charter
              </span>
              <span className="w-10 h-[2px] bg-mv-terracotta rounded-full" aria-hidden="true" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
