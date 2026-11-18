import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import type { Square } from "chess.js";
import type { Position } from "../../domain/chess/position.ts";

type AnnotationColor = "red" | "yellow" | "blue" | "green";
export type AnnotationArrow = {
  from: Square;
  to: Square;
  color: AnnotationColor;
};
type SquareAnnotation = { square: Square; color: AnnotationColor };
type BoardPointerEvent = PointerEvent<HTMLDivElement>;

function annotationColor(
  event: BoardPointerEvent,
  arrow: boolean,
): AnnotationColor {
  if (event.metaKey && !arrow) return "red";
  if (event.shiftKey) return "green";
  if (event.altKey) return "blue";
  if (event.ctrlKey) return arrow ? "red" : "yellow";
  return arrow ? "yellow" : "red";
}

function pointerSquare(event: BoardPointerEvent, flipped: boolean) {
  const rect = event.currentTarget.getBoundingClientRect();
  const file = Math.floor(((event.clientX - rect.left) / rect.width) * 8);
  const rank = Math.floor(((event.clientY - rect.top) / rect.height) * 8);
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null;
  return `${"abcdefgh"[flipped ? 7 - file : file]}${flipped ? rank + 1 : 8 - rank}` as Square;
}

export function useBoardAnnotations(
  position: Position,
  flipped: boolean,
  removePiece?: (square: Square) => void,
) {
  const [squares, setSquares] = useState<SquareAnnotation[]>([]);
  const [arrows, setArrows] = useState<AnnotationArrow[]>([]);
  const [preview, setPreview] = useState<AnnotationArrow | null>(null);
  const gesture = useRef<{
    from: Square;
    pointerId: number;
    dragged: boolean;
  } | null>(null);

  function cancel() {
    gesture.current = null;
    setPreview(null);
  }
  const clear = useCallback(() => {
    gesture.current = null;
    setPreview(null);
    setSquares([]);
    setArrows([]);
  }, []);
  useEffect(clear, [position, clear]);

  function start(event: BoardPointerEvent) {
    if (event.button === 0) {
      clear();
      return;
    }
    if (event.button !== 2) return;
    event.preventDefault();
    const from = pointerSquare(event, flipped);
    if (!from) return;
    gesture.current = { from, pointerId: event.pointerId, dragged: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: BoardPointerEvent) {
    const active = gesture.current;
    if (!active || active.pointerId !== event.pointerId) return;
    const to = pointerSquare(event, flipped);
    if (to !== active.from) active.dragged = true;
    setPreview(
      to && to !== active.from
        ? { from: active.from, to, color: annotationColor(event, true) }
        : null,
    );
  }
  function finish(event: BoardPointerEvent) {
    const active = gesture.current;
    if (!active || active.pointerId !== event.pointerId) return;
    event.preventDefault();
    cancel();
    const to = pointerSquare(event, flipped);
    if (!to) return;
    if (active.from === to) {
      if (active.dragged) return;
      if (
        position[to] &&
        removePiece &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        !event.metaKey
      ) {
        removePiece(to);
        return;
      }
      const color = annotationColor(event, false);
      setSquares((current) => {
        const existing = current.find((mark) => mark.square === to);
        const remaining = current.filter((mark) => mark.square !== to);
        return existing?.color === color
          ? remaining
          : [...remaining, { square: to, color }];
      });
    } else {
      const color = annotationColor(event, true);
      setArrows((current) => {
        const matches = (arrow: AnnotationArrow) =>
          arrow.from === active.from && arrow.to === to;
        const existing = current.find(matches);
        const remaining = current.filter((arrow) => !matches(arrow));
        return existing?.color === color
          ? remaining
          : [...remaining, { from: active.from, to, color }];
      });
    }
  }
  return {
    squares,
    arrows: preview
      ? [
          ...arrows.filter(
            (arrow) => arrow.from !== preview.from || arrow.to !== preview.to,
          ),
          preview,
        ]
      : arrows,
    handlers: {
      onPointerDown: start,
      onPointerMove: move,
      onPointerUp: finish,
      onPointerCancel: cancel,
      onLostPointerCapture: cancel,
      onClick: clear,
      onContextMenu: (event: MouseEvent<HTMLDivElement>) =>
        event.preventDefault(),
    },
  };
}
