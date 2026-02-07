"use client"

import { BANDS, freqToPosition } from "@/lib/spectrum-data"

interface BandNavProps {
  activeBandId: string | null
  onSelect: (position: number) => void
}

export function BandNav({ activeBandId, onSelect }: BandNavProps) {
  return (
    <nav aria-label="Radio band quick navigation">
      <div className="flex flex-wrap gap-1.5">
        {BANDS.map((band) => {
          const isActive = band.id === activeBandId
          const midFreq = (band.startFreq + band.endFreq) / 2
          const pos = freqToPosition(midFreq)

          return (
            <button
              key={band.id}
              type="button"
              onClick={() => onSelect(pos)}
              className={`
                px-3 py-1.5 text-xs rounded-md border transition-all duration-200
                ${
                  isActive
                    ? "border-border/50 bg-card"
                    : "border-border/20 bg-transparent hover:border-border/40 hover:bg-card/30"
                }
              `}
              style={{
                color: isActive ? band.canvasColor : undefined,
                borderColor: isActive ? `${band.canvasColor}30` : undefined,
              }}
            >
              {band.shortName}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
