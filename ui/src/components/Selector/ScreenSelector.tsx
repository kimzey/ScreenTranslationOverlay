/**
 * Screen Selector Component
 *
 * Fullscreen overlay for selecting screen region to capture
 */

import { useState, useEffect, useRef } from 'react'

export function ScreenSelector() {
  const [selecting, setSelecting] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: MouseEvent) => {
    setSelecting(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setCurrentPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (selecting) {
      setCurrentPos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    if (selecting) {
      setSelecting(false)
      // Calculate selection and send to main process
      const selection = {
        x: Math.min(startPos.x, currentPos.x),
        y: Math.min(startPos.y, currentPos.y),
        width: Math.abs(currentPos.x - startPos.x),
        height: Math.abs(currentPos.y - startPos.y)
      }
      console.log('Selection:', selection)
      // TODO: Send to main process for capture
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [selecting, startPos, currentPos])

  const selectionStyle = {
    left: `${Math.min(startPos.x, currentPos.x)}px`,
    top: `${Math.min(startPos.y, currentPos.y)}px`,
    width: `${Math.abs(currentPos.x - startPos.x)}px`,
    height: `${Math.abs(currentPos.y - startPos.y)}px`
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black/50 cursor-crosshair"
      style={{ backdropFilter: 'blur(2px)' }}
    >
      {selecting && (
        <div
          className="absolute border-2 border-primary-500 bg-primary-500/10"
          style={selectionStyle}
        >
          <div className="absolute -top-6 left-0 bg-dark-900 text-white text-xs px-2 py-1 rounded">
            {Math.abs(currentPos.x - startPos.x)} × {Math.abs(currentPos.y - startPos.y)}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
        ลากเลือกบริเวณที่ต้องการ หรือกด ESC เพื่อยกเลิก
      </div>
    </div>
  )
}
