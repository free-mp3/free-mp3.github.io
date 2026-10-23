import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBytes,
  formatTime,
  computeGainForNormalization,
  calculateTrimWindow,
  generateMp3Filename,
  estimateMp3Size,
} from './audioMath.ts';

test('formatBytes formats file sizes correctly', () => {
  assert.equal(formatBytes(0), '0 Bytes');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1048576), '1 MB');
  assert.equal(formatBytes(5242880), '5 MB');
  assert.equal(formatBytes(3500000), '3.34 MB');
});

test('formatTime formats durations mm:ss and hh:mm:ss', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(45), '00:45');
  assert.equal(formatTime(75), '01:15');
  assert.equal(formatTime(3665), '01:01:05');
  assert.equal(formatTime(-10), '00:00');
});

test('computeGainForNormalization scales peaks to prevent clipping', () => {
  // Over unity peak 1.5 -> scale down to 0.98
  const gainOver = computeGainForNormalization(1.5, 0.98);
  assert.ok(Math.abs(gainOver - 0.98 / 1.5) < 0.0001);

  // Very quiet peak 0.2 -> scale up but bounded by 3.0x
  const gainQuiet = computeGainForNormalization(0.49, 0.98);
  assert.equal(gainQuiet, 2.0);

  // Already 0.98 -> 1.0
  const gainExact = computeGainForNormalization(0.98, 0.98);
  assert.equal(gainExact, 1.0);

  // 0 peak -> 1.0
  assert.equal(computeGainForNormalization(0), 1.0);
});

test('calculateTrimWindow boundaries and clamping', () => {
  const window1 = calculateTrimWindow(100, 10, 60);
  assert.deepEqual(window1, { start: 10, end: 60, duration: 50 });

  const windowOver = calculateTrimWindow(100, 20, 150);
  assert.deepEqual(windowOver, { start: 20, end: 100, duration: 80 });

  const windowInverted = calculateTrimWindow(100, 70, 30);
  assert.deepEqual(windowInverted, { start: 70, end: 70, duration: 0 });
});

test('generateMp3Filename strips extension and replaces with .mp3', () => {
  assert.equal(generateMp3Filename('song.wav'), 'song.mp3');
  assert.equal(generateMp3Filename('video.podcast.mp4'), 'video.podcast.mp3');
  assert.equal(generateMp3Filename('audio_recording.flac'), 'audio_recording.mp3');
  assert.equal(generateMp3Filename('track'), 'track.mp3');
});

test('estimateMp3Size estimates correct byte size from kbps and seconds', () => {
  // 320 kbps for 10 seconds = 320,000 * 10 / 8 = 400,000 bytes
  assert.equal(estimateMp3Size(10, 320), 400000);
  // 128 kbps for 60 seconds = 128,000 * 60 / 8 = 960,000 bytes (~937.5 KB)
  assert.equal(estimateMp3Size(60, 128), 960000);
});
