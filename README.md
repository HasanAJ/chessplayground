# Tempo

A browser-based chess playground with Stockfish analysis, move explanations, a computer opponent, random practice positions, and interactive opening lessons. Available in English, Spanish, German, Italian, and French. Games save locally in your browser.

To load a Chess.com screenshot, drop it on the board, paste it, or choose a file with **Import** next to the FEN controls. On a phone, open **Edit position** to find **Import** and **Scan**. To scan, allow camera access and point the camera straight at a Chess.com board on another screen. Fit the whole board inside the frame and tap **Capture board**. Camera access on a phone requires HTTPS. Recognition runs in your browser.

Each import loads the position shown in the image. When Tempo is unsure which side is at the bottom, it offers **Correct board orientation**. The board controls let you change whose turn it is or flip the view. Castling and en passant rights start empty.

## Run

Requires Node.js 22.12+ and npm 10.9.9, matching GitHub Actions. Installation enforces these versions.

```sh
npm install --global npm@10.9.9
npm ci
npm run dev
```

Open the URL printed by Vite. Installation copies Stockfish Lite into `public/engine`; if install scripts are disabled, run `node scripts/copy-engine.mjs` first. Analysis runs in the browser without an API key or backend.

## Check and build

```sh
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:browser
npm run preview
```

Browser checks run against the production build and exercise the real Stockfish worker on desktop and mobile Chromium. `npm run format:check` checks source formatting.

## Deployment

GitHub Actions tests, builds, and deploys pushes to `main` to Cloudflare. Manual deployment uses `npm run deploy` with the configured Cloudflare account and token. `SITE_URL` overrides the production origin when building.

## Credits and license

- [Stockfish.js](https://github.com/nmrugg/stockfish.js), GPL-3.0. Uses `stockfish@19.0.0`; its license is served at `/engine/LICENSE.txt`. Source and build instructions are in the linked repository.
- [chess.js](https://github.com/jhlywa/chess.js), BSD-2-Clause.
- Cburnett piece SVGs from [Lichess](https://github.com/lichess-org/lila/tree/master/public/piece/cburnett), GPL-2.0-or-later. See [asset credits](https://github.com/lichess-org/lila/blob/master/COPYING.md).
- [Lucide](https://lucide.dev/), ISC license.
- [fenshot](https://github.com/scoriiu/fenshot) and [ONNX Runtime Web](https://github.com/microsoft/onnxruntime), MIT. Their licenses are served at `/licenses/screenshot-recognition.txt`.

Project source is GPL-3.0-or-later. Third-party components retain their own licenses.
