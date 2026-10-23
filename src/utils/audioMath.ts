/**
 * Pure audio utility calculations for Free-MP3 converter.
 * Completely decoupled from DOM and Web Audio APIs for deterministic testing.
 */

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes <= 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${pad(hrs)}:${pad(remMins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export function computeGainForNormalization(maxPeak: number, targetMax: number = 0.98): number {
  if (maxPeak <= 0 || !isFinite(maxPeak)) return 1.0;
  if (maxPeak >= targetMax) {
    return targetMax / maxPeak;
  }
  // Subtle boost for quiet audio, capped at 3.0x (+9.5dB) to avoid noise explosion
  const boost = targetMax / maxPeak;
  return Math.min(boost, 3.0);
}

export function calculateTrimWindow(
  totalDuration: number,
  startTime: number,
  endTime: number
): { start: number; end: number; duration: number } {
  const safeTotal = Math.max(0, totalDuration);
  const safeStart = Math.max(0, Math.min(startTime, safeTotal));
  const safeEnd = endTime <= 0 || endTime > safeTotal ? safeTotal : Math.max(safeStart, endTime);
  const duration = Math.max(0, safeEnd - safeStart);
  return {
    start: safeStart,
    end: safeEnd,
    duration,
  };
}

export function generateMp3Filename(originalFilename: string): string {
  const clean = originalFilename.replace(/\.[^/.]+$/, '');
  const safeBase = clean.trim() || 'audio';
  return `${safeBase}.mp3`;
}

export function estimateMp3Size(durationSeconds: number, kbps: number): number {
  if (durationSeconds <= 0 || kbps <= 0) return 0;
  // (kbps * 1000 bits/sec * seconds) / 8 bits/byte
  return Math.round((kbps * 1000 * durationSeconds) / 8);
}
