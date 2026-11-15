import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { GameStore } from "../../application/game/GameStore.ts";
import { readSavedSession } from "../../infrastructure/persistence/session.ts";
import { useStudyPersistence } from "./useStudyPersistence.ts";

/** Bind application commands to React; persistence and notices are browser effects. */
export function useGameController(onEdit: () => void) {
  const onEditRef = useRef(onEdit);
  onEditRef.current = onEdit;
  const [initial] = useState(readSavedSession);
  const [store] = useState(
    () => new GameStore(initial.study, () => onEditRef.current()),
  );
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  const persistence = useStudyPersistence(state.study, state.fen, initial);
  useEffect(() => {
    if (!state.notice) return;
    const timer = window.setTimeout(() => store.setNotice(null), 3000);
    return () => window.clearTimeout(timer);
  }, [state.notice, store]);
  return {
    ...state,
    ...persistence,
    setTool: store.setTool,
    setPromotion: store.setPromotion,
    setError: store.setError,
    setNotice: store.setNotice,
    newGame: store.newGame,
    replaceGame: store.replaceGame,
    playMove: store.playMove,
    showHistory: store.showHistory,
    setBoardPosition: store.setBoardPosition,
    arrangePiece: store.arrangePiece,
    chooseNextPlayer: store.chooseNextPlayer,
  };
}
export type GameController = ReturnType<typeof useGameController>;
