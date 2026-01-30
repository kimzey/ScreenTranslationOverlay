/**
 * Settings Panel Component
 *
 * Main settings interface with tabs for different setting categories
 */

import { useState } from 'react'
import { useSettings } from '../../hooks/useSettings'

type Tab = 'general' | 'shortcuts' | 'overlay' | 'history'

export function SettingsPanel() {
  const { settings, loading } = useSettings()
  const [activeTab, setActiveTab] = useState<Tab>('general')

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'general' as Tab, label: 'ทั่วไป', icon: '⚙️' },
    { id: 'shortcuts' as Tab, label: 'ปุ่มลัด', icon: '⌨️' },
    { id: 'overlay' as Tab, label: 'การแสดงผล', icon: '🎨' },
    { id: 'history' as Tab, label: 'ประวัติ', icon: '📜' }
  ]

  return (
    <div className="flex h-screen bg-white dark:bg-dark-900">
      {/* Sidebar */}
      <div className="w-60 bg-gray-50 dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-dark-50">
            การตั้งค่า
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Screen Translation Overlay
          </p>
        </div>

        <nav className="mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }
              `}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">
          {activeTab === 'general' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">การตั้งค่าทั่วไป</h2>
              <div className="space-y-6">
                {/* Source Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ภาษาต้นฉบับ
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50"
                    defaultValue={settings.general.sourceLanguage}
                  >
                    <option value="auto">ตรวจจับอัตโนมัติ</option>
                    <option value="en">English</option>
                    <option value="ja">Japanese</option>
                    <option value="ko">Korean</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                    <option value="zh-TW">Chinese (Traditional)</option>
                  </select>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ธีม
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-50"
                    defaultValue={settings.general.theme}
                  >
                    <option value="light">สว่าง</option>
                    <option value="dark">มืด</option>
                    <option value="system">ทำตามระบบ</option>
                  </select>
                </div>

                {/* Auto-start */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      เริ่มอัตโนมัติ
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      เปิดโปรแกรมอัตโนมัติเมื่อเปิดคอมพิวเตอร์
                    </p>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.general.autoStart ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.general.autoStart ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">ปุ่มลัด</h2>
              <div className="space-y-4">
                {Object.entries(settings.shortcuts).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {key}
                    </span>
                    <kbd className="px-3 py-1 text-sm font-mono bg-white dark:bg-dark-900 border border-gray-300 dark:border-dark-600 rounded">
                      {value}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'overlay' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">การแสดงผล</h2>
              <p className="text-gray-600 dark:text-gray-400">
                ปรับแต่งรูปลักษณ์ของหน้าต่างแปลภาษา
              </p>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">ประวัติการแปล</h2>
              <p className="text-gray-600 dark:text-gray-400">
                ดูและจัดการประวัติการแปลทั้งหมด
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
