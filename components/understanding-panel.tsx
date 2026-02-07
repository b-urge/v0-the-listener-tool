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
      <div className="flex flex-col py-10 lg:py-16 max-w-2xl mx-auto">
        {/* Radio intro */}
        <div className="flex items-start gap-5 mb-10">
          <div className="h-12 w-12 shrink-0 rounded-full border border-primary/20 flex items-center justify-center mt-1">
            <div className="h-2 w-2 rounded-full bg-primary/50 animate-pulse-slow" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-foreground/90 leading-snug mb-1">
              Inspired by ham radio
            </h2>
            <p className="text-xs tracking-widest uppercase text-muted-foreground/30">
              A different way to organize your thoughts
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 mb-10 text-sm leading-relaxed">
          <p className="text-foreground/70">
            <span className="text-foreground/90 font-medium">Ham radio</span>{" "}
            (amateur radio) is a hobby where people build and operate their own
            radio stations to communicate -- sometimes with a neighbor across
            town, sometimes with someone on the other side of the planet. There
            are over 3 million ham operators worldwide.
          </p>
          <p className="text-muted-foreground/70">
            What makes it interesting isn{"'"}t just the talking. It{"'"}s the{" "}
            <span className="text-foreground/80">listening</span>. Operators
            spend most of their time scanning through frequencies, picking up
            fragments: a weather report here, a distress call there, a group of
            friends chatting about their day, a faint signal bouncing off the
            atmosphere from thousands of miles away. None of it arrives neatly
            organized. You hear pieces, and your brain starts connecting them --
            noticing what{"'"}s getting louder, what went quiet, what{"'"}s new.
          </p>
          <p className="text-muted-foreground/60">
            <span className="text-foreground/70">The Listener</span> works the
            same way, but for your own information. Instead of radio signals,
            you drop in your messy, everyday inputs -- notes from a meeting, a
            link you saved, a thought that occurred to you at 2am, a file you
            need to process. The tool scans through everything and starts
            surfacing the patterns: what topics keep coming up, what{"'"}s shifting,
            and what you might want to pay attention to next.
          </p>
          <p className="text-muted-foreground/50">
            You stay in control. When the tool suggests a theme, you can confirm
            it, rename it, amplify it, or suppress it entirely. Nothing runs in
            the cloud -- it all happens right here in your browser.
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              step: "1",
              title: "Drop things in",
              desc: "Type a note, paste a link, attach a file. Doesn't need to be organized.",
            },
            {
              step: "2",
              title: "Themes surface",
              desc: "As you add more, repeated topics and patterns start to appear automatically.",
            },
            {
              step: "3",
              title: "You shape it",
              desc: "Confirm what matters, rename what's mislabeled, suppress what's noise.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col gap-2 p-4 rounded-lg border border-border/20 bg-card/30"
            >
              <span className="text-xs font-medium text-primary/60">
                {item.step}
              </span>
              <p className="text-sm font-medium text-foreground/80">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground/50 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Examples */}
        <div className="flex flex-col gap-3">
          <p className="text-xs tracking-widest uppercase text-muted-foreground/30 mb-1">
            Try dropping in something like
          </p>
          {[
            "Had a long call with the client today. They're worried about the timeline but excited about the new feature direction.",
            "Saved three articles about sustainable packaging this week. Definitely a trend I should look into more.",
            "Team standup felt tense. I think people are overloaded. Maybe we should cut scope for the next sprint.",
          ].map((example) => (
            <div
              key={example}
              className="px-4 py-3 rounded-md border border-border/20 bg-card/30 text-sm text-muted-foreground/60 leading-relaxed italic"
            >
              {`"${example}"`}
            </div>
          ))}
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
        <h2 className="text-xs tracking-widest uppercase text-muted-foreground/50 mb-1">
          {mode === "interpretive"
            ? "What the Listener Hears"
            : "Current Signal Reading"}
        </h2>
        <p className="text-[10px] text-muted-foreground/30 mb-4">
          A summary of everything you{"'"}ve dropped in so far
        </p>
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
          <h3 className="text-xs tracking-widest uppercase text-muted-foreground/50 mb-1">
            Worth Tuning Into
          </h3>
          <p className="text-[10px] text-muted-foreground/30 mb-3">
            Suggested next steps based on what keeps coming up
          </p>
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
