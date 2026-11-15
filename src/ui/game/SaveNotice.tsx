import { translateNotice, type Diagnostic } from "../../i18n/notices.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import type { SaveRecovery } from "../../infrastructure/persistence/session.ts";
type Props = {
  error: Diagnostic | null;
  recovery: SaveRecovery | null;
  paused: boolean;
  onResume: () => void;
  onDismiss: () => void;
};
export function SaveNotice({
  error,
  recovery,
  paused,
  onResume,
  onDismiss,
}: Props) {
  const { t } = useTranslation();
  if (!(error || recovery)) return null;
  const heading = t(
    paused
      ? "game.save.recoveryHeading"
      : error
        ? "game.save.unavailableHeading"
        : "game.save.backupHeading",
  );
  const description = recovery
    ? paused
      ? translateNotice(recovery.message, t)
      : t("game.save.backupDescription")
    : null;
  const action = recovery && (paused || !error);
  return (
    <section
      className="save-notice"
      role="status"
      aria-label={t("game.save.label")}
    >
      <strong>{heading}</strong>
      {description && <p>{description}</p>}
      {error && <p>{translateNotice(error, t)}</p>}
      {action && (
        <div className="save-notice-actions">
          <button
            className="small-button"
            onClick={paused ? onResume : onDismiss}
          >
            {t(paused ? "game.save.resume" : "game.save.dismiss")}
          </button>
        </div>
      )}
    </section>
  );
}
