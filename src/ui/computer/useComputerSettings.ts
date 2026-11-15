import { useCallback, useEffect, useReducer, useState } from "react";
import type { Color } from "chess.js";
import { notice, type Diagnostic } from "../../i18n/notices.ts";
import {
  COMPUTER_DIFFICULTY_KEY,
  readDifficulty,
} from "../../infrastructure/persistence/preferences.ts";
import type { ComputerLevel } from "../../application/computer/computer.ts";

type Settings = {
  enabled: boolean;
  open: boolean;
  side: Color;
  difficulty: ComputerLevel;
};
function update(state: Settings, patch: Partial<Settings>): Settings {
  const next = { ...state, ...patch };
  if (patch.enabled === false) next.open = false;
  return next;
}
export function useComputerSettings() {
  const [settings, dispatch] = useReducer(update, undefined, () => ({
    enabled: false,
    open: false,
    side: "w" as Color,
    difficulty: readDifficulty(),
  }));
  const [storageError, setStorageError] = useState<Diagnostic | null>(null);
  const disable = useCallback(() => dispatch({ enabled: false }), []);
  useEffect(() => {
    try {
      localStorage.setItem(COMPUTER_DIFFICULTY_KEY, settings.difficulty);
      setStorageError(null);
    } catch {
      setStorageError(notice("computer.error.saveDifficulty"));
    }
  }, [settings.difficulty]);
  const setEnabled = useCallback(
    (enabled: boolean) => dispatch({ enabled }),
    [],
  );
  const setOpen = useCallback((open: boolean) => dispatch({ open }), []);
  const setSide = useCallback((side: Color) => dispatch({ side }), []);
  const setDifficulty = useCallback(
    (difficulty: ComputerLevel) => dispatch({ difficulty }),
    [],
  );
  return {
    ...settings,
    storageError,
    disable,
    setEnabled,
    setOpen,
    setSide,
    setDifficulty,
  };
}
export type ComputerSettings = ReturnType<typeof useComputerSettings>;
