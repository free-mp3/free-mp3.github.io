import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Download,
  Trash2,
  Sliders,
  PlayCircle,
  Archive,
  Volume2,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { SupportedLanguage, translations } from '../i18n/translations.ts';
import { formatBytes } from '../utils/audioMath.ts';
import { MiniPlayer } from './MiniPlayer.tsx';
import { convertMediaToMp3, ConversionResult } from '../services/mp3Encoder.ts';

export interface QueueItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'ready' | 'processing' | 'done' | 'error';
  progress: number;
  result?: ConversionResult;
  errorMessage?: string;
  convertedName: string;
}

interface ConversionQueueProps {
  currentLang: SupportedLanguage;
  queue: QueueItem[];
  onUpdateQueue: React.Dispatch<React.SetStateAction<QueueItem[]>>;
  onClearQueue: () => void;
  onRemoveItem: (id: string) => void;
}

export const ConversionQueue: React.FC<ConversionQueueProps> = ({
  currentLang,
  queue,
  onUpdateQueue,
  onClearQueue,
  onRemoveItem,
}) => {
  const t = translations[currentLang];

  // Global settings
  const [bitrate, setBitrate] = useState<number>(320); // 128, 192, 320
  const [normalize, setNormalize] = useState<boolean>(true);
  const [trimEnabled, setTrimEnabled] = useState<boolean>(false);
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(0);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const completedCount = queue.filter((item) => item.status === 'done').length;
  const isConvertingAny = queue.some((item) => item.status === 'processing');

  const convertSingleItem = async (item: QueueItem) => {
    onUpdateQueue((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, status: 'processing', progress: 5, errorMessage: undefined } : i
      )
    );

    try {
      const result = await convertMediaToMp3(item.file, {
        bitrate,
        normalize,
        trimEnabled,
        trimStart,
        trimEnd,
        onProgress: (pct) => {
          onUpdateQueue((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, progress: pct } : i))
          );
        },
      });

      onUpdateQueue((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: 'done',
                progress: 100,
                result,
              }
            : i
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Conversion failed';
      onUpdateQueue((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: 'error', progress: 0, errorMessage: msg } : i
        )
      );
    }
  };

  const handleConvertAll = async () => {
    const pendingItems = queue.filter((i) => i.status === 'ready' || i.status === 'error');
    for (const item of pendingItems) {
      await convertSingleItem(item);
    }
  };

  const handleDownloadZip = async () => {
    const doneItems = queue.filter((i) => i.status === 'done' && i.result);
    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (const item of doneItems) {
        if (item.result) {
          zip.file(item.convertedName, item.result.blob);
        }
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Free-MP3-Converted-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch {
      // ignore
    } finally {
      setIsZipping(false);
    }
  };

  if (queue.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col gap-6">
      {/* Step 2: Settings Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-indigo-950 dark:bg-[#100B2E]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-indigo-950">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-[#0F42C0] dark:text-[#E3EF4F]" aria-hidden="true" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {t.settingsTitle}
            </h4>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {queue.length} {queue.length === 1 ? 'file' : 'files'} in queue
          </span>
        </div>

        {/* Bitrate Selector Tabs */}
        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.bitrateLabel}
          </label>
          <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { kbps: 128, label: t.bitrateStandard, tag: 'Standard' },
              { kbps: 192, label: t.bitrateHigh, tag: 'High' },
              { kbps: 320, label: t.bitrateStudio, tag: 'Studio (Best)' },
            ].map((option) => (
              <button
                key={option.kbps}
                type="button"
                onClick={() => setBitrate(option.kbps)}
                className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                  bitrate === option.kbps
                    ? 'border-[#1F06AC] bg-indigo-50/70 text-[#1F06AC] dark:border-[#E3EF4F] dark:bg-indigo-950/70 dark:text-[#E3EF4F] shadow-sm ring-1 ring-[#1F06AC] dark:ring-[#E3EF4F]'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 dark:border-indigo-900/60 dark:text-slate-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm">{option.kbps} kbps</span>
                  <span className="text-[11px] font-medium opacity-80">{option.tag}</span>
                </div>
                <span className="mt-1 text-xs opacity-75">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Normalization & Trim Options */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-indigo-950 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Normalization */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="normalize-toggle"
              checked={normalize}
              onChange={(e) => setNormalize(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1F06AC] focus:ring-[#1F06AC] dark:border-indigo-800 dark:bg-[#08051A]"
            />
            <label htmlFor="normalize-toggle" className="cursor-pointer">
              <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                {t.normalizeLabel}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.normalizeHelp}
              </span>
            </label>
          </div>

          {/* Audio Trim Option */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="trim-toggle"
                checked={trimEnabled}
                onChange={(e) => setTrimEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#1F06AC] focus:ring-[#1F06AC] dark:border-indigo-800 dark:bg-[#08051A]"
              />
              <label
                htmlFor="trim-toggle"
                className="text-sm font-semibold text-slate-900 dark:text-white cursor-pointer"
              >
                {t.trimLabel}
              </label>
            </div>

            {trimEnabled && (
              <div className="flex items-center gap-3 pl-6">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.trimStart}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={trimStart}
                    onChange={(e) => setTrimStart(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="mt-1 w-20 rounded-lg border border-slate-200 px-2.5 py-1 text-xs dark:border-indigo-800 dark:bg-[#08051A] dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.trimEnd}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={trimEnd}
                    onChange={(e) => setTrimEnd(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="All"
                    className="mt-1 w-20 rounded-lg border border-slate-200 px-2.5 py-1 text-xs dark:border-indigo-800 dark:bg-[#08051A] dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Queue Master Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-indigo-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleConvertAll}
              disabled={isConvertingAny}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1F06AC] to-[#0F42C0] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-50 transition-all dark:from-[#5882E8] dark:to-[#0F42C0] dark:text-[#08051A]"
            >
              {isConvertingAny ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t.converting}</span>
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4" />
                  <span>{t.convertAll}</span>
                </>
              )}
            </button>

            {completedCount > 1 && (
              <button
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="inline-flex items-center gap-2 rounded-xl border border-[#5882E8] bg-indigo-50/60 px-4 py-2.5 text-sm font-semibold text-[#1F06AC] hover:bg-indigo-100 transition-colors dark:border-indigo-800 dark:bg-indigo-950/60 dark:text-[#E3EF4F]"
              >
                {isZipping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
                <span>
                  {t.downloadZip} ({completedCount})
                </span>
              </button>
            )}
          </div>

          <button
            onClick={onClearQueue}
            disabled={isConvertingAny}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 disabled:opacity-50 transition-colors dark:text-slate-400 dark:hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
            <span>{t.clearQueue}</span>
          </button>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {t.queueTitle} ({queue.length})
        </h4>

        {queue.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-indigo-950 dark:bg-[#100B2E]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#1F06AC] dark:bg-indigo-950 dark:text-[#E3EF4F]">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {formatBytes(item.size)}
                    {item.result && (
                      <span>
                        {' '}
                        → <strong className="text-emerald-600 dark:text-[#E3EF4F]">{formatBytes(item.result.convertedSize)}</strong> MP3 @ {bitrate} kbps
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'ready' && (
                  <button
                    onClick={() => convertSingleItem(item)}
                    className="rounded-lg bg-[#1F06AC] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0F42C0] transition-colors dark:bg-[#5882E8] dark:text-[#08051A]"
                  >
                    Convert
                  </button>
                )}

                {item.status === 'processing' && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F42C0] dark:text-[#5882E8]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{item.progress}%</span>
                  </div>
                )}

                {item.status === 'done' && item.result && (
                  <a
                    href={item.result.url}
                    download={item.convertedName}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{t.downloadMp3}</span>
                  </a>
                )}

                {item.status === 'error' && (
                  <button
                    onClick={() => convertSingleItem(item)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Retry</span>
                  </button>
                )}

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                  aria-label={`Remove ${item.name} from queue`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Real-time Progress Bar */}
            {item.status === 'processing' && (
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden dark:bg-indigo-950">
                <div
                  className="bg-gradient-to-r from-[#1F06AC] via-[#0F42C0] to-[#5882E8] h-2 rounded-full transition-all duration-150"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}

            {/* Error Message */}
            {item.status === 'error' && item.errorMessage && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{item.errorMessage}</span>
              </div>
            )}

            {/* Audio Mini-Player Preview for Completed item */}
            {item.status === 'done' && item.result && (
              <div className="mt-1">
                <MiniPlayer audioUrl={item.result.url} filename={item.convertedName} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
