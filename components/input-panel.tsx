"use client"

import React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Mic, Link2, FileText, X } from "lucide-react"

const EXAMPLE_PLACEHOLDERS = [
  "Jot down something you noticed today...",
  "Paste a link, a quote, a thought...",
  "What's on your mind right now?",
  "A meeting note, a half-formed idea...",
  "Something you overheard or read...",
  "A change you noticed, big or small...",
  "Drop in a rough note -- it doesn't need to be perfect...",
]

interface Attachment {
  type: "url" | "file"
  name: string
  content: string
}

interface InputPanelProps {
  onSubmit: (text: string, attachments: Attachment[]) => void
  isProcessing: boolean
  hasUnderstanding: boolean
  noteCount: number
}

export function InputPanel({
  onSubmit,
  isProcessing,
  hasUnderstanding,
  noteCount,
}: InputPanelProps) {
  const [value, setValue] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [showUrlField, setShowUrlField] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % EXAMPLE_PLACEHOLDERS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if ((!trimmed && attachments.length === 0) || isProcessing) return
    onSubmit(trimmed, attachments)
    setValue("")
    setAttachments([])
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [value, attachments, isProcessing, onSubmit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
  }, [])

  // Voice recording
  const toggleRecording = useCallback(async () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        // For now, add a note that voice was captured
        // Full transcription would need a service
        setValue(
          (prev) =>
            prev + (prev ? "\n" : "") + "[Voice note recorded -- describe what you said in your own words]",
        )
      }

      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
    } catch {
      // Microphone not available - that's fine
      setValue(
        (prev) =>
          prev + (prev ? "\n" : "") + "[Microphone not available -- type your thoughts instead]",
      )
    }
  }, [isRecording])

  // File handling
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          const text = reader.result as string
          setAttachments((prev) => [
            ...prev,
            { type: "file", name: file.name, content: text.slice(0, 5000) },
          ])
        }
        // Read text files directly
        if (file.type.startsWith("text/") || file.name.endsWith(".md") || file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
          reader.readAsText(file)
        } else {
          setAttachments((prev) => [
            ...prev,
            { type: "file", name: file.name, content: `[File: ${file.name}]` },
          ])
        }
      })

      e.target.value = ""
    },
    [],
  )

  // URL handling
  const handleAddUrl = useCallback(() => {
    const url = urlInput.trim()
    if (!url) return
    setAttachments((prev) => [
      ...prev,
      { type: "url", name: url, content: url },
    ])
    setUrlInput("")
    setShowUrlField(false)
  }, [urlInput])

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const guidanceText = hasUnderstanding
    ? noteCount < 3
      ? "Keep going -- a few more inputs and the signal gets clearer"
      : "Drop in another note to sharpen the picture"
    : "Drop in notes, thoughts, links, or files -- like tuning across a band and noting what you hear"

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card/50 p-4 transition-colors focus-within:border-primary/30">
        <label
          htmlFor="listener-input"
          className="text-xs text-muted-foreground/60 tracking-wide"
        >
          {guidanceText}
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

        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((att, i) => (
              <span
                key={`att-${att.name}-${i}`}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-border/30 bg-secondary/30 text-secondary-foreground"
              >
                {att.type === "url" ? (
                  <Link2 className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <FileText className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="max-w-[160px] truncate">{att.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Remove ${att.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* URL input */}
        {showUrlField && (
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddUrl()
                }
                if (e.key === "Escape") setShowUrlField(false)
              }}
              placeholder="Paste a URL..."
              className="flex-1 px-3 py-1.5 text-xs rounded border border-border/30 bg-transparent text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-3 py-1.5 text-xs rounded border border-border/30 text-muted-foreground hover:text-foreground transition-colors"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-1.5 rounded transition-colors ${
                isRecording
                  ? "bg-red-500/20 text-red-400"
                  : "text-muted-foreground/40 hover:text-muted-foreground"
              }`}
              aria-label={isRecording ? "Stop recording" : "Record voice note"}
              title={isRecording ? "Stop recording" : "Voice note"}
            >
              <Mic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowUrlField(!showUrlField)}
              className="p-1.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              aria-label="Add URL"
              title="Add a link"
            >
              <Link2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              aria-label="Attach file"
              title="Attach a file"
            >
              <FileText className="h-3.5 w-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.csv,.json,text/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <span className="text-xs text-muted-foreground/20 ml-2">
              Enter to send
            </span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={(!value.trim() && attachments.length === 0) || isProcessing}
            className="px-4 py-1.5 text-xs tracking-wider uppercase rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Tuning..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
