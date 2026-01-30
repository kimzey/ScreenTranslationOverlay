# Data Codemap (Types & Schemas)

**Last Updated:** 2025-01-31
**Location:** `src/shared/types/`

## Type Definitions

### Settings (`settings.ts`)

```typescript
interface GeneralSettings {
  sourceLanguage: string           // Default: 'auto'
  autoStart: boolean               // Default: false
  theme: 'light' | 'dark' | 'system'
  language: 'th' | 'en'
}

interface ShortcutSettings {
  capture: string                  // Default: 'CommandOrControl+Shift+X'
  hideOverlay: string              // Default: 'CommandOrControl+Shift+H'
  showHistory: string              // Default: 'CommandOrControl+Shift+H'
  showSettings: string             // Default: 'CommandOrControl+Shift+S'
  quit: string                     // Default: 'CommandOrControl+Shift+Q'
}

interface OverlaySettings {
  opacity: number                  // Default: 90
  fontSize: number                 // Default: 16
  fontFamily: string               // Default: 'Sarabun'
  backgroundColor: string          // Default: '#0f172a'
  textColor: string                // Default: '#f8fafc'
  position: 'cursor' | 'center' | 'custom'
  customPosition?: { x: number; y: number }
  autoHideDelay: number            // Default: 30000 (ms)
  clickThrough: boolean            // Default: false
  maxWidth: number                 // Default: 600
}

interface OcrSettings {
  engine: 'tesseract'              // Only option currently
  confidence: number               // Default: 70
  language: string                 // Default: 'auto'
  preprocess: boolean              // Default: true
  workerCount: number              // Default: 2
}

interface TranslationSettings {
  provider: 'google'               // Only option currently
  apiEndpoint?: string             // Optional custom endpoint
  cacheEnabled: boolean            // Default: true
  cacheSize: number                // Default: 1000
  cacheTtl: number                 // Default: 604800 (7 days)
}

interface AppSettings {
  general: GeneralSettings
  shortcuts: ShortcutSettings
  overlay: OverlaySettings
  ocr: OcrSettings
  translation: TranslationSettings
}
```

### History (`history.ts`)

```typescript
interface TranslationEntry {
  id: string                       // UUID
  timestamp: number                // Unix timestamp
  sourceText: string               // Original text
  translatedText: string           // Translated text
  sourceLanguage: string           // Source language code
  targetLanguage: string           // Target language code
  confidence: number               // 0-100
  imageData?: string               // Optional base64 image
}

interface HistoryFilters {
  limit?: number                   // Pagination
  offset?: number                  // Pagination offset
  search?: string                  // Full-text search
  dateFrom?: number                // Start timestamp
  dateTo?: number                  // End timestamp
  sourceLanguage?: string          // Filter by language
  minConfidence?: number           // Min confidence threshold
}

interface HistoryStats {
  totalCount: number
  uniqueLanguages: number
  avgConfidence: number
  mostCommonLanguages: { language: string; count: number }[]
}
```

### Translation (`translation.ts`)

```typescript
interface TranslationResult {
  id: string                       // Unique result ID
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number               // Translation confidence
  timestamp: number
  cached: boolean                  // From cache or API
  ocrConfidence?: number           // OCR confidence (if applicable)
  processingTime?: number          // Milliseconds
  imageData?: string               // Source image
}
```

### OCR (`ocr.ts`)

```typescript
interface OcrOptions {
  language?: string                // Default: from settings
  confidence?: number              // Default: 70
  preprocess?: boolean             // Default: true
}

interface OcrResult {
  text: string                     // Extracted text
  confidence: number               // 0-100
  language: string                 // Detected language
  lines: OcrLine[]                 // Line-by-line results
}

interface OcrLine {
  text: string
  confidence: number
  boundingBox: BoundingBox
}

interface BoundingBox {
  x0: number
  y0: number
  x1: number
  y1: number
}
```

### Capture (`capture.ts`)

```typescript
interface Region {
  x: number
  y: number
  width: number
  height: number
}

interface Display {
  id: string                       // Display ID
  name: string                     // Display name
  width: number                    // Pixel width
  height: number                   // Pixel height
  scaleFactor: number              // DPI scaling
  isPrimary: boolean
  bounds: { x, y, width, height }
}

interface CaptureResult {
  image: Buffer                    // Raw image data
  region: Region                   // Captured region
  displayId: string                // Source display
  timestamp: number
}
```

### IPC (`ipc.ts`)

**Commands (Renderer -> Main):**
- `settings:get` -> `AppSettings`
- `settings:save` -> `void`
- `settings:reset` -> `void`
- `capture:start` -> `void`
- `capture:cancel` -> `void`
- `translation:translate` -> `TranslationResult`
- `overlay:show` -> `void`
- `overlay:hide` -> `void`
- `overlay:update-position` -> `void`
- `history:get` -> `TranslationEntry[]`
- `history:delete` -> `void`
- `history:clear` -> `void`
- `history:export` -> `string` (filepath)

**Events (Main -> Renderer):**
- `settings:updated` -> `AppSettings`
- `ocr:progress` -> `{ status, progress, message }`
- `translation:result` -> `TranslationResult`
- `overlay:visibility-changed` -> `{ visible }`
- `error` -> `{ type, code, message, details }`

## Constants

### Languages (`constants/languages.ts`)
- Language codes for OCR/translation
- Thai, English, Japanese, Korean, Chinese variants

### Shortcuts (`constants/shortcuts.ts`)
- Default accelerator strings
- Platform-specific adjustments (Cmd vs Ctrl)

## Utilities

### Logger (`utils/logger.ts`)
```typescript
enum LogLevel { DEBUG, INFO, WARN, ERROR }
logger.info(message, meta?)
logger.error(message, error?)
logger.setLevel(LogLevel)
```
