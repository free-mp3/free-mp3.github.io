/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Breadcrumbs } from './components/Breadcrumbs.tsx';
import { AudioDropzone } from './components/AudioDropzone.tsx';
import { ConversionQueue, QueueItem } from './components/ConversionQueue.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { FeaturesGrid } from './components/FeaturesGrid.tsx';
import { FaqSection } from './components/FaqSection.tsx';
import { Footer } from './components/Footer.tsx';
import { PwaInstallModal } from './components/PwaInstallModal.tsx';
import { SupportedLanguage, translations } from './i18n/translations.ts';
import { usePWAInstall } from './hooks/usePWAInstall.ts';
import { generateMp3Filename } from './utils/audioMath.ts';
import { ShieldCheck, Sparkles, Download, Volume2 } from 'lucide-react';

export default function App() {
  // Internationalization state
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('freemp3_lang');
    if (saved && ['en', 'es', 'pt', 'de', 'fr', 'ja', 'zh', 'ru'].includes(saved)) {
      return saved as SupportedLanguage;
    }
    return 'en';
  });

  const handleSelectLang = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
    localStorage.setItem('freemp3_lang', lang);
  };

  const t = translations[currentLang];

  // Theme state (default Light theme with Dark Mode option, honoring saved preference or system)
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('freemp3_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('freemp3_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('freemp3_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // PWA Install state
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else if (isInstallable) {
      await install();
    } else {
      setShowIOSModal(true);
    }
  };

  // Queue state
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const handleFilesSelected = (files: File[]) => {
    const newItems: QueueItem[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      status: 'ready',
      progress: 0,
      convertedName: generateMp3Filename(file.name),
    }));

    setQueue((prev) => [...prev, ...newItems]);

    // Scroll smoothly to converter queue
    setTimeout(() => {
      document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleRemoveItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearQueue = () => {
    setQueue([]);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors selection:bg-[#E3EF4F] selection:text-[#1F06AC] ${isDark ? 'dark bg-[#08051A] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onInstallClick={handleInstallClick}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
      />

      {/* Semantic Breadcrumbs */}
      <Breadcrumbs currentLang={currentLang} />

      {/* Main Content Area */}
      <main id="converter" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {/* Hero Section */}
        <div className="text-center pt-4 pb-8 sm:pb-12">
          {/* Quiet unboxed privacy metadata kicker */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#0F42C0] dark:text-[#5882E8] mb-4">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>{t.privacyBadge}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
            {t.heroHeadline}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed" style={{ textWrap: 'balance' }}>
            {t.heroSubheadline}
          </p>

          {/* Feature Highlights Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F06AC] dark:bg-[#E3EF4F]" />
              Zero Server Uploads
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F42C0] dark:bg-[#5882E8]" />
              320 kbps Studio Quality
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
              100% Offline Compatible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-300" />
              Batch ZIP Export
            </span>
          </div>
        </div>

        {/* Step 1: Dropzone */}
        <AudioDropzone currentLang={currentLang} onFilesSelected={handleFilesSelected} />

        {/* Step 2 & 3: Conversion Queue and Settings */}
        <ConversionQueue
          currentLang={currentLang}
          queue={queue}
          onUpdateQueue={setQueue}
          onClearQueue={handleClearQueue}
          onRemoveItem={handleRemoveItem}
        />

        {/* How It Works Section */}
        <HowItWorks currentLang={currentLang} />

        {/* Features Grid */}
        <FeaturesGrid currentLang={currentLang} />

        {/* FAQ Section */}
        <FaqSection currentLang={currentLang} />
      </main>

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* iOS Safari Install Guide Modal */}
      <PwaInstallModal
        currentLang={currentLang}
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </div>
  );
}
