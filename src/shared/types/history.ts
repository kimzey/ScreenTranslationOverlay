/**
 * Translation History Types
 */

export interface TranslationEntry {
  id: string
  timestamp: number
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  imageData?: string
}

export interface HistoryFilters {
  limit?: number
  offset?: number
  search?: string
  dateFrom?: number
  dateTo?: number
  sourceLanguage?: string
  minConfidence?: number
}

export interface HistoryStats {
  totalCount: number
  uniqueLanguages: number
  avgConfidence: number
  mostCommonLanguages: { language: string; count: number }[]
}
