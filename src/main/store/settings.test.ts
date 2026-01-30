/**
 * SettingsStore Tests
 *
 * Test suite for persistent settings management using TDD approach.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { SettingsStore, getSettingsStore } from './settings'
import type { AppSettings } from '@shared/types/settings'
import { defaultSettings } from '@shared/types/settings'

// Mock logger
vi.mock('@shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

describe('SettingsStore', () => {
  let settingsStore: SettingsStore

  beforeEach(() => {
    // Reset singleton instance
    vi.resetModules()
    settingsStore = new SettingsStore()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with default settings', () => {
      const allSettings = settingsStore.getAll()

      expect(allSettings).toEqual(defaultSettings)
    })

    it('should have a path property', () => {
      expect(settingsStore.path).toBeDefined()
      expect(typeof settingsStore.path).toBe('string')
    })
  })

  describe('get', () => {
    it('should return general settings', () => {
      const general = settingsStore.get('general')

      expect(general).toEqual(defaultSettings.general)
    })

    it('should return shortcuts settings', () => {
      const shortcuts = settingsStore.get('shortcuts')

      expect(shortcuts).toEqual(defaultSettings.shortcuts)
    })

    it('should return overlay settings', () => {
      const overlay = settingsStore.get('overlay')

      expect(overlay).toEqual(defaultSettings.overlay)
    })

    it('should return ocr settings', () => {
      const ocr = settingsStore.get('ocr')

      expect(ocr).toEqual(defaultSettings.ocr)
    })

    it('should return translation settings', () => {
      const translation = settingsStore.get('translation')

      expect(translation).toEqual(defaultSettings.translation)
    })
  })

  describe('getIn', () => {
    it('should return nested setting value', () => {
      const sourceLanguage = settingsStore.getIn('general', 'sourceLanguage')

      expect(sourceLanguage).toBe('auto')
    })

    it('should return boolean setting', () => {
      const autoStart = settingsStore.getIn('general', 'autoStart')

      expect(autoStart).toBe(false)
    })

    it('should return theme setting', () => {
      const theme = settingsStore.getIn('general', 'theme')

      expect(theme).toBe('dark')
    })

    it('should return language setting', () => {
      const language = settingsStore.getIn('general', 'language')

      expect(language).toBe('th')
    })

    it('should return capture shortcut', () => {
      const capture = settingsStore.getIn('shortcuts', 'capture')

      expect(capture).toBe('CommandOrControl+Shift+X')
    })

    it('should return undefined for invalid nested key', () => {
      const invalid = settingsStore.getIn('general', 'invalidKey' as never)

      expect(invalid).toBeUndefined()
    })
  })

  describe('set', () => {
    it('should update a setting value', () => {
      const newValue: AppSettings['general'] = {
        sourceLanguage: 'en',
        autoStart: true,
        theme: 'light',
        language: 'en'
      }

      settingsStore.set('general', newValue)

      const result = settingsStore.get('general')
      expect(result).toEqual(newValue)
    })

    it('should notify listeners when setting changes', () => {
      const callback = vi.fn()
      settingsStore.onChange('general', callback)

      const newValue: AppSettings['general'] = {
        sourceLanguage: 'en',
        autoStart: true,
        theme: 'light',
        language: 'en'
      }
      settingsStore.set('general', newValue)

      expect(callback).toHaveBeenCalledWith(newValue, defaultSettings.general)
    })

    it('should update overlay settings', () => {
      const newValue: AppSettings['overlay'] = {
        ...defaultSettings.overlay,
        opacity: 100,
        fontSize: 20
      }

      settingsStore.set('overlay', newValue)

      const result = settingsStore.get('overlay')
      expect(result.opacity).toBe(100)
      expect(result.fontSize).toBe(20)
    })

    it('should update shortcuts settings', () => {
      const newValue: AppSettings['shortcuts'] = {
        ...defaultSettings.shortcuts,
        capture: 'CommandOrControl+Shift+A'
      }

      settingsStore.set('shortcuts', newValue)

      const result = settingsStore.get('shortcuts')
      expect(result.capture).toBe('CommandOrControl+Shift+A')
    })
  })

  describe('setIn', () => {
    it('should update nested setting value', () => {
      settingsStore.setIn('general', 'sourceLanguage', 'th')

      const result = settingsStore.getIn('general', 'sourceLanguage')
      expect(result).toBe('th')
    })

    it('should update autoStart setting', () => {
      settingsStore.setIn('general', 'autoStart', true)

      const result = settingsStore.getIn('general', 'autoStart')
      expect(result).toBe(true)
    })

    it('should update theme setting', () => {
      settingsStore.setIn('general', 'theme', 'light')

      const result = settingsStore.getIn('general', 'theme')
      expect(result).toBe('light')
    })

    it('should update language setting', () => {
      settingsStore.setIn('general', 'language', 'en')

      const result = settingsStore.getIn('general', 'language')
      expect(result).toBe('en')
    })

    it('should update capture shortcut', () => {
      settingsStore.setIn('shortcuts', 'capture', 'CommandOrControl+Shift+A')

      const result = settingsStore.getIn('shortcuts', 'capture')
      expect(result).toBe('CommandOrControl+Shift+A')
    })

    it('should update overlay opacity', () => {
      settingsStore.setIn('overlay', 'opacity', 100)

      const result = settingsStore.getIn('overlay', 'opacity')
      expect(result).toBe(100)
    })

    it('should update overlay fontSize', () => {
      settingsStore.setIn('overlay', 'fontSize', 20)

      const result = settingsStore.getIn('overlay', 'fontSize')
      expect(result).toBe(20)
    })

    it('should notify listeners when nested setting changes', () => {
      const callback = vi.fn()
      settingsStore.onChange('overlay', callback)

      settingsStore.setIn('overlay', 'opacity', 100)

      expect(callback).toHaveBeenCalled()
    })
  })

  describe('setMany', () => {
    it('should set multiple settings at once', () => {
      const updates: Partial<AppSettings> = {
        general: {
          sourceLanguage: 'en',
          autoStart: true,
          theme: 'light',
          language: 'en'
        },
        overlay: {
          ...defaultSettings.overlay,
          opacity: 100
        }
      }

      settingsStore.setMany(updates)

      expect(settingsStore.getIn('general', 'sourceLanguage')).toBe('en')
      expect(settingsStore.getIn('general', 'autoStart')).toBe(true)
      expect(settingsStore.getIn('overlay', 'opacity')).toBe(100)
    })

    it('should notify all relevant listeners', () => {
      const generalCallback = vi.fn()
      const overlayCallback = vi.fn()

      settingsStore.onChange('general', generalCallback)
      settingsStore.onChange('overlay', overlayCallback)

      const updates: Partial<AppSettings> = {
        general: {
          sourceLanguage: 'en',
          autoStart: true,
          theme: 'light',
          language: 'en'
        },
        overlay: {
          ...defaultSettings.overlay,
          opacity: 100
        }
      }

      settingsStore.setMany(updates)

      expect(generalCallback).toHaveBeenCalled()
      expect(overlayCallback).toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('should clear all settings', () => {
      // First modify some settings
      settingsStore.setIn('general', 'sourceLanguage', 'en')
      settingsStore.setIn('overlay', 'opacity', 100)

      // Reset should call clear on the store
      expect(() => settingsStore.reset()).not.toThrow()
    })
  })

  describe('onChange', () => {
    it('should register change listener', () => {
      const callback = vi.fn()
      const unsubscribe = settingsStore.onChange('general', callback)

      settingsStore.setIn('general', 'sourceLanguage', 'en')

      expect(callback).toHaveBeenCalled()

      unsubscribe()
    })

    it('should return unsubscribe function', () => {
      const callback = vi.fn()
      const unsubscribe = settingsStore.onChange('general', callback)

      expect(typeof unsubscribe).toBe('function')

      unsubscribe()

      settingsStore.setIn('general', 'sourceLanguage', 'en')

      // Callback should not be called after unsubscribe
      expect(callback).not.toHaveBeenCalled()
    })

    it('should support multiple listeners for same key', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      settingsStore.onChange('general', callback1)
      settingsStore.onChange('general', callback2)

      settingsStore.setIn('general', 'sourceLanguage', 'en')

      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
    })

    it('should call listener with old and new values', () => {
      const callback = vi.fn()
      const oldValue = settingsStore.get('general')

      settingsStore.onChange('general', callback)

      const newValue: AppSettings['general'] = {
        sourceLanguage: 'en',
        autoStart: true,
        theme: 'light',
        language: 'en'
      }
      settingsStore.set('general', newValue)

      expect(callback).toHaveBeenCalledWith(newValue, oldValue)
    })

    it('should handle errors in listeners gracefully', () => {
      const errorCallback = vi.fn(() => {
        throw new Error('Listener error')
      })
      const normalCallback = vi.fn()

      settingsStore.onChange('general', errorCallback)
      settingsStore.onChange('general', normalCallback)

      // Should not throw
      expect(() => {
        settingsStore.setIn('general', 'sourceLanguage', 'en')
      }).not.toThrow()

      // Normal callback should still be called
      expect(normalCallback).toHaveBeenCalled()
    })
  })

  describe('getAll', () => {
    it('should return all settings', () => {
      const allSettings = settingsStore.getAll()

      expect(allSettings).toHaveProperty('general')
      expect(allSettings).toHaveProperty('shortcuts')
      expect(allSettings).toHaveProperty('overlay')
      expect(allSettings).toHaveProperty('ocr')
      expect(allSettings).toHaveProperty('translation')
    })

    it('should reflect current values', () => {
      settingsStore.setIn('general', 'sourceLanguage', 'en')

      const allSettings = settingsStore.getAll()

      expect(allSettings.general.sourceLanguage).toBe('en')
    })
  })
})

describe('getSettingsStore (Singleton)', () => {
  it('should return same instance on multiple calls', () => {
    const instance1 = getSettingsStore()
    const instance2 = getSettingsStore()

    expect(instance1).toBe(instance2)
  })

  it('should return a SettingsStore instance', () => {
    const instance = getSettingsStore()

    expect(instance).toBeInstanceOf(SettingsStore)
  })
})
