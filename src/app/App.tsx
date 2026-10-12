import { LanguageSelector } from "../i18n/LanguageSelector";
import { useTranslation } from "../i18n/LanguageProvider";
import { languagePath } from "../i18n/routes";
import { SiteIntro } from "./SiteIntro";
import { PageHeading } from "./PageHeading";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { ROOT } from "../chess/study";
import { BoardPanel } from "../features/board/BoardPanel";
import { useBoardInteractions } from "../features/board/useBoardInteractions";
import { useBoardPreview } from "../features/board/useBoardPreview";
import { SquareHighlightProvider } from "../features/board/SquareHighlight";
import { CoachPanel } from "../features/coach/CoachPanel";
import { useCoachPresentation } from "../features/coach/useCoachPresentation";
import { useMoveReview } from "../features/coach/useMoveReview";
import { useRecommendations } from "../features/coach/useRecommendations";
import {
  useComputerSettings,
  useComputerTurn,
} from "../features/computer/useComputerOpponent";
import { useGameController } from "../features/game/useGameController";
import { SaveNotice } from "../features/game/SaveNotice";
import { usePanelFocus } from "./usePanelFocus";

export default function App() {
  const { t, language, setLanguage } = useTranslation();
  const computer = useComputerSettings();
  const game = useGameController(computer.disable);
  const preview = useBoardPreview(game.analysisKey, game.playable);
  const botTurn =
    computer.enabled &&
    !computer.open &&
    !game.reviewing &&
    game.game.turn() !== computer.side;
  const recommendations = useRecommendations(game, botTurn);
  const presentation = useCoachPresentation(game, recommendations, preview);
  const board = useBoardInteractions(game, preview, computer, botTurn);
  const opponent = useComputerTurn(
    game,
    computer,
    botTurn,
    preview.boardPreview || !!board.freeDrag,
  );
  const [reviewRetry, setReviewRetry] = useState(0);
  const feedbackPly =
    computer.enabled && !game.reviewing
      ? game.history.reduce(
          (ply, move, index) =>
            move.color === computer.side ? index + 1 : ply,
          game.history.length,
        )
      : (game.historyPly ?? game.history.length);
  const feedback = useMoveReview(
    game.study,
    game.playable ? (game.path[feedbackPly - 1]?.id ?? ROOT) : null,
    reviewRetry,
  );
  const storageError = game.storageError || computer.storageError;
  usePanelFocus(game.promotion, () => game.setPromotion(null));
  useEffect(() => {
    if (!game.playable) computer.setOpen(false);
  }, [game.playable]);

  function newGame() {
    preview.clearPreview();
    game.newGame();
    computer.setOpen(false);
  }

  function showHistory(ply: number) {
    preview.clearPreview();
    recommendations.clear();
    game.showHistory(ply);
    board.scrollToBoard();
  }

  function calculateBestMoves() {
    if (!game.playable) return;
    preview.clearPreview();
    game.setTool("move");
    game.setSelected(null);
    game.setError("");
    recommendations.calculate();
    if (window.matchMedia("(max-width: 900px)").matches)
      board.scrollToBoard({ alignToTop: true });
  }

  return (
    <>
      <header className="site-header">
        <a
          className="brand"
          href={languagePath(language)}
          aria-label={t("header.home")}
        >
          <img src="/favicon.svg" alt="" />
          <span>
            tempo<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="header-center">
          <Sparkles size={14} /> {t("header.tagline")}
        </div>
        <div className="header-actions">
          <LanguageSelector />
        </div>
      </header>

      <main>
        <PageHeading />

        <SaveNotice
          error={storageError}
          recovery={game.recovery}
          paused={game.autosavePaused}
          onResume={game.resumeAutosave}
          onDismiss={game.dismissRecovery}
        />

        <SquareHighlightProvider positionKey={game.analysisKey}>
          <div className="workspace">
            <BoardPanel
              game={game}
              board={board}
              preview={preview}
              computer={computer}
              botTurn={botTurn}
              analysis={recommendations}
              highlights={presentation}
              onNewGame={newGame}
              onShowHistory={showHistory}
            />
            <CoachPanel
              game={game}
              board={board}
              preview={preview}
              computer={computer}
              opponent={opponent}
              recommendations={recommendations}
              presentation={presentation}
              feedback={feedback}
              feedbackPly={feedbackPly}
              onReviewRetry={() => setReviewRetry((value) => value + 1)}
              onCalculate={calculateBestMoves}
              onNewGame={newGame}
              onShowHistory={showHistory}
            />
          </div>
        </SquareHighlightProvider>
        <SiteIntro language={language} onLanguageChange={setLanguage} />
        <footer>
          <span>
            <img src="/favicon.svg" alt="" />{" "}
            {t("footer.tagline")}
          </span>
          <span>
            © {new Date().getFullYear()} Tempo{" "}
            <span className="footer-dot">·</span> {t("footer.engine")}{" "}
            <span className="footer-dot">·</span>
          </span>
        </footer>
      </main>
    </>
  );
}
