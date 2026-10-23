import { Mp3Encoder } from '@breezystack/lamejs';
import { computeGainForNormalization, calculateTrimWindow } from '../utils/audioMath.ts';

export interface ConversionOptions {
  bitrate: number; // 128, 192, 320
  normalize: boolean;
  trimEnabled: boolean;
  trimStart: number;
  trimEnd: number;
  onProgress?: (progressPercent: number) => void;
}

export interface ConversionResult {
  blob: Blob;
  url: string;
  duration: number;
  originalSize: number;
  convertedSize: number;
  sampleRate: number;
  channels: number;
}

/**
 * Transcodes any browser-supported audio or video track to standard MP3.
 * 100% in-browser Web Audio API + lamejs. Zero server upload.
 */
export async function convertMediaToMp3(
  fileOrBlob: File | Blob,
  options: ConversionOptions
): Promise<ConversionResult> {
  const { bitrate, normalize, trimEnabled, trimStart, trimEnd, onProgress } = options;

  onProgress?.(5);

  const arrayBuffer = await fileOrBlob.arrayBuffer();
  onProgress?.(15);

  // Use offline audio context or standard audio context to decode
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtx();

  let audioBuffer: AudioBuffer;
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } finally {
    // Clean up audio context
    if (audioCtx.state !== 'closed') {
      audioCtx.close().catch(() => {});
    }
  }

  onProgress?.(30);

  const totalDuration = audioBuffer.duration;
  const originalSampleRate = audioBuffer.sampleRate;
  const numChannels = Math.min(audioBuffer.numberOfChannels, 2);

  // Calculate trim offsets
  let startSec = 0;
  let endSec = totalDuration;
  if (trimEnabled) {
    const window = calculateTrimWindow(totalDuration, trimStart, trimEnd);
    startSec = window.start;
    endSec = window.end;
  }

  const sampleStart = Math.floor(startSec * originalSampleRate);
  const sampleEnd = Math.min(Math.floor(endSec * originalSampleRate), audioBuffer.length);
  const sampleLength = Math.max(0, sampleEnd - sampleStart);

  if (sampleLength === 0) {
    throw new Error('Trim window resulted in empty audio.');
  }

  // Extract raw float32 samples for each channel
  let leftFloat = audioBuffer.getChannelData(0).subarray(sampleStart, sampleEnd);
  let rightFloat: Float32Array | undefined =
    numChannels > 1 ? audioBuffer.getChannelData(1).subarray(sampleStart, sampleEnd) : undefined;

  // Calculate peak normalization
  let gain = 1.0;
  if (normalize) {
    let peak = 0.0;
    for (let i = 0; i < sampleLength; i += 4) {
      const l = Math.abs(leftFloat[i]);
      if (l > peak) peak = l;
      if (rightFloat) {
        const r = Math.abs(rightFloat[i]);
        if (r > peak) peak = r;
      }
    }
    gain = computeGainForNormalization(peak, 0.98);
  }

  onProgress?.(45);

  // Convert Float32 [-1.0, 1.0] to Int16 [-32768, 32767]
  const leftInt16 = new Int16Array(sampleLength);
  const rightInt16 = rightFloat ? new Int16Array(sampleLength) : undefined;

  for (let i = 0; i < sampleLength; i++) {
    const l = Math.max(-1, Math.min(1, leftFloat[i] * gain));
    leftInt16[i] = l < 0 ? l * 0x8000 : l * 0x7fff;

    if (rightFloat && rightInt16) {
      const r = Math.max(-1, Math.min(1, rightFloat[i] * gain));
      rightInt16[i] = r < 0 ? r * 0x8000 : r * 0x7fff;
    }
  }

  onProgress?.(55);

  // MP3 Encoder setup
  // lamejs works best with common sample rates (44100, 48000, 32000, etc.)
  const mp3encoder = new Mp3Encoder(numChannels, originalSampleRate, bitrate);
  const mp3Data: Uint8Array[] = [];

  const chunkSize = 1152 * 4; // Multiple of MP3 frame size
  const totalChunks = Math.ceil(sampleLength / chunkSize);

  for (let c = 0; c < totalChunks; c++) {
    const offset = c * chunkSize;
    const end = Math.min(offset + chunkSize, sampleLength);

    const leftChunk = leftInt16.subarray(offset, end);
    const rightChunk = rightInt16 ? rightInt16.subarray(offset, end) : undefined;

    const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf));
    }

    // Yield control every 4 chunks to keep UI responsive and report progress
    if (c % 4 === 0 || c === totalChunks - 1) {
      const progress = Math.min(95, Math.round(55 + (c / totalChunks) * 40));
      onProgress?.(progress);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  const flushBuf = mp3encoder.flush();
  if (flushBuf.length > 0) {
    mp3Data.push(new Uint8Array(flushBuf));
  }

  onProgress?.(100);

  const mp3Blob = new Blob(mp3Data as unknown as BlobPart[], { type: 'audio/mp3' });
  const objectUrl = URL.createObjectURL(mp3Blob);

  return {
    blob: mp3Blob,
    url: objectUrl,
    duration: sampleLength / originalSampleRate,
    originalSize: fileOrBlob.size,
    convertedSize: mp3Blob.size,
    sampleRate: originalSampleRate,
    channels: numChannels,
  };
}

/**
 * Generates an in-memory test audio tone (WAV Blob) so users and Playwright can
 * immediately test the conversion workflow without uploading an external file.
 */
export function generateSyntheticAudioBlob(durationSeconds = 3, freq = 440): File {
  const sampleRate = 44100;
  const numChannels = 2;
  const numSamples = durationSeconds * sampleRate;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Generate pleasant harmonic chord with fade in/out
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Envelope (0 to 1 with smooth in/out)
    const attack = Math.min(1, t / 0.1);
    const release = Math.min(1, (durationSeconds - t) / 0.5);
    const env = attack * release;

    // Harmonic chord (root + fifth + octave)
    const wave =
      0.5 * Math.sin(2 * Math.PI * freq * t) +
      0.3 * Math.sin(2 * Math.PI * (freq * 1.5) * t) +
      0.2 * Math.sin(2 * Math.PI * (freq * 2) * t);

    const sample = Math.max(-32768, Math.min(32767, Math.floor(wave * env * 0.7 * 32767)));

    // Stereo
    view.setInt16(offset, sample, true);
    view.setInt16(offset + 2, sample, true);
    offset += 4;
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return new File([blob], 'demo_tone_440hz.wav', { type: 'audio/wav' });
}
