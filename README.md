# Tempo

A browser-based chess playground with Stockfish analysis, move explanations, a computer opponent, and interactive opening lessons. Available in English, Spanish, German, Italian, and French. Games save locally in your browser.

## Run

Requires Node.js 22.12+.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. Installation copies Stockfish Lite into `public/engine`; if install scripts are disabled, run `node scripts/copy-engine.mjs` first. Analysis runs in the browser without an API key or backend.

## Check and build

```sh
npm test
npm run build
npm run preview
```

## Deployment

GitHub Actions tests, builds, and deploys pushes to `main` to Cloudflare. Manual deployment uses `npm run deploy` with the configured Cloudflare account and token. `SITE_URL` overrides the production origin when building.

## Credits and license

- [Stockfish.js](https://github.com/nmrugg/stockfish.js), GPL-3.0. Uses `stockfish@19.0.0`; its license is served at `/engine/LICENSE.txt`. Source and build instructions are in the linked repository.
- [chess.js](https://github.com/jhlywa/chess.js), BSD-2-Clause.
- Cburnett piece SVGs from [Lichess](https://github.com/lichess-org/lila/tree/master/public/piece/cburnett), GPL-2.0-or-later. See [asset credits](https://github.com/lichess-org/lila/blob/master/COPYING.md).
- [Lucide](https://lucide.dev/), ISC license.

Project source is GPL-3.0-or-later. Third-party components retain their own licenses.
