/**
 * CaptureService Tests
 *
 * Test suite for screen capture functionality using TDD approach.
 * Tests are written FIRST before implementation.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, desktopCapturer } from 'electron'
import { CaptureService, CaptureError, CaptureErrorCode } from './capture'
import type { Region, Display, CaptureResult } from '@shared/types/capture'
import { createMockThumbnail } from '../../../vitest.setup'

describe('CaptureService', () => {
  let captureService: CaptureService

  // Mock thumbnail data (simulating PNG screenshot)
  const mockThumbnailBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')

  // Mock Electron display objects (these have a 'label' property)
  const mockPrimaryElectronDisplay = {
    id: 1,
    label: '\\.\DISPLAY1',
    bounds: {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
    },
    scaleFactor: 1,
    internal: false,
    rotation: 0,
    touchSupport: 0,
  }

  const mockSecondaryElectronDisplay = {
    id: 2,
    label: '\\.\DISPLAY2',
    bounds: {
      x: 1920,
      y: 0,
      width: 2560,
      height: 1440,
    },
    scaleFactor: 1.5,
    internal: false,
    rotation: 0,
    touchSupport: 0,
  }

  // Expected display data after mapping
  const expectedPrimaryDisplay: Display = {
    id: '1',
    name: '\\.\DISPLAY1',
    width: 1920,
    height: 1080,
    scaleFactor: 1,
    isPrimary: true,
    bounds: {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
    },
  }

  const expectedSecondaryDisplay: Display = {
    id: '2',
    name: '\\.\DISPLAY2',
    width: 2560,
    height: 1440,
    scaleFactor: 1.5,
    isPrimary: false,
    bounds: {
      x: 1920,
      y: 0,
      width: 2560,
      height: 1440,
    },
  }

  const expectedDisplays: Display[] = [expectedPrimaryDisplay, expectedSecondaryDisplay]

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()

    // Setup default mock implementations
    vi.mocked(screen.getAllDisplays).mockReturnValue([mockPrimaryElectronDisplay, mockSecondaryElectronDisplay] as any)
    vi.mocked(screen.getPrimaryDisplay).mockReturnValue(mockPrimaryElectronDisplay as any)

    captureService = new CaptureService()
  })

  afterEach(() => {
    // Cleanup service after each test
    captureService.destroy?.()
  })

  describe('getDisplays', () => {
    it('should return all available displays', async () => {
      const displays = await captureService.getDisplays()

      expect(displays).toEqual(expectedDisplays)
      expect(screen.getAllDisplays).toHaveBeenCalledOnce()
    })

    it('should return empty array when no displays available', async () => {
      vi.mocked(screen.getAllDisplays).mockReturnValue([] as any)

      const displays = await captureService.getDisplays()

      expect(displays).toEqual([])
    })

    it('should include display metadata for each display', async () => {
      const displays = await captureService.getDisplays()

      expect(displays).toHaveLength(2)
      expect(displays[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        width: expect.any(Number),
        height: expect.any(Number),
        scaleFactor: expect.any(Number),
        isPrimary: expect.any(Boolean),
        bounds: {
          x: expect.any(Number),
          y: expect.any(Number),
          width: expect.any(Number),
          height: expect.any(Number),
        },
      })
    })

    it('should correctly identify primary display', async () => {
      const displays = await captureService.getDisplays()

      const primaryDisplay = displays.find((d) => d.isPrimary)
      expect(primaryDisplay).toBeDefined()
      expect(primaryDisplay?.id).toBe('1')
    })

    it('should handle screen API errors gracefully', async () => {
      vi.mocked(screen.getAllDisplays).mockImplementation(() => {
        throw new Error('Screen API error')
      })

      await expect(captureService.getDisplays()).rejects.toThrow(CaptureError)
      await expect(captureService.getDisplays()).rejects.toMatchObject({
        code: CaptureErrorCode.DISPLAY_ENUMERATION_FAILED,
      })
    })
  })

  describe('getPrimaryDisplay', () => {
    it('should return the primary display', async () => {
      const primaryDisplay = await captureService.getPrimaryDisplay()

      expect(primaryDisplay).toEqual(expectedPrimaryDisplay)
      expect(screen.getPrimaryDisplay).toHaveBeenCalledOnce()
    })

    it('should throw error when no primary display available', async () => {
      vi.mocked(screen.getPrimaryDisplay).mockReturnValue(undefined as any)

      await expect(captureService.getPrimaryDisplay()).rejects.toThrow(CaptureError)
      await expect(captureService.getPrimaryDisplay()).rejects.toMatchObject({
        code: CaptureErrorCode.NO_PRIMARY_DISPLAY,
      })
    })
  })

  describe('captureRegion', () => {
    it('should capture a valid screen region on primary display', async () => {
      const region: Region = {
        x: 100,
        y: 100,
        width: 500,
        height: 300,
      }

      // Mock desktopCapturer.getSources to return a source with NativeImage thumbnail
      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:0:0',
          name: 'Screen 1',
          thumbnail: createMockThumbnail(mockThumbnailBuffer),
        },
      ] as any)

      const result = await captureService.captureRegion(region)

      expect(result).toMatchObject({
        image: expect.any(Buffer),
        region,
        displayId: expectedPrimaryDisplay.id,
        timestamp: expect.any(Number),
      })
      expect(result.image.length).toBeGreaterThan(0)
    })

    it('should capture region on specified display', async () => {
      const region: Region = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }

      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:1:0',
          name: 'Screen 2',
          thumbnail: createMockThumbnail(mockThumbnailBuffer),
        },
      ] as any)

      const result = await captureService.captureRegion(region, expectedSecondaryDisplay.id)

      expect(result.displayId).toBe(expectedSecondaryDisplay.id)
    })

    it('should use primary display when displayId is not provided', async () => {
      const region: Region = {
        x: 50,
        y: 50,
        width: 200,
        height: 200,
      }

      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:0:0',
          name: 'Screen 1',
          thumbnail: createMockThumbnail(mockThumbnailBuffer),
        },
      ] as any)

      const result = await captureService.captureRegion(region)

      expect(result.displayId).toBe(expectedPrimaryDisplay.id)
    })

    it('should throw error for invalid region (negative coordinates)', async () => {
      const invalidRegion: Region = {
        x: -10,
        y: 100,
        width: 500,
        height: 300,
      }

      await expect(captureService.captureRegion(invalidRegion)).rejects.toThrow(CaptureError)
      await expect(captureService.captureRegion(invalidRegion)).rejects.toMatchObject({
        code: CaptureErrorCode.INVALID_REGION,
      })
    })

    it('should throw error for invalid region (negative dimensions)', async () => {
      const invalidRegion: Region = {
        x: 100,
        y: 100,
        width: -100,
        height: 300,
      }

      await expect(captureService.captureRegion(invalidRegion)).rejects.toThrow(CaptureError)
    })

    it('should throw error for zero dimension region', async () => {
      const invalidRegion: Region = {
        x: 100,
        y: 100,
        width: 0,
        height: 300,
      }

      await expect(captureService.captureRegion(invalidRegion)).rejects.toThrow(CaptureError)
    })

    it('should throw error for region outside display bounds', async () => {
      const outOfBoundsRegion: Region = {
        x: 2000,
        y: 100,
        width: 500,
        height: 300,
      }

      await expect(captureService.captureRegion(outOfBoundsRegion)).rejects.toThrow(CaptureError)
      await expect(captureService.captureRegion(outOfBoundsRegion)).rejects.toMatchObject({
        code: CaptureErrorCode.REGION_OUT_OF_BOUNDS,
      })
    })

    it('should throw error for non-existent displayId', async () => {
      const region: Region = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }

      await expect(captureService.captureRegion(region, 'non-existent')).rejects.toThrow(
        CaptureError,
      )
      await expect(captureService.captureRegion(region, 'non-existent')).rejects.toMatchObject({
        code: CaptureErrorCode.DISPLAY_NOT_FOUND,
      })
    })

    it('should throw error when desktopCapturer fails', async () => {
      const region: Region = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }

      vi.mocked(desktopCapturer.getSources).mockRejectedValue(new Error('Capture failed'))

      await expect(captureService.captureRegion(region)).rejects.toThrow(CaptureError)
      await expect(captureService.captureRegion(region)).rejects.toMatchObject({
        code: CaptureErrorCode.CAPTURE_FAILED,
      })
    })

    it('should throw error when no thumbnail in capture result', async () => {
      const region: Region = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      }

      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:0:0',
          name: 'Screen 1',
          thumbnail: undefined as any,
        },
      ] as any)

      await expect(captureService.captureRegion(region)).rejects.toThrow(CaptureError)
    })

    it('should include timestamp in capture result', async () => {
      const beforeCapture = Date.now()
      const region: Region = { x: 0, y: 0, width: 100, height: 100 }

      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:0:0',
          name: 'Screen 1',
          thumbnail: createMockThumbnail(mockThumbnailBuffer),
        },
      ] as any)

      const result = await captureService.captureRegion(region)
      const afterCapture = Date.now()

      expect(result.timestamp).toBeGreaterThanOrEqual(beforeCapture)
      expect(result.timestamp).toBeLessThanOrEqual(afterCapture)
    })
  })

  describe('captureFullScreen', () => {
    it('should capture entire primary display', async () => {
      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:0:0',
          name: 'Screen 1',
          thumbnail: createMockThumbnail(mockThumbnailBuffer),
        },
      ] as any)

      const result = await captureService.captureFullScreen()

      expect(result.region).toEqual({
        x: expectedPrimaryDisplay.bounds.x,
        y: expectedPrimaryDisplay.bounds.y,
        width: expectedPrimaryDisplay.bounds.width,
        height: expectedPrimaryDisplay.bounds.height,
      })
      expect(result.displayId).toBe(expectedPrimaryDisplay.id)
    })

    it('should capture entire specified display', async () => {
      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:1:0',
          name: 'Screen 2',
          thumbnail: createMockThumbnail(mockThumbnailBuffer),
        },
      ] as any)

      const result = await captureService.captureFullScreen(expectedSecondaryDisplay.id)

      expect(result.region).toEqual({
        x: expectedSecondaryDisplay.bounds.x,
        y: expectedSecondaryDisplay.bounds.y,
        width: expectedSecondaryDisplay.bounds.width,
        height: expectedSecondaryDisplay.bounds.height,
      })
      expect(result.displayId).toBe(expectedSecondaryDisplay.id)
    })

    it('should throw error for non-existent display', async () => {
      await expect(captureService.captureFullScreen('invalid-display')).rejects.toThrow(CaptureError)
      await expect(captureService.captureFullScreen('invalid-display')).rejects.toMatchObject({
        code: CaptureErrorCode.DISPLAY_NOT_FOUND,
      })
    })
  })

  describe('validateRegion', () => {
    it('should validate correct region within display bounds', () => {
      const region: Region = { x: 100, y: 100, width: 500, height: 300 }
      const display = expectedPrimaryDisplay

      expect(() => captureService.validateRegion(region, display)).not.toThrow()
    })

    it('should reject region with negative x coordinate', () => {
      const region: Region = { x: -1, y: 100, width: 500, height: 300 }
      const display = expectedPrimaryDisplay

      expect(() => captureService.validateRegion(region, display)).toThrow(CaptureError)
    })

    it('should reject region with negative y coordinate', () => {
      const region: Region = { x: 100, y: -1, width: 500, height: 300 }
      const display = expectedPrimaryDisplay

      expect(() => captureService.validateRegion(region, display)).toThrow(CaptureError)
    })

    it('should reject region with zero width', () => {
      const region: Region = { x: 100, y: 100, width: 0, height: 300 }
      const display = expectedPrimaryDisplay

      expect(() => captureService.validateRegion(region, display)).toThrow(CaptureError)
    })

    it('should reject region with zero height', () => {
      const region: Region = { x: 100, y: 100, width: 500, height: 0 }
      const display = expectedPrimaryDisplay

      expect(() => captureService.validateRegion(region, display)).toThrow(CaptureError)
    })

    it('should reject region extending beyond display width', () => {
      const region: Region = { x: 1500, y: 100, width: 500, height: 300 }
      const display = expectedPrimaryDisplay

      expect(() => captureService.validateRegion(region, display)).toThrow(CaptureError)
    })

    it('should reject region extending beyond display height', () => {
      const region: Region = { x: 100, y: 900, width: 500, height: 300 }
      const display = expectedPrimaryDisplay

      expect(() => captureService.validateRegion(region, display)).toThrow(CaptureError)
    })

    it('should accept region at exact display bounds', () => {
      const region: Region = {
        x: 0,
        y: 0,
        width: expectedPrimaryDisplay.bounds.width,
        height: expectedPrimaryDisplay.bounds.height,
      }
      const display = expectedPrimaryDisplay

      expect(() => captureService.validateRegion(region, display)).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very small region (1x1 pixel)', async () => {
      const tinyRegion: Region = { x: 100, y: 100, width: 1, height: 1 }

      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:0:0',
          name: 'Screen 1',
          thumbnail: createMockThumbnail(mockThumbnailBuffer),
        },
      ] as any)

      const result = await captureService.captureRegion(tinyRegion)

      expect(result.region).toEqual(tinyRegion)
    })

    it('should handle very large region (full screen)', async () => {
      const fullScreenRegion: Region = {
        x: 0,
        y: 0,
        width: expectedPrimaryDisplay.bounds.width,
        height: expectedPrimaryDisplay.bounds.height,
      }

      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:0:0',
          name: 'Screen 1',
          thumbnail: createMockThumbnail(mockThumbnailBuffer),
        },
      ] as any)

      const result = await captureService.captureRegion(fullScreenRegion)

      expect(result.region).toEqual(fullScreenRegion)
    })

    it('should handle displays with scale factor (Retina)', async () => {
      const retinaElectronDisplay = {
        ...mockPrimaryElectronDisplay,
        scaleFactor: 2,
        bounds: {
          x: 0,
          y: 0,
          width: 3840,
          height: 2160,
        },
      }

      vi.mocked(screen.getAllDisplays).mockReturnValue([retinaElectronDisplay] as any)

      const service = new CaptureService()
      const displays = await service.getDisplays()

      expect(displays[0].scaleFactor).toBe(2)
    })

    it('should handle empty sources array from desktopCapturer', async () => {
      const region: Region = { x: 0, y: 0, width: 100, height: 100 }

      vi.mocked(desktopCapturer.getSources).mockResolvedValue([] as any)

      await expect(captureService.captureRegion(region)).rejects.toThrow(CaptureError)
      await expect(captureService.captureRegion(region)).rejects.toMatchObject({
        code: CaptureErrorCode.CAPTURE_FAILED,
      })
    })
  })

  describe('Multi-Monitor Scenarios', () => {
    it('should correctly enumerate multiple displays', async () => {
      const displays = await captureService.getDisplays()

      expect(displays).toHaveLength(2)
      expect(displays[0].id).toBe('1')
      expect(displays[1].id).toBe('2')
    })

    it('should capture from secondary display when specified', async () => {
      const region: Region = { x: 0, y: 0, width: 100, height: 100 }

      vi.mocked(desktopCapturer.getSources).mockResolvedValue([
        {
          id: 'screen:1:0',
          name: 'Screen 2',
          thumbnail: createMockThumbnail(mockThumbnailBuffer),
        },
      ] as any)

      const result = await captureService.captureRegion(region, expectedSecondaryDisplay.id)

      expect(result.displayId).toBe(expectedSecondaryDisplay.id)
    })

    it('should handle displays with different positions', async () => {
      const displays = await captureService.getDisplays()

      // Primary display at (0, 0)
      expect(displays[0].bounds.x).toBe(0)
      expect(displays[0].bounds.y).toBe(0)

      // Secondary display to the right
      expect(displays[1].bounds.x).toBe(1920)
    })
  })

  describe('Error Messages', () => {
    it('should provide descriptive error message for invalid region', async () => {
      const invalidRegion: Region = { x: -10, y: 100, width: 500, height: 300 }

      try {
        await captureService.captureRegion(invalidRegion)
        expect.fail('Should have thrown CaptureError')
      } catch (error) {
        expect(error).toBeInstanceOf(CaptureError)
        expect((error as CaptureError).message).toMatch(/region/i)
      }
    })

    it('should provide descriptive error message for out of bounds region', async () => {
      const outOfBoundsRegion: Region = { x: 3000, y: 100, width: 500, height: 300 }

      try {
        await captureService.captureRegion(outOfBoundsRegion)
        expect.fail('Should have thrown CaptureError')
      } catch (error) {
        expect(error).toBeInstanceOf(CaptureError)
        expect((error as CaptureError).message).toContain('bounds')
      }
    })

    it('should include display information in display not found error', async () => {
      const region: Region = { x: 0, y: 0, width: 100, height: 100 }

      try {
        await captureService.captureRegion(region, 'missing-display')
        expect.fail('Should have thrown CaptureError')
      } catch (error) {
        expect(error).toBeInstanceOf(CaptureError)
        expect((error as CaptureError).code).toBe(CaptureErrorCode.DISPLAY_NOT_FOUND)
        expect((error as CaptureError).message).toContain('missing-display')
      }
    })
  })
})
