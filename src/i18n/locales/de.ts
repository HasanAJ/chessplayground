import type { Catalog } from "./en";

export default {
  "The chess engine could not load. Check your connection and retry analysis.":
    "Die Schachengine konnte nicht geladen werden. Prüfe deine Verbindung und starte die Analyse erneut.",
  "The engine took too long to load. Try analyzing the position again.":
    "Das Laden der Engine hat zu lange gedauert. Analysiere die Stellung erneut.",
  "The chess engine could not start. Try refreshing the page or using a browser with WebAssembly support.":
    "Die Engine konnte nicht starten. Lade die Seite neu oder nutze einen Browser mit WebAssembly-Unterstützung.",
  "The engine took too long to respond. Try analyzing the position again.":
    "Die Engine hat zu lange für die Antwort gebraucht. Analysiere die Stellung erneut.",
  "No complete analysis was returned. Try this position again.":
    "Es wurde keine vollständige Analyse geliefert. Versuche diese Stellung erneut.",
  Language: "Sprache",
  "Invalid FEN: {0}": "Ungültiges FEN: {0}",
  "{0} can have at most 8 pawns. Remove one before adding another.":
    "{0} darf höchstens 8 Bauern haben. Entferne einen, bevor du einen weiteren hinzufügst.",
  "{0} can have at most 16 pieces. Remove one before adding another.":
    "{0} darf höchstens 16 Figuren haben. Entferne eine, bevor du eine weitere hinzufügst.",
  "Add the {0} king to play or calculate.":
    "Füge den König von {0} hinzu, um zu spielen oder zu analysieren.",
  "The {0} king is in check, but it is {1}'s turn. Change whose turn it is or move the king to safety.":
    "Der König von {0} steht im Schach, aber {1} ist am Zug. Ändere die Zugfarbe oder bringe den König in Sicherheit.",
  "Castling right {0} needs the {1} king and rook on their original squares.":
    "Das Rochaderecht {0} erfordert König und Turm von {1} auf ihren Ausgangsfeldern.",
  "Missing {0} king.": "Der König von {0} fehlt.",
  "Too many {0} kings.": "Zu viele Könige für {0}.",
  White: "Weiß",
  Black: "Schwarz",
  "Tempo home": "Tempo-Startseite",
  "Your chess playground": "Dein Schachspielplatz",
  "How it works": "So funktioniert’s",
  "Your next move,": "Dein nächster Zug,",
  "explained.": "erklärt.",
  "Explore the board. Understand the plan. Try a move.":
    "Erkunde das Brett. Verstehe den Plan. Probiere einen Zug.",
  "A good move starts with a little understanding.":
    "Ein guter Zug beginnt mit etwas Verständnis.",
  "Powered by Stockfish 19": "Mit Stockfish 19",
  "{0}{1} from {2} to {3}": "{0}{1} von {2} nach {3}",
  "Castle: king {0} to {1}, rook {2}":
    "Rochade: König von {0} nach {1}, Turm {2}",
  "h{0} to f{1}": "von h{0} nach f{1}",
  "a{0} to d{1}": "von a{0} nach d{1}",
  ", taking the {0}{1}": ", schlägt {0}{1}",
  " on {0} en passant": " auf {0} en passant",
  ", promoting to a {0}": ", Umwandlung in {0}",
  " — checkmate": " — Schachmatt",
  " — check": " — Schach",
  "Add both kings to play or calculate.":
    "Füge beide Könige hinzu, um zu spielen oder zu analysieren.",
  "Move pawns off the first and last ranks to play or calculate.":
    "Entferne Bauern von der ersten und letzten Reihe, um zu spielen oder zu analysieren.",
  "Arrange a legal position to play or calculate.":
    "Baue eine legale Stellung auf, um zu spielen oder zu analysieren.",
  "This position is not valid.": "Diese Stellung ist ungültig.",
  "The FEN’s move counters must be whole numbers within the supported range.":
    "Die FEN-Zugzähler müssen ganze Zahlen im unterstützten Bereich sein.",
  "Castling availability must list each right (KQkq) once, or use “-” for none.":
    "Jedes Rochaderecht (KQkq) darf nur einmal vorkommen; „-“ steht für keines.",
  "Invalid FEN: piece data must use 1–8 for empty squares.":
    "Ungültiges FEN: Leere Felder müssen mit 1–8 angegeben werden.",
  "An en passant target needs a zero half-move counter because the last move was a pawn move.":
    "Ein En-passant-Feld erfordert einen Halbzugzähler von null, da zuletzt ein Bauer gezogen hat.",
  "The en passant square needs an opposing pawn that has just advanced two squares. Check the FEN’s fourth field.":
    "Das En-passant-Feld erfordert einen gegnerischen Bauern, der gerade zwei Felder vorgerückt ist. Prüfe das vierte FEN-Feld.",
  "{0} wins by checkmate.": "{0} gewinnt durch Schachmatt.",
  "Stalemate. There are no legal moves, and the king is safe.":
    "Patt. Es gibt keine legalen Züge und der König steht nicht im Schach.",
  "Draw by threefold repetition.":
    "Remis durch dreifache Stellungswiederholung.",
  "Draw. Neither side has enough material to checkmate.":
    "Remis. Keine Seite hat genügend Material für ein Schachmatt.",
  "Draw by the fifty-move rule.": "Remis nach der Fünfzig-Züge-Regel.",
  "Chess board and position controls": "Schachbrett und Stellungssteuerung",
  "Start a new game from the standard chess position":
    "Eine neue Partie aus der Anfangsstellung starten",
  "New game": "Neue Partie",
  "Clear board": "Brett leeren",
  "Game move navigation": "Zugnavigation",
  "Previous game move": "Vorheriger Zug",
  "Next game move": "Nächster Zug",
  "Flip board": "Brett drehen",
  "See your coach": "Zum Trainer",
  "{0} {1}": "{1} · {0}",
  "Calculate best moves to see the evaluation":
    "Analysiere die besten Züge, um die Bewertung zu sehen",
  "Evaluation paused during board preview":
    "Bewertung während der Brettvorschau pausiert",
  "+ = White ahead · − = Black ahead":
    "+ = Weiß im Vorteil · − = Schwarz im Vorteil",
  "White evaluation {0}": "Bewertung aus weißer Sicht: {0}",
  "Evaluation pending": "Bewertung ausstehend",
  "Move preview chessboard": "Schachbrett der Zugvorschau",
  "Game history chessboard": "Schachbrett des Partieverlaufs",
  "Interactive chessboard": "Interaktives Schachbrett",
  " empty": " leer",
  " in check": " im Schach",
  "Place {0} {1}": "Setzen: {1} · {0}",
  "Add {0} {1} · Click or drag to board":
    "Hinzufügen: {1} · {0} · Klicken oder aufs Brett ziehen",
  "Other good options": "Weitere gute Optionen",
  "Position estimate in pawn units: + favors White, − favors Black.":
    "Bewertung in Bauerneinheiten: + für Weiß, − für Schwarz.",
  "Play {0}": "{0} spielen",
  "Before moving, check whether their pieces can reach your king on {0}. Here, {1} ends the game.":
    "Prüfe vor dem Zug, ob gegnerische Figuren deinen König auf {0} erreichen können. Hier beendet {1} die Partie.",
  "See their checkmate threat": "Mattdrohung ansehen",
  "leaves your {0} on {1} with no defender. Their {2} can take it with {3}":
    "lässt die eigene Figur ({0}) auf {1} ungedeckt. Die gegnerische Figur ({2}) kann sie mit {3} schlagen",
  "allows their {0} to take your {1} on {2} with {3}. Your piece has a defender, so follow the rest of the trade":
    "ermöglicht es der gegnerischen Figur ({0}), deine Figur ({1}) auf {2} mit {3} zu schlagen. Sie ist gedeckt; verfolge den weiteren Abtausch",
  "Before moving, check which of your pieces they can capture and whether you can capture back.":
    "Prüfe vor dem Zug, welche deiner Figuren geschlagen werden können und ob du zurückschlagen kannst.",
  "Before accepting a trade, compare the pieces both sides can capture, including the next reply.":
    "Vergleiche vor einem Abtausch die möglichen Schläge beider Seiten, einschließlich der nächsten Antwort.",
  "See the piece they can capture": "Bedrohte Figur ansehen",
  "allows the shown line to reach {0}, where their {1} takes your {2} on {3}. Further trades may follow":
    "führt in der gezeigten Variante zu {0}: Die gegnerische Figur ({1}) schlägt deine Figur ({2}) auf {3}. Weitere Abtäusche können folgen",
  "Follow their checks as well as their captures. A check may force you to respond before you can protect another piece.":
    "Verfolge auch die gegnerischen Schachgebote. Sie können eine Antwort erzwingen, bevor du eine andere Figur schützt.",
  "Look beyond their first reply: follow the next captures too before deciding whether a trade helps you.":
    "Schau über die erste Antwort hinaus: Verfolge weitere Schläge, bevor du einen Abtausch bewertest.",
  "See the later capture in this line":
    "Späteren Schlag in dieser Variante ansehen",
  "your {0} on {1}": "deine Figur ({0}) auf {1}",
  " and ": " und ",
  "allows a fork: their {0} on {1} attacks {2} at once":
    "ermöglicht eine Gabel: Die gegnerische Figur ({0}) auf {1} greift {2} gleichzeitig an",
  "Look for replies that attack two pieces at once. Moving or protecting one may leave the other under attack.":
    "Achte auf Antworten, die zwei Figuren gleichzeitig angreifen. Wenn du eine rettest, bleibt die andere möglicherweise bedroht.",
  "See the two attacks": "Beide Angriffe ansehen",
  "Compare the capture on {0} with {1}. Preview their reply before deciding whether the capture helps.":
    "Vergleiche den Schlag auf {0} mit {1}. Sieh dir die Antwort an, bevor du den Schlag bewertest.",
  "Check which of your pieces need protection. {0} offers another way to defend your position.":
    "Prüfe, welche Figuren Schutz brauchen. {0} bietet eine andere Verteidigung deiner Stellung.",
  "Check whether a piece is under attack before starting another plan. {0} moves a piece out of danger.":
    "Prüfe bedrohte Figuren, bevor du einen neuen Plan beginnst. {0} bringt eine Figur in Sicherheit.",
  "Check their checks, captures, and attacks before choosing your move. Preview {0} to compare the alternative.":
    "Prüfe gegnerische Schachgebote, Schläge und Angriffe vor deinem Zug. Sieh dir {0} zum Vergleich an.",
  "The move needs analysis of the resulting position.":
    "Der Zug erfordert eine Analyse der resultierenden Stellung.",
  "{0} delivers checkmate. Their king has no way out—you’ve finished the game.":
    "{0} setzt matt. Der gegnerische König hat keinen Ausweg – die Partie ist beendet.",
  "{0} is the top choice here. {1}": "{0} ist hier die beste Wahl. {1}",
  "gets you a draw, close to the best result found here":
    "erzielt ein Remis, nahe am besten hier gefundenen Ergebnis",
  "keeps your checkmate on track in the analyzed line":
    "hält den Mattangriff in der analysierten Variante auf Kurs",
  "holds up about as well as the best defense found here, though the analysis still finds mate against you":
    "hält ähnlich gut stand wie die beste gefundene Verteidigung, obwohl die Analyse weiterhin ein Matt gegen dich sieht",
  "keeps your strong advantage. You’re still in a great position":
    "erhält deinen großen Vorteil. Deine Stellung bleibt sehr gut",
  "holds up about as well as the best option in an already tough position":
    "hält ähnlich gut stand wie die beste Option in einer ohnehin schwierigen Stellung",
  "looks good here, with chances close to {0}":
    "sieht hier gut aus, mit ähnlichen Chancen wie {0}",
  "leads to a draw. {0} offered better chances":
    "führt zum Remis. {0} bot bessere Chancen",
  "allows a forced checkmate in the analyzed line":
    "ermöglicht ein erzwungenes Matt in der analysierten Variante",
  "lets a forced checkmate slip away": "lässt ein erzwungenes Matt entgehen",
  "gives your opponent better chances than {0} would":
    "gibt dem Gegner bessere Chancen als {0}",
  "Try the other move to see what you could keep playing for.":
    "Probiere den anderen Zug, um mögliche weitere Ziele zu sehen.",
  "Play through the reply to see what they could do next.":
    "Spiele die Antwort durch, um mögliche Fortsetzungen zu sehen.",
  "Build pressure on {0}": "Druck auf {0} aufbauen",
  "Your {0} joins another piece in attacking their {1} on {2}. They now have more than one attacker to deal with.":
    "Deine Figur ({0}) greift gemeinsam mit einer anderen die gegnerische Figur ({1}) auf {2} an. Der Gegner muss nun mehrere Angreifer beachten.",
  "See the attack on their {0}":
    "Angriff auf die gegnerische Figur ({0}) ansehen",
  "Support your center": "Das Zentrum stützen",
  "Defend your {0}": "Deine Figur ({0}) verteidigen",
  "Your {0} on {1} now defends the {2} on {3}. If they capture it, your {4} may be able to capture back; check the reply before trading.":
    "Deine Figur ({0}) auf {1} deckt nun deine Figur ({2}) auf {3}. Nach einem Schlag könnte deine Figur ({4}) zurückschlagen; prüfe die Antwort vor dem Abtausch.",
  "See the defense of your {0}": "Deckung deiner Figur ({0}) ansehen",
  "Move your {0} out of danger": "Deine Figur ({0}) in Sicherheit bringen",
  "Your {0} was under attack on {1}. On {2}, none of their pieces currently attack it.":
    "Deine Figur ({0}) war auf {1} angegriffen. Auf {2} wird sie derzeit von keiner gegnerischen Figur angegriffen.",
  "See your {0} move out of danger": "Rettungszug deiner Figur ({0}) ansehen",
  "Attack the {0}": "Die gegnerische Figur ({0}) angreifen",
  "Your {0} on {1} attacks their {2} on {3}. Watch for a retreat, a defense, or a threat of their own.":
    "Deine Figur ({0}) auf {1} greift die gegnerische Figur ({2}) auf {3} an. Achte auf Rückzug, Deckung oder eine Gegendrohung.",
  "Your {0} on {1} now attacks their {2} on {3}. They may move it or defend it, so look at the reply before counting on a capture.":
    "Deine Figur ({0}) auf {1} greift nun die gegnerische Figur ({2}) auf {3} an. Sie kann wegziehen oder gedeckt werden; prüfe die Antwort, bevor du mit einem Gewinn rechnest.",
  "{0} on {1}": "{0} auf {1}",
  "Your {0} give check.": "Deine Figuren ({0}) bieten Schach.",
  "Your {0} gives check.": "Deine Figur ({0}) bietet Schach.",
  "Your pawn promotes to a {0} on {1}. ":
    "Dein Bauer wandelt sich auf {1} in {0} um. ",
  "Finish with checkmate": "Mit Schachmatt abschließen",
  "{0}Your {1} deliver checkmate. Their king has no way out.":
    "{0}Deine Figuren ({1}) setzen matt. Der gegnerische König hat keinen Ausweg.",
  "{0}Your {1} delivers checkmate. Their king has no way out.":
    "{0}Deine Figur ({1}) setzt matt. Der gegnerische König hat keinen Ausweg.",
  "See the checkmate": "Schachmatt ansehen",
  "Promote your pawn": "Deinen Bauern umwandeln",
  "You now have a {0} in place of that pawn. Look at the reply to see how they respond.":
    "Du hast nun eine Figur ({0}) anstelle dieses Bauern. Sieh dir die gegnerische Antwort an.",
  "See the promotion": "Umwandlung ansehen",
  "Castle and bring your rook into play": "Rochieren und den Turm aktivieren",
  "Castling moves your king away from the center and brings your rook toward the middle.{0}":
    "Die Rochade bringt deinen König aus dem Zentrum und deinen Turm zur Mitte.{0}",
  "See the king and rook move": "Königs- und Turmzug ansehen",
  "Get your king out of check": "Deinen König aus dem Schach retten",
  "{0} gets you out of check{1}.{2}": "{0} wehrt das Schach ab{1}.{2}",
  " and takes the {0} on {1}":
    " und schlägt die gegnerische Figur ({0}) auf {1}",
  " by blocking the attack with your {0}":
    " durch Blockieren des Angriffs mit deiner Figur ({0})",
  " by moving your king to {0}": " durch einen Königszug nach {0}",
  " Your king is no longer under attack, so you can continue playing.":
    " Dein König steht nicht mehr im Schach und du kannst weiterspielen.",
  "See how you escape check": "Abwehr des Schachs ansehen",
  "Capture with check": "Mit Schach schlagen",
  "Capture the {0}": "Die gegnerische Figur ({0}) schlagen",
  "Your {0} takes the {1} on {2}{3}. {4}":
    "Deine Figur ({0}) schlägt die gegnerische Figur ({1}) auf {2}{3}. {4}",
  " en passant, landing on ": " en passant und landet auf ",
  "Their pieces attack your {0} on {1}; preview the reply to check whether they capture back.":
    "Gegnerische Figuren greifen deine Figur ({0}) auf {1} an; prüfe in der Vorschau, ob sie zurückschlagen.",
  "None of their pieces currently attack your {0} on {1}.":
    "Keine gegnerische Figur greift derzeit deine Figur ({0}) auf {1} an.",
  "See the capture and possible attackers":
    "Schlag und mögliche Angreifer ansehen",
  "Give check": "Schach bieten",
  "{0} Your opponent has to deal with the attack on their king.":
    "{0} Dein Gegner muss auf den Angriff auf seinen König reagieren.",
  "See the attack on their king": "Angriff auf den gegnerischen König ansehen",
  "From here, it attacks {0}, helping you control the center.":
    "Von hier greift sie {0} an und hilft dir, das Zentrum zu kontrollieren.",
  "Bringing pieces off the starting row gives you more pieces to use in your next moves.":
    "Wenn du Figuren aus der Grundreihe entwickelst, stehen dir mehr Figuren für die nächsten Züge zur Verfügung.",
  "Bring another piece into play": "Eine weitere Figur entwickeln",
  "Your {0} comes off the back rank to {1}. {2}":
    "Deine Figur ({0}) entwickelt sich aus der Grundreihe nach {1}. {2}",
  "See your piece and the center squares": "Figur und Zentrumsfelder ansehen",
  "Claim the center": "Das Zentrum besetzen",
  "Your pawn takes space in the center on {0}. It attacks {1}, helping limit where their pieces can move safely.":
    "Dein Bauer gewinnt auf {0} Raum im Zentrum. Er greift {1} an und schränkt sichere Felder für gegnerische Figuren ein.",
  "See the pawn’s control of the center":
    "Zentrumskontrolle des Bauern ansehen",
  "Put your rook on an open file": "Den Turm auf eine offene Linie stellen",
  "There are no pawns on the {0}-file, the column your rook moves to. With no pawns in that column, look for squares your rook can reach before another piece blocks its path.":
    "Auf der {0}-Linie, auf die dein Turm zieht, stehen keine Bauern. Prüfe, welche Felder er erreichen kann, bevor eine andere Figur den Weg blockiert.",
  "See the open file": "Offene Linie ansehen",
  "Improve your rook’s position": "Die Turmstellung verbessern",
  "Try your rook on {0}. Play through the reply below to see which lines and targets it can work with.":
    "Probiere deinen Turm auf {0}. Spiele die Antwort durch, um seine Linien und Ziele zu sehen.",
  "See your rook’s move": "Turmzug ansehen",
  "Improve your king’s position": "Die Königsstellung verbessern",
  "Your king steps from {0} to {1}. Check what their pieces can do before choosing its next square.":
    "Dein König zieht von {0} nach {1}. Prüfe die Möglichkeiten des Gegners, bevor du sein nächstes Feld wählst.",
  "See your king’s move": "Königszug ansehen",
  "Gain space with your pawn": "Mit dem Bauern Raum gewinnen",
  "Your pawn moves up to {0}, claiming more space. Keep an eye on the squares it leaves behind.":
    "Dein Bauer rückt nach {0} vor und gewinnt Raum. Behalte die Felder im Blick, die er zurücklässt.",
  "See your pawn’s advance": "Bauernvorstoß ansehen",
  "Improve a piece near the center": "Eine Figur nahe dem Zentrum verbessern",
  "Your {0} moves to {1}, near the center. {2}":
    "Deine Figur ({0}) zieht nach {1}, nahe dem Zentrum. {2}",
  "Preview the reply to see how they can respond before choosing its next move.":
    "Sieh dir die gegnerische Antwort an, bevor du den nächsten Zug dieser Figur wählst.",
  "See the move near the center": "Zug nahe dem Zentrum ansehen",
  "Reposition your {0}": "Deine Figur ({0}) umgruppieren",
  "Try your {0} on {1}. Play through the next few moves to see how your opponent can respond and where your pieces end up.":
    "Probiere deine Figur ({0}) auf {1}. Spiele die nächsten Züge durch, um gegnerische Antworten und die entstehenden Figurenstellungen zu sehen.",
  "See your {0}’s move": "Zug deiner Figur ({0}) ansehen",
  "They can checkmate with {0} ({1} to {2}).":
    "Sie können mit {0} mattsetzen ({1} nach {2}).",
  "castle {0}": "{0} rochieren",
  kingside: "kurz",
  queenside: "lang",
  "take your {0} on {1}{2} with their {3}":
    "deine Figur ({0}) auf {1}{2} mit ihrer Figur ({3}) schlagen",
  " en passant": " en passant",
  "move their {0} to {1}": "ihre Figur ({0}) nach {1} ziehen",
  " and promote to a {0}": " und in {0} umwandeln",
  " and give check": " und Schach bieten",
  "They may {0}{1}{2} ({3}).": "Sie können {0}{1}{2} ({3}).",
  "Deal with the check first. Look for a king move, a way to take the attacker, or a piece that can block the attack.":
    "Wehre zuerst das Schach ab. Prüfe einen Königszug, das Schlagen des Angreifers oder das Dazwischenziehen einer Figur.",
  "Your {0} on {1} is under attack with no defender. Can you move it, protect it, or make a threat they have to answer first?":
    "Deine Figur ({0}) auf {1} ist angegriffen und ungedeckt. Kannst du sie wegziehen, decken oder eine zwingende Gegendrohung aufstellen?",
  "Your {0} on {1} is under attack. It has a defender, but play out the trade before leaving it there.":
    "Deine Figur ({0}) auf {1} ist angegriffen. Sie ist gedeckt, aber spiele den Abtausch durch, bevor du sie dort lässt.",
  "Before you move, take a quick look at their checks, captures, and attacks on unprotected pieces. Start with the likely reply below your move.":
    "Prüfe vor deinem Zug gegnerische Schachgebote, Schläge und Angriffe auf ungedeckte Figuren. Beginne mit der wahrscheinlichen Antwort unter deinem Zug.",
  "{0} puts {1} under attack from your {2}.":
    "{0} greift {1} mit deiner Figur ({2}) an.",
  "their {0} on {1}": "die gegnerische Figur ({0}) auf {1}",
  "Your {0} is under attack with no defender.":
    "Deine Figur ({0}) ist angegriffen und ungedeckt.",
  "Your {0} are under attack with no defender.":
    "Deine Figuren ({0}) sind angegriffen und ungedeckt.",
  "Your pieces cover {0} in the center.":
    "Deine Figuren kontrollieren {0} im Zentrum.",
  "{0} finishes this line with checkmate.":
    "{0} beendet diese Variante mit Schachmatt.",
  "The preview ends with {0} playing {1}, a capture. The exchange may continue.":
    "Die Vorschau endet mit einem Schlag: {0} spielt {1}. Der Abtausch kann weitergehen.",
  "In this possible line, you’d gain the equivalent of {0} pawn in material.":
    "In dieser möglichen Variante würdest du Material im Wert von {0} Bauern gewinnen.",
  "In this possible line, you’d gain the equivalent of {0} pawns in material.":
    "In dieser möglichen Variante würdest du Material im Wert von {0} Bauern gewinnen.",
  "In this possible line, you’d give up the equivalent of {0} pawn in material.":
    "In dieser möglichen Variante würdest du Material im Wert von {0} Bauern abgeben.",
  "In this possible line, you’d give up the equivalent of {0} pawns in material.":
    "In dieser möglichen Variante würdest du Material im Wert von {0} Bauern abgeben.",
  "The material balance stays the same in this line.":
    "Die Materialbilanz bleibt in dieser Variante gleich.",
  "{0} puts your king in check. Getting out of check comes first.":
    "{0} setzt deinen König ins Schach. Die Abwehr hat Vorrang.",
  "{0} leaves your {1} on {2} under attack with no defender. Take care of it before carrying on with your plan.":
    "{0} lässt deine Figur ({1}) auf {2} angegriffen und ungedeckt. Kümmere dich darum, bevor du deinen Plan fortsetzt.",
  "They’ve just taken your {0} with {1}. Look at {2} before deciding how to answer.":
    "Deine Figur ({0}) wurde gerade mit {1} geschlagen. Prüfe {2}, bevor du antwortest.",
  "{0} changes their control of {1}. Try {2} now, and see how they might respond.":
    "{0} verändert die gegnerische Kontrolle über {1}. Probiere {2} und prüfe mögliche Antworten.",
  "Their {0} is now on {1}. Try {2}{3}.":
    "Die gegnerische Figur ({0}) steht jetzt auf {1}. Probiere {2}{3}.",
  "; one reply to look at is {0}": "; eine mögliche Antwort ist {0}",
  " and see how they respond": " und prüfe die Antwort",
  "This position has only one legal move.":
    "Diese Stellung hat nur einen legalen Zug.",
  "{0} is the only recommended move here. The other moves checked give up too much compared with it.":
    "{0} ist hier der einzige empfohlene Zug. Die anderen untersuchten Züge geben im Vergleich zu viel auf.",
  "Here, checkmate threats matter more than a small difference in score. Play through {0} and {1}, and follow the checks carefully.":
    "Hier zählen Mattdrohungen mehr als kleine Bewertungsunterschiede. Spiele {0} und {1} durch und beachte die Schachgebote genau.",
  "{0} and {1} both look good here. Play through their replies and choose the position you’d rather have.":
    "{0} und {1} sehen beide gut aus. Spiele die Antworten durch und wähle die Stellung, die dir lieber ist.",
  "{0} looks stronger than {1} here. Play through both replies to see how the positions differ.":
    "{0} sieht stärker aus als {1}. Spiele beide Antworten durch, um die Stellungen zu vergleichen.",
  "Preview likely reply: {0}": "Wahrscheinliche Antwort ansehen: {0}",
  "LIKELY REPLY": "WAHRSCHEINLICHE ANTWORT",
  "Engine continuation": "Engine-Variante",
  "POSSIBLE NEXT MOVES": "MÖGLICHE NÄCHSTE ZÜGE",
  "Preview move {0}: {1} plays {2}": "Zug {0} ansehen: {1} spielt {2}",
  "The engine returned no legal candidates. Please retry analysis.":
    "Die Engine hat keine legalen Züge geliefert. Starte die Analyse erneut.",
  "About this position": "Über diese Stellung",
  "WHAT CHANGED": "WAS SICH GEÄNDERT HAT",
  "Hide key squares": "Wichtige Felder ausblenden",
  "Highlight key squares": "Wichtige Felder markieren",
  "Teal outlines mark the squares discussed above: {0}.":
    "Türkise Umrandungen markieren die besprochenen Felder: {0}.",
  "Analyzing…": "Analyse läuft…",
  "Engine unavailable": "Engine nicht verfügbar",
  "Recommendations ready": "Empfehlungen bereit",
  "Reviewing {0}. Analysis is for this position.":
    "Rückblick auf {0}. Die Analyse gilt für diese Stellung.",
  "Let’s try that again.": "Versuchen wir es noch einmal.",
  "Retry analysis": "Analyse erneut starten",
  "Best move and strategy": "Bester Zug und Strategie",
  "FINDING YOUR MOVE": "DEIN ZUG WIRD GESUCHT",
  "Finding {0}’s best move…": "Bester Zug für {0} wird gesucht…",
  "Looking at your options and their replies from this earlier position.":
    "Deine Optionen und die Antworten aus dieser früheren Stellung werden geprüft.",
  "Checking your options and your opponent’s replies. Feel free to keep playing.":
    "Deine Optionen und gegnerische Antworten werden geprüft. Du kannst weiterspielen.",
  "Checking deeper · depth {0}": "Tiefere Analyse · Tiefe {0}",
  "Usually ready in a couple of seconds": "Meist in wenigen Sekunden bereit",
  "Watch out for": "Achte auf",
  "Hover or focus to highlight the threatened piece and its attackers.":
    "Mit Maus oder Tastaturfokus die bedrohte Figur und ihre Angreifer markieren.",
  "Escape check": "Schach abwehren",
  "BEST MOVE": "BESTER ZUG",
  "Only legal move": "Einziger legaler Zug",
  "Plan continues": "Plan wird fortgesetzt",
  "Play best move {0}": "Besten Zug {0} spielen",
  "Hide reply": "Antwort ausblenden",
  "Preview reply": "Antwort ansehen",
  "Explore next moves": "Nächste Züge erkunden",
  "The engine could not review this move. Try again.":
    "Die Engine konnte diesen Zug nicht bewerten. Versuche es erneut.",
  "The engine could not reliably compare this move. Try again.":
    "Die Engine konnte diesen Zug nicht zuverlässig vergleichen. Versuche es erneut.",
  "The engine could not check the reply. Try again.":
    "Die Engine konnte die Antwort nicht prüfen. Versuche es erneut.",
  "Reviewing…": "Wird geprüft…",
  "Review unavailable": "Zugbewertung nicht verfügbar",
  "Move feedback": "Zugbewertung",
  "{0}: {1}. {2}. {3} details": "{0}: {1}. {2}. Details {3}",
  Show: "anzeigen",
  Hide: "ausblenden",
  "Looking at your move and the best alternatives…":
    "Dein Zug und die besten Alternativen werden geprüft…",
  "Retry move review": "Zugbewertung erneut starten",
  "Next time": "Fürs nächste Mal",
  "Likely reply": "Wahrscheinliche Antwort",
  "The evaluation difference is measured in pawn units. Grades account for the overall position; mate outcomes have no pawn score.":
    "Der Bewertungsunterschied wird in Bauerneinheiten gemessen. Die Zugnoten berücksichtigen die gesamte Stellung; Matt hat keinen Bauernwert.",
  "Quick review": "Kurze Bewertung",
  "{0} evaluation drop": "{0} Bewertungsverlust",
  "Close help": "Hilfe schließen",
  "WELCOME TO TEMPO": "WILLKOMMEN BEI TEMPO",
  "A board. A plan. Your next move.": "Ein Brett. Ein Plan. Dein nächster Zug.",
  "Make it your position.": "Gestalte deine Stellung.",
  "The piece trays above and below the board are always available. Drag a tray piece onto the board, or select it and click a square. Drag a legal board move to play it. Other board drops arrange a new position and restart history. Right-click a piece or drag it off the board to remove it. “Clear board” beside New game empties the board. Click a piece and a legal destination to play a move. Choose who plays next under “Your coach,” then press “Calculate best moves” whenever you want guidance for that position.":
    "Die Figurenleisten über und unter dem Brett sind immer verfügbar. Ziehe eine Figur aufs Brett oder wähle sie und klicke auf ein Feld. Legale Brettzüge werden gespielt; andere Ablagen bauen eine neue Stellung auf und starten den Verlauf neu. Entferne Figuren per Rechtsklick oder durch Ziehen neben das Brett. „Brett leeren“ neben „Neue Partie“ entfernt alle Figuren. Du kannst auch eine Figur und ihr legales Zielfeld anklicken. Wähle unter „Dein Trainer“ die Zugfarbe und klicke für Hilfe auf „Beste Züge berechnen“.",
  "Understand your options.": "Verstehe deine Möglichkeiten.",
  "The best move appears with a short explanation and a plain-language move description. Use “Preview reply” to see the response, then “Explore next moves” for the longer line. Open “About this position” for more context. “Other good options” appears only when worthwhile alternatives exist. Hover anywhere on the Best Move card, or focus one of its controls, to see its arrow. You can also hover or focus an alternative move. Hover a continuation move or “Likely reply” to see that position temporarily. Moving away restores the board. Keyboard focus and previews work the same way. Clicking or tapping keeps the preview, even when you jump back to the board. Choose “Return to game” or press Escape to finish a kept preview.":
    "Der beste Zug erscheint mit einer kurzen Erklärung und einer Beschreibung in Worten. „Antwort ansehen“ zeigt die Antwort, „Nächste Züge erkunden“ die längere Variante. „Über diese Stellung“ bietet Kontext. „Weitere gute Optionen“ erscheint nur bei sinnvollen Alternativen. Fahre über die Karte des besten Zuges oder fokussiere ein Bedienelement, um seinen Pfeil zu sehen; das geht auch bei Alternativen. Maus oder Tastaturfokus auf einer Fortsetzung oder „Wahrscheinliche Antwort“ zeigt die Stellung vorübergehend. Beim Verlassen kehrt das Brett zurück. Klicken oder Tippen hält die Vorschau auch beim Wechsel zum Brett fest. „Zur Partie zurück“ oder Escape beendet sie.",
  "Learn as you go.": "Lerne beim Spielen.",
  "Use the “See” link below an explanation to preview its moves, attacks, or defenses with teal arrows and outlines. Your game stays unchanged. Move feedback includes a “Next time” lesson when the analysis finds a stronger alternative.":
    "Mit dem Link „Ansehen“ unter einer Erklärung siehst du Züge, Angriffe oder Deckungen als türkise Pfeile und Umrandungen. Deine Partie bleibt erhalten. Die Zugbewertung enthält eine Lektion „Fürs nächste Mal“, wenn die Analyse eine stärkere Alternative findet.",
  "Keep the conversation going.": "Erkunde weiter.",
  "Click a piece and its destination to play for either side, or use a suggested move. Click “Calculate best moves” whenever you want guidance for the current position. Use the arrows above the board, or click a move in your history, to revisit its position and analysis. Use “Back to latest” to continue your game, or play a move from the selected position to continue from there.":
    "Klicke eine Figur und ihr Zielfeld an, um für beide Seiten zu spielen, oder nutze einen vorgeschlagenen Zug. „Beste Züge berechnen“ hilft bei der aktuellen Stellung. Mit den Pfeilen über dem Brett oder einem Klick im Verlauf kannst du frühere Stellungen ansehen und analysieren. „Zur aktuellen Stellung“ setzt deine Partie fort; ein Zug aus einer früheren Stellung setzt dort an.",
  "Practice your way.": "Übe auf deine Weise.",
  "Use the computer toggle beside “Your coach” to turn the opponent on or off. Open its settings to choose your side and level. Your last move’s review opens above the recommendations. Calculating best moves collapses it to the move and rating; select the row to reopen the details.":
    "Schalte den Gegner neben „Dein Trainer“ ein oder aus. In den Einstellungen wählst du Farbe und Stärke. Die Bewertung deines letzten Zuges öffnet sich über den Empfehlungen. Beim Berechnen der besten Züge bleibt nur die Zeile mit Zug und Note sichtbar; klicke darauf, um die Details wieder zu öffnen.",
  "Keep your discoveries.": "Bewahre deine Entdeckungen.",
  "Your game is autosaved in this browser. Use the FEN controls below the board to load or copy a position.":
    "Deine Partie wird automatisch in diesem Browser gespeichert. Mit den FEN-Feldern unter dem Brett kannst du eine Stellung laden oder kopieren.",
  "Stockfish 19 Lite analyzes locally for about two seconds per position. Explanations use board patterns and the engine’s continuation. They’re a starting point for understanding; they aren’t a complete tactical proof. Move grades account for the overall position and compare alternatives at the same search depth. Grades can change with deeper analysis. Games are saved in this browser.":
    "Stockfish 19 Lite analysiert lokal etwa zwei Sekunden pro Stellung. Erklärungen beruhen auf Brettmustern und der Engine-Variante. Sie helfen beim Verständnis, sind aber kein vollständiger taktischer Beweis. Zugnoten berücksichtigen die gesamte Stellung und vergleichen Alternativen bei gleicher Suchtiefe. Tiefere Analysen können sie verändern. Partien werden in diesem Browser gespeichert.",
  "Let’s explore": "Los geht’s",
  "Keep the mating attack going": "Den Mattangriff fortsetzen",
  "There’s a checkmate in {0} moves starting with {1}, according to this analysis. Play through the replies to see how the attack works.":
    "Laut dieser Analyse gibt es Matt in {0} Zügen, beginnend mit {1}. Spiele die Antworten durch, um den Angriff zu verstehen.",
  "See the start of the mating attack": "Beginn des Mattangriffs ansehen",
  "Find the toughest defense": "Die zäheste Verteidigung finden",
  "Your king is in serious trouble: this analysis still finds a forced checkmate after {0}. Play through their checks to see where the danger comes from.":
    "Dein König ist in großer Gefahr: Die Analyse sieht nach {0} weiterhin ein erzwungenes Matt. Verfolge die gegnerischen Schachgebote, um die Gefahr zu verstehen.",
  "See the defensive move": "Verteidigungszug ansehen",
  "No reply is included in this preview. Try the move to explore what comes next.":
    "Diese Vorschau enthält keine Antwort. Probiere den Zug, um die Fortsetzung zu erkunden.",
  " You could follow with {0}: {1}.": " Du könntest mit {0} fortsetzen: {1}.",
  "That’s checkmate. They have no reply.":
    "Das ist Schachmatt. Es gibt keine Antwort.",
  "This move ends the game in a draw.":
    "Dieser Zug beendet die Partie mit Remis.",
  "A forced mate for {0}": "Erzwungenes Matt für {0}",
  "A balanced position": "Ausgeglichene Stellung",
  "{0} has a small edge": "{0} hat einen kleinen Vorteil",
  "{0} has the advantage": "{0} hat Vorteil",
  "{0} has a winning advantage": "{0} hat einen Gewinnvorteil",
  Checkmate: "Schachmatt",
  Draw: "Remis",
  "Preview · Check": "Vorschau · Schach",
  Preview: "Vorschau",
  Check: "Schach",
  Paused: "Pausiert",
  "Replying…": "Antwort folgt…",
  "Thinking…": "Überlegt…",
  Reviewing: "Rückblick",
  "Your turn": "Du bist am Zug",
  "Position analysis": "Stellungsanalyse",
  "Your coach": "Dein Trainer",
  "To move": "Am Zug",
  "Who plays next": "Wer ist am Zug",
  "Changing the player starts a new position and clears the move history.":
    "Ein Farbwechsel startet eine neue Stellung und löscht den Zugverlauf.",
  "Back to board ↑": "Zum Brett ↑",
  "Waiting for computer": "Warten auf den Computer",
  "Calculating best moves": "Beste Züge werden berechnet",
  "Calculate best moves": "Beste Züge berechnen",
  "Waiting for computer…": "Warten auf den Computer…",
  "Calculating…": "Berechnung läuft…",
  "Dismiss error": "Fehlermeldung schließen",
  "Move history controls": "Verlaufssteuerung",
  "Back to latest": "Zur aktuellen Stellung",
  "Preview · {0}": "Vorschau · {0}",
  "Reviewing {0} · Updating this position’s analysis":
    "Rückblick auf {0} · Stellungsanalyse wird aktualisiert",
  "Reviewing {0} · Analysis is for this position":
    "Rückblick auf {0} · Analyse für diese Stellung",
  "Reviewing {0} · Calculate when you want guidance":
    "Rückblick auf {0} · Bei Bedarf Analyse starten",
  "Computer moves in a moment…": "Der Computer zieht gleich…",
  "Computer is choosing a reply…": "Der Computer wählt eine Antwort…",
  "Updating {0}’s analysis · You can keep playing":
    "Analyse für {0} wird aktualisiert · Du kannst weiterspielen",
  "Return to game": "Zur Partie zurück",
  "Arrange a legal position with both kings to play the computer.":
    "Baue eine legale Stellung mit beiden Königen auf, um gegen den Computer zu spielen.",
  "This game has ended. Start a new game to play.":
    "Diese Partie ist beendet. Starte eine neue Partie.",
  "Return to your game to continue playing.":
    "Kehre zu deiner Partie zurück, um weiterzuspielen.",
  "Turn on “Play computer” to play against {0}.":
    "Aktiviere „Gegen Computer spielen“, um gegen {0} zu spielen.",
  "Game paused while you choose your settings.":
    "Partie pausiert, während du die Einstellungen wählst.",
  "The computer could not choose a move. Try again.":
    "Der Computer konnte keinen Zug wählen. Versuche es erneut.",
  "Computer is thinking…": "Der Computer überlegt…",
  "Your turn. Make a move on the board.":
    "Du bist am Zug. Spiele einen Zug auf dem Brett.",
  "Your computer difficulty could not be saved in this browser.":
    "Die Computerstärke konnte in diesem Browser nicht gespeichert werden.",
  "Play computer": "Gegen Computer spielen",
  Computer: "Computer",
  "Computer settings": "Computereinstellungen",
  "Retry computer": "Computer erneut starten",
  "Close computer settings": "Computereinstellungen schließen",
  "You play as": "Deine Farbe",
  "Your challenge": "Deine Herausforderung",
  Retry: "Erneut versuchen",
  Done: "Fertig",
  "Starting position": "Anfangsstellung",
  "Browser storage is unavailable or full. Your latest changes may not survive a reload.":
    "Der Browserspeicher ist nicht verfügbar oder voll. Deine letzten Änderungen könnten beim Neuladen verloren gehen.",
  "The original save could not be backed up. Autosave remains paused. Your latest changes may not survive a reload.":
    "Die ursprünglichen Daten konnten nicht gesichert werden. Automatisches Speichern bleibt pausiert. Letzte Änderungen könnten beim Neuladen verloren gehen.",
  "Continuing from the selected position.":
    "Fortsetzung aus der gewählten Stellung.",
  "Game result": "Partieergebnis",
  CHECKMATE: "SCHACHMATT",
  DRAW: "REMIS",
  "Honors shared.": "Die Punkte werden geteilt.",
  "A royal finish. Ready for another round?":
    "Ein königlicher Abschluss. Noch eine Runde?",
  "Good game. There’s always another round.":
    "Gut gespielt. Die nächste Runde wartet.",
  "Final score: White {0}, Black {1}": "Endstand: Weiß {0}, Schwarz {1}",
  "Play again": "Erneut spielen",
  "Choose a promotion piece": "Umwandlungsfigur wählen",
  "Cancel promotion": "Umwandlung abbrechen",
  "Your pawn made it.": "Dein Bauer hat es geschafft.",
  "Choose its next chapter.": "Wähle sein nächstes Kapitel.",
  "Promote to {0}": "In {0} umwandeln",
  "Game saving status": "Speicherstatus der Partie",
  "Saved game needs recovery":
    "Gespeicherte Partie muss wiederhergestellt werden",
  "Browser save unavailable": "Speichern nicht verfügbar",
  "Original save preserved": "Ursprüngliche Daten bewahrt",
  "The original data is kept in a separate browser recovery backup. Autosave has resumed.":
    "Die ursprünglichen Daten sind in einer separaten Wiederherstellungskopie im Browser gesichert. Automatisches Speichern ist wieder aktiv.",
  "Keep current game & resume saving":
    "Partie behalten und Speichern fortsetzen",
  "Dismiss recovery notice": "Wiederherstellungshinweis schließen",
  "This FEN is not valid.": "Dieses FEN ist ungültig.",
  "Clipboard access is unavailable. Select the FEN text and copy it manually.":
    "Kein Zugriff auf die Zwischenablage. Markiere den FEN-Text und kopiere ihn manuell.",
  "FEN position controls": "FEN-Stellungssteuerung",
  "FEN position": "FEN-Stellung",
  "Paste a FEN position": "FEN-Stellung einfügen",
  "Copy current FEN": "Aktuelles FEN kopieren",
  Load: "Laden",
  "Browser storage could not be read. Your saved game may be unavailable.":
    "Der Browserspeicher konnte nicht gelesen werden. Deine gespeicherte Partie ist möglicherweise nicht verfügbar.",
  "Your saved game could not be read. The last valid position was restored, without its move history. Autosave is paused to protect the original data.":
    "Deine gespeicherte Partie konnte nicht gelesen werden. Die letzte gültige Stellung wurde ohne Verlauf wiederhergestellt. Automatisches Speichern ist zum Schutz der ursprünglichen Daten pausiert.",
  "Your saved game could not be read. A fresh board is open. Autosave is paused to protect the original data.":
    "Deine gespeicherte Partie konnte nicht gelesen werden. Ein neues Brett wurde geöffnet. Automatisches Speichern ist zum Schutz der ursprünglichen Daten pausiert.",
  "Recovery backup could not be verified.":
    "Die Wiederherstellungskopie konnte nicht überprüft werden.",
  "Game moves": "Partiezüge",
  "Move history": "Zugverlauf",
  "View starting position": "Anfangsstellung ansehen",
  Start: "Anfang",
  "View position after {0}": "Stellung nach {0} ansehen",
  pawn: "Bauer",
  knight: "Springer",
  bishop: "Läufer",
  rook: "Turm",
  queen: "Dame",
  king: "König",
  Beginner: "Anfänger",
  Easy: "Leicht",
  Medium: "Mittel",
  Hard: "Schwer",
  Expert: "Experte",
  "Best move": "Bester Zug",
  "Good move": "Guter Zug",
  Inaccuracy: "Ungenauigkeit",
  Mistake: "Fehler",
  Blunder: "Grober Fehler",
  "Your last move": "Dein letzter Zug",
  "Selected move": "Gewählter Zug",
  "Tempo — Your next move, explained.": "Tempo — Dein nächster Zug, erklärt.",
  "must contain six space-delimited fields":
    "muss sechs durch Leerzeichen getrennte Felder enthalten",
  "move number must be a positive integer":
    "die Zugnummer muss eine positive ganze Zahl sein",
  "half move counter number must be a non-negative integer":
    "der Halbzugzähler muss eine nicht negative ganze Zahl sein",
  "en-passant square is invalid": "das En-passant-Feld ist ungültig",
  "castling availability is invalid": "die Rochaderechte sind ungültig",
  "side-to-move is invalid": "die Zugfarbe ist ungültig",
  "piece data does not contain 8 '/'-delimited rows":
    "die Figurendaten müssen 8 durch „/“ getrennte Reihen enthalten",
  "piece data is invalid (consecutive number)":
    "ungültige Figurendaten: aufeinanderfolgende Zahlen",
  "piece data is invalid (invalid piece)":
    "ungültige Figurendaten: unbekannte Figur",
  "piece data is invalid (too many squares in rank)":
    "ungültige Figurendaten: zu viele Felder in einer Reihe",
  "illegal en-passant square": "illegales En-passant-Feld",
  "some pawns are on the edge rows":
    "Bauern stehen auf der ersten oder letzten Reihe",
  "Last move": "Letzter Zug",
  "Position loaded": "Stellung geladen",
  "Position copied": "Stellung kopiert",
  "piece data must use 1–8 for empty squares.":
    "leere Felder müssen mit 1–8 angegeben werden",
  "{0} wins!": "{0} gewinnt!",
  "{0} pieces": "Figuren von {0}",
  "Alternative: {0}. {1}. {2}": "Alternative: {0}. {1}. {2}",
} satisfies Catalog;
