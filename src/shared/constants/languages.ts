/**
 * Language Constants
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'auto', name: 'Auto Detect', nativeName: 'Automatic' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' }
] as const

export const TESSERACT_LANGUAGES = {
  'en': 'eng',
  'ja': 'jpn',
  'ko': 'kor',
  'zh-CN': 'chi_sim',
  'zh-TW': 'chi_tra',
  'th': 'tha'
} as const

export const GOOGLE_TRANSLATE_LANGUAGES = {
  'auto': 'auto',
  'en': 'en',
  'ja': 'ja',
  'ko': 'ko',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'th': 'th'
} as const
