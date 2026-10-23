# Free-MP3 — Zero-Server Client-Side MP3 & Audio Converter

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Zero--Server-brightgreen.svg)](#privacy-first-architecture)
[![PWA: Offline Ready](https://img.shields.io/badge/PWA-100%25%20Offline%20Ready-blueviolet.svg)](#progressive-web-app-pwa)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-free--mp3.github.io-success.svg)](https://free-mp3.github.io/)

> **Free-MP3** is a zero-server, 100% client-side audio and video to MP3 transcoder. Audio decoding and MP3 encoding take place directly within the user's browser memory via the HTML5 Web Audio API and WebAssembly MP3 engine. Media files **never** leave your local machine.

---

## 🌐 Live Production URL & Repository

- **Production URL**: [https://free-mp3.github.io/](https://free-mp3.github.io/)
- **GitHub Repository**: [https://github.com/free-mp3/free-mp3.github.io](https://github.com/free-mp3/free-mp3.github.io)

---

## ⚡ Core Philosophy & Key Features

1. **100% Client-Side Transcoding**:
   - Zero servers, zero cloud uploads, zero telemetry, and zero data logging.
   - Converts MP4, WebM, MKV, MOV, WAV, FLAC, OGG, AAC, and M4A directly to MP3 inside your browser.
2. **Simple 3-Step Workflow**:
   - **Step 1: Select Files**: Drag & drop or pick individual or batch media files.
   - **Step 2: Choose Bitrate & Audio Tweaks**: Select 128 kbps Standard, 192 kbps High, or 320 kbps Studio Quality. Optional peak volume normalization (AGC) and audio window trimming.
   - **Step 3: Convert & Download**: Real-time progress bar, audio mini-player preview, and 1-click MP3 download (or consolidated batch ZIP archive).
3. **Progressive Web App (PWA) & Offline Capability**:
   - Registered Service Worker (`sw.js`) and Web App Manifest (`manifest.json`).
   - "Add to Home Screen" in-app installation prompt (with an iOS Safari installation guide modal).
   - Operates 100% offline once cached.
4. **8-Language Reactive i18n**:
   - English (`en`), Spanish (`es`), Portuguese (`pt`), German (`de`), French (`fr`), Japanese (`ja`), Simplified Chinese (`zh`), and Russian (`ru`).
5. **Theme Support**:
   - Light-first clean minimalist aesthetic with a Deep Midnight Indigo dark mode and `localStorage` persistence.

---

## 🎨 Design System & Color Tokens

| Token Name | Hex Code | Visual Role |
| :--- | :--- | :--- |
| **Primary Deep Indigo** | `#1F06AC` | Primary brand identity, headlines, key buttons |
| **Secondary Royal Blue**| `#0F42C0` | Secondary buttons, interactive hover accents |
| **Accent Sky Periwinkle**| `#5882E8` | Drag & drop borders, subtle highlights, glowing borders |
| **Highlight Electric Lime**| `#E3EF4F` | High-contrast callouts, status highlights, dark mode CTAs |

---

## 🛠️ Tech Stack

- **Framework**: Astro (Islands Architecture) / Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Audio Engine**: HTML5 Web Audio API (`AudioContext`) + `lamejs` MP3 Transcoding Engine
- **Packaging**: `jszip` for client-side batch ZIP archive creation
- **PWA**: Service Worker caching, Web App Manifest, Standalone PWA install prompts

---

## 🚀 Local Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/free-mp3/free-mp3.github.io.git
cd free-mp3.github.io

# 2. Install dependencies
npm install

# 3. Start local development server (runs on http://localhost:3000)
npm run dev

# 4. Run automated unit test suite
npx tsx --test src/utils/audioMath.test.ts

# 5. Build for production deployment
npm run build
```

---

## 🧪 Unit Testing

Unit tests for audio math, peak normalization, duration formatting, and trim windows run in milliseconds using Node's native test runner:

```bash
npx tsx --test src/utils/audioMath.test.ts
```

---

## ☕ Support the Developer

Free-MP3 is free, privacy-respecting, and open-source forever. If this tool saves you time, consider supporting future development:

👉 **[Support Kishara on Ko-fi](https://ko-fi.com/kishara)**

---

## 📄 License

Licensed under the [Apache License, Version 2.0](LICENSE).
