import { NoticeError, notice, type Diagnostic } from "../../i18n/notices.ts";
import {
  createStudy,
  parseStudy,
  type Study,
} from "../../domain/chess/study.ts";
import { START_FEN } from "../../domain/chess/position.ts";

export const SESSION_KEY = "tempo-session-v1";
export const RECOVERY_PREFIX = "tempo-recovery-v1:";
const POSITION_KEY = "tempo-position";
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
  let storageError: Diagnostic | null = null;
  const broken: Record<string, string> = {};
  const read = (key: string) => {
    try {
      return (storage ?? localStorage).getItem(key);
    } catch {
      storageError = notice("game.save.error.readStorage");
      return null;
    }
  };
  const raw = read(SESSION_KEY);
  if (raw !== null) {
    try {
      return {
        study: parseStudy(JSON.parse(raw)),
        recovery: null,
        storageError,
      };
    } catch {
      broken[SESSION_KEY] = raw;
    }
  }
  const fallback = read(POSITION_KEY);
  let study: Study | undefined;
  if (fallback !== null) {
    try {
      study = createStudy(fallback);
    } catch {
      broken[POSITION_KEY] = fallback;
    }
  }
  const recovery = Object.keys(broken).length
    ? {
        data: broken,
        message: notice(
          study
            ? "game.save.error.restoredPosition"
            : "game.save.error.freshBoard",
        ),
      }
    : null;
  return { study: study ?? createStudy(START_FEN), recovery, storageError };
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
  const key = RECOVERY_PREFIX + crypto.randomUUID();
  const data = JSON.stringify(recovery.data);
  storage.setItem(key, data);
  if (storage.getItem(key) !== data)
    throw new NoticeError(notice("game.save.error.verifyBackup"));
}
