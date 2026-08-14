# Contributing to JARVIS

Thank you for your interest in contributing to the JARVIS AI Desktop Environment!

---

## 🏛️ Phase-Based Development Discipline

JARVIS is built in **strict sequential phases** governed by `gemini.md` and tracked in `ROADMAP.md`:

1. **Phase 1**: Desktop Foundation *(Completed)*
2. **Phase 2**: Core Environment & Subsystems *(Next)*
3. **Phase 3**: AI Foundation & Tool Engine
4. **Phase 4**: Autonomous Agent Architecture
5. **Phase 5**: Memory & Workspaces
6. **Phase 6**: Windows Integration & CLI
7. **Phase 7**: Polish & Performance
8. **Phase 8**: Release Engineering

When contributing, ensure work is aligned with the active phase and that changes leave the repository in a verified, buildable state with updated checkpoints in `docs/checkpoints/`.

---

## 🛠️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aryanpatil-dev/JARVIS.git
   cd JARVIS
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start in Development Mode**:
   ```bash
   npm run dev
   ```

4. **Verify TypeScript & Builds**:
   ```bash
   npm run build
   ```

---

## 🎨 UI & Design Standards (Anti-Slop)

- **Obsidian / Tactical Aesthetics**: Use the curated design tokens in `src/renderer/src/styles/index.css`.
- **Zero AI Slop**: Avoid generic neon gradients, excessive glowing particles, or decorative bloat. Keep interfaces functional, tactical, and minimal.
- **Typography**: Strictly use `Geist` for UI text and `JetBrains Mono` / `Geist Mono` for telemetry, code, and status output.

---

## 🔒 Security Standards

- Never expose raw API keys or secrets in the Renderer.
- All native process interactions must pass through type-safe IPC channels in `src/shared/ipc-channels.ts`.
- Follow the permission model outlined in [SECURITY.md](SECURITY.md).
