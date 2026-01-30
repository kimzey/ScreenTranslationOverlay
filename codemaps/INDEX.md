# CodeMaps Index

**Last Updated:** 2025-01-31
**Project:** screen-translation-overlay v0.1.0

## Overview

Electron desktop application for real-time screen translation with OCR.

## Codemap Files

| File | Description |
|------|-------------|
| [architecture.md](architecture.md) | Overall system architecture |
| [backend.md](backend.md) | Main process (Electron backend) |
| [frontend.md](frontend.md) | Renderer process (React UI) |
| [data.md](data.md) | Data models and schemas |

## Quick Reference

### Technology Stack
- **Runtime:** Electron 28.1.0
- **UI:** React 18 + TypeScript 5
- **Build:** electron-vite 2.0
- **Database:** better-sqlite3 9
- **Settings:** electron-store 8
- **Styling:** Tailwind CSS 3

### Entry Points
- Main: `src/main/index.ts`
- Preload: `src/renderer/preload/index.ts`
- Renderer: `ui/src/main.tsx`

### Directory Structure
```
src/
├── main/          # Electron main process
│   ├── services/  # Business logic
│   ├── store/     # Persistence
│   ├── windows/   # Window management
│   ├── tray.ts
│   └── shortcuts.ts
├── renderer/
│   └── preload/   # Context bridge
├── shared/        # Types, utils, constants
└── ui/            # React app
```

## Key Abstractions

| Module | Purpose |
|--------|---------|
| CaptureService | Screen capture API |
| WindowManager | Multi-window management |
| SettingsStore | Persistent settings |
| HistoryDatabase | Translation history |
| TrayManager | System tray icon |
| ShortcutHandler | Global shortcuts |

## IPC Channels

Renderer -> Main:
- `settings:get`, `settings:save`, `settings:reset`
- `capture:start`, `capture:cancel`
- `translation:translate`
- `overlay:show`, `overlay:hide`, `overlay:update-position`
- `history:get`, `history:delete`, `history:clear`, `history:export`

Main -> Renderer (events):
- `settings:updated`
- `ocr:progress`
- `translation:result`
- `overlay:visibility-changed`
- `error`

## Phase Status

- [x] Phase 1: Foundation (app structure, windows, settings, history)
- [x] Phase 2: Capture (CaptureService with tests)
- [ ] Phase 3: OCR (Tesseract integration)
- [ ] Phase 4: Translation (Google Translate API)
- [ ] Phase 5: Integration (end-to-end flow)
