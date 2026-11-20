import { Chess, type Color, type Move, type Square } from "chess.js";
import {
  english,
  type MessageKey,
  type Translator,
} from "../../i18n/translate.ts";
import { capturedSquare } from "../chess/moves.ts";
import { opposite, pieceNameKeys } from "../chess/position.ts";
import { pieceValues } from "../chess/material.ts";
import type { CandidateAnalysis } from "./candidates.ts";
import { newThreatArrows } from "./tacticalThreats.ts";

function withSideToMove(board: Chess, color: Color) {
  if (board.turn() !== color) {
    const fields = board.fen().split(" ");
    fields[1] = color;
    fields[3] = "-";
    return new Chess(fields.join(" "));
  }
  return board;
}

function capturesBy(board: Chess, color: Color) {
  return withSideToMove(board, color)
    .moves({ verbose: true })
    .filter((move) => move.captured);
}

function legalAttackers(board: Chess, square: Square, color: Color) {
  const target = board.get(square);
  if (target?.color === color) return [];
  const attackers = board.attackers(square, color);
  if (!attackers.length) return [];
  // A hypothetical capture on an empty square also tests whether the attacker is pinned.
  const probe = new Chess(withSideToMove(board, color).fen());
  if (!target) probe.put({ type: "p", color: opposite(color) }, square);
  return attackers.filter((from) =>
    probe
      .moves({ square: from, verbose: true })
      .some((capture) => capture.captured && capture.to === square),
  );
}

function freesBishop(before: Chess, after: Chess, move: Move) {
  const available = withSideToMove(after, move.color);
  return before.findPiece({ type: "b", color: move.color }).some((square) => {
    const moves = available.moves({ square, verbose: true });
    return (
      moves.some((option) => option.to === move.from) &&
      moves.length > before.moves({ square, verbose: true }).length
    );
  });
}

function checkingClue(after: Chess, move: Move, t: Translator) {
  if (move.isKingsideCastle() || move.isQueensideCastle())
    return t(
      move.isKingsideCastle()
        ? "coach.hint.clue.castleKingside"
        : "coach.hint.clue.castleQueenside",
    );
  if (move.promotion)
    return t("coach.hint.clue.promotion", t(pieceNameKeys[move.promotion]));
  const king = after.findPiece({ type: "k", color: opposite(move.color) })[0];
  const checkers = after.attackers(king, move.color);
  if (checkers.length > 1) return t("coach.hint.clue.doubleCheck");
  return checkers.includes(move.to)
    ? t("coach.hint.clue.check", t(pieceNameKeys[move.piece]))
    : t("coach.hint.clue.discoveredCheck");
}

type Hint = { heading: string; text: string };

function ideaHints({ move, mate }: CandidateAnalysis, t: Translator): Hint[] {
  const before = new Chess(move.before),
    after = new Chess(move.after);
  const name = (type: Move["piece"]) => t(pieceNameKeys[type]);
  const idea = (heading: MessageKey, ...hints: string[]): Hint[] =>
    hints.map((text) => ({ heading: t(heading), text }));
  if (after.isCheckmate())
    return idea(
      "coach.hint.title.checkmate",
      t("coach.hint.idea.checkmate"),
      checkingClue(after, move, t),
    );
  if (before.isCheck()) {
    const king = before.findPiece({ type: "k", color: move.color })[0];
    const capturesChecker =
      move.captured &&
      before
        .attackers(king, opposite(move.color))
        .includes(capturedSquare(move));
    return idea(
      "coach.hint.title.escapeCheck",
      t("coach.hint.idea.escapeCheck"),
      t(
        capturesChecker
          ? "coach.hint.clue.captureChecker"
          : move.piece === "k"
            ? "coach.hint.clue.moveKing"
            : "coach.hint.clue.blockCheck",
      ),
    );
  }
  if (mate !== undefined && mate > 0)
    return idea(
      "coach.hint.title.matingAttack",
      t("coach.hint.idea.matingAttack"),
      after.isCheck()
        ? checkingClue(after, move, t)
        : t("coach.hint.clue.matingSetup"),
    );
  if (mate !== undefined && mate < 0)
    return idea("coach.hint.title.defense", t("coach.hint.idea.defense"));
  if (move.promotion)
    return idea(
      "coach.hint.title.promotion",
      t("coach.hint.idea.promotion"),
      t("coach.hint.clue.promotion", name(move.promotion)),
    );
  if (after.isCheck())
    return idea(
      "coach.hint.title.check",
      t(
        move.captured
          ? "coach.hint.idea.captureCheck"
          : "coach.hint.idea.check",
      ),
      checkingClue(after, move, t),
    );
  if (move.isKingsideCastle() || move.isQueensideCastle())
    return idea(
      "coach.hint.title.castle",
      t("coach.hint.idea.castle"),
      t(
        move.isKingsideCastle()
          ? "coach.hint.clue.castleKingside"
          : "coach.hint.clue.castleQueenside",
      ),
    );

  const attacks = newThreatArrows(move);
  const forkSource = attacks.find(
    ({ from }) => attacks.filter((attack) => attack.from === from).length > 1,
  )?.from;
  const attackHints = () => {
    const targets = (
      forkSource
        ? attacks.filter(({ from }) => from === forkSource)
        : attacks.slice(0, 1)
    )
      .map(({ to }) => t("coach.piece.onSquare", name(after.get(to)!.type), to))
      .join(t("common.join.and"));
    return idea(
      forkSource ? "coach.hint.title.fork" : "coach.hint.title.attack",
      t(forkSource ? "coach.hint.idea.fork" : "coach.hint.idea.attack"),
      t("coach.hint.clue.attack", targets),
    );
  };
  if (forkSource) return attackHints();
  if (move.captured)
    return idea(
      "coach.hint.title.capture",
      t("coach.hint.idea.capture", name(move.captured)),
      t(
        capturesBy(after, opposite(move.color)).some(
          (reply) => capturedSquare(reply) === move.to,
        )
          ? "coach.hint.clue.recapture"
          : "coach.hint.clue.noRecapture",
      ),
    );

  const threats = capturesBy(before, opposite(move.color));
  const replies = capturesBy(after, opposite(move.color));
  if (
    threats.some((threat) => capturedSquare(threat) === move.from) &&
    !replies.some((reply) => capturedSquare(reply) === move.to)
  )
    return idea(
      "coach.hint.title.escapeAttack",
      t("coach.hint.idea.escapeAttack"),
      t("coach.hint.clue.escapeAttack", name(move.piece)),
    );
  const defended = before
    .board()
    .flat()
    .filter((piece) => piece !== null)
    .filter(
      (piece) =>
        piece.color === move.color &&
        piece.square !== move.from &&
        threats.some((threat) => capturedSquare(threat) === piece.square) &&
        !before.isAttacked(piece.square, move.color) &&
        after.attackers(piece.square, move.color).includes(move.to) &&
        replies.some(
          (reply) =>
            capturedSquare(reply) === piece.square &&
            new Chess(reply.after)
              .moves({ square: move.to, verbose: true })
              .some((recapture) => recapture.to === reply.to),
        ),
    )
    .sort((a, b) => pieceValues[b.type] - pieceValues[a.type])[0];
  if (defended)
    return idea(
      "coach.hint.title.defend",
      t("coach.hint.idea.defend"),
      t("coach.hint.clue.defend", name(defended.type), defended.square),
    );

  if (attacks.length) return attackHints();
  if (
    move.piece === "r" &&
    move.from[0] !== move.to[0] &&
    !after
      .board()
      .flat()
      .some((piece) => piece?.type === "p" && piece.square[0] === move.to[0])
  )
    return idea(
      "coach.hint.title.openFile",
      t("coach.hint.idea.openFile"),
      t("coach.hint.clue.openFile", move.to[0]),
    );

  const controlled = (["d4", "e4", "d5", "e5"] as const).filter((square) => {
    if (square === move.to || square === move.from) return false;
    const previous = legalAttackers(before, square, move.color);
    const current = legalAttackers(after, square, move.color);
    return (
      current.includes(move.to) &&
      !previous.includes(move.from) &&
      current.length > previous.length
    );
  });
  const controlClue = () =>
    move.piece === "p"
      ? t("coach.hint.clue.pawnControl", controlled.join(t("common.join.and")))
      : t(
          "coach.hint.clue.centerControl",
          name(move.piece),
          controlled.join(t("common.join.and")),
        );
  if (
    ["n", "b"].includes(move.piece) &&
    move.from[1] === (move.color === "w" ? "1" : "8") &&
    move.to[1] !== move.from[1]
  )
    return idea(
      "coach.hint.title.develop",
      t("coach.hint.idea.develop"),
      controlled.length
        ? controlClue()
        : t("coach.hint.clue.develop", name(move.piece)),
    );
  if (move.piece === "p" && ["d4", "e4", "d5", "e5"].includes(move.to)) {
    const opensBishop = freesBishop(before, after, move);
    return idea(
      "coach.hint.title.center",
      t(
        opensBishop
          ? "coach.hint.idea.centerDevelopment"
          : "coach.hint.idea.center",
      ),
      controlled.length
        ? controlClue()
        : opensBishop
          ? t("coach.hint.clue.freeBishop")
          : t(
              Math.abs(Number(move.to[1]) - Number(move.from[1])) === 2
                ? "coach.hint.clue.pawnDoubleAdvance"
                : "coach.hint.clue.pawnAdvance",
            ),
    );
  }
  if (controlled.length)
    return idea(
      "coach.hint.title.center",
      t("coach.hint.idea.centerControl"),
      controlClue(),
    );
  return [];
}

/** Reveal observed ideas first, then the piece; never name the destination. */
export function moveHints(
  candidate: CandidateAnalysis,
  t: Translator = english,
) {
  return [
    ...ideaHints(candidate, t),
    {
      heading: t("coach.hint.title.piece"),
      text: t(
        "coach.hint.considerPiece",
        t(pieceNameKeys[candidate.move.piece]),
        candidate.move.from,
      ),
    },
  ];
}
