import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PieceSymbol, Square } from "chess.js";
import { useAnalysisEngine } from "../../engine/useAnalysisEngine";
import type { GameController } from "../game/useGameController";
import type { ComputerSettings } from "./useComputerSettings";
import { startComputerTurn } from "./computer";

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
  const [state, setState] = useState<"idle" | "thinking" | "waiting" | "error">(
    "idle",
  );
  const [retry, setRetry] = useState(0);
  const playMove = useRef(game.playMove);
  useLayoutEffect(() => {
    playMove.current = game.playMove;
  });
  const busy = turn && (state === "thinking" || state === "waiting");
  useEffect(() => {
    if (!turn || !game.playable || paused || game.terminal) {
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
        onWaiting() {
          setState("waiting");
        },
        onError() {
          setState("error");
        },
        onMove(uci) {
          setState("idle");
          playMove.current(
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
    turn,
    settings.difficulty,
    game.playable,
    paused,
    game.terminal,
    retry,
  ]);
  return { turn, busy, state, retry: () => setRetry((value) => value + 1) };
}

export type ComputerTurn = ReturnType<typeof useComputerTurn>;
