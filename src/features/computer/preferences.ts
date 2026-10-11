import { COMPUTER_LEVELS, type ComputerLevel } from "./computer";

export const COMPUTER_DIFFICULTY_KEY = "tempo-computer-difficulty";

export function readDifficulty(
  storage?: Pick<Storage, "getItem">,
): ComputerLevel {
  try {
    const saved = (storage ?? localStorage).getItem(COMPUTER_DIFFICULTY_KEY);
    if (saved && Object.hasOwn(COMPUTER_LEVELS, saved))
      return saved as ComputerLevel;
  } catch {
    // Computer play also works when browser storage is unavailable.
  }
  return "medium";
}
