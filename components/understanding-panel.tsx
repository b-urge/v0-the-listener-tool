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
      <div className="flex flex-col items-center justify-center py-12 lg:py-20 text-center max-w-lg mx-auto">
        <div className="h-16 w-16 rounded-full border border-border/30 flex items-center justify-center mb-6">
          <div className="h-2 w-2 rounded-full bg-primary/40 animate-pulse-slow" />
        </div>
        <h2 className="font-serif text-2xl text-foreground/80 leading-relaxed mb-3 text-balance">
          The Listener is waiting for signals
        </h2>
        <p className="text-sm text-muted-foreground/50 leading-relaxed mb-8">
          Describe what you notice happening around you -- observations about
          activity, signals, movement, or changes. Fragments are fine. The
          Listener will weave them into a picture over time.
        </p>

        <div className="w-full flex flex-col gap-3 text-left">
          <p className="text-xs tracking-widest uppercase text-muted-foreground/30 mb-1">
            Try something like
          </p>
          {[
            "A burst of short transmissions appeared near the coast, then went quiet",
            "Something is repeating steadily from the east, like a heartbeat",
            "The usual background noise dropped off suddenly in one area",
          ].map((example) => (
            <div
              key={example}
              className="px-4 py-3 rounded-md border border-border/20 bg-card/30 text-sm text-muted-foreground/60 leading-relaxed italic"
            >
              {`"${example}"`}
            </div>
          ))}
          <p className="text-xs text-muted-foreground/30 mt-2 leading-relaxed">
            Each observation you add will be folded into the understanding.
            Over time, themes will emerge, patterns will form, and gentle next
            steps will appear. You can rename, amplify, or suppress any theme
            that surfaces.
          </p>
        </div>
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
