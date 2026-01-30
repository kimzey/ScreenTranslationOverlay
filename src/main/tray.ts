/**
 * System Tray Manager
 *
 * Manages system tray icon and context menu
 */

import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron'
import path from 'path'
import { getWindowManager } from './windows/manager'
import { getSettingsStore } from './store/settings'
import { logger } from '@shared/utils/logger'

export class TrayManager {
  private tray: Tray | null = null
  private settings = getSettingsStore()

  /**
   * Create and initialize system tray
   */
  create(): void {
    // For development, we'll use a placeholder icon
    // In production, load from resources/icons/icon.png
    const iconPath = this.getIconPath()
    const icon = nativeImage.createFromPath(iconPath)

    // Create tray
    this.tray = new Tray(icon)

    // Set tooltip
    this.tray.setToolTip('Screen Translation Overlay')

    // Create context menu
    this.updateMenu()

    // Handle tray click
    this.tray.on('click', () => {
      this.showMainWindow()
    })

    logger.info('System tray created')
  }

  /**
   * Update tray menu
   */
  updateMenu(): void {
    if (!this.tray) return

    const autoStart = this.settings.getIn('general', 'autoStart') as boolean

    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'Translate Screen',
        accelerator: this.settings.getIn('shortcuts', 'capture') as string,
        click: () => this.startCapture()
      },
      {
        label: 'History',
        accelerator: this.settings.getIn('shortcuts', 'showHistory') as string,
        click: () => this.showHistoryWindow()
      },
      { type: 'separator' },
      {
        label: 'Settings',
        accelerator: this.settings.getIn('shortcuts', 'showSettings') as string,
        click: () => this.showMainWindow()
      },
      { type: 'separator' },
      {
        label: 'Auto-start on boot',
        type: 'checkbox',
        checked: autoStart,
        click: () => this.toggleAutoStart()
      },
      { type: 'separator' },
      {
        label: 'About',
        click: () => this.showAbout()
      },
      {
        label: 'Quit',
        accelerator: this.settings.getIn('shortcuts', 'quit') as string,
        click: () => this.quit()
      }
    ]

    const contextMenu = Menu.buildFromTemplate(template)
    this.tray.setContextMenu(contextMenu)
  }

  /**
   * Start screen capture
   */
  private startCapture(): void {
    logger.info('Capture initiated from tray')
    // This will be connected to capture service later
  }

  /**
   * Show main window
   */
  private showMainWindow(): void {
    const windowManager = getWindowManager()
    windowManager.getOrCreateMainWindow()
  }

  /**
   * Show history window
   */
  private showHistoryWindow(): void {
    const windowManager = getWindowManager()
    windowManager.getOrCreateHistoryWindow()
  }

  /**
   * Toggle auto-start setting
   */
  private toggleAutoStart(): void {
    const current = this.settings.getIn('general', 'autoStart') as boolean
    this.settings.setIn('general', 'autoStart', !current)

    // Set app to login item (platform-specific)
    this.setLoginItemSettings(!current)

    this.updateMenu()
    logger.info('Auto-start toggled', { enabled: !current })
  }

  /**
   * Set login item settings (auto-start)
   */
  private setLoginItemSettings(enabled: boolean): void {
    app.setLoginItemSettings({
      openAtLogin: enabled,
      openAsHidden: true,
      name: 'Screen Translation Overlay'
    })
  }

  /**
   * Show about dialog
   */
  private showAbout(): void {
    const version = app.getVersion()

    // For now, just log it. Later we can create a proper about window
    logger.info('About', {
      name: 'Screen Translation Overlay',
      version
    })

    // Could show a dialog here
    // dialog.showMessageBox({
    //   type: 'info',
    //   title: 'About',
    //   message: `Screen Translation Overlay\nVersion ${version}`
    // })
  }

  /**
   * Quit application
   */
  private quit(): void {
    logger.info('Quit initiated from tray')
    app.quit()
  }

  /**
   * Get icon path based on platform and theme
   */
  private getIconPath(): string {
    const isDark = this.settings.getIn('general', 'theme') === 'dark'

    // For now, use a simple approach
    // In production, check platform and theme for appropriate icon
    if (process.platform === 'darwin') {
      // macOS uses template icons (monochrome)
      return path.join(__dirname, '../../resources/icons/iconTemplate.png')
    } else if (process.platform === 'win32') {
      // Windows uses .ico
      return path.join(__dirname, '../../resources/icons/icon.ico')
    } else {
      // Linux uses .png
      return path.join(__dirname, '../../resources/icons/icon.png')
    }
  }

  /**
   * Destroy tray
   */
  destroy(): void {
    if (this.tray) {
      this.tray.destroy()
      this.tray = null
      logger.info('System tray destroyed')
    }
  }
}

// Singleton instance
let trayManagerInstance: TrayManager | null = null

export function getTrayManager(): TrayManager {
  if (!trayManagerInstance) {
    trayManagerInstance = new TrayManager()
  }
  return trayManagerInstance
}
