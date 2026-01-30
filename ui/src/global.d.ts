/**
 * Global type declarations for renderer process
 */

import type { AppSettings } from '@shared/types/settings'
import type { TranslationResult } from '@shared/types/translation'
import type { TranslationEntry, HistoryFilters } from '@shared/types/history'

declare global {
  interface Window {
    electron: {
      // Settings
      settings: {
        get: () => Promise<AppSettings>
        save: (settings: Partial<AppSettings>) => Promise<void>
        reset: () => Promise<void>
        onUpdated: (callback: (settings: AppSettings) => void) => () => void
      }

      // Capture
      capture: {
        start: () => Promise<void>
        cancel: () => Promise<void>
      }

      // Translation
      translation: {
        translate: (options: {
          text: string
          sourceLanguage?: string
          targetLanguage?: string
        }) => Promise<TranslationResult>
        onResult: (callback: (result: TranslationResult) => void) => () => void
      }

      // Overlay
      overlay: {
        show: (result: TranslationResult) => Promise<void>
        hide: () => Promise<void>
        updatePosition: (position: { x: number; y: number }) => Promise<void>
        onVisibilityChanged: (callback: (visible: boolean) => void) => () => void
      }

      // History
      history: {
        get: (filters?: HistoryFilters) => Promise<TranslationEntry[]>
        delete: (id: string) => Promise<void>
        clear: () => Promise<void>
        export: (options: { format: 'json' | 'csv' }) => Promise<string>
      }

      // OCR Progress
      onOcrProgress: (
        callback: (data: {
          status: 'initializing' | 'recognizing' | 'complete'
          progress: number
          message: string
        }) => void
      ) => () => void

      // Errors
      onError: (
        callback: (error: {
          type: string
          code: string
          message: string
          details?: unknown
        }) => void
      ) => () => void
    }
  }
}

export {}
