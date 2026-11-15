import {
  COMPUTER_LEVELS,
  type ComputerLevel,
} from "../../application/computer/computer.ts";
export const COMPUTER_DIFFICULTY_KEY = "tempo-computer-difficulty";
export function readDifficulty(
  storage?: Pick<Storage, "getItem">,
): ComputerLevel {
  try {
    const preference = (storage ?? localStorage).getItem(
      COMPUTER_DIFFICULTY_KEY,
    );
    if (preference !== null && Object.hasOwn(COMPUTER_LEVELS, preference))
      return preference as ComputerLevel;
  } catch {
    /* Storage can be disabled; the default still supports computer play. */
  }
  return "medium";
}
