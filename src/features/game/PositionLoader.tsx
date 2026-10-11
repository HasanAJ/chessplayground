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
    <section className="fen-controls" aria-label="FEN position controls">
      <form onSubmit={load}>
        <label className="sr-only" htmlFor="fen-input">
          FEN position
        </label>
        <input
          id="fen-input"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setError("");
          }}
          spellCheck={false}
          placeholder="Paste a FEN position"
        />
        <button
          type="button"
          className="icon-button"
          aria-label="Copy current FEN"
          title="Copy current FEN"
          onClick={copy}
        >
          <Copy size={15} />
        </button>
        <button type="submit" className="small-button">
          Load
        </button>
      </form>
      {error && (
        <p className="fen-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
