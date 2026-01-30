/**
 * Preload Script - Context Bridge
 *
 * Exposes safe APIs to renderer process via context bridge
 */

import { contextBridge, ipcRenderer } from 'electron'
import type { IpcChannels, IpcEvents } from '@shared/types/ipc'
import type { AppSettings } from '@shared/types/settings'
import type { TranslationResult } from '@shared/types/translation'
import type { TranslationEntry, HistoryFilters } from '@shared/types/history'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI = {
  // Settings
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
    save: (settings: Partial<AppSettings>): Promise<void> =>
      ipcRenderer.invoke('settings:save', settings),
    reset: (): Promise<void> => ipcRenderer.invoke('settings:reset'),
    onUpdated: (callback: (settings: AppSettings) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, settings: AppSettings) =>
        callback(settings)
      ipcRenderer.on('settings:updated', listener)
      return () => ipcRenderer.removeListener('settings:updated', listener)
    }
  },

  // Capture
  capture: {
    start: (): Promise<void> => ipcRenderer.invoke('capture:start'),
    cancel: (): Promise<void> => ipcRenderer.invoke('capture:cancel')
  },

  // Translation
  translation: {
    translate: (options: {
      text: string
      sourceLanguage?: string
      targetLanguage?: string
    }): Promise<TranslationResult> => ipcRenderer.invoke('translation:translate', options),
    onResult: (callback: (result: TranslationResult) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, result: TranslationResult) =>
        callback(result)
      ipcRenderer.on('translation:result', listener)
      return () => ipcRenderer.removeListener('translation:result', listener)
    }
  },

  // Overlay
  overlay: {
    show: (result: TranslationResult): Promise<void> =>
      ipcRenderer.invoke('overlay:show', result),
    hide: (): Promise<void> => ipcRenderer.invoke('overlay:hide'),
    updatePosition: (position: { x: number; y: number }): Promise<void> =>
      ipcRenderer.invoke('overlay:update-position', position),
    onVisibilityChanged: (callback: (visible: boolean) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, data: { visible: boolean }) =>
        callback(data.visible)
      ipcRenderer.on('overlay:visibility-changed', listener)
      return () => ipcRenderer.removeListener('overlay:visibility-changed', listener)
    }
  },

  // History
  history: {
    get: (filters?: HistoryFilters): Promise<TranslationEntry[]> =>
      ipcRenderer.invoke('history:get', filters),
    delete: (id: string): Promise<void> => ipcRenderer.invoke('history:delete', id),
    clear: (): Promise<void> => ipcRenderer.invoke('history:clear'),
    export: (options: { format: 'json' | 'csv' }): Promise<string> =>
      ipcRenderer.invoke('history:export', options)
  },

  // OCR Progress
  onOcrProgress: (
    callback: (data: { status: 'initializing' | 'recognizing' | 'complete'; progress: number; message: string }) => void
  ) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      data: { status: 'initializing' | 'recognizing' | 'complete'; progress: number; message: string }
    ) => callback(data)
    ipcRenderer.on('ocr:progress', listener)
    return () => ipcRenderer.removeListener('ocr:progress', listener)
  },

  // Errors
  onError: (
    callback: (error: { type: string; code: string; message: string; details?: any }) => void
  ) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      error: { type: string; code: string; message: string; details?: any }
    ) => callback(error)
    ipcRenderer.on('error', listener)
    return () => ipcRenderer.removeListener('error', listener)
  }
} as const

contextBridge.exposeInMainWorld('electron', electronAPI)

// Type declaration for renderer process
export type ElectronAPI = typeof electronAPI

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
