# Singapore Airlines — Concept Site

A concept marketing site for Singapore Airlines built with React 19, Vite, TypeScript, and Tailwind. Includes a voice Concierge powered by ElevenLabs Conversational AI and per-section ambient audio guides.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in VITE_ELEVENLABS_AGENT_ID
npm run dev
```

Open http://localhost:5173.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `VITE_ELEVENLABS_AGENT_ID` | Yes (for Concierge) | Public ElevenLabs agent ID |
| `VITE_ELEVENLABS_SIGNED_URL_ENDPOINT` | No | Backend endpoint returning `{ signedUrl }` for private agents |

If neither is set, the rest of the site still renders; only the Concierge widget will surface an error when opened.

## Production build

```bash
npm run build       # type-check + vite build → dist/
npm run preview     # serve dist/ locally
```

Output is fully static in `dist/`.

## Deployment

Any static host works (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, GitHub Pages, etc.).

- Build command: `npm run build`
- Publish directory: `dist`
- Set the `VITE_*` env vars in the host's project settings before building
- The site uses anchor links only (no client-side router), so no SPA fallback rewrite is required

### Asset notes

- `public/hero.mp4` (~MB-scale) ships as-is. Consider serving from a CDN or replacing with a smaller poster + lazy-loaded variant for bandwidth-sensitive deployments.
- `public/audio/*.mp3` are generated via `npm run generate-audio` (requires `ELEVENLABS_API_KEY`). The generated files are committed, so deployments do not need to regenerate them.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check then build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run generate-audio` | Regenerate ambient audio guides via ElevenLabs |
