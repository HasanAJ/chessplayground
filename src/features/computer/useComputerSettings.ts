import { useCallback, useEffect, useState } from "react";
import type { Color } from "chess.js";
import { COMPUTER_DIFFICULTY_KEY, readDifficulty } from "./preferences";

export function useComputerSettings() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<Color>("w");
  const [difficulty, setDifficulty] = useState(readDifficulty);
  const [storageError, setStorageError] = useState("");
  const disable = useCallback(() => setEnabled(false), []);
  useEffect(() => {
    if (!enabled) setOpen(false);
  }, [enabled]);
  useEffect(() => {
    try {
      localStorage.setItem(COMPUTER_DIFFICULTY_KEY, difficulty);
      setStorageError("");
    } catch {
      setStorageError(
        "Your computer difficulty could not be saved in this browser.",
      );
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
