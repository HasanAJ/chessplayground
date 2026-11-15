import { Chess, type Move } from "chess.js";
import { positionOf } from "../chess/position.ts";
import type {
  OpeningBranch,
  OpeningLesson,
} from "../../content/openings/lessons.ts";

export const setupLength = (lesson: OpeningLesson) =>
  lesson.setup.trim().split(/\s+/).length;
export const lessonMoves = (lesson: OpeningLesson, branch: OpeningBranch) =>
  `${lesson.setup} ${lesson[branch]}`.trim().split(/\s+/);
function frame(game: Chess, move?: Move) {
  return {
    fen: game.fen(),
    position: positionOf(game),
    move,
    checkmate: game.isCheckmate(),
    checkedKing: game.isCheck()
      ? game
          .board()
          .flat()
          .find((piece) => piece?.type === "k" && piece.color === game.turn())
          ?.square
      : undefined,
  };
}
type Frame = ReturnType<typeof frame>;
const compiled = new WeakMap<OpeningLesson, Map<OpeningBranch, Frame[]>>();
export function lessonPositions(
  lesson: OpeningLesson,
  branch: OpeningBranch = "trap",
): Frame[] {
  const branches = compiled.get(lesson) ?? new Map<OpeningBranch, Frame[]>();
  const cached = branches.get(branch);
  if (cached) return cached;
  const game = new Chess();
  const frames = [frame(game)];
  for (const move of lessonMoves(lesson, branch))
    frames.push(frame(game, game.move(move)));
  branches.set(branch, frames);
  compiled.set(lesson, branches);
  return frames;
}
