import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations.ts';

interface FaqSectionProps {
  currentLang: SupportedLanguage;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 },
    { q: t.q5, a: t.a5 },
    { q: t.q6, a: t.a6 },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="mt-24 mb-16 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F42C0] dark:text-[#5882E8] mb-2">
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          <span>FAQ</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.faqTitle}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {t.faqSubtitle}
        </p>
      </div>

      <div className="mt-10 max-w-3xl mx-auto flex flex-col gap-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all overflow-hidden dark:border-indigo-950 dark:bg-[#100B2E]"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50 dark:hover:bg-indigo-950/40"
              >
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white pr-4">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#1F06AC] dark:text-[#E3EF4F]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-indigo-950/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
