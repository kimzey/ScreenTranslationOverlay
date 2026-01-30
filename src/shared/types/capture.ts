/**
 * Screen Capture Types
 */

export interface Region {
  x: number
  y: number
  width: number
  height: number
}

export interface Display {
  id: string
  name: string
  width: number
  height: number
  scaleFactor: number
  isPrimary: boolean
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface CaptureResult {
  image: Buffer
  region: Region
  displayId: string
  timestamp: number
}
