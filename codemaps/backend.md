# Backend Codemap (Main Process)

**Last Updated:** 2025-01-31
**Entry Point:** `src/main/index.ts`

## Module Dependencies

```
index.ts
    ├── store/settings.ts (electron-store)
    ├── store/database.ts (better-sqlite3)
    ├── windows/manager.ts (BrowserWindow)
    ├── tray.ts (Tray, Menu)
    └── shortcuts.ts (globalShortcut)
```

## Key Modules

| Module | Exports | Dependencies |
|--------|---------|--------------|
| `index.ts` | initialize(), cleanup() | All modules below |
| `windows/manager.ts` | WindowManager class | screen, settings |
| `tray.ts` | TrayManager class | Tray, Menu, settings |
| `shortcuts.ts` | ShortcutHandler class | globalShortcut, settings |
| `store/settings.ts` | SettingsStore class | electron-store |
| `store/database.ts` | HistoryDatabase class | better-sqlite3 |
| `services/capture.ts` | CaptureService class | desktopCapturer, screen |

## WindowManager

Window types: `'main' | 'overlay' | 'selector' | 'history'`

Methods:
- `getOrCreateMainWindow()` - Settings window (800x600)
- `getOrCreateOverlayWindow()` - Floating translation display
- `getOrCreateSelectorWindow()` - Fullscreen region selection
- `getOrCreateHistoryWindow()` - History browser (900x700)
- `getWindow(type)` - Get existing window
- `closeAll()` - Cleanup
- `positionOverlayNearCursor(win)` - Smart positioning

## TrayManager

Methods:
- `create()` - Initialize tray icon
- `updateMenu()` - Rebuild context menu
- `destroy()` - Cleanup

Menu items:
- Translate Screen
- History
- Settings
- Auto-start on boot
- About
- Quit

## ShortcutHandler

Registered shortcuts (from settings):
- `shortcuts.capture` - Start capture workflow
- `shortcuts.hideOverlay` - Hide overlay window
- `shortcuts.showHistory` - Open history window
- `shortcuts.showSettings` - Open settings window
- `shortcuts.quit` - Quit application

## SettingsStore

Schema:
```typescript
{
  general: { sourceLanguage, autoStart, theme, language }
  shortcuts: { capture, hideOverlay, showHistory, showSettings, quit }
  overlay: { opacity, fontSize, fontFamily, backgroundColor, ... }
  ocr: { engine, confidence, language, preprocess, workerCount }
  translation: { provider, apiEndpoint, cacheEnabled, cacheSize, cacheTtl }
}
```

Methods:
- `get<K>(key)` - Get setting
- `getIn<K, NK>(key, nestedKey)` - Get nested setting
- `set<K>(key, value)` - Set setting
- `setIn<K, NK>(key, nestedKey, value)` - Set nested setting
- `onChange<K>(key, callback)` - Watch changes
- `reset()` - Reset to defaults

## HistoryDatabase

Table: `translations`
- id, timestamp, source_text, translated_text
- source_language, target_language, confidence, image_data

Indexes: timestamp, source_text, translated_text, source_language

Methods:
- `add(entry)` - Insert translation
- `getAll(filters)` - Query with filters
- `search(query, limit)` - Full-text search
- `getById(id)` - Get single entry
- `update(id, data)` - Update entry
- `delete(id)` - Delete entry
- `clear()` - Delete all
- `getStats()` - Aggregated stats
- `export(format)` - JSON/CSV export

## CaptureService

Methods:
- `getDisplays()` - Enumerate screens
- `getPrimaryDisplay()` - Get main screen
- `captureRegion(region, displayId?)` - Capture area
- `captureFullScreen(displayId?)` - Capture entire screen
- `validateRegion(region, display)` - Validate bounds

Error codes:
- INVALID_REGION, REGION_OUT_OF_BOUNDS
- DISPLAY_NOT_FOUND, CAPTURE_FAILED
- DISPLAY_ENUMERATION_FAILED, NO_PRIMARY_DISPLAY
