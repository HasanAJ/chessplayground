import { useEffect, useReducer, useRef, type FormEvent } from "react";
import type { Chess } from "chess.js";
import { Copy, ImagePlus } from "lucide-react";
import { checkedGame } from "../../domain/chess/position.ts";
import {
  notice,
  noticeFromError,
  translateNotice,
  type Diagnostic,
} from "../../i18n/notices.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { BoardCamera } from "../board/BoardCamera.tsx";

type State = { text: string; error: Diagnostic | null };
export function PositionLoader({
  fen,
  onLoad,
  onImportScreenshot,
  onCaptureBoard,
}: {
  fen: string;
  onLoad: (game: Chess) => void;
  onImportScreenshot: (image: File) => void;
  onCaptureBoard?: (image: Blob) => void;
}) {
  const { t } = useTranslation();
  const screenshotPicker = useRef<HTMLInputElement>(null);
  const [draft, update] = useReducer(
    (state: State, patch: Partial<State>) => ({ ...state, ...patch }),
    { text: fen, error: null },
  );
  useEffect(() => {
    update({ text: fen, error: null });
  }, [fen]);
  function submit(event: FormEvent) {
    event.preventDefault();
    let position: Chess;
    try {
      position = checkedGame(draft.text);
    } catch (error) {
      update({
        error: noticeFromError(error, notice("position.error.invalidInput")),
      });
      return;
    }
    update({ text: position.fen(), error: null });
    onLoad(position);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(fen);
    } catch {
      update({ error: notice("position.error.clipboard") });
      return;
    }
    update({ error: null });
  }
  const copyLabel = t("position.controls.copy");
  return (
    <section className="fen-controls" aria-label={t("position.controls.label")}>
      <form onSubmit={submit}>
        <label className="sr-only" htmlFor="fen-input">
          {t("position.controls.heading")}
        </label>
        <input
          id="fen-input"
          type="text"
          value={draft.text}
          spellCheck={false}
          placeholder={t("position.controls.input")}
          onChange={(event) =>
            update({ text: event.currentTarget.value, error: null })
          }
        />
        <button
          type="button"
          aria-label={copyLabel}
          title={copyLabel}
          onClick={copy}
        >
          <Copy size={17} aria-hidden="true" />
        </button>
        <button type="submit">{t("position.controls.load")}</button>
        <button
          type="button"
          className="board-image-trigger"
          onClick={() => screenshotPicker.current?.click()}
        >
          <ImagePlus size={17} aria-hidden="true" />
          {t("position.screenshot.open")}
        </button>
        {onCaptureBoard && <BoardCamera onCapture={onCaptureBoard} />}
        <input
          ref={screenshotPicker}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = "";
            if (file) onImportScreenshot(file);
          }}
        />
      </form>
      {draft.error && (
        <p className="fen-error" role="alert">
          {translateNotice(draft.error, t)}
        </p>
      )}
    </section>
  );
}
