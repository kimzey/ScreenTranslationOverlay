/**
 * Keyboard Shortcut Constants
 */

export const DEFAULT_SHORTCUTS = {
  CAPTURE: 'CommandOrControl+Shift+X',
 _HIDE_OVERLAY: 'CommandOrControl+Shift+H',
  SHOW_HISTORY: 'CommandOrControl+Shift+H',
  SHOW_SETTINGS: 'CommandOrControl+Shift+S',
  QUIT: 'CommandOrControl+Shift+Q'
} as const

export const SHORTCUT_DESCRIPTIONS = {
  CAPTURE: 'Capture and translate screen region',
  HIDE_OVERLAY: 'Hide translation overlay',
  SHOW_HISTORY: 'Show translation history',
  SHOW_SETTINGS: 'Open settings',
  QUIT: 'Quit application'
} as const
