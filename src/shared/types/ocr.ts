/**
 * OCR Types
 */

export interface OcrOptions {
  language?: string
  confidence?: number
  preprocess?: boolean
}

export interface OcrResult {
  text: string
  confidence: number
  language: string
  lines: OcrLine[]
}

export interface OcrLine {
  text: string
  confidence: number
  boundingBox: BoundingBox
}

export interface BoundingBox {
  x0: number
  y0: number
  x1: number
  y1: number
}
