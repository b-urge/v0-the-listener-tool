"use client"

import type { ListenerMode } from "@/lib/types"
import type { AnalysisResult, SuggestedTheme } from "@/lib/text-engine"
import { ThemeTag } from "./theme-tag"

interface UnderstandingPanelProps {
  understanding: AnalysisResult | null
  mode: ListenerMode
  onSuppressTheme: (id: string) => void
  onRenameTheme: (id: string, name: string) => void
  onReweightTheme: (id: string, weight: number) => void
  onConfirmTheme: (id: string) => void
}

export function UnderstandingPanel({
  understanding,
  mode,
  onSuppressTheme,
  onRenameTheme,
  onReweightTheme,
  onConfirmTheme,
}: UnderstandingPanelProps) {
  if (!understanding) {
    return (
      <div className="flex flex-col items-center justify-center py-12 lg:py-20 text-center max-w-xl mx-auto">
        <div className="h-16 w-16 rounded-full border border-border/30 flex items-center justify-center mb-6">
          <div className="h-2 w-2 rounded-full bg-primary/40 animate-pulse-slow" />
        </div>
        <h2 className="font-serif text-2xl text-foreground/80 leading-relaxed mb-4 text-balance">
          The Listener is waiting
        </h2>

        {/* Concept intro */}
        <div className="mb-8 max-w-md text-left">
          <p className="text-sm text-muted-foreground/60 leading-relaxed mb-3">
            Ham radio operators spend hours scanning the airwaves, catching
            fragments of conversation and noting what{"'"}s active, what{"'"}s quiet,
            and what just changed. Over time, a picture forms from all those
            small observations.
          </p>
          <p className="text-sm text-muted-foreground/50 leading-relaxed mb-3">
            <span className="text-foreground/70">The Listener</span> borrows
            that idea. It{"'"}s a tool for turning messy input -- notes, links,
            files, stray thoughts -- into something organized. Drop things in,
            and it{"'"}ll find the threads. You stay in control of what matters.
          </p>
          <p className="text-sm text-muted-foreground/40 leading-relaxed">
            No AI, no cloud processing. Everything runs right here in your
            browser.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3 text-left">
          <p className="text-xs tracking-widest uppercase text-muted-foreground/30 mb-1">
            Try dropping in something like
          </p>
          {[
            "Need to follow up with the design team about the new layout. Also, budget review is Thursday.",
            "Interesting article about remote work trends. Reminds me of what Sarah mentioned last week.",
            "Project deadline moved to March. Team morale seems low. Should probably address that.",
          ].map((example) => (
            <div
              key={example}
              className="px-4 py-3 rounded-md border border-border/20 bg-card/30 text-sm text-muted-foreground/60 leading-relaxed italic"
            >
              {`"${example}"`}
            </div>
          ))}
          <p className="text-xs text-muted-foreground/30 mt-2 leading-relaxed">
            Each note gets added to the picture. Themes will appear as topics
            repeat. You can confirm, rename, or suppress any theme that shows
            up. Attach files or links for richer input.
          </p>
        </div>
      </div>
    )
  }

  const activeThemes = understanding.suggestedThemes.filter(
    (t) => !t.suppressed,
  )
  const confirmed = activeThemes.filter((t) => t.confirmed)
  const suggested = activeThemes.filter((t) => !t.confirmed)

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

      {/* Confirmed themes */}
      {confirmed.length > 0 && (
        <div>
          <h3 className="text-xs tracking-widest uppercase text-muted-foreground/50 mb-3">
            {mode === "interpretive" ? "Your Themes" : "Confirmed Signals"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {confirmed.map((theme) => (
              <ThemeTag
                key={theme.id}
                theme={theme}
                mode={mode}
                onSuppress={onSuppressTheme}
                onRename={onRenameTheme}
                onReweight={onReweightTheme}
                onConfirm={onConfirmTheme}
              />
            ))}
          </div>
        </div>
      )}

      {/* Suggested themes (not yet confirmed) */}
      {suggested.length > 0 && (
        <div>
          <h3 className="text-xs tracking-widest uppercase text-muted-foreground/50 mb-2">
            {mode === "interpretive"
              ? "Suggested Themes"
              : "Unconfirmed Signals"}
          </h3>
          <p className="text-xs text-muted-foreground/40 mb-3">
            Click a theme to confirm it, or open the menu to rename, amplify,
            or suppress.
          </p>
          <div className="flex flex-wrap gap-2">
            {suggested.map((theme) => (
              <ThemeTag
                key={theme.id}
                theme={theme}
                mode={mode}
                onSuppress={onSuppressTheme}
                onRename={onRenameTheme}
                onReweight={onReweightTheme}
                onConfirm={onConfirmTheme}
                isSuggestion
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
