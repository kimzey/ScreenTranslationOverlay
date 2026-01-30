/**
 * IPC Channel Types
 */

// Renderer → Main (Commands)
export interface IpcChannels {
  // Settings
  'settings:get': () => AppSettings
  'settings:save': (settings: Partial<AppSettings>) => void
  'settings:reset': () => void

  // Capture
  'capture:start': () => void
  'capture:cancel': () => void

  // Translation
  'translation:translate': (options: {
    text: string
    sourceLanguage?: string
    targetLanguage?: string
  }) => TranslationResult

  // Overlay
  'overlay:show': (result: TranslationResult) => void
  'overlay:hide': () => void
  'overlay:update-position': (position: { x: number; y: number }) => void

  // History
  'history:get': (filters?: HistoryFilters) => TranslationEntry[]
  'history:delete': (id: string) => void
  'history:clear': () => void
  'history:export': (options: { format: 'json' | 'csv' }) => string
}

// Main → Renderer (Events)
export interface IpcEvents {
  'settings:updated': AppSettings
  'ocr:progress': { status: 'initializing' | 'recognizing' | 'complete'; progress: number; message: string }
  'translation:result': TranslationResult
  'overlay:visibility-changed': { visible: boolean }
  'error': { type: string; code: string; message: string; details?: any }
}

// Re-import types
import type { AppSettings } from './settings'
import type { TranslationEntry, HistoryFilters } from './history'
import type { TranslationResult } from './translation'
