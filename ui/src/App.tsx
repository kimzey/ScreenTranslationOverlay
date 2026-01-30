/**
 * Main App Component
 *
 * Handles routing between different views based on hash
 */

import { useEffect, useState } from 'react'
import { useHash } from './hooks/useHash'
import { SettingsPanel } from './components/Settings/SettingsPanel'
import { TranslationOverlay } from './components/Overlay/TranslationOverlay'
import { ScreenSelector } from './components/Selector/ScreenSelector'
import { HistoryPanel } from './components/History/HistoryPanel'

function App() {
  const hash = useHash()

  // Route based on hash
  const renderView = () => {
    switch (hash) {
      case '#/settings':
      case '':
      case '#/':
        return <SettingsPanel />

      case '#/overlay':
        return <TranslationOverlay />

      case '#/selector':
        return <ScreenSelector />

      case '#/history':
        return <HistoryPanel />

      default:
        return <SettingsPanel />
    }
  }

  return (
    <div className="w-full h-full">
      {renderView()}
    </div>
  )
}

export default App
