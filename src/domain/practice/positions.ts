import type { Color } from "chess.js";

export type PracticePosition = {
  id: string;
  phase: "middlegame" | "endgame";
  fen: string;
};

export const RECENT_PRACTICE_LIMIT = 5;
const boardKey = (fen: string) => fen.split(" ").slice(0, 4).join(" ");

export function choosePracticePosition(
  positions: readonly PracticePosition[],
  options: { recent: readonly string[]; currentFen: string; side?: Color },
  random = Math.random,
): PracticePosition {
  const phase = random() < 0.5 ? "middlegame" : "endgame";
  const current = boardKey(options.currentFen);
  const choices = positions.filter(
    (position) =>
      position.phase === phase &&
      (!options.side || position.fen.split(" ")[1] === options.side) &&
      !options.recent.includes(position.id) &&
      boardKey(position.fen) !== current,
  );
  if (!choices.length) throw new Error("No practice positions available.");
  return choices[Math.floor(random() * choices.length)];
}
