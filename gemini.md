# JARVIS // AI DESKTOP ENVIRONMENT
# Gemini CLI / Antigravity Project Instructions

## ROLE

You are the primary engineering agent for **JARVIS**, a real Windows desktop application that acts as an AI-native alternate computing environment inside Windows.

This file is the project's persistent instruction set. Read and follow it before making architectural or implementation decisions.

---

# 1. PRODUCT VISION

Build **JARVIS** as a real Windows application.

JARVIS is NOT:

- a chatbot with a fancy UI
- a website wrapped in a desktop window
- a terminal theme
- a fake operating-system simulation

JARVIS IS:

> An AI-native desktop environment that runs inside Windows and provides an alternate way to interact with the computer.

The user should be able to open Windows Terminal and type:

```bash
jarvis
```

and have the installed JARVIS desktop application launch.

The user should also be able to launch JARVIS normally from:

- Start Menu
- Desktop shortcut
- installed executable
- configurable global keyboard shortcut

The intended feeling is:

> "I am entering JARVIS."

not:

> "I opened another app."

Windows remains the host operating system. JARVIS becomes an intelligent workspace / shell-like environment on top of it.

---

# 2. IMPORTANT: BUILD IN THE CURRENT PROJECT FOLDER

The folder containing this `gemini.md` file is the **JARVIS project root**.

Treat it as the source and build directory unless the user explicitly specifies another project directory.

All source code, configuration, documentation, assets, and build scripts should live inside this project.

Do NOT scatter project files across arbitrary locations on the user's machine.

Use external system locations only when they are required for:

- installed application files
- user configuration
- caches
- logs
- temporary files
- Windows shortcuts
- PATH registration

Keep those locations clearly documented.

---

# 3. CRITICAL RELEASE REQUIREMENT

The user specifically wants a **copyable, install-ready Windows application directory**.

The project must therefore support TWO outputs:

## Development output

Used for normal development and testing.

## Release output

Create a clearly identified folder such as:

```text
release/
```

or:

```text
dist/JARVIS/
```

The release directory must contain everything necessary to run JARVIS on a clean compatible Windows machine, subject only to unavoidable external prerequisites such as Windows itself and configured AI credentials.

The release directory must NOT depend on:

- Node.js being installed
- Python being installed
- Git being installed
- the source repository being present
- the development environment being present
- a terminal opened in the source directory
- globally installed npm packages
- developer-only tools

The end result should look conceptually like:

```text
JARVIS/
├── JARVIS.exe
├── resources/
├── assets/
├── runtime/
├── config/
├── plugins/
└── ...
```

The exact structure depends on the chosen desktop framework.

The user should be able to take the completed release directory and copy it into:

```text
C:\Program Files\JARVIS\
```

or another installation directory.

When Windows permissions require administrator access for `Program Files`, document that clearly.

Do NOT assume the application itself can freely write mutable user data beside its executable when installed under `Program Files`.

Use appropriate Windows user-data locations for:

- settings
- logs
- cache
- workspace metadata
- credentials
- local database
- user-created JARVIS data

For example, use suitable locations under `%APPDATA%`, `%LOCALAPPDATA%`, or equivalent platform APIs.

---

# 4. INSTALL / PACKAGING GOAL

The project must eventually support:

```text
JARVIS-Setup.exe
```

and also a portable/copyable build.

The ideal release workflow is:

```text
source
  ↓
build
  ↓
package
  ↓
release/JARVIS/
  ├── JARVIS.exe
  └── required runtime/resources
```

The release directory should be independently runnable.

Also produce an installer when the framework supports it reliably.

The installer should eventually create:

- Start Menu shortcut
- optional Desktop shortcut
- uninstall entry
- optional PATH registration
- optional `jarvis` CLI command

---

# 5. CLI LAUNCHER

The project must provide:

```bash
jarvis
```

as a command that launches the desktop application.

Support future options such as:

```bash
jarvis --workspace <path>
jarvis --project <path>
jarvis --safe-mode
```

Initially implement the simplest reliable launcher.

The CLI should locate the installed JARVIS executable rather than assuming the current working directory.

Do not require the user to run the command from the source repository.

Document the installation method clearly.

---

# 6. TECHNOLOGY RESEARCH BEFORE MAJOR IMPLEMENTATION

Before implementing the major application architecture, research and compare suitable technologies.

Evaluate at least:

- Tauri
- Electron
- Wails
- other relevant open-source desktop frameworks

Also research appropriate technologies for:

- terminal emulation
- Windows process management
- filesystem access
- browser automation
- browser embedding if useful
- system monitoring
- secure credential storage
- local IPC
- AI agent orchestration
- packaging
- Windows installers
- auto-update architecture

Choose the architecture based on:

1. Windows compatibility
2. native desktop performance
3. reliable process execution
4. secure system access
5. ability to package into `.exe`
6. ability to ship a portable/copyable release directory
7. maintainability
8. extensibility
9. UI quality
10. long-term agent capabilities

Do not choose a framework solely because it is familiar.

Create or maintain:

```text
docs/ARCHITECTURE.md
```

and document the decision.

---

# 7. PRODUCT EXPERIENCE

JARVIS should feel like a separate computational environment.

A conceptual flow:

```text
Windows
   ↓
Windows Terminal
   ↓
jarvis
   ↓
JARVIS launches
   ↓
JARVIS startup
   ↓
JARVIS workspace
```

The user should be able to remain inside JARVIS for substantial periods of work.

JARVIS should provide its own coherent environment for:

- AI
- workspaces
- projects
- terminals
- browser activity
- files
- agents
- system information
- command execution
- task monitoring

Do NOT build fake capabilities merely to make the interface look futuristic.

Whenever possible, displayed functionality must map to a real working subsystem.

---

# 8. STARTUP EXPERIENCE

Create a distinctive but brief startup sequence.

Use the attached visual reference as inspiration for the startup aesthetic:

- dark terminal-like background
- retro/futuristic typography
- structured ASCII presentation
- restrained accent color
- cinematic feel

Do not directly copy the reference artwork.

Example:

```text
        J A R V I S

     INITIALIZING CORE...
     LOADING MEMORY...
     CONNECTING AGENTS...
     CHECKING WORKSPACES...
     INITIALIZING TOOLS...

     SYSTEM READY
```

The startup sequence should be:

- optional
- skippable
- short
- polished

Add a setting to disable it.

---

# 9. MAIN APPLICATION

The main interface should feel like an **AI desktop environment**, not a SaaS dashboard.

Possible conceptual structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ JARVIS                                  CPU 34%  RAM 8.2GB │
├───────────────┬───────────────────────────┬────────────────┤
│ WORKSPACES    │      ACTIVE WORKSPACE     │   JARVIS AI    │
│               │                           │                │
│ Home          │                           │ Status         │
│ Projects      │                           │ Tasks          │
│ Research      │                           │ Agents         │
│ Coding        │                           │ Activity       │
│ College       │                           │                │
├───────────────┴───────────────────────────┴────────────────┤
│ > Tell JARVIS what you want to accomplish                   │
└─────────────────────────────────────────────────────────────┘
```

Treat this as a conceptual direction, not a rigid UI specification.

The final UI should be coherent, premium, futuristic, minimal, and practical.

---

# 10. AI-NATIVE INTERACTION

The fundamental interaction should be:

```text
Intent → Planning → Agents → Tools → Workspace → Result
```

not:

```text
Menu → Button → Dialog → Form
```

The user should be able to say:

> Open my website project.

> Start the backend.

> Find why authentication is failing.

> Create a new React project called RSVP.

> Search my files for the latest proposal.

> Open the browser and test localhost.

> What is consuming my RAM?

> Summarize what I worked on today.

JARVIS should determine what tools and agents are required.

---

# 11. COMMAND CENTER

Create a central JARVIS command interface.

Natural-language input should be the primary interaction.

Also implement a global command palette, initially using something such as:

```text
Ctrl + K
```

Possible actions:

```text
> Ask JARVIS
> Open Project
> New Workspace
> Start Terminal
> Open Browser
> Search Files
> Show Agents
> System Monitor
> Settings
> Launch App
```

Natural language and traditional commands must coexist.

---

# 12. AGENT ARCHITECTURE

Build an extensible agent system.

Initial agents:

## Coding Agent

Capabilities:

- inspect code
- create files
- modify files
- run commands
- inspect build errors
- run tests
- fix failures
- explain changes

## Terminal Agent

Capabilities:

- create terminal sessions
- execute commands
- stream output
- maintain session state
- terminate processes
- surface errors

## Browser Agent

Capabilities:

- open websites
- navigate
- inspect pages
- interact with pages
- test local applications
- capture useful observations

## File Agent

Capabilities:

- search files
- inspect directories
- create files
- modify files
- organize files
- safely manipulate filesystem content

## Research Agent

Capabilities:

- gather information
- summarize information
- maintain research context
- produce structured findings

## System Agent

Capabilities:

- CPU usage
- RAM usage
- disk usage
- running processes
- network information
- battery information where available

The architecture must make future agents easy to add.

---

# 13. TOOL ABSTRACTION

Do not hardcode all AI actions directly into prompts.

Create a proper tool abstraction.

Conceptually:

```text
Tool
├── name
├── description
├── input schema
├── permission requirements
├── execute()
├── result format
└── error handling
```

Initial tools may include:

```text
filesystem.read
filesystem.write
filesystem.search

terminal.execute
terminal.create
terminal.kill

browser.open
browser.navigate
browser.inspect

system.stats
process.list
process.start
process.stop

workspace.open
workspace.create

clipboard.read
clipboard.write
```

The model should select tools through structured interfaces rather than generating arbitrary system operations.

---

# 14. GEMINI INTEGRATION

Gemini is the primary AI provider.

Never expose the Gemini API key directly in a frontend renderer.

Create a secure architecture for:

- credentials
- model configuration
- streaming
- tool calls
- error handling
- rate limiting
- conversation state

Abstract the provider:

```text
AIProvider
├── GeminiProvider
└── future providers
```

Do not hardwire the whole application to a single provider.

---

# 15. MEMORY SYSTEM

JARVIS needs memory.

Implement the architecture for:

## Short-term memory

Current conversation and active task.

## Workspace memory

Information relevant to the current workspace/project.

## Persistent memory

User preferences and durable useful context.

The long-term objective is:

> "JARVIS understands how I work."

Do not store sensitive information indiscriminately.

Give the user control over persistent memory.

---

# 16. WORKSPACES

Workspaces are first-class objects.

Examples:

```text
Home
Coding
Research
College
Freelancing
Minecraft
Personal Projects
```

A workspace may contain:

- projects
- terminal sessions
- browser sessions
- files
- AI context
- tasks
- notes
- active agents
- layout state

The user should be able to switch between workspaces quickly.

Persist workspace state.

When returning to a workspace, restore its state where practical.

---

# 17. REAL TERMINAL

The JARVIS terminal must execute REAL Windows processes.

Do not fake output.

Use a suitable terminal emulation layer.

Users must be able to:

- open multiple terminals
- switch terminals
- run normal commands
- copy/paste
- resize
- terminate processes
- see streaming output
- inspect command history

Agents should be able to create terminal sessions too.

The user should be able to observe agent terminal activity.

---

# 18. AGENT TRANSPARENCY

Never hide important agent operations.

Example:

```text
JARVIS
────────────────────────────────
Task: Build RSVP system

✓ Created project
✓ Installed dependencies
✓ Created database schema
◉ Running development server
◉ Testing authentication
○ Browser verification
```

Users should be able to expand operations and inspect:

- commands
- files changed
- tool calls
- errors
- results

Present this cleanly rather than showing raw logs by default.

---

# 19. SECURITY / PERMISSIONS

JARVIS will eventually have powerful system capabilities.

Build explicit permission boundaries.

Potentially destructive operations include:

- deleting files
- killing processes
- installing software
- modifying system configuration
- executing unknown scripts
- accessing sensitive directories

Use permission modes:

## Safe Mode

Ask before consequential actions.

## Normal Mode

Allow routine development operations automatically.

## Power Mode

Allow broader automation with stronger warnings.

Do not bypass Windows security controls.

Never silently perform high-impact destructive actions.

---

# 20. WINDOWS INTEGRATION

Where practical, integrate with Windows features:

- Start Menu
- Desktop shortcut
- system tray
- notifications
- clipboard
- file opening
- URL opening
- application launching
- global hotkeys
- startup behavior
- application settings
- updates

Support a configurable shortcut such as:

```text
Ctrl + Space
```

to open/focus JARVIS.

---

# 21. INTERNAL WINDOW / PANEL SYSTEM

Build a flexible panel system for:

- terminal
- browser
- file explorer
- agent activity
- project workspace
- system monitor
- notes
- AI conversation

Support:

- resizing
- repositioning
- maximizing
- minimizing
- closing
- restoring
- saved layouts

Persist layouts with workspace state.

---

# 22. VISUAL DESIGN

Product name:

# JARVIS

Design characteristics:

- futuristic
- cinematic
- dark-first
- premium
- minimal
- technical
- subtle sci-fi
- practical
- responsive

Avoid generic "cyberpunk AI dashboard" aesthetics.

Avoid:

- excessive neon
- meaningless particle effects
- giant glowing text
- gratuitous glassmorphism
- visual clutter

Motion should communicate state and hierarchy.

---

# 23. PERFORMANCE

Prioritize:

- fast startup
- low idle CPU usage
- low idle memory usage
- smooth UI
- non-blocking AI calls
- streaming responses
- background agent execution
- reliable process management

AI work must never freeze the main UI.

---

# 24. OFFLINE / DEGRADED MODE

JARVIS should remain useful when Gemini is unavailable.

These should still function:

- terminal
- filesystem
- workspaces
- launching applications
- system monitoring
- settings

Clearly show when AI functionality is unavailable.

---

# 25. ERROR HANDLING

Use proper failure handling.

Support:

- tool timeouts
- agent failure recovery
- terminal cleanup
- network errors
- API errors
- application restart recovery
- workspace recovery
- structured logging

Example user experience:

```text
JARVIS

Task interrupted.

Reason:
Port 3000 is already in use.

Suggested action:
Use port 3001?
```

Avoid exposing raw stack traces unless the user requests technical details.

---

# 26. SECURITY RULES

Never:

- expose Gemini credentials to the renderer
- execute arbitrary destructive AI commands without permission checks
- silently upload arbitrary local files
- grant unrestricted filesystem access
- store secrets in plain text
- bypass Windows security mechanisms

Use secure IPC boundaries.

Use secure credential storage where appropriate.

---

# 27. PROJECT STRUCTURE

Use a clean modular architecture.

A possible structure:

```text
jarvis/
│
├── apps/
│   └── desktop/
│
├── core/
│   ├── agent-runtime/
│   ├── tool-runtime/
│   ├── memory/
│   ├── workspace/
│   └── permissions/
│
├── ai/
│   ├── providers/
│   ├── prompts/
│   └── orchestration/
│
├── tools/
│   ├── filesystem/
│   ├── terminal/
│   ├── browser/
│   └── system/
│
├── ui/
│   ├── components/
│   ├── workspace/
│   ├── panels/
│   └── command-center/
│
├── cli/
│
├── docs/
│
├── scripts/
│
├── release/
│
└── gemini.md
```

You may change this if the selected framework requires a better structure.

---

# 28. BUILD IN PHASES

Do not attempt to build everything at once.

## Phase 1 — Desktop Foundation

Build:

- desktop application
- startup experience
- main JARVIS shell
- command palette
- basic workspace
- basic settings
- build configuration
- packaging pipeline

At the end of Phase 1:

```bash
jarvis
```

must launch a real desktop application.

Also produce a working Windows release build.

---

## Phase 2 — Core Environment

Build:

- workspace manager
- real terminal
- filesystem panel
- system monitor
- internal panel system

---

## Phase 3 — AI

Build:

- Gemini provider
- command center
- agent runtime
- tool system
- streaming
- permissions

---

## Phase 4 — Autonomous Workflows

Build:

- coding agent
- browser agent
- research agent
- memory
- multi-step tasks
- agent progress UI

---

## Phase 5 — Windows Integration

Build:

- tray support
- global hotkey
- notifications
- Start Menu integration
- desktop shortcut
- CLI launcher
- startup options

---

## Phase 6 — Polish

Improve:

- animations
- transitions
- keyboard navigation
- startup sequence
- crash recovery
- performance
- visual consistency

---

## Phase 7 — RELEASE

Produce BOTH:

```text
release/JARVIS/
```

and:

```text
release/JARVIS-Setup.exe
```

The folder version must be portable/copyable.

The installer version must behave like a normal Windows desktop installation.

---

# 29. RELEASE DIRECTORY REQUIREMENT

At release time, produce a clean directory specifically intended for copying into Program Files.

Example:

```text
release/
└── JARVIS/
    ├── JARVIS.exe
    ├── resources/
    ├── runtime/
    ├── assets/
    └── required files...
```

Do not place source code in this directory.

Do not place development configuration in this directory.

Do not require the developer environment to run it.

Do not assume the release directory can write persistent state beside `JARVIS.exe`.

Persistent state should use appropriate Windows per-user locations.

Include a small `README-INSTALL.txt` explaining:

1. Where to copy the folder.
2. How to create the `jarvis` command.
3. How to configure Gemini credentials.
4. Where JARVIS stores user data.
5. How to uninstall the portable build.

If an installer exists, the installer should automate these steps.

---

# 30. TESTING

Do not assume the project works because it compiles.

Actually test:

## Desktop

- launches
- closes
- restores
- packaging works
- installer works

## Terminal

- real command execution
- multiple sessions
- process termination
- streaming output

## AI

- Gemini request
- streaming
- tool calls
- invalid tool calls
- permission checks
- API failures

## Files

- read
- write
- search
- protected path handling

## Workspaces

- create
- switch
- save
- restore

## Recovery

- agent failure
- terminal failure
- API failure
- network failure
- application restart

---

# 31. REQUIRED END-TO-END TEST

After the first meaningful release build:

1. Install JARVIS fresh.
2. Open Windows Terminal.
3. Run:

```bash
jarvis
```

4. Verify JARVIS launches.
5. Ask JARVIS:

> Create a folder called JarvisTest on my Desktop, create a simple HTML page inside it, open that page in the browser, and show me what you created.

JARVIS must actually:

- interpret the request
- use the filesystem tool
- create the folder
- create the HTML file
- open the result
- show the result
- report what it did

Then test:

```bash
jarvis --safe-mode
```

and verify that consequential actions request confirmation.

---

# 32. DEVELOPMENT DOCUMENTATION

Maintain:

```text
README.md
docs/ARCHITECTURE.md
ROADMAP.md
CHANGELOG.md
```

README must cover:

- what JARVIS is
- requirements
- setup
- environment variables
- Gemini configuration
- development commands
- production build
- packaging
- portable release
- installer
- CLI installation
- security model

Architecture documentation must explain:

- desktop shell
- renderer/UI
- main process/native layer
- agent runtime
- tool runtime
- AI provider
- memory
- workspace management
- permissions
- IPC
- release packaging

---

# 33. ENGINEERING BEHAVIOR

When you encounter technical uncertainty:

1. Research.
2. Compare approaches.
3. Choose the most maintainable option.
4. Document the choice.
5. Implement it.
6. Test it.

Do not endlessly ask for permission for normal engineering decisions.

Do ask before making a major architectural change that would invalidate significant existing work.

Do not rewrite working subsystems merely for stylistic reasons.

Prefer real functionality over impressive mockups.

---

# 34. DEFINITION OF SUCCESS

The first meaningful version succeeds when this workflow works:

```text
Windows
   ↓
Windows Terminal
   ↓
jarvis
   ↓
JARVIS launches
   ↓
JARVIS workspace appears
   ↓
User gives JARVIS a real task
   ↓
JARVIS plans
   ↓
JARVIS uses real tools
   ↓
JARVIS executes work
   ↓
User observes activity
   ↓
JARVIS reports completion
```

The user should genuinely feel:

> "I have entered a different computational space."


---

# 35. MANDATORY PHASE CHECKPOINT SYSTEM

JARVIS must be developed in **strict, independently resumable phases**.

Do NOT continuously proceed through multiple phases in a single session.

## Core Rule

You may work on **ONE phase only per session**.

At the beginning of a session:

1. Read `gemini.md`.
2. Inspect the current repository state.
3. Read `ROADMAP.md` and `CHANGELOG.md` if they exist.
4. Inspect `docs/checkpoints/` if it exists.
5. Determine the first incomplete phase.
6. Work ONLY on that phase.

When the phase is complete:

1. Implement all planned work for the phase.
2. Test the phase thoroughly.
3. Fix issues discovered during testing.
4. Update documentation.
5. Update `ROADMAP.md`.
6. Update `CHANGELOG.md`.
7. Create a phase checkpoint.
8. Build/package the best working artifact possible for that phase.
9. STOP.

## NEVER automatically continue into the next phase.

Even if the current phase finishes early, STOP after completing it.

Do NOT begin Phase N+1 unless the user explicitly asks you to continue.

This rule exists so development can be safely paused between sessions and resumed later without unnecessary token/credit consumption or long unattended runs.

---

# 36. PHASE CHECKPOINTS

Every completed phase must leave the repository in a usable and resumable state.

Create:

```text
docs/checkpoints/
```

and maintain one file per completed phase:

```text
docs/checkpoints/PHASE-01.md
docs/checkpoints/PHASE-02.md
docs/checkpoints/PHASE-03.md
...
```

Each checkpoint must contain:

```md
# Phase X Checkpoint

## Status
COMPLETE

## Completed
- ...

## Tests Passed
- ...

## Known Issues
- ...

## Files / Systems Changed
- ...

## Release Artifact
- ...

## Next Phase
Phase X+1

## Resume Instructions
Read this checkpoint and continue from the current repository state.
Do not redo completed work.
```

If a phase cannot be fully completed because of an external blocker, do NOT mark it complete. Create an `INCOMPLETE` checkpoint describing the blocker and STOP.

---

# 37. PHASE DEFINITIONS

## PHASE 1 — DESKTOP FOUNDATION

Goal:

Create a functioning JARVIS desktop application and packaging foundation.

Implement only:

- research and select the desktop framework
- project architecture
- desktop application
- JARVIS visual identity
- startup experience
- main application shell
- command center UI foundation
- basic workspace shell
- basic settings foundation
- production build configuration
- Windows packaging
- portable release pipeline

Success condition:

```text
JARVIS.exe
```

can be produced and launched.

Also produce a working:

```text
release/JARVIS/
```

portable/copyable directory containing the required runtime files.

Then STOP.

---

## PHASE 2 — CORE ENVIRONMENT

Implement only:

- workspace manager
- internal panel system
- real terminal
- filesystem explorer
- system monitor
- layout persistence

Test everything.

Then STOP.

---

## PHASE 3 — AI FOUNDATION

Implement only:

- Gemini provider
- secure credential handling
- streaming
- AI command center
- tool abstraction
- permissions system
- basic agent runtime

Test real Gemini calls and tool execution.

Then STOP.

---

## PHASE 4 — AGENTS

Implement only:

- Coding Agent
- Terminal Agent
- File Agent
- Browser Agent
- Research Agent
- System Agent
- agent activity interface

Test real multi-step workflows.

Then STOP.

---

## PHASE 5 — MEMORY + WORKSPACES

Implement only:

- short-term memory
- workspace memory
- persistent memory architecture
- workspace restoration
- project context
- saved layouts

Then STOP.

---

## PHASE 6 — WINDOWS INTEGRATION

Implement only:

- Start Menu integration
- Desktop shortcut
- system tray
- notifications
- global hotkey
- startup options
- `jarvis` CLI
- application launching integration

Then STOP.

---

## PHASE 7 — POLISH + PERFORMANCE

Implement only:

- visual polish
- animations
- transitions
- keyboard navigation
- performance optimization
- crash recovery
- error handling
- startup optimization
- final UX consistency

Then STOP.

---

## PHASE 8 — RELEASE

Perform ONLY release engineering:

- clean production build
- portable release build
- installer build
- fresh installation test
- `jarvis` command test
- uninstall test
- security review
- final documentation
- final changelog

Produce:

```text
release/
├── JARVIS/
│   ├── JARVIS.exe
│   └── ...
└── JARVIS-Setup.exe
```

Then STOP.

---

# 38. RESUMPTION BEHAVIOR

When a new session begins, NEVER assume previous work was completed.

Inspect:

```text
ROADMAP.md
CHANGELOG.md
docs/checkpoints/
```

Determine the latest valid completed phase.

Then continue from the **first incomplete phase**.

Do NOT rebuild completed phases unless:

- they are broken,
- a dependency requires it,
- or the user explicitly requests changes.

If the previous session stopped unexpectedly, inspect the repository and recover from the latest valid checkpoint.

If no checkpoint exists yet, inspect the repository state and begin Phase 1.

---

# 39. PHASE COMPLETION RESPONSE

When a phase is finished, the final response for that session should be concise and contain:

```text
PHASE X COMPLETE

Completed:
...

Tests:
...

Release artifact:
...

Next:
Phase X+1

JARVIS development is intentionally paused here.
```

Do not continue coding after reporting phase completion.

---

# 40. SESSION RESOURCE DISCIPLINE

Optimize each session for meaningful progress.

Do not:

- spend the entire session polishing minor UI details before the phase is functionally complete
- repeatedly refactor working code without reason
- begin future-phase features early
- run unnecessarily expensive operations after the phase has passed its success criteria
- continue autonomous work after the phase checkpoint has been written

Priority order:

1. Functional completion of the current phase
2. Testing
3. Fixing important issues
4. Documentation
5. Checkpoint creation
6. Packaging
7. STOP

The objective is to make every session independently valuable and safely resumable.

---

# FINAL DIRECTIVE

Build **JARVIS as a real Windows desktop environment**, not as a conceptual demo.

The strongest product statement is:

> **JARVIS is an AI-native operating environment that runs inside Windows.**

When the user types:

```bash
jarvis
```

they are entering JARVIS.

When the user closes JARVIS or exits it, they return to normal Windows.

Start by producing a concise technical proposal and architecture decision inside the repository.

Then begin Phase 1.

Do not stop at a web preview.

The project is not complete until a real Windows `.exe` exists and a clean, copyable release directory can be produced.
