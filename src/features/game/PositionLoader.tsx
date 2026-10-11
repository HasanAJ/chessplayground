import { translateNotice } from "../../i18n/notices";
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
  const [error, setError] = useState("");

  useEffect(() => {
    setInput(fen);
    setError("");
  }, [fen]);

  function load(event: FormEvent) {
    event.preventDefault();
    setError("");
    let game: Chess;
    try {
      game = checkedGame(input);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "This FEN is not valid.",
      );
      return;
    }
    setInput(game.fen());
    onLoad(game);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(fen);
    } catch {
      setError(
        "Clipboard access is unavailable. Select the FEN text and copy it manually.",
      );
      return;
    }
    setError("");
    onCopied();
  }

  return (
    <section className="fen-controls" aria-label={t("FEN position controls")}>
      <form onSubmit={load}>
        <label className="sr-only" htmlFor="fen-input">
          {t("FEN position")}
        </label>
        <input
          id="fen-input"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setError("");
          }}
          spellCheck={false}
          placeholder={t("Paste a FEN position")}
        />
        <button
          type="button"
          className="icon-button"
          aria-label={t("Copy current FEN")}
          title={t("Copy current FEN")}
          onClick={copy}
        >
          <Copy size={15} />
        </button>
        <button type="submit" className="small-button">
          {t("Load")}
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
