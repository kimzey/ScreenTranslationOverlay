# Screen Translation Overlay - Feature Specification

## Version
- **Version**: 0.1.0
- **Last Updated**: 2025-01-31
- **Status**: Draft

---

## Table of Contents
1. [Overview](#overview)
2. [User Stories](#user-stories)
3. [Functional Requirements](#functional-requirements)
4. [Non-Functional Requirements](#non-functional-requirements)
5. [Feature Specifications](#feature-specifications)
6. [User Interface Design](#user-interface-design)
7. [API Contracts](#api-contracts)

---

## Overview

Screen Translation Overlay is a desktop application that enables Thai users to translate text from their screen in real-time. The app captures selected screen regions, extracts text via OCR, translates to Thai, and displays results as transparent overlays.

**Target Audience**:
- Thai gamers playing foreign language games
- Users navigating non-Thai software interfaces
- Students/researchers viewing foreign content
- Anyone needing quick on-screen translation

**Key Value Propositions**:
- ⚡ Fast: 2-3 second end-to-end translation
- 🎯 Accurate: 90%+ OCR accuracy on clear text
- 🖱️ Convenient: Single keyboard shortcut to capture
- 💪 Lightweight: Minimal system resource usage
- 🎨 Customizable: Adjustable overlay appearance

---

## User Stories

### Primary User Stories

#### US-1: Quick Screen Translation
**As a** Thai gamer
**I want to** press a keyboard shortcut and select text on my screen
**So that** I can quickly understand game mechanics and dialogue

**Acceptance Criteria**:
- Single global shortcut triggers screen selection
- Visual feedback shows selection area
- Translation appears within 3 seconds
- Overlay doesn't interfere with game controls

#### US-2: Translation History
**As a** researcher
**I want to** access previously translated text
**So that** I can review and reuse translations without recapturing

**Acceptance Criteria**:
- History persists across app restarts
- Searchable by source or translated text
- Can copy text to clipboard
- Can export history to file

#### US-3: Customizable Display
**As a** user with visual preferences
**I want to** adjust the overlay appearance
**So that** I can read translations comfortably

**Acceptance Criteria**:
- Can change font size (12-32px)
- Can adjust transparency (0-100%)
- Can change text/background colors
- Can set overlay position (cursor, center, custom)

#### US-4: Multi-Language Support
**As a** polyglot user
**I want to** translate from multiple source languages
**So that** I can understand content from various sources

**Acceptance Criteria**:
- Auto-detect source language
- Manual selection available (English, Japanese, Korean, Chinese)
- Target language locked to Thai

---

## Functional Requirements

### FR-1: Screen Capture
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Trigger screen selection via global shortcut | P0 |
| FR-1.2 | Display transparent overlay for area selection | P0 |
| FR-1.3 | Capture selected screen region as image | P0 |
| FR-1.4 | Support multi-display setups | P0 |
| FR-1.5 | Cancel capture operation | P1 |

### FR-2: OCR (Optical Character Recognition)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Extract text from captured image | P0 |
| FR-2.2 | Support multiple source languages | P0 |
| FR-2.3 | Auto-detect source language | P1 |
| FR-2.4 | Provide OCR progress feedback | P1 |
| FR-2.5 | Filter low-confidence results (<60%) | P2 |

### FR-3: Translation
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Translate extracted text to Thai | P0 |
| FR-3.2 | Cache repeated translations | P1 |
| FR-3.3 | Handle translation API failures gracefully | P0 |
| FR-3.4 | Support custom translation endpoints | P2 |

### FR-4: Overlay Display
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Display translation in always-on-top window | P0 |
| FR-4.2 | Support transparent overlay background | P0 |
| FR-4.3 | Allow overlay repositioning | P1 |
| FR-4.4 | Support multiple overlay windows | P2 |
| FR-4.5 | Click-through mode option | P1 |

### FR-5: Settings & Configuration
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Configure keyboard shortcuts | P0 |
| FR-5.2 | Customize overlay appearance | P0 |
| FR-5.3 | Set source language preference | P0 |
| FR-5.4 | Toggle auto-start on boot | P1 |
| FR-5.5 | Import/export settings | P2 |

### FR-6: History Management
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Save all translations to database | P0 |
| FR-6.2 | Search history by keywords | P1 |
| FR-6.3 | Delete individual entries | P1 |
| FR-6.4 | Clear entire history | P1 |
| FR-6.5 | Export history to CSV/JSON | P2 |

---

## Non-Functional Requirements

### Performance Requirements
| ID | Requirement | Target | Measurement |
|----|-------------|--------|-------------|
| NFR-P1 | End-to-end translation latency | <3 seconds | Time from shortcut to overlay display |
| NFR-P2 | OCR processing time | <2 seconds | Time from capture to text extraction |
| NFR-P3 | API response time | <1 second | Time from text to translation |
| NFR-P4 | Idle memory usage | <200MB | Average RAM usage when idle |
| NFR-P5 | Idle CPU usage | <5% | Average CPU usage when idle |
| NFR-P6 | App startup time | <2 seconds | Time from launch to ready state |
| NFR-P7 | First OCR initialization | <5 seconds | Tesseract worker pool startup |

### Quality Requirements
| ID | Requirement | Target | Measurement |
|----|-------------|--------|-------------|
| NFR-Q1 | OCR accuracy (clear text) | >90% | Character-level accuracy |
| NFR-Q2 | Translation accuracy | >85% | User satisfaction rating |
| NFR-Q3 | Crash rate | <0.1% | Crashes per 1000 sessions |
| NFR-Q4 | Data loss | 0% | Settings/history persistence |

### Compatibility Requirements
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-C1 | Windows support | Windows 10/11 (x64) |
| NFR-C2 | macOS support | macOS 11+ (Intel & Apple Silicon) |
| NFR-C3 | Linux support | Ubuntu 20.04+, Debian 11+ |
| NFR-C4 | Screen resolution | 1920x1080 minimum |

### Security Requirements
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-S1 | No sensitive data logging | No API keys in logs |
| NFR-S2 | Secure IPC communication | Context bridge only |
| NFR-S3 | Local data encryption | Optional (user setting) |
| NFR-S4 | No telemetry by default | Opt-in only |

---

## Feature Specifications

### Feature 1: Screen Capture & Selection

**Description**: User triggers capture, selects screen area, app captures region

**Workflow**:
1. User presses global shortcut (default: `Cmd/Ctrl+Shift+X`)
2. Screen dims, crosshair cursor appears
3. User drags to select rectangular region
4. Selection is highlighted with border
5. User releases mouse to confirm or presses `Esc` to cancel
6. Selected region is captured as image

**Technical Details**:
- Uses Electron `desktopCapturer` API
- Creates transparent fullscreen window for selection
- Supports DPI scaling (Retina displays)
- Handles multi-monitor scenarios

**Error Handling**:
- Permission denied → Show permission request dialog
- Screen capture fails → Retry with fallback method
- User cancels → Clean up windows, return to idle

---

### Feature 2: OCR Text Extraction

**Description**: Extract text from captured image using Tesseract.js

**Workflow**:
1. Receive image buffer from capture service
2. Preprocess image (grayscale, contrast enhancement)
3. Initialize Tesseract worker (if not already running)
4. Detect text regions and language
5. Extract text with confidence scores
6. Filter results below confidence threshold
7. Return extracted text

**Technical Details**:
- Worker pool (2-4 workers) for parallel processing
- Language data: English, Japanese, Korean, Chinese, Thai
- Image preprocessing: resize, grayscale, thresholding
- Progress reporting via IPC

**Performance Optimization**:
- Lazy-load language data on demand
- Cache frequently used language workers
- Downscale large images (>2000px) before OCR

---

### Feature 3: Translation Service

**Description**: Translate extracted text to Thai using Google Translate API

**Workflow**:
1. Receive text from OCR service
2. Check cache for existing translation
3. If not cached, call translation API
4. Parse response and extract translated text
5. Cache result (hash-based key)
6. Return translation to main process

**Technical Details**:
- API: Google Translate (unofficial endpoint)
- Caching: In-memory LRU cache (1000 entries)
- Retry logic: 3 attempts with exponential backoff
- Fallback: Alternative translation services (user-configurable)

**Error Handling**:
- API rate limit → Queue request, retry after delay
- Network error → Show offline notification, cache for retry
- Empty text → Skip translation, show error

---

### Feature 4: Overlay Display

**Description**: Show translation as floating overlay on screen

**Workflow**:
1. Receive translation result
2. Create/position overlay window
3. Render translated text with styling
4. Set window properties (always-on-top, transparent)
5. Register hide shortcut (default: `Cmd/Ctrl+Shift+H`)
6. Auto-hide after N seconds (configurable, default: 30s)

**Technical Details**:
- Frameless window with `-webkit-app-region: drag`
- Background color with alpha channel
- Position: near cursor, screen center, or last position
- Maximum width: 600px, auto height
- Text wrapping with Thai line breaking

**Customization Options**:
- Font size: 12-32px
- Opacity: 0-100%
- Background color: Hex picker
- Text color: Hex picker
- Font family: System fonts + bundled Thai fonts

---

### Feature 5: Settings UI

**Description**: Configuration interface for all app settings

**Workflow**:
1. User opens settings (tray icon or shortcut)
2. Settings window appears with tabbed interface
3. User modifies settings
4. Changes apply immediately (hot-reload)
5. Settings persist to electron-store

**Tabs**:
- **General**: Language, startup, theme
- **Shortcuts**: Record and customize keyboard shortcuts
- **Overlay**: Appearance customization
- **History**: View, search, manage history
- **About**: App info, version, licenses

**Technical Details**:
- React components with Tailwind CSS
- Real-time validation
- Undo/Reset functionality
- Import/Export settings (JSON file)

---

### Feature 6: Translation History

**Description**: Persistent database of all translations

**Workflow**:
1. Every translation saved to SQLite database
2. User opens history window
3. List displays translations (newest first)
4. Search filters by source/translated text
5. User can copy, delete, or export entries

**Database Schema**:
```sql
CREATE TABLE translations (
  id TEXT PRIMARY KEY,
  timestamp INTEGER NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  confidence REAL,
  image_url TEXT
);

CREATE INDEX idx_timestamp ON translations(timestamp);
CREATE INDEX idx_source_text ON translations(source_text);
```

**Search Functionality**:
- Full-text search on source and translated text
- Date range filtering
- Language filtering

---

## User Interface Design

### Main Windows

#### 1. Settings Window
- Size: 800x600px
- Resizable: Yes
- Frame: Standard window frame
- Theme: Light/Dark (system preference)

#### 2. Overlay Window
- Size: Dynamic (max 600px width)
- Position: Cursor/Center/Custom
- Frame: Frameless
- Always-on-top: Yes
- Background: Transparent

#### 3. History Window
- Size: 900x700px
- Resizable: Yes
- Frame: Standard window frame
- Search bar: Always visible

#### 4. Screen Selector
- Size: Fullscreen (per monitor)
- Frame: Frameless
- Background: Semi-transparent black overlay

### System Tray Menu
```
🔍 Translate Screen (Ctrl+Shift+X)
─────────────────────────────
📜 History (Ctrl+Shift+H)
⚙️ Settings
─────────────────────────────
✓ Auto-start on boot
─────────────────────────────
About
Quit
```

### Keyboard Shortcuts (Default)
| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Capture screen | `Ctrl+Shift+X` | `Cmd+Shift+X` |
| Hide overlay | `Ctrl+Shift+H` | `Cmd+Shift+H` |
| Show history | `Ctrl+Shift+H` | `Cmd+Shift+H` |
| Show settings | `Ctrl+Shift+S` | `Cmd+Shift+S` |
| Quit app | `Ctrl+Shift+Q` | `Cmd+Shift+Q` |

---

## API Contracts

### IPC Channels

#### Main → Renderer
```typescript
// Settings update
'settings:update': AppSettings

// Translation result
'translation:result': {
  id: string
  sourceText: string
  translatedText: string
  sourceLanguage: string
  timestamp: number
}

// OCR progress
'ocr:progress': {
  status: 'initializing' | 'recognizing' | 'complete'
  progress: number // 0-100
}

// Error notification
'error': {
  type: 'ocr' | 'translation' | 'capture'
  message: string
}
```

#### Renderer → Main
```typescript
// Get current settings
'settings:get': () => AppSettings

// Save settings
'settings:save': (settings: Partial<AppSettings>) => void

// Start capture
'capture:start': () => void

// Cancel capture
'capture:cancel': () => void

// Show overlay
'overlay:show': (result: TranslationResult) => void

// Hide overlay
'overlay:hide': () => void

// Get history
'history:get': (filters?: HistoryFilters) => TranslationHistory[]

// Clear history
'history:clear': () => void

// Delete history entry
'history:delete': (id: string) => void

// Export history
'history:export': (format: 'json' | 'csv') => string
```

### Data Models

```typescript
interface AppSettings {
  general: {
    sourceLanguage: string
    autoStart: boolean
    theme: 'light' | 'dark' | 'system'
  }
  shortcuts: {
    capture: string
    hideOverlay: string
    showHistory: string
    showSettings: string
  }
  overlay: {
    opacity: number
    fontSize: number
    fontFamily: string
    backgroundColor: string
    textColor: string
    position: 'cursor' | 'center' | 'custom'
    autoHideDelay: number
  }
  ocr: {
    confidence: number
    language: string
  }
  translation: {
    provider: string
    apiEndpoint?: string
  }
}

interface TranslationResult {
  id: string
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  timestamp: number
}

interface TranslationHistory {
  id: string
  timestamp: number
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  imageData?: string
}
```

---

## Appendix

### Language Codes
| Language | Code | Tesseract Data |
|----------|------|----------------|
| Auto-detect | auto | - |
| English | en | eng.traineddata |
| Japanese | ja | jpn.traineddata |
| Korean | ko | kor.traineddata |
| Chinese (Simplified) | zh-CN | chi_sim.traineddata |
| Chinese (Traditional) | zh-TW | chi_tra.traineddata |
| Thai | th | tha.traineddata |

### External Dependencies
- **Tesseract.js**: OCR engine
- **Google Translate API**: Translation service
- **Electron**: Desktop framework
- **better-sqlite3**: Database
- **electron-store**: Settings persistence

### Future Enhancements
- [ ] DeepL translation integration
- [ ] Cloud OCR fallback (OCR.space, Google Vision)
- [ ] Multiple target languages
- [ ] Voice output (text-to-speech)
- [ ] Mobile companion app
- [ ] Browser extension
- [ ] Plugin system for custom translators
