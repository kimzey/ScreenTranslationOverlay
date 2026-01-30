/**
 * WindowManager Tests
 *
 * Test suite for window management using TDD approach.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WindowManager, getWindowManager, WindowType } from './manager'
import { screen } from 'electron'
import { createMockDisplay } from '../../../vitest.setup'

// Mock logger
vi.mock('@shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

// Mock settings store
vi.mock('../store/settings', () => ({
  getSettingsStore: vi.fn(() => ({
    get: vi.fn((key: string) => {
      if (key === 'overlay') {
        return {
          opacity: 90,
          fontSize: 16,
          fontFamily: 'Sarabun',
          backgroundColor: '#0f172a',
          textColor: '#f8fafc',
          position: 'cursor',
          autoHideDelay: 30000,
          clickThrough: false,
          maxWidth: 600,
        }
      }
      return {}
    }),
    getIn: vi.fn(() => 'CommandOrControl+Shift+X'),
  })),
}))

describe('WindowManager', () => {
  let windowManager: WindowManager

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup screen mock defaults
    vi.mocked(screen.getCursorScreenPoint).mockReturnValue({ x: 100, y: 100 })
    vi.mocked(screen.getDisplayNearestPoint).mockReturnValue(createMockDisplay())

    windowManager = new WindowManager()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getWindow', () => {
    it('should return null for non-existent window', () => {
      const result = windowManager.getWindow('main')

      expect(result).toBeNull()
    })
  })

  describe('closeAll', () => {
    it('should close all windows', () => {
      // Mock that we have windows
      windowManager['windows'].set('main', {
        isDestroyed: () => false,
        close: vi.fn(),
      } as any)

      windowManager.closeAll()

      expect(windowManager['windows'].size).toBe(0)
    })

    it('should not close destroyed windows', () => {
      const destroyedWin = {
        isDestroyed: () => true,
        close: vi.fn(),
      } as any

      windowManager['windows'].set('main', destroyedWin)

      windowManager.closeAll()

      expect(destroyedWin.close).not.toHaveBeenCalled()
    })
  })

  describe('positionOverlayNearCursor', () => {
    it('should position window near cursor', () => {
      const win = {
        setPosition: vi.fn(),
        getSize: vi.fn(() => [400, 300]),
      } as any

      windowManager.positionOverlayNearCursor(win)

      expect(win.setPosition).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number)
      )
    })

    it('should keep window within display bounds', () => {
      // Cursor near right edge
      vi.mocked(screen.getCursorScreenPoint).mockReturnValue({ x: 1800, y: 500 })
      vi.mocked(screen.getDisplayNearestPoint).mockReturnValue(createMockDisplay())

      const win = {
        setPosition: vi.fn(),
        getSize: vi.fn(() => [400, 300]),
      } as any

      windowManager.positionOverlayNearCursor(win)

      expect(win.setPosition).toHaveBeenCalled()
      const x = win.setPosition.mock.calls[0][0]
      // Should be adjusted to stay within bounds
      expect(x).toBeLessThanOrEqual(1920 - 400 - 20)
    })
  })
})

describe('getWindowManager (Singleton)', () => {
  it('should return same instance on multiple calls', () => {
    const instance1 = getWindowManager()
    const instance2 = getWindowManager()

    expect(instance1).toBe(instance2)
  })

  it('should return a WindowManager instance', () => {
    const instance = getWindowManager()

    expect(instance).toBeInstanceOf(WindowManager)
  })
})
