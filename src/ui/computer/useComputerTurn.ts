import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PieceSymbol, Square } from "chess.js";
import { useAnalysisEngine } from "../shared/useAnalysisEngine.ts";
import { startComputerTurn } from "../../application/computer/computer.ts";
import type { GameController } from "../game/useGameController.ts";
import type { ComputerSettings } from "./useComputerSettings.ts";

type Status = "idle" | "thinking" | "waiting" | "error";
export function useComputerTurn(
  game: Pick<
    GameController,
    "fen" | "history" | "playMove" | "playable" | "study" | "terminal"
  >,
  settings: ComputerSettings,
  turn: boolean,
  paused: boolean,
) {
  const engine = useAnalysisEngine();
  const [state, setState] = useState<Status>("idle");
  const [attempt, setAttempt] = useState(0);
  const play = useRef(game.playMove);
  useLayoutEffect(() => {
    play.current = game.playMove;
  });
  useEffect(() => {
    if (!turn || paused || !game.playable || game.terminal) {
      setState("idle");
      return;
    }
    setState("thinking");
    return startComputerTurn(
      engine.current!,
      game.fen,
      {
        rootFen: game.study.rootFen,
        moves: game.history.map((move) => move.lan),
      },
      settings.difficulty,
      {
        onWaiting: () => setState("waiting"),
        onError: () => setState("error"),
        onMove(uci) {
          setState("idle");
          play.current(
            uci.slice(0, 2) as Square,
            uci.slice(2, 4) as Square,
            uci[4] as PieceSymbol | undefined,
            true,
          );
        },
      },
    );
  }, [
    game.fen,
    game.study.id,
    game.playable,
    game.terminal,
    settings.difficulty,
    turn,
    paused,
    attempt,
  ]);
  return {
    turn,
    busy: turn && ["thinking", "waiting"].includes(state),
    state,
    retry: () => setAttempt((current) => current + 1),
  };
}
export type ComputerTurn = ReturnType<typeof useComputerTurn>;
