# Tempo

A local chess prototype for understanding the plan behind your next move. Arrange a position, explore up to five worthwhile Stockfish moves with plain-English explanations, then make moves for either side and calculate again whenever you want guidance.

Choose English, Spanish, German, Italian, or French in the header. The URL keeps the selected language across reloads; switching languages keeps your game.

The **Openings** tab contains 30 attacking lessons for beginner and intermediate players, including early queen attacks, gambits, and traps. Each has two walkthroughs: the tempting mistake and its punishment, and a reply that avoids the immediate trap. Search or filter by level, side, and target, then use Back, Forward, or the arrow keys to follow both sides one move at a time. There are 121 localized teaching notes for the key mistakes, tactical moves, outcomes, and defensive replies. Their arrows and square outlines change with the position. Square references support hover, keyboard focus, and tapping. Restart and board flip help with review. Switching tabs pauses computer play and analysis, preserves the game, and keeps your lesson position.

The library is at `/openings/`; lessons have individual URLs such as `/openings/wayward-rook/`, with translated routes such as `/es/openings/wayward-rook/`. The build emits these pages with unique descriptions, canonical and social metadata, and reciprocal language links. The initial HTML includes the library links, lesson summaries, and both move sequences before JavaScript runs. Browser Back follows lesson navigation, and switching languages preserves the current lesson. On narrow screens, the current move explanation sits between the board and its controls; the plan and defence are expandable. A lesson loading error offers Reload and access to Play.

Lessons are bundled in all five languages and load when you first open the tab. Their order is an editorial estimate of how tempting each mistake looks to a newer player; it is not a measured success rate. Cards distinguish mate, material gains, and attacking activity, and explain the cost of speculative gambits when the opponent defends well.

Lesson prose and representative lines are authored for Tempo, with references including Chess.com's [opening traps](https://www.chess.com/article/view/the-10-best-chess-traps), [Siberian Trap](https://www.chess.com/article/view/tactical-patterns-everyone-should-know-the-siberian-trap), and opening guides for the [Stafford Gambit](https://www.chess.com/openings/Petrovs-Defense-Classical-Stafford-Gambit), [Englund Gambit](https://www.chess.com/openings/englund-gambit), [Fried Liver Attack](https://www.chess.com/openings/Italian-Game-Fried-Liver-Attack), [Scotch Gambit](https://www.chess.com/openings/Scotch-Game-Scotch-Gambit), and [Evans Gambit](https://www.chess.com/openings/Giuoco-Piano-Game-Evans-Gambit). Tests validate all 60 lines with chess.js and check their mate and material outcomes. Stockfish 19 Lite was also used to review the final positions during authoring.

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

## Deployment

`.github/workflows/deploy.yml` runs the tests, builds the complete site, and validates the Cloudflare configuration on pull requests and pushes to `main`. Successful pushes to `main`, or manual runs on `main`, deploy to `https://chessplayground.app` and check that HTTPS and the Stockfish engine are available.

The build creates 165 pages: Play, the Openings library, 30 lessons, and the privacy policy in each of the five languages. English starts at `/`; translated pages start at `/es/`, `/de/`, `/it/`, and `/fr/`. Each includes its title, description, canonical URL, language links, and introductory content before JavaScript runs. The live app uses the same content and metadata. `SITE_URL` can override the production origin for another deployment; the generated sitemap lists all 165 pages. Build tests verify every page and its translated metadata and links. Deployment checks verify Play, the library, a lesson, and the privacy policy in each language, along with the sitemap and 404 responses.

Configure these GitHub Actions settings on `HasanAJ/chessplayground`:

- Repository variable `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account that owns the domain.
- Repository secret `CLOUDFLARE_API_TOKEN`: a deployment token with Workers Scripts edit access for that account, and Workers Routes edit and Zone read access for the `chessplayground.app` zone. Keep the token out of source control.

`wrangler.jsonc` publishes `dist` as static assets and attaches the custom domain. Cloudflare provisions the HTTPS certificate. Enable **Always Use HTTPS** for the domain in Cloudflare so HTTP requests redirect to HTTPS. The site also sends a Strict-Transport-Security header. Neither a server script nor a database is required.

Production deployments use Google Analytics 4 stream `G-2T14H8DDH6`, configured through `VITE_GA_MEASUREMENT_ID` in the deployment workflow. The tag loads only after a visitor accepts analytics. The choice is saved locally and can be changed in the footer; declining stops collection and clears Analytics cookies. Page views follow translated routes and lessons, exclude URL queries and fragments, and wait for the correct page title. Enhanced measurement must remain off in this stream to avoid duplicate history-based page views. Advertising features are disabled. Privacy links follow the selected language, using `/privacy/` in English and routes such as `/es/privacy/` in other languages. Each policy links to all five translations and back to Play in its own language. Development builds do not load Analytics; set `VITE_GA_MEASUREMENT_ID` when building locally to test production behavior.

For a manual deployment with the same account and token available as environment variables:

```sh
npm ci
npm test
npm run build
npm run deploy
```

## Use

Play either side, arrange a position, or turn on the computer opponent. Press **Calculate best moves** for guidance. On mobile, Calculate stays at the bottom until analysis starts, then reveals the coach. Later searches use the refresh icon in the coach header.

- **Play and explore:** click a piece and legal destination, or drag it. The suggested-move card includes notation, a plain description, any concrete explanation, and **Play** and **Explore this move** actions. Forced moves are labeled “Only legal move.” **Other good moves** stays visible when worthwhile alternatives exist; each move’s details open separately.
- **Calculate when needed:** suggestions appear only after Calculate. Moves, history selection, turn changes, arrangements, and new games hide them until you calculate again. Analysis shows the best move’s arrow; hover or focus any candidate to show its arrow. On mobile, Calculate opens the coach and Play returns to the board.
- **Connect explanations to the board:** hover square references in prose, notation, or history to highlight them; prose also supports keyboard focus. Leaving, pressing Escape, or changing position clears highlights. **Explore this move** shows the suggested move with relevant squares and move, attack, or defense arrows in teal. Move-review **See** links illustrate the lesson.
- **Preview replies and continuations:** **Explore this move** opens one possible line, including the opponent’s possible reply. Hover or focus a listed move for a temporary preview; click or tap to keep it. **Return to game**, Escape, closing the exploration or move details, and position changes clear previews. Previews preserve the saved game and pause computer play. On mobile, kept previews reveal the board with Previous and Next controls.
- **Review the last move:** the blue card shows the move, rating, explanation, and an action to preview the opponent’s possible reply. Numeric evaluation changes sit under **Analysis details**. The review opens after moves, collapses when you calculate, and reopens through its header. History review shows the selected move; computer play keeps your latest move visible after the reply, or the computer’s opening move before you have played. Tactical feedback offers a “Next time” lesson and names captures or forks supported by the analyzed line, keeping uncertain material outcomes qualified.
- **Inspect the position:** check and undefended-piece warnings appear above the suggested move. **Position details** shows the score, search depth, defended-piece attacks, central control, and meaningful continuation outcomes. **What changed** covers checks, captures, and promotions after the last move. Hover or focus **Highlight key squares** for temporary outlines, or click to keep them; collapsing details or changing position clears them. Warning highlights mark targets with solid borders and attackers with dashed borders, and pause during continuation previews.
- **Browse game moves:** select a move below the board to view its resulting position, or **Start** for the opening position. Previous and Next step through history; Back to latest resumes the current game. Calculate anywhere in history. Playing from an earlier position continues there, and FEN copy uses the displayed position.
- **Play the computer:** toggle it beside **Your coach** using your selected side and saved difficulty. Settings offer side selection and five challenge levels, pausing play until closed with Done, Escape, the close icon, or an outside click. Turning it off preserves the board, history, and settings; New game and Play again retain opponent settings. Choosing Black lets the computer open. History and previews pause play; continuing from history, loading FEN, or arranging pieces returns to manual play. Legal drags remain normal moves. Computer moves animate for 420 milliseconds, including castling’s rook, then highlight the destination. Board changes cancel animations; reduced motion uses a short fade without sliding or the destination highlight.
- **Choose the next player:** **To move** follows the displayed position. Placing or moving a piece selects the opposite color; removal keeps the turn. Manual selection starts a new position and clears obsolete en passant rights. Incomplete arrangements retain your choice. The coach shows check, results, previews, and computer activity; checked kings appear red.
- **Arrange a position:** drag from a tray, or select a tray piece and click squares; select it again to stop. An illegal board drop arranges the position and restarts history. Right-click or drag off-board to remove pieces. Arrangements use the displayed position and stop computer turns, previews, and history review. Legal positions become playable immediately; incomplete ones stay editable with an explanation beside disabled Calculate. Analysis and computer play require a legal position. Each side allows 16 pieces and eight pawns. Free placement clears affected castling rights and resets counters and en passant.
- **Load or copy FEN:** controls below Game moves load full or shortened FEN, or copy the displayed position. Short forms require the board and side to move; omitted fields default to no castling or en passant, half-move counter zero, and move number one. Supplied fields are preserved and the complete FEN appears after loading. Invalid positions, counters, or castling flags show an error and preserve the board.
- **Use the board controls:** **New game** loads the standard position and keeps opponent settings. Clear board empties it; Flip swaps orientation and trays. Promotions offer queen, rook, bishop, or knight. Fresh sessions start from the standard position. The board fits the viewport with coordinates outside squares. Game moves and FEN sit below it; messages, help, and promotions appear in the coach. Individual move details and position details start collapsed.

The browser saves your game, full move tree, selected line, and difficulty locally. Reloading restores history, including repetition; missing or unknown difficulty defaults to Medium. New games retain difficulty, and older saved FEN sessions migrate to studies. Draft arrangements, opponent on/off and side, calculations, and reviews last for the session.

Storage failures warn that changes may not survive reload. Unreadable data pauses autosave and preserves the original; a separately saved valid FEN can recover the last position without history. **Keep current game & resume saving** backs up and verifies the original under a unique `tempo-recovery-v1:` key before resuming. Failed backups leave the original untouched and saving paused.

## How the coach works

Stockfish 19 Lite ranks moves; local rules turn board patterns and legal continuations into English explanations. Everything runs in the browser, with no LLM or API key. Short searches favor quick feedback, so suggestions and grades remain estimates.

**Recommendations.** Calculations search for up to 1.8 seconds, depth 18, with MultiPV five. The worker stays warm; position changes hide suggestions and cancel the search, awaiting the engine’s acknowledgement before another starts. The board stays usable during analysis, and candidates appear together from the same completed depth.

The best move always qualifies. Alternatives must be within 50 centipawns (half a pawn) from the side-to-move perspective. If the best move forces mate, only mating alternatives qualify; if all lines lose to mate, defenses must match the best mate distance. Fewer legal moves and filtering can reduce the five-candidate list. These search results do not guarantee perfect play.

**Explanations.** Rules recognize king safety, checks, captures, development, central control, defended pieces, joint attacks, open files, and promotion. Explanations describe observed features and possible continuations, with limited insight into strategic intent. Quiet moves without a concrete explanation show their action without generic strategic advice. Position details show current features and meaningful continuation outcomes. Warnings follow the side to move.

**Move reviews.** A separate warm worker finds the strongest move in a single-line search of up to 1.2 seconds, then compares best and played moves from the same position in a two-line search of up to 1.8 seconds, sharing depth and budget. Playing the first choice instead triggers a reply search of up to one second. Previews use the played line; stale results are canceled. Numeric comparisons show the evaluation difference between best and played moves. Finished checkmates and draws are handled directly.

Grades use [Lichess’s evaluation-to-outlook curve](https://lichess.org/page/accuracy) with Tempo’s forgiving bands: losing fewer than four percentage points is Good, 4–12 Inaccuracy, 12–25 Mistake, and 25 or more Blunder. These are heuristics, not personal winning probabilities. Equal pawn losses matter less in overwhelmingly won or lost positions. Mate is compared by outcome, with explicit checkmate and draw handling.

**Computer play and game state.** A separate cancellable worker uses Stockfish’s `bestmove` at the selected Skill Level. Five levels express relative strength, without calibrated Elo ratings. Moves wait at least one second from turn start, including search time. Arrangements and previews cancel pending moves; outdated searches cannot replace current analysis. Workers are disposed on unmount, and engine failures offer Retry.

The engine receives the loaded position and played moves to account for repetition. The interface keeps a game snapshot. Legal history is reconstructed when switching positions or lines. Checkmate and draws show the final score and Play again; win celebrations respect reduced motion. Evaluation uses White’s perspective: positive favors White, negative Black; mate scores identify the side with calculated forced mate. Positions and analysis stay local. Optional Google Fonts have offline system fallbacks; pieces and engine files are served locally.

## Structure

Code is grouped by responsibility. `src/main.tsx` starts the app; `src/app/App.tsx` connects the feature controllers and panels.

```text
src/
  app/                 App composition and panel focus handling
  chess/               Position validation, legal moves, saved move trees
  engine/              UCI parsing and the Stockfish worker lifecycle
  i18n/                Language preference and interface/coach translations
  features/
    board/             Board rendering, piece trays, drag/drop, previews, animation
    coach/             Recommendations, explanations, ratings, strategy, coach cards
    computer/          Opponent settings, difficulty preferences, paced computer turns
    game/              Game state, history, FEN loader, promotion, results, autosave
    openings/          Attacking lessons, localized teaching prose, read-only walkthroughs
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

Tests mirror these areas under `tests/chess`, `tests/engine`, `tests/coach`, `tests/game`, `tests/computer`, and `tests/openings`. Test filenames match the module they cover, such as `moveReview.test.ts` and `GameOverCard.test.ts`. Focused suites add a behavior suffix, such as `grading.outcomes.test.ts`; suites spanning related components use descriptive camelCase names. They cover legal arrangements and special moves, worker cancellation/recovery, recommendation filtering, grading, saved-game restoration, computer pacing, and component rendering contracts. Interaction checks for hover previews, history navigation, FEN loading, promotion, computer play, and narrow layouts should also be performed in the browser after controller or layout changes.

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
