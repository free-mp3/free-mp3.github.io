import React, { useState } from 'react';
import {
  Globe,
  Sun,
  Moon,
  Download,
  Heart,
  Volume2,
  Check,
} from 'lucide-react';
import { languages, SupportedLanguage, translations } from '../i18n/translations.ts';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onInstallClick: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  isDark,
  onToggleTheme,
  onInstallClick,
  isInstalled,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[currentLang];

  const langMenuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    if (langMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors border-slate-200/80 bg-white/90 dark:border-indigo-950/80 dark:bg-[#08051A]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2.5 text-decoration-none group"
            aria-label="Free-MP3 - Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1F06AC] via-[#0F42C0] to-[#5882E8] text-[#E3EF4F] shadow-sm transition-transform group-hover:scale-105">
              <Volume2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#1F06AC] dark:text-[#E3EF4F]">
                Free-MP3
              </span>
              <span className="hidden text-[11px] font-medium text-slate-500 sm:inline dark:text-slate-400">
                100% Client-Side
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 ml-8 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <a
              href="#converter"
              className="hover:text-[#1F06AC] dark:hover:text-[#E3EF4F] transition-colors"
            >
              Converter
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#1F06AC] dark:hover:text-[#E3EF4F] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="hover:text-[#1F06AC] dark:hover:text-[#E3EF4F] transition-colors"
            >
              Features
            </a>
            <a
              href="#faq"
              className="hover:text-[#1F06AC] dark:hover:text-[#E3EF4F] transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            {/* Desktop Language Button */}
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors dark:border-indigo-900/60 dark:text-slate-200 dark:hover:bg-[#100B2E]"
              aria-label="Select Language"
              aria-expanded={langMenuOpen}
              aria-haspopup="listbox"
            >
              <Globe className="h-4 w-4 text-[#0F42C0] dark:text-[#5882E8]" aria-hidden="true" />
              <span>{languages.find((l) => l.code === currentLang)?.name}</span>
            </button>

            {/* Mobile / Tablet Strictly Icon-Only Language Button */}
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex lg:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors dark:border-indigo-900/60 dark:text-slate-200 dark:hover:bg-[#100B2E]"
              aria-label="Select Language"
              aria-expanded={langMenuOpen}
            >
              <Globe className="h-5 w-5 text-[#0F42C0] dark:text-[#5882E8]" aria-hidden="true" />
            </button>

            {langMenuOpen && (
              <div
                role="listbox"
                className="absolute right-0 mt-2 z-50 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl dark:border-indigo-900 dark:bg-[#100B2E]"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={lang.code === currentLang}
                    onClick={() => {
                      onSelectLang(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-indigo-950/60"
                  >
                    <span>{lang.nativeName}</span>
                    {lang.code === currentLang && (
                      <Check className="h-3.5 w-3.5 text-[#1F06AC] dark:text-[#E3EF4F]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors dark:border-indigo-900/60 dark:text-slate-200 dark:hover:bg-[#100B2E]"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-[#E3EF4F]" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5 text-[#1F06AC]" aria-hidden="true" />
            )}
          </button>

          {/* Offline / Add to Home Screen Button */}
          {!isInstalled && (
            <>
              {/* Desktop version with text */}
              <button
                onClick={onInstallClick}
                className="hidden lg:flex items-center gap-1.5 rounded-lg border border-[#5882E8]/40 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-[#1F06AC] hover:bg-indigo-100 transition-colors dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-[#E3EF4F] dark:hover:bg-indigo-900/60"
                aria-label={t.installPwa}
              >
                <Download className="h-4 w-4 text-[#0F42C0] dark:text-[#E3EF4F]" aria-hidden="true" />
                <span>{t.installPwa}</span>
              </button>

              {/* Mobile / Tablet Strictly Icon-Only button */}
              <button
                onClick={onInstallClick}
                className="flex lg:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[#5882E8]/40 bg-indigo-50/50 text-[#1F06AC] hover:bg-indigo-100 transition-colors dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-[#E3EF4F]"
                aria-label={t.installPwa}
              >
                <Download className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Support Developer Button (Ko-fi link) */}
          {/* Desktop version */}
          <a
            href="https://ko-fi.com/kishara"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#1F06AC] to-[#0F42C0] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-95 transition-all dark:from-[#0F42C0] dark:to-[#1F06AC] dark:text-[#E3EF4F]"
            aria-label={t.supportDev}
          >
            <Heart className="h-3.5 w-3.5 fill-[#E3EF4F] text-[#E3EF4F]" aria-hidden="true" />
            <span>{t.supportDev}</span>
          </a>

          {/* Mobile / Tablet Strictly Icon-Only Support Developer */}
          <a
            href="https://ko-fi.com/kishara"
            target="_blank"
            rel="noopener noreferrer"
            className="flex lg:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-[#1F06AC] text-[#E3EF4F] hover:bg-[#0F42C0] transition-colors dark:bg-[#100B2E] dark:border dark:border-indigo-800"
            aria-label={t.supportDev}
          >
            <Heart className="h-5 w-5 fill-[#E3EF4F] text-[#E3EF4F]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
};
