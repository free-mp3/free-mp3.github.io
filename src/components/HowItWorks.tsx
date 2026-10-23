import React from 'react';
import { UploadCloud, Sliders, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations.ts';

interface HowItWorksProps {
  currentLang: SupportedLanguage;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const steps = [
    {
      num: '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: UploadCloud,
    },
    {
      num: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Sliders,
    },
    {
      num: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="mt-20 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          3-Step Client-Side Audio Conversion
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Everything happens securely inside your browser using the HTML5 Web Audio API. No waiting for server queues.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="relative flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-indigo-950 dark:bg-[#100B2E]"
            >
              <div className="flex w-full items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#1F06AC] dark:bg-indigo-950 dark:text-[#E3EF4F]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="text-2xl font-black font-mono tracking-tight text-slate-300 dark:text-indigo-900">
                  {s.num}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
