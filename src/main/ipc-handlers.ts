/**
 * IPC Handlers
 *
 * Registers all IPC handlers for communication between main and renderer processes
 */

import { ipcMain, BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'
import { getSettingsStore } from './store/settings'
import { getHistoryDatabase } from './store/database'
import { getWindowManager } from './windows/manager'
import { CaptureService } from './services/capture'
import { logger } from '@shared/utils/logger'
import type { AppSettings } from '@shared/types/settings'
import type { TranslationResult } from '@shared/types/translation'
import type { HistoryFilters } from '@shared/types/history'

// Active capture state
let activeCapture: { promise: Promise<any>; resolve: (value: any) => void; reject: (reason: any) => void } | null = null

// Active translation state
let isTranslating = false

/**
 * Register all IPC handlers
 */
export function registerIpcHandlers(): void {
  logger.info('Registering IPC handlers')

  // ============== SETTINGS HANDLERS ==============

  ipcMain.handle('settings:get', async () => {
    return getSettingsStore().getAll()
  })

  ipcMain.handle('settings:save', async (_event, settings: Partial<AppSettings>) => {
    const settingsStore = getSettingsStore()
    settingsStore.setMany(settings)

    // Notify all windows of settings update
    const allSettings = settingsStore.getAll()
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) {
        win.webContents.send('settings:updated', allSettings)
      }
    })
  })

  ipcMain.handle('settings:reset', async () => {
    const settingsStore = getSettingsStore()
    settingsStore.reset()

    // Notify all windows of settings update
    const allSettings = settingsStore.getAll()
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) {
        win.webContents.send('settings:updated', allSettings)
      }
    })
  })

  // ============== CAPTURE HANDLERS ==============

  ipcMain.handle('capture:start', async () => {
    if (activeCapture) {
      throw new Error('Capture already in progress')
    }

    const windowManager = getWindowManager()

    return new Promise<void>((resolve, reject) => {
      activeCapture = { promise: Promise.resolve(), resolve, reject }

      try {
        // Show selector window
        const selectorWin = windowManager.getOrCreateSelectorWindow()
        selectorWin.show()
        selectorWin.focus()
      } catch (error) {
        activeCapture = null
        reject(error)
      }
    })
  })

  ipcMain.handle('capture:cancel', async () => {
    if (activeCapture) {
      const { reject } = activeCapture
      activeCapture = null

      // Hide selector window
      const windowManager = getWindowManager()
      const selectorWin = windowManager.getWindow('selector')
      if (selectorWin) {
        selectorWin.hide()
      }

      reject(new Error('Capture cancelled'))
    }

    // Hide any visible selector
    const windowManager = getWindowManager()
    const selectorWin = windowManager.getWindow('selector')
    if (selectorWin) {
      selectorWin.hide()
    }
  })

  // Handle region selection from selector window
  ipcMain.handle('capture:select-region', async (_event, region) => {
    const windowManager = getWindowManager()
    const selectorWin = windowManager.getWindow('selector')

    if (selectorWin) {
      selectorWin.hide()
    }

    if (activeCapture) {
      const { resolve } = activeCapture
      activeCapture = null
      resolve(region)
    }

    // Process the capture
    try {
      const captureService = new CaptureService()

      // Emit OCR progress
      BrowserWindow.getAllWindows().forEach((win) => {
        if (!win.isDestroyed()) {
          win.webContents.send('ocr:progress', {
            status: 'initializing',
            progress: 0,
            message: 'Initializing OCR...'
          })
        }
      })

      const captureResult = await captureService.captureRegion(region)

      // Emit progress update
      BrowserWindow.getAllWindows().forEach((win) => {
        if (!win.isDestroyed()) {
          win.webContents.send('ocr:progress', {
            status: 'recognizing',
            progress: 50,
            message: 'Recognizing text...'
          })
        }
      })

      // TODO: Perform OCR and translation here
      // For now, return a mock result
      const result: TranslationResult = {
        id: randomUUID(),
        sourceText: 'Sample text from screen',
        translatedText: 'Translated text',
        sourceLanguage: 'en',
        targetLanguage: 'th',
        confidence: 0.95,
        timestamp: Date.now(),
        cached: false,
        ocrConfidence: 0.9,
        processingTime: 100
      }

      // Emit completion
      BrowserWindow.getAllWindows().forEach((win) => {
        if (!win.isDestroyed()) {
          win.webContents.send('ocr:progress', {
            status: 'complete',
            progress: 100,
            message: 'Complete'
          })
          win.webContents.send('translation:result', result)
        }
      })

      // Save to history
      const db = getHistoryDatabase()
      db.add({
        id: result.id,
        timestamp: result.timestamp,
        sourceText: result.sourceText,
        translatedText: result.translatedText,
        sourceLanguage: result.sourceLanguage,
        targetLanguage: result.targetLanguage,
        confidence: result.confidence
      })

      // Show overlay
      windowManager.getOrCreateOverlayWindow()
      const overlayWin = windowManager.getWindow('overlay')
      if (overlayWin) {
        overlayWin.webContents.send('overlay:data', result)
        overlayWin.show()

        BrowserWindow.getAllWindows().forEach((win) => {
          if (!win.isDestroyed()) {
            win.webContents.send('overlay:visibility-changed', { visible: true })
          }
        })
      }

      return result
    } catch (error) {
      // Emit error
      BrowserWindow.getAllWindows().forEach((win) => {
        if (!win.isDestroyed()) {
          win.webContents.send('error', {
            type: 'capture',
            code: 'CAPTURE_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })
      throw error
    }
  })

  // ============== TRANSLATION HANDLERS ==============

  ipcMain.handle('translation:translate', async (_event, options) => {
    if (isTranslating) {
      throw new Error('Translation already in progress')
    }

    isTranslating = true

    try {
      // TODO: Implement actual translation service
      // For now, return a mock result
      const settings = getSettingsStore()
      const sourceLanguage = options.sourceLanguage || settings.get('general').sourceLanguage
      const targetLanguage = options.targetLanguage || 'th'

      const result: TranslationResult = {
        id: randomUUID(),
        sourceText: options.text,
        translatedText: `[Translated: ${options.text}]`,
        sourceLanguage,
        targetLanguage,
        confidence: 0.9,
        timestamp: Date.now(),
        cached: false,
        processingTime: 50
      }

      // Emit result event
      BrowserWindow.getAllWindows().forEach((win) => {
        if (!win.isDestroyed()) {
          win.webContents.send('translation:result', result)
        }
      })

      // Save to history
      const db = getHistoryDatabase()
      db.add({
        id: result.id,
        timestamp: result.timestamp,
        sourceText: result.sourceText,
        translatedText: result.translatedText,
        sourceLanguage: result.sourceLanguage,
        targetLanguage: result.targetLanguage,
        confidence: result.confidence
      })

      return result
    } finally {
      isTranslating = false
    }
  })

  // ============== OVERLAY HANDLERS ==============

  ipcMain.handle('overlay:show', async (_event, result: TranslationResult) => {
    const windowManager = getWindowManager()
    const overlayWin = windowManager.getOrCreateOverlayWindow()

    // Send data to overlay
    overlayWin.webContents.send('overlay:data', result)
    overlayWin.show()

    // Emit visibility change
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) {
        win.webContents.send('overlay:visibility-changed', { visible: true })
      }
    })
  })

  ipcMain.handle('overlay:hide', async () => {
    const windowManager = getWindowManager()
    const overlayWin = windowManager.getWindow('overlay')

    if (overlayWin) {
      overlayWin.hide()

      // Emit visibility change
      BrowserWindow.getAllWindows().forEach((win) => {
        if (!win.isDestroyed()) {
          win.webContents.send('overlay:visibility-changed', { visible: false })
        }
      })
    }
  })

  ipcMain.handle('overlay:update-position', async (_event, position: { x: number; y: number }) => {
    const windowManager = getWindowManager()
    const overlayWin = windowManager.getWindow('overlay')

    if (overlayWin) {
      overlayWin.setPosition(position.x, position.y)
    }
  })

  // Handle overlay close request from renderer
  ipcMain.on('overlay:close-request', () => {
    const windowManager = getWindowManager()
    const overlayWin = windowManager.getWindow('overlay')

    if (overlayWin) {
      overlayWin.hide()

      BrowserWindow.getAllWindows().forEach((win) => {
        if (!win.isDestroyed()) {
          win.webContents.send('overlay:visibility-changed', { visible: false })
        }
      })
    }
  })

  // ============== HISTORY HANDLERS ==============

  ipcMain.handle('history:get', async (_event, filters?: HistoryFilters) => {
    const db = getHistoryDatabase()
    return db.getAll(filters)
  })

  ipcMain.handle('history:delete', async (_event, id: string) => {
    const db = getHistoryDatabase()
    db.delete(id)
  })

  ipcMain.handle('history:clear', async () => {
    const db = getHistoryDatabase()
    db.clear()
  })

  ipcMain.handle('history:export', async (_event, options: { format: 'json' | 'csv' }) => {
    const db = getHistoryDatabase()
    return db.export(options.format)
  })

  logger.info('IPC handlers registered successfully')
}

/**
 * Unregister all IPC handlers
 */
export function unregisterIpcHandlers(): void {
  const handlers = [
    'settings:get',
    'settings:save',
    'settings:reset',
    'capture:start',
    'capture:cancel',
    'capture:select-region',
    'translation:translate',
    'overlay:show',
    'overlay:hide',
    'overlay:update-position',
    'history:get',
    'history:delete',
    'history:clear',
    'history:export'
  ]

  handlers.forEach((channel) => {
    ipcMain.removeHandler(channel)
  })

  // Remove listeners
  ipcMain.removeAllListeners('overlay:close-request')

  logger.info('IPC handlers unregistered')
}
