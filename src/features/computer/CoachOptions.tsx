import { useEffect, useRef } from "react";
import type { Color } from "chess.js";
import { Bot, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { sideName } from "../../chess/position";
import { COMPUTER_LEVELS, type ComputerLevel } from "./computer";

export function CoachOptions({
  enabled,
  open,
  side,
  difficulty,
  status,
  startDisabled,
  failed,
  onSideChange,
  onDifficultyChange,
  onOpenChange,
  onEnabledChange,
  onRetry,
}: {
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
}) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  function close() {
    onOpenChange(false);
    trigger.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        onOpenChange(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        trigger.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, onOpenChange]);

  return (
    <div className="coach-options" ref={root}>
      <button
        className="computer-toggle"
        role="switch"
        aria-checked={enabled}
        aria-label="Play computer"
        title={status}
        disabled={!enabled && startDisabled}
        onClick={() => {
          onEnabledChange(!enabled);
          if (enabled) onOpenChange(false);
        }}
      >
        <Bot size={15} aria-hidden="true" />
        <span>Computer</span>
        <span className="computer-switch-track" aria-hidden="true">
          <span />
        </span>
      </button>
      <button
        className="computer-settings-trigger"
        ref={trigger}
        aria-expanded={open}
        aria-controls="computer-settings"
        aria-label="Computer settings"
        title="Computer settings"
        onClick={() => onOpenChange(!open)}
      >
        <SlidersHorizontal size={15} />
      </button>
      {failed && !open && (
        <button
          className="computer-retry"
          onClick={onRetry}
          disabled={startDisabled}
          aria-label="Retry computer"
        >
          <RotateCcw size={13} />
        </button>
      )}
      <section
        className="computer-settings"
        id="computer-settings"
        aria-label="Computer settings"
        hidden={!open}
      >
        <div className="computer-settings-heading">
          <h3>Computer settings</h3>
          <button
            className="icon-button"
            aria-label="Close computer settings"
            onClick={close}
          >
            <X size={15} />
          </button>
        </div>
        <div className="computer-settings-fields">
          <fieldset className="computer-side-options">
            <legend>You play as</legend>
            <div>
              {(["w", "b"] as Color[]).map((color) => (
                <button
                  key={color}
                  aria-pressed={side === color}
                  onClick={() => {
                    if (color !== side) onSideChange(color);
                  }}
                >
                  <img src={`/pieces/${color}K.svg`} alt="" />
                  {sideName(color)}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="computer-level-options">
            <legend>Your challenge</legend>
            <div>
              {Object.entries(COMPUTER_LEVELS).map(([value, option], index) => (
                <button
                  key={value}
                  aria-pressed={difficulty === value}
                  onClick={() => {
                    if (value !== difficulty)
                      onDifficultyChange(value as ComputerLevel);
                  }}
                >
                  <span className="level-bars" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((bar) => (
                      <span
                        key={bar}
                        className={bar <= index ? "filled" : ""}
                      />
                    ))}
                  </span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <p
          className={`computer-status ${failed ? "has-error" : ""}`}
          role="status"
        >
          {status}
        </p>
        <div className="computer-settings-actions">
          {failed && (
            <button
              className="computer-retry"
              onClick={onRetry}
              disabled={startDisabled}
            >
              <RotateCcw size={13} /> Retry
            </button>
          )}
          <button className="primary-button" onClick={close}>
            Done
          </button>
        </div>
      </section>
    </div>
  );
}
