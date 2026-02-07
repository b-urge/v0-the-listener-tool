"use client"

import type { Change } from "@/lib/types"

interface ChangesPanelProps {
  changes: Change[]
}

export function ChangesPanel({ changes }: ChangesPanelProps) {
  if (changes.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-xs text-muted-foreground/40 italic">
          Changes will appear as understanding evolves
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {changes.map((change, index) => (
        <div
          key={change.id}
          className="flex gap-3 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col items-center pt-1.5">
            <span className="block h-1.5 w-1.5 rounded-full bg-primary/40" />
            {index < changes.length - 1 && (
              <span className="block w-px flex-1 bg-border/30 mt-1" />
            )}
          </div>
          <div className="flex flex-col gap-1 pb-3">
            <p className="text-sm text-foreground leading-relaxed">
              {change.description}
            </p>
            <span className="text-xs text-muted-foreground/40">
              {change.timestamp}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
