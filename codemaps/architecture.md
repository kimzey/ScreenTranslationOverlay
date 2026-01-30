# Architecture Codemap

**Last Updated:** 2025-01-31

## Layer Architecture

```
[User] -> [Renderer Windows] -> [Preload Bridge] -> [Main Process] -> [Services] -> [Data/External]
```

## Process Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Main Process                       │
│  ┌───────────────────────────────────────────────┐  │
│  │         Entry: src/main/index.ts              │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐         │
│  │  Windows  │ │ Shortcuts │ │   Tray    │         │
│  │  Manager  │ │  Handler  │ │  Manager  │         │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘         │
│        └───────────────┼───────────────┘            │
│                       ▼                             │
│  ┌──────────────────────────────────────────────┐   │
│  │              Services Layer                  │   │
│  │  ┌─────────┐ ┌───────┐ ┌─────────────┐      │   │
│  │  │ Capture │ │  OCR  │ │ Translation │      │   │
│  │  │ Service │ │Service│ │  Service    │      │   │
│  │  └─────────┘ └───────┘ └─────────────┘      │   │
│  └──────────────────────────────────────────────┘   │
│                       ▼                             │
│  ┌──────────────────────────────────────────────┐   │
│  │              Data Layer                      │   │
│  │  ┌───────────┐           ┌─────────────┐     │   │
│  │  │  Settings │           │   History   │     │   │
│  │  │   Store   │           │  Database   │     │   │
│  │  └───────────┘           └─────────────┘     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                         │ IPC
                         ▼
┌─────────────────────────────────────────────────────┐
│              Preload: src/renderer/preload/         │
│              (Context Bridge - Secure API)          │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│           Renderer: ui/src/ (React)                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Settings│ │ Overlay │ │Selector │ │ History │   │
│  │ Panel   │ │         │ │         │ │  Panel  │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────────────────┘
```

## Key Modules

### Main Process
- `index.ts` - App lifecycle, single instance lock
- `windows/manager.ts` - Creates 4 window types (main, overlay, selector, history)
- `tray.ts` - System tray icon + context menu
- `shortcuts.ts` - Global keyboard shortcuts

### Services
- `services/capture.ts` - Screen capture (desktopCapturer API)

### Store
- `store/settings.ts` - electron-store wrapper
- `store/database.ts` - better-sqlite3 wrapper

### Shared
- `types/*.ts` - TypeScript interfaces
- `utils/logger.ts` - Logging utility
- `constants/*.ts` - Language codes, default shortcuts

### Renderer
- `preload/index.ts` - Context bridge (IPC)
- `ui/src/components/` - React components
- `ui/src/hooks/` - Custom hooks (useSettings, useHash)

## Data Flow: Capture Workflow

```
User (Shortcut)
    -> ShortcutHandler.registerAll()
    -> WindowManager.getOrCreateSelectorWindow()
    -> User selects region
    -> CaptureService.captureRegion()
    -> [Future: OcrService.extractText()]
    -> [Future: TranslationService.translate()]
    -> WindowManager.getOrCreateOverlayWindow()
    -> HistoryDatabase.add()
```

## External Dependencies

- Electron 28 - Desktop framework
- better-sqlite3 - SQLite database
- electron-store - JSON settings storage
- tesseract.js - OCR (planned)
- google-translate-api - Translation (planned)
