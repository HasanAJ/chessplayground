const en = {
  "engine.error.load":
    "The chess engine could not load. Check your connection and retry analysis.",
  "engine.error.loadTimeout":
    "The engine took too long to load. Try analyzing the position again.",
  "engine.error.start":
    "The chess engine could not start. Try refreshing the page or using a browser with WebAssembly support.",
  "engine.error.responseTimeout":
    "The engine took too long to respond. Try analyzing the position again.",
  "engine.error.incompleteAnalysis":
    "No complete analysis was returned. Try this position again.",
  "language.selector.label": "Language",
  "position.error.invalidFen": "Invalid FEN: {0}",
  "position.error.pawnLimit":
    "{0} can have at most 8 pawns. Remove one before adding another.",
  "position.error.pieceLimit":
    "{0} can have at most 16 pieces. Remove one before adding another.",
  "position.error.missingPlayableKing":
    "Add the {0} king to play or calculate.",
  "position.error.inactiveKingInCheck":
    "The {0} king is in check, but it is {1}'s turn. Change whose turn it is or move the king to safety.",
  "position.error.castlingPieces":
    "Castling right {0} needs the {1} king and rook on their original squares.",
  "position.error.missingKing": "Missing {0} king.",
  "position.error.tooManyKings": "Too many {0} kings.",
  "chess.side.white": "White",
  "chess.side.black": "Black",
  "header.home": "Tempo home",
  "header.tagline": "Your chess playground",
  "intro.heading.start": "Your next move,",
  "intro.heading.end": "explained.",
  "intro.tagline": "Explore the board. Understand the plan. Try a move.",
  "intro.guide.play":
    "Click a piece and its destination to play a move, or drag pieces from the trays to build your own position.",
  "intro.guide.analyze":
    "Select “{0}” for suggestions and explanations, then preview a reply or try a move.",
  "intro.guide.practice":
    "Play both sides, or turn on the computer opponent to practice against it.",
  "footer.tagline": "A good move starts with a little understanding.",
  "footer.engine": "Powered by Stockfish 19",
  "move.description.normal": "{0}{1} from {2} to {3}",
  "move.description.castle": "Castle: king {0} to {1}, rook {2}",
  "move.description.kingsideRook": "h{0} to f{1}",
  "move.description.queensideRook": "a{0} to d{1}",
  "move.description.capture": ", taking the {0}{1}",
  "move.description.enPassantSquare": " on {0} en passant",
  "move.description.promotion": ", promoting to a {0}",
  "move.description.checkmate": " — checkmate",
  "move.description.check": " — check",
  "position.error.missingBothKings": "Add both kings to play or calculate.",
  "position.error.pawnOnEdge":
    "Move pawns off the first and last ranks to play or calculate.",
  "position.error.illegalArrangement":
    "Arrange a legal position to play or calculate.",
  "position.error.invalidPosition": "This position is not valid.",
  "position.error.moveCounters":
    "The FEN’s move counters must be whole numbers within the supported range.",
  "position.error.castlingRights":
    "Castling availability must list each right (KQkq) once, or use “-” for none.",
  "position.error.emptySquaresFen":
    "Invalid FEN: piece data must use 1–8 for empty squares.",
  "position.error.enPassantCounter":
    "An en passant target needs a zero half-move counter because the last move was a pawn move.",
  "position.error.enPassantPawn":
    "The en passant square needs an opposing pawn that has just advanced two squares. Check the FEN’s fourth field.",
  "game.ending.checkmate": "{0} wins by checkmate.",
  "game.ending.stalemate":
    "Stalemate. There are no legal moves, and the king is safe.",
  "game.ending.repetition": "Draw by threefold repetition.",
  "game.ending.insufficientMaterial":
    "Draw. Neither side has enough material to checkmate.",
  "game.ending.fiftyMoves": "Draw by the fifty-move rule.",
  "board.controls.label": "Chess board and position controls",
  "board.newGame.description":
    "Start a new game from the standard chess position",
  "board.newGame.label": "New game",
  "board.clear": "Clear board",
  "board.navigation.label": "Game move navigation",
  "board.navigation.previous": "Previous game move",
  "board.navigation.next": "Next game move",
  "board.flip": "Flip board",
  "board.openCoach": "See your coach",
  "chess.piece.label": "{0} {1}",
  "board.evaluation.calculateFirst":
    "Calculate best moves to see the evaluation",
  "board.evaluation.previewPaused": "Evaluation paused during board preview",
  "board.evaluation.legend": "+ = White ahead · − = Black ahead",
  "board.evaluation.whiteScore": "White evaluation {0}",
  "board.evaluation.pending": "Evaluation pending",
  "board.label.preview": "Move preview chessboard",
  "board.label.history": "Game history chessboard",
  "board.label.interactive": "Interactive chessboard",
  "board.square.empty": " empty",
  "board.square.check": " in check",
  "board.tray.place": "Place {0} {1}",
  "board.tray.add": "Add {0} {1} · Click or drag to board",
  "coach.alternatives.heading": "Other good options",
  "coach.evaluation.description":
    "Position estimate in pawn units: + favors White, − favors Black.",
  "coach.move.play": "Play {0}",
  "coach.lesson.mateThreat.advice":
    "Before moving, check whether their pieces can reach your king on {0}. Here, {1} ends the game.",
  "coach.lesson.mateThreat.focus": "See their checkmate threat",
  "coach.lesson.undefended.consequence":
    "leaves your {0} on {1} with no defender. Their {2} can take it with {3}",
  "coach.lesson.defendedCapture.consequence":
    "allows their {0} to take your {1} on {2} with {3}. Your piece has a defender, so follow the rest of the trade",
  "coach.lesson.undefended.advice":
    "Before moving, check which of your pieces they can capture and whether you can capture back.",
  "coach.lesson.defendedCapture.advice":
    "Before accepting a trade, compare the pieces both sides can capture, including the next reply.",
  "coach.lesson.capture.focus": "See the piece they can capture",
  "coach.lesson.laterCapture.consequence":
    "allows the shown line to reach {0}, where their {1} takes your {2} on {3}. Further trades may follow",
  "coach.lesson.forcedReply.advice":
    "Follow their checks as well as their captures. A check may force you to respond before you can protect another piece.",
  "coach.lesson.laterCapture.advice":
    "Look beyond their first reply: follow the next captures too before deciding whether a trade helps you.",
  "coach.lesson.laterCapture.focus": "See the later capture in this line",
  "coach.piece.yoursOnSquare": "your {0} on {1}",
  "common.join.and": " and ",
  "coach.lesson.fork.consequence":
    "allows a fork: their {0} on {1} attacks {2} at once",
  "coach.lesson.fork.advice":
    "Look for replies that attack two pieces at once. Moving or protecting one may leave the other under attack.",
  "coach.lesson.fork.focus": "See the two attacks",
  "coach.lesson.compareCapture":
    "Compare the capture on {0} with {1}. Preview their reply before deciding whether the capture helps.",
  "coach.lesson.compareDefense":
    "Check which of your pieces need protection. {0} offers another way to defend your position.",
  "coach.lesson.compareEscape":
    "Check whether a piece is under attack before starting another plan. {0} moves a piece out of danger.",
  "coach.lesson.compareAlternative":
    "Check their checks, captures, and attacks before choosing your move. Preview {0} to compare the alternative.",
  "coach.review.error.needsAnalysis":
    "The move needs analysis of the resulting position.",
  "coach.review.checkmate":
    "{0} delivers checkmate. Their king has no way out—you’ve finished the game.",
  "coach.review.best": "{0} is the top choice here. {1}",
  "coach.review.good.draw":
    "gets you a draw, close to the best result found here",
  "coach.review.good.winningMate":
    "keeps your checkmate on track in the analyzed line",
  "coach.review.good.losingMate":
    "holds up about as well as the best defense found here, though the analysis still finds mate against you",
  "coach.review.good.winning":
    "keeps your strong advantage. You’re still in a great position",
  "coach.review.good.losing":
    "holds up about as well as the best option in an already tough position",
  "coach.review.good.balanced": "looks good here, with chances close to {0}",
  "coach.review.consequence.draw":
    "leads to a draw. {0} offered better chances",
  "coach.review.consequence.allowsMate":
    "allows a forced checkmate in the analyzed line",
  "coach.review.consequence.missesMate": "lets a forced checkmate slip away",
  "coach.review.consequence.worseChances":
    "gives your opponent better chances than {0} would",
  "coach.review.response.draw":
    "Try the other move to see what you could keep playing for.",
  "coach.review.response.preview":
    "Play through the reply to see what they could do next.",
  "coach.explanation.pressure.title": "Build pressure on {0}",
  "coach.explanation.pressure.text":
    "Your {0} joins another piece in attacking their {1} on {2}. They now have more than one attacker to deal with.",
  "coach.explanation.attack.focus": "See the attack on their {0}",
  "coach.explanation.supportCenter.title": "Support your center",
  "coach.explanation.defend.title": "Defend your {0}",
  "coach.explanation.defend.text":
    "Your {0} on {1} now defends the {2} on {3}. If they capture it, your {4} may be able to capture back; check the reply before trading.",
  "coach.explanation.defend.focus": "See the defense of your {0}",
  "coach.explanation.escapeAttack.title": "Move your {0} out of danger",
  "coach.explanation.escapeAttack.text":
    "Your {0} was under attack on {1}. On {2}, none of their pieces currently attack it.",
  "coach.explanation.escapeAttack.focus": "See your {0} move out of danger",
  "coach.explanation.attack.title": "Attack the {0}",
  "coach.explanation.attack.existing":
    "Your {0} on {1} attacks their {2} on {3}. Watch for a retreat, a defense, or a threat of their own.",
  "coach.explanation.attack.new":
    "Your {0} on {1} now attacks their {2} on {3}. They may move it or defend it, so look at the reply before counting on a capture.",
  "coach.piece.onSquare": "{0} on {1}",
  "coach.explanation.check.plural": "Your {0} give check.",
  "coach.explanation.check.singular": "Your {0} gives check.",
  "coach.explanation.promotion.prefix": "Your pawn promotes to a {0} on {1}. ",
  "coach.explanation.checkmate.title": "Finish with checkmate",
  "coach.explanation.checkmate.plural":
    "{0}Your {1} deliver checkmate. Their king has no way out.",
  "coach.explanation.checkmate.singular":
    "{0}Your {1} delivers checkmate. Their king has no way out.",
  "coach.explanation.checkmate.focus": "See the checkmate",
  "coach.explanation.promotion.title": "Promote your pawn",
  "coach.explanation.promotion.text":
    "You now have a {0} in place of that pawn. Look at the reply to see how they respond.",
  "coach.explanation.promotion.focus": "See the promotion",
  "coach.explanation.castle.title": "Castle and bring your rook into play",
  "coach.explanation.castle.text":
    "Castling moves your king away from the center and brings your rook toward the middle.{0}",
  "coach.explanation.castle.focus": "See the king and rook move",
  "coach.explanation.escapeCheck.title": "Get your king out of check",
  "coach.explanation.escapeCheck.text": "{0} gets you out of check{1}.{2}",
  "coach.explanation.escapeCheck.capture": " and takes the {0} on {1}",
  "coach.explanation.escapeCheck.block":
    " by blocking the attack with your {0}",
  "coach.explanation.escapeCheck.kingMove": " by moving your king to {0}",
  "coach.explanation.escapeCheck.safe":
    " Your king is no longer under attack, so you can continue playing.",
  "coach.explanation.escapeCheck.focus": "See how you escape check",
  "coach.explanation.captureCheck.title": "Capture with check",
  "coach.explanation.capture.title": "Capture the {0}",
  "coach.explanation.capture.text": "Your {0} takes the {1} on {2}{3}. {4}",
  "coach.explanation.capture.enPassant": " en passant, landing on ",
  "coach.explanation.capture.attacked":
    "Their pieces attack your {0} on {1}; preview the reply to check whether they capture back.",
  "coach.explanation.capture.safe":
    "None of their pieces currently attack your {0} on {1}.",
  "coach.explanation.capture.focus": "See the capture and possible attackers",
  "coach.explanation.check.title": "Give check",
  "coach.explanation.check.text":
    "{0} Your opponent has to deal with the attack on their king.",
  "coach.explanation.check.focus": "See the attack on their king",
  "coach.explanation.develop.centerControl":
    "From here, it attacks {0}, helping you control the center.",
  "coach.explanation.develop.purpose":
    "Bringing pieces off the starting row gives you more pieces to use in your next moves.",
  "coach.explanation.develop.title": "Bring another piece into play",
  "coach.explanation.develop.text":
    "Your {0} comes off the back rank to {1}. {2}",
  "coach.explanation.develop.focus": "See your piece and the center squares",
  "coach.explanation.center.title": "Claim the center",
  "coach.explanation.center.text":
    "Your pawn takes space in the center on {0}. It attacks {1}, helping limit where their pieces can move safely.",
  "coach.explanation.center.focus": "See the pawn’s control of the center",
  "coach.explanation.openFile.title": "Put your rook on an open file",
  "coach.explanation.openFile.text":
    "There are no pawns on the {0}-file, the column your rook moves to. With no pawns in that column, look for squares your rook can reach before another piece blocks its path.",
  "coach.explanation.openFile.focus": "See the open file",
  "coach.explanation.rook.title": "Improve your rook’s position",
  "coach.explanation.rook.text":
    "Try your rook on {0}. Play through the reply below to see which lines and targets it can work with.",
  "coach.explanation.rook.focus": "See your rook’s move",
  "coach.explanation.king.title": "Improve your king’s position",
  "coach.explanation.king.text":
    "Your king steps from {0} to {1}. Check what their pieces can do before choosing its next square.",
  "coach.explanation.king.focus": "See your king’s move",
  "coach.explanation.pawn.title": "Gain space with your pawn",
  "coach.explanation.pawn.text":
    "Your pawn moves up to {0}, claiming more space. Keep an eye on the squares it leaves behind.",
  "coach.explanation.pawn.focus": "See your pawn’s advance",
  "coach.explanation.nearCenter.title": "Improve a piece near the center",
  "coach.explanation.nearCenter.text":
    "Your {0} moves to {1}, near the center. {2}",
  "coach.explanation.nearCenter.reply":
    "Preview the reply to see how they can respond before choosing its next move.",
  "coach.explanation.nearCenter.focus": "See the move near the center",
  "coach.explanation.reposition.title": "Reposition your {0}",
  "coach.explanation.reposition.text":
    "Try your {0} on {1}. Play through the next few moves to see how your opponent can respond and where your pieces end up.",
  "coach.explanation.reposition.focus": "See your {0}’s move",
  "coach.reply.checkmate": "They can checkmate with {0} ({1} to {2}).",
  "coach.reply.castle": "castle {0}",
  "chess.castling.kingside": "kingside",
  "chess.castling.queenside": "queenside",
  "coach.reply.capture": "take your {0} on {1}{2} with their {3}",
  "coach.reply.enPassant": " en passant",
  "coach.reply.move": "move their {0} to {1}",
  "coach.reply.promotion": " and promote to a {0}",
  "coach.reply.check": " and give check",
  "coach.reply.summary": "They may {0}{1}{2} ({3}).",
  "coach.warning.check":
    "Deal with the check first. Look for a king move, a way to take the attacker, or a piece that can block the attack.",
  "coach.warning.undefended":
    "Your {0} on {1} is under attack with no defender. Can you move it, protect it, or make a threat they have to answer first?",
  "coach.warning.defended":
    "Your {0} on {1} is under attack. It has a defender, but play out the trade before leaving it there.",
  "coach.warning.general":
    "Before you move, take a quick look at their checks, captures, and attacks on unprotected pieces. Start with the likely reply below your move.",
  "coach.strategy.attack": "{0} puts {1} under attack from your {2}.",
  "coach.piece.theirsOnSquare": "their {0} on {1}",
  "coach.strategy.undefended.singular":
    "Your {0} is under attack with no defender.",
  "coach.strategy.undefended.plural":
    "Your {0} are under attack with no defender.",
  "coach.strategy.center": "Your pieces cover {0} in the center.",
  "coach.strategy.line.checkmate": "{0} finishes this line with checkmate.",
  "coach.strategy.line.capture":
    "The preview ends with {0} playing {1}, a capture. The exchange may continue.",
  "coach.strategy.material.gain.singular":
    "In this possible line, you’d gain the equivalent of {0} pawn in material.",
  "coach.strategy.material.gain.plural":
    "In this possible line, you’d gain the equivalent of {0} pawns in material.",
  "coach.strategy.material.loss.singular":
    "In this possible line, you’d give up the equivalent of {0} pawn in material.",
  "coach.strategy.material.loss.plural":
    "In this possible line, you’d give up the equivalent of {0} pawns in material.",
  "coach.strategy.material.even":
    "The material balance stays the same in this line.",
  "coach.strategy.change.check":
    "{0} puts your king in check. Getting out of check comes first.",
  "coach.strategy.change.undefended":
    "{0} leaves your {1} on {2} under attack with no defender. Take care of it before carrying on with your plan.",
  "coach.strategy.change.capture":
    "They’ve just taken your {0} with {1}. Look at {2} before deciding how to answer.",
  "coach.strategy.change.center":
    "{0} changes their control of {1}. Try {2} now, and see how they might respond.",
  "coach.strategy.change.move": "Their {0} is now on {1}. Try {2}{3}.",
  "coach.strategy.change.reply": "; one reply to look at is {0}",
  "coach.strategy.change.respond": " and see how they respond",
  "coach.strategy.compare.forced": "This position has only one legal move.",
  "coach.strategy.compare.onlyRecommendation":
    "{0} is the only recommended move here. The other moves checked give up too much compared with it.",
  "coach.strategy.compare.mate":
    "Here, checkmate threats matter more than a small difference in score. Play through {0} and {1}, and follow the checks carefully.",
  "coach.strategy.compare.similar":
    "{0} and {1} both look good here. Play through their replies and choose the position you’d rather have.",
  "coach.strategy.compare.stronger":
    "{0} looks stronger than {1} here. Play through both replies to see how the positions differ.",
  "coach.continuation.previewReply": "Preview likely reply: {0}",
  "coach.continuation.replyHeading": "LIKELY REPLY",
  "coach.continuation.label": "Engine continuation",
  "coach.continuation.heading": "POSSIBLE NEXT MOVES",
  "coach.continuation.previewMove": "Preview move {0}: {1} plays {2}",
  "engine.error.noLegalCandidates":
    "The engine returned no legal candidates. Please retry analysis.",
  "coach.position.heading": "About this position",
  "coach.position.changed": "WHAT CHANGED",
  "coach.position.hideSquares": "Hide key squares",
  "coach.position.showSquares": "Highlight key squares",
  "coach.position.squaresDescription":
    "Teal outlines mark the squares discussed above: {0}.",
  "coach.analysis.status.thinking": "Analyzing…",
  "coach.analysis.status.unavailable": "Engine unavailable",
  "coach.analysis.status.ready": "Recommendations ready",
  "coach.analysis.reviewingPosition":
    "Reviewing {0}. Analysis is for this position.",
  "coach.analysis.errorHeading": "Let’s try that again.",
  "coach.analysis.retry": "Retry analysis",
  "coach.analysis.label": "Best move and strategy",
  "coach.analysis.search.heading": "FINDING YOUR MOVE",
  "coach.analysis.search.bestMove": "Finding {0}’s best move…",
  "coach.analysis.search.history":
    "Looking at your options and their replies from this earlier position.",
  "coach.analysis.search.live":
    "Checking your options and your opponent’s replies. Feel free to keep playing.",
  "coach.analysis.search.depth": "Checking deeper · depth {0}",
  "coach.analysis.search.estimate": "Usually ready in a couple of seconds",
  "coach.warnings.heading": "Watch out for",
  "coach.warnings.description":
    "Hover or focus to highlight the threatened piece and its attackers.",
  "coach.best.escapeCheck": "Escape check",
  "coach.best.heading": "BEST MOVE",
  "coach.best.forced": "Only legal move",
  "coach.best.continuity": "Plan continues",
  "coach.best.play": "Play best move {0}",
  "coach.best.hideReply": "Hide reply",
  "coach.best.previewReply": "Preview reply",
  "coach.best.explore": "Explore next moves",
  "coach.review.error.failed":
    "The engine could not review this move. Try again.",
  "coach.review.error.comparison":
    "The engine could not reliably compare this move. Try again.",
  "coach.review.error.reply":
    "The engine could not check the reply. Try again.",
  "coach.feedback.status.reviewing": "Reviewing…",
  "coach.feedback.status.unavailable": "Review unavailable",
  "coach.feedback.label": "Move feedback",
  "coach.feedback.toggleDescription": "{0}: {1}. {2}. {3} details",
  "common.show": "Show",
  "common.hide": "Hide",
  "coach.feedback.pending": "Looking at your move and the best alternatives…",
  "coach.feedback.retry": "Retry move review",
  "coach.feedback.nextTime": "Next time",
  "coach.feedback.likelyReply": "Likely reply",
  "coach.feedback.evaluationDescription":
    "The evaluation difference is measured in pawn units. Grades account for the overall position; mate outcomes have no pawn score.",
  "coach.feedback.quickReview": "Quick review",
  "coach.feedback.evaluationDrop": "{0} evaluation drop",
  "coach.explanation.matingAttack.title": "Keep the mating attack going",
  "coach.explanation.matingAttack.text":
    "There’s a checkmate in {0} moves starting with {1}, according to this analysis. Play through the replies to see how the attack works.",
  "coach.explanation.matingAttack.focus": "See the start of the mating attack",
  "coach.explanation.mateDefense.title": "Find the toughest defense",
  "coach.explanation.mateDefense.text":
    "Your king is in serious trouble: this analysis still finds a forced checkmate after {0}. Play through their checks to see where the danger comes from.",
  "coach.explanation.mateDefense.focus": "See the defensive move",
  "coach.reply.unavailable":
    "No reply is included in this preview. Try the move to explore what comes next.",
  "coach.reply.continuation": " You could follow with {0}: {1}.",
  "coach.reply.terminal.checkmate": "That’s checkmate. They have no reply.",
  "coach.reply.terminal.draw": "This move ends the game in a draw.",
  "coach.estimate.mate": "A forced mate for {0}",
  "coach.estimate.balanced": "A balanced position",
  "coach.estimate.smallEdge": "{0} has a small edge",
  "coach.estimate.advantage": "{0} has the advantage",
  "coach.estimate.winning": "{0} has a winning advantage",
  "coach.status.checkmate": "Checkmate",
  "coach.status.draw": "Draw",
  "coach.status.previewCheck": "Preview · Check",
  "coach.status.preview": "Preview",
  "coach.status.check": "Check",
  "coach.status.paused": "Paused",
  "coach.status.replying": "Replying…",
  "coach.status.thinking": "Thinking…",
  "coach.status.reviewing": "Reviewing",
  "coach.status.yourTurn": "Your turn",
  "coach.panel.label": "Position analysis",
  "coach.panel.heading": "Your coach",
  "coach.turn.label": "To move",
  "coach.turn.select": "Who plays next",
  "coach.turn.changeDescription":
    "Changing the player starts a new position and clears the move history.",
  "coach.panel.backToBoard": "Back to board ↑",
  "coach.calculate.label.waiting": "Waiting for computer",
  "coach.calculate.label.thinking": "Calculating best moves",
  "coach.calculate.label.ready": "Calculate best moves",
  "coach.calculate.text.waiting": "Waiting for computer…",
  "coach.calculate.text.thinking": "Calculating…",
  "common.dismissError": "Dismiss error",
  "game.history.controls": "Move history controls",
  "game.history.backToLatest": "Back to latest",
  "coach.context.preview": "Preview · {0}",
  "coach.context.reviewingUpdating":
    "Reviewing {0} · Updating this position’s analysis",
  "coach.context.reviewingReady":
    "Reviewing {0} · Analysis is for this position",
  "coach.context.reviewingIdle":
    "Reviewing {0} · Calculate when you want guidance",
  "computer.status.movingSoon": "Computer moves in a moment…",
  "computer.status.choosingReply": "Computer is choosing a reply…",
  "coach.context.updating": "Updating {0}’s analysis · You can keep playing",
  "coach.panel.returnToGame": "Return to game",
  "computer.status.invalidPosition":
    "Arrange a legal position with both kings to play the computer.",
  "computer.status.gameEnded": "This game has ended. Start a new game to play.",
  "computer.status.preview": "Return to your game to continue playing.",
  "computer.status.enable": "Turn on “Play computer” to play against {0}.",
  "computer.status.settings": "Game paused while you choose your settings.",
  "computer.error.move": "The computer could not choose a move. Try again.",
  "computer.status.thinking": "Computer is thinking…",
  "computer.status.yourTurn": "Your turn. Make a move on the board.",
  "computer.error.saveDifficulty":
    "Your computer difficulty could not be saved in this browser.",
  "computer.toggle.label": "Play computer",
  "computer.toggle.text": "Computer",
  "computer.settings.heading": "Computer settings",
  "computer.retry": "Retry computer",
  "computer.settings.close": "Close computer settings",
  "computer.settings.side": "You play as",
  "computer.settings.difficulty": "Your challenge",
  "common.retry": "Retry",
  "common.done": "Done",
  "game.history.startingPosition": "Starting position",
  "game.save.error.unavailable":
    "Browser storage is unavailable or full. Your latest changes may not survive a reload.",
  "game.save.error.backup":
    "The original save could not be backed up. Autosave remains paused. Your latest changes may not survive a reload.",
  "game.status.continuing": "Continuing from the selected position.",
  "game.result.label": "Game result",
  "game.result.checkmate": "CHECKMATE",
  "game.result.draw": "DRAW",
  "game.result.drawHeading": "Honors shared.",
  "game.result.checkmateMessage": "A royal finish. Ready for another round?",
  "game.result.drawMessage": "Good game. There’s always another round.",
  "game.result.score": "Final score: White {0}, Black {1}",
  "game.result.playAgain": "Play again",
  "game.promotion.label": "Choose a promotion piece",
  "game.promotion.cancel": "Cancel promotion",
  "game.promotion.heading": "Your pawn made it.",
  "game.promotion.description": "Choose its next chapter.",
  "game.promotion.choose": "Promote to {0}",
  "game.save.label": "Game saving status",
  "game.save.recoveryHeading": "Saved game needs recovery",
  "game.save.unavailableHeading": "Browser save unavailable",
  "game.save.backupHeading": "Original save preserved",
  "game.save.backupDescription":
    "The original data is kept in a separate browser recovery backup. Autosave has resumed.",
  "game.save.resume": "Keep current game & resume saving",
  "game.save.dismiss": "Dismiss recovery notice",
  "position.error.invalidInput": "This FEN is not valid.",
  "position.error.clipboard":
    "Clipboard access is unavailable. Select the FEN text and copy it manually.",
  "position.controls.label": "FEN position controls",
  "position.controls.heading": "FEN position",
  "position.controls.input": "Paste a FEN position",
  "position.controls.copy": "Copy current FEN",
  "position.controls.load": "Load",
  "game.save.error.readStorage":
    "Browser storage could not be read. Your saved game may be unavailable.",
  "game.save.error.restoredPosition":
    "Your saved game could not be read. The last valid position was restored, without its move history. Autosave is paused to protect the original data.",
  "game.save.error.freshBoard":
    "Your saved game could not be read. A fresh board is open. Autosave is paused to protect the original data.",
  "game.save.error.verifyBackup": "Recovery backup could not be verified.",
  "game.history.label": "Game moves",
  "game.history.heading": "Move history",
  "game.history.viewStart": "View starting position",
  "game.history.start": "Start",
  "game.history.viewMove": "View position after {0}",
  "chess.piece.pawn": "pawn",
  "chess.piece.knight": "knight",
  "chess.piece.bishop": "bishop",
  "chess.piece.rook": "rook",
  "chess.piece.queen": "queen",
  "chess.piece.king": "king",
  "computer.level.beginner": "Beginner",
  "computer.level.easy": "Easy",
  "computer.level.medium": "Medium",
  "computer.level.hard": "Hard",
  "computer.level.expert": "Expert",
  "coach.grade.best": "Best move",
  "coach.grade.good": "Good move",
  "coach.grade.inaccuracy": "Inaccuracy",
  "coach.grade.mistake": "Mistake",
  "coach.grade.blunder": "Blunder",
  "coach.feedback.context.yourLastMove": "Your last move",
  "coach.feedback.context.selectedMove": "Selected move",
  "page.title": "Tempo — Your next move, explained.",
  "position.fen.fields": "must contain six space-delimited fields",
  "position.fen.moveNumber": "move number must be a positive integer",
  "position.fen.halfMoveCounter":
    "half move counter number must be a non-negative integer",
  "position.fen.enPassantSquare": "en-passant square is invalid",
  "position.fen.castlingRights": "castling availability is invalid",
  "position.fen.sideToMove": "side-to-move is invalid",
  "position.fen.rows": "piece data does not contain 8 '/'-delimited rows",
  "position.fen.consecutiveNumbers":
    "piece data is invalid (consecutive number)",
  "position.fen.invalidPiece": "piece data is invalid (invalid piece)",
  "position.fen.rankSize": "piece data is invalid (too many squares in rank)",
  "position.fen.illegalEnPassant": "illegal en-passant square",
  "position.fen.pawnOnEdge": "some pawns are on the edge rows",
  "coach.feedback.context.lastMove": "Last move",
  "position.notice.loaded": "Position loaded",
  "position.notice.copied": "Position copied",
  "position.fen.emptySquares": "piece data must use 1–8 for empty squares.",
  "game.result.winner": "{0} wins!",
  "board.tray.label": "{0} pieces",
  "coach.alternatives.description": "Alternative: {0}. {1}. {2}",
} as const;

export type Catalog = { [Key in keyof typeof en]: string };
export default en;
