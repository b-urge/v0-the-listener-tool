"use client"

import { useState, useRef, useEffect } from "react"
import type { Theme, ListenerMode } from "@/lib/types"

interface ThemeTagProps {
  theme: Theme
  mode: ListenerMode
  onSuppress: (id: string) => void
  onRename: (id: string, name: string) => void
  onReweight: (id: string, weight: number) => void
}

export function ThemeTag({
  theme,
  mode,
  onSuppress,
  onRename,
  onReweight,
}: ThemeTagProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(theme.name)
  const [showMenu, setShowMenu] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMenu])

  const handleRename = () => {
    if (editValue.trim() && editValue.trim() !== theme.name) {
      onRename(theme.id, editValue.trim())
    }
    setIsEditing(false)
    setShowMenu(false)
  }

  const weightOpacity = Math.max(0.3, Math.min(1, theme.weight))

  return (
    <div className="relative" ref={menuRef}>
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename()
            if (e.key === "Escape") {
              setEditValue(theme.name)
              setIsEditing(false)
            }
          }}
          className="px-3 py-1.5 text-xs rounded border border-primary/30 bg-card text-foreground focus:outline-none focus:border-primary/50"
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className="px-3 py-1.5 text-xs rounded border border-border/50 bg-secondary/50 text-secondary-foreground hover:border-primary/30 transition-colors cursor-pointer"
          style={{ opacity: weightOpacity }}
        >
          {theme.name}
          {mode === "instrument" && (
            <span className="ml-2 text-muted-foreground/50">
              {theme.description}
            </span>
          )}
        </button>
      )}

      {showMenu && !isEditing && (
        <div className="absolute top-full left-0 mt-1 z-10 bg-card border border-border rounded-md shadow-lg py-1 min-w-[140px]">
          <button
            type="button"
            onClick={() => {
              setIsEditing(true)
              setShowMenu(false)
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50 transition-colors"
          >
            Rename
          </button>
          <button
            type="button"
            onClick={() => {
              onReweight(theme.id, Math.min(1, theme.weight + 0.2))
              setShowMenu(false)
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50 transition-colors"
          >
            Amplify
          </button>
          <button
            type="button"
            onClick={() => {
              onReweight(theme.id, Math.max(0.2, theme.weight - 0.2))
              setShowMenu(false)
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50 transition-colors"
          >
            Diminish
          </button>
          <button
            type="button"
            onClick={() => {
              onSuppress(theme.id)
              setShowMenu(false)
            }}
            className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors"
          >
            Suppress
          </button>
        </div>
      )}
    </div>
  )
}
