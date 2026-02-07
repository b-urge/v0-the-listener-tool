"use client"

export function SignalIndicator({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <span
          className={`block h-2 w-2 rounded-full transition-colors duration-1000 ${
            active
              ? "bg-primary animate-pulse-slow"
              : "bg-muted-foreground/30"
          }`}
        />
        {active && (
          <span className="absolute h-4 w-4 rounded-full bg-primary/20 animate-pulse-slow" />
        )}
      </div>
      <span className="text-xs tracking-widest uppercase text-muted-foreground">
        {active ? "Listening" : "Quiet"}
      </span>
    </div>
  )
}
