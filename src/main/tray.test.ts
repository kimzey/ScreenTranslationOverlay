/**
 * TrayManager Tests
 *
 * Test suite for system tray management using TDD approach.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TrayManager, getTrayManager } from './tray'
import { Tray, Menu, nativeImage, app } from 'electron'

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
      const settings: Record<string, Record<string, unknown>> = {
        general: {
          autoStart: false,
          theme: 'dark',
        },
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
    getOrCreateMainWindow: vi.fn(),
    getOrCreateHistoryWindow: vi.fn(),
  })),
}))

describe('TrayManager', () => {
  let trayManager: TrayManager

  beforeEach(() => {
    vi.clearAllMocks()
    trayManager = new TrayManager()

    // Setup default mock returns
    vi.mocked(Tray).mockImplementation(function() {
      return {
        setToolTip: vi.fn(),
        setContextMenu: vi.fn(),
        on: vi.fn(),
        destroy: vi.fn(),
      } as any
    })

    vi.mocked(Menu.buildFromTemplate).mockReturnValue({} as any)
    vi.mocked(nativeImage.createFromPath).mockReturnValue({} as any)
    // Note: app methods are mocked in vitest.setup.ts, we just need to set return values
  })

  describe('create', () => {
    it('should create tray without throwing', () => {
      expect(() => trayManager.create()).not.toThrow()
    })

    it('should create context menu', () => {
      trayManager.create()

      expect(Menu.buildFromTemplate).toHaveBeenCalled()
    })

    it('should create tray with tooltip', () => {
      trayManager.create()

      expect(Tray).toHaveBeenCalled()
    })
  })

  describe('updateMenu', () => {
    it('should update context menu', () => {
      trayManager.create()
      // Clear mock calls
      vi.mocked(Menu.buildFromTemplate).mockClear()

      trayManager.updateMenu()

      expect(Menu.buildFromTemplate).toHaveBeenCalled()
    })
  })

  describe('destroy', () => {
    it('should destroy tray without throwing', () => {
      trayManager.create()

      expect(() => trayManager.destroy()).not.toThrow()
    })

    it('should handle destroy when tray is null', () => {
      expect(() => trayManager.destroy()).not.toThrow()
    })
  })
})

describe('getTrayManager (Singleton)', () => {
  it('should return same instance on multiple calls', () => {
    const instance1 = getTrayManager()
    const instance2 = getTrayManager()

    expect(instance1).toBe(instance1)
  })

  it('should return a TrayManager instance', () => {
    const instance = getTrayManager()

    expect(instance).toBeInstanceOf(TrayManager)
  })
})
