import { useEffect, useState } from "react";
import type { Study } from "../../chess/study";
import {
  preserveRecovery,
  writeSavedSession,
  type SavedSession,
} from "./storage";

/** Keep recovery and browser writes independent of board transitions. */
export function useStudyPersistence(
  study: Study,
  fen: string,
  initial: SavedSession,
) {
  const [recovery, setRecovery] = useState(initial.recovery);
  const [autosavePaused, setAutosavePaused] = useState(!!initial.recovery);
  const [storageError, setStorageError] = useState(initial.storageError);

  useEffect(() => {
    if (autosavePaused) return;
    try {
      writeSavedSession(study, fen);
      setStorageError("");
    } catch {
      setStorageError(
        "Browser storage is unavailable or full. Your latest changes may not survive a reload.",
      );
    }
  }, [study, fen, autosavePaused]);

  function resumeAutosave() {
    if (!recovery) return;
    try {
      // Never overwrite the original until an exact recovery copy is stored.
      preserveRecovery(recovery);
      setAutosavePaused(false);
      setStorageError("");
    } catch {
      setStorageError(
        "The original save could not be backed up. Autosave remains paused. Your latest changes may not survive a reload.",
      );
    }
  }

  return {
    recovery,
    autosavePaused,
    storageError,
    resumeAutosave,
    dismissRecovery: () => setRecovery(null),
  };
}
