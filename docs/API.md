# API Documentation

## Version
- **Version**: 0.1.0
- **Last Updated**: 2025-01-31

---

## Table of Contents
1. [IPC API](#ipc-api)
2. [Service APIs](#service-apis)
3. [Data Models](#data-models)
4. [Events](#events)
5. [Error Codes](#error-codes)

---

## IPC API

All IPC communication between main and renderer processes uses `invoke`/`handle` pattern for two-way communication and `send`/`on` for events.

### Renderer → Main (Commands)

#### Settings

```typescript
// Get all settings
ipcRenderer.invoke('settings:get')
=> Promise<AppSettings>

// Save settings (partial update)
ipcRenderer.invoke('settings:save', settings: Partial<AppSettings>)
=> Promise<void>

// Reset settings to defaults
ipcRenderer.invoke('settings:reset')
=> Promise<void>
```

#### Capture

```typescript
// Start screen capture workflow
ipcRenderer.invoke('capture:start')
=> Promise<void>

// Cancel active capture
ipcRenderer.invoke('capture:cancel')
=> Promise<void>
```

#### Translation

```typescript
// Translate text (manual, bypasses capture)
ipcRenderer.invoke('translation:translate', {
  text: string,
  sourceLanguage?: string,
  targetLanguage?: string
})
=> Promise<TranslationResult>
```

#### Overlay

```typescript
// Show overlay with result
ipcRenderer.invoke('overlay:show', result: TranslationResult)
=> Promise<void>

// Hide overlay
ipcRenderer.invoke('overlay:hide')
=> Promise<void>

// Update overlay position
ipcRenderer.invoke('overlay:update-position', {
  x: number,
  y: number
})
=> Promise<void>
```

#### History

```typescript
// Get history entries
ipcRenderer.invoke('history:get', {
  limit?: number,
  offset?: number,
  search?: string,
  dateFrom?: number,
  dateTo?: number
})
=> Promise<TranslationHistory[]>

// Delete entry
ipcRenderer.invoke('history:delete', id: string)
=> Promise<void>

// Clear all history
ipcRenderer.invoke('history:clear')
=> Promise<void>

// Export history
ipcRenderer.invoke('history:export', {
  format: 'json' | 'csv'
})
=> Promise<string> // Export file path
```

---

### Main → Renderer (Events)

#### Settings

```typescript
// Fired when settings change
ipcRenderer.on('settings:updated', (event, settings: AppSettings) => void)
```

#### Capture Progress

```typescript
// OCR progress updates
ipcRenderer.on('ocr:progress', (event, {
  status: 'initializing' | 'recognizing' | 'complete',
  progress: number, // 0-100
  message: string
}) => void)
```

#### Translation Result

```typescript
// Translation completed
ipcRenderer.on('translation:result', (event, result: TranslationResult) => void)
```

#### Overlay

```typescript
// Overlay visibility changed
ipcRenderer.on('overlay:visibility-changed', (event, {
  visible: boolean
}) => void)
```

#### Errors

```typescript
// Error occurred
ipcRenderer.on('error', (event, {
  type: 'capture' | 'ocr' | 'translation' | 'unknown',
  code: string,
  message: string,
  details?: any
}) => void)
```

---

## Service APIs

### CaptureService

```typescript
class CaptureService {
  // Select screen area and capture
  async selectArea(): Promise<CaptureResult>

  // Capture entire screen
  async captureScreen(displayId: string): Promise<Buffer>

  // Capture specific region
  async captureRegion(region: Region): Promise<Buffer>

  // Get available screens
  async getDisplays(): Promise<Display[]>
}

interface CaptureResult {
  image: Buffer
  region: Region
  displayId: string
  timestamp: number
}

interface Region {
  x: number
  y: number
  width: number
  height: number
}

interface Display {
  id: string
  name: string
  width: number
  height: number
  scaleFactor: number
  isPrimary: boolean
}
```

### OcrService

```typescript
class OcrService {
  // Initialize OCR engine (load workers)
  async initialize(): Promise<void>

  // Extract text from image
  async extractText(
    image: Buffer,
    options?: OcrOptions
  ): Promise<OcrResult>

  // Detect text language
  async detectLanguage(image: Buffer): Promise<string>

  // Get available languages
  getAvailableLanguages(): string[]

  // Cleanup (terminate workers)
  async cleanup(): Promise<void>
}

interface OcrOptions {
  language?: string // 'auto' or specific language code
  confidence?: number // Minimum confidence threshold (0-100)
  preprocess?: boolean // Apply image preprocessing
}

interface OcrResult {
  text: string
  confidence: number
  language: string
  lines: OcrLine[]
  regions: OcrRegion[]
}

interface OcrLine {
  text: string
  confidence: number
  boundingBox: BoundingBox
}

interface OcrRegion {
  text: string
  confidence: number
  language: string
  boundingBox: BoundingBox
}

interface BoundingBox {
  x0: number
  y0: number
  x1: number
  y1: number
}
```

### TranslationService

```typescript
class TranslationService {
  // Translate text
  async translate(
    text: string,
    options?: TranslationOptions
  ): Promise<TranslationResult>

  // Translate with auto-detection
  async translateAuto(text: string): Promise<TranslationResult>

  // Clear translation cache
  clearCache(): void

  // Get cache statistics
  getCacheStats(): CacheStats
}

interface TranslationOptions {
  source?: string // Source language (default: 'auto')
  target: string // Target language (default: 'th')
  cache?: boolean // Use cache (default: true)
  provider?: string // Translation provider (default: 'google')
}

interface TranslationResult {
  id: string
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  timestamp: number
  cached: boolean
}

interface CacheStats {
  size: number
  hitRate: number
  entries: CacheEntry[]
}

interface CacheEntry {
  key: string
  source: string
  target: string
  timestamp: number
  hits: number
}
```

### HistoryDatabase

```typescript
class HistoryDatabase {
  // Add translation to history
  add(entry: TranslationEntry): void

  // Get history with filters
  getAll(filters?: HistoryFilters): TranslationEntry[]

  // Search history
  search(query: string, limit?: number): TranslationEntry[]

  // Get entry by ID
  getById(id: string): TranslationEntry | null

  // Update entry
  update(id: string, data: Partial<TranslationEntry>): void

  // Delete entry
  delete(id: string): void

  // Clear all history
  clear(): void

  // Get statistics
  getStats(): HistoryStats

  // Export history
  export(format: 'json' | 'csv'): string
}

interface HistoryFilters {
  limit?: number
  offset?: number
  dateFrom?: number // Unix timestamp
  dateTo?: number
  sourceLanguage?: string
  minConfidence?: number
}

interface TranslationEntry {
  id: string
  timestamp: number
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  imageData?: string // Base64 thumbnail
}

interface HistoryStats {
  totalCount: number
  uniqueLanguages: number
  avgConfidence: number
  mostCommonLanguages: { language: string; count: number }[]
}
```

### SettingsStore

```typescript
class SettingsStore {
  // Get single setting
  get<K extends keyof Settings>(key: K): Settings[K]

  // Get all settings
  getAll(): Settings

  // Set single setting
  set<K extends keyof Settings>(key: K, value: Settings[K]): void

  // Set multiple settings
  setMany(settings: Partial<Settings>): void

  // Reset to defaults
  reset(): void

  // Watch for changes
  onChange<K extends keyof Settings>(
    key: K,
    callback: (value: Settings[K], oldValue: Settings[K]) => void
  ): () => void // Unsubscribe function
}
```

---

## Data Models

### AppSettings

```typescript
interface AppSettings {
  general: GeneralSettings
  shortcuts: ShortcutSettings
  overlay: OverlaySettings
  ocr: OcrSettings
  translation: TranslationSettings
}

interface GeneralSettings {
  sourceLanguage: string // 'auto', 'en', 'ja', 'ko', 'zh-CN', 'zh-TW'
  autoStart: boolean // Start on system boot
  theme: 'light' | 'dark' | 'system'
  language: 'th' | 'en' // UI language
}

interface ShortcutSettings {
  capture: string // e.g., 'CommandOrControl+Shift+X'
  hideOverlay: string
  showHistory: string
  showSettings: string
  quit: string
}

interface OverlaySettings {
  opacity: number // 0-100
  fontSize: number // 12-32
  fontFamily: string
  backgroundColor: string // Hex color
  textColor: string // Hex color
  position: 'cursor' | 'center' | 'custom'
  customPosition?: { x: number; y: number }
  autoHideDelay: number // Milliseconds, 0 = never auto-hide
  clickThrough: boolean // Allow clicking through overlay
  maxWidth: number // Max width in pixels
}

interface OcrSettings {
  engine: 'tesseract'
  confidence: number // Minimum confidence threshold (0-100)
  language: string // Default source language
  preprocess: boolean // Apply image preprocessing
  workerCount: number // Number of parallel workers
}

interface TranslationSettings {
  provider: 'google' // Future: 'deepl', 'azure', 'custom'
  apiEndpoint?: string // Custom API endpoint
  cacheEnabled: boolean
  cacheSize: number // Max cache entries
  cacheTtl: number // Time-to-live in seconds
}
```

### TranslationResult

```typescript
interface TranslationResult {
  id: string // Unique identifier
  sourceText: string
  translatedText: string
  sourceLanguage: string // Detected language
  targetLanguage: string
  confidence: number // 0-100
  timestamp: number // Unix timestamp
  cached: boolean // Whether from cache

  // Optional metadata
  ocrConfidence?: number
  processingTime?: number // Milliseconds
  imageData?: string // Base64 thumbnail
}
```

### TranslationHistory

```typescript
interface TranslationHistory {
  id: string
  timestamp: number
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  imageData?: string // Base64 thumbnail
}
```

### Region

```typescript
interface Region {
  x: number
  y: number
  width: number
  height: number
}
```

### Display

```typescript
interface Display {
  id: string
  name: string
  width: number
  height: number
  scaleFactor: number
  isPrimary: boolean
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
}
```

---

## Events

### Application Events

#### `app:ready`
Emitted when app is fully initialized.

```typescript
// Main process
app.on('ready', () => {
  // App is ready
})
```

#### `app:before-quit`
Emitted before all windows are closed.

```typescript
app.on('before-quit', () => {
  // Cleanup, save state
})
```

### Window Events

#### `window:created`
Emitted when a window is created.

```typescript
// Main process
eventEmitter.on('window:created', (windowType: string) => {
  // Window created
})
```

#### `window:closed`
Emitted when a window is closed.

```typescript
eventEmitter.on('window:closed', (windowType: string) => {
  // Window closed
})
```

### Translation Events

#### `translation:started`
Emitted when translation process starts.

```typescript
eventEmitter.on('translation:started', (data: {
  sourceText: string
  timestamp: number
}) => {
  // Translation started
})
```

#### `translation:completed`
Emitted when translation completes successfully.

```typescript
eventEmitter.on('translation:completed', (result: TranslationResult) => {
  // Translation completed
})
```

#### `translation:failed`
Emitted when translation fails.

```typescript
eventEmitter.on('translation:failed', (error: {
  type: string
  message: string
  details?: any
}) => {
  // Translation failed
})
```

### OCR Events

#### `ocr:progress`
Emitted during OCR processing.

```typescript
eventEmitter.on('ocr:progress', (data: {
  status: 'initializing' | 'recognizing' | 'complete'
  progress: number // 0-100
  message: string
}) => {
  // Update progress UI
})
```

---

## Error Codes

### Error Format

```typescript
interface AppError {
  code: string
  message: string
  details?: any
  stack?: string
}
```

### Capture Errors

| Code | Message | Description |
|------|---------|-------------|
| `CAPTURE_PERMISSION_DENIED` | Permission denied to capture screen | User denied screen capture permission |
| `CAPTURE_CANCELLED` | Screen capture cancelled by user | User pressed Escape or cancelled selection |
| `CAPTURE_FAILED` | Failed to capture screen region | Technical error during capture |
| `CAPTURE_INVALID_REGION` | Invalid screen region selected | Selected region is too small or invalid |

### OCR Errors

| Code | Message | Description |
|------|---------|-------------|
| `OCR_INIT_FAILED` | Failed to initialize OCR engine | Tesseract worker initialization failed |
| `OCR_NO_TEXT` | No text detected in image | OCR found no recognizable text |
| `OCR_LOW_CONFIDENCE` | Text confidence below threshold | OCR confidence < configured threshold |
| `OCR_TIMEOUT` | OCR processing timed out | OCR took too long (>30s) |
| `OCR_LANGUAGE_NOT_SUPPORTED` | Language not supported | Requested language not available |
| `OCR_WORKER_ERROR` | OCR worker error | Internal Tesseract error |

### Translation Errors

| Code | Message | Description |
|------|---------|-------------|
| `TRANS_API_ERROR` | Translation API error | API request failed |
| `TRANS_RATE_LIMITED` | Rate limit exceeded | Too many requests |
| `TRANS_NETWORK_ERROR` | Network error | Cannot reach translation API |
| `TRANS_EMPTY_TEXT` | Empty text to translate | Source text is empty |
| `TRANS_INVALID_LANGUAGE` | Invalid language code | Language code not recognized |
| `TRANS_QUOTA_EXCEEDED` | Translation quota exceeded | API quota limit reached |

### General Errors

| Code | Message | Description |
|------|---------|-------------|
| `UNKNOWN_ERROR` | An unknown error occurred | Unexpected error |
| `NOT_IMPLEMENTED` | Feature not implemented | Feature not yet available |
| `INVALID_INPUT` | Invalid input provided | Input validation failed |
| `DATABASE_ERROR` | Database operation failed | SQLite error |
| `SETTINGS_ERROR` | Settings error | Failed to load/save settings |

---

## Usage Examples

### Example 1: Complete Translation Flow

```typescript
// In renderer process
async function translateScreen() {
  try {
    // Start capture
    await window.electron.capture.start()

    // Listen for progress
    window.electron.onOcrProgress((data) => {
      console.log(`OCR: ${data.progress}% - ${data.message}`)
    })

    // Listen for result
    window.electron.onTranslationResult((result) => {
      console.log('Translation:', result.translatedText)
    })

  } catch (error) {
    console.error('Translation failed:', error)
  }
}
```

### Example 2: Settings Management

```typescript
// In renderer process
const settings = await window.electron.settings.get()

// Update overlay opacity
await window.electron.settings.save({
  overlay: {
    ...settings.overlay,
    opacity: 80
  }
})

// Listen for changes
window.electron.onSettingsUpdated((newSettings) => {
  console.log('Settings updated:', newSettings)
})
```

### Example 3: History Search

```typescript
// Search history
const results = await window.electron.history.get({
  search: 'game',
  limit: 20,
  dateFrom: Date.now() - 7 * 24 * 60 * 60 * 1000 // Last 7 days
})

console.log(`Found ${results.length} translations`)
```

### Example 4: Custom Translation (Main Process)

```typescript
// In main process
const captureService = new CaptureService()
const ocrService = new OcrService()
const translationService = new TranslationService()

async function translateRegion(region: Region) {
  // Capture
  const image = await captureService.captureRegion(region)

  // OCR
  const ocrResult = await ocrService.extractText(image, {
    language: 'auto',
    confidence: 70
  })

  // Translate
  const translation = await translationService.translate(ocrResult.text, {
    source: ocrResult.language,
    target: 'th'
  })

  return translation
}
```

---

## Type Definitions

All types are exported from `@shared/types`:

```typescript
// Main process
import type { AppSettings, TranslationResult, Region } from '@shared/types'

// Renderer process (via context bridge)
import type { AppSettings } from '@shared/types'
```
