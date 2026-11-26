import {
  createRecognizer,
  flipPlacement,
  resolveOrientation,
  type BoardScanResult,
} from "@scoriiu/fenshot";
import modelUrl from "@scoriiu/fenshot/model/chess-tiles-v2.onnx?url";
import wasmLoaderUrl from "onnxruntime-web/ort-wasm-simd-threaded.mjs?url";
import wasmUrl from "onnxruntime-web/ort-wasm-simd-threaded.wasm?url";
import { checkedGame } from "../../domain/chess/position.ts";

let recognizer: ReturnType<typeof createRecognizer> | undefined;

function gameForPlacement(placement: string) {
  for (const turn of ["w", "b"]) {
    try {
      return checkedGame(`${placement} ${turn}`);
    } catch {
      continue;
    }
  }
  return null;
}

function hasClearPawnOrientation(placement: string) {
  const pawns = { P: { count: 0, rankSum: 0 }, p: { count: 0, rankSum: 0 } };
  for (const [row, rank] of placement.split("/").entries()) {
    for (const piece of rank) {
      if (piece !== "P" && piece !== "p") continue;
      pawns[piece].count += 1;
      pawns[piece].rankSum += 8 - row;
    }
  }
  const { P: white, p: black } = pawns;
  return (
    white.count >= 2 &&
    black.count >= 2 &&
    black.rankSum / black.count - white.rankSum / white.count >= 2
  );
}

export async function recognizePlayableBoard(image: Blob) {
  const bitmap = await createImageBitmap(image).catch(() => null);
  if (!bitmap) return null;
  try {
    const current = (recognizer ??= createRecognizer({
      modelUrl,
      wasmPaths: { mjs: wasmLoaderUrl, wasm: wasmUrl },
    }));
    let result: BoardScanResult | null;
    try {
      result = await current.recognize(bitmap);
    } catch {
      if (recognizer === current) recognizer = undefined;
      return { state: "unavailable" } as const;
    }
    if (!result?.reliable || !result.plausible) return null;

    const { placement, orientation } = resolveOrientation(result.placement);
    const flipped = orientation === "black";
    const game = gameForPlacement(placement);
    const alternate =
      game && hasClearPawnOrientation(placement)
        ? null
        : gameForPlacement(flipPlacement(placement));
    if (game) return { state: "ready", game, alternate, flipped } as const;
    if (alternate)
      return {
        state: "ready",
        game: alternate,
        alternate: null,
        flipped: !flipped,
      } as const;
    return null;
  } finally {
    bitmap.close();
  }
}
