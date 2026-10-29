import {
  type Diagnostic,
  noticeFromError,
  notice,
  translateNotice,
} from "../../i18n/notices";
import { useTranslation } from "../../i18n/LanguageProvider";
import { useEffect, useState, type FormEvent } from "react";
import type { Chess } from "chess.js";
import { Copy } from "lucide-react";
import { checkedGame } from "../../chess/position";

export function PositionLoader({
  fen,
  onLoad,
  onCopied,
}: {
  fen: string;
  onLoad: (game: Chess) => void;
  onCopied: () => void;
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState(fen);
  const [error, setError] = useState<Diagnostic | null>(null);

  useEffect(() => {
    setInput(fen);
    setError(null);
  }, [fen]);

  function load(event: FormEvent) {
    event.preventDefault();
    setError(null);
    let game: Chess;
    try {
      game = checkedGame(input);
    } catch (cause) {
      setError(noticeFromError(cause, notice("position.error.invalidInput")));
      return;
    }
    setInput(game.fen());
    onLoad(game);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(fen);
    } catch {
      setError(notice("position.error.clipboard"));
      return;
    }
    setError(null);
    onCopied();
  }

  return (
    <section className="fen-controls" aria-label={t("position.controls.label")}>
      <form onSubmit={load}>
        <label className="sr-only" htmlFor="fen-input">
          {t("position.controls.heading")}
        </label>
        <input
          id="fen-input"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setError(null);
          }}
          spellCheck={false}
          placeholder={t("position.controls.input")}
        />
        <button
          type="button"
          className="icon-button"
          aria-label={t("position.controls.copy")}
          title={t("position.controls.copy")}
          onClick={copy}
        >
          <Copy size={15} />
        </button>
        <button type="submit" className="small-button">
          {t("position.controls.load")}
        </button>
      </form>
      {error && (
        <p className="fen-error" role="alert">
          {translateNotice(error, t)}
        </p>
      )}
    </section>
  );
}
