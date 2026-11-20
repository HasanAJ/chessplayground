import { LoaderCircle, RotateCcw, ShieldAlert } from "lucide-react";
import { translateNotice } from "../../i18n/notices.ts";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { sideName } from "../../domain/chess/position.ts";
import { GameOverCard } from "../game/GameOverCard.tsx";
import { BestMoveContent } from "./BestMoveContent.tsx";
import { HintContent } from "./HintContent.tsx";
import { AlternativeMoves } from "./AlternativeMoves.tsx";
import { SquareText } from "../board/SquareHighlight.tsx";
import type { CoachPanelProps } from "./coachContracts.ts";

type Props = Pick<
  CoachPanelProps,
  | "game"
  | "onPlayMove"
  | "preview"
  | "computer"
  | "recommendations"
  | "presentation"
  | "onNewGame"
> & { botTurn: boolean };
export function RecommendationsPanel(props: Props) {
  const { t } = useTranslation();
  const {
    game,
    recommendations: result,
    preview,
    presentation: focus,
    computer,
  } = props;
  if (game.playable && game.analysisTerminal)
    return (
      <GameOverCard
        key={game.analysisKey}
        game={game.analysisGame}
        reason={game.analysisTerminal}
        humanSide={computer.enabled ? computer.side : undefined}
        animate={!game.reviewing && !!game.lastMove}
        onPlayAgain={props.onNewGame}
      />
    );
  if (!game.playable || props.botTurn || !result.requested || !result.analysis)
    return null;
  const best = result.thinking ? undefined : result.best;
  const status = t(
    result.thinking
      ? "coach.analysis.status.thinking"
      : result.analysis.state === "error"
        ? "coach.analysis.status.unavailable"
        : focus.hinting
          ? "coach.hint.ready"
          : "coach.analysis.status.ready",
  );
  const error =
    result.current && result.analysis.state === "error"
      ? result.analysis.error
      : null;
  return (
    <>
      <div className="sr-only" role="status">
        {status}
      </div>
      {error ? (
        <div className="engine-error" role="alert">
          <ShieldAlert size={22} />
          <h3>{t("coach.analysis.errorHeading")}</h3>
          <p>
            <SquareText text={translateNotice(error, t)} />
          </p>
          <button
            className="primary-button"
            onClick={() => result.calculate(true)}
          >
            {t("coach.analysis.retry")}
            <RotateCcw size={15} />
          </button>
        </div>
      ) : (
        <>
          {best && focus.watching.target && (
            <p
              className="strategy-warning"
              aria-label={t("coach.warnings.heading")}
              tabIndex={preview.boardPreview ? undefined : 0}
              title={
                preview.boardPreview
                  ? undefined
                  : t("coach.warnings.description")
              }
              onMouseEnter={() => focus.setHoveredWarning(true)}
              onMouseLeave={() => focus.setHoveredWarning(false)}
              onFocus={() => focus.setFocusedWarning(true)}
              onBlur={() => focus.setFocusedWarning(false)}
            >
              <ShieldAlert size={16} />
              <span>
                <SquareText text={focus.watching.text} />
              </span>
            </p>
          )}
          <section
            className={`strategy-card${focus.hinting ? " hint-card" : ""}`}
            aria-label={t(
              focus.hinting ? "coach.hint.label" : "coach.analysis.label",
            )}
            aria-busy={result.thinking}
            onMouseEnter={() => focus.setHovered(0)}
            onMouseLeave={() => focus.setHovered(null)}
            onFocus={() => focus.setBestFocused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                focus.setBestFocused(false);
            }}
          >
            {best && focus.hinting ? (
              <HintContent
                key={`${game.analysisKey}:${best.move.lan}`}
                candidate={best}
              />
            ) : best ? (
              <BestMoveContent
                key={`${game.analysisKey}:${best.move.lan}`}
                candidate={best}
                forcedMove={focus.forcedMove}
                preview={preview.inspection}
                onInspect={preview.inspectMove}
                onClearInspection={preview.clearInspection}
                onPlay={() =>
                  props.onPlayMove(
                    best.move.from,
                    best.move.to,
                    best.move.promotion,
                  )
                }
              />
            ) : (
              <>
                <div className="card-eyebrow">
                  <LoaderCircle size={16} className="spin" />
                  <span>{t("coach.analysis.search.heading")}</span>
                </div>
                <h3>
                  {t(
                    focus.hinting
                      ? "coach.hint.loading"
                      : "coach.analysis.search.bestMove",
                    sideName(game.analysisGame.turn(), t),
                  )}
                </h3>
                <p>
                  {t(
                    game.reviewing
                      ? "coach.analysis.search.history"
                      : "coach.analysis.search.live",
                  )}
                </p>
                <div className="analysis-progress" aria-hidden="true">
                  <span />
                </div>
              </>
            )}
          </section>
          {best && !focus.hinting && (
            <AlternativeMoves
              key={game.analysisKey}
              candidates={result.candidates}
              onPlayMove={props.onPlayMove}
              preview={preview}
              presentation={focus}
            />
          )}
        </>
      )}
    </>
  );
}
