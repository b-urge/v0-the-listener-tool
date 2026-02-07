"use client"

import type { DetectedPattern } from "@/lib/text-engine"
import type { ListenerMode } from "@/lib/types"

const strengthLabels: Record<DetectedPattern["strength"], string> = {
  emerging: "Just appearing",
  growing: "Gaining presence",
  steady: "Holding steady",
  fading: "Fading quietly",
}

const strengthDots: Record<DetectedPattern["strength"], number> = {
  emerging: 1,
  growing: 2,
  steady: 3,
  fading: 1,
}

interface PatternsPanelProps {
  patterns: DetectedPattern[]
  mode: ListenerMode
}

export function PatternsPanel({ patterns, mode }: PatternsPanelProps) {
  if (patterns.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-xs text-muted-foreground/40 italic">
          Patterns will surface as notes accumulate
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {patterns.map((pattern) => (
        <div
          key={pattern.id}
          className="flex flex-col gap-1.5 pb-4 border-b border-border/30 last:border-0 animate-fade-in"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">{pattern.label}</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={`dot-${pattern.id}-${i}`}
                  className={`block h-1 w-1 rounded-full ${
                    i < strengthDots[pattern.strength]
                      ? pattern.strength === "fading"
                        ? "bg-muted-foreground/40"
                        : "bg-primary/60"
                      : "bg-muted-foreground/15"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {pattern.description}
          </p>
          {mode === "instrument" && (
            <span className="text-xs text-muted-foreground/40 italic">
              {strengthLabels[pattern.strength]}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
