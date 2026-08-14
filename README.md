# JARVIS // AI Desktop Environment

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%2F%2011%20(x64)-0078D6.svg)](docs/ARCHITECTURE.md)
[![Phase](https://img.shields.io/badge/Phase%201-Desktop%20Foundation%20(Complete)-10b981.svg)](docs/checkpoints/PHASE-01.md)

> **JARVIS is an AI-native desktop environment that runs inside Windows and provides an alternate way to interact with your computer.**

---

## ⚡ Key Highlights

- **Native Windows Desktop Shell**: Frameless Electron container with custom tactical titlebar, live hardware telemetry (CPU/RAM meters), and hotkey focus (`Ctrl+Space`).
- **Tactical Sci-Fi Visual Identity**: Obsidian matte palette, high-precision typography (`Geist` / `JetBrains Mono`), CRT scanline overlay, and custom micro-animations.
- **Cinematic ASCII Startup**: Terminal-grade hardware diagnostic self-test with animated logs (skippable with `Esc` / `Space`).
- **Raycast-Grade Command Center (`Ctrl+K`)**: Instant fuzzy search across workspace actions, subsystems, and natural language prompts.
- **Security & Permissions**: Explicit security tiering (`SAFE`, `NORMAL`, `POWER` modes) and secure local Gemini credential storage.
- **Portable Distribution**: Clean, standalone distribution directory at `release/JARVIS/` with `JARVIS.exe` requiring **zero host dependencies** (no Node.js or Git required).

---

## 🚀 Quick Start (Development)

### Prerequisites
- Windows 10 / 11 (x64)
- Node.js >= 18.0.0 (v24 recommended)
- npm >= 9.0.0

### Running Locally
```bash
# Clone the repository
git clone https://github.com/aryanpatil-dev/JARVIS.git
cd JARVIS

# Install dependencies
npm install

# Run Vite HMR + Electron concurrently
npm run dev
```

---

## 📦 Packaging & Portable Releases

### Standalone Portable Release Folder
Generates an independent folder containing `JARVIS.exe` and its runtime resources:
```bash
npm run package:dir
```
**Output**: `release/JARVIS/` (Contains `JARVIS.exe` and `README-INSTALL.txt`)

---

## 📚 Documentation & Specifications

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Framework evaluation, IPC contracts, process isolation, and system architecture.
- [SECURITY.md](SECURITY.md) — Security boundaries, credential encryption, and permission tiers.
- [ROADMAP.md](ROADMAP.md) — 8-phase developmental roadmap and status.
- [CHANGELOG.md](CHANGELOG.md) — Version history and release notes.
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution guidelines and UI standards.
- [LICENSE](LICENSE) — MIT License.

---

## 🛡️ License

Distributed under the [MIT License](LICENSE). Copyright © 2026 Aryan Patil (JARVIS Engineering).
