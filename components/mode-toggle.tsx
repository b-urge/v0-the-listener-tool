"use client"

import type { ListenerMode } from "@/lib/types"

interface ModeToggleProps {
  mode: ListenerMode
  onChange: (mode: ListenerMode) => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex items-center rounded-md border border-border/50 overflow-hidden">
      <button
        type="button"
        onClick={() => onChange("interpretive")}
        className={`px-3 py-1.5 text-xs tracking-wider transition-colors ${
          mode === "interpretive"
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={mode === "interpretive"}
      >
        Interpretive
      </button>
      <span className="w-px h-4 bg-border/50" />
      <button
        type="button"
        onClick={() => onChange("instrument")}
        className={`px-3 py-1.5 text-xs tracking-wider transition-colors ${
          mode === "instrument"
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={mode === "instrument"}
      >
        Instrument
      </button>
    </div>
  )
}
