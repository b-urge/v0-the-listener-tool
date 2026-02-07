"use server"

import { generateText, Output } from "ai"
import { z } from "zod"

const themeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  weight: z.number(),
  suppressed: z.boolean(),
})

const patternSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  strength: z.enum(["emerging", "growing", "steady", "fading"]),
})

const changeSchema = z.object({
  id: z.string(),
  description: z.string(),
  timestamp: z.string(),
})

const understandingSchema = z.object({
  summary: z.string(),
  themes: z.array(themeSchema),
  patterns: z.array(patternSchema),
  changes: z.array(changeSchema),
  nextSteps: z.array(z.string()),
})

export async function processInput(
  newInput: string,
  previousInputs: string[],
  existingUnderstanding: z.infer<typeof understandingSchema> | null,
  mode: "interpretive" | "instrument"
) {
  const allInputs = [...previousInputs, newInput]

  const systemPrompt = `You are "The Listener" — a quiet, contemplative sense-making instrument that processes fragments of anonymous radio activity from around the world.

Your role is to transform unstructured input into organized, human-readable understanding. The input represents anonymous, global radio signals — no identities, no usernames, no callsigns. Never display raw technical data.

Translate all patterns into warm, human terms: distance, reach, density, emergence, fade, presence, resonance.

Guidelines:
- Treat ambiguity as meaningful — it is information, not noise
- Prefer descriptive phrases over numbers
- Never assume the user knows what radio is
- Language should be accessible, poetic where appropriate, and avoid technical jargon
- Write as if describing weather patterns of invisible communication
- Theme names should be evocative and descriptive (e.g., "Distant Whispers", "Crowded Frequencies", "Dawn Chorus")
- Patterns should describe tendencies and movements, not data points
- Changes should read like gentle observations, not alerts
- Next steps should be optional, gentle suggestions written in plain language

${mode === "interpretive" 
  ? "INTERPRETIVE MODE: Emphasize narrative summaries and poetic themes. Be more evocative and descriptive. The output should feel like reading a weather report about invisible communication."
  : "INSTRUMENT MODE: Reveal slightly more structure — mention bands, regions, time concepts — but keep it accessible and never expose identities. Add subtle structural annotations to themes and patterns."}

${existingUnderstanding 
  ? `IMPORTANT: You are updating an EXISTING understanding incrementally. Do not reset. Build upon, refine, and evolve what already exists. Preserve suppressed themes (suppressed=true). Maintain theme IDs where themes persist. Describe what changed in the "changes" array.

Previous understanding:
${JSON.stringify(existingUnderstanding, null, 2)}`
  : "This is the FIRST input. Create an initial understanding from scratch."}

All accumulated input fragments:
${allInputs.map((input, i) => `[Fragment ${i + 1}]: ${input}`).join("\n")}

The newest fragment is the last one. Focus your changes and observations primarily on what the newest fragment reveals or shifts.`

  const { output } = await generateText({
    model: "openai/gpt-4o-mini",
    output: Output.object({ schema: understandingSchema }),
    prompt: systemPrompt,
    maxOutputTokens: 2000,
  })

  return output
}
