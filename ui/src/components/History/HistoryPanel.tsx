/**
 * History Panel Component
 *
 * Displays translation history with search
 */

import { useState, useEffect } from 'react'
import type { TranslationEntry } from '@shared/types/history'

export function HistoryPanel() {
  const [entries, setEntries] = useState<TranslationEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadHistory()
  }, [searchQuery])

  const loadHistory = async () => {
    try {
      const results = await window.electron.history.get({
        search: searchQuery || undefined,
        limit: 50
      })
      setEntries(results)
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await window.electron.history.delete(id)
      await loadHistory()
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  const handleClear = async () => {
    if (confirm('คุณต้องการล้างประวัติทั้งหมดใช่หรือไม่?')) {
      try {
        await window.electron.history.clear()
        setEntries([])
      } catch (error) {
        console.error('Failed to clear history:', error)
      }
    }
  }

  const handleExport = async () => {
    try {
      const filePath = await window.electron.history.export({ format: 'json' })
      alert(`ส่งออกประวัติไปยัง: ${filePath}`)
    } catch (error) {
      console.error('Failed to export history:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-dark-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-dark-700">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-dark-50 mb-4">
          ประวัติการแปล
        </h1>

        {/* Search bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="ค้นหาในประวัติ..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            ส่งออก
          </button>

          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            ล้างประวัติ
          </button>
        </div>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">ไม่มีประวัติการแปล</p>
            <p className="text-sm">เริ่มแปลภาษาเพื่อบันทึกประวัติ</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-dark-700">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {entry.sourceText}
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-dark-50 mb-1">
                      {entry.translatedText}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(entry.timestamp).toLocaleString('th-TH')} • {entry.sourceLanguage} → {entry.targetLanguage}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="ลบ"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
