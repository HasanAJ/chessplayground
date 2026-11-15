import { useId } from "react";
type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  "data-from"?: string;
  "data-to"?: string;
};
export function ArrowOverlay({
  lines,
  className,
  markerId,
}: {
  lines: Line[];
  className: string;
  markerId?: string;
}) {
  const unique = useId(),
    marker = markerId ?? unique;
  if (lines.length === 0) return null;
  return (
    <svg className={className} viewBox="0 0 800 800" aria-hidden="true">
      <defs>
        <marker
          id={marker}
          markerWidth="3.6"
          markerHeight="3.6"
          refX="2.4"
          refY="1.8"
          orient="auto"
        >
          <path d="M0,0 L3.6,1.8 L0,3.6 Z" fill="currentColor" />
        </marker>
      </defs>
      {lines.map((line, index) => (
        <line key={index} {...line} markerEnd={`url(#${marker})`} />
      ))}
    </svg>
  );
}
