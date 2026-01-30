/**
 * Global Shortcut Handler
 *
 * Registers and manages global keyboard shortcuts
 */

import { globalShortcut, app } from 'electron'
import { getSettingsStore } from './store/settings'
import { getWindowManager } from './windows/manager'
import { logger } from '@shared/utils/logger'

export class ShortcutHandler {
  private settings = getSettingsStore()
  private windowManager = getWindowManager()

  /**
   * Register all global shortcuts
   */
  registerAll(): void {
    this.registerCapture()
    this.registerHideOverlay()
    this.registerShowHistory()
    this.registerShowSettings()
    this.registerQuit()
    logger.info('All shortcuts registered')
  }

  /**
   * Register capture shortcut
   */
  private registerCapture(): void {
    const accelerator = this.settings.getIn('shortcuts', 'capture') as string
    const registered = globalShortcut.register(accelerator, () => {
      logger.info('Capture shortcut triggered')
      this.startCapture()
    })

    if (registered) {
      logger.info('Capture shortcut registered', { accelerator })
    } else {
      logger.error('Failed to register capture shortcut', { accelerator })
    }
  }

  /**
   * Register hide overlay shortcut
   */
  private registerHideOverlay(): void {
    const accelerator = this.settings.getIn('shortcuts', 'hideOverlay') as string
    const registered = globalShortcut.register(accelerator, () => {
      logger.info('Hide overlay shortcut triggered')
      this.hideOverlay()
    })

    if (registered) {
      logger.info('Hide overlay shortcut registered', { accelerator })
    } else {
      logger.error('Failed to register hide overlay shortcut', { accelerator })
    }
  }

  /**
   * Register show history shortcut
   */
  private registerShowHistory(): void {
    const accelerator = this.settings.getIn('shortcuts', 'showHistory') as string
    const registered = globalShortcut.register(accelerator, () => {
      logger.info('Show history shortcut triggered')
      this.showHistory()
    })

    if (registered) {
      logger.info('Show history shortcut registered', { accelerator })
    } else {
      logger.error('Failed to register show history shortcut', { accelerator })
    }
  }

  /**
   * Register show settings shortcut
   */
  private registerShowSettings(): void {
    const accelerator = this.settings.getIn('shortcuts', 'showSettings') as string
    const registered = globalShortcut.register(accelerator, () => {
      logger.info('Show settings shortcut triggered')
      this.showSettings()
    })

    if (registered) {
      logger.info('Show settings shortcut registered', { accelerator })
    } else {
      logger.error('Failed to register show settings shortcut', { accelerator })
    }
  }

  /**
   * Register quit shortcut
   */
  private registerQuit(): void {
    const accelerator = this.settings.getIn('shortcuts', 'quit') as string
    const registered = globalShortcut.register(accelerator, () => {
      logger.info('Quit shortcut triggered')
      app.quit()
    })

    if (registered) {
      logger.info('Quit shortcut registered', { accelerator })
    } else {
      logger.error('Failed to register quit shortcut', { accelerator })
    }
  }

  /**
   * Unregister all shortcuts
   */
  unregisterAll(): void {
    globalShortcut.unregisterAll()
    logger.info('All shortcuts unregistered')
  }

  /**
   * Start screen capture workflow
   */
  private startCapture(): void {
    // Show selector window
    const selectorWindow = this.windowManager.getOrCreateSelectorWindow()
    selectorWindow.show()
  }

  /**
   * Hide overlay window
   */
  private hideOverlay(): void {
    const overlayWindow = this.windowManager.getWindow('overlay')
    if (overlayWindow) {
      overlayWindow.hide()
    }
  }

  /**
   * Show history window
   */
  private showHistory(): void {
    this.windowManager.getOrCreateHistoryWindow()
  }

  /**
   * Show settings window
   */
  private showSettings(): void {
    this.windowManager.getOrCreateMainWindow()
  }

  /**
   * Check if shortcut is registered
   */
  isRegistered(accelerator: string): boolean {
    return globalShortcut.isRegistered(accelerator)
  }
}

// Singleton instance
let shortcutHandlerInstance: ShortcutHandler | null = null

export function getShortcutHandler(): ShortcutHandler {
  if (!shortcutHandlerInstance) {
    shortcutHandlerInstance = new ShortcutHandler()
  }
  return shortcutHandlerInstance
}
