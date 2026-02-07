// Client-side text analysis engine
// Extracts keywords, detects themes, tracks patterns — no AI needed

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "dare",
  "ought", "used", "it", "its", "i", "me", "my", "we", "our", "you",
  "your", "he", "she", "they", "them", "his", "her", "this", "that",
  "these", "those", "what", "which", "who", "whom", "how", "when",
  "where", "why", "all", "each", "every", "both", "few", "more",
  "most", "other", "some", "such", "no", "not", "only", "own", "same",
  "so", "than", "too", "very", "just", "because", "as", "until",
  "while", "about", "between", "through", "during", "before", "after",
  "above", "below", "up", "down", "out", "off", "over", "under",
  "again", "further", "then", "once", "here", "there", "also", "been",
  "if", "into", "like", "really", "lot", "much", "going", "getting",
  "got", "think", "thing", "things", "something", "anything", "seem",
  "seems", "seemed", "still", "even", "way", "make", "made", "back",
  "now", "keep", "let", "say", "said", "go", "get", "know", "see",
  "come", "take", "want", "look", "give", "use", "find", "tell",
])

export interface ExtractedKeyword {
  word: string
  count: number
  sources: number[] // indices of inputs containing this word
}

export interface SuggestedTheme {
  id: string
  name: string
  keywords: string[]
  weight: number // 0-1, based on frequency
  confirmed: boolean
  suppressed: boolean
}

export interface DetectedPattern {
  id: string
  label: string
  description: string
  strength: "emerging" | "growing" | "steady" | "fading"
}

export interface DetectedChange {
  id: string
  description: string
  timestamp: string
}

export interface AnalysisResult {
  keywords: ExtractedKeyword[]
  suggestedThemes: SuggestedTheme[]
  patterns: DetectedPattern[]
  changes: DetectedChange[]
  nextSteps: string[]
  summary: string
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
}

// Extract bigrams (two-word phrases) for richer theme detection
function extractBigrams(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1)

  const bigrams: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i]
    const b = words[i + 1]
    if (!STOP_WORDS.has(a) && !STOP_WORDS.has(b) && a.length > 2 && b.length > 2) {
      bigrams.push(`${a} ${b}`)
    }
  }
  return bigrams
}

export function extractKeywords(inputs: string[]): ExtractedKeyword[] {
  const wordMap = new Map<string, { count: number; sources: Set<number> }>()

  inputs.forEach((input, idx) => {
    const words = tokenize(input)
    const bigrams = extractBigrams(input)

    const allTerms = [...words, ...bigrams]
    const seen = new Set<string>()

    for (const term of allTerms) {
      if (seen.has(term)) continue
      seen.add(term)

      const existing = wordMap.get(term)
      if (existing) {
        existing.count += 1
        existing.sources.add(idx)
      } else {
        wordMap.set(term, { count: 1, sources: new Set([idx]) })
      }
    }
  })

  return Array.from(wordMap.entries())
    .map(([word, data]) => ({
      word,
      count: data.count,
      sources: Array.from(data.sources),
    }))
    .sort((a, b) => b.count - a.count)
}

// Group related keywords into themes by co-occurrence
export function suggestThemes(
  keywords: ExtractedKeyword[],
  inputs: string[],
  existingThemes: SuggestedTheme[]
): SuggestedTheme[] {
  // Keep confirmed/suppressed themes from before
  const preserved = existingThemes.filter((t) => t.confirmed || t.suppressed)
  const preservedKeywords = new Set(preserved.flatMap((t) => t.keywords))

  // Find clusters of co-occurring keywords
  const topKeywords = keywords
    .filter((k) => !preservedKeywords.has(k.word))
    .slice(0, 30)

  const clusters: { anchor: string; related: string[]; weight: number }[] = []

  for (const kw of topKeywords) {
    if (clusters.some((c) => c.related.includes(kw.word) || c.anchor === kw.word)) {
      continue
    }

    const related: string[] = []
    for (const other of topKeywords) {
      if (other.word === kw.word) continue
      // Check if they appear in the same inputs
      const overlap = kw.sources.filter((s) => other.sources.includes(s))
      if (overlap.length > 0) {
        related.push(other.word)
      }
    }

    if (related.length > 0 || kw.count >= 2 || (inputs.length <= 2 && kw.sources.length > 0)) {
      clusters.push({
        anchor: kw.word,
        related: related.slice(0, 4),
        weight: Math.min(1, kw.count / Math.max(inputs.length, 1)),
      })
    }
  }

  // Convert clusters into theme suggestions
  const newThemes: SuggestedTheme[] = clusters.slice(0, 6).map((cluster, i) => {
    // Generate a readable theme name from the anchor
    const name = cluster.anchor
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")

    return {
      id: `theme-${Date.now()}-${i}`,
      name,
      keywords: [cluster.anchor, ...cluster.related],
      weight: cluster.weight,
      confirmed: false,
      suppressed: false,
    }
  })

  // Update weights of preserved themes based on new data
  const updatedPreserved = preserved.map((theme) => {
    const matchingKeywords = keywords.filter((k) =>
      theme.keywords.some((tk) => k.word.includes(tk) || tk.includes(k.word))
    )
    const newWeight = matchingKeywords.length > 0
      ? Math.min(1, matchingKeywords.reduce((sum, k) => sum + k.count, 0) / Math.max(inputs.length, 1))
      : Math.max(0.1, theme.weight - 0.1)

    return { ...theme, weight: newWeight }
  })

  return [...updatedPreserved, ...newThemes]
}

export function detectPatterns(
  inputs: string[],
  prevAnalysis: AnalysisResult | null,
  currentThemes: SuggestedTheme[]
): DetectedPattern[] {
  const patterns: DetectedPattern[] = []

  if (inputs.length < 2) {
    // Even with one input, note what appeared
    if (currentThemes.length > 0) {
      patterns.push({
        id: `pat-first-${Date.now()}`,
        label: "First signals",
        description: `Initial topics forming around ${currentThemes.slice(0, 3).map((t) => t.name.toLowerCase()).join(", ")}`,
        strength: "emerging",
      })
    }
    return patterns
  }

  // Compare current themes to previous ones
  const prevThemeNames = new Set(
    prevAnalysis?.suggestedThemes.map((t) => t.name.toLowerCase()) ?? []
  )
  const currentActiveThemes = currentThemes.filter((t) => !t.suppressed)

  for (const theme of currentActiveThemes) {
    const wasPresent = prevThemeNames.has(theme.name.toLowerCase())
    const prevTheme = prevAnalysis?.suggestedThemes.find(
      (t) => t.name.toLowerCase() === theme.name.toLowerCase()
    )

    if (!wasPresent) {
      patterns.push({
        id: `pat-new-${theme.id}`,
        label: theme.name,
        description: `New topic just appeared`,
        strength: "emerging",
      })
    } else if (prevTheme && theme.weight > prevTheme.weight + 0.1) {
      patterns.push({
        id: `pat-grow-${theme.id}`,
        label: theme.name,
        description: `This topic is gaining more mentions`,
        strength: "growing",
      })
    } else if (prevTheme && theme.weight < prevTheme.weight - 0.1) {
      patterns.push({
        id: `pat-fade-${theme.id}`,
        label: theme.name,
        description: `This topic is being mentioned less`,
        strength: "fading",
      })
    } else if (wasPresent) {
      patterns.push({
        id: `pat-steady-${theme.id}`,
        label: theme.name,
        description: `Consistent presence across your notes`,
        strength: "steady",
      })
    }
  }

  return patterns.slice(0, 8)
}

export function detectChanges(
  newInput: string,
  inputIndex: number,
  prevAnalysis: AnalysisResult | null,
  currentThemes: SuggestedTheme[]
): DetectedChange[] {
  const changes: DetectedChange[] = prevAnalysis?.changes.slice(0, 6) ?? []
  const now = new Date()
  const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  if (!prevAnalysis) {
    changes.unshift({
      id: `chg-${Date.now()}`,
      description: `First note received. ${currentThemes.length > 0 ? `Early themes forming: ${currentThemes.map((t) => t.name).join(", ")}` : "Waiting for patterns to form."}`,
      timestamp,
    })
  } else {
    const prevNames = new Set(prevAnalysis.suggestedThemes.map((t) => t.name))
    const newThemes = currentThemes.filter(
      (t) => !prevNames.has(t.name) && !t.suppressed
    )

    if (newThemes.length > 0) {
      changes.unshift({
        id: `chg-${Date.now()}`,
        description: `New ${newThemes.length === 1 ? "topic" : "topics"} appeared: ${newThemes.map((t) => t.name).join(", ")}`,
        timestamp,
      })
    } else {
      changes.unshift({
        id: `chg-${Date.now()}`,
        description: `Note #${inputIndex + 1} added. Existing themes updated.`,
        timestamp,
      })
    }
  }

  return changes.slice(0, 10)
}

export function generateNextSteps(
  themes: SuggestedTheme[],
  inputs: string[]
): string[] {
  const steps: string[] = []
  const active = themes.filter((t) => !t.suppressed)

  if (inputs.length === 1) {
    steps.push("Add more notes to help the picture take shape")
  }

  const emerging = active.filter((t) => t.weight < 0.4)
  if (emerging.length > 0) {
    steps.push(
      `"${emerging[0].name}" is still faint -- more detail could help clarify it`
    )
  }

  const strong = active.filter((t) => t.weight >= 0.7)
  if (strong.length > 0) {
    steps.push(
      `"${strong[0].name}" is a strong thread -- consider if it deserves its own focus`
    )
  }

  if (active.length > 4) {
    steps.push(
      "Several topics are active. Try suppressing ones that feel less important right now"
    )
  }

  if (inputs.length >= 3 && active.length > 0) {
    steps.push(
      "You could rename any theme to better match what it means to you"
    )
  }

  return steps.slice(0, 3)
}

export function generateSummary(
  themes: SuggestedTheme[],
  inputs: string[],
  _patterns: DetectedPattern[]
): string {
  const active = themes.filter((t) => !t.suppressed)

  if (inputs.length === 0) return ""

  if (inputs.length === 1 && active.length === 0) {
    return "One note received. Not enough information yet to see the bigger picture. Keep adding what you notice."
  }

  if (active.length === 0) {
    return `${inputs.length} notes received, but no clear themes have emerged yet. The fragments may need more context to connect.`
  }

  const topThemes = active
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)

  const themeList = topThemes.map((t) => t.name.toLowerCase()).join(", ")

  if (inputs.length <= 2) {
    return `From your first ${inputs.length === 1 ? "note" : "couple of notes"}, early threads are forming around ${themeList}. These are preliminary -- they will shift as more details come in.`
  }

  const strong = active.filter((t) => t.weight >= 0.6)
  const faint = active.filter((t) => t.weight < 0.4)

  let summary = `Across ${inputs.length} notes, the clearest threads are ${themeList}.`

  if (strong.length > 0) {
    summary += ` "${strong[0].name}" comes through most strongly.`
  }

  if (faint.length > 0) {
    summary += ` "${faint[0].name}" is still faint, but present.`
  }

  return summary
}

export function analyze(
  inputs: string[],
  prevAnalysis: AnalysisResult | null,
  existingThemes: SuggestedTheme[]
): AnalysisResult {
  const keywords = extractKeywords(inputs)
  const suggestedThemes = suggestThemes(keywords, inputs, existingThemes)
  const patterns = detectPatterns(inputs, prevAnalysis, suggestedThemes)
  const changes = detectChanges(
    inputs[inputs.length - 1],
    inputs.length - 1,
    prevAnalysis,
    suggestedThemes
  )
  const nextSteps = generateNextSteps(suggestedThemes, inputs)
  const summary = generateSummary(suggestedThemes, inputs, patterns)

  return {
    keywords,
    suggestedThemes,
    patterns,
    changes,
    nextSteps,
    summary,
  }
}
