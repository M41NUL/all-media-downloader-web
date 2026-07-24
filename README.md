# All Media Downloader

[![Live on Vercel](https://img.shields.io/badge/Live-Vercel-black?style=for-the-badge&logo=vercel)](https://all-media-downloader-web.vercel.app)

A sleek, mobile-first web app to download videos from TikTok, Instagram, and Facebook with captions, thumbnails, and real-time download progress.

**Live app:** [all-media-downloader-web.vercel.app](https://all-media-downloader-web.vercel.app)

## Features

- Download videos from TikTok, Instagram, and Facebook
- Auto-detects platform from pasted link
- Video preview with thumbnail, duration, and caption
- One-tap caption copy
- Real-time download progress with cancel support
- Installable as a PWA (Progressive Web App)
- Offline fallback page
- Pull-to-refresh support

## Files

| File | Description |
|---|---|
| `index.html` | Main app interface |
| `offline.html` | Shown when the device has no connection |
| `manifest.json` | PWA manifest for installability |
| `sw.js` | Service worker for offline caching |

## Tech

Static HTML, CSS, and JavaScript. No build step or framework required.

## Author

Built by [M41NUL](https://github.com/M41NUL)
