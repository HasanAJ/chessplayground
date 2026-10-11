import { translateNotice } from "../../i18n/notices";
import { useTranslation } from "../../i18n/LanguageProvider";
import type { SaveRecovery } from "./storage";

export function SaveNotice({
  error,
  recovery,
  paused,
  onResume,
  onDismiss,
}: {
  error: string;
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
      aria-label={t("Game saving status")}
    >
      <strong>
        {paused
          ? t("Saved game needs recovery")
          : error
            ? t("Browser save unavailable")
            : t("Original save preserved")}
      </strong>
      {recovery && (
        <p>
          {paused
            ? translateNotice(recovery.message, t)
            : t(
                "The original data is kept in a separate browser recovery backup. Autosave has resumed.",
              )}
        </p>
      )}
      {error && <p>{translateNotice(error, t)}</p>}
      {recovery && (paused || !error) && (
        <div className="save-notice-actions">
          <button
            className="small-button"
            onClick={paused ? onResume : onDismiss}
          >
            {paused
              ? t("Keep current game & resume saving")
              : t("Dismiss recovery notice")}
          </button>
        </div>
      )}
    </section>
  );
}
