import type { Catalog } from "./en";

export default {
  "intro.guide.show": "So spielst du",
  "intro.guide.hide": "Anleitung ausblenden",
  "board.editor.open": "Stellung bearbeiten",
  "board.editor.close": "Bearbeitung beenden",
  "board.preview.label": "Vorschau",
  "board.preview.previous": "Vorheriger Zug in der Vorschau",
  "board.preview.next": "Nächster Zug in der Vorschau",
  "coach.analysis.more": "Mehr Analyse",
  "coach.analysis.less": "Weniger Analyse",
  "engine.error.load":
    "Die Schachengine konnte nicht geladen werden. Prüfe deine Verbindung und starte die Analyse erneut.",
  "engine.error.loadTimeout":
    "Das Laden der Engine hat zu lange gedauert. Analysiere die Stellung erneut.",
  "engine.error.start":
    "Die Engine konnte nicht starten. Lade die Seite neu oder nutze einen Browser mit WebAssembly-Unterstützung.",
  "engine.error.responseTimeout":
    "Die Engine hat zu lange für die Antwort gebraucht. Analysiere die Stellung erneut.",
  "engine.error.incompleteAnalysis":
    "Es wurde keine vollständige Analyse geliefert. Versuche diese Stellung erneut.",
  "language.selector.label": "Sprache",
  "position.error.invalidFen": "Ungültiges FEN: {0}",
  "position.error.pawnLimit":
    "{0} darf höchstens 8 Bauern haben. Entferne einen, bevor du einen weiteren hinzufügst.",
  "position.error.pieceLimit":
    "{0} darf höchstens 16 Figuren haben. Entferne eine, bevor du eine weitere hinzufügst.",
  "position.error.missingPlayableKing":
    "Füge den König von {0} hinzu, um zu spielen oder zu analysieren.",
  "position.error.inactiveKingInCheck":
    "Der König von {0} steht im Schach, aber {1} ist am Zug. Ändere die Zugfarbe oder bringe den König in Sicherheit.",
  "position.error.castlingPieces":
    "Das Rochaderecht {0} erfordert König und Turm von {1} auf ihren Ausgangsfeldern.",
  "position.error.missingKing": "Der König von {0} fehlt.",
  "position.error.tooManyKings": "Zu viele Könige für {0}.",
  "chess.side.white": "Weiß",
  "chess.side.black": "Schwarz",
  "header.home": "Tempo-Startseite",
  "header.tagline": "Dein Schachspielplatz",
  "intro.heading.start": "Dein nächster Zug,",
  "intro.heading.end": "erklärt.",
  "intro.tagline": "Erkunde das Brett. Verstehe den Plan. Probiere einen Zug.",
  "intro.guide.play":
    "Wähle eine Figur und ihr Zielfeld, um einen Zug zu spielen.",
  "intro.guide.analyze":
    "Wähle „{0}“ und sieh dir eine Antwort an oder probiere den Zugvorschlag aus.",
  "intro.guide.setup":
    "Nutze die Bearbeitungswerkzeuge, um eine eigene Stellung aufzubauen.",
  "footer.tagline": "Ein guter Zug beginnt mit etwas Verständnis.",
  "footer.engine": "Mit Stockfish 19",
  "move.description.normal": "{0}{1} von {2} nach {3}",
  "move.description.castle": "Rochade: König von {0} nach {1}, Turm {2}",
  "move.description.kingsideRook": "von h{0} nach f{1}",
  "move.description.queensideRook": "von a{0} nach d{1}",
  "move.description.capture": ", schlägt {0}{1}",
  "move.description.enPassantSquare": " auf {0} en passant",
  "move.description.promotion": ", Umwandlung in {0}",
  "move.description.checkmate": " — Schachmatt",
  "move.description.check": " — Schach",
  "position.error.missingBothKings":
    "Füge beide Könige hinzu, um zu spielen oder zu analysieren.",
  "position.error.pawnOnEdge":
    "Entferne Bauern von der ersten und letzten Reihe, um zu spielen oder zu analysieren.",
  "position.error.illegalArrangement":
    "Baue eine legale Stellung auf, um zu spielen oder zu analysieren.",
  "position.error.invalidPosition": "Diese Stellung ist ungültig.",
  "position.error.moveCounters":
    "Die FEN-Zugzähler müssen ganze Zahlen im unterstützten Bereich sein.",
  "position.error.castlingRights":
    "Jedes Rochaderecht (KQkq) darf nur einmal vorkommen; „-“ steht für keines.",
  "position.error.emptySquaresFen":
    "Ungültiges FEN: Leere Felder müssen mit 1–8 angegeben werden.",
  "position.error.enPassantCounter":
    "Ein En-passant-Feld erfordert einen Halbzugzähler von null, da zuletzt ein Bauer gezogen hat.",
  "position.error.enPassantPawn":
    "Das En-passant-Feld erfordert einen gegnerischen Bauern, der gerade zwei Felder vorgerückt ist. Prüfe das vierte FEN-Feld.",
  "game.ending.checkmate": "{0} gewinnt durch Schachmatt.",
  "game.ending.stalemate":
    "Patt. Es gibt keine legalen Züge und der König steht nicht im Schach.",
  "game.ending.repetition": "Remis durch dreifache Stellungswiederholung.",
  "game.ending.insufficientMaterial":
    "Remis. Keine Seite hat genügend Material für ein Schachmatt.",
  "game.ending.fiftyMoves": "Remis nach der Fünfzig-Züge-Regel.",
  "board.controls.label": "Schachbrett und Stellungssteuerung",
  "board.newGame.description":
    "Eine neue Partie aus der Anfangsstellung starten",
  "board.newGame.label": "Neue Partie",
  "board.clear": "Brett leeren",
  "board.navigation.label": "Zugnavigation",
  "board.navigation.previous": "Vorheriger Zug",
  "board.navigation.next": "Nächster Zug",
  "board.flip": "Brett drehen",
  "board.openCoach": "Zum Trainer",
  "chess.piece.label": "{1} · {0}",
  "board.evaluation.calculateFirst":
    "Analysiere die besten Züge, um die Bewertung zu sehen",
  "board.evaluation.previewPaused":
    "Bewertung während der Brettvorschau pausiert",
  "board.evaluation.legend": "+ = Weiß im Vorteil · − = Schwarz im Vorteil",
  "board.evaluation.whiteScore": "Bewertung aus weißer Sicht: {0}",
  "board.evaluation.pending": "Bewertung ausstehend",
  "board.label.preview": "Schachbrett der Zugvorschau",
  "board.label.history": "Schachbrett des Partieverlaufs",
  "board.label.interactive": "Interaktives Schachbrett",
  "board.square.empty": " leer",
  "board.square.check": " im Schach",
  "board.tray.place": "Setzen: {1} · {0}",
  "board.tray.add": "Hinzufügen: {1} · {0} · Klicken oder aufs Brett ziehen",
  "coach.alternatives.heading": "Weitere gute Optionen",
  "coach.evaluation.description":
    "Bewertung in Bauerneinheiten: + für Weiß, − für Schwarz.",
  "coach.move.play": "{0} spielen",
  "coach.lesson.mateThreat.advice":
    "Prüfe vor dem Zug, ob gegnerische Figuren deinen König auf {0} erreichen können. Hier beendet {1} die Partie.",
  "coach.lesson.mateThreat.focus": "Mattdrohung ansehen",
  "coach.lesson.undefended.consequence":
    "lässt die eigene Figur ({0}) auf {1} ungedeckt. Die gegnerische Figur ({2}) kann sie mit {3} schlagen",
  "coach.lesson.defendedCapture.consequence":
    "ermöglicht es der gegnerischen Figur ({0}), deine Figur ({1}) auf {2} mit {3} zu schlagen. Sie ist gedeckt; verfolge den weiteren Abtausch",
  "coach.lesson.undefended.advice":
    "Prüfe vor dem Zug, welche deiner Figuren geschlagen werden können und ob du zurückschlagen kannst.",
  "coach.lesson.defendedCapture.advice":
    "Vergleiche vor einem Abtausch die möglichen Schläge beider Seiten, einschließlich der nächsten Antwort.",
  "coach.lesson.capture.focus": "Bedrohte Figur ansehen",
  "coach.lesson.laterCapture.consequence":
    "führt in der gezeigten Variante zu {0}: Die gegnerische Figur ({1}) schlägt deine Figur ({2}) auf {3}. Weitere Abtäusche können folgen",
  "coach.lesson.forcedReply.advice":
    "Verfolge auch die gegnerischen Schachgebote. Sie können eine Antwort erzwingen, bevor du eine andere Figur schützt.",
  "coach.lesson.laterCapture.advice":
    "Schau über die erste Antwort hinaus: Verfolge weitere Schläge, bevor du einen Abtausch bewertest.",
  "coach.lesson.laterCapture.focus":
    "Späteren Schlag in dieser Variante ansehen",
  "coach.piece.yoursOnSquare": "deine Figur ({0}) auf {1}",
  "common.join.and": " und ",
  "coach.lesson.fork.consequence":
    "ermöglicht eine Gabel: Die gegnerische Figur ({0}) auf {1} greift {2} gleichzeitig an",
  "coach.lesson.fork.advice":
    "Achte auf Antworten, die zwei Figuren gleichzeitig angreifen. Wenn du eine rettest, bleibt die andere möglicherweise bedroht.",
  "coach.lesson.fork.focus": "Beide Angriffe ansehen",
  "coach.lesson.compareCapture":
    "Vergleiche den Schlag auf {0} mit {1}. Sieh dir die Antwort an, bevor du den Schlag bewertest.",
  "coach.lesson.compareDefense":
    "Prüfe, welche Figuren Schutz brauchen. {0} bietet eine andere Verteidigung deiner Stellung.",
  "coach.lesson.compareEscape":
    "Prüfe bedrohte Figuren, bevor du einen neuen Plan beginnst. {0} bringt eine Figur in Sicherheit.",
  "coach.lesson.compareAlternative":
    "Prüfe gegnerische Schachgebote, Schläge und Angriffe vor deinem Zug. Sieh dir {0} zum Vergleich an.",
  "coach.review.error.needsAnalysis":
    "Der Zug erfordert eine Analyse der resultierenden Stellung.",
  "coach.review.checkmate":
    "{0} setzt matt. Der gegnerische König hat keinen Ausweg – die Partie ist beendet.",
  "coach.review.best": "{0} ist hier die beste Wahl. {1}",
  "coach.review.good.draw":
    "erzielt ein Remis, nahe am besten hier gefundenen Ergebnis",
  "coach.review.good.winningMate":
    "hält den Mattangriff in der analysierten Variante auf Kurs",
  "coach.review.good.losingMate":
    "hält ähnlich gut stand wie die beste gefundene Verteidigung, obwohl die Analyse weiterhin ein Matt gegen dich sieht",
  "coach.review.good.winning":
    "erhält deinen großen Vorteil. Deine Stellung bleibt sehr gut",
  "coach.review.good.losing":
    "hält ähnlich gut stand wie die beste Option in einer ohnehin schwierigen Stellung",
  "coach.review.good.balanced":
    "sieht hier gut aus, mit ähnlichen Chancen wie {0}",
  "coach.review.consequence.draw": "führt zum Remis. {0} bot bessere Chancen",
  "coach.review.consequence.allowsMate":
    "ermöglicht ein erzwungenes Matt in der analysierten Variante",
  "coach.review.consequence.missesMate": "lässt ein erzwungenes Matt entgehen",
  "coach.review.consequence.worseChances":
    "gibt dem Gegner bessere Chancen als {0}",
  "coach.review.response.draw":
    "Probiere den anderen Zug, um mögliche weitere Ziele zu sehen.",
  "coach.review.response.preview":
    "Spiele die Antwort durch, um mögliche Fortsetzungen zu sehen.",
  "coach.explanation.pressure.title": "Druck auf {0} aufbauen",
  "coach.explanation.pressure.text":
    "Deine Figur ({0}) greift gemeinsam mit einer anderen die gegnerische Figur ({1}) auf {2} an. Der Gegner muss nun mehrere Angreifer beachten.",
  "coach.explanation.attack.focus":
    "Angriff auf die gegnerische Figur ({0}) ansehen",
  "coach.explanation.supportCenter.title": "Das Zentrum stützen",
  "coach.explanation.defend.title": "Deine Figur ({0}) verteidigen",
  "coach.explanation.defend.text":
    "Deine Figur ({0}) auf {1} deckt nun deine Figur ({2}) auf {3}. Nach einem Schlag könnte deine Figur ({4}) zurückschlagen; prüfe die Antwort vor dem Abtausch.",
  "coach.explanation.defend.focus": "Deckung deiner Figur ({0}) ansehen",
  "coach.explanation.escapeAttack.title":
    "Deine Figur ({0}) in Sicherheit bringen",
  "coach.explanation.escapeAttack.text":
    "Deine Figur ({0}) war auf {1} angegriffen. Auf {2} wird sie derzeit von keiner gegnerischen Figur angegriffen.",
  "coach.explanation.escapeAttack.focus":
    "Rettungszug deiner Figur ({0}) ansehen",
  "coach.explanation.attack.title": "Die gegnerische Figur ({0}) angreifen",
  "coach.explanation.attack.existing":
    "Deine Figur ({0}) auf {1} greift die gegnerische Figur ({2}) auf {3} an. Achte auf Rückzug, Deckung oder eine Gegendrohung.",
  "coach.explanation.attack.new":
    "Deine Figur ({0}) auf {1} greift nun die gegnerische Figur ({2}) auf {3} an. Sie kann wegziehen oder gedeckt werden; prüfe die Antwort, bevor du mit einem Gewinn rechnest.",
  "coach.piece.onSquare": "{0} auf {1}",
  "coach.explanation.check.plural": "Deine Figuren ({0}) bieten Schach.",
  "coach.explanation.check.singular": "Deine Figur ({0}) bietet Schach.",
  "coach.explanation.promotion.prefix":
    "Dein Bauer wandelt sich auf {1} in {0} um. ",
  "coach.explanation.checkmate.title": "Mit Schachmatt abschließen",
  "coach.explanation.checkmate.plural":
    "{0}Deine Figuren ({1}) setzen matt. Der gegnerische König hat keinen Ausweg.",
  "coach.explanation.checkmate.singular":
    "{0}Deine Figur ({1}) setzt matt. Der gegnerische König hat keinen Ausweg.",
  "coach.explanation.checkmate.focus": "Schachmatt ansehen",
  "coach.explanation.promotion.title": "Deinen Bauern umwandeln",
  "coach.explanation.promotion.text":
    "Du hast nun eine Figur ({0}) anstelle dieses Bauern. Sieh dir die gegnerische Antwort an.",
  "coach.explanation.promotion.focus": "Umwandlung ansehen",
  "coach.explanation.castle.title": "Rochieren und den Turm aktivieren",
  "coach.explanation.castle.text":
    "Die Rochade bringt deinen König aus dem Zentrum und deinen Turm zur Mitte.{0}",
  "coach.explanation.castle.focus": "Königs- und Turmzug ansehen",
  "coach.explanation.escapeCheck.title": "Deinen König aus dem Schach retten",
  "coach.explanation.escapeCheck.text": "{0} wehrt das Schach ab{1}.{2}",
  "coach.explanation.escapeCheck.capture":
    " und schlägt die gegnerische Figur ({0}) auf {1}",
  "coach.explanation.escapeCheck.block":
    " durch Blockieren des Angriffs mit deiner Figur ({0})",
  "coach.explanation.escapeCheck.kingMove": " durch einen Königszug nach {0}",
  "coach.explanation.escapeCheck.safe":
    " Dein König steht nicht mehr im Schach und du kannst weiterspielen.",
  "coach.explanation.escapeCheck.focus": "Abwehr des Schachs ansehen",
  "coach.explanation.captureCheck.title": "Mit Schach schlagen",
  "coach.explanation.capture.title": "Die gegnerische Figur ({0}) schlagen",
  "coach.explanation.capture.text":
    "Deine Figur ({0}) schlägt die gegnerische Figur ({1}) auf {2}{3}. {4}",
  "coach.explanation.capture.enPassant": " en passant und landet auf ",
  "coach.explanation.capture.attacked":
    "Gegnerische Figuren greifen deine Figur ({0}) auf {1} an; prüfe in der Vorschau, ob sie zurückschlagen.",
  "coach.explanation.capture.safe":
    "Keine gegnerische Figur greift derzeit deine Figur ({0}) auf {1} an.",
  "coach.explanation.capture.focus": "Schlag und mögliche Angreifer ansehen",
  "coach.explanation.check.title": "Schach bieten",
  "coach.explanation.check.text":
    "{0} Dein Gegner muss auf den Angriff auf seinen König reagieren.",
  "coach.explanation.check.focus": "Angriff auf den gegnerischen König ansehen",
  "coach.explanation.develop.centerControl":
    "Von hier greift sie {0} an und hilft dir, das Zentrum zu kontrollieren.",
  "coach.explanation.develop.purpose":
    "Wenn du Figuren aus der Grundreihe entwickelst, stehen dir mehr Figuren für die nächsten Züge zur Verfügung.",
  "coach.explanation.develop.title": "Eine weitere Figur entwickeln",
  "coach.explanation.develop.text":
    "Deine Figur ({0}) entwickelt sich aus der Grundreihe nach {1}. {2}",
  "coach.explanation.develop.focus": "Figur und Zentrumsfelder ansehen",
  "coach.explanation.center.title": "Das Zentrum besetzen",
  "coach.explanation.center.text":
    "Dein Bauer gewinnt auf {0} Raum im Zentrum. Er greift {1} an und schränkt sichere Felder für gegnerische Figuren ein.",
  "coach.explanation.center.focus": "Zentrumskontrolle des Bauern ansehen",
  "coach.explanation.openFile.title": "Den Turm auf eine offene Linie stellen",
  "coach.explanation.openFile.text":
    "Auf der {0}-Linie, auf die dein Turm zieht, stehen keine Bauern. Prüfe, welche Felder er erreichen kann, bevor eine andere Figur den Weg blockiert.",
  "coach.explanation.openFile.focus": "Offene Linie ansehen",
  "coach.explanation.rook.title": "Die Turmstellung verbessern",
  "coach.explanation.rook.text":
    "Probiere deinen Turm auf {0}. Spiele die Antwort durch, um seine Linien und Ziele zu sehen.",
  "coach.explanation.rook.focus": "Turmzug ansehen",
  "coach.explanation.king.title": "Die Königsstellung verbessern",
  "coach.explanation.king.text":
    "Dein König zieht von {0} nach {1}. Prüfe die Möglichkeiten des Gegners, bevor du sein nächstes Feld wählst.",
  "coach.explanation.king.focus": "Königszug ansehen",
  "coach.explanation.pawn.title": "Mit dem Bauern Raum gewinnen",
  "coach.explanation.pawn.text":
    "Dein Bauer rückt nach {0} vor und gewinnt Raum. Behalte die Felder im Blick, die er zurücklässt.",
  "coach.explanation.pawn.focus": "Bauernvorstoß ansehen",
  "coach.explanation.nearCenter.title":
    "Eine Figur nahe dem Zentrum verbessern",
  "coach.explanation.nearCenter.text":
    "Deine Figur ({0}) zieht nach {1}, nahe dem Zentrum. {2}",
  "coach.explanation.nearCenter.reply":
    "Sieh dir die gegnerische Antwort an, bevor du den nächsten Zug dieser Figur wählst.",
  "coach.explanation.nearCenter.focus": "Zug nahe dem Zentrum ansehen",
  "coach.explanation.reposition.title": "Deine Figur ({0}) umgruppieren",
  "coach.explanation.reposition.text":
    "Probiere deine Figur ({0}) auf {1}. Spiele die nächsten Züge durch, um gegnerische Antworten und die entstehenden Figurenstellungen zu sehen.",
  "coach.explanation.reposition.focus": "Zug deiner Figur ({0}) ansehen",
  "coach.reply.checkmate": "Sie können mit {0} mattsetzen ({1} nach {2}).",
  "coach.reply.castle": "{0} rochieren",
  "chess.castling.kingside": "kurz",
  "chess.castling.queenside": "lang",
  "coach.reply.capture":
    "deine Figur ({0}) auf {1}{2} mit ihrer Figur ({3}) schlagen",
  "coach.reply.enPassant": " en passant",
  "coach.reply.move": "ihre Figur ({0}) nach {1} ziehen",
  "coach.reply.promotion": " und in {0} umwandeln",
  "coach.reply.check": " und Schach bieten",
  "coach.reply.summary": "Sie können {0}{1}{2} ({3}).",
  "coach.warning.check":
    "Wehre zuerst das Schach ab. Prüfe einen Königszug, das Schlagen des Angreifers oder das Dazwischenziehen einer Figur.",
  "coach.warning.undefended":
    "Deine Figur ({0}) auf {1} ist angegriffen und ungedeckt. Kannst du sie wegziehen, decken oder eine zwingende Gegendrohung aufstellen?",
  "coach.warning.defended":
    "Deine Figur ({0}) auf {1} ist angegriffen. Sie ist gedeckt, aber spiele den Abtausch durch, bevor du sie dort lässt.",
  "coach.warning.general":
    "Prüfe vor deinem Zug gegnerische Schachgebote, Schläge und Angriffe auf ungedeckte Figuren. Beginne mit der wahrscheinlichen Antwort unter deinem Zug.",
  "coach.strategy.attack": "{0} greift {1} mit deiner Figur ({2}) an.",
  "coach.piece.theirsOnSquare": "die gegnerische Figur ({0}) auf {1}",
  "coach.strategy.undefended.singular":
    "Deine Figur ({0}) ist angegriffen und ungedeckt.",
  "coach.strategy.undefended.plural":
    "Deine Figuren ({0}) sind angegriffen und ungedeckt.",
  "coach.strategy.center": "Deine Figuren kontrollieren {0} im Zentrum.",
  "coach.strategy.line.checkmate": "{0} beendet diese Variante mit Schachmatt.",
  "coach.strategy.line.capture":
    "Die Vorschau endet mit einem Schlag: {0} spielt {1}. Der Abtausch kann weitergehen.",
  "coach.strategy.material.gain.singular":
    "In dieser möglichen Variante würdest du Material im Wert von {0} Bauern gewinnen.",
  "coach.strategy.material.gain.plural":
    "In dieser möglichen Variante würdest du Material im Wert von {0} Bauern gewinnen.",
  "coach.strategy.material.loss.singular":
    "In dieser möglichen Variante würdest du Material im Wert von {0} Bauern abgeben.",
  "coach.strategy.material.loss.plural":
    "In dieser möglichen Variante würdest du Material im Wert von {0} Bauern abgeben.",
  "coach.strategy.material.even":
    "Die Materialbilanz bleibt in dieser Variante gleich.",
  "coach.strategy.change.check":
    "{0} setzt deinen König ins Schach. Die Abwehr hat Vorrang.",
  "coach.strategy.change.undefended":
    "{0} lässt deine Figur ({1}) auf {2} angegriffen und ungedeckt. Kümmere dich darum, bevor du deinen Plan fortsetzt.",
  "coach.strategy.change.capture":
    "Deine Figur ({0}) wurde gerade mit {1} geschlagen. Prüfe {2}, bevor du antwortest.",
  "coach.strategy.change.center":
    "{0} verändert die gegnerische Kontrolle über {1}. Probiere {2} und prüfe mögliche Antworten.",
  "coach.strategy.change.move":
    "Die gegnerische Figur ({0}) steht jetzt auf {1}. Probiere {2}{3}.",
  "coach.strategy.change.reply": "; eine mögliche Antwort ist {0}",
  "coach.strategy.change.respond": " und prüfe die Antwort",
  "coach.strategy.compare.forced": "Diese Stellung hat nur einen legalen Zug.",
  "coach.strategy.compare.onlyRecommendation":
    "{0} ist hier der einzige empfohlene Zug. Die anderen untersuchten Züge geben im Vergleich zu viel auf.",
  "coach.strategy.compare.mate":
    "Hier zählen Mattdrohungen mehr als kleine Bewertungsunterschiede. Spiele {0} und {1} durch und beachte die Schachgebote genau.",
  "coach.strategy.compare.similar":
    "{0} und {1} sehen beide gut aus. Spiele die Antworten durch und wähle die Stellung, die dir lieber ist.",
  "coach.strategy.compare.stronger":
    "{0} sieht stärker aus als {1}. Spiele beide Antworten durch, um die Stellungen zu vergleichen.",
  "coach.continuation.previewReply": "Wahrscheinliche Antwort ansehen: {0}",
  "coach.continuation.replyHeading": "WAHRSCHEINLICHE ANTWORT",
  "coach.continuation.label": "Engine-Variante",
  "coach.continuation.heading": "MÖGLICHE NÄCHSTE ZÜGE",
  "coach.continuation.previewMove": "Zug {0} ansehen: {1} spielt {2}",
  "engine.error.noLegalCandidates":
    "Die Engine hat keine legalen Züge geliefert. Starte die Analyse erneut.",
  "coach.position.heading": "Über diese Stellung",
  "coach.position.changed": "WAS SICH GEÄNDERT HAT",
  "coach.position.hideSquares": "Wichtige Felder ausblenden",
  "coach.position.showSquares": "Wichtige Felder markieren",
  "coach.position.squaresDescription":
    "Türkise Umrandungen markieren die besprochenen Felder: {0}.",
  "coach.analysis.status.thinking": "Analyse läuft…",
  "coach.analysis.status.unavailable": "Engine nicht verfügbar",
  "coach.analysis.status.ready": "Empfehlungen bereit",
  "coach.analysis.reviewingPosition":
    "Rückblick auf {0}. Die Analyse gilt für diese Stellung.",
  "coach.analysis.errorHeading": "Versuchen wir es noch einmal.",
  "coach.analysis.retry": "Analyse erneut starten",
  "coach.analysis.label": "Bester Zug und Strategie",
  "coach.analysis.search.heading": "DEIN ZUG WIRD GESUCHT",
  "coach.analysis.search.bestMove": "Bester Zug für {0} wird gesucht…",
  "coach.analysis.search.history":
    "Deine Optionen und die Antworten aus dieser früheren Stellung werden geprüft.",
  "coach.analysis.search.live":
    "Deine Optionen und gegnerische Antworten werden geprüft. Du kannst weiterspielen.",
  "coach.analysis.search.depth": "Tiefere Analyse · Tiefe {0}",
  "coach.analysis.search.estimate": "Meist in wenigen Sekunden bereit",
  "coach.warnings.heading": "Achte auf",
  "coach.warnings.description":
    "Mit Maus oder Tastaturfokus die bedrohte Figur und ihre Angreifer markieren.",
  "coach.best.escapeCheck": "Schach abwehren",
  "coach.best.heading": "BESTER ZUG",
  "coach.best.forced": "Einziger legaler Zug",
  "coach.best.continuity": "Plan wird fortgesetzt",
  "coach.best.play": "Besten Zug {0} spielen",
  "coach.best.hideReply": "Antwort ausblenden",
  "coach.best.previewReply": "Antwort ansehen",
  "coach.best.explore": "Nächste Züge erkunden",
  "coach.review.error.failed":
    "Die Engine konnte diesen Zug nicht bewerten. Versuche es erneut.",
  "coach.review.error.comparison":
    "Die Engine konnte diesen Zug nicht zuverlässig vergleichen. Versuche es erneut.",
  "coach.review.error.reply":
    "Die Engine konnte die Antwort nicht prüfen. Versuche es erneut.",
  "coach.feedback.status.reviewing": "Wird geprüft…",
  "coach.feedback.status.unavailable": "Zugbewertung nicht verfügbar",
  "coach.feedback.label": "Zugbewertung",
  "coach.feedback.toggleDescription": "{0}: {1}. {2}. Details {3}",
  "common.show": "anzeigen",
  "common.hide": "ausblenden",
  "coach.feedback.pending":
    "Dein Zug und die besten Alternativen werden geprüft…",
  "coach.feedback.retry": "Zugbewertung erneut starten",
  "coach.feedback.nextTime": "Fürs nächste Mal",
  "coach.feedback.likelyReply": "Wahrscheinliche Antwort",
  "coach.feedback.evaluationDescription":
    "Der Bewertungsunterschied wird in Bauerneinheiten gemessen. Die Zugnoten berücksichtigen die gesamte Stellung; Matt hat keinen Bauernwert.",
  "coach.feedback.quickReview": "Kurze Bewertung",
  "coach.feedback.evaluationDrop": "{0} Bewertungsverlust",
  "coach.explanation.matingAttack.title": "Den Mattangriff fortsetzen",
  "coach.explanation.matingAttack.text":
    "Laut dieser Analyse gibt es Matt in {0} Zügen, beginnend mit {1}. Spiele die Antworten durch, um den Angriff zu verstehen.",
  "coach.explanation.matingAttack.focus": "Beginn des Mattangriffs ansehen",
  "coach.explanation.mateDefense.title": "Die zäheste Verteidigung finden",
  "coach.explanation.mateDefense.text":
    "Dein König ist in großer Gefahr: Die Analyse sieht nach {0} weiterhin ein erzwungenes Matt. Verfolge die gegnerischen Schachgebote, um die Gefahr zu verstehen.",
  "coach.explanation.mateDefense.focus": "Verteidigungszug ansehen",
  "coach.reply.unavailable":
    "Diese Vorschau enthält keine Antwort. Probiere den Zug, um die Fortsetzung zu erkunden.",
  "coach.reply.continuation": " Du könntest mit {0} fortsetzen: {1}.",
  "coach.reply.terminal.checkmate":
    "Das ist Schachmatt. Es gibt keine Antwort.",
  "coach.reply.terminal.draw": "Dieser Zug beendet die Partie mit Remis.",
  "coach.estimate.mate": "Erzwungenes Matt für {0}",
  "coach.estimate.balanced": "Ausgeglichene Stellung",
  "coach.estimate.smallEdge": "{0} hat einen kleinen Vorteil",
  "coach.estimate.advantage": "{0} hat Vorteil",
  "coach.estimate.winning": "{0} hat einen Gewinnvorteil",
  "coach.status.checkmate": "Schachmatt",
  "coach.status.draw": "Remis",
  "coach.status.previewCheck": "Vorschau · Schach",
  "coach.status.preview": "Vorschau",
  "coach.status.check": "Schach",
  "coach.status.paused": "Pausiert",
  "coach.status.replying": "Antwort folgt…",
  "coach.status.thinking": "Überlegt…",
  "coach.status.reviewing": "Rückblick",
  "coach.status.yourTurn": "Du bist am Zug",
  "coach.panel.label": "Stellungsanalyse",
  "coach.panel.heading": "Dein Trainer",
  "coach.turn.label": "Am Zug",
  "coach.turn.select": "Wer ist am Zug",
  "coach.turn.changeDescription":
    "Ein Farbwechsel startet eine neue Stellung und löscht den Zugverlauf.",
  "coach.panel.backToBoard": "Zum Brett ↑",
  "coach.calculate.label.waiting": "Warten auf den Computer",
  "coach.calculate.label.thinking": "Beste Züge werden berechnet",
  "coach.calculate.label.ready": "Beste Züge berechnen",
  "coach.calculate.text.waiting": "Warten auf den Computer…",
  "coach.calculate.text.thinking": "Berechnung läuft…",
  "common.dismissError": "Fehlermeldung schließen",
  "game.history.controls": "Verlaufssteuerung",
  "game.history.backToLatest": "Zur aktuellen Stellung",
  "coach.context.preview": "Vorschau · {0}",
  "coach.context.reviewingUpdating":
    "Rückblick auf {0} · Stellungsanalyse wird aktualisiert",
  "coach.context.reviewingReady":
    "Rückblick auf {0} · Analyse für diese Stellung",
  "coach.context.reviewingIdle":
    "Rückblick auf {0} · Bei Bedarf Analyse starten",
  "computer.status.movingSoon": "Der Computer zieht gleich…",
  "computer.status.choosingReply": "Der Computer wählt eine Antwort…",
  "coach.context.updating":
    "Analyse für {0} wird aktualisiert · Du kannst weiterspielen",
  "coach.panel.returnToGame": "Zur Partie zurück",
  "computer.status.invalidPosition":
    "Baue eine legale Stellung mit beiden Königen auf, um gegen den Computer zu spielen.",
  "computer.status.gameEnded":
    "Diese Partie ist beendet. Starte eine neue Partie.",
  "computer.status.preview":
    "Kehre zu deiner Partie zurück, um weiterzuspielen.",
  "computer.status.enable":
    "Aktiviere „Gegen Computer spielen“, um gegen {0} zu spielen.",
  "computer.status.settings":
    "Partie pausiert, während du die Einstellungen wählst.",
  "computer.error.move":
    "Der Computer konnte keinen Zug wählen. Versuche es erneut.",
  "computer.status.thinking": "Der Computer überlegt…",
  "computer.status.yourTurn": "Du bist am Zug. Spiele einen Zug auf dem Brett.",
  "computer.error.saveDifficulty":
    "Die Computerstärke konnte in diesem Browser nicht gespeichert werden.",
  "computer.toggle.label": "Gegen Computer spielen",
  "computer.toggle.text": "Computer",
  "computer.settings.heading": "Computereinstellungen",
  "computer.retry": "Computer erneut starten",
  "computer.settings.close": "Computereinstellungen schließen",
  "computer.settings.side": "Deine Farbe",
  "computer.settings.difficulty": "Deine Herausforderung",
  "common.retry": "Erneut versuchen",
  "common.done": "Fertig",
  "game.history.startingPosition": "Anfangsstellung",
  "game.save.error.unavailable":
    "Der Browserspeicher ist nicht verfügbar oder voll. Deine letzten Änderungen könnten beim Neuladen verloren gehen.",
  "game.save.error.backup":
    "Die ursprünglichen Daten konnten nicht gesichert werden. Automatisches Speichern bleibt pausiert. Letzte Änderungen könnten beim Neuladen verloren gehen.",
  "game.status.continuing": "Fortsetzung aus der gewählten Stellung.",
  "game.result.label": "Partieergebnis",
  "game.result.checkmate": "SCHACHMATT",
  "game.result.draw": "REMIS",
  "game.result.drawHeading": "Die Punkte werden geteilt.",
  "game.result.checkmateMessage": "Ein königlicher Abschluss. Noch eine Runde?",
  "game.result.drawMessage": "Gut gespielt. Die nächste Runde wartet.",
  "game.result.score": "Endstand: Weiß {0}, Schwarz {1}",
  "game.result.playAgain": "Erneut spielen",
  "game.promotion.label": "Umwandlungsfigur wählen",
  "game.promotion.cancel": "Umwandlung abbrechen",
  "game.promotion.heading": "Dein Bauer hat es geschafft.",
  "game.promotion.description": "Wähle sein nächstes Kapitel.",
  "game.promotion.choose": "In {0} umwandeln",
  "game.save.label": "Speicherstatus der Partie",
  "game.save.recoveryHeading":
    "Gespeicherte Partie muss wiederhergestellt werden",
  "game.save.unavailableHeading": "Speichern nicht verfügbar",
  "game.save.backupHeading": "Ursprüngliche Daten bewahrt",
  "game.save.backupDescription":
    "Die ursprünglichen Daten sind in einer separaten Wiederherstellungskopie im Browser gesichert. Automatisches Speichern ist wieder aktiv.",
  "game.save.resume": "Partie behalten und Speichern fortsetzen",
  "game.save.dismiss": "Wiederherstellungshinweis schließen",
  "position.error.invalidInput": "Dieses FEN ist ungültig.",
  "position.error.clipboard":
    "Kein Zugriff auf die Zwischenablage. Markiere den FEN-Text und kopiere ihn manuell.",
  "position.controls.label": "FEN-Stellungssteuerung",
  "position.controls.heading": "FEN-Stellung",
  "position.controls.input": "FEN-Stellung einfügen",
  "position.controls.copy": "Aktuelles FEN kopieren",
  "position.controls.load": "Laden",
  "game.save.error.readStorage":
    "Der Browserspeicher konnte nicht gelesen werden. Deine gespeicherte Partie ist möglicherweise nicht verfügbar.",
  "game.save.error.restoredPosition":
    "Deine gespeicherte Partie konnte nicht gelesen werden. Die letzte gültige Stellung wurde ohne Verlauf wiederhergestellt. Automatisches Speichern ist zum Schutz der ursprünglichen Daten pausiert.",
  "game.save.error.freshBoard":
    "Deine gespeicherte Partie konnte nicht gelesen werden. Ein neues Brett wurde geöffnet. Automatisches Speichern ist zum Schutz der ursprünglichen Daten pausiert.",
  "game.save.error.verifyBackup":
    "Die Wiederherstellungskopie konnte nicht überprüft werden.",
  "game.history.label": "Partiezüge",
  "game.history.heading": "Zugverlauf",
  "game.history.viewStart": "Anfangsstellung ansehen",
  "game.history.start": "Anfang",
  "game.history.viewMove": "Stellung nach {0} ansehen",
  "chess.piece.pawn": "Bauer",
  "chess.piece.knight": "Springer",
  "chess.piece.bishop": "Läufer",
  "chess.piece.rook": "Turm",
  "chess.piece.queen": "Dame",
  "chess.piece.king": "König",
  "computer.level.beginner": "Anfänger",
  "computer.level.easy": "Leicht",
  "computer.level.medium": "Mittel",
  "computer.level.hard": "Schwer",
  "computer.level.expert": "Experte",
  "coach.grade.best": "Bester Zug",
  "coach.grade.good": "Guter Zug",
  "coach.grade.inaccuracy": "Ungenauigkeit",
  "coach.grade.mistake": "Fehler",
  "coach.grade.blunder": "Grober Fehler",
  "coach.feedback.context.yourLastMove": "Dein letzter Zug",
  "coach.feedback.context.selectedMove": "Gewählter Zug",
  "page.title": "Tempo — Dein nächster Zug, erklärt.",
  "position.fen.fields":
    "muss sechs durch Leerzeichen getrennte Felder enthalten",
  "position.fen.moveNumber": "die Zugnummer muss eine positive ganze Zahl sein",
  "position.fen.halfMoveCounter":
    "der Halbzugzähler muss eine nicht negative ganze Zahl sein",
  "position.fen.enPassantSquare": "das En-passant-Feld ist ungültig",
  "position.fen.castlingRights": "die Rochaderechte sind ungültig",
  "position.fen.sideToMove": "die Zugfarbe ist ungültig",
  "position.fen.rows":
    "die Figurendaten müssen 8 durch „/“ getrennte Reihen enthalten",
  "position.fen.consecutiveNumbers":
    "ungültige Figurendaten: aufeinanderfolgende Zahlen",
  "position.fen.invalidPiece": "ungültige Figurendaten: unbekannte Figur",
  "position.fen.rankSize":
    "ungültige Figurendaten: zu viele Felder in einer Reihe",
  "position.fen.illegalEnPassant": "illegales En-passant-Feld",
  "position.fen.pawnOnEdge": "Bauern stehen auf der ersten oder letzten Reihe",
  "coach.feedback.context.lastMove": "Letzter Zug",
  "position.notice.loaded": "Stellung geladen",
  "position.notice.copied": "Stellung kopiert",
  "position.fen.emptySquares": "leere Felder müssen mit 1–8 angegeben werden",
  "game.result.winner": "{0} gewinnt!",
  "board.tray.label": "Figuren von {0}",
  "coach.alternatives.description": "Alternative: {0}. {1}. {2}",
} satisfies Catalog;
