import React from 'react';
import { Volume2, Heart, Github, Shield, Wifi } from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations.ts';

interface FooterProps {
  currentLang: SupportedLanguage;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white py-12 transition-colors dark:border-indigo-950 dark:bg-[#08051A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand lockup */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1F06AC] text-[#E3EF4F] dark:bg-[#0F42C0]">
              <Volume2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Free-MP3</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Privacy badge and offline notice */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-[#0F42C0] dark:text-[#5882E8]" aria-hidden="true" />
              <span>100% Client-Side Private</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="h-4 w-4 text-emerald-600 dark:text-[#E3EF4F]" aria-hidden="true" />
              <span>{t.offlineReady}</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href="https://github.com/free-mp3/free-mp3.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-[#1F06AC] dark:text-slate-300 dark:hover:text-[#E3EF4F] transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              <span>GitHub</span>
            </a>

            <a
              href="https://ko-fi.com/kishara"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#1F06AC] hover:text-[#0F42C0] dark:text-[#E3EF4F] transition-colors"
              aria-label="Support on Ko-fi"
            >
              <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
              <span>Support Developer</span>
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-indigo-950/60 pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>{t.footerRights}</p>
          <p className="mt-1">{t.footerPrivacy}</p>
        </div>
      </div>
    </footer>
  );
};
