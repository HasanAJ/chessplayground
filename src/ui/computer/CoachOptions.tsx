import type { Color } from "chess.js";
import { Bot, ChevronDown, RotateCcw, X } from "lucide-react";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { sideName } from "../../domain/chess/position.ts";
import {
  COMPUTER_LEVELS,
  type ComputerLevel,
} from "../../application/computer/computer.ts";
import { useSettingsPopover } from "../shell/useSettingsPopover.ts";
type Props = {
  enabled: boolean;
  open: boolean;
  side: Color;
  difficulty: ComputerLevel;
  status: string;
  startDisabled: boolean;
  failed: boolean;
  onSideChange: (side: Color) => void;
  onDifficultyChange: (level: ComputerLevel) => void;
  onOpenChange: (open: boolean) => void;
  onEnabledChange: (enabled: boolean) => void;
  onRetry: () => void;
};
const levels = Object.keys(COMPUTER_LEVELS) as ComputerLevel[];
export function CoachOptions(props: Props) {
  const { t } = useTranslation();
  const popover = useSettingsPopover(props.open, props.onOpenChange);
  const toggle = () => {
    props.onEnabledChange(!props.enabled);
    if (props.enabled) props.onOpenChange(false);
  };
  const heading = t("computer.settings.heading");
  return (
    <div className="coach-options" ref={popover.root}>
      <div className="computer-control-group">
        <button
          type="button"
          className="computer-toggle"
          role="switch"
          aria-checked={props.enabled}
          aria-label={t("computer.toggle.label")}
          title={props.status}
          disabled={!props.enabled && props.startDisabled}
          onClick={toggle}
        >
          <Bot size={15} aria-hidden="true" />
          <span className="settings-control-label">
            {t("computer.toggle.text")}
          </span>
          <span className="computer-switch-track" aria-hidden="true">
            <span />
          </span>
        </button>
        <button
          type="button"
          className="computer-settings-trigger"
          ref={popover.trigger}
          aria-expanded={props.open}
          aria-controls="computer-settings"
          aria-label={heading}
          title={heading}
          onClick={() => props.onOpenChange(!props.open)}
        >
          <ChevronDown size={14} aria-hidden="true" />
        </button>
      </div>
      {props.failed && !props.open && (
        <button
          className="computer-retry"
          onClick={props.onRetry}
          disabled={props.startDisabled}
          aria-label={t("computer.retry")}
        >
          <RotateCcw size={13} />
        </button>
      )}
      <section
        className="computer-settings coach-settings-panel"
        id="computer-settings"
        aria-label={heading}
        hidden={!props.open}
      >
        <div className="settings-panel-heading">
          <h3>{heading}</h3>
          <button
            className="icon-button"
            aria-label={t("computer.settings.close")}
            onClick={popover.close}
          >
            <X size={15} />
          </button>
        </div>
        <p className="settings-panel-description">
          {t("computer.settings.description")}
        </p>
        <div className="computer-settings-fields">
          <fieldset className="computer-side-options">
            <legend>{t("computer.settings.side")}</legend>
            <div>
              {(["w", "b"] as const).map((color) => (
                <button
                  key={color}
                  aria-pressed={props.side === color}
                  onClick={() => {
                    if (props.side !== color) props.onSideChange(color);
                  }}
                >
                  <img src={`/pieces/${color}K.svg`} alt="" />
                  {sideName(color, t)}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="computer-level-options">
            <legend>{t("computer.settings.difficulty")}</legend>
            <div>
              {levels.map((level, index) => (
                <button
                  key={level}
                  aria-pressed={level === props.difficulty}
                  onClick={() => {
                    if (props.difficulty !== level)
                      props.onDifficultyChange(level);
                  }}
                >
                  <span className="level-bars" aria-hidden="true">
                    {levels.map((bar, count) => (
                      <span
                        key={bar}
                        className={count <= index ? "filled" : ""}
                      />
                    ))}
                  </span>
                  <span>{t(COMPUTER_LEVELS[level].labelKey)}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <p
          className={`computer-status ${props.failed ? "has-error" : ""}`}
          role="status"
        >
          {props.status}
        </p>
        <div className="computer-settings-actions">
          {props.failed && (
            <button
              className="computer-retry"
              onClick={props.onRetry}
              disabled={props.startDisabled}
            >
              <RotateCcw size={13} /> {t("common.retry")}
            </button>
          )}
          <button className="primary-button" onClick={popover.close}>
            {t("common.done")}
          </button>
        </div>
      </section>
    </div>
  );
}
