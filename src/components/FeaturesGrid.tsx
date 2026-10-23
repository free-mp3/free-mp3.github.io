import React from 'react';
import { ShieldCheck, Cpu, WifiOff, Music, Layers, Sparkles } from 'lucide-react';
import { SupportedLanguage } from '../i18n/translations.ts';

interface FeaturesGridProps {
  currentLang: SupportedLanguage;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = () => {
  const features = [
    {
      title: 'Zero-Server Architecture',
      desc: 'All conversion runs 100% inside your browser memory using Web Audio API and WebAssembly. Your files are never uploaded to any remote machine.',
      icon: Cpu,
    },
    {
      title: 'Total Confidentiality & Privacy',
      desc: 'No cloud storage, no database records, no cookies, and no telemetry tracking. What you convert stays strictly on your personal device.',
      icon: ShieldCheck,
    },
    {
      title: '100% Offline PWA Mode',
      desc: 'Install Free-MP3 to your home screen or desktop. Once cached by the Service Worker, you can convert audio files without any internet connection.',
      icon: WifiOff,
    },
    {
      title: 'Studio Quality 320 kbps MP3',
      desc: 'Choose between 128 kbps standard, 192 kbps high, and 320 kbps studio fidelity with optimal psychoacoustic bitrate allocation.',
      icon: Music,
    },
    {
      title: 'Volume AGC & Audio Trim',
      desc: 'Easily normalize low-level recordings without clipping distortion, or trim silence and unwanted sections before conversion.',
      icon: Sparkles,
    },
    {
      title: 'Batch Transcoding & ZIP Export',
      desc: 'Convert dozens of media files simultaneously with real-time progress indicators, then download each file individually or bundle all into a single ZIP.',
      icon: Layers,
    },
  ];

  return (
    <section id="features" className="mt-24 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Engineered for Pure Privacy and Maximum Speed
        </h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Discover why thousands of creators and audio engineers choose client-side transcoding.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#5882E8] dark:border-indigo-950 dark:bg-[#100B2E]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#1F06AC] dark:bg-indigo-950 dark:text-[#E3EF4F] mb-4">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
