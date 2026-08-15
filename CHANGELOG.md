# JARVIS // CHANGELOG

All notable changes to the JARVIS AI Desktop Environment are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.0] - 2026-08-15

### Added
- **Google Gemini Provider Engine**: Native `@google/genai` integration with real-time token streaming, model selection (`gemini-2.5-flash`, `gemini-2.5-pro`), and encrypted local credential storage.
- **Structured Tool Runtime**: Native host tool declarations for `execute_command`, `read_file`, `write_file`, `list_directory`, `get_system_telemetry`, and `list_running_processes`.
- **AI Orchestration Studio**: Interactive conversation and agent console with Markdown syntax rendering, dynamic streaming cursor, and expandable tool execution callouts with arguments and result inspectors.
- **Phase 3 Checkpoint**: Documented milestone in `docs/checkpoints/PHASE-03.md`.

## [0.2.0] - 2026-08-15

### Added
- **Real Pseudo-Terminal Subsystem**: Bidirectional streaming PTY process executor (PowerShell/CMD) wired to GPU-accelerated `xterm.js` with multi-tab session management.
- **Filesystem Matrix Panel**: Interactive directory explorer with roots detection (`C:\`, `D:\`, `Home`), breadcrumbs, file search, and inline code preview drawer.
- **Hardware Telemetry Engine**: Live delta-sampled per-core CPU load gauges, RAM meters, and active Windows Process Tree manager with memory sorting and process termination.
- **Dockable Layout Engine**: Tiling workspace manager supporting Matrix Overview, Terminal Focus, File Focus, Telemetry Focus, and Dual Split modes.
- **Workspace State Persistence**: Auto-save active panels and configuration to `%APPDATA%\jarvis\workspace-state.json`.
- **Phase 2 Checkpoint**: Documented milestone in `docs/checkpoints/PHASE-02.md`.

## [0.1.0] - 2026-08-14

### Added
- **Desktop Shell**: Frameless Electron container with custom title bar, window controls, and IPC context bridge.
- **Visual Identity**: Matte obsidian theme, custom scrollbars, scanlines overlay, and tactile typography (`Geist` / `JetBrains Mono`).
- **Cinematic ASCII Startup**: Self-test diagnostic boot sequence with animated logs and skip key bindings (`Esc` / `Space`).
- **Command Center**: Raycast-style modal command palette (`Ctrl+K`) with fuzzy action filtering and prompt routing.
- **Settings & Security**: Config modal (`Ctrl+,`) with encrypted Gemini API key storage and security mode tiering (`SAFE`, `NORMAL`, `POWER`).
- **Workspace Shell**: Sidebar workspace switcher and responsive subsystem bento matrix.
- **Release Pipeline**: `release/JARVIS/` portable distribution with standalone `JARVIS.exe` and `README-INSTALL.txt`.
- **CLI Launchers**: `scripts/jarvis.cmd` and `scripts/jarvis.ps1` for terminal execution.
- **Checkpoints**: Documented architecture in `docs/ARCHITECTURE.md` and Phase 1 completion in `docs/checkpoints/PHASE-01.md`.
