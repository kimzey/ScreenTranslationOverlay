# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Screen Translation Overlay is a desktop application built with Electron + React + TypeScript that enables Thai users to capture screen regions, extract text via OCR, translate to Thai, and display results as transparent overlays.

**Target Audience**: Thai gamers, users navigating foreign software interfaces, students/researchers viewing foreign content.

**Key Goals**: Speed (2-3s end-to-end), Accuracy (90%+ OCR), Lightweight resource usage, Keyboard-first workflow.

---

## Development Commands

```bash
# Development (start dev server with HMR)
npm run dev

# Building
npm run build            # Build for production
npm run build:win        # Build Windows installer
npm run build:mac        # Build macOS installer
npm run build:linux      # Build Linux package

# Testing
npm test                 # Run tests
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run E2E tests

# Quality
npm run lint             # Lint code
npm run type-check       # Type check
```

---

## Architecture Overview

This is an Electron application with strict process separation:

### Multi-Process Architecture

```
Main Process (Node.js access)
├── Services: Capture, OCR, Translation
├── Store: Settings (electron-store), History (SQLite)
├── Window Manager: Creates/manages all windows
├── Shortcut Handler: Global keyboard shortcuts
└── Tray Manager: System tray integration
         │ IPC (via Context Bridge)
         ▼
Renderer Process (React UI)
├── Settings Window: Configuration UI
├── Overlay Window: Translation display (frameless, transparent)
├── Selector Window: Screen region selection
└── History Window: Translation history management
```

### Key Architectural Patterns

1. **Singleton Managers**: All main-process services use singleton pattern via `get*Manager()` functions
2. **Context Bridge**: Security pattern - renderer never gets direct Node.js access
3. **Type-Safe IPC**: All IPC channels defined in `src/shared/types/ipc.ts`
4. **Event-Driven**: Real-time updates via IPC events (e.g., `ocr:progress`, `translation:result`)
5. **Hash Routing**: Simple client-side routing (#/settings, #/overlay, #/selector, #/history)

---

## Path Aliases

The build system (electron-vite) uses path aliases for clean imports:

| Alias | Resolves To | Usage |
|-------|-------------|-------|
| `@main` | `src/main/` | Main process imports |
| `@renderer` | `src/renderer/` | Preload script imports |
| `@shared` | `src/shared/` | Shared types/utils (used by all) |
| `@` | `ui/src/` | React UI imports (renderer only) |

**Examples**:
```typescript
// In main process
import { logger } from '@shared/utils/logger'
import { getSettingsStore } from './store/settings'

// In preload
import type { AppSettings } from '@shared/types/settings'

// In React UI
import { useSettings } from './hooks/useSettings'
import type { TranslationResult } from '@shared/types/translation'
```

---

## Critical Security Rules

1. **NEVER expose Node.js directly to renderer** - Always use context bridge (see `src/renderer/preload/index.ts`)
2. **Disable node integration** in all renderer windows
3. **Enable context isolation and sandbox mode**
4. **No hardcoded secrets** - Use environment variables only
5. **Validate all user input** at IPC boundaries

**Secure window configuration**:
```typescript
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true,
  sandbox: true,
  preload: path.join(__dirname, '../preload/index.js')
}
```

---

## Adding New Features

### 1. Adding a New IPC Channel

**Step 1**: Define channel in `src/shared/types/ipc.ts`

```typescript
export interface IpcChannels {
  'custom:action': never // invoke
}

export interface IpcEvents {
  'custom:event': data
}
```

**Step 2**: Add handler in main process (typically `src/main/index.ts`)

```typescript
ipcMain.handle('custom:action', async (event, arg) => {
  return result
})
```

**Step 3**: Expose via preload bridge (`src/renderer/preload/index.ts`)

```typescript
const electronAPI = {
  customAction: (arg) => ipcRenderer.invoke('custom:action', arg)
}
```

**Step 4**: Use in React UI

```typescript
const result = await window.electron.customAction(arg)
```

### 2. Adding a New Window

**Step 1**: Create window in `src/main/windows/manager.ts`

```typescript
createCustomWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173/#/custom')
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'), {
      hash: '/custom'
    })
  }

  return win
}
```

**Step 2**: Add route in `ui/src/App.tsx`

```typescript
case '#/custom': return <CustomComponent />
```

### 3. Adding a Service

Create in `src/main/services/`:

```typescript
export class CustomService {
  async doSomething(input: string): Promise<Result> {
    try {
      // Implementation
      return result
    } catch (error) {
      logger.error('CustomService failed', error)
      throw error
    }
  }
}
```

Then initialize via singleton pattern in `src/main/index.ts`.

---

## File Organization

```
src/
├── main/                      # Electron main process (Node.js)
│   ├── index.ts              # Entry point - lifecycle, init
│   ├── shortcuts.ts          # Global shortcut registration
│   ├── tray.ts               # System tray menu
│   ├── windows/
│   │   └── manager.ts        # Creates/manages all windows
│   ├── services/             # Business logic
│   │   ├── capture.ts        # Screen capture
│   │   ├── ocr.ts            # Text extraction (Tesseract)
│   │   └── translation.ts    # Translation (Google Translate)
│   └── store/
│       ├── settings.ts       # electron-store for settings
│       └── database.ts       # better-sqlite3 for history
│
├── renderer/                  # Preload scripts (security boundary)
│   └── preload/
│       └── index.ts          # Context bridge - exposes safe APIs
│
└── shared/                    # Shared by main + renderer
    ├── types/                # TypeScript interfaces
    │   ├── settings.ts
    │   ├── ipc.ts
    │   ├── translation.ts
    │   ├── history.ts
    │   └── ocr.ts
    ├── constants/            # Constants (languages, shortcuts)
    └── utils/                # Shared utilities (logger, keyboard)

ui/                            # React app (separate Vite build)
└── src/
    ├── App.tsx               # Hash-based routing
    ├── main.tsx              # React entry point
    ├── components/           # React components
    │   ├── Settings/         # Settings tabs (General, Shortcuts, Overlay, History)
    │   ├── Overlay/          # Translation display overlay
    │   ├── Selector/         # Screen region selection
    │   └── History/          # Translation history
    ├── hooks/                # Custom React hooks (useSettings, useIpc)
    └── styles/               # Global styles (Tailwind)
```

---

## Coding Standards (from RULES.md)

### TypeScript
- **NEVER use `any`** - use `unknown` for dynamic data
- Explicit return types for public functions
- Custom Error classes for domain-specific errors
- No interface `I` prefix (use `UserSettings`, not `IUserSettings`)

### React
- Functional components with hooks only (no classes)
- Components <200 lines - split if larger
- Use Zustand for global state
- Custom hooks for reusable logic

### Electron
- **Critical**: No node integration in renderer
- **Critical**: Always use context bridge
- Store window references in Map, cleanup on close
- Run CPU-intensive work in main process, not renderer

### File Organization
- Keep files under 200 lines
- Import order: Node built-ins → External → @alias → Relative
- Naming: kebab-case files, PascalCase components/types

### Performance
- Lazy-load heavy dependencies (Tesseract.js)
- Memoize expensive computations
- Debounce user input

---

## Key Dependencies

| Package | Purpose | Notes |
|---------|---------|-------|
| **electron** | Desktop framework | Multi-process architecture |
| **electron-vite** | Build system | Builds main/preload/renderer separately |
| **react** | UI framework | Renderer process only |
| **tesseract.js** | OCR engine | Text extraction from images |
| **@vitalets/google-translate-api** | Translation | Free Google Translate API |
| **better-sqlite3** | Database | Translation history |
| **electron-store** | Settings | JSON file storage |
| **zustand** | State management | React global state |
| **tailwindcss** | Styling | Utility-first CSS |

---

## Common Issues & Solutions

### Issue: Native module compilation fails
**Cause**: better-sqlite3 requires native compilation
**Solution**: Ensure Python 3.8+ and Node.js 18+ installed. Rebuild: `npm rebuild better-sqlite3`

### Issue: IPC types don't match
**Cause**: Channel defined in preload but not in types
**Solution**: Always update `src/shared/types/ipc.ts` when adding channels

### Issue: Window doesn't show in development
**Cause**: Vite dev server not running or wrong port
**Solution**: Check `localhost:5173` is accessible. See `electron.vite.config.ts`

### Issue: Overlay window not transparent
**Cause**: CSS background not set or Electron config wrong
**Solution**: Ensure background color has alpha channel (e.g., `#00000080`)

---

## Testing Strategy

### Unit Tests (Vitest)
- Test services in isolation
- Mock external dependencies (Tesseract, Translate API)
- Target: 80%+ coverage

### Component Tests (React Testing Library)
- Test user interactions
- Mock IPC calls

### E2E Tests (Playwright)
- Test critical user flows
- Capture → OCR → Translate → Display

Run tests:
```bash
npm test                 # Unit + component
npm run test:e2e         # E2E
```

---

## Build & Release

### Development Build
```bash
npm run build            # Outputs to dist/
```

### Production Installers
```bash
npm run build:win        # Windows NSIS installer
npm run build:mac        # macOS DMG
npm run build:linux      # Linux AppImage/deb
```

Output directory: `release/`

### Version Bump
Follow Semantic Versioning in `package.json`:
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

---

## Language Support

### OCR Languages (Tesseract)
- English (eng)
- Japanese (jpn)
- Korean (kor)
- Chinese Simplified (chi_sim)
- Chinese Traditional (chi_tra)
- Thai (tha)

Language data files downloaded to `resources/tesseract-data/` on first use.

### Translation
- Target language: Thai (fixed)
- Source language: Auto-detect or user-specified

---

## Documentation References

- `SPEC.md` - Complete feature specification
- `ARCHITECTURE.md` - Detailed system architecture
- `docs/API.md` - IPC channel reference
- `docs/DEVELOPMENT.md` - Extended development guide
- `docs/USER_GUIDE.md` - Thai language user guide
- `RULES.md` - Detailed coding rules
