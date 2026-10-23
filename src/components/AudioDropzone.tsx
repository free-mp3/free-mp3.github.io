import React, { useRef, useState } from 'react';
import { UploadCloud, Music2, Sparkles, FileAudio } from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations.ts';
import { generateSyntheticAudioBlob } from '../services/mp3Encoder.ts';

interface AudioDropzoneProps {
  currentLang: SupportedLanguage;
  onFilesSelected: (files: File[]) => void;
}

export const AudioDropzone: React.FC<AudioDropzoneProps> = ({ currentLang, onFilesSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = translations[currentLang];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      onFilesSelected(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const handleAddSampleDemo = () => {
    const demoAudioFile = generateSyntheticAudioBlob(4, 523.25); // C5 harmonic chord
    onFilesSelected([demoAudioFile]);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative group rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${
        isDragOver
          ? 'border-[#0F42C0] bg-indigo-50/70 dark:border-[#E3EF4F] dark:bg-indigo-950/40 scale-[1.008]'
          : 'border-[#5882E8]/40 hover:border-[#0F42C0] bg-white dark:border-indigo-900/60 dark:bg-[#100B2E]/90'
      } shadow-sm`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*,video/*,.mp4,.webm,.mkv,.mov,.avi,.wav,.flac,.ogg,.m4a,.aac,.mp3"
        onChange={handleFileInputChange}
        className="hidden"
        id="audio-file-input"
        aria-label="Upload audio or video files"
      />

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1F06AC] to-[#5882E8] text-[#E3EF4F] shadow-md mb-5 group-hover:scale-105 transition-transform">
        <UploadCloud className="h-8 w-8" aria-hidden="true" />
      </div>

      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {t.dropzoneTitle}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
        {t.dropzoneSubtitle}
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1F06AC] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#0F42C0] hover:shadow-lg transition-all dark:bg-[#5882E8] dark:text-[#08051A] dark:hover:bg-[#E3EF4F]"
        >
          <FileAudio className="h-4 w-4" aria-hidden="true" />
          <span>{t.dropzoneBrowse}</span>
        </button>

        <button
          onClick={handleAddSampleDemo}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-[#1F06AC] hover:bg-slate-100 transition-colors dark:border-indigo-900/70 dark:bg-[#08051A] dark:text-[#E3EF4F] dark:hover:bg-indigo-950/60"
        >
          <Sparkles className="h-4 w-4 text-[#0F42C0] dark:text-[#E3EF4F]" aria-hidden="true" />
          <span>{t.dropzoneSample}</span>
        </button>
      </div>

      {/* Supported metadata description without pills */}
      <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        <span>{t.dropzoneSupported}</span>
      </div>
    </div>
  );
};
