#!/usr/bin/env node
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '..', 'public', 'audio')

const API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'

if (!API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY env var.')
  console.error('Run: ELEVENLABS_API_KEY=sk_... npm run generate-audio')
  process.exit(1)
}

const guides = [
  {
    slug: 'bali',
    text: 'Bali. Where the morning breathes in slow motion. Five daily flights to the Island of the Gods. Awaken to terraced rice fields, temples carved into volcanic stone, and a coastline lit gold at first light.',
  },
  {
    slug: 'tokyo',
    text: 'Tokyo. Where neon dusk meets ancient calm. Step from our cabin into a city that hums in two tempos at once — temples carved in cedar, skylines forged in glass. Daily non-stop service from Singapore. Wake to Mount Fuji on the descent.',
  },
  {
    slug: 'paris',
    text: 'Paris. A city composed in golden hour. Twelve flights a week into the City of Light, with seamless connections across thirty European capitals. Arrive ready for the boulevards, the markets, the slow afternoons.',
  },
  {
    slug: 'new-york',
    text: 'New York. A skyline rewritten every single night. Daily non-stop service across the Pacific. Step off in Manhattan ready for the boardroom, the gallery, or Broadway under the lights.',
  },
  {
    slug: 'sydney',
    text: 'Sydney. Sun-soaked harbours and salt-bright air. Three flights a day to the Harbour City — a perfect overnight from Singapore, arriving fresh for breakfast at Bondi.',
  },
  {
    slug: 'london',
    text: 'London. Where every street keeps a quiet century of stories. Four daily flights bring you into Heathrow with time to spare for tea, theatre, or a long walk along the Thames.',
  },
  {
    slug: 'zurich',
    text: 'Zurich. A city of clear water and even clearer light. Five weekly flights deliver you to the foot of the Alps — for ski seasons, summer hikes, or simply the long, lake-side calm.',
  },
]

async function synthesize(text, slug) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'content-type': 'application/json',
      accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.55,
        similarity_boost: 0.75,
        style: 0.35,
        use_speaker_boost: true,
      },
    }),
  })
  if (!res.ok) {
    throw new Error(`${slug}: ${res.status} ${await res.text()}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const out = resolve(OUT_DIR, `${slug}.mp3`)
  await writeFile(out, buf)
  return out
}

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true })

console.log(`Generating ${guides.length} guides → ${OUT_DIR}`)
for (const g of guides) {
  process.stdout.write(`  ${g.slug.padEnd(12)} `)
  try {
    const out = await synthesize(g.text, g.slug)
    console.log(`✓ ${out.split('/').slice(-2).join('/')}`)
  } catch (e) {
    console.log(`✗ ${e.message}`)
  }
}
console.log('Done.')
