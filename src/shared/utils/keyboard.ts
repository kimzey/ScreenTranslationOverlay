/**
 * Keyboard Utilities
 */

/**
 * Convert electron accelerator to display format
 */
export function formatShortcut(shortcut: string): string {
  return shortcut
    .replace('CommandOrControl', process.platform === 'darwin' ? '⌘' : 'Ctrl')
    .replace('Command', '⌘')
    .replace('Control', 'Ctrl')
    .replace('Shift', '⇧')
    .replace('Alt', '⌥')
    .replace('+', ' ')
}
