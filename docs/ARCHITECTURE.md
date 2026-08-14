# JARVIS // ARCHITECTURE SPECIFICATION

**Document Version:** 1.0.0  
**Target Platform:** Windows 10 / 11 (x64)  
**Classification:** System Architecture & Technical Design  

---

## 1. Executive Summary

JARVIS is an AI-native Windows desktop environment designed to provide an intelligent layer above host Windows computing. It combines direct Windows process execution, real pseudo-terminal (PTY) emulation, agent orchestration, deep system telemetry, and a tactical sci-fi user interface.

This document details the framework evaluation, system architecture, security boundaries, IPC contracts, and packaging pipeline.

---

## 2. Desktop Framework Evaluation

| Criteria | Electron | Tauri (v2) | Wails (v2) |
| :--- | :--- | :--- | :--- |
| **Windows Process & PTY Control** | **Native (Node.js runtime + node-pty / winpty)** | Requires Rust custom FFI / ConPTY wrappers | Requires Go FFI bindings |
| **System Info & Telemetry** | Rich ecosystem (`systeminformation`, `win-process`) | Rust `sysinfo` crate | Go `gopsutil` |
| **Terminal Integration** | Direct binary buffer pipe with xterm.js | Rust IPC channel buffer serialization | Go channel serialization |
| **Portable Distribution** | Self-contained directory without host runtime deps | Small binary, requires WebView2 on host | Small binary, requires WebView2 on host |
| **Dev Environment Match** | Node.js v24 + npm installed | Rust/Cargo not present on host | Go toolchain not present on host |
| **Decision** | **SELECTED** | Ruled out (Host environment & C++ build chain) | Ruled out (Go toolchain not installed) |

### Why Electron + Vite + React + TypeScript?
1. **Host Environment Compatibility**: Host environment has Node.js 24 + npm ready.
2. **Deep Windows Integration**: Seamless support for frameless windows with custom titlebar, system tray, global shortcuts (`Ctrl + Space`), and native notifications.
3. **True Terminal Emulation**: Unlocks high-throughput PTY process streaming for PowerShell, CMD, Git Bash, and WSL.
4. **Standalone Packaging**: `electron-builder` reliably bundles Chromium + Node runtime into a single standalone directory `release/JARVIS/` that runs on any clean Windows machine without dependencies.

---

## 3. Modular System Architecture

```text
c:\Users\Aryan\Desktop\Jarvis\
├── src/
│   ├── main/                 # Node.js Electron Main Process
│   │   ├── index.ts          # App lifecycle, window creation, tray
│   │   ├── ipc/              # Type-safe IPC Handlers
│   │   │   ├── system.ipc.ts # CPU, RAM, Disk, Process metrics
│   │   │   ├── terminal.ipc.ts # PTY spawning & stream management
│   │   │   ├── fs.ipc.ts     # Safe filesystem access
│   │   │   ├── ai.ipc.ts     # Gemini API secure execution & streaming
│   │   │   └── window.ipc.ts # Window state (min, max, close, pin)
│   │   ├── services/         # Native background services
│   │   │   ├── telemetry.service.ts
│   │   │   ├── security.service.ts
│   │   └── preload.ts        # Context isolation bridge (window.jarvisAPI)
│   │
│   ├── renderer/             # React 18 + TypeScript + Vite UI
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── components/
│   │   │   │   ├── boot/           # Cinematic ASCII Boot Sequence
│   │   │   │   ├── titlebar/       # Custom Tactical Frameless Titlebar
│   │   │   │   ├── command/        # Command Center (Ctrl+K palette)
│   │   │   │   ├── workspace/      # Dockable Panel Engine
│   │   │   │   ├── telemetry/      # Real-time System Gauges & Sparklines
│   │   │   │   ├── terminal/       # xterm.js Terminal Component
│   │   │   │   └── settings/       # Settings & API Key Config
│   │   │   ├── state/              # Global UI & Session Stores
│   │   │   ├── styles/             # Design Tokens & Obsidian Tactical CSS
│   │   │   └── types/              # IPC & Shared Type Definitions
│   │
│   └── shared/               # Shared Schemas, Enums & Type Contracts
│       ├── ipc-channels.ts
│       ├── permissions.ts
│       └── system-types.ts
│
├── docs/                     # Technical Documentation & Checkpoints
├── release/                  # Release Distribution Output (Phase 1+)
├── electron-builder.yml      # Windows Packaging Spec
└── package.json
```

---

## 4. Security & Process Isolation Model

```
┌────────────────────────────────────────────────────────┐
│                   Renderer Process                     │
│  (React UI, xterm.js, No Node.js Access, Context-Isolated)│
└───────────────────────────▲────────────────────────────┘
                            │
               window.jarvisAPI (Preload Bridge)
                            │
┌───────────────────────────▼────────────────────────────┐
│                    IPC Boundary Layer                  │
│       Permission Validator & Input Sanitizer           │
└───────────────────────────▲────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    Main Process (Node.js)              │
│  • PTY Process Manager      • Safe Filesystem API      │
│  • Secure API Key Storage   • Windows System Metrics   │
│  • Gemini SDK Client        • Permission Firewall      │
└────────────────────────────────────────────────────────┘
```

### Security Rules:
1. **Context Isolation**: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: false` (to allow preload IPC bridge).
2. **Credential Safety**: Gemini API keys and sensitive tokens are stored strictly in the Main process via secure local encryption. The Renderer NEVER receives raw API keys.
3. **Permission Tiers**:
   - `SAFE_MODE`: Consequential actions (file delete, process kill, write outside workspace) require UI confirmation.
   - `NORMAL_MODE`: Routine operations within workspace are executed automatically with audit logs.
   - `POWER_MODE`: Full automation with system warnings.

---

## 5. Release & Packaging Pipeline

- **Development**: `npm run dev` (Vite HMR + Electron concurrently).
- **Portable Release**: `npm run package:dir` -> Outputs standalone `release/JARVIS/` with `JARVIS.exe` and bundled dependencies.
- **Installer Release**: `npm run package:installer` -> Outputs `release/JARVIS-Setup.exe` (NSIS).
- **CLI Launcher**: `scripts/jarvis.cmd` and `scripts/jarvis.ps1` registered to Windows user PATH.
