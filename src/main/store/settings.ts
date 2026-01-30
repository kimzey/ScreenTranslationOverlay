/**
 * Settings Store - Persistent Settings Management
 *
 * Uses electron-store for type-safe settings persistence
 */

import Store from 'electron-store'
import type { AppSettings } from '@shared/types/settings'
import { defaultSettings } from '@shared/types/settings'
import { logger } from '@shared/utils/logger'
import { app } from 'electron'

export class SettingsStore {
  private store: Store<AppSettings>
  // Change listeners receive both newValue and oldValue (custom implementation, not electron-store's)
  private changeListeners: Map<keyof AppSettings, Set<(newValue: any, oldValue: any) => void>> = new Map()

  constructor() {
    // Define schema as mutable to satisfy electron-store's JSONSchema type
    const schema = {
      general: {
        type: 'object',
        properties: {
          sourceLanguage: { type: 'string' },
          autoStart: { type: 'boolean' },
          theme: { type: 'string', enum: ['light', 'dark', 'system'] as string[] },
          language: { type: 'string', enum: ['th', 'en'] as string[] }
        }
      },
      shortcuts: {
        type: 'object',
        properties: {
          capture: { type: 'string' },
          hideOverlay: { type: 'string' },
          showHistory: { type: 'string' },
          showSettings: { type: 'string' },
          quit: { type: 'string' }
        }
      },
      overlay: {
        type: 'object',
        properties: {
          opacity: { type: 'number' },
          fontSize: { type: 'number' },
          fontFamily: { type: 'string' },
          backgroundColor: { type: 'string' },
          textColor: { type: 'string' },
          position: { type: 'string', enum: ['cursor', 'center', 'custom'] as string[] },
          customPosition: { type: 'object' },
          autoHideDelay: { type: 'number' },
          clickThrough: { type: 'boolean' },
          maxWidth: { type: 'number' }
        }
      },
      ocr: {
        type: 'object',
        properties: {
          engine: { type: 'string', enum: ['tesseract'] as string[] },
          confidence: { type: 'number' },
          language: { type: 'string' },
          preprocess: { type: 'boolean' },
          workerCount: { type: 'number' }
        }
      },
      translation: {
        type: 'object',
        properties: {
          provider: { type: 'string', enum: ['google'] as string[] },
          apiEndpoint: { type: 'string' },
          cacheEnabled: { type: 'boolean' },
          cacheSize: { type: 'number' },
          cacheTtl: { type: 'number' }
        }
      }
    }

    this.store = new Store<AppSettings>({
      name: 'settings',
      schema: schema as any,
      defaults: defaultSettings
    })

    logger.info('Settings store initialized', { path: this.store.path })
  }

  /**
   * Get a specific setting value
   */
  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.store.get(key)
  }

  /**
   * Get nested setting value
   */
  getIn<K extends keyof AppSettings, NK extends keyof AppSettings[K]>(
    key: K,
    nestedKey: NK
  ): AppSettings[K][NK] {
    const value = this.store.get(key)
    return value?.[nestedKey]
  }

  /**
   * Get all settings
   */
  getAll(): AppSettings {
    return this.store.store
  }

  /**
   * Set a specific setting value
   */
  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    const oldValue = this.store.get(key)
    this.store.set(key, value)
    this.notifyChange(key, value, oldValue)
    logger.info(`Setting updated: ${key}`, { oldValue, newValue: value })
  }

  /**
   * Set multiple settings at once
   */
  setMany(settings: Partial<AppSettings>): void {
    for (const [key, value] of Object.entries(settings) as [keyof AppSettings, AppSettings[keyof AppSettings]][]) {
      this.set(key, value)
    }
  }

  /**
   * Set nested setting value
   */
  setIn<K extends keyof AppSettings, NK extends keyof AppSettings[K]>(
    key: K,
    nestedKey: NK,
    value: AppSettings[K][NK]
  ): void {
    const current = this.store.get(key)
    const oldValue = current?.[nestedKey]
    const updated = { ...current, [nestedKey]: value }
    this.store.set(key, updated)
    this.notifyChange(key, updated, current)
    logger.info(`Nested setting updated: ${key}.${nestedKey as string}`, { oldValue, newValue: value })
  }

  /**
   * Reset all settings to defaults
   */
  reset(): void {
    this.store.clear()
    logger.info('Settings reset to defaults')
  }

  /**
   * Watch for setting changes
   */
  onChange<K extends keyof AppSettings>(
    key: K,
    callback: (newValue: AppSettings[K], oldValue: AppSettings[K]) => void
  ): () => void {
    if (!this.changeListeners.has(key)) {
      this.changeListeners.set(key, new Set())
    }
    this.changeListeners.get(key)!.add(callback as (newValue: any, oldValue: any) => void)

    // Return unsubscribe function
    return () => {
      const listeners = this.changeListeners.get(key)
      if (listeners) {
        listeners.delete(callback as (newValue: any, oldValue: any) => void)
        if (listeners.size === 0) {
          this.changeListeners.delete(key)
        }
      }
    }
  }

  /**
   * Notify listeners of setting change
   */
  private notifyChange<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
    oldValue: AppSettings[K]
  ): void {
    const listeners = this.changeListeners.get(key)
    if (listeners) {
      for (const callback of listeners) {
        try {
          callback(value, oldValue)
        } catch (error) {
          logger.error(`Error in settings change listener for ${key}`, error)
        }
      }
    }
  }

  /**
   * Get store path (for debugging)
   */
  get path(): string {
    return this.store.path
  }
}

// Singleton instance
let settingsStoreInstance: SettingsStore | null = null

export function getSettingsStore(): SettingsStore {
  if (!settingsStoreInstance) {
    settingsStoreInstance = new SettingsStore()
  }
  return settingsStoreInstance
}
