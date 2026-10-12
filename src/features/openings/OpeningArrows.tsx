import { useId } from "react";
import { moveArrow } from "../board/arrows";
import type { TeachingNote } from "./annotations";

export function OpeningArrows({
  arrows,
  flipped,
}: {
  arrows: TeachingNote["arrows"];
  flipped: boolean;
}) {
  const id = useId();
  const files = (flipped ? "hgfedcba" : "abcdefgh").split("");
  const ranks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  if (!arrows.length) return null;
  return (
    <svg
      className="move-arrow opening-arrows"
      viewBox="0 0 800 800"
      aria-hidden="true"
    >
      <defs>
        <marker
          id={id}
          markerWidth="3.6"
          markerHeight="3.6"
          refX="2.4"
          refY="1.8"
          orient="auto"
        >
          <path d="M0,0 L3.6,1.8 L0,3.6 Z" fill="currentColor" />
        </marker>
      </defs>
      {arrows.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          data-from={from}
          data-to={to}
          {...moveArrow(from, to, files, ranks)}
          markerEnd={`url(#${id})`}
        />
      ))}
    </svg>
  );
}
