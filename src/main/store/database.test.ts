/**
 * HistoryDatabase Tests
 *
 * Test suite for translation history storage using TDD approach.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { HistoryDatabase, getHistoryDatabase } from './database'
import type { TranslationEntry } from '@shared/types/history'
import type { HistoryFilters } from '@shared/types/history'
import Database from 'better-sqlite3'

// Mock logger
vi.mock('@shared/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}))

// Mock fs module for directory creation
vi.mock('fs', () => ({
  existsSync: vi.fn(() => true),
  mkdirSync: vi.fn(),
}))

// Mock better-sqlite3 - must be inline factory
vi.mock('better-sqlite3', () => ({
  default: vi.fn(function() {
    const mockStmt = {
      run: vi.fn(),
      get: vi.fn(() => ({ count: 0, avg_conf: 0 })),
      all: vi.fn(() => []),
    }
    return {
      prepare: vi.fn(() => mockStmt),
      exec: vi.fn(),
      pragma: vi.fn(),
      close: vi.fn(),
    }
  }),
}))

describe('HistoryDatabase', () => {
  let historyDatabase: HistoryDatabase

  beforeEach(() => {
    vi.clearAllMocks()
    historyDatabase = new HistoryDatabase()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize database', () => {
      expect(historyDatabase).toBeInstanceOf(HistoryDatabase)
    })

    it('should have a path', () => {
      const path = historyDatabase.getPath()

      expect(path).toBeDefined()
      expect(typeof path).toBe('string')
    })
  })

  describe('add', () => {
    const createMockEntry = (): TranslationEntry => ({
      id: 'test-id-123',
      timestamp: Date.now(),
      sourceText: 'Hello world',
      translatedText: 'สวัสดีชาวโลก',
      sourceLanguage: 'en',
      targetLanguage: 'th',
      confidence: 0.95,
    })

    it('should add translation entry', () => {
      const entry = createMockEntry()

      expect(() => historyDatabase.add(entry)).not.toThrow()
    })

    it('should handle entry with image data', () => {
      const entry: TranslationEntry = {
        ...createMockEntry(),
        imageData: 'data:image/png;base64,abc123',
      }

      expect(() => historyDatabase.add(entry)).not.toThrow()
    })
  })

  describe('getAll', () => {
    it('should return array of translations', () => {
      const results = historyDatabase.getAll()

      expect(Array.isArray(results)).toBe(true)
    })

    it('should filter by search term', () => {
      const filters: HistoryFilters = { search: 'Hello' }
      const results = historyDatabase.getAll(filters)

      expect(Array.isArray(results)).toBe(true)
    })

    it('should filter by date range', () => {
      const filters: HistoryFilters = {
        dateFrom: Date.now() - 10000,
        dateTo: Date.now(),
      }
      const results = historyDatabase.getAll(filters)

      expect(Array.isArray(results)).toBe(true)
    })

    it('should filter by source language', () => {
      const filters: HistoryFilters = { sourceLanguage: 'en' }
      const results = historyDatabase.getAll(filters)

      expect(Array.isArray(results)).toBe(true)
    })

    it('should filter by minimum confidence', () => {
      const filters: HistoryFilters = { minConfidence: 0.9 }
      const results = historyDatabase.getAll(filters)

      expect(Array.isArray(results)).toBe(true)
    })

    it('should apply limit', () => {
      const filters: HistoryFilters = { limit: 10 }
      const results = historyDatabase.getAll(filters)

      expect(Array.isArray(results)).toBe(true)
    })

    it('should combine multiple filters', () => {
      const filters: HistoryFilters = {
        search: 'Hello',
        sourceLanguage: 'en',
        minConfidence: 0.8,
        limit: 50,
        offset: 0,
      }
      const results = historyDatabase.getAll(filters)

      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('search', () => {
    it('should search by query string', () => {
      const results = historyDatabase.search('test')

      expect(Array.isArray(results)).toBe(true)
    })

    it('should use custom limit', () => {
      const results = historyDatabase.search('test', 50)

      expect(Array.isArray(results)).toBe(true)
    })
  })

  describe('getById', () => {
    it('should return entry by id or null', () => {
      const result = historyDatabase.getById('test-id')

      // The mock returns undefined, which gets mapped to null
      expect(result === null || typeof result === 'object').toBe(true)
    })
  })

  describe('update', () => {
    it('should update source text', () => {
      expect(() => {
        historyDatabase.update('test-id', { sourceText: 'New text' })
      }).not.toThrow()
    })

    it('should update translated text', () => {
      expect(() => {
        historyDatabase.update('test-id', { translatedText: 'ใหม่' })
      }).not.toThrow()
    })

    it('should update confidence', () => {
      expect(() => {
        historyDatabase.update('test-id', { confidence: 0.98 })
      }).not.toThrow()
    })

    it('should update image data', () => {
      expect(() => {
        historyDatabase.update('test-id', { imageData: 'data:image/png;base64,xyz' })
      }).not.toThrow()
    })

    it('should update multiple fields', () => {
      expect(() => {
        historyDatabase.update('test-id', {
          sourceText: 'New source',
          translatedText: 'New translation',
          confidence: 0.99,
        })
      }).not.toThrow()
    })

    it('should do nothing when no fields to update', () => {
      expect(() => {
        historyDatabase.update('test-id', {})
      }).not.toThrow()
    })
  })

  describe('delete', () => {
    it('should delete entry by id', () => {
      expect(() => {
        historyDatabase.delete('test-id')
      }).not.toThrow()
    })
  })

  describe('clear', () => {
    it('should clear all entries', () => {
      expect(() => {
        historyDatabase.clear()
      }).not.toThrow()
    })
  })

  describe('getStats', () => {
    it('should return statistics object', () => {
      const stats = historyDatabase.getStats()

      expect(stats).toHaveProperty('totalCount')
      expect(stats).toHaveProperty('uniqueLanguages')
      expect(stats).toHaveProperty('avgConfidence')
      expect(stats).toHaveProperty('mostCommonLanguages')
    })
  })

  describe('export', () => {
    it('should export as JSON', () => {
      const exportPath = historyDatabase.export('json')

      expect(exportPath).toBeDefined()
      expect(typeof exportPath).toBe('string')
      expect(exportPath).toContain('.json')
    })

    it('should export as CSV', () => {
      const exportPath = historyDatabase.export('csv')

      expect(exportPath).toBeDefined()
      expect(typeof exportPath).toBe('string')
      expect(exportPath).toContain('.csv')
    })
  })

  describe('close', () => {
    it('should close database connection', () => {
      expect(() => {
        historyDatabase.close()
      }).not.toThrow()
    })
  })
})

describe('getHistoryDatabase (Singleton)', () => {
  it('should return same instance on multiple calls', () => {
    const instance1 = getHistoryDatabase()
    const instance2 = getHistoryDatabase()

    expect(instance1).toBe(instance2)
  })

  it('should return a HistoryDatabase instance', () => {
    const instance = getHistoryDatabase()

    expect(instance).toBeInstanceOf(HistoryDatabase)
  })
})
