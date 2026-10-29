import { type Diagnostic, translateNotice } from "../../i18n/notices";
import { useTranslation } from "../../i18n/LanguageProvider";
import type { SaveRecovery } from "./storage";

export function SaveNotice({
  error,
  recovery,
  paused,
  onResume,
  onDismiss,
}: {
  error: Diagnostic | null;
  recovery: SaveRecovery | null;
  paused: boolean;
  onResume: () => void;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  if (!error && !recovery) return null;
  return (
    <section
      className="save-notice"
      role="status"
      aria-label={t("game.save.label")}
    >
      <strong>
        {paused
          ? t("game.save.recoveryHeading")
          : error
            ? t("game.save.unavailableHeading")
            : t("game.save.backupHeading")}
      </strong>
      {recovery && (
        <p>
          {paused
            ? translateNotice(recovery.message, t)
            : t("game.save.backupDescription")}
        </p>
      )}
      {error && <p>{translateNotice(error, t)}</p>}
      {recovery && (paused || !error) && (
        <div className="save-notice-actions">
          <button
            className="small-button"
            onClick={paused ? onResume : onDismiss}
          >
            {paused ? t("game.save.resume") : t("game.save.dismiss")}
          </button>
        </div>
      )}
    </section>
  );
}
