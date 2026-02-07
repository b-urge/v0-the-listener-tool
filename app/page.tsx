"use client"

import { useState, useCallback } from "react"
import type { Understanding, ListenerMode } from "@/lib/types"
import { processInput } from "./actions"
import { SignalIndicator } from "@/components/signal-indicator"
import { InputPanel } from "@/components/input-panel"
import { UnderstandingPanel } from "@/components/understanding-panel"
import { PatternsPanel } from "@/components/patterns-panel"
import { ChangesPanel } from "@/components/changes-panel"
import { ModeToggle } from "@/components/mode-toggle"

export default function ListenerPage() {
  const [understanding, setUnderstanding] = useState<Understanding | null>(null)
  const [previousInputs, setPreviousInputs] = useState<string[]>([])
  const [mode, setMode] = useState<ListenerMode>("interpretive")
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputCount, setInputCount] = useState(0)

  const handleSubmit = useCallback(
    async (text: string) => {
      setIsProcessing(true)
      try {
        const result = await processInput(
          text,
          previousInputs,
          understanding,
          mode
        )
        if (result) {
          setUnderstanding(result as Understanding)
        }
        setPreviousInputs((prev) => [...prev, text])
        setInputCount((c) => c + 1)
      } catch (error) {
        console.error("[v0] Error processing input:", error)
      } finally {
        setIsProcessing(false)
      }
    },
    [previousInputs, understanding, mode]
  )

  const handleSuppressTheme = useCallback((id: string) => {
    setUnderstanding((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        themes: prev.themes.map((t) =>
          t.id === id ? { ...t, suppressed: true } : t
        ),
      }
    })
  }, [])

  const handleRenameTheme = useCallback((id: string, name: string) => {
    setUnderstanding((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        themes: prev.themes.map((t) =>
          t.id === id ? { ...t, name } : t
        ),
      }
    })
  }, [])

  const handleReweightTheme = useCallback((id: string, weight: number) => {
    setUnderstanding((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        themes: prev.themes.map((t) =>
          t.id === id ? { ...t, weight } : t
        ),
      }
    })
  }, [])

  const suppressed = understanding?.themes.filter((t) => t.suppressed) ?? []

  const handleRestoreTheme = useCallback((id: string) => {
    setUnderstanding((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        themes: prev.themes.map((t) =>
          t.id === id ? { ...t, suppressed: false } : t
        ),
      }
    })
  }, [])

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/30">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="font-serif text-lg tracking-wide text-foreground leading-tight">
              The Listener
            </h1>
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground/40 leading-tight">
              Sense-making for the airwaves
            </p>
          </div>
          <SignalIndicator active={isProcessing} />
        </div>
        <div className="flex items-center gap-4">
          {inputCount > 0 && (
            <span className="text-xs text-muted-foreground/40">
              {inputCount} {inputCount === 1 ? "fragment" : "fragments"} received
            </span>
          )}
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left sidebar - Patterns */}
        <aside className="lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-border/30 p-6 order-2 lg:order-1">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground/50 mb-4">
            Patterns Forming
          </h2>
          <PatternsPanel
            patterns={understanding?.patterns ?? []}
            mode={mode}
          />
        </aside>

        {/* Center - Understanding + Input */}
        <section
          className="flex-1 flex flex-col order-1 lg:order-2"
          aria-label="Current understanding and input"
        >
          <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
            <UnderstandingPanel
              understanding={understanding}
              mode={mode}
              onSuppressTheme={handleSuppressTheme}
              onRenameTheme={handleRenameTheme}
              onReweightTheme={handleReweightTheme}
            />
          </div>

          {/* Suppressed themes bar */}
          {suppressed.length > 0 && (
            <div className="px-6 lg:px-10 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground/30">Suppressed:</span>
                {suppressed.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleRestoreTheme(t.id)}
                    className="px-2 py-0.5 text-xs rounded border border-border/30 text-muted-foreground/40 hover:text-muted-foreground hover:border-border/50 transition-colors line-through"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="p-6 lg:px-10 border-t border-border/30">
            <InputPanel onSubmit={handleSubmit} isProcessing={isProcessing} hasUnderstanding={!!understanding} />
          </div>
        </section>

        {/* Right sidebar - Changes */}
        <aside className="lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-l border-border/30 p-6 order-3">
          <h2 className="text-xs tracking-widest uppercase text-muted-foreground/50 mb-4">
            What Changed Recently
          </h2>
          <ChangesPanel changes={understanding?.changes ?? []} />
        </aside>
      </div>
    </main>
  )
}
