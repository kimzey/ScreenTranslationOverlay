/**
 * Translation Overlay Component
 *
 * Displays translation result in a floating overlay
 */

import { useEffect } from 'react'
import type { TranslationResult } from '@shared/types/translation'

export function TranslationOverlay() {
  useEffect(() => {
    // Listen for translation results
    const unsubscribe = window.electron.translation.onResult((result: TranslationResult) => {
      console.log('Translation result:', result)
      // Display result
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className="w-full h-full bg-dark-900/90 backdrop-blur-sm border border-primary-500 rounded-lg p-4 text-dark-50">
      <p className="text-base leading-relaxed">
        การแปลภาษาจะปรากฏที่นี่...
      </p>
    </div>
  )
}
