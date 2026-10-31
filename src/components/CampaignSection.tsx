import React from 'react';
import { HeartHandshake, Footprints, ArrowUpFromLine, Ruler } from 'lucide-react';

// Educational self-care habits only. There are no live events, screenings or sign-ups behind this section.
const HABITS = [
  {
    icon: Footprints,
    label: 'Habit 01',
    title: 'Keep the calf muscle pump moving',
    body: 'Every 60 minutes of sitting or standing still, do about 20 ankle pumps or calf raises, or take a short walk. Aim for around 30 minutes of walking on most days if your doctor says it is safe for you.',
  },
  {
    icon: ArrowUpFromLine,
    label: 'Habit 02',
    title: 'Elevate your legs in the evening',
    body: 'Resting with your legs raised above heart level for about 15 minutes can ease end-of-day heaviness and ankle swelling.',
  },
  {
    icon: Ruler,
    label: 'Habit 03',
    title: 'Get compression stockings properly fitted',
    body: 'Badly fitting stockings can dig in and make swelling worse. Ask your clinician whether compression is safe for you (it may not be if you have arterial disease), which strength to use, and have your ankle and calf measured by a trained fitter.',
  },
];

export const CampaignSection: React.FC = () => (
  <section id="campaign" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-mv-outline/50">
    <div className="container-page max-w-[1200px]">

      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 text-mv-ink-muted text-[11px] font-bold tracking-[0.16em] uppercase font-mono mb-2">
          <HeartHandshake className="w-3.5 h-3.5 text-mv-forest" />
          <span>EVERYDAY VEIN HEALTH · CONSERVATIVE CARE</span>
        </div>
        <h2 className="font-serif text-[28px] sm:text-[34px] lg:text-[40px] font-semibold text-mv-forest leading-tight">
          Simple Habits for Healthier Circulation
        </h2>
        <p className="mt-3 text-[16px] sm:text-[17px] text-mv-ink-muted leading-relaxed">
          Many people assume heavy, aching legs and swollen ankles are an unavoidable part of ageing. These everyday habits can ease symptoms for many people. They do not replace assessment by a clinician, especially if symptoms are new, one-sided or getting worse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {HABITS.map(({ icon: Icon, label, title, body }) => (
          <div key={title} className="pt-6 border-t border-mv-outline/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-mv-ink-muted uppercase tracking-wider">{label}</span>
                <div className="w-8 h-8 rounded-lg bg-mv-ivory border border-mv-outline/60 flex items-center justify-center text-mv-forest">
                  <Icon className="w-4 h-4 text-mv-forest" aria-hidden="true" />
                </div>
              </div>
              <h3 className="font-serif text-[19px] sm:text-[20px] font-semibold text-mv-forest mb-2 leading-snug">{title}</h3>
              <p className="text-[14px] text-mv-ink-muted leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  </section>
);
