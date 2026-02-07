export interface Band {
  id: string
  name: string
  shortName: string
  startFreq: number // in kHz
  endFreq: number // in kHz
  color: string // tailwind-compatible color
  canvasColor: string // hex for canvas rendering
  description: string
  whatYoudHear: string
  hamUse: string | null
  funFact: string
  signalDensity: number // 0-1, how "busy" this band is
  signalType: "voice" | "data" | "mixed" | "noise" | "music"
}

export const BANDS: Band[] = [
  {
    id: "vlf",
    name: "Very Low Frequency",
    shortName: "VLF",
    startFreq: 3,
    endFreq: 30,
    color: "text-red-400",
    canvasColor: "#f87171",
    description:
      "These are some of the lowest radio frequencies humans use. The waves are enormous -- a single wave can be 100 kilometers long. They travel through water and deep into the earth, which makes them useful for communicating with submarines.",
    whatYoudHear:
      "Slow, rhythmic pulses and deep hums. Navigation beacons sending out steady pings. The occasional rumble of natural radio emissions from lightning storms thousands of miles away.",
    hamUse: null,
    funFact:
      "The US Navy uses VLF to send one-way messages to submarines underwater. The antenna in Cutler, Maine is one of the most powerful radio transmitters ever built.",
    signalDensity: 0.15,
    signalType: "data",
  },
  {
    id: "mf-am",
    name: "AM Broadcast Band",
    shortName: "AM Radio",
    startFreq: 530,
    endFreq: 1700,
    color: "text-orange-400",
    canvasColor: "#fb923c",
    description:
      "This is the AM radio you know from car stereos. These frequencies have been used for public broadcasting since the 1920s. AM signals travel farther at night because the upper atmosphere reflects them back down -- so a station in Chicago might reach Florida after sunset.",
    whatYoudHear:
      "Talk radio, news, sports broadcasts, religious programming, and local community stations. At night, distant stations fade in and out like ghosts -- you might suddenly hear a station from 1,000 miles away.",
    hamUse:
      "The 160-meter ham band (1.8-2.0 MHz) sits just above AM broadcast. Hams call it 'Top Band' and use it for long-distance contacts, especially at night. It requires big antennas and patience.",
    funFact:
      "During clear winter nights, AM radio signals can bounce between the ground and the ionosphere multiple times, traveling thousands of miles. This is called 'skip' and it's why you can pick up distant stations late at night.",
    signalDensity: 0.7,
    signalType: "music",
  },
  {
    id: "hf-low",
    name: "Shortwave / Lower HF",
    shortName: "Shortwave",
    startFreq: 1700,
    endFreq: 10000,
    color: "text-amber-400",
    canvasColor: "#fbbf24",
    description:
      "Shortwave is where radio gets truly global. These frequencies bounce off the ionosphere and can reach the other side of the planet without any internet, satellites, or infrastructure. International broadcasters, emergency services, and ham radio operators all share this space.",
    whatYoudHear:
      "International news broadcasts in dozens of languages. Ham operators chatting across continents. Number stations -- mysterious automated voices reading strings of numbers, believed to be coded spy messages. Maritime weather reports. The occasional burst of digital data that sounds like a robot gargling.",
    hamUse:
      "This is ham radio's heartland. The 40-meter band (7 MHz) and 80-meter band (3.5 MHz) are hugely popular. Operators make contacts hundreds or thousands of miles away using just a wire antenna strung between two trees.",
    funFact:
      "Number stations have been broadcasting mysterious coded messages since the Cold War. No government has ever officially acknowledged running one, but they're still transmitting today. Anyone with a shortwave radio can listen.",
    signalDensity: 0.8,
    signalType: "mixed",
  },
  {
    id: "hf-high",
    name: "Upper HF / Ham DX Bands",
    shortName: "DX Bands",
    startFreq: 10000,
    endFreq: 30000,
    color: "text-yellow-300",
    canvasColor: "#fde047",
    description:
      "The upper shortwave bands are where ham radio operators chase long-distance contacts -- called 'DX' in radio lingo. When solar conditions are right, a 5-watt radio and a simple antenna can reach the other side of the earth. When conditions are bad, these bands go completely dead.",
    whatYoudHear:
      "Hams calling 'CQ' (the universal radio greeting meaning 'anyone there?'). Rapid-fire Morse code. Digital modes like FT8 that sound like short musical blips. Contest operators rattling off callsigns at machine-gun speed during weekend competitions.",
    hamUse:
      "The 20-meter band (14 MHz) is the workhorse of international ham radio. The 10-meter band (28 MHz) comes alive during solar maximum and can produce stunning worldwide contacts with very low power.",
    funFact:
      "FT8, invented in 2017, lets ham operators make contacts using signals so weak they're inaudible to the human ear. A computer decodes them. It's revolutionized the hobby and made contacts possible that were previously impossible.",
    signalDensity: 0.6,
    signalType: "mixed",
  },
  {
    id: "vhf",
    name: "VHF Band",
    shortName: "VHF / FM",
    startFreq: 30000,
    endFreq: 300000,
    color: "text-emerald-400",
    canvasColor: "#34d399",
    description:
      "VHF includes FM radio, television, aircraft communication, weather satellites, and the most popular ham radio band. These signals mostly travel in straight lines -- they don't bounce off the atmosphere like shortwave -- so they're limited to roughly line-of-sight range.",
    whatYoudHear:
      "FM music stations in crystal clarity. Pilots talking to air traffic control. Ham operators chatting on local repeaters (hilltop relay stations that extend range across a city). Weather satellite images being transmitted as eerie warbling tones.",
    hamUse:
      "The 2-meter band (144 MHz) is the most popular ham band in the world. Most hams start here with a handheld radio. Repeater networks let a small handheld radio talk across an entire metro area or even across states through linked repeater systems.",
    funFact:
      "You can receive weather satellite images directly from NOAA satellites on VHF with about $30 in equipment. The satellites pass overhead every 90 minutes, and you can decode live images of Earth from your backyard.",
    signalDensity: 0.85,
    signalType: "voice",
  },
  {
    id: "uhf",
    name: "UHF Band",
    shortName: "UHF",
    startFreq: 300000,
    endFreq: 3000000,
    color: "text-cyan-400",
    canvasColor: "#22d3ee",
    description:
      "UHF is packed with everyday technology: cell phones, WiFi, Bluetooth, GPS, TV broadcasts, walkie-talkies, and more. These higher frequencies carry more data but travel shorter distances. Ham radio operators also have allocations here.",
    whatYoudHear:
      "If you could tune across UHF, you'd hear the constant chatter of modern life -- though most of it is digital and sounds like static to the ear. Ham operators use the 70cm band for local communication, and there are fascinating experiments bouncing UHF signals off the moon.",
    hamUse:
      "The 70-centimeter band (430 MHz) is ham radio's second most popular band. Some operators practice 'Earth-Moon-Earth' (EME) communication -- bouncing signals off the lunar surface to reach other continents. The round trip takes about 2.5 seconds.",
    funFact:
      "Ham operators have literally bounced radio signals off the Moon since the 1960s. The signal takes about 2.5 seconds for the round trip. It's one of the most challenging and rewarding things you can do with a radio.",
    signalDensity: 0.9,
    signalType: "data",
  },
  {
    id: "microwave",
    name: "Microwave & Beyond",
    shortName: "Microwave",
    startFreq: 3000000,
    endFreq: 30000000,
    color: "text-violet-400",
    canvasColor: "#a78bfa",
    description:
      "At microwave frequencies, radio waves behave almost like light -- they travel in tight beams, can be focused with small dishes, and are absorbed by rain and moisture. This is where satellite TV, radar, 5G, and deep-space communication live.",
    whatYoudHear:
      "Mostly silence to the human ear -- these signals are almost entirely digital. But point a small dish at the sky and you can detect the cosmic microwave background -- the faint afterglow of the Big Bang, filling every point in the universe.",
    hamUse:
      "Adventurous hams build their own microwave transceivers and dish antennas for point-to-point contacts over hundreds of miles. Some have even used amateur satellites and the International Space Station as relay points.",
    funFact:
      "The cosmic microwave background radiation -- discovered accidentally by two Bell Labs engineers in 1965 -- is detectable at these frequencies. It's the oldest light in the universe, about 13.8 billion years old. That static on an old TV? Part of it was the Big Bang.",
    signalDensity: 0.4,
    signalType: "data",
  },
]

// Normalize a frequency position to 0-1 across the full display spectrum
export function freqToPosition(freqKhz: number): number {
  // Use log scale since frequency ranges span many orders of magnitude
  const minLog = Math.log10(3) // 3 kHz
  const maxLog = Math.log10(30000000) // 30 GHz
  const freqLog = Math.log10(Math.max(3, freqKhz))
  return (freqLog - minLog) / (maxLog - minLog)
}

export function positionToFreq(pos: number): number {
  const minLog = Math.log10(3)
  const maxLog = Math.log10(30000000)
  const freqLog = minLog + pos * (maxLog - minLog)
  return Math.pow(10, freqLog)
}

export function formatFrequency(freqKhz: number): string {
  if (freqKhz >= 1000000) {
    return `${(freqKhz / 1000000).toFixed(1)} GHz`
  }
  if (freqKhz >= 1000) {
    return `${(freqKhz / 1000).toFixed(1)} MHz`
  }
  return `${freqKhz.toFixed(0)} kHz`
}

export function getBandAtPosition(pos: number): Band | null {
  const freq = positionToFreq(pos)
  return BANDS.find((b) => freq >= b.startFreq && freq <= b.endFreq) ?? null
}
