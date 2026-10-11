# Tempo

A local chess prototype for understanding the plan behind your next move. Arrange a position, explore up to five worthwhile Stockfish moves with plain-English explanations, then make moves for either side and calculate again whenever you want guidance.

## Run

Requires Node.js 22.12+.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To check and build:

```sh
npm test
npm run build
npm run preview
```

The installation copies Stockfish's small, single-threaded WebAssembly engine into `public/engine`. These generated files are ignored by Git and included in the production build. `npm ci` also runs this step. If you install with scripts disabled, run `node scripts/copy-engine.mjs` before starting or building.

## Production URL and sharing

The production site is [chessplayground.app](https://chessplayground.app), hosted as static assets on Cloudflare Workers. Source code is published at [HasanAJ/chessplayground](https://github.com/HasanAJ/chessplayground). Set `SITE_URL` in the hosting build environment, or copy `.env.example` to `.env.local` and change its value before building. Use an HTTPS origin with no path, query, or fragment.

The build emits a canonical URL, Open Graph and Twitter metadata, `robots.txt`, and `sitemap.xml` from that origin. The initial HTML contains readable product instructions and analysis limitations before JavaScript loads. Serve the complete `dist` directory, including engine files, the 1200 × 630 social PNG, favicon, and Apple touch icon. Check the deployed URLs and social preview after DNS and HTTPS are ready; local testing cannot verify third-party preview caches.

The editable social artwork is `public/social-preview.svg`. The PNG and favicon sizes are committed assets. On macOS, regenerate them after changing the SVG artwork with:

```sh
sips -s format png public/social-preview.svg --out public/social-preview.png
sips -s format png -z 32 32 public/favicon.svg --out public/favicon-32.png
sips -s format png -z 180 180 public/favicon.svg --out public/apple-touch-icon.png
```

## Deployment

`.github/workflows/deploy.yml` runs the tests, builds the complete site, and validates the Cloudflare configuration on pull requests and pushes to `main`. Successful pushes to `main`, or manual runs on `main`, deploy to `https://chessplayground.app` and check that HTTPS and the Stockfish engine are available.

Configure these GitHub Actions settings on `HasanAJ/chessplayground`:

- Repository variable `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account that owns the domain.
- Repository secret `CLOUDFLARE_API_TOKEN`: a deployment token with Workers Scripts edit access for that account, and Workers Routes edit and Zone read access for the `chessplayground.app` zone. Keep the token out of source control.

`wrangler.jsonc` publishes `dist` as static assets and attaches the custom domain. Cloudflare provisions the HTTPS certificate. Enable **Always Use HTTPS** for the domain in Cloudflare so HTTP requests redirect to HTTPS. The site also sends a Strict-Transport-Security header. Neither a server script nor a database is required.

For a manual deployment with the same account and token available as environment variables:

```sh
npm ci
npm test
npm run build
npm run deploy
```

## Use

Play moves for either side, set up a position, or turn on the computer opponent. Press **Calculate best moves** whenever you want guidance. On mobile, **See your coach** and **Back to board** take you between the two panels, and Calculate stays within reach at the bottom of the screen.

- **Play and explore:** click a piece and a legal destination, or drag it to play. The best-move card pairs chess notation with a plain description such as “Knight from g1 to f3,” an explanation, and Play and Preview reply actions. Forced moves are labeled “Only legal move.” Other worthwhile choices appear under **Other good options**; this list stays hidden when there are none. Select an alternative to open or close its explanation and continuation.
- **Calculate when needed:** suggestions appear only after you press Calculate. Playing a move, selecting history, changing the turn, arranging pieces, or starting a new game hides them until the next calculation. The best move’s arrow appears when analysis finishes. Hover or focus the best-move card or an alternative to show that move’s arrow. On mobile, Calculate brings the coach into view, and Play returns you to the board.
- **Connect explanations to the board:** hover a square reference in prose, notation, or history to highlight it. Prose references also support keyboard focus. Leaving the reference, pressing Escape, or changing position clears the highlight without changing the game or scrolling. A **See** link previews the position discussed in an explanation, marking relevant squares and move, attack, or defense arrows in teal. These previews add no text or controls to the board panel.
- **Preview replies and continuations:** hover or focus **Likely reply**, a continuation move, or a See link for a temporary preview. Moving away or pressing Escape restores the game. Click or tap to keep a preview; use **Return to game**, Escape, or collapse its details to leave it. Changing position also clears it. **Preview reply** opens the best move’s likely response, and **Explore next moves** exposes the continuation one move at a time. Previews preserve the game, history selection, saved FEN, layout, and scroll position, and pause computer play. Use Back to board on mobile to inspect a kept preview.
- **Review the last move:** the blue card below the coach header shows the move, rating, explanation, evaluation change, and likely reply. It opens for each new move and collapses to the move and rating when you calculate recommendations. Select its header to reopen it. While browsing history, it reviews the selected move. Against the computer, it keeps your latest move visible after the reply; before you have moved, it can show the computer’s opening move. Reply previews start immediately after the reviewed move. Tactical feedback names captures or forks supported by the analyzed line and offers a “Next time” lesson. Defended pieces, unfinished exchanges, and unclear tactical causes are described without claiming an unproven material gain or loss.
- **Inspect the position:** open **About this position** for the evaluation, attacks, undefended pieces, central control, the displayed continuation’s material result, and the gap between the top two moves. **What changed** covers captures, threats, and changes in central control after the last move, without repeating check advice already in the recommendation. **Highlight key squares** appears when the explanation names concrete squares: hover or focus for a temporary outline, or click to keep it. Collapsing the details or changing position clears it. Hover or focus an attacked-piece warning to outline the target with a solid border and its attackers with dashed borders. Warning highlights pause during continuation previews.
- **Browse game moves:** select a move below the board to view the position after it, or **Start** to view the game’s starting position. Previous and Next step through the same history; Back to latest resumes the current game. You can calculate at any selected position. Playing from an earlier position continues from that point, and FEN copy uses the position you are viewing. History grows with the game and has no internal scrollbar.
- **Play the computer:** use the toggle beside **Your coach** to start with your selected side and saved difficulty. The settings icon opens side selection and five challenge levels, pausing play until you close it with Done, Escape, the close icon, or an outside click. Turning the opponent off keeps the board, history, and settings. New game and Play again retain the opponent settings; choosing Black lets the computer open. History review and previews pause the opponent. Continuing from an earlier position, loading a FEN, or freely arranging pieces returns to manual play. Legal drags on your turn remain normal moves. Computer moves slide for 420 milliseconds, including the rook during castling, then briefly highlight the destination. Board changes cancel the animation; reduced-motion settings use a short fade without sliding or the destination highlight.
- **Choose the next player:** the **To move** selector follows the displayed position, including history and previews. Placing or moving a piece selects the opposite color next; removing one keeps the current turn. Choosing a player manually starts a new position and clears any obsolete en passant opportunity. Incomplete arrangements retain your choice until they become legal. Check, game results, previews, and computer activity are shown in the coach, and a checked king is marked in red.
- **Arrange a position:** drag a piece from either tray, or select a tray piece and click a square. Select it again to stop placing. A board drop that is not a legal move arranges the position and restarts history. Right-click a piece or drag it off the board to remove it. Arrangements use the displayed position and stop any computer turn, preview, or history review. Legal positions become playable immediately. Incomplete positions remain editable, with the reason shown beside the disabled Calculate button. Analysis and computer play stay unavailable until the position is legal. Each side is limited to 16 pieces and eight pawns, including on incomplete boards. Free placement clears affected castling rights and resets move counters and en passant.
- **Load or copy FEN:** the controls below Game moves stay visible. Load a full or shortened FEN string, or copy the displayed position. Short forms need the board and side to move; omitted trailing fields default to no castling rights, no en passant target, a zero half-move counter, and move number one. Imports preserve the fields you supply and display the complete FEN after loading. Invalid positions, malformed counters, or castling flags show an error beside the input and leave the board unchanged. Manually arranged positions start with fresh counters and no en passant right.
- **Use the board controls:** **New game** loads the standard starting position and keeps your opponent settings. Clear board sits beside it; Previous and Next browse history, and Flip swaps the board orientation and piece trays. Promotions offer a queen, rook, bishop, or knight. Fresh sessions start from the standard position. The desktop board scales with screen height, and smaller screens keep it within the viewport. Coordinates sit outside the squares, clear of the pieces. Game moves and FEN stay below the board; messages, help, and promotion choices appear in the coach. Move reviews open after moves, while alternative and position details start collapsed.

The browser saves your game, full move tree, selected line, and computer difficulty locally. Reloading restores the active history, including repetition, and your difficulty; missing or unrecognized difficulty settings use Medium. New games keep that setting. Older saved FEN sessions migrate into a new study. Draft arrangements, the computer’s on/off state and side, visible calculations, and engine reviews last only for the current session.

Storage failures show a warning that your latest changes may not survive a reload. Unreadable saved data pauses autosave and preserves the original; a separately saved valid FEN can recover the last position without history. **Keep current game & resume saving** first saves and verifies the original payload under a unique `tempo-recovery-v1:` key, then resumes autosave. If the backup fails, the original stays untouched and the warning explains that saving remains paused.

## How the coach works

Stockfish 19 Lite ranks the moves, and local rules turn board patterns and legal engine continuations into English explanations. The app runs entirely in the browser, with no LLM or API key. Its short searches favor quick feedback, so suggestions and move grades remain estimates.

**Recommendations.** Each requested calculation searches for up to 1.8 seconds, to a maximum depth of 18, with MultiPV set to five. The engine worker stays warm between moves. Changing position hides old suggestions and cancels the previous search; the engine acknowledges cancellation before starting the next one. You can keep using the board while the spinner, progress bar, and depth show that analysis is running. When the search finishes, suggestions appear together as distinct candidates from the same completed depth.

The best move always stays in the list. Other choices must be within 50 centipawns, or half a pawn, of it from the side-to-move perspective. If the best move forces mate, only other mating lines qualify. If every line loses to mate, only defenses matching the best mate distance remain. This filter reflects the current search and does not guarantee perfect play. Positions with fewer than five legal moves search only those moves, and filtering can reduce the list further.

**Explanations.** Rules recognize king safety, checks, captures, development, central control, defended pieces, joint attacks, open files, and promotion. The prose describes observed features and a possible continuation; it cannot establish every strategic reason behind an engine choice. Position details compare board features and continuation outcomes. Plans and warnings follow the side to move, and a repeated plan theme for that side is marked **Plan continues**.

**Move reviews.** A separate worker first finds the strongest move with a single-line search lasting up to 1.2 seconds. It then compares the best and played moves from the same starting position in a two-line search lasting up to 1.8 seconds, using a common depth and budget. If you played the first choice, a reply search lasting up to one second supplies the preview instead. Reply previews use the played line. Numeric comparisons show the evaluation difference; checkmate and actual draws are handled directly without searching a finished position. The review worker stays warm and cancels stale results.

Grades use [Lichess’s published evaluation-to-outlook curve](https://lichess.org/page/accuracy) with Tempo’s more forgiving bands: losing fewer than four percentage points is Good, 4–12 is Inaccuracy, 12–25 is Mistake, and 25 or more is Blunder. These changes are heuristics, not personal winning probabilities. The same pawn loss matters less in a position that is already overwhelmingly won or lost. Mate results are compared as outcomes rather than artificial 100-pawn evaluations; checkmate and draws receive explicit handling.

**Computer play and game state.** The opponent has its own cancellable worker and uses Stockfish’s selected `bestmove` at the chosen Skill Level. The five levels indicate relative strength, not calibrated Elo ratings. It waits at least one second from the start of its turn before moving, counting search time toward that delay. Free arrangements and previews cancel pending moves. All engine workers are disposed when the app unmounts, and canceled or outdated searches cannot overwrite current analysis. Engine failures offer a retry action.

The engine receives the loaded position and played moves so it can account for repetition. The interface keeps a game snapshot and reconstructs legal history when switching positions or lines. Checkmate and draws show a result card with the final score and Play again. Live wins receive a brief celebration that respects reduced-motion preferences; losses against the computer use a quieter finish.

Evaluation scores use White’s perspective: positive favors White, negative favors Black, and mate scores identify the side with a calculated forced mate. Positions and analysis stay in the browser. Google Fonts supplies optional typefaces, with system fonts available offline; piece assets and engine files are served locally.

## Structure

Code is grouped by responsibility. `src/main.tsx` starts the app; `src/app/App.tsx` connects the feature controllers and panels.

```text
src/
  app/                 App composition and panel focus handling
  chess/               Position validation, legal moves, saved move trees
  engine/              UCI parsing and the Stockfish worker lifecycle
  features/
    board/             Board rendering, piece trays, drag/drop, previews, animation
    coach/             Recommendations, explanations, ratings, strategy, coach cards
    computer/          Opponent settings, difficulty preferences, paced computer turns
    game/              Game state, history, FEN loader, promotion, results, autosave
  styles/              Ordered stylesheets for shared controls and feature layouts
```

The main controllers are:

- `features/game/useGameController.ts`: owns the saved study, selected history position, incomplete board arrangements, and game transitions. The current board and history are derived from the study.
- `features/board/useBoardInteractions.ts`: translates clicks, drags, tray placement, and off-board drops into game actions. `useBoardPreview.ts` owns temporary hover/focus and kept click previews separately from the saved game.
- `features/coach/useRecommendations.ts`: starts a search only after Calculate and cancels it when its position changes. `useCoachPresentation.ts` owns expanded alternatives and board highlights.
- `features/coach/useMoveReview.ts`: caches automatic move reviews for the current game. `moveReview.ts` compares the played move and best alternative at a common root/depth; `grading.ts` assigns the rating.
- `features/computer/useComputerOpponent.ts`: owns opponent settings and the cancellable turn lifecycle. `computer.ts` contains the five strength settings and minimum move delay.
- `engine/useAnalysisEngine.ts`: gives each engine consumer a warm worker and disposes it on unmount. Chess serialization and move application depend only on chess rules; UCI parsing is independent of coaching prose.

The saved-game format and storage keys remain compatible with existing sessions. The move tree retains its original branch metadata so older saved games still load.

Styles are imported through `styles/index.css`. Its import order preserves the existing cascade, including responsive and compact layout rules. Update the owning stylesheet when changing a control.

Tests mirror these areas under `tests/chess`, `tests/engine`, `tests/coach`, `tests/game`, and `tests/computer`. Test filenames match the module they cover, such as `moveReview.test.ts` and `GameOverCard.test.ts`. Focused suites add a behavior suffix, such as `grading.outcomes.test.ts`; suites spanning related components use descriptive camelCase names. They cover legal arrangements and special moves, worker cancellation/recovery, recommendation filtering, grading, saved-game restoration, computer pacing, and component rendering contracts. Interaction checks for hover previews, history navigation, FEN loading, promotion, computer play, and narrow layouts should also be performed in the browser after controller or layout changes.

```sh
npm test       # Domain, worker, and component rendering tests
npm run build # Strict TypeScript checks and the production bundle
```

## Credits

- [Stockfish.js](https://github.com/nmrugg/stockfish.js), Nathan Rugg and Stockfish contributors, GPL-3.0. The pinned npm package is `stockfish@19.0.0`. Its license is copied to `/engine/LICENSE.txt`. Corresponding source and build instructions are available in the linked repository.
- [chess.js](https://github.com/jhlywa/chess.js), Jeff Hlywa and contributors, BSD-2-Clause.
- Cburnett chess piece SVGs by Colin M. L. Burnett, distributed under GPL-2.0-or-later, obtained from [Lichess](https://github.com/lichess-org/lila/tree/master/public/piece/cburnett). See [Lichess asset credits](https://github.com/lichess-org/lila/blob/master/COPYING.md).
- [Lucide](https://lucide.dev/), ISC license.

The prototype source is provided under GPL-3.0-or-later. Third-party components retain their own licenses.
