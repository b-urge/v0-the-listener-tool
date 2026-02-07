"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"

interface InputPanelProps {
  onSubmit: (text: string) => void
  isProcessing: boolean
}

export function InputPanel({ onSubmit, isProcessing }: InputPanelProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
    <div className="relative">
      <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card/50 p-4 transition-colors focus-within:border-primary/30">
        <label htmlFor="listener-input" className="sr-only">
          Enter fragments of activity
        </label>
        <textarea
          ref={textareaRef}
          id="listener-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Enter fragments of activity..."
          rows={2}
          className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed"
          disabled={isProcessing}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground/40">
            Shift + Enter for new line
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim() || isProcessing}
            className="px-4 py-1.5 text-xs tracking-wider uppercase rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
