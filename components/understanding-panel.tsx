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
      <div className="flex flex-col items-center justify-center py-12 lg:py-20 text-center max-w-xl mx-auto">
        <div className="h-16 w-16 rounded-full border border-border/30 flex items-center justify-center mb-6">
          <div className="h-2 w-2 rounded-full bg-primary/40 animate-pulse-slow" />
        </div>
        <h2 className="font-serif text-2xl text-foreground/80 leading-relaxed mb-4 text-balance">
          The Listener is waiting for signals
        </h2>

        {/* Concept explanation */}
        <div className="mb-8 max-w-md text-left">
          <p className="text-sm text-muted-foreground/60 leading-relaxed mb-3">
            Amateur radio (or ham radio) is a hobby where people use radios to
            talk to each other -- sometimes across town, sometimes across the
            world. Operators spend a lot of time just listening: scanning
            through frequencies, catching bits of conversation, noticing when
            things get busy or go quiet.
          </p>
          <p className="text-sm text-muted-foreground/50 leading-relaxed">
            <span className="text-foreground/70">The Listener</span> is a tool
            for that kind of noticing. Tell it what you{"'"}re hearing on the
            radio -- even just small things -- and it{"'"}ll build up a picture of
            what{"'"}s going on over time. You don{"'"}t need to be precise. Just
            describe what you notice.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 text-left">
          <p className="text-xs tracking-widest uppercase text-muted-foreground/30 mb-1">
            Try something like
          </p>
          {[
            "I keep hearing the same voice on one channel, repeating something every few minutes",
            "There's a lot more chatter tonight than usual -- people seem to be talking about a storm",
            "Everything went really quiet on the frequencies I usually listen to",
          ].map((example) => (
            <div
              key={example}
              className="px-4 py-3 rounded-md border border-border/20 bg-card/30 text-sm text-muted-foreground/60 leading-relaxed italic"
            >
              {`"${example}"`}
            </div>
          ))}
          <p className="text-xs text-muted-foreground/30 mt-2 leading-relaxed">
            Each thing you share gets added to the bigger picture. Over time,
            themes show up, patterns form, and you{"'"}ll see suggestions for what
            to pay attention to next.
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
