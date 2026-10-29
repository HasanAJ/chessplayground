import { type Diagnostic, NoticeError, notice } from "../../i18n/notices";
import { START_FEN } from "../../chess/position";
import { createStudy, parseStudy, type Study } from "../../chess/study";

export const SESSION_KEY = "tempo-session-v1";
const POSITION_KEY = "tempo-position";
export const RECOVERY_PREFIX = "tempo-recovery-v1:";
export type SaveRecovery = {
  data: Record<string, string>;
  message: Diagnostic;
};
export type SavedSession = {
  study: Study;
  recovery: SaveRecovery | null;
  storageError: Diagnostic | null;
};

export function readSavedSession(
  storage?: Pick<Storage, "getItem">,
): SavedSession {
  const data: Record<string, string> = {};
  let storageError: Diagnostic | null = null;
  const read = (key: string) => {
    try {
      return (storage ?? localStorage).getItem(key);
    } catch {
      storageError = notice("game.save.error.readStorage");
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
  const fallbackFen = read(POSITION_KEY);
  let study = createStudy(START_FEN);
  let restoredPosition = false;
  if (fallbackFen !== null) {
    try {
      study = createStudy(fallbackFen);
      restoredPosition = true;
    } catch {
      data[POSITION_KEY] = fallbackFen;
    }
  }
  const recovery = Object.keys(data).length
    ? {
        data,
        message: restoredPosition
          ? notice("game.save.error.restoredPosition")
          : notice("game.save.error.freshBoard"),
      }
    : null;
  return { study, recovery, storageError };
}

export function writeSavedSession(
  study: Study,
  fen: string,
  storage: Pick<Storage, "setItem"> = localStorage,
) {
  storage.setItem(SESSION_KEY, JSON.stringify(study));
  storage.setItem(POSITION_KEY, fen);
}

export function preserveRecovery(
  recovery: SaveRecovery,
  storage: Pick<Storage, "getItem" | "setItem"> = localStorage,
) {
  const key = `${RECOVERY_PREFIX}${crypto.randomUUID()}`;
  const payload = JSON.stringify(recovery.data);
  storage.setItem(key, payload);
  if (storage.getItem(key) !== payload)
    throw new NoticeError(notice("game.save.error.verifyBackup"));
}
