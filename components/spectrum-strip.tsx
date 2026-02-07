"use client"

import React from "react"

import { useRef, useCallback, useEffect, useState } from "react"
import {
  BANDS,
  freqToPosition,
  positionToFreq,
  formatFrequency,
} from "@/lib/spectrum-data"

interface SpectrumStripProps {
  position: number
  onChange: (pos: number) => void
  activeBandId: string | null
}

export function SpectrumStrip({
  position,
  onChange,
  activeBandId,
}: SpectrumStripProps) {
  const stripRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredFreq, setHoveredFreq] = useState<number | null>(null)

  const getPositionFromEvent = useCallback(
    (clientX: number) => {
      const el = stripRef.current
      if (!el) return position
      const rect = el.getBoundingClientRect()
      const x = clientX - rect.left
      return Math.max(0, Math.min(1, x / rect.width))
    },
    [position],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true)
      const pos = getPositionFromEvent(e.clientX)
      onChange(pos)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [getPositionFromEvent, onChange],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const pos = getPositionFromEvent(e.clientX)
      setHoveredFreq(positionToFreq(pos))
      if (isDragging) {
        onChange(pos)
      }
    },
    [isDragging, getPositionFromEvent, onChange],
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handlePointerLeave = useCallback(() => {
    setHoveredFreq(null)
    setIsDragging(false)
  }, [])

  // Keyboard support
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? 0.05 : 0.01
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        onChange(Math.max(0, position - step))
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        onChange(Math.min(1, position + step))
      }
    },
    [position, onChange],
  )

  return (
    <div className="flex flex-col gap-2">
      {/* Frequency readout */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] tracking-widest uppercase text-muted-foreground/40">
          Drag to tune across the spectrum
        </span>
        <span className="text-xs font-mono text-primary/80 tabular-nums">
          {formatFrequency(positionToFreq(position))}
        </span>
      </div>

      {/* The strip */}
      <div
        ref={stripRef}
        className="relative h-16 rounded-lg border border-border/30 bg-card/50 cursor-crosshair overflow-hidden select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label="Radio frequency tuner"
        aria-valuemin={3}
        aria-valuemax={30000000}
        aria-valuenow={Math.round(positionToFreq(position))}
        aria-valuetext={formatFrequency(positionToFreq(position))}
        tabIndex={0}
      >
        {/* Band regions */}
        {BANDS.map((band) => {
          const left = freqToPosition(band.startFreq) * 100
          const right = freqToPosition(band.endFreq) * 100
          const width = right - left
          const isActive = band.id === activeBandId

          return (
            <div
              key={band.id}
              className="absolute top-0 bottom-0 transition-opacity duration-300"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                backgroundColor: band.canvasColor,
                opacity: isActive ? 0.25 : 0.08,
              }}
            >
              {/* Band label */}
              {width > 3 && (
                <div className="absolute inset-0 flex items-end justify-center pb-1.5">
                  <span
                    className="text-[9px] tracking-wider uppercase whitespace-nowrap"
                    style={{
                      color: band.canvasColor,
                      opacity: isActive ? 1 : 0.5,
                    }}
                  >
                    {band.shortName}
                  </span>
                </div>
              )}
            </div>
          )
        })}

        {/* Signal activity dots */}
        {BANDS.map((band) => {
          const start = freqToPosition(band.startFreq)
          const end = freqToPosition(band.endFreq)
          const dots = Math.floor(band.signalDensity * 8)
          return Array.from({ length: dots }).map((_, i) => {
            const dotPos = start + ((end - start) * (i + 1)) / (dots + 1)
            return (
              <div
                key={`${band.id}-${i}`}
                className="absolute top-1/2 -translate-y-1/2 h-1 w-1 rounded-full"
                style={{
                  left: `${dotPos * 100}%`,
                  backgroundColor: band.canvasColor,
                  opacity: 0.4 + Math.random() * 0.3,
                }}
              />
            )
          })
        })}

        {/* Tuner needle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/90 pointer-events-none transition-[left] z-10"
          style={{ left: `${position * 100}%` }}
        >
          {/* Needle glow */}
          <div className="absolute -inset-x-3 inset-y-0 bg-foreground/10 blur-sm" />
          {/* Needle head */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-foreground border-2 border-background" />
        </div>

        {/* Hover frequency tooltip */}
        {hoveredFreq !== null && !isDragging && (
          <div
            className="absolute top-1 text-[9px] font-mono text-foreground/60 pointer-events-none -translate-x-1/2"
            style={{
              left: `${freqToPosition(hoveredFreq) * 100}%`,
            }}
          >
            {formatFrequency(hoveredFreq)}
          </div>
        )}
      </div>

      {/* Scale labels */}
      <div className="flex items-center justify-between px-1">
        {["3 kHz", "1 MHz", "30 MHz", "1 GHz", "30 GHz"].map(
          (label, i) => (
            <span
              key={label}
              className="text-[9px] text-muted-foreground/30 font-mono"
            >
              {label}
            </span>
          ),
        )}
      </div>
    </div>
  )
}
