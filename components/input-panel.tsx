"use client"

import React from "react"

import { useState, useRef, useCallback, useEffect } from "react"

const EXAMPLE_PLACEHOLDERS = [
  "A cluster of short signals appeared near the coast, then faded...",
  "Something is repeating at regular intervals from the east...",
  "Two distant sources seem to be moving closer together...",
  "The usual background hum has gone quiet in one region...",
  "A new, unfamiliar pattern just emerged briefly on a high band...",
  "Activity in the south has been growing steadily denser...",
  "One strong signal that was present for days just disappeared...",
]

interface InputPanelProps {
  onSubmit: (text: string) => void
  isProcessing: boolean
  hasUnderstanding: boolean
}

export function InputPanel({ onSubmit, isProcessing, hasUnderstanding }: InputPanelProps) {
  const [value, setValue] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % EXAMPLE_PLACEHOLDERS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isProcessing) return
    onSubmit(trimmed)
    setValue("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [value, isProcessing, onSubmit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
  }, [])

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card/50 p-4 transition-colors focus-within:border-primary/30">
        <label htmlFor="listener-input" className="text-xs text-muted-foreground/60 tracking-wide">
          {hasUnderstanding
            ? "Add another observation to refine the picture"
            : "Describe what you're noticing -- activity, signals, changes in the air"}
        </label>
        <textarea
          ref={textareaRef}
          id="listener-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={EXAMPLE_PLACEHOLDERS[placeholderIndex]}
          rows={2}
          className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none leading-relaxed"
          disabled={isProcessing}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground/30">
            Press Enter to send
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim() || isProcessing}
            className="px-4 py-1.5 text-xs tracking-wider uppercase rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Listening..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
