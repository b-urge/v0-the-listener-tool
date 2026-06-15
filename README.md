# The Listener

An interactive web exhibit for exploring the radio spectrum — the invisible electromagnetic waves that surround us all the time. Drag a tuner across the airwaves, watch live waveforms respond, and discover what ham radio operators actually hear at each frequency.

> No backend, no AI, no accounts. Everything runs in the browser.

## What it does

The centerpiece is a **tunable spectrum strip**. You drag a needle across a visual bar representing the full range of radio frequencies — from very low (3 kHz) to very high (30 GHz). As you tune, three things happen:

1. **A live waveform animates** on a canvas, changing shape and color per band. Voice bands look like jagged speech, data bands look like rapid digital pulses, and music bands look like smooth rolling waves.
2. **A detail card** explains what actually lives at that frequency — in plain language. Each band includes what it is, what you'd hear, how ham operators use it, and a fun fact.
3. **Quick-jump buttons** let you hop directly to specific bands (AM, Shortwave, Ham HF, FM, VHF/UHF, Microwave).

A side panel introduces ham radio itself: what it is, how many operators there are, what a license costs, and why it matters during disasters.

## Why ham radio?

Amateur (ham) radio is a hobby where people build and operate their own radio stations to communicate across town or across the planet. There are over 3 million operators worldwide. The most interesting part isn't the talking — it's the *listening*: scanning frequencies and catching fragments of an invisible world. This project tries to make that world tangible to people who have never heard of it.

## Tech stack

- **Next.js** (App Router) + **React**
- **TypeScript**
- **Tailwind CSS** for styling
- **HTML Canvas** for the animated waveform rendering

## Getting started

```bash
# install dependencies
pnpm install

# run the dev server
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx              # Main page — wires the explorer together
  layout.tsx            # Root layout, fonts, metadata
  globals.css           # Theme tokens and animations
components/
  spectrum-strip.tsx    # Draggable tuner across the frequency spectrum
  waveform-canvas.tsx   # Animated per-band waveform rendering
  band-detail.tsx       # Educational detail card for the tuned band
  band-nav.tsx          # Quick-jump band selector
lib/
  spectrum-data.ts      # Frequency bands, descriptions, and metadata
```

## Notes

- The spectrum is **log-scaled**, since radio frequencies span many orders of magnitude.
- All signal activity is illustrative and generated deterministically — it represents the *character* of each band, not a live feed of real transmissions.
