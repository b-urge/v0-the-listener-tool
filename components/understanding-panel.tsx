"use client"

import type { Understanding, ListenerMode } from "@/lib/types"
import { ThemeTag } from "./theme-tag"

interface UnderstandingPanelProps {
  understanding: Understanding | null
  mode: ListenerMode
  onSuppressTheme: (id: string) => void
  onRenameTheme: (id: string, name: string) => void
  onReweightTheme: (id: string, weight: number) => void
}

export function UnderstandingPanel({
  understanding,
  mode,
  onSuppressTheme,
  onRenameTheme,
  onReweightTheme,
}: UnderstandingPanelProps) {
  if (!understanding) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-full border border-border/30 flex items-center justify-center mb-6">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        </div>
        <p className="font-serif text-xl text-muted-foreground/60 leading-relaxed">
          Nothing yet. Begin by entering fragments of activity below.
        </p>
        <p className="text-xs text-muted-foreground/30 mt-3 tracking-wide">
          The Listener will find meaning as patterns emerge.
        </p>
      </div>
    )
  }

  const activeThemes = understanding.themes.filter((t) => !t.suppressed)

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Summary */}
      <div>
        <h2 className="text-xs tracking-widest uppercase text-muted-foreground/50 mb-4">
          Current Understanding
        </h2>
        <p className="font-serif text-lg text-foreground leading-relaxed">
          {understanding.summary}
        </p>
      </div>

      {/* Themes */}
      {activeThemes.length > 0 && (
        <div>
          <h3 className="text-xs tracking-widest uppercase text-muted-foreground/50 mb-3">
            {mode === "interpretive" ? "Emerging Themes" : "Active Bands"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeThemes.map((theme) => (
              <ThemeTag
                key={theme.id}
                theme={theme}
                mode={mode}
                onSuppress={onSuppressTheme}
                onRename={onRenameTheme}
                onReweight={onReweightTheme}
              />
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {understanding.nextSteps.length > 0 && (
        <div>
          <h3 className="text-xs tracking-widest uppercase text-muted-foreground/50 mb-3">
            You Might Consider
          </h3>
          <ul className="flex flex-col gap-2">
            {understanding.nextSteps.map((step, i) => (
              <li
                key={`step-${i}`}
                className="text-sm text-muted-foreground leading-relaxed pl-4 border-l border-primary/20"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
