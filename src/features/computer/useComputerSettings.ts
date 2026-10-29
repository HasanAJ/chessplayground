import { type Diagnostic, notice } from "../../i18n/notices";
import { useCallback, useEffect, useState } from "react";
import type { Color } from "chess.js";
import { COMPUTER_DIFFICULTY_KEY, readDifficulty } from "./preferences";

export function useComputerSettings() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<Color>("w");
  const [difficulty, setDifficulty] = useState(readDifficulty);
  const [storageError, setStorageError] = useState<Diagnostic | null>(null);
  const disable = useCallback(() => setEnabled(false), []);
  useEffect(() => {
    if (!enabled) setOpen(false);
  }, [enabled]);
  useEffect(() => {
    try {
      localStorage.setItem(COMPUTER_DIFFICULTY_KEY, difficulty);
      setStorageError(null);
    } catch {
      setStorageError(notice("computer.error.saveDifficulty"));
    }
  }, [difficulty]);
  return {
    enabled,
    open,
    side,
    difficulty,
    storageError,
    disable,
    setEnabled,
    setOpen,
    setSide,
    setDifficulty,
  };
}

export type ComputerSettings = ReturnType<typeof useComputerSettings>;
