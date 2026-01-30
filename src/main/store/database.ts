/**
 * History Database - Translation History Storage
 *
 * Uses better-sqlite3 for persistent translation history with search
 */

import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'
import type { TranslationEntry, HistoryFilters, HistoryStats } from '@shared/types/history'
import { logger } from '@shared/utils/logger'

export class HistoryDatabase {
  private db: Database.Database
  private dbPath: string

  constructor() {
    // Ensure userData directory exists
    const userDataPath = app.getPath('userData')
    if (!existsSync(userDataPath)) {
      mkdirSync(userDataPath, { recursive: true })
    }

    this.dbPath = path.join(userDataPath, 'history.db')
    this.db = new Database(this.dbPath)
    this.initDatabase()
    logger.info('History database initialized', { path: this.dbPath })
  }

  /**
   * Initialize database schema
   */
  private initDatabase(): void {
    // Create translations table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS translations (
        id TEXT PRIMARY KEY,
        timestamp INTEGER NOT NULL,
        source_text TEXT NOT NULL,
        translated_text TEXT NOT NULL,
        source_language TEXT NOT NULL,
        target_language TEXT NOT NULL,
        confidence REAL NOT NULL,
        image_data TEXT
      )
    `)

    // Create indexes for better query performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_timestamp ON translations(timestamp);
      CREATE INDEX IF NOT EXISTS idx_source_text ON translations(source_text);
      CREATE INDEX IF NOT EXISTS idx_translated_text ON translations(translated_text);
      CREATE INDEX IF NOT EXISTS idx_source_language ON translations(source_language);
    `)

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON')
  }

  /**
   * Add translation to history
   */
  add(entry: TranslationEntry): void {
    const stmt = this.db.prepare(`
      INSERT INTO translations (
        id, timestamp, source_text, translated_text,
        source_language, target_language, confidence, image_data
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    try {
      stmt.run(
        entry.id,
        entry.timestamp,
        entry.sourceText,
        entry.translatedText,
        entry.sourceLanguage,
        entry.targetLanguage,
        entry.confidence,
        entry.imageData || null
      )
      logger.info('Translation added to history', { id: entry.id })
    } catch (error) {
      logger.error('Failed to add translation to history', error)
      throw error
    }
  }

  /**
   * Get all translations with optional filters
   */
  getAll(filters: HistoryFilters = {}): TranslationEntry[] {
    let query = 'SELECT * FROM translations WHERE 1=1'
    const params: any[] = []

    // Apply filters
    if (filters.search) {
      query += ' AND (source_text LIKE ? OR translated_text LIKE ?)'
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm)
    }

    if (filters.dateFrom) {
      query += ' AND timestamp >= ?'
      params.push(filters.dateFrom)
    }

    if (filters.dateTo) {
      query += ' AND timestamp <= ?'
      params.push(filters.dateTo)
    }

    if (filters.sourceLanguage) {
      query += ' AND source_language = ?'
      params.push(filters.sourceLanguage)
    }

    if (filters.minConfidence) {
      query += ' AND confidence >= ?'
      params.push(filters.minConfidence)
    }

    // Order by timestamp descending
    query += ' ORDER BY timestamp DESC'

    // Apply limit and offset
    if (filters.limit) {
      query += ' LIMIT ?'
      params.push(filters.limit)
    }

    if (filters.offset) {
      query += ' OFFSET ?'
      params.push(filters.offset)
    }

    const stmt = this.db.prepare(query)
    const rows = stmt.all(...params) as any[]

    return rows.map(this.mapRowToEntry)
  }

  /**
   * Search translations by query
   */
  search(query: string, limit: number = 100): TranslationEntry[] {
    return this.getAll({ search: query, limit })
  }

  /**
   * Get translation by ID
   */
  getById(id: string): TranslationEntry | null {
    const stmt = this.db.prepare('SELECT * FROM translations WHERE id = ?')
    const row = stmt.get(id) as any
    return row ? this.mapRowToEntry(row) : null
  }

  /**
   * Update translation entry
   */
  update(id: string, data: Partial<TranslationEntry>): void {
    const fields: string[] = []
    const params: any[] = []

    if (data.sourceText !== undefined) {
      fields.push('source_text = ?')
      params.push(data.sourceText)
    }
    if (data.translatedText !== undefined) {
      fields.push('translated_text = ?')
      params.push(data.translatedText)
    }
    if (data.confidence !== undefined) {
      fields.push('confidence = ?')
      params.push(data.confidence)
    }
    if (data.imageData !== undefined) {
      fields.push('image_data = ?')
      params.push(data.imageData)
    }

    if (fields.length === 0) return

    params.push(id)
    const stmt = this.db.prepare(`UPDATE translations SET ${fields.join(', ')} WHERE id = ?`)

    try {
      stmt.run(...params)
      logger.info('Translation updated', { id })
    } catch (error) {
      logger.error('Failed to update translation', error)
      throw error
    }
  }

  /**
   * Delete translation by ID
   */
  delete(id: string): void {
    const stmt = this.db.prepare('DELETE FROM translations WHERE id = ?')
    stmt.run(id)
    logger.info('Translation deleted', { id })
  }

  /**
   * Clear all history
   */
  clear(): void {
    const stmt = this.db.prepare('DELETE FROM translations')
    stmt.run()
    logger.info('History cleared')
  }

  /**
   * Get statistics
   */
  getStats(): HistoryStats {
    // Total count
    const countStmt = this.db.prepare('SELECT COUNT(*) as count FROM translations')
    const { count } = countStmt.get() as { count: number }

    // Unique languages
    const langStmt = this.db.prepare(`
      SELECT COUNT(DISTINCT source_language) as count
      FROM translations
    `)
    const { count: uniqueLanguages } = langStmt.get() as { count: number }

    // Average confidence
    const confStmt = this.db.prepare('SELECT AVG(confidence) as avg_conf FROM translations')
    const { avg_conf: avgConfidence } = confStmt.get() as { avg_conf: number }

    // Most common languages
    const commonStmt = this.db.prepare(`
      SELECT source_language as language, COUNT(*) as count
      FROM translations
      GROUP BY source_language
      ORDER BY count DESC
      LIMIT 5
    `)
    const mostCommonLanguages = commonStmt.all() as { language: string; count: number }[]

    return {
      totalCount: count,
      uniqueLanguages,
      avgConfidence: avgConfidence || 0,
      mostCommonLanguages
    }
  }

  /**
   * Export history to JSON or CSV
   */
  export(format: 'json' | 'csv'): string {
    const entries = this.getAll()
    const exportPath = path.join(app.getPath('userData'), `history_export_${Date.now()}.${format}`)

    if (format === 'json') {
      const fs = require('fs')
      fs.writeFileSync(exportPath, JSON.stringify(entries, null, 2))
    } else {
      // CSV format
      const headers = ['ID', 'Timestamp', 'Source Text', 'Translated Text', 'Source Language', 'Target Language', 'Confidence']
      const rows = entries.map(e => [
        e.id,
        e.timestamp,
        `"${e.sourceText.replace(/"/g, '""')}"`,
        `"${e.translatedText.replace(/"/g, '""')}"`,
        e.sourceLanguage,
        e.targetLanguage,
        e.confidence
      ])
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      const fs = require('fs')
      fs.writeFileSync(exportPath, csv)
    }

    logger.info('History exported', { path: exportPath, format })
    return exportPath
  }

  /**
   * Map database row to TranslationEntry
   */
  private mapRowToEntry(row: any): TranslationEntry {
    return {
      id: row.id,
      timestamp: row.timestamp,
      sourceText: row.source_text,
      translatedText: row.translated_text,
      sourceLanguage: row.source_language,
      targetLanguage: row.target_language,
      confidence: row.confidence,
      imageData: row.image_data || undefined
    }
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close()
    logger.info('History database closed')
  }

  /**
   * Get database path (for debugging)
   */
  getPath(): string {
    return this.dbPath
  }
}

// Singleton instance
let historyDatabaseInstance: HistoryDatabase | null = null

export function getHistoryDatabase(): HistoryDatabase {
  if (!historyDatabaseInstance) {
    historyDatabaseInstance = new HistoryDatabase()
  }
  return historyDatabaseInstance
}
