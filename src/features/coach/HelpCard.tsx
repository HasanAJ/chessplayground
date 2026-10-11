import { ArrowRight, X } from "lucide-react";

export function HelpCard({ onClose }: { onClose: () => void }) {
  return (
    <section
      className="panel-dialog help-card"
      role="region"
      aria-labelledby="help-title"
    >
      <button
        className="panel-close icon-button"
        aria-label="Close help"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <div className="eyebrow">WELCOME TO TEMPO</div>
      <h2 id="help-title">A board. A plan. Your next move.</h2>
      <ol>
        <li>
          <strong>Make it your position.</strong>
          <p>
            The piece trays above and below the board are always available. Drag
            a tray piece onto the board, or select it and click a square. Drag a
            legal board move to play it. Other board drops arrange a new
            position and restart history. Right-click a piece or drag it off the
            board to remove it. “Clear board” beside New game empties the board.
            Click a piece and a legal destination to play a move. Choose who
            plays next under “Your coach,” then press “Calculate best moves”
            whenever you want guidance for that position.
          </p>
        </li>
        <li>
          <strong>Understand your options.</strong>
          <p>
            The best move appears with a short explanation and a plain-language
            move description. Use “Preview reply” to see the response, then
            “Explore next moves” for the longer line. Open “About this position”
            for more context. “Other good options” appears only when worthwhile
            alternatives exist. Hover anywhere on the Best Move card, or focus
            one of its controls, to see its arrow. You can also hover or focus
            an alternative move. Hover a continuation move or “Likely reply” to
            see that position temporarily. Moving away restores the board.
            Keyboard focus and previews work the same way. Clicking or tapping
            keeps the preview, even when you jump back to the board. Choose
            “Return to game” or press Escape to finish a kept preview.
          </p>
        </li>
        <li>
          <strong>Learn as you go.</strong>
          <p>
            Use the “See” link below an explanation to preview its moves,
            attacks, or defenses with teal arrows and outlines. Your game stays
            unchanged. Move feedback includes a “Next time” lesson when the
            analysis finds a stronger alternative.
          </p>
        </li>
        <li>
          <strong>Keep the conversation going.</strong>
          <p>
            Click a piece and its destination to play for either side, or use a
            suggested move. Click “Calculate best moves” whenever you want
            guidance for the current position. Use the arrows above the board,
            or click a move in your history, to revisit its position and
            analysis. Use “Back to latest” to continue your game, or play a move
            from the selected position to continue from there.
          </p>
        </li>
        <li>
          <strong>Practice your way.</strong>
          <p>
            Use the computer toggle beside “Your coach” to turn the opponent on
            or off. Open its settings to choose your side and level. Your last
            move’s review opens above the recommendations. Calculating best
            moves collapses it to the move and rating; select the row to reopen
            the details.
          </p>
        </li>
        <li>
          <strong>Keep your discoveries.</strong>
          <p>
            Your game is autosaved in this browser. Use the FEN controls below
            the board to load or copy a position.
          </p>
        </li>
      </ol>
      <p className="help-footnote">
        Stockfish 19 Lite analyzes locally for about two seconds per position.
        Explanations use board patterns and the engine’s continuation. They’re a
        starting point for understanding; they aren’t a complete tactical proof.
        Move grades account for the overall position and compare alternatives at
        the same search depth. Grades can change with deeper analysis. Games are
        saved in this browser.
      </p>
      <button className="primary-button" onClick={onClose}>
        Let’s explore <ArrowRight size={16} />
      </button>
    </section>
  );
}
