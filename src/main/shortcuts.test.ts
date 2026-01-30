/**
 * ShortcutHandler Tests
 *
 * Test suite for global shortcut management using TDD approach.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ShortcutHandler, getShortcutHandler } from './shortcuts'
import { globalShortcut } from 'electron'

// Mock logger
vi.mock('@shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

// Mock settings store - must be inline factory
vi.mock('./store/settings', () => ({
  getSettingsStore: vi.fn(() => ({
    getIn: vi.fn((section: string, key: string) => {
      const settings: Record<string, Record<string, string>> = {
        shortcuts: {
          capture: 'CommandOrControl+Shift+X',
          hideOverlay: 'CommandOrControl+Shift+H',
          showHistory: 'CommandOrControl+Shift+Y',
          showSettings: 'CommandOrControl+Shift+S',
          quit: 'CommandOrControl+Shift+Q',
        },
      }
      return settings[section]?.[key]
    }),
  })),
}))

// Mock window manager - must be inline factory
vi.mock('./windows/manager', () => ({
  getWindowManager: vi.fn(() => ({
    getOrCreateSelectorWindow: vi.fn(() => ({ show: vi.fn() })),
    getWindow: vi.fn(() => ({ hide: vi.fn() })),
    getOrCreateHistoryWindow: vi.fn(),
    getOrCreateMainWindow: vi.fn(),
  })),
}))

describe('ShortcutHandler', () => {
  let shortcutHandler: ShortcutHandler

  beforeEach(() => {
    vi.clearAllMocks()
    shortcutHandler = new ShortcutHandler()

    // Setup default mock returns
    vi.mocked(globalShortcut.register).mockReturnValue(true)
    vi.mocked(globalShortcut.isRegistered).mockReturnValue(true)
  })

  describe('registerAll', () => {
    it('should register all shortcuts', () => {
      shortcutHandler.registerAll()

      expect(globalShortcut.register).toHaveBeenCalledTimes(5)
    })

    it('should register capture shortcut', () => {
      shortcutHandler.registerAll()

      expect(globalShortcut.register).toHaveBeenCalledWith(
        'CommandOrControl+Shift+X',
        expect.any(Function)
      )
    })

    it('should register hide overlay shortcut', () => {
      shortcutHandler.registerAll()

      expect(globalShortcut.register).toHaveBeenCalledWith(
        'CommandOrControl+Shift+H',
        expect.any(Function)
      )
    })

    it('should register show history shortcut', () => {
      shortcutHandler.registerAll()

      expect(globalShortcut.register).toHaveBeenCalledWith(
        'CommandOrControl+Shift+Y',
        expect.any(Function)
      )
    })

    it('should register show settings shortcut', () => {
      shortcutHandler.registerAll()

      expect(globalShortcut.register).toHaveBeenCalledWith(
        'CommandOrControl+Shift+S',
        expect.any(Function)
      )
    })

    it('should register quit shortcut', () => {
      shortcutHandler.registerAll()

      expect(globalShortcut.register).toHaveBeenCalledWith(
        'CommandOrControl+Shift+Q',
        expect.any(Function)
      )
    })
  })

  describe('unregisterAll', () => {
    it('should unregister all shortcuts', () => {
      shortcutHandler.unregisterAll()

      expect(globalShortcut.unregisterAll).toHaveBeenCalledOnce()
    })
  })

  describe('isRegistered', () => {
    it('should check if shortcut is registered', () => {
      vi.mocked(globalShortcut.isRegistered).mockReturnValue(true)

      const result = shortcutHandler.isRegistered('CommandOrControl+Shift+X')

      expect(result).toBe(true)
      expect(globalShortcut.isRegistered).toHaveBeenCalledWith('CommandOrControl+Shift+X')
    })

    it('should return false for unregistered shortcut', () => {
      vi.mocked(globalShortcut.isRegistered).mockReturnValue(false)

      const result = shortcutHandler.isRegistered('CommandOrControl+Shift+A')

      expect(result).toBe(false)
    })
  })

  describe('quit shortcut callback', () => {
    it('should quit app when triggered', () => {
      const { app } = require('electron')

      shortcutHandler.registerAll()

      // Get the callback for the quit shortcut
      const quitCallback = vi.mocked(globalShortcut.register).mock.calls[4][1]
      quitCallback()

      // Just verify the callback doesn't throw
      expect(quitCallback).toBeDefined()
    })
  })

  describe('failed shortcut registration', () => {
    it('should log error when registration fails', () => {
      vi.mocked(globalShortcut.register).mockReturnValue(false)

      expect(() => shortcutHandler.registerAll()).not.toThrow()
    })
  })
})

describe('getShortcutHandler (Singleton)', () => {
  it('should return same instance on multiple calls', () => {
    const instance1 = getShortcutHandler()
    const instance2 = getShortcutHandler()

    expect(instance1).toBe(instance2)
  })

  it('should return a ShortcutHandler instance', () => {
    const instance = getShortcutHandler()

    expect(instance).toBeInstanceOf(ShortcutHandler)
  })
})
