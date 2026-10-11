import { START_FEN } from "../../chess/position";
import {
  createStudy,
  parseStudy,
  SESSION_KEY,
  type Study,
} from "../../chess/study";

export const RECOVERY_PREFIX = "tempo-recovery-v1:";
export type SaveRecovery = {
  data: Record<string, string>;
  message: string;
};

export function readSavedSession(storage?: Pick<Storage, "getItem">): {
  study: Study;
  recovery: SaveRecovery | null;
  storageError: string;
} {
  const data: Record<string, string> = {};
  let storageError = "";
  const read = (key: string) => {
    try {
      return (storage ?? localStorage).getItem(key);
    } catch {
      storageError =
        "Browser storage could not be read. Your saved game may be unavailable.";
      return null;
    }
  };
  const session = read(SESSION_KEY);
  if (session !== null) {
    try {
      return {
        study: parseStudy(JSON.parse(session)),
        recovery: null,
        storageError,
      };
    } catch {
      data[SESSION_KEY] = session;
    }
  }
  // A broken session must not prevent recovery of the separately saved FEN.
  const fallbackFen = read("tempo-position");
  let study = createStudy(START_FEN);
  let restoredPosition = false;
  if (fallbackFen !== null) {
    try {
      study = createStudy(fallbackFen);
      restoredPosition = true;
    } catch {
      data["tempo-position"] = fallbackFen;
    }
  }
  const recovery = Object.keys(data).length
    ? {
        data,
        message: restoredPosition
          ? "Your saved game could not be read. The last valid position was restored, without its move history. Autosave is paused to protect the original data."
          : "Your saved game could not be read. A fresh board is open. Autosave is paused to protect the original data.",
      }
    : null;
  return { study, recovery, storageError };
}

export function preserveRecovery(
  recovery: SaveRecovery,
  storage: Pick<Storage, "getItem" | "setItem"> = localStorage,
) {
  const key = `${RECOVERY_PREFIX}${crypto.randomUUID()}`;
  const payload = JSON.stringify(recovery.data);
  storage.setItem(key, payload);
  if (storage.getItem(key) !== payload)
    throw new Error("Recovery backup could not be verified.");
}
