import type { TeachingNote } from "../../content/openings/annotations.ts";
import { moveArrow } from "../board/arrows.ts";
import { ArrowOverlay } from "../board/ArrowOverlay.tsx";
export function OpeningArrows({
  arrows,
  flipped,
}: {
  arrows: TeachingNote["arrows"];
  flipped: boolean;
}) {
  const files = Array.from(flipped ? "hgfedcba" : "abcdefgh");
  const ranks = Array.from({ length: 8 }, (_, index) =>
    flipped ? index + 1 : 8 - index,
  );
  const lines = arrows.map(([from, to]) => ({
    ...moveArrow(from, to, files, ranks),
    "data-from": from,
    "data-to": to,
  }));
  return <ArrowOverlay lines={lines} className="move-arrow opening-arrows" />;
}
