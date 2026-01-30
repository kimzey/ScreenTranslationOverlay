/**
 * Main Process Entry Point
 *
 * Screen Translation Overlay - Main Electron Process
 */

import { app, BrowserWindow } from 'electron'
import path from 'path'
import { logger } from '@shared/utils/logger'
import { getSettingsStore } from './store/settings'
import { getHistoryDatabase } from './store/database'
import { getWindowManager } from './windows/manager'
import { getTrayManager } from './tray'
import { getShortcutHandler } from './shortcuts'

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  logger.info('Second instance detected, quitting...')
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window
    const windowManager = getWindowManager()
    const mainWindow = windowManager.getWindow('main')
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    } else {
      windowManager.getOrCreateMainWindow()
    }
  })
}

// App lifecycle
app.on('ready', () => {
  logger.info('App ready')
  initialize()
})

app.on('window-all-closed', () => {
  logger.info('All windows closed')

  // On macOS, keep app running even without windows
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  logger.info('App quitting')
  cleanup()
})

app.on('will-quit', (e) => {
  // Prevent default quit to cleanup first
  // e.preventDefault()

  // Unregister shortcuts
  const shortcutHandler = getShortcutHandler()
  shortcutHandler.unregisterAll()
})

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  const windowManager = getWindowManager()
  const mainWindow = windowManager.getWindow('main')
  if (mainWindow === null) {
    windowManager.getOrCreateMainWindow()
  }
})

/**
 * Initialize application
 */
function initialize(): void {
  try {
    // Initialize settings
    const settingsStore = getSettingsStore()
    logger.info('Settings loaded', { path: settingsStore.path })

    // Initialize database
    const historyDatabase = getHistoryDatabase()
    logger.info('Database initialized', { path: historyDatabase.getPath() })

    // Initialize window manager
    const windowManager = getWindowManager()
    logger.info('Window manager initialized')

    // Initialize tray
    const trayManager = getTrayManager()
    trayManager.create()
    logger.info('Tray initialized')

    // Register global shortcuts
    const shortcutHandler = getShortcutHandler()
    shortcutHandler.registerAll()

    // Watch for settings changes
    settingsStore.onChange('shortcuts', () => {
      logger.info('Shortcuts changed, re-registering')
      shortcutHandler.unregisterAll()
      shortcutHandler.registerAll()
      trayManager.updateMenu()
    })

    logger.info('Application initialized successfully')

    // Don't show main window on startup
    // User can open it from tray menu
  } catch (error) {
    logger.error('Failed to initialize application', error)
    app.quit()
  }
}

/**
 * Cleanup before quit
 */
function cleanup(): void {
  try {
    // Unregister shortcuts
    const shortcutHandler = getShortcutHandler()
    shortcutHandler.unregisterAll()

    // Close all windows
    const windowManager = getWindowManager()
    windowManager.closeAll()

    // Destroy tray
    const trayManager = getTrayManager()
    trayManager.destroy()

    // Close database
    const historyDatabase = getHistoryDatabase()
    historyDatabase.close()

    logger.info('Cleanup completed')
  } catch (error) {
    logger.error('Error during cleanup', error)
  }
}

// Export for testing
export { initialize, cleanup }
