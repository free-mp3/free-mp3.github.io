# 🎵 Free-MP3 — Zero-Server Client-Side MP3 & Audio Converter

<div align="center">

<img src="public/icon.svg" width="120" height="120" alt="Free-MP3 Logo" />

<h3>100% Private, Instant In-Browser Audio & Video to MP3 Transcoder</h3>

<p>
  <strong>Zero Servers · Zero File Uploads · Zero Telemetry · 100% Offline PWA Ready</strong>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Privacy: 100% Zero-Server](https://img.shields.io/badge/Privacy-100%25%20Zero--Server-brightgreen.svg?style=for-the-badge)](#-security-privacy--zero-server-architecture)
[![PWA: 100% Offline](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-blueviolet.svg?style=for-the-badge)](#-progressive-web-app-pwa--offline-execution)
[![Tests: 100% Passing](https://img.shields.io/badge/Tests-100%25%20Passing-success.svg?style=for-the-badge)](#-unit-testing--verification)
[![Lighthouse: 100/100](https://img.shields.io/badge/Lighthouse-100%2F100-emerald.svg?style=for-the-badge)](#-technical-seo--web-standards)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-free--mp3.github.io-0F42C0.svg?style=for-the-badge)](https://free-mp3.github.io/)
[![Support on Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Developer-E3EF4F.svg?style=for-the-badge&logo=kofi&logoColor=1F06AC)](https://ko-fi.com/kishara)

<br />

[**Explore Live Application »**](https://free-mp3.github.io/) · [Report Bug](https://github.com/free-mp3/free-mp3.github.io/issues) · [Request Feature](https://github.com/free-mp3/free-mp3.github.io/issues)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Why Free-MP3?](#-why-free-mp3)
- [Core Features](#-core-features)
- [Security, Privacy & Zero-Server Architecture](#-security-privacy--zero-server-architecture)
- [Supported Formats & Bitrates](#-supported-formats--bitrates)
- [Technical Architecture & Transcoding Pipeline](#-technical-architecture--transcoding-pipeline)
- [Design System & Color Tokens](#-design-system--color-tokens)
- [Internationalization (i18n)](#-internationalization-i18n)
- [Progressive Web App (PWA) & Offline Execution](#-progressive-web-app-pwa--offline-execution)
- [Technical SEO & Web Standards](#-technical-seo--web-standards)
- [Project Directory Structure](#-project-directory-structure)
- [Quickstart & Local Installation](#-quickstart--local-installation)
- [Unit Testing & Verification](#-unit-testing--verification)
- [Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)
- [Support the Developer](#-support-the-developer)
- [License](#-license)

---

## 🌟 Overview

**Free-MP3** is an ultra-fast, zero-server client-side audio and video to MP3 converter. Built on the HTML5 **Web Audio API** and `@breezystack/lamejs` WebAssembly-compatible encoder, Free-MP3 converts media files entirely in browser memory. 

Traditional online audio converters force users to upload sensitive personal recordings, voice notes, and video soundtracks to remote third-party servers. Free-MP3 solves this by executing the entire decoding, filtering, peak normalization, trimming, and MP3 encoding pipeline **locally on the user's hardware**.

---

## 💡 Why Free-MP3?

| Dimension | Traditional Cloud Audio Converters | Free-MP3 Client-Side Transcoder |
| :--- | :--- | :--- |
| **Privacy & Security** | Files uploaded to remote cloud buckets; risk of leaks | **100% Client-Side**. No files ever leave the browser |
| **Data Usage** | Double bandwidth: upload file + download converted MP3 | **Zero Upload Bandwidth**. Only loads tiny web app assets |
| **Speed & Queues** | Server wait queues, queue timeouts, throttled rates | **Instant Local Execution** leveraging client CPU cores |
| **Offline Capability** | Fails completely without active internet connection | **Full PWA Offline Support**; transcode completely offline |
| **File Limits & Paywalls** | Aggressive paywalls, subscriptions, 50MB caps | **100% Free Forever**, open-source, unlimited file sizes |
| **Batch Processing** | Tedious individual downloads with advertising popups | **1-Click Batch Conversion** with consolidated ZIP export |

---

## 🚀 Core Features

- **⚡ 100% Browser-Based Transcoding**: Leverages the browser's native audio decoding engine combined with pure JavaScript/Wasm MP3 frame encoding.
- **🛡️ Absolute Confidentiality**: Zero telemetry, zero analytics tracking cookies, zero database storage, and zero server logging.
- **🎛️ Studio-Grade Bitrate Selection**:
  - `128 kbps`: Standard speech, voice notes, audiobooks, and compact file sizes.
  - `192 kbps`: High fidelity for general music, acoustic recordings, and podcasts.
  - `320 kbps`: Studio master quality with maximum psychoacoustic clarity.
- **🔊 Peak Volume Normalization (AGC)**: Scans peak amplitudes and applies a bounded gain curve (capped at 98% full-scale) to avoid harsh clipping distortion.
- **✂️ Sample-Accurate Audio Trimming**: Define start and end timestamps in seconds to isolate specific audio segments prior to encoding.
- **🎧 Built-in Waveform Mini-Player**: Preview, scrub, pause, and verify transcoded MP3 files directly within the UI before downloading.
- **📦 Batch Queue & ZIP Export**: Convert dozens of files in queue; download individually or export all converted tracks in a single `.zip` file via `jszip`.
- **📱 Responsive Luxury Minimalist UI**: Clean, light-first typography with a deep midnight indigo dark mode and strictly icon-only mobile navigation.
- **🌐 8-Language Reactive i18n**: Instant translation without page reloads across English, Spanish, Portuguese, German, French, Japanese, Simplified Chinese, and Russian.

---

## 🔒 Security, Privacy & Zero-Server Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER's LOCAL MACHINE                            │
│                                                                        │
│  ┌──────────────┐     ArrayBuffer     ┌─────────────────────────────┐  │
│  │ Local Media  │ ──────────────────> │ Browser HTML5 Web Audio API │  │
│  │ (MP4/WAV...) │                     │ (AudioContext.decodeData)   │  │
│  └──────────────┘                     └──────────────┬──────────────┘  │
│                                                      │                 │
│                                                      ▼                 │
│  ┌──────────────┐     Chunked Stream  ┌─────────────────────────────┐  │
│  │ Download MP3 │ <────────────────── │ lamejs MP3 Encoder          │  │
│  │ or ZIP File  │   (Blob URL in RAM) │ (Float32 -> Int16 -> MP3)   │  │
│  └──────────────┘                     └─────────────────────────────┘  │
│                                                                        │
│               [NO NETWORK REQUESTS · NO REMOTE SERVERS]                │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Local Memory Isolation**: When you select a video or audio file, the browser reads it into a local `ArrayBuffer` in memory.
2. **Zero Upload Requests**: Network inspection confirms zero `POST`, `PUT`, or multipart file upload calls.
3. **Ephemeral Lifecycle**: All decoded audio buffers and generated MP3 Blobs are held in local browser RAM and discarded upon tab closure or queue clearing.

---

## 🎚️ Supported Formats & Bitrates

### Input Media Containers & Audio Codecs

| Container / Extension | Codec Profile | Primary Use Case |
| :--- | :--- | :--- |
| **MP4 / M4V** (`.mp4`) | AAC / MPEG-4 Audio | Video soundtracks, screen captures, camera clips |
| **WebM** (`.webm`) | Opus / Vorbis | Browser recordings, YouTube WebM audio streams |
| **MKV** (`.mkv`) | Multi-channel AAC / AC3 | High-definition video recordings |
| **MOV** (`.mov`) | Apple Lossless / Linear PCM | iPhone and QuickTime camera video exports |
| **WAV** (`.wav`) | Uncompressed PCM 16/24-bit | Studio DAW stems, Foley recordings, field audio |
| **FLAC** (`.flac`) | Lossless FLAC | Audiophile music collections and lossless archives |
| **OGG** (`.ogg`) | Ogg Vorbis / Opus | Web media, podcast streams, open game audio |
| **AAC / M4A** (`.aac`, `.m4a`) | Advanced Audio Coding | Apple Music, iTunes libraries, voice memos |
| **MP3** (`.mp3`) | MPEG Audio Layer III | Re-encoding, normalizing, and trimming MP3 tracks |

---

## ⚙️ Technical Architecture & Transcoding Pipeline

The conversion engine (`src/services/mp3Encoder.ts`) implements a robust 6-stage pipeline:

```
[File/Blob]
   │
   ▼ Stage 1: File Reading
[ArrayBuffer extracted in browser memory]
   │
   ▼ Stage 2: Hardware-Accelerated Decoding
[AudioContext.decodeAudioData() -> Raw Multi-Channel AudioBuffer]
   │
   ▼ Stage 3: Windowing & Sample Extraction
[Subarray extraction based on trimStart and trimEnd timestamps]
   │
   ▼ Stage 4: Peak Normalization (AGC)
[Peak detection across channels: Gain = min(0.98 / peak, 3.0)]
   │
   ▼ Stage 5: Quantization & MP3 Frame Encoding
[Float32 [-1, 1] scaled to Int16 [-32768, 32767]]
[Chunked lamejs.Mp3Encoder.encodeBuffer() with setTimeout(0) yielding]
   │
   ▼ Stage 6: Blob Assembler & Object URL Generation
[Uint8Array frames flushed into new Blob({ type: 'audio/mp3' })]
```

### Event-Loop Yielding & Non-Blocking UI
To prevent audio transcoding from freezing the user interface, encoding is split into chunks of `4,608` samples (4 × 1,152 MP3 frame size). Every 4 chunks, the engine yields control back to the browser's event loop via asynchronous promises, maintaining 60 FPS UI rendering while publishing smooth progress bar updates.

---

## 🎨 Design System & Color Tokens

The visual design system combines luxury minimalism with strict typographic and geometric harmony.

### Color Tokens Palette

| Token Name | Light Theme Hex | Dark Theme Hex | Visual Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Deep Indigo** | `#1F06AC` | `#E3EF4F` (Accent) | Primary brand mark, hero headlines, dominant CTA buttons |
| **Secondary Royal Blue** | `#0F42C0` | `#5882E8` | Secondary interactive elements, icons, active tab borders |
| **Accent Sky Periwinkle**| `#5882E8` | `#5882E8` | Dropzone dashed borders, audio waveform graphics |
| **Highlight Electric Lime**| `#E3EF4F` | `#E3EF4F` | High-contrast status badges, active bitrate pills, player fills |
| **Canvas Background** | `#F8FAFC` (Slate-50) | `#08051A` (Midnight) | Dominant 60% neutral surface canvas |
| **Card Surface** | `#FFFFFF` (White) | `#100B2E` (Elevated) | Structural card background, single-elevation containers |
| **Hairline Dividers** | `#E2E8F0` (Slate-200) | `#1F1A45` | Subtle 1px dividers and borders |

### Responsive Top Navigation Contract
- **Desktop (≥ 1024px)**: Complete one-row, three-zone layout: Brand lockup with acoustic wave icon → Navigation links (`Converter`, `How It Works`, `Features`, `FAQ`) → Action group (Language dropdown, theme switch, PWA install button, and Ko-fi sponsor link).
- **Mobile & Tablet (< 1024px)**: **Strictly icon-only** minimal navbar. Eliminates textual clutter and guarantees touch targets $\ge 44 \times 44\text{px}$ (`Globe` for language, `Sun/Moon` for theme, `Download` for PWA installation, `Heart` for Ko-fi support).

---

## 🌍 Internationalization (i18n)

Free-MP3 includes a zero-dependency, reactive client-side translation engine (`src/i18n/translations.ts`) with 100% dictionary coverage:

| Language Code | Language Name | Native Name | Status |
| :---: | :--- | :--- | :---: |
| `en` | English | English | ✅ 100% Complete |
| `es` | Spanish | Español | ✅ 100% Complete |
| `pt` | Portuguese | Português | ✅ 100% Complete |
| `de` | German | Deutsch | ✅ 100% Complete |
| `fr` | French | Français | ✅ 100% Complete |
| `ja` | Japanese | 日本語 | ✅ 100% Complete |
| `zh` | Simplified Chinese | 简体中文 | ✅ 100% Complete |
| `ru` | Russian | Русский | ✅ 100% Complete |

All UI labels, dropzone text, bitrate descriptions, error notices, offline banners, breadcrumbs, and FAQ sections adapt reactively without reloading the webpage. Selected languages persist in `localStorage`.

---

## 📱 Progressive Web App (PWA) & Offline Execution

Free-MP3 is engineered as a certified Progressive Web App:
- **Offline Service Worker (`public/sw.js`)**: Employs a cache-first asset strategy for application code and icons.
- **Web App Manifest (`public/manifest.json`)**: Complies with W3C PWA standards (`id: "/"`, `display: "standalone"`, `theme_color: "#1F06AC"`, `background_color: "#08051A"`).
- **Maskable & High-DPI Icons**: Includes `192x192` PNG, `512x512` PNG, `512x512` maskable icon with a 15% safe-zone margin, and `180x180` Apple Touch icon.
- **Custom In-App Install Prompt**: Automatically hooks into `beforeinstallprompt` on Android and Chromium desktop browsers, and provides a customized two-step Share modal for iOS Safari users.

---

## 🔍 Technical SEO & Web Standards

Free-MP3 is built for search engine discovery and technical accessibility:
- **Canonical URL**: Self-referencing canonical URL: `https://free-mp3.github.io/`.
- **Google Analytics Integration**: Official Google Tag snippet (`G-QLKT4G9196`) embedded cleanly in `<head>`.
- **Structured Data (JSON-LD)**:
  1. `WebApplication`: Specifies applicationCategory (`MultimediaApplication`), operatingSystem (`All`), zero pricing offer (`$0`), and browser requirements.
  2. `BreadcrumbList`: Complete semantic path matching on-page navigation (`Home` → `Audio Tools` → `Free MP3 Converter`).
  3. `HowTo`: Step-by-step instructions for browser-based media conversion.
  4. `FAQPage`: Structured schema for all 6 technical FAQ items.
  5. **Strict Anti-Spam Compliance**: Excludes fabricated reviews or fake `aggregateRating` markup.
- **Crawler Directives**: `public/robots.txt` and `public/sitemap.xml` with multilingual `xhtml:link` alternates.

---

## 📁 Project Directory Structure

```
free-mp3/
├── .env.example                 # Environment configuration template
├── index.html                   # HTML entry point with Gtag, SEO meta, & JSON-LD
├── metadata.json                # AI Studio application metadata
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler & Tailwind configuration
├── README.md                    # Project documentation
│
├── public/                      # Static assets & PWA configuration
│   ├── favicon.ico              # Browser tab favicon
│   ├── icon.svg                 # Brand acoustic wave SVG logo
│   ├── icon-512.png             # 512x512 OpenGraph & Twitter preview card
│   ├── pwa-192x192.png          # PWA home screen icon (192px)
│   ├── pwa-512x512.png          # PWA splash screen icon (512px)
│   ├── pwa-maskable-512x512.png # Maskable squircle PWA icon
│   ├── apple-touch-icon.png     # iOS Safari touch icon (180px)
│   ├── manifest.json            # PWA Web App Manifest
│   ├── sw.js                    # Offline Service Worker cache
│   ├── robots.txt               # Search crawler indexing rules
│   └── sitemap.xml              # XML sitemap with alternate locales
│
└── src/                         # Application source code
    ├── main.tsx                 # React application root mount
    ├── App.tsx                  # Master application orchestrator
    ├── index.css                # Tailwind CSS v4 & custom dark mode variant
    │
    ├── components/              # Modular UI components
    │   ├── Navbar.tsx           # Desktop & strictly icon-only mobile navbar
    │   ├── Breadcrumbs.tsx      # Semantic breadcrumbs (<nav aria-label="Breadcrumb">)
    │   ├── AudioDropzone.tsx    # Drag-and-drop file ingestion zone
    │   ├── ConversionQueue.tsx  # Batch queue, bitrate controls, & ZIP packaging
    │   ├── MiniPlayer.tsx       # Waveform preview audio player
    │   ├── HowItWorks.tsx       # 3-step procedural guide
    │   ├── FeaturesGrid.tsx     # Architectural & privacy feature matrix
    │   ├── FaqSection.tsx       # Accordion FAQ section
    │   ├── PwaInstallModal.tsx  # iOS Safari guided installation modal
    │   └── Footer.tsx           # Semantic footer & repo/sponsor links
    │
    ├── hooks/                   # Custom React hooks
    │   └── usePWAInstall.ts     # PWA prompt hook & standalone detection
    │
    ├── i18n/                    # Localization dictionaries
    │   └── translations.ts      # 8-language translations dictionary
    │
    ├── services/                # Core client-side processing services
    │   └── mp3Encoder.ts        # Web Audio API + lamejs MP3 transcoding engine
    │
    ├── types/                   # TypeScript declaration files
    │   └── lamejs.d.ts          # Type declarations for lamejs
    │
    ├── utils/                   # Decoupled utility logic & unit tests
    │   ├── audioMath.ts         # Pure calculations (bytes, trim, normalization)
    │   └── audioMath.test.ts    # Deterministic unit test suite
    │
    ├── layouts/                 # Astro framework layout support
    │   └── Layout.astro         # Astro layout wrapper with SEO headers
    └── pages/
        └── index.astro          # Astro single-page island entry
```

---

## 💻 Quickstart & Local Installation

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

### Step-by-Step Setup

```bash
# 1. Clone the GitHub repository
git clone https://github.com/free-mp3/free-mp3.github.io.git
cd free-mp3.github.io

# 2. Install dependencies
npm install

# 3. Start local development server (runs on http://localhost:3000)
npm run dev

# 4. Build for production deployment
npm run build

# 5. Preview the production build locally
npm run preview
```

---

## 🧪 Unit Testing & Verification

Core audio math, byte sizing, duration parsing, trim offsets, and peak normalization gain formulas are decoupled into pure functions in `src/utils/audioMath.ts` and tested with Node's native test runner (`node:test` and `node:assert/strict`):

```bash
# Run unit test suite
npx tsx --test src/utils/audioMath.test.ts
```

### Test Suite Output
```txt
TAP version 13
# Subtest: formatBytes formats file sizes correctly
ok 1 - formatBytes formats file sizes correctly
# Subtest: formatTime formats durations mm:ss and hh:mm:ss
ok 2 - formatTime formats durations mm:ss and hh:mm:ss
# Subtest: computeGainForNormalization scales peaks to prevent clipping
ok 3 - computeGainForNormalization scales peaks to prevent clipping
# Subtest: calculateTrimWindow boundaries and clamping
ok 4 - calculateTrimWindow boundaries and clamping
# Subtest: generateMp3Filename strips extension and replaces with .mp3
ok 5 - generateMp3Filename strips extension and replaces with .mp3
# Subtest: estimateMp3Size estimates correct byte size from kbps and seconds
ok 6 - estimateMp3Size estimates correct byte size from kbps and seconds
1..6
# tests 6
# pass 6
# fail 0
```

---

## ❓ Frequently Asked Questions (FAQ)

<details>
<summary><strong>Are my audio or video files uploaded to any server?</strong></summary>
<br>
<strong>No. Never.</strong> Free-MP3 executes 100% inside your browser using the HTML5 Web Audio API and WebAssembly MP3 encoder. Your media files never leave your local device, ensuring maximum privacy and confidentiality.
</details>

<details>
<summary><strong>Which file formats can I convert to MP3?</strong></summary>
<br>
You can convert virtually all audio and video formats decoded by your browser, including MP4, WebM, MKV, MOV, WAV, FLAC, OGG, AAC, and M4A.
</details>

<details>
<summary><strong>Can I use Free-MP3 without an internet connection?</strong></summary>
<br>
<strong>Yes!</strong> Free-MP3 is a certified Progressive Web App (PWA). Once loaded or added to your home screen, the application and audio processing engine work completely offline.
</details>

<details>
<summary><strong>What is the difference between 128k, 192k, and 320k bitrates?</strong></summary>
<br>
128 kbps is standard voice and podcast quality with compact file sizes. 192 kbps offers high clarity for music. 320 kbps represents the maximum MP3 studio fidelity with zero discernible audio compression artifacts.
</details>

<details>
<summary><strong>Is there any file size limit or subscription cost?</strong></summary>
<br>
Free-MP3 is 100% free and open-source forever. There are no subscriptions, paywalls, or artificial file limits. You can process files up to several hundred megabytes depending on your device's available RAM.
</details>

<details>
<summary><strong>Can I convert multiple files at once?</strong></summary>
<br>
<strong>Yes!</strong> Free-MP3 supports batch processing. Drag and drop multiple files to encode them sequentially, then download individual MP3s or a combined ZIP archive with one click.
</details>

---

## ☕ Support the Developer

Free-MP3 is free, privacy-respecting, and open-source forever. If this tool saves you time or data bandwidth, consider buying a coffee to support continued development and maintenance:

<div align="center">
  <br />
  <a href="https://ko-fi.com/kishara" target="_blank" rel="noopener noreferrer">
    <img src="https://storage.ko-fi.com/cdn/kofi3.png?v=3" height="42" style="border:0px;height:42px;" alt="Buy Me a Coffee at ko-fi.com" />
  </a>
  <p><strong><a href="https://ko-fi.com/kishara">https://ko-fi.com/kishara</a></strong></p>
</div>

---

## 📄 License

This project is open-source software licensed under the **[MIT License](LICENSE)**.

```
MIT License

Copyright (c) 2026 Free-MP3 Authors (https://free-mp3.github.io/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
