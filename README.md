# JARVIS // AI Desktop Environment

> An AI-native desktop environment that runs inside Windows and provides an alternate way to interact with your computer.

---

## ⚡ Overview

JARVIS is a native Windows desktop application built with Electron, React, TypeScript, and Vite. It provides an intelligent command center, pseudo-terminal emulation, deep system telemetry, agent orchestration, and custom workspaces directly on top of Windows.

---

## 🚀 Quick Start (Development)

### Prerequisites
- Windows 10 / 11 (x64)
- Node.js >= 18.0.0 (v24 recommended)
- npm >= 9.0.0

### Setup
```bash
# Install dependencies
npm install

# Start in development mode (with Vite HMR + Electron)
npm run dev
```

---

## 📦 Building & Packaging

### Standalone Portable Release
Creates a copyable folder that runs on any clean Windows machine without Node.js or Git:
```bash
npm run package:dir
```
Output: `release/JARVIS/` (Contains `JARVIS.exe`)

### Full Windows Installer
Creates a standalone NSIS setup executable:
```bash
npm run package:installer
```
Output: `release/JARVIS-Setup.exe`

---

## 📂 Project Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for full architectural specifications, IPC contracts, and security boundaries.
See [ROADMAP.md](ROADMAP.md) for developmental phases and checkpoint tracking.
