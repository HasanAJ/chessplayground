import { AlertCircle, Settings, X } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import {
  SEARCH_LIMITS,
  validSearchSetting,
  type SearchSettings,
} from "../../domain/coach/searchSettings.ts";
import { useSettingsPopover } from "../shell/useSettingsPopover.ts";
type Props = {
  settings: SearchSettings;
  onChange: (settings: SearchSettings) => void;
  disabled: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
function SearchField({
  field,
  value,
  onChange,
}: {
  field: keyof SearchSettings;
  value: number;
  onChange: (value: number) => void;
}) {
  const { t } = useTranslation();
  const id = `analysis-${field}`,
    invalid = !validSearchSetting(field, value),
    limits = SEARCH_LIMITS[field];
  return (
    <div className="analysis-setting-field">
      <label htmlFor={id}>{t(`coach.settings.${field}`)}</label>
      <input
        id={id}
        type="number"
        {...limits}
        required
        value={Number.isNaN(value) ? "" : value}
        aria-invalid={invalid}
        aria-describedby={`${id}-hint${invalid ? ` ${id}-error` : ""}`}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
      />
      <p className="analysis-setting-hint" id={`${id}-hint`}>
        {t(`coach.settings.${field}.hint`)}
      </p>
      {invalid && (
        <p className="analysis-settings-error" id={`${id}-error`} role="status">
          {t(
            `coach.settings.${field}.invalid`,
            limits.min,
            limits.max,
            limits.step,
          )}
        </p>
      )}
    </div>
  );
}
export function AnalysisSettings({
  settings,
  onChange,
  disabled,
  open,
  onOpenChange,
}: Props) {
  const { t } = useTranslation();
  const popover = useSettingsPopover(open, onOpenChange);
  const fields = Object.keys(SEARCH_LIMITS) as (keyof SearchSettings)[];
  const valid = fields.every((field) =>
    validSearchSetting(field, settings[field]),
  );
  const Icon = valid ? Settings : AlertCircle,
    label = t(valid ? "coach.settings.heading" : "coach.settings.checkInputs");
  return (
    <div className="analysis-options" ref={popover.root}>
      <button
        type="button"
        className={`analysis-settings-trigger${valid ? "" : " has-error"}`}
        ref={popover.trigger}
        aria-expanded={open}
        aria-controls="analysis-settings"
        aria-label={label}
        title={label}
        onClick={() => onOpenChange(!open)}
      >
        <Icon size={14} aria-hidden="true" />
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
            onClick={popover.close}
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>
        <p className="settings-panel-description">
          {t("coach.settings.description")}
        </p>
        <fieldset className="analysis-settings" disabled={disabled}>
          <legend className="sr-only">{t("coach.settings.heading")}</legend>
          {fields.map((field) => (
            <SearchField
              key={field}
              field={field}
              value={settings[field]}
              onChange={(value) => onChange({ ...settings, [field]: value })}
            />
          ))}
        </fieldset>
        <div className="settings-panel-actions">
          <button
            type="button"
            className="primary-button"
            onClick={popover.close}
          >
            {t("common.done")}
          </button>
        </div>
      </section>
    </div>
  );
}
