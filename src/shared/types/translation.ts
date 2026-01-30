/**
 * Translation Types
 */

export interface TranslationResult {
  id: string
  sourceText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  timestamp: number
  cached: boolean
  ocrConfidence?: number
  processingTime?: number
  imageData?: string
}
