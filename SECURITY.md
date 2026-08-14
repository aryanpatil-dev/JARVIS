# JARVIS // SECURITY POLICY & ARCHITECTURE

**Last Updated:** 2026-08-14  
**Classification:** Core Engineering & Security Guidelines  

---

## 1. Security Philosophy

JARVIS is an AI-native desktop environment that executes real Windows processes, manages filesystem operations, and interacts with external LLM endpoints (Google Gemini). As an application with deep host OS access, it strictly adheres to the principle of least privilege, process isolation, and explicit user consent.

---

## 2. Security Boundaries & Process Isolation

```
┌─────────────────────────────────────────────────────────────┐
│                      Renderer Process                       │
│  • React UI & xterm.js (HTML5 / WebGL)                      │
│  • contextIsolation: TRUE                                   │
│  • nodeIntegration: FALSE                                   │
│  • sandbox: FALSE (allows strictly exposed preload bridge)   │
└──────────────────────────────▲──────────────────────────────┘
                               │
            window.jarvisAPI (Safe Preload Bridge)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     IPC Firewall Layer                      │
│  • Input schema validation                                  │
│  • Permission tier verification                             │
│  • File path jail & boundary validation                     │
└──────────────────────────────▲──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Main Node.js Process                     │
│  • Direct Windows Process / PTY Execution                   │
│  • Safe Filesystem API                                      │
│  • Gemini SDK Client & API Key Management                   │
│  • System Telemetry API                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Credential & Secret Management

- **Zero Credential Exposure**: Gemini API keys, tokens, and sensitive authentication headers are NEVER sent to or stored within the Renderer process.
- **Local Storage**: Credentials entered in the Settings modal are stored in encrypted per-user storage (`%APPDATA%\jarvis\config.enc` / Windows DPAPI / Keytar).
- **No Plaintext Logging**: API keys and tokens are automatically scrubbed from runtime console logs, exception traces, and telemetry streams.

---

## 4. Permission Modes & Tool Execution

JARVIS enforces 3 explicit runtime security tiers:

| Tier | Default Capabilities | Consequential Operations (Delete, Kill, System Config) |
| :--- | :--- | :--- |
| **SAFE MODE** *(Default)* | Read files, run inspect commands, retrieve system stats | **Requires explicit UI confirmation modal** |
| **NORMAL MODE** | Execute builds, edit project files, open local URLs | Prompts only on out-of-workspace writes or destructive kills |
| **POWER MODE** | Autonomous multi-step tool execution | Shows tactical execution warnings without blocking prompts |

---

## 5. Filesystem & Terminal Execution Safeguards

1. **Path Jailing**: Tool operations outside the active workspace directory require user confirmation in SAFE mode.
2. **Protected Windows Paths**: Operations attempting to modify `C:\Windows\System32`, user credential stores, or system registry are blocked by default.
3. **PTY Process Termination**: Background processes spawned by agents can be inspected and terminated at any time via the UI or Command Center.

---

## 6. Reporting a Vulnerability

If you discover a security vulnerability in JARVIS, please report it responsibly:

- **Do NOT** open a public issue.
- Email your findings directly to the maintainer at `aryanspatilin@gmail.com` with:
  - Description of the vulnerability
  - Steps to reproduce
  - Potential impact assessment
- We will acknowledge receipt within 48 hours and coordinate a security fix and advisory.
