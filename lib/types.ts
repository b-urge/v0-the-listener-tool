export interface Theme {
  id: string
  name: string
  description: string
  weight: number
  suppressed: boolean
}

export interface Pattern {
  id: string
  label: string
  description: string
  strength: "emerging" | "growing" | "steady" | "fading"
}

export interface Change {
  id: string
  description: string
  timestamp: string
}

export interface Understanding {
  summary: string
  themes: Theme[]
  patterns: Pattern[]
  changes: Change[]
  nextSteps: string[]
}

export type ListenerMode = "interpretive" | "instrument"
