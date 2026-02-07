"use client"

import { useRef, useEffect, useCallback } from "react"
import type { Band } from "@/lib/spectrum-data"

interface WaveformCanvasProps {
  band: Band | null
  tunePosition: number // 0-1
}

export function WaveformCanvas({ band, tunePosition }: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height

    timeRef.current += 0.02

    // Clear
    ctx.clearRect(0, 0, w, h)

    // Background noise - subtle static across the whole canvas
    const noiseIntensity = band ? 0.03 : 0.06
    for (let i = 0; i < w * h * noiseIntensity; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const alpha = Math.random() * 0.15
      ctx.fillStyle = `rgba(180, 160, 140, ${alpha})`
      ctx.fillRect(x, y, 1, 1)
    }

    // Center line
    ctx.strokeStyle = "rgba(180, 160, 140, 0.08)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, h / 2)
    ctx.lineTo(w, h / 2)
    ctx.stroke()

    if (!band) {
      // No band selected - draw gentle ambient noise
      ctx.strokeStyle = "rgba(180, 160, 140, 0.15)"
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < w; x++) {
        const noise =
          Math.sin(x * 0.05 + timeRef.current) * 4 +
          Math.sin(x * 0.02 + timeRef.current * 0.7) * 6 +
          (Math.random() - 0.5) * 8
        const y = h / 2 + noise
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      animRef.current = requestAnimationFrame(draw)
      return
    }

    const color = band.canvasColor
    const density = band.signalDensity
    const t = timeRef.current

    // Main waveform - varies by signal type
    ctx.lineWidth = 1.5
    const parseColor = (hex: string) => {
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return { r, g, b }
    }
    const { r, g, b } = parseColor(color)

    // Primary signal wave
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`
    ctx.beginPath()
    for (let x = 0; x < w; x++) {
      let y = h / 2
      const xn = x / w

      if (band.signalType === "voice") {
        // Voice: irregular, organic amplitude modulation
        const carrier = Math.sin(xn * 40 + t * 3) * 20 * density
        const mod1 = Math.sin(xn * 7 + t * 1.3) * 15 * density
        const mod2 = Math.sin(xn * 13 + t * 0.8) * 8 * density
        const breath = Math.sin(t * 0.5 + xn * 3) * 0.5 + 0.5
        y += (carrier + mod1 + mod2) * breath
      } else if (band.signalType === "music") {
        // Music: richer harmonics, more regular
        const fundamental = Math.sin(xn * 30 + t * 2) * 22 * density
        const harmonic2 = Math.sin(xn * 60 + t * 4) * 8 * density
        const harmonic3 = Math.sin(xn * 90 + t * 6) * 4 * density
        const envelope = Math.sin(t * 0.3 + xn * 2) * 0.3 + 0.7
        y += (fundamental + harmonic2 + harmonic3) * envelope
      } else if (band.signalType === "data") {
        // Data: sharp, digital-looking pulses
        const baseWave = Math.sin(xn * 50 + t * 5)
        const quantized = baseWave > 0 ? 1 : -1
        const pulse = quantized * 15 * density
        const jitter = (Math.random() - 0.5) * 4 * density
        y += pulse + jitter
      } else if (band.signalType === "noise") {
        // Noise: atmospheric, rumbling
        const low = Math.sin(xn * 5 + t * 0.5) * 18 * density
        const mid = Math.sin(xn * 15 + t * 1.5) * 10 * density
        const high = (Math.random() - 0.5) * 12 * density
        y += low + mid + high
      } else {
        // Mixed: combination
        const sig1 = Math.sin(xn * 35 + t * 2.5) * 16 * density
        const sig2 = Math.sin(xn * 12 + t * 1.2) * 10 * density
        const burst =
          Math.sin(t * 0.7 + xn * 5) > 0.6
            ? (Math.random() - 0.5) * 20 * density
            : 0
        y += sig1 + sig2 + burst
      }

      // Add subtle noise to everything
      y += (Math.random() - 0.5) * 3

      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Secondary, fainter wave layer
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.2)`
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let x = 0; x < w; x++) {
      const xn = x / w
      const y =
        h / 2 +
        Math.sin(xn * 20 + t * 1.5 + 2) * 25 * density +
        Math.sin(xn * 8 + t * 0.6) * 12 * density +
        (Math.random() - 0.5) * 5
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Occasional signal bursts (intermittent bright spots)
    if (Math.random() < density * 0.3) {
      const burstX = Math.random() * w
      const burstW = 20 + Math.random() * 60
      const gradient = ctx.createRadialGradient(
        burstX,
        h / 2,
        0,
        burstX,
        h / 2,
        burstW,
      )
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`)
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
      ctx.fillStyle = gradient
      ctx.fillRect(burstX - burstW, 0, burstW * 2, h)
    }

    animRef.current = requestAnimationFrame(draw)
  }, [band, tunePosition])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-label={
          band
            ? `Animated waveform visualization for the ${band.name} band`
            : "Ambient radio static visualization"
        }
        role="img"
      />
      {/* Glow effect at edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  )
}
