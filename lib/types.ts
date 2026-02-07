export type ListenerMode = "interpretive" | "instrument"

// Re-export the engine types as the canonical types for the UI
export type {
  SuggestedTheme as Theme,
  DetectedPattern as Pattern,
  DetectedChange as Change,
  AnalysisResult as Understanding,
} from "./text-engine"
