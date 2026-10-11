import { translateNotice } from "../../i18n/notices";
import { useTranslation } from "../../i18n/LanguageProvider";
import type { Chess, Color } from "chess.js";
import { ArrowRight, Handshake, Sparkles, Trophy } from "lucide-react";
import { ending, opposite, sideName } from "../../chess/position";

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
  reason = ending(game, t) ?? translateNotice(reason, t);
  const winner = game.isCheckmate() ? opposite(game.turn()) : null;
  const celebrate =
    winner !== null && (humanSide === undefined || winner === humanSide);
  const whiteScore = winner === "w" ? "1" : winner === "b" ? "0" : "½";
  const blackScore = winner === "b" ? "1" : winner === "w" ? "0" : "½";

  return (
    <section
      className={`game-over-card ${winner ? "is-checkmate" : "is-draw"}${celebrate ? " has-celebration" : ""}${celebrate && animate ? " animate-celebration" : ""}`}
      aria-label={t("Game result")}
    >
      <p className="sr-only" role="status">
        {reason}
      </p>
      {celebrate && (
        <div className="result-confetti" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              style={{
                left: `${12 + ((index * 23) % 76)}%`,
                top: `${14 + ((index * 17) % 30)}%`,
                rotate: `${(index * 37) % 180}deg`,
                backgroundColor: ["#b09add", "#e6bc67", "#88bdb0", "#cab8ec"][
                  index % 4
                ],
                animationDelay: `${index * 35}ms`,
              }}
            />
          ))}
        </div>
      )}
      <span className="result-tag">
        {winner ? <Trophy size={13} /> : <Handshake size={14} />}
        {winner ? t("CHECKMATE") : t("DRAW")}
      </span>
      <div className="result-art" aria-hidden="true">
        <div className="result-board" />
        {winner ? (
          <>
            <img
              className="result-king"
              src={`/pieces/${winner}K.svg`}
              alt=""
            />
            {celebrate && (
              <>
                <Sparkles className="result-sparkle left" size={23} />
                <Sparkles className="result-sparkle right" size={17} />
              </>
            )}
          </>
        ) : (
          <>
            <img
              className="result-draw-king white"
              src="/pieces/wK.svg"
              alt=""
            />
            <img
              className="result-draw-king black"
              src="/pieces/bK.svg"
              alt=""
            />
          </>
        )}
      </div>
      <h3>
        {winner ? t("{0} wins!", sideName(winner, t)) : t("Honors shared.")}
      </h3>
      <p className="result-message">
        {winner
          ? celebrate
            ? t("A royal finish. Ready for another round?")
            : t("Good game. There’s always another round.")
          : reason}
      </p>
      <div
        className="result-score"
        role="group"
        aria-label={t(
          "Final score: White {0}, Black {1}",
          whiteScore,
          blackScore,
        )}
      >
        <span className={winner === "w" ? "result-winner" : ""}>
          <i className="side-disc" /> {t("White")}
        </span>
        <strong>
          {whiteScore}
          <span>–</span>
          {blackScore}
        </strong>
        <span className={winner === "b" ? "result-winner" : ""}>
          {t("Black")}
          <i className="side-disc black-disc" />
        </span>
      </div>
      <button className="primary-button" onClick={onPlayAgain}>
        {t("Play again")}
        <ArrowRight size={15} />
      </button>
    </section>
  );
}
