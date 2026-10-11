import { mkdir, copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
await mkdir(`${root}public/engine`, { recursive: true });
for (const name of [
  "stockfish-19-lite-single.js",
  "stockfish-19-lite-single.wasm",
]) {
  await copyFile(
    `${root}node_modules/stockfish/bin/${name}`,
    `${root}public/engine/${name}`,
  );
}
await copyFile(
  `${root}node_modules/stockfish/Copying.txt`,
  `${root}public/engine/LICENSE.txt`,
);
