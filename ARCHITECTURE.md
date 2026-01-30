# Screen Translation Overlay - Architecture Documentation

## Version
- **Version**: 0.1.0
- **Last Updated**: 2025-01-31
- **Status**: Draft

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Component Design](#component-design)
6. [Data Flow](#data-flow)
7. [Security Architecture](#security-architecture)
8. [Performance Considerations](#performance-considerations)
9. [Scalability](#scalability)
10. [Deployment Architecture](#deployment-architecture)

---

## System Overview

Screen Translation Overlay is a desktop application built on Electron that provides real-time screen translation capabilities. The architecture follows a multi-process design with clear separation of concerns between the main process (system-level operations) and renderer processes (UI).

### Key Architectural Characteristics
- **Multi-process**: Electron's main process + renderer processes
- **Event-driven**: Asynchronous communication via IPC
- **Layered architecture**: Presentation → Application → Domain → Infrastructure
- **Plugin-ready**: Extensible service layers
- **Offline-first**: Local OCR with optional online translation

---

## Architecture Principles

### 1. Separation of Concerns
Each layer has a specific responsibility:
- **Main Process**: System integration, window management, services
- **Renderer Process**: UI rendering, user interaction
- **Services**: Business logic, external integrations
- **Data Layer**: Persistence, caching

### 2. Single Responsibility
Each component/service has one reason to change:
- `CaptureService` - Screen capture only
- `OcrService` - Text extraction only
- `TranslationService` - Translation only

### 3. Dependency Inversion
High-level modules don't depend on low-level modules:
- Services depend on interfaces, not concrete implementations
- UI depends on IPC contracts, not service implementations

### 4. Immutability
State changes are explicit and predictable:
- Zustand for immutable state management
- No direct mutation of shared state

### 5. Error Isolation
Failures are contained and don't cascade:
- Try-catch at service boundaries
- Graceful degradation (e.g., offline mode)

---

## Technology Stack

### Core Technologies

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Desktop Framework** | Electron 28+ | Cross-platform, native APIs, mature ecosystem |
| **UI Framework** | React 18+ | Component-based, hooks, large ecosystem |
| **Language** | TypeScript 5+ | Type safety, better DX, easier refactoring |
| **Build Tool** | Vite 5+ | Fast HMR, optimized builds, modern |
| **Styling** | Tailwind CSS 3+ | Utility-first, small bundle, fast development |
| **State Management** | Zustand 4+ | Lightweight, simple, no boilerplate |
| **Database** | better-sqlite3 9+ | Fast, synchronous API, embedded |
| **Settings** | electron-store 8+ | Simple JSON persistence, type-safe |
| **OCR Engine** | Tesseract.js 5+ | Local processing, multi-language, free |
| **Translation API** | Google Translate | Free tier, Thai support, reliable |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Linting |
| Prettier | Code formatting |
| Vitest | Unit testing |
| Playwright | E2E testing |
| electron-builder | Packaging |
| electron-vite | Build integration |

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Layer                              │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Settings   │    │   Overlay    │    │   History    │
│   Window     │    │   Window     │    │   Window     │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Presentation Layer (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Components   │  │    Hooks     │  │    Stores    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ IPC Bridge   │    │ Context      │
            │ (Preload)    │    │ Bridge       │
            └──────────────┘    └──────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Application Layer (Main)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Window Mgr  │  │  Shortcut    │  │    Tray      │          │
│  │              │  │  Handler     │  │    Manager   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Capture    │  │     OCR      │  │ Translation  │          │
│  │   Service    │  │   Service    │  │   Service    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Cache     │  │    Queue     │  │   Logger     │          │
│  │   Manager    │  │   Manager    │  │   Service    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Settings    │  │   History    │  │    Cache     │          │
│  │    Store     │  │  Database    │  │    Store     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Screen     │  │   Tesseract  │  │   Google     │          │
│  │   Capture    │  │      JS      │  │  Translate   │          │
│  │     API      │  │              │  │     API      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Process Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Process                              │
│  - Lifecycle management                                      │
│  - Window management                                         │
│  - Global shortcuts                                          │
│  - System tray                                               │
│  - Services (OCR, Translation, Capture)                      │
│  - Data persistence                                          │
└──────┬──────────────────────────────────────────────────────┘
       │ IPC (Inter-Process Communication)
       │
┌──────┴──────────────────────────────────────────────────────┐
│                 Renderer Process (Settings)                  │
│  - React UI                                                  │
│  - User settings configuration                               │
│  - History management                                        │
└──────┬──────────────────────────────────────────────────────┘
       │
┌──────┴──────────────────────────────────────────────────────┐
│                 Renderer Process (Overlay)                   │
│  - Minimal UI (translation display only)                     │
│  - Lightweight, always-on-top                                │
└──────┬──────────────────────────────────────────────────────┘
       │
┌──────┴──────────────────────────────────────────────────────┐
│                Renderer Process (Selector)                   │
│  - Screen area selection                                    │
│  - Temporary window, closes after capture                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Design

### Main Process Components

#### 1. Application Entry Point (`src/main/index.ts`)

**Responsibilities**:
- Electron app lifecycle
- Window registration
- Service initialization
- Error handling

```typescript
class Application {
  private windows: WindowManager
  private shortcuts: ShortcutHandler
  private tray: TrayManager
  private services: ServiceContainer

  async initialize(): Promise<void>
  async quit(): Promise<void>
}
```

#### 2. Window Manager (`src/main/windows/`)

**Responsibilities**:
- Create and manage all windows
- Handle window events
- Coordinate window state

```typescript
interface WindowManager {
  createMainWindow(): BrowserWindow
  createOverlayWindow(options: OverlayOptions): BrowserWindow
  createSelectorWindow(): BrowserWindow
  createHistoryWindow(): BrowserWindow

  getMainWindow(): BrowserWindow | null
  getOverlayWindow(): BrowserWindow | null

  closeAllWindows(): void
}
```

**Window Types**:

| Window | Type | Frame | Always-on-Top | Transparent |
|--------|------|-------|---------------|-------------|
| Settings | Normal | Yes | No | No |
| Overlay | Normal | No | Yes | Yes |
| Selector | Toolbar | No | Yes | Yes |
| History | Normal | Yes | No | No |

#### 3. Shortcut Handler (`src/main/shortcuts.ts`)

**Responsibilities**:
- Register global shortcuts
- Handle shortcut triggers
- Detect conflicts

```typescript
class ShortcutHandler {
  register(shortcut: string, callback: () => void): boolean
  unregister(shortcut: string): void
  unregisterAll(): void
  isRegistered(shortcut: string): boolean
}
```

#### 4. Tray Manager (`src/main/tray.ts`)

**Responsibilities**:
- Create system tray icon
- Show context menu
- Handle tray events

```typescript
class TrayManager {
  private tray: Tray
  private contextMenu: Menu

  create(): void
  updateMenu(items: MenuItem[]): void
  showNotification(options: NotificationOptions): void
}
```

### Service Layer

#### 5. Capture Service (`src/main/services/capture.ts`)

**Responsibilities**:
- Screen area selection
- Image capture
- Multi-display support

```typescript
class CaptureService {
  selectArea(): Promise<CaptureResult>
  captureScreen(sourceId: string): Promise<Buffer>
  captureRegion(region: Region): Promise<Buffer>

  private getScreenSources(): Promise<DesktopCapturerSource[]>
  private createSelectorWindow(): Promise<Region>
}
```

#### 6. OCR Service (`src/main/services/ocr.ts`)

**Responsibilities**:
- Text extraction from images
- Tesseract worker management
- Language detection

```typescript
class OcrService {
  private workers: Map<string, Worker>
  private queue: PQueue

  initialize(): Promise<void>
  extractText(image: Buffer, language?: string): Promise<OcrResult>
  detectLanguage(image: Buffer): Promise<string>

  private getWorker(language: string): Promise<Worker>
  private preprocessImage(image: Buffer): Promise<Buffer>
}
```

**Worker Pool Strategy**:
- Lazy initialization (create on first use)
- Pool size: CPU cores / 2 (min 2, max 4)
- Language-specific workers
- Automatic cleanup after 5min idle

#### 7. Translation Service (`src/main/services/translation.ts`)

**Responsibilities**:
- Translation API integration
- Caching
- Retry logic

```typescript
class TranslationService {
  private cache: LRUCache<string, TranslationResult>
  private queue: PQueue

  translate(text: string, target: string): Promise<TranslationResult>
  clearCache(): void

  private callApi(text: string, target: string): Promise<TranslationResult>
  private retryWithBackoff(fn: () => Promise<any>): Promise<any>
}
```

**Cache Strategy**:
- LRU cache with max 1000 entries
- Key: hash(source + target + text)
- TTL: 7 days
- Persistence: Optional (save to disk)

### Data Layer

#### 8. Settings Store (`src/main/store/settings.ts`)

**Responsibilities**:
- Settings persistence
- Type-safe access
- Change notifications

```typescript
class SettingsStore {
  private store: ElectronStore

  get<K extends keyof Settings>(key: K): Settings[K]
  set<K extends keyof Settings>(key: K, value: Settings[K]): void
  getAll(): Settings
  reset(): void

  onChange<K extends keyof Settings>(
    key: K,
    callback: (value: Settings[K]) => void
  ): () => void
}
```

#### 9. History Database (`src/main/store/database.ts`)

**Responsibilities**:
- Translation history storage
- Search functionality
- Data export

```typescript
class HistoryDatabase {
  private db: Database

  add(entry: TranslationEntry): void
  getAll(filters?: HistoryFilters): TranslationEntry[]
  search(query: string): TranslationEntry[]
  delete(id: string): void
  clear(): void
  export(format: 'json' | 'csv'): string

  private initDatabase(): void
  private createIndexes(): void
}
```

---

## Data Flow

### Primary Flow: Capture to Overlay

```
User Presses Shortcut
        │
        ▼
┌──────────────────┐
│ Shortcut Handler │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Window Manager  │──► Create Selector Window
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User Selects     │
│ Screen Area      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Capture Service  │──► Capture Region as Image
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  OCR Service     │──► Extract Text
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Translation      │──► Translate to Thai
│ Service          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Window Manager  │──► Create/Update Overlay
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ History Database │──► Save Translation
└──────────────────┘
```

### IPC Communication Flow

```
Renderer Process          Main Process              Services
     │                        │                        │
     ├─ settings:get ────────►│                        │
     │                        ├─ settings.get() ──────►│
     │                        │                        ├─ Read from disk
     │                        │◄──────────────────────┤
     │◄──── settings ─────────┤                        │
     │                        │                        │
     ├─ capture:start ───────►│                        │
     │                        ├─ startCapture()       │
     │                        │                        ├─ OCR
     │                        │                        ├─ Translate
     │◄─ ocr:progress ────────┤                        │
     │◄─ translation:result ──┤                        │
     │                        │                        │
```

---

## Security Architecture

### Security Principles

1. **Least Privilege**: Minimal permissions required
2. **Defense in Depth**: Multiple security layers
3. **Secure by Default**: Safe configurations out of the box
4. **No Secrets in Code**: Environment variables only

### Security Measures

#### 1. IPC Security

```typescript
// Context bridge (preload script)
contextBridge.exposeInMainWorld('electron', {
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    save: (settings) => ipcRenderer.invoke('settings:save', settings)
  },
  // Only expose necessary APIs
  // No direct Node.js access
})

// Renderer process can only access:
window.electron.settings.get()
// NOT:
require('fs')
```

#### 2. Content Security Policy

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;
               connect-src 'self' https://translate.googleapis.com">
```

#### 3. Node Integration

```typescript
// Renderer windows (DISABLE node integration)
new BrowserWindow({
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    sandbox: true
  }
})

// Main process (ENABLE for services only)
// Services run in main process with Node access
```

#### 4. Data Protection

- **Settings**: Encrypted at rest (optional)
- **History**: Local SQLite database, file permissions
- **Cache**: In-memory only
- **Logs**: No sensitive data logged

#### 5. API Security

```typescript
// No hardcoded API keys
const apiKey = process.env.TRANSLATION_API_KEY

// Rate limiting
const rateLimiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 'minute'
})

// Request signing
const signature = signRequest(request, secret)
```

---

## Performance Considerations

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Capture latency | <500ms | Time from shortcut to image |
| OCR latency | <2s | Time from image to text |
| Translation latency | <1s | Time from text to translation |
| Total latency | <3s | End-to-end |
| Idle memory | <200MB | RAM usage when idle |
| Idle CPU | <5% | CPU usage when idle |

### Optimization Strategies

#### 1. OCR Performance

```typescript
// Worker pool for parallel processing
class WorkerPool {
  private workers: Worker[]
  private queue: PQueue

  async process(image: Buffer): Promise<OcrResult> {
    return this.queue.add(() => {
      const worker = this.acquire()
      try {
        return worker.recognize(image)
      } finally {
        this.release(worker)
      }
    })
  }
}

// Image preprocessing
const preprocessImage = (image: Buffer): Buffer => {
  // Downscale if too large
  if (image.width > 2000) {
    image = image.resize({ width: 2000 })
  }

  // Grayscale for faster OCR
  image = image.grayscale()

  // Enhance contrast
  image = image.normalize()

  return image
}
```

#### 2. Translation Caching

```typescript
// LRU cache
const cache = new LRUCache<string, TranslationResult>({
  max: 1000,
  ttl: 1000 * 60 * 60 * 24 * 7 // 7 days
})

// Cache key hashing
const getCacheKey = (text: string, target: string): string => {
  return createHash('md5')
    .update(text + target)
    .digest('hex')
}
```

#### 3. Lazy Loading

```typescript
// Lazy-load Tesseract language data
class OcrService {
  private loadedLanguages = new Set<string>()

  async loadLanguage(language: string): Promise<void> {
    if (this.loadedLanguages.has(language)) return

    await this.worker.loadLanguage(language)
    this.loadedLanguages.add(language)
  }
}
```

#### 4. Memory Management

```typescript
// Automatic cleanup
class ResourceCleaner {
  private timers: Map<string, NodeJS.Timeout>

  scheduleCleanup(key: string, delay: number): void {
    const timer = setTimeout(() => {
      this.cleanup(key)
    }, delay)
    this.timers.set(key, timer)
  }

  private cleanup(key: string): void {
    // Close idle workers
    // Clear old cache entries
    // Compact database
  }
}
```

---

## Scalability

### Horizontal Scaling

Not applicable (desktop app, single user).

### Vertical Scaling

| Resource | Scaling Strategy |
|----------|------------------|
| CPU | Worker pool size based on cores |
| Memory | Lazy loading, automatic cleanup |
| Storage | Prune old history entries |

### Load Handling

| Scenario | Strategy |
|----------|----------|
| Rapid captures | Queue with max depth (10) |
| Large images | Auto-downscale |
| Many history entries | Pagination, lazy loading |
| API rate limits | Retry with backoff, offline mode |

---

## Deployment Architecture

### Build Process

```
Source Code
     │
     ▼
┌──────────────────┐
│  TypeScript      │
│  Compilation     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Vite Bundling   │
│  - Main process  │
│  - Renderer      │
│  - Preload       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  electron-builder│
│  - Windows (NSIS)│
│  - macOS (DMG)   │
│  - Linux (AppImage)│
└────────┬─────────┘
         │
         ▼
   Release Build
```

### Package Structure

```
ScreenTranslationOverlay.app
├── Contents
│   ├── MacOS
│   │   └── screen-translation-overlay    # Executable
│   ├── Resources
│   │   ├── app.asar                       # Bundled code
│   │   ├── tesseract-data/                # Language files
│   │   └── icons/                         # App icons
│   └── Info.plist
```

### Distribution Channels

1. **Direct Download**: GitHub releases
2. **Auto-updater**: Built-in Electron updater
3. **Future**: Microsoft Store, Mac App Store

---

## Appendix

### File Structure

```
ScreenTranslationOverlay/
├── src/
│   ├── main/                      # Main process
│   │   ├── index.ts              # Entry point
│   │   ├── shortcuts.ts          # Global shortcuts
│   │   ├── tray.ts               # System tray
│   │   ├── windows/
│   │   │   ├── main.ts
│   │   │   ├── overlay.ts
│   │   │   ├── selector.ts
│   │   │   └── history.ts
│   │   ├── services/
│   │   │   ├── capture.ts
│   │   │   ├── ocr.ts
│   │   │   └── translation.ts
│   │   └── store/
│   │       ├── settings.ts
│   │       └── database.ts
│   │
│   ├── renderer/                  # Preload scripts
│   │   └── preload/
│   │       └── index.ts
│   │
│   └── shared/                    # Shared code
│       ├── types/
│       ├── constants/
│       └── utils/
│
├── ui/                            # React app
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── styles/
│   └── index.html
│
├── resources/
│   ├── icons/
│   ├── tesseract-data/
│   └── scripts/
│
└── docs/
```

### Technology Alternatives Considered

| Component | Chosen | Alternative | Reason |
|-----------|--------|-------------|--------|
| Desktop Framework | Electron | Tauri | Electron's maturity and ecosystem |
| UI Framework | React | Vue | Familiarity, ecosystem |
| State | Zustand | Redux | Simplicity |
| Database | SQLite | IndexedDB | Better search performance |
| OCR | Tesseract.js | Cloud API | Offline capability, no cost |

### Future Architecture Improvements

1. **Microkernel Architecture**: Extract services to separate processes
2. **Plugin System**: Allow custom OCR/translation providers
3. **Cloud Sync**: Sync settings/history across devices
4. **Machine Learning**: Custom OCR model for better accuracy
5. **Distributed Processing**: Offload OCR to GPU/external service
