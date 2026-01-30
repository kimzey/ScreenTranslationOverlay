/**
 * Custom hook for accessing and managing settings
 */

import { useState, useEffect } from 'react'
import type { AppSettings } from '@shared/types/settings'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    // Load settings
    const loadSettings = async () => {
      try {
        const s = await window.electron.settings.get()
        setSettings(s)

        // Listen for updates
        unsubscribe = window.electron.settings.onUpdated((updated) => {
          setSettings(updated)
        })
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const saveSettings = async (updates: Partial<AppSettings>) => {
    if (!settings) return

    try {
      await window.electron.settings.save(updates)
      // Settings will be updated via onUpdated callback
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw error
    }
  }

  return {
    settings,
    loading,
    saveSettings
  }
}
