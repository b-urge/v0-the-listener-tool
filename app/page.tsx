"use client"

import { useState, useCallback } from "react"
import { getBandAtPosition } from "@/lib/spectrum-data"
import { WaveformCanvas } from "@/components/waveform-canvas"
import { SpectrumStrip } from "@/components/spectrum-strip"
import { BandDetail } from "@/components/band-detail"
import { BandNav } from "@/components/band-nav"

export default function ListenerPage() {
  const [tunePosition, setTunePosition] = useState(0.35)
  const activeBand = getBandAtPosition(tunePosition)

  const handleTune = useCallback((pos: number) => {
    setTunePosition(pos)
  }, [])

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex flex-col gap-6 px-6 lg:px-10 pt-8 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl tracking-wide text-foreground leading-tight">
              The Listener
            </h1>
            <p className="text-xs text-muted-foreground/50 mt-1 max-w-md leading-relaxed">
              An interactive guide to the radio spectrum. Drag the tuner to
              explore the invisible airwaves that surround you right now.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse-slow" />
            <span className="text-[10px] tracking-widest uppercase text-muted-foreground/30">
              On air
            </span>
          </div>
        </div>
      </header>

      {/* Waveform display */}
      <div className="h-40 lg:h-52 px-6 lg:px-10">
        <WaveformCanvas band={activeBand} tunePosition={tunePosition} />
      </div>

      {/* Tuner strip */}
      <div className="px-6 lg:px-10 py-4">
        <SpectrumStrip
          position={tunePosition}
          onChange={handleTune}
          activeBandId={activeBand?.id ?? null}
        />
      </div>

      {/* Band navigation */}
      <div className="px-6 lg:px-10 py-3 border-b border-border/20">
        <BandNav
          activeBandId={activeBand?.id ?? null}
          onSelect={handleTune}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Band detail - main content */}
        <section className="flex-1 p-6 lg:p-10 lg:max-w-3xl">
          <BandDetail band={activeBand} />
        </section>

        {/* Sidebar - what is ham radio */}
        <aside className="lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l border-border/20 p-6 lg:p-8">
          <div className="lg:sticky lg:top-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xs tracking-widest uppercase text-muted-foreground/40 mb-3">
                What is ham radio?
              </h2>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground/60 leading-relaxed">
                <p>
                  <span className="text-foreground/80">Ham radio</span>{" "}
                  (amateur radio) is a hobby where people build and operate
                  their own radio stations to talk to each other -- sometimes
                  across town, sometimes across the world. There are over 3
                  million operators worldwide.
                </p>
                <p>
                  Unlike your phone or WiFi, ham radio uses no internet and no
                  cell towers. Just a radio, an antenna, and the atmosphere.
                  Signals travel by bouncing off layers of the sky, following the
                  curve of the earth, or even reflecting off the Moon.
                </p>
                <p>
                  What makes it interesting is the{" "}
                  <span className="text-foreground/70">listening</span>. Most of
                  the hobby is scanning through frequencies, picking up
                  fragments of conversation, weather reports, coded messages, and
                  faint signals from thousands of miles away. The spectrum above
                  shows you what{"'"}s out there.
                </p>
              </div>
            </div>

            <div className="border-t border-border/20 pt-5">
              <h3 className="text-xs tracking-widest uppercase text-muted-foreground/40 mb-3">
                Quick facts
              </h3>
              <dl className="flex flex-col gap-3">
                {[
                  {
                    term: "Operators worldwide",
                    def: "Over 3 million licensed hams across every country on Earth",
                  },
                  {
                    term: "Getting started",
                    def: "A handheld radio costs around $30. A license exam is free in many countries.",
                  },
                  {
                    term: "Range",
                    def: "From a few miles on a handheld to literally bouncing signals off the Moon",
                  },
                  {
                    term: "Why it matters",
                    def: "When cell towers and internet go down in disasters, ham radio still works",
                  },
                ].map((item) => (
                  <div key={item.term}>
                    <dt className="text-xs text-foreground/60 font-medium">
                      {item.term}
                    </dt>
                    <dd className="text-xs text-muted-foreground/50 leading-relaxed mt-0.5">
                      {item.def}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border-t border-border/20 pt-5">
              <h3 className="text-xs tracking-widest uppercase text-muted-foreground/40 mb-2">
                About this tool
              </h3>
              <p className="text-xs text-muted-foreground/40 leading-relaxed">
                The Listener is an educational explorer for the electromagnetic
                spectrum. Every frequency range shown here carries real signals
                right now -- radio stations, aircraft, amateur operators,
                satellites, and more. Drag the tuner to discover what{"'"}s
                invisible all around you.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
