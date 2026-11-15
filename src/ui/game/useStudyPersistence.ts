import { useEffect, useReducer } from "react";
import type { Study } from "../../domain/chess/study.ts";
import { notice, type Diagnostic } from "../../i18n/notices.ts";
import {
  preserveRecovery,
  writeSavedSession,
  type SavedSession,
  type SaveRecovery,
} from "../../infrastructure/persistence/session.ts";

type State = {
  recovery: SaveRecovery | null;
  autosavePaused: boolean;
  storageError: Diagnostic | null;
};
export function useStudyPersistence(
  study: Study,
  fen: string,
  initial: SavedSession,
) {
  const [state, update] = useReducer(
    (state: State, patch: Partial<State>): State => ({ ...state, ...patch }),
    {
      recovery: initial.recovery,
      autosavePaused: !!initial.recovery,
      storageError: initial.storageError,
    },
  );
  useEffect(() => {
    if (state.autosavePaused) return;
    try {
      writeSavedSession(study, fen);
      update({ storageError: null });
    } catch {
      update({ storageError: notice("game.save.error.unavailable") });
    }
  }, [study, fen, state.autosavePaused]);
  function resumeAutosave() {
    if (!state.recovery) return;
    try {
      preserveRecovery(state.recovery);
      update({ autosavePaused: false, storageError: null });
    } catch {
      update({ storageError: notice("game.save.error.backup") });
    }
  }
  return {
    ...state,
    resumeAutosave,
    dismissRecovery: () => update({ recovery: null }),
  };
}
