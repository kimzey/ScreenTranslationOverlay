/**
 * Window Manager
 *
 * Manages all application windows (main, overlay, selector, history)
 */

import { BrowserWindow, screen } from 'electron'
import path from 'path'
import { logger } from '@shared/utils/logger'
import { getSettingsStore } from '../store/settings'

export type WindowType = 'main' | 'overlay' | 'selector' | 'history'

export class WindowManager {
  private windows: Map<WindowType, BrowserWindow> = new Map()
  private settings = getSettingsStore()

  /**
   * Get or create main window
   */
  getOrCreateMainWindow(): BrowserWindow {
    if (this.windows.has('main')) {
      const win = this.windows.get('main')!
      if (!win.isDestroyed()) {
        win.focus()
        return win
      }
      this.windows.delete('main')
    }

    return this.createMainWindow()
  }

  /**
   * Create main settings window
   */
  private createMainWindow(): BrowserWindow {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true
      }
    })

    // Load the app
    if (process.env.NODE_ENV === 'development') {
      win.loadURL('http://localhost:5173/#/settings')
      win.webContents.openDevTools()
    } else {
      win.loadFile(path.join(__dirname, '../renderer/index.html'), {
        hash: '/settings'
      })
    }

    // Show when ready
    win.once('ready-to-show', () => {
      win.show()
      logger.info('Main window shown')
    })

    // Cleanup on close
    win.on('closed', () => {
      this.windows.delete('main')
      logger.info('Main window closed')
    })

    this.windows.set('main', win)
    return win
  }

  /**
   * Get or create overlay window
   */
  getOrCreateOverlayWindow(): BrowserWindow {
    if (this.windows.has('overlay')) {
      const win = this.windows.get('overlay')!
      if (!win.isDestroyed()) {
        return win
      }
      this.windows.delete('overlay')
    }

    return this.createOverlayWindow()
  }

  /**
   * Create overlay window for displaying translations
   */
  private createOverlayWindow(): BrowserWindow {
    const overlaySettings = this.settings.get('overlay')

    const win = new BrowserWindow({
      width: Math.min(overlaySettings.maxWidth, 600),
      height: 400,
      x: overlaySettings.position === 'custom' ? overlaySettings.customPosition?.x : undefined,
      y: overlaySettings.position === 'custom' ? overlaySettings.customPosition?.y : undefined,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true
      }
    })

    // Load overlay UI
    if (process.env.NODE_ENV === 'development') {
      win.loadURL('http://localhost:5173/#/overlay')
    } else {
      win.loadFile(path.join(__dirname, '../renderer/index.html'), {
        hash: '/overlay'
      })
    }

    // Make click-through if enabled
    if (overlaySettings.clickThrough) {
      win.setIgnoreMouseEvents(true)
    }

    win.on('closed', () => {
      this.windows.delete('overlay')
      logger.info('Overlay window closed')
    })

    this.windows.set('overlay', win)
    logger.info('Overlay window created')
    return win
  }

  /**
   * Get or create selector window
   */
  getOrCreateSelectorWindow(): BrowserWindow {
    if (this.windows.has('selector')) {
      const win = this.windows.get('selector')!
      if (!win.isDestroyed()) {
        return win
      }
      this.windows.delete('selector')
    }

    return this.createSelectorWindow()
  }

  /**
   * Create fullscreen selector window for screen capture
   */
  createSelectorWindow(): BrowserWindow {
    const cursor = screen.getCursorScreenPoint()
    const display = screen.getDisplayNearestPoint(cursor)

    const win = new BrowserWindow({
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      movable: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true
      }
    })

    // Load selector UI
    if (process.env.NODE_ENV === 'development') {
      win.loadURL('http://localhost:5173/#/selector')
    } else {
      win.loadFile(path.join(__dirname, '../renderer/index.html'), {
        hash: '/selector'
      })
    }

    win.on('closed', () => {
      this.windows.delete('selector')
      logger.info('Selector window closed')
    })

    this.windows.set('selector', win)
    logger.info('Selector window created', { display: display.id })
    return win
  }

  /**
   * Get or create history window
   */
  getOrCreateHistoryWindow(): BrowserWindow {
    if (this.windows.has('history')) {
      const win = this.windows.get('history')!
      if (!win.isDestroyed()) {
        win.focus()
        return win
      }
      this.windows.delete('history')
    }

    return this.createHistoryWindow()
  }

  /**
   * Create history window
   */
  private createHistoryWindow(): BrowserWindow {
    const win = new BrowserWindow({
      width: 900,
      height: 700,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true
      }
    })

    // Load history UI
    if (process.env.NODE_ENV === 'development') {
      win.loadURL('http://localhost:5173/#/history')
      win.webContents.openDevTools()
    } else {
      win.loadFile(path.join(__dirname, '../renderer/index.html'), {
        hash: '/history'
      })
    }

    win.once('ready-to-show', () => {
      win.show()
      logger.info('History window shown')
    })

    win.on('closed', () => {
      this.windows.delete('history')
      logger.info('History window closed')
    })

    this.windows.set('history', win)
    return win
  }

  /**
   * Get window by type
   */
  getWindow(type: WindowType): BrowserWindow | null {
    const win = this.windows.get(type)
    if (win && !win.isDestroyed()) {
      return win
    }
    return null
  }

  /**
   * Close all windows
   */
  closeAll(): void {
    for (const [type, win] of this.windows) {
      if (!win.isDestroyed()) {
        win.close()
      }
    }
    this.windows.clear()
    logger.info('All windows closed')
  }

  /**
   * Position overlay near cursor
   */
  positionOverlayNearCursor(win: BrowserWindow): void {
    const cursor = screen.getCursorScreenPoint()
    const display = screen.getDisplayNearestPoint(cursor)
    const [width, height] = win.getSize()

    // Calculate position (below and to the right of cursor, with padding)
    let x = cursor.x + 20
    let y = cursor.y + 20

    // Keep within display bounds
    const maxX = display.bounds.x + display.bounds.width - width - 20
    const maxY = display.bounds.y + display.bounds.height - height - 20

    x = Math.min(Math.max(x, display.bounds.x + 20), maxX)
    y = Math.min(Math.max(y, display.bounds.y + 20), maxY)

    win.setPosition(x, y)
  }
}

// Singleton instance
let windowManagerInstance: WindowManager | null = null

export function getWindowManager(): WindowManager {
  if (!windowManagerInstance) {
    windowManagerInstance = new WindowManager()
  }
  return windowManagerInstance
}
