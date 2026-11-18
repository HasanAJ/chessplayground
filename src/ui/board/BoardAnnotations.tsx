import type { AnnotationArrow } from "./useBoardAnnotations.ts";
import { ArrowOverlay } from "./ArrowOverlay.tsx";
import { moveArrow } from "./arrows.ts";

export function BoardAnnotations({
  arrows,
  flipped,
}: {
  arrows: AnnotationArrow[];
  flipped: boolean;
}) {
  const files = Array.from(flipped ? "hgfedcba" : "abcdefgh");
  const ranks = Array.from({ length: 8 }, (_, index) =>
    flipped ? index + 1 : 8 - index,
  );
  return Array.from(new Set(arrows.map((arrow) => arrow.color))).map(
    (color) => (
      <ArrowOverlay
        key={color}
        className={`move-arrow annotation-arrows annotation-${color}`}
        lines={arrows
          .filter((arrow) => arrow.color === color)
          .map(({ from, to }) => ({
            ...moveArrow(from, to, files, ranks),
            "data-from": from,
            "data-to": to,
          }))}
      />
    ),
  );
}
