/**
 * Vitest Setup File
 *
 * Global test setup for mocking Electron APIs and other dependencies
 */

import { vi } from 'vitest'

// Helper to create a mock Display object with all required properties
export function createMockDisplay(overrides: Partial<Electron.Display> = {}): Electron.Display {
  return {
    id: 1,
    label: '\\.\DISPLAY1',
    bounds: { x: 0, y: 0, width: 1920, height: 1080 },
    workArea: { x: 0, y: 0, width: 1920, height: 1050 },
    accelerometerSupport: 'unavailable',
    monochrome: false,
    colorDepth: 24,
    colorSpace: '{sRGB}',
    depthPerComponent: 8,
    size: { width: 1920, height: 1080 },
    workAreaSize: { width: 1920, height: 1050 },
    scaleFactor: 1,
    rotation: 0,
    internal: false,
    touchSupport: 'unavailable',
    detected: true,
    displayFrequency: 60,
    maximumCursorSize: { width: 64, height: 64 },
    nativeOrigin: { x: 0, y: 0 },
    ...overrides,
  }
}

// Create a mock NativeImage class
class MockNativeImage {
  constructor(private buffer: Buffer) {}

  toBitmap(): Buffer {
    return this.buffer
  }

  toDataURL(): string {
    return `data:image/png;base64,${this.buffer.toString('base64')}`
  }

  toPNG(): Buffer {
    return this.buffer
  }

  isEmpty(): boolean {
    return this.buffer.length === 0
  }

  getSize(): { width: number; height: number } {
    return { width: 100, height: 100 }
  }

  getAspectRatio(): number {
    return 1
  }

  crop(_bounds: Electron.Rectangle): any {
    return this
  }

  resize(_options: { width: number; height: number }): any {
    return this
  }
}

// Helper to create a mock thumbnail
export function createMockThumbnail(buffer: Buffer): any {
  return new MockNativeImage(buffer)
}

// Mock Electron's screen module
const mockScreen = {
  getDisplayNearestPoint: vi.fn(),
  getDisplayMatching: vi.fn(),
  getPrimaryDisplay: vi.fn(() => createMockDisplay()),
  getAllDisplays: vi.fn(() => [createMockDisplay()]),
  getCursorScreenPoint: vi.fn(),
}

// Mock Electron's desktopCapturer module
const mockDesktopCapturer = {
  getSources: vi.fn(),
}

// Mock Electron's app module
const mockApp = {
  getPath: vi.fn((name: string) => {
    const paths: Record<string, string> = {
      userData: '/tmp/user-data',
      appData: '/tmp/app-data',
      logs: '/tmp/logs',
    }
    return paths[name] || '/tmp'
  }),
  getVersion: vi.fn(() => '0.1.0'),
  getName: vi.fn(() => 'Screen Translation Overlay'),
  requestSingleInstanceLock: vi.fn(() => true),
  quit: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  setLoginItemSettings: vi.fn(),
}

// Mock Electron's BrowserWindow
const mockBrowserWindow = {
  prototype: {
    loadURL: vi.fn(),
    loadFile: vi.fn(),
    on: vi.fn(),
    once: vi.fn(),
    removeListener: vi.fn(),
    removeAllListeners: vi.fn(),
    close: vi.fn(),
    show: vi.fn(),
    hide: vi.fn(),
    focus: vi.fn(),
    isMinimized: vi.fn(),
    restore: vi.fn(),
    webContents: {
      on: vi.fn(),
      openDevTools: vi.fn(),
    },
  },
}

// Default settings for electron-store mock
const defaultSettingsForMock = {
  general: {
    sourceLanguage: 'auto',
    autoStart: false,
    theme: 'dark',
    language: 'th'
  },
  shortcuts: {
    capture: 'CommandOrControl+Shift+X',
    hideOverlay: 'CommandOrControl+Shift+H',
    showHistory: 'CommandOrControl+Shift+Y',
    showSettings: 'CommandOrControl+Shift+S',
    quit: 'CommandOrControl+Shift+Q'
  },
  overlay: {
    opacity: 90,
    fontSize: 16,
    fontFamily: 'Sarabun',
    backgroundColor: '#0f172a',
    textColor: '#f8fafc',
    position: 'cursor',
    autoHideDelay: 30000,
    clickThrough: false,
    maxWidth: 600
  },
  ocr: {
    engine: 'tesseract',
    confidence: 70,
    language: 'auto',
    preprocess: true,
    workerCount: 2
  },
  translation: {
    provider: 'google',
    cacheEnabled: true,
    cacheSize: 1000,
    cacheTtl: 604800
  }
}

// Create electron-store mock constructor
const createMockElectronStore = vi.fn(function(this: any, options: any) {
  this.name = options?.name || 'settings'
  this.schema = options?.schema
  // Initialize with defaults
  this.store = options?.defaults || { ...defaultSettingsForMock }
  this.path = '/tmp/user-data/settings.json'

  return this
})

// Add methods to the prototype
createMockElectronStore.prototype.get = function<T = unknown>(key: string): T | undefined {
  return this.store[key] as T
}

createMockElectronStore.prototype.set = function(key: string, value: unknown): void {
  this.store[key] = value
}

createMockElectronStore.prototype.delete = function(key: string): void {
  delete this.store[key]
}

createMockElectronStore.prototype.clear = function(): void {
  // Restore defaults after clear
  this.store = { ...defaultSettingsForMock }
}

Object.defineProperty(createMockElectronStore.prototype, 'size', {
  get: function() {
    return Object.keys(this.store).length
  }
})

// Mock Electron module
vi.mock('electron', () => ({
  screen: mockScreen,
  desktopCapturer: mockDesktopCapturer,
  app: mockApp,
  BrowserWindow: vi.fn(function() {
    return {
      loadURL: vi.fn(),
      loadFile: vi.fn(),
      on: vi.fn(function(this: any, event: string, callback: Function) {
        (this._listeners = this._listeners || {})[event] = callback
      }),
      once: vi.fn(function(this: any, event: string, callback: Function) {
        (this._listeners = this._listeners || {})[event] = callback
      }),
      removeListener: vi.fn(),
      removeAllListeners: vi.fn(),
      close: vi.fn(),
      show: vi.fn(),
      hide: vi.fn(),
      focus: vi.fn(),
      isMinimized: vi.fn(() => false),
      isDestroyed: vi.fn(() => false),
      restore: vi.fn(),
      setSize: vi.fn(),
      setPosition: vi.fn(),
      getPosition: vi.fn(() => [0, 0]),
      getSize: vi.fn(() => [800, 600]),
      webContents: {
        on: vi.fn(),
        openDevTools: vi.fn(),
      },
      _listeners: {},
    }
  }),
  Tray: vi.fn(function() {
    return {
      setToolTip: vi.fn(),
      setContextMenu: vi.fn(),
      on: vi.fn(),
      destroy: vi.fn(),
    }
  }),
  Menu: {
    buildFromTemplate: vi.fn(() => ({})),
  },
  nativeImage: {
    createFromPath: vi.fn(() => ({})),
  },
  globalShortcut: {
    register: vi.fn(() => true),
    unregisterAll: vi.fn(),
    isRegistered: vi.fn(() => true),
  },
}))

// Mock electron-store
vi.mock('electron-store', () => ({
  default: createMockElectronStore,
}))

// Mock better-sqlite3
vi.mock('better-sqlite3', () => ({
  default: vi.fn(function() {
    return {
      prepare: vi.fn(() => ({
        run: vi.fn(),
        get: vi.fn(),
        all: vi.fn(),
      })),
      exec: vi.fn(),
      pragma: vi.fn(),
      close: vi.fn(),
    }
  }),
}))
