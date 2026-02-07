"use client"

import type { Band } from "@/lib/spectrum-data"
import { formatFrequency } from "@/lib/spectrum-data"

interface BandDetailProps {
  band: Band | null
}

const signalTypeLabels: Record<string, string> = {
  voice: "Mostly voice transmissions",
  data: "Mostly digital / data signals",
  mixed: "Mix of voice, data, and digital modes",
  noise: "Natural and atmospheric noise",
  music: "Music and broadcast audio",
}

export function BandDetail({ band }: BandDetailProps) {
  if (!band) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
        <div className="h-10 w-10 rounded-full border border-border/20 flex items-center justify-center mb-5">
          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20 animate-pulse-slow" />
        </div>
        <p className="text-sm text-muted-foreground/50 leading-relaxed">
          Drag the tuner above to explore different parts of the radio spectrum.
          Each band has its own character, its own signals, and its own stories.
        </p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Band header */}
      <div className="flex items-start gap-4 mb-6">
        <div
          className="h-3 w-3 rounded-full mt-1.5 shrink-0"
          style={{ backgroundColor: band.canvasColor, opacity: 0.8 }}
        />
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-2xl text-foreground/90 leading-snug">
            {band.name}
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-mono text-muted-foreground/50">
              {formatFrequency(band.startFreq)} &ndash;{" "}
              {formatFrequency(band.endFreq)}
            </span>
            <span className="text-[10px] text-muted-foreground/30">
              {signalTypeLabels[band.signalType]}
            </span>
          </div>
        </div>
      </div>

      {/* Signal strength bar */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-[10px] tracking-widest uppercase text-muted-foreground/30">
          Activity level
        </span>
        <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${band.signalDensity * 100}%`,
              backgroundColor: band.canvasColor,
              opacity: 0.7,
            }}
          />
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/40">
          {Math.round(band.signalDensity * 100)}%
        </span>
      </div>

      {/* Content sections */}
      <div className="flex flex-col gap-6">
        <section>
          <h3 className="text-xs tracking-widest uppercase text-muted-foreground/40 mb-2">
            What is this?
          </h3>
          <p className="text-sm text-foreground/70 leading-relaxed">
            {band.description}
          </p>
        </section>

        <section>
          <h3 className="text-xs tracking-widest uppercase text-muted-foreground/40 mb-2">
            What would you hear?
          </h3>
          <p className="text-sm text-foreground/70 leading-relaxed">
            {band.whatYoudHear}
          </p>
        </section>

        {band.hamUse && (
          <section>
            <h3 className="text-xs tracking-widest uppercase text-muted-foreground/40 mb-2">
              How ham operators use it
            </h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              {band.hamUse}
            </p>
          </section>
        )}

        <section className="border-t border-border/20 pt-5">
          <h3 className="text-xs tracking-widest uppercase text-primary/50 mb-2">
            Did you know?
          </h3>
          <p className="text-sm text-primary/70 leading-relaxed italic">
            {band.funFact}
          </p>
        </section>
      </div>
    </div>
  )
}
