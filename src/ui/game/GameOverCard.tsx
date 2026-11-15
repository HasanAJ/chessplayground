import type { Chess, Color } from "chess.js";
import { ArrowRight, Handshake, Sparkles, Trophy } from "lucide-react";
import { english } from "../../i18n/translate.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { ending, opposite, sideName } from "../../domain/chess/position.ts";

function resultFor(game: Chess, humanSide?: Color) {
  const winner = game.isCheckmate() ? opposite(game.turn()) : null;
  return {
    winner,
    celebrate:
      winner !== null && (humanSide === undefined || winner === humanSide),
    white: winner ? Number(winner === "w").toString() : "½",
    black: winner ? Number(winner === "b").toString() : "½",
  };
}
const confetti = Array.from({ length: 12 }, (_, index) => ({
  left: `${12 + ((index * 23) % 76)}%`,
  top: `${14 + ((index * 17) % 30)}%`,
  rotate: `${(index * 37) % 180}deg`,
  backgroundColor: ["#b09add", "#e6bc67", "#88bdb0", "#cab8ec"][index % 4],
  animationDelay: `${index * 35}ms`,
}));
export function GameOverCard({
  game,
  reason,
  humanSide,
  animate,
  onPlayAgain,
}: {
  game: Chess;
  reason: string;
  humanSide?: Color;
  animate: boolean;
  onPlayAgain: () => void;
}) {
  const { t } = useTranslation();
  const result = resultFor(game, humanSide);
  const explanation =
    ending(game, t) ??
    (reason === english("game.ending.repetition")
      ? t("game.ending.repetition")
      : reason);
  const classes = [
    "game-over-card",
    result.winner ? "is-checkmate" : "is-draw",
    result.celebrate && "has-celebration",
    result.celebrate && animate && "animate-celebration",
  ]
    .filter(Boolean)
    .join(" ");
  const message = result.winner
    ? t(
        result.celebrate
          ? "game.result.checkmateMessage"
          : "game.result.drawMessage",
      )
    : explanation;
  return (
    <section className={classes} aria-label={t("game.result.label")}>
      <p className="sr-only" role="status">
        {explanation}
      </p>
      {result.celebrate && (
        <div className="result-confetti" aria-hidden="true">
          {confetti.map((style, index) => (
            <span key={index} style={style} />
          ))}
        </div>
      )}
      <span className="result-tag">
        {result.winner ? <Trophy size={13} /> : <Handshake size={14} />}
        {t(result.winner ? "game.result.checkmate" : "game.result.draw")}
      </span>
      <div className="result-art" aria-hidden="true">
        <div className="result-board" />
        {result.winner ? (
          <>
            <img
              className="result-king"
              src={`/pieces/${result.winner}K.svg`}
              alt=""
            />
            {result.celebrate && (
              <>
                <Sparkles className="result-sparkle left" size={23} />
                <Sparkles className="result-sparkle right" size={17} />
              </>
            )}
          </>
        ) : (
          <>
            {(["white", "black"] as const).map((side) => (
              <img
                key={side}
                className={`result-draw-king ${side}`}
                src={`/pieces/${side === "white" ? "w" : "b"}K.svg`}
                alt=""
              />
            ))}
          </>
        )}
      </div>
      <h3>
        {result.winner
          ? t("game.result.winner", sideName(result.winner, t))
          : t("game.result.drawHeading")}
      </h3>
      <p className="result-message">{message}</p>
      <div
        className="result-score"
        role="group"
        aria-label={t("game.result.score", result.white, result.black)}
      >
        <span className={result.winner === "w" ? "result-winner" : ""}>
          <i className="side-disc" /> {t("chess.side.white")}
        </span>
        <strong>
          {result.white}
          <span>–</span>
          {result.black}
        </strong>
        <span className={result.winner === "b" ? "result-winner" : ""}>
          {t("chess.side.black")}
          <i className="side-disc black-disc" />
        </span>
      </div>
      <button className="primary-button" onClick={onPlayAgain}>
        {t("game.result.playAgain")}
        <ArrowRight size={15} />
      </button>
    </section>
  );
}
