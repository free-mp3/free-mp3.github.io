import React from 'react';
import { Share, PlusSquare, X } from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations.ts';

interface PwaInstallModalProps {
  currentLang: SupportedLanguage;
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  currentLang,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-indigo-900 dark:bg-[#100B2E]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          aria-label={t.close}
        >
          <X className="h-5 w-5" />
        </button>

        <h3
          id="pwa-install-title"
          className="text-base font-bold text-slate-900 dark:text-white pr-6"
        >
          {t.installIosTitle}
        </h3>

        <div className="mt-4 flex flex-col gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-indigo-950 dark:bg-[#08051A]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-[#1F06AC] dark:bg-indigo-950 dark:text-[#E3EF4F]">
              <Share className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Step 1</p>
              <p className="mt-0.5">{t.installIosStep1}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-indigo-950 dark:bg-[#08051A]">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-[#1F06AC] dark:bg-indigo-950 dark:text-[#E3EF4F]">
              <PlusSquare className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Step 2</p>
              <p className="mt-0.5">{t.installIosStep2}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[#1F06AC] py-2.5 text-xs font-semibold text-white hover:bg-[#0F42C0] transition-colors dark:bg-[#5882E8] dark:text-[#08051A]"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};
