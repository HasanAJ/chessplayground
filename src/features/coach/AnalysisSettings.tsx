import { useTranslation } from "../../i18n/LanguageProvider";
import { AlertCircle, Settings, X } from "lucide-react";
import { useSettingsPopover } from "../../app/useSettingsPopover";
import {
  SEARCH_LIMITS,
  validSearchSetting,
  type SearchSettings,
} from "./searchSettings";

export function AnalysisSettings({
  settings,
  onChange,
  disabled,
  open,
  onOpenChange,
}: {
  settings: SearchSettings;
  onChange: (settings: SearchSettings) => void;
  disabled: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const { root, trigger, close } = useSettingsPopover(open, onOpenChange);
  const valid = (["seconds", "moves"] as const).every((key) =>
    validSearchSetting(key, settings[key]),
  );
  return (
    <div className="analysis-options" ref={root}>
      <button
        type="button"
        className={`analysis-settings-trigger${!valid ? " has-error" : ""}`}
        ref={trigger}
        aria-expanded={open}
        aria-controls="analysis-settings"
        aria-label={t(valid ? "coach.settings.heading" : "coach.settings.checkInputs")}
        title={t(valid ? "coach.settings.heading" : "coach.settings.checkInputs")}
        onClick={() => onOpenChange(!open)}
      >
        {valid ? (
          <Settings size={14} aria-hidden="true" />
        ) : (
          <AlertCircle size={14} aria-hidden="true" />
        )}
      </button>
      <section
        className="analysis-settings-panel coach-settings-panel"
        id="analysis-settings"
        aria-label={t("coach.settings.heading")}
        hidden={!open}
      >
        <div className="settings-panel-heading">
          <h3>{t("coach.settings.heading")}</h3>
          <button
            type="button"
            className="icon-button"
            aria-label={t("coach.settings.close")}
            onClick={close}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
        <p className="settings-panel-description">
          {t("coach.settings.description")}
        </p>
        <fieldset className="analysis-settings" disabled={disabled}>
          <legend className="sr-only">{t("coach.settings.heading")}</legend>
          {(["seconds", "moves"] as const).map((key) => {
            const invalid = !validSearchSetting(key, settings[key]);
            const inputId = `analysis-${key}`;
            return (
              <div className="analysis-setting-field" key={key}>
                <label htmlFor={inputId}>{t(`coach.settings.${key}`)}</label>
                <input
                  id={inputId}
                  type="number"
                  {...SEARCH_LIMITS[key]}
                  required
                  value={Number.isNaN(settings[key]) ? "" : settings[key]}
                  aria-invalid={invalid}
                  aria-describedby={`${inputId}-hint${invalid ? ` ${inputId}-error` : ""}`}
                  onChange={(event) =>
                    onChange({
                      ...settings,
                      [key]: event.currentTarget.valueAsNumber,
                    })
                  }
                />
                <p className="analysis-setting-hint" id={`${inputId}-hint`}>
                  {t(`coach.settings.${key}.hint`)}
                </p>
                {invalid && (
                  <p
                    className="analysis-settings-error"
                    id={`${inputId}-error`}
                    role="status"
                  >
                    {t(
                      `coach.settings.${key}.invalid`,
                      SEARCH_LIMITS[key].min,
                      SEARCH_LIMITS[key].max,
                      SEARCH_LIMITS[key].step,
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </fieldset>
        <div className="settings-panel-actions">
          <button type="button" className="primary-button" onClick={close}>
            {t("common.done")}
          </button>
        </div>
      </section>
    </div>
  );
}
