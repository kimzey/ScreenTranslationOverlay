/**
 * Application Settings Types
 */

export interface GeneralSettings {
  sourceLanguage: string
  autoStart: boolean
  theme: 'light' | 'dark' | 'system'
  language: 'th' | 'en'
}

export interface ShortcutSettings {
  capture: string
  hideOverlay: string
  showHistory: string
  showSettings: string
  quit: string
}

export interface OverlaySettings {
  opacity: number
  fontSize: number
  fontFamily: string
  backgroundColor: string
  textColor: string
  position: 'cursor' | 'center' | 'custom'
  customPosition?: { x: number; y: number }
  autoHideDelay: number
  clickThrough: boolean
  maxWidth: number
}

export interface OcrSettings {
  engine: 'tesseract'
  confidence: number
  language: string
  preprocess: boolean
  workerCount: number
}

export interface TranslationSettings {
  provider: 'google'
  apiEndpoint?: string
  cacheEnabled: boolean
  cacheSize: number
  cacheTtl: number
}

export interface AppSettings {
  general: GeneralSettings
  shortcuts: ShortcutSettings
  overlay: OverlaySettings
  ocr: OcrSettings
  translation: TranslationSettings
}

export const defaultSettings: AppSettings = {
  general: {
    sourceLanguage: 'auto',
    autoStart: false,
    theme: 'dark',
    language: 'th'
  },
  shortcuts: {
    capture: 'CommandOrControl+Shift+X',
    hideOverlay: 'CommandOrControl+Shift+H',
    showHistory: 'CommandOrControl+Shift+Y',
    showSettings: 'CommandOrControl+Shift+S',
    quit: 'CommandOrControl+Shift+Q'
  },
  overlay: {
    opacity: 90,
    fontSize: 16,
    fontFamily: 'Sarabun',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    position: 'cursor',
    autoHideDelay: 30000,
    clickThrough: false,
    maxWidth: 600
  },
  ocr: {
    engine: 'tesseract',
    confidence: 70,
    language: 'auto',
    preprocess: true,
    workerCount: 2
  },
  translation: {
    provider: 'google',
    cacheEnabled: true,
    cacheSize: 1000,
    cacheTtl: 604800 // 7 days in seconds
  }
}
