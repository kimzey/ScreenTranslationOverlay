# Frontend Codemap (Renderer Process)

**Last Updated:** 2025-01-31
**Entry Point:** `ui/src/main.tsx`
**Framework:** React 18 + TypeScript 5

## Preload Bridge

**Location:** `src/renderer/preload/index.ts`

Exposes to renderer via `contextBridge`:

```typescript
window.electron = {
  settings: { get, save, reset, onUpdated }
  capture: { start, cancel }
  translation: { translate, onResult }
  overlay: { show, hide, updatePosition, onVisibilityChanged }
  history: { get, delete, clear, export }
  onOcrProgress: (callback) => unsubscribe
  onError: (callback) => unsubscribe
}
```

## React Components

```
App.tsx (Hash Router)
    ├── useHash() - Track #/ routes
    │
    ├── #/settings or / -> SettingsPanel
    ├── #/overlay -> TranslationOverlay
    ├── #/selector -> ScreenSelector
    └── #/history -> HistoryPanel
```

## Component Details

### App.tsx
- Route handler based on `window.location.hash`
- Renders appropriate view component

### SettingsPanel
- Tabs: general, shortcuts, overlay, history
- Thai language UI
- Uses `useSettings()` hook for data

### TranslationOverlay
- Listens to `translation:onResult` events
- Displays translation in floating window
- Semi-transparent dark background

### ScreenSelector
- Fullscreen overlay with mouse drag selection
- Calculates region bounds
- ESC to cancel

### HistoryPanel
- Lists translation entries
- Search functionality
- Delete/Clear/Export actions
- Uses `window.electron.history` API

## Hooks

### useSettings()
```typescript
const { settings, loading, saveSettings } = useSettings()
// Returns AppSettings from IPC
// Auto-subscribes to updates
```

### useHash()
```typescript
const hash = useHash()
// Returns window.location.hash
// Auto-updates on hashchange
```

## Routing via Hash

| Hash | Component | Window Type |
|------|-----------|-------------|
| `#/settings` or `#/` | SettingsPanel | Main window |
| `#/overlay` | TranslationOverlay | Overlay window |
| `#/selector` | ScreenSelector | Selector window |
| `#/history` | HistoryPanel | History window |

## Build Config

**File:** `electron.vite.config.ts`

- **Main:** TS with aliases (`@`, `@main`, `@shared`)
- **Preload:** TS with aliases (`@`, `@renderer`, `@shared`)
- **Renderer:** Vite + React plugin, port 5173
- **Dev server:** http://localhost:5173

## Styling

Tailwind CSS with custom dark mode:
- `bg-dark-900`, `text-dark-50`
- Primary color: `primary-500`
- Thai font support (Sarabun)
