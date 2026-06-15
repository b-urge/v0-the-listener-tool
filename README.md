# The Listener
An interactive web app for exploring the radio spectrum — the invisible electromagnetic waves that fill the air around us all the time. Drag a tuner across the full range of radio frequencies and discover what exists at each one, from AM broadcasts to ham radio bands to microwave signals.
Built to make amateur (ham) radio accessible and interesting to people who have never heard of it.
## What it does
- Tunable spectrum strip — Drag a needle left and right across a visual bar representing the full radio spectrum (3 kHz to 30 GHz, log-scaled). Jump directly to specific bands with quick-select buttons.
- Live animated waveforms — A canvas draws a real-time waveform that changes shape and color depending on where you're tuned. Voice bands look jagged, data bands pulse rapidly, music bands roll smoothly.
- Band detail cards — As you tune, a card explains what's actually at that frequency in plain language: what it is, what you'd hear, how ham operators use it, and a fun fact.
- Ham radio primer — A short, jargon-free explainer about what amateur radio is and why it matters.
Everything runs entirely in the browser. No backend, no AI, no accounts.
## Tech stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- HTML Canvas for waveform rendering
## Getting started
Install dependencies and start the dev server:
    npm install
    npm run dev
Then open http://localhost:3000 in your browser.
## Project structure
    app/
      page.tsx              # Main page — wires the explorer together
      layout.tsx            # Root layout, fonts, metadata
      globals.css           # Theme tokens and animations
    components/
      spectrum-strip.tsx    # Draggable tuner across the spectrum
      waveform-canvas.tsx   # Animated real-time waveform
      band-detail.tsx       # Educational card for the current band
      band-nav.tsx          # Quick-jump band buttons
    lib/
      spectrum-data.ts      # Frequency band definitions and content
## How the spectrum works
The radio spectrum spans an enormous range, so the tuner uses a logarithmic scale. This keeps lower-frequency bands (like AM radio) from being squeezed into a sliver while higher-frequency bands (like microwave) dominate the view, giving every band room to explore.
## License
MIT
