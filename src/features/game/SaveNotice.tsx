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
  if (!error && !recovery) return null;
  return (
    <section
      className="save-notice"
      role="status"
      aria-label="Game saving status"
    >
      <strong>
        {paused
          ? "Saved game needs recovery"
          : error
            ? "Browser save unavailable"
            : "Original save preserved"}
      </strong>
      {recovery && (
        <p>
          {paused
            ? recovery.message
            : "The original data is kept in a separate browser recovery backup. Autosave has resumed."}
        </p>
      )}
      {error && <p>{error}</p>}
      {recovery && (paused || !error) && (
        <div className="save-notice-actions">
          <button
            className="small-button"
            onClick={paused ? onResume : onDismiss}
          >
            {paused
              ? "Keep current game & resume saving"
              : "Dismiss recovery notice"}
          </button>
        </div>
      )}
    </section>
  );
}
