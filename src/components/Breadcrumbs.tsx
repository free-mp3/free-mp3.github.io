import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations.ts';

interface BreadcrumbsProps {
  currentLang: SupportedLanguage;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 text-xs text-slate-500 dark:text-slate-400"
    >
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li className="flex items-center gap-1">
          <a
            href="/"
            className="flex items-center gap-1 hover:text-[#1F06AC] dark:hover:text-[#E3EF4F] transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <span>{t.breadcrumbHome}</span>
          </a>
        </li>
        <li className="flex items-center" aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </li>
        <li className="flex items-center gap-1">
          <a
            href="#tools"
            className="hover:text-[#1F06AC] dark:hover:text-[#E3EF4F] transition-colors"
          >
            {t.breadcrumbTools}
          </a>
        </li>
        <li className="flex items-center" aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </li>
        <li aria-current="page" className="font-semibold text-[#1F06AC] dark:text-[#E3EF4F]">
          {t.breadcrumbCurrent}
        </li>
      </ol>
    </nav>
  );
};
