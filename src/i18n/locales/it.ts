import type { Catalog } from "./en";

export default {
  "intro.guide.show": "Come giocare",
  "intro.guide.hide": "Nascondi istruzioni",
  "board.editor.open": "Modifica posizione",
  "board.editor.close": "Termina modifica",
  "board.preview.label": "Anteprima",
  "board.preview.previous": "Mossa precedente nell’anteprima",
  "board.preview.next": "Mossa successiva nell’anteprima",
  "coach.analysis.more": "Più analisi",
  "coach.analysis.less": "Meno analisi",
  "engine.error.load":
    "Impossibile caricare il motore. Controlla la connessione e riprova l'analisi.",
  "engine.error.loadTimeout":
    "Il motore ha impiegato troppo tempo a caricarsi. Analizza di nuovo la posizione.",
  "engine.error.start":
    "Impossibile avviare il motore. Ricarica la pagina o usa un browser che supporti WebAssembly.",
  "engine.error.responseTimeout":
    "Il motore ha impiegato troppo tempo a rispondere. Analizza di nuovo la posizione.",
  "engine.error.incompleteAnalysis":
    "Nessuna analisi completa ricevuta. Riprova questa posizione.",
  "language.selector.label": "Lingua",
  "position.error.invalidFen": "FEN non valido: {0}",
  "position.error.pawnLimit":
    "{0}: massimo 8 pedoni. Rimuovine uno prima di aggiungerne un altro.",
  "position.error.pieceLimit":
    "{0}: massimo 16 pezzi. Rimuovine uno prima di aggiungerne un altro.",
  "position.error.missingPlayableKing":
    "Aggiungi il re di {0} per giocare o analizzare.",
  "position.error.inactiveKingInCheck":
    "Il re di {0} è sotto scacco, ma tocca a {1}. Cambia il turno o metti il re al sicuro.",
  "position.error.castlingPieces":
    "Il diritto di arrocco {0} richiede re e torre di {1} sulle caselle iniziali.",
  "position.error.missingKing": "Manca il re di {0}.",
  "position.error.tooManyKings": "Troppi re per {0}.",
  "chess.side.white": "Bianco",
  "chess.side.black": "Nero",
  "header.home": "Pagina iniziale di Tempo",
  "header.tagline": "Il tuo spazio per gli scacchi",
  "intro.heading.start": "La tua prossima mossa,",
  "intro.heading.end": "spiegata.",
  "intro.tagline":
    "Esplora la scacchiera. Comprendi il piano. Prova una mossa.",
  "intro.guide.play":
    "Seleziona un pezzo e la casella di destinazione per giocare.",
  "intro.guide.analyze":
    "Scegli «{0}», poi visualizza una risposta in anteprima o prova la mossa suggerita.",
  "intro.guide.setup":
    "Usa gli strumenti di modifica per creare una posizione.",
  "footer.tagline": "Una buona mossa inizia con un po' di comprensione.",
  "footer.engine": "Con Stockfish 19",
  "move.description.normal": "{0}{1} da {2} a {3}",
  "move.description.castle": "Arrocco: re da {0} a {1}, torre {2}",
  "move.description.kingsideRook": "da h{0} a f{1}",
  "move.description.queensideRook": "da a{0} a d{1}",
  "move.description.capture": ", catturando {0}{1}",
  "move.description.enPassantSquare": " in {0} en passant",
  "move.description.promotion": ", promuovendo a {0}",
  "move.description.checkmate": " — scacco matto",
  "move.description.check": " — scacco",
  "position.error.missingBothKings":
    "Aggiungi entrambi i re per giocare o analizzare.",
  "position.error.pawnOnEdge":
    "Sposta i pedoni dalla prima e dall'ultima traversa per giocare o analizzare.",
  "position.error.illegalArrangement":
    "Prepara una posizione legale per giocare o analizzare.",
  "position.error.invalidPosition": "Questa posizione non è valida.",
  "position.error.moveCounters":
    "I contatori delle mosse nel FEN devono essere numeri interi nell'intervallo supportato.",
  "position.error.castlingRights":
    "Ogni diritto di arrocco (KQkq) va indicato una sola volta, oppure usa «-» per nessuno.",
  "position.error.emptySquaresFen":
    "FEN non valido: usa 1–8 per le caselle vuote.",
  "position.error.enPassantCounter":
    "Una casella en passant richiede un contatore delle semimosse a zero, perché l'ultima mossa era di pedone.",
  "position.error.enPassantPawn":
    "La casella en passant richiede un pedone avversario appena avanzato di due caselle. Controlla il quarto campo del FEN.",
  "game.ending.checkmate": "{0} vince per scacco matto.",
  "game.ending.stalemate":
    "Stallo. Non ci sono mosse legali e il re non è sotto scacco.",
  "game.ending.repetition": "Patta per triplice ripetizione.",
  "game.ending.insufficientMaterial":
    "Patta. Nessun lato ha materiale sufficiente per dare matto.",
  "game.ending.fiftyMoves": "Patta per la regola delle cinquanta mosse.",
  "board.controls.label": "Scacchiera e controlli della posizione",
  "board.newGame.description": "Inizia una partita dalla posizione iniziale",
  "board.newGame.label": "Nuova partita",
  "board.clear": "Svuota scacchiera",
  "board.navigation.label": "Navigazione delle mosse",
  "board.navigation.previous": "Mossa precedente",
  "board.navigation.next": "Mossa successiva",
  "board.flip": "Ruota scacchiera",
  "board.openCoach": "Vai all'allenatore",
  "chess.piece.label": "{1} · {0}",
  "board.evaluation.calculateFirst":
    "Calcola le migliori mosse per vedere la valutazione",
  "board.evaluation.previewPaused": "Valutazione sospesa durante l'anteprima",
  "board.evaluation.legend":
    "+ = vantaggio del Bianco · − = vantaggio del Nero",
  "board.evaluation.whiteScore": "Valutazione per il Bianco: {0}",
  "board.evaluation.pending": "Valutazione in attesa",
  "board.label.preview": "Scacchiera di anteprima",
  "board.label.history": "Scacchiera della cronologia",
  "board.label.interactive": "Scacchiera interattiva",
  "board.square.empty": " vuota",
  "board.square.check": " sotto scacco",
  "board.tray.place": "Posiziona: {1} · {0}",
  "board.tray.add": "Aggiungi: {1} · {0} · Clicca o trascina sulla scacchiera",
  "coach.alternatives.heading": "Altre buone opzioni",
  "coach.evaluation.description":
    "Stima in pedoni: + favorisce il Bianco, − il Nero.",
  "coach.move.play": "Gioca {0}",
  "coach.lesson.mateThreat.advice":
    "Prima di muovere, controlla se i pezzi avversari possono raggiungere il tuo re in {0}. Qui, {1} conclude la partita.",
  "coach.lesson.mateThreat.focus": "Vedi la minaccia di matto",
  "coach.lesson.undefended.consequence":
    "lascia il tuo pezzo ({0}) in {1} senza difesa. Il pezzo avversario ({2}) può catturarlo con {3}",
  "coach.lesson.defendedCapture.consequence":
    "permette al pezzo avversario ({0}) di catturare il tuo pezzo ({1}) in {2} con {3}. Ha un difensore: segui il resto dello scambio",
  "coach.lesson.undefended.advice":
    "Prima di muovere, controlla quali tuoi pezzi possono essere catturati e se puoi ricatturare.",
  "coach.lesson.defendedCapture.advice":
    "Prima di accettare uno scambio, confronta le catture di entrambi i lati, inclusa la risposta successiva.",
  "coach.lesson.capture.focus": "Vedi il pezzo che possono catturare",
  "coach.lesson.laterCapture.consequence":
    "permette di arrivare a {0} nella linea mostrata, dove il pezzo avversario ({1}) cattura il tuo pezzo ({2}) in {3}. Possono seguire altri scambi",
  "coach.lesson.forcedReply.advice":
    "Segui gli scacchi oltre alle catture. Uno scacco può costringerti a rispondere prima di proteggere un altro pezzo.",
  "coach.lesson.laterCapture.advice":
    "Guarda oltre la prima risposta: segui anche le catture successive prima di valutare lo scambio.",
  "coach.lesson.laterCapture.focus": "Vedi la cattura successiva nella linea",
  "coach.piece.yoursOnSquare": "il tuo pezzo ({0}) in {1}",
  "common.join.and": " e ",
  "coach.lesson.fork.consequence":
    "permette una forchetta: il pezzo avversario ({0}) in {1} attacca {2} contemporaneamente",
  "coach.lesson.fork.advice":
    "Cerca risposte che attaccano due pezzi insieme. Muoverne o proteggerne uno può lasciare l'altro sotto attacco.",
  "coach.lesson.fork.focus": "Vedi i due attacchi",
  "coach.lesson.compareCapture":
    "Confronta la cattura in {0} con {1}. Guarda la risposta prima di decidere se catturare ti aiuta.",
  "coach.lesson.compareDefense":
    "Controlla quali pezzi hanno bisogno di protezione. {0} offre un altro modo di difendere la posizione.",
  "coach.lesson.compareEscape":
    "Controlla se un pezzo è sotto attacco prima di iniziare un altro piano. {0} lo allontana dal pericolo.",
  "coach.lesson.compareAlternative":
    "Controlla scacchi, catture e attacchi avversari prima di scegliere. Guarda {0} per confrontare l'alternativa.",
  "coach.review.error.needsAnalysis":
    "La mossa richiede l'analisi della posizione risultante.",
  "coach.review.checkmate":
    "{0} dà scacco matto. Il re avversario non ha scampo: hai concluso la partita.",
  "coach.review.best": "{0} è la scelta migliore qui. {1}",
  "coach.review.good.draw":
    "ottiene una patta, vicina al miglior risultato trovato",
  "coach.review.good.winningMate": "mantiene il matto nella linea analizzata",
  "coach.review.good.losingMate":
    "resiste quasi quanto la miglior difesa trovata, anche se l'analisi vede ancora un matto contro di te",
  "coach.review.good.winning":
    "mantiene il tuo forte vantaggio. La posizione resta ottima",
  "coach.review.good.losing":
    "resiste quasi quanto la migliore opzione in una posizione già difficile",
  "coach.review.good.balanced":
    "sembra buona qui, con possibilità vicine a {0}",
  "coach.review.consequence.draw":
    "porta alla patta. {0} offriva migliori possibilità",
  "coach.review.consequence.allowsMate":
    "permette un matto forzato nella linea analizzata",
  "coach.review.consequence.missesMate": "lascia sfuggire un matto forzato",
  "coach.review.consequence.worseChances":
    "offre all'avversario più possibilità rispetto a {0}",
  "coach.review.response.draw":
    "Prova l'altra mossa per vedere per cosa potresti continuare a giocare.",
  "coach.review.response.preview":
    "Segui la risposta per vedere cosa potrebbero fare dopo.",
  "coach.explanation.pressure.title": "Aumenta la pressione su {0}",
  "coach.explanation.pressure.text":
    "Il tuo pezzo ({0}) si unisce a un altro per attaccare il pezzo avversario ({1}) in {2}. Ora devono gestire più di un attaccante.",
  "coach.explanation.attack.focus": "Vedi l'attacco al pezzo avversario ({0})",
  "coach.explanation.supportCenter.title": "Sostieni il centro",
  "coach.explanation.defend.title": "Difendi il tuo pezzo ({0})",
  "coach.explanation.defend.text":
    "Il tuo pezzo ({0}) in {1} ora difende il pezzo ({2}) in {3}. Se viene catturato, il tuo pezzo ({4}) potrebbe ricatturare: controlla la risposta prima dello scambio.",
  "coach.explanation.defend.focus": "Vedi la difesa del tuo pezzo ({0})",
  "coach.explanation.escapeAttack.title":
    "Allontana il tuo pezzo ({0}) dal pericolo",
  "coach.explanation.escapeAttack.text":
    "Il tuo pezzo ({0}) era sotto attacco in {1}. In {2}, nessun pezzo avversario lo attacca al momento.",
  "coach.explanation.escapeAttack.focus":
    "Vedi il tuo pezzo ({0}) uscire dal pericolo",
  "coach.explanation.attack.title": "Attacca il pezzo avversario ({0})",
  "coach.explanation.attack.existing":
    "Il tuo pezzo ({0}) in {1} attacca il pezzo avversario ({2}) in {3}. Attenzione a una ritirata, una difesa o una minaccia avversaria.",
  "coach.explanation.attack.new":
    "Il tuo pezzo ({0}) in {1} ora attacca il pezzo avversario ({2}) in {3}. Potrebbero spostarlo o difenderlo: guarda la risposta prima di contare sulla cattura.",
  "coach.piece.onSquare": "{0} in {1}",
  "coach.explanation.check.plural": "I tuoi pezzi ({0}) danno scacco.",
  "coach.explanation.check.singular": "Il tuo pezzo ({0}) dà scacco.",
  "coach.explanation.promotion.prefix": "Il tuo pedone promuove a {0} in {1}. ",
  "coach.explanation.checkmate.title": "Concludi con scacco matto",
  "coach.explanation.checkmate.plural":
    "{0}I tuoi pezzi ({1}) danno scacco matto. Il re avversario non ha scampo.",
  "coach.explanation.checkmate.singular":
    "{0}Il tuo pezzo ({1}) dà scacco matto. Il re avversario non ha scampo.",
  "coach.explanation.checkmate.focus": "Vedi lo scacco matto",
  "coach.explanation.promotion.title": "Promuovi il pedone",
  "coach.explanation.promotion.text":
    "Ora hai un pezzo ({0}) al posto del pedone. Guarda la risposta avversaria.",
  "coach.explanation.promotion.focus": "Vedi la promozione",
  "coach.explanation.castle.title": "Arrocca e attiva la torre",
  "coach.explanation.castle.text":
    "L'arrocco allontana il re dal centro e avvicina la torre al centro.{0}",
  "coach.explanation.castle.focus": "Vedi il movimento di re e torre",
  "coach.explanation.escapeCheck.title": "Sottrai il re allo scacco",
  "coach.explanation.escapeCheck.text": "{0} risolve lo scacco{1}.{2}",
  "coach.explanation.escapeCheck.capture":
    " e cattura il pezzo avversario ({0}) in {1}",
  "coach.explanation.escapeCheck.block":
    " bloccando l'attacco con il tuo pezzo ({0})",
  "coach.explanation.escapeCheck.kingMove": " spostando il re in {0}",
  "coach.explanation.escapeCheck.safe":
    " Il re non è più sotto attacco e puoi continuare a giocare.",
  "coach.explanation.escapeCheck.focus": "Vedi come risolvere lo scacco",
  "coach.explanation.captureCheck.title": "Cattura con scacco",
  "coach.explanation.capture.title": "Cattura il pezzo avversario ({0})",
  "coach.explanation.capture.text":
    "Il tuo pezzo ({0}) cattura il pezzo avversario ({1}) in {2}{3}. {4}",
  "coach.explanation.capture.enPassant": " en passant, arrivando in ",
  "coach.explanation.capture.attacked":
    "I pezzi avversari attaccano il tuo pezzo ({0}) in {1}: guarda la risposta per verificare se ricatturano.",
  "coach.explanation.capture.safe":
    "Nessun pezzo avversario attacca al momento il tuo pezzo ({0}) in {1}.",
  "coach.explanation.capture.focus": "Vedi la cattura e i possibili attaccanti",
  "coach.explanation.check.title": "Dai scacco",
  "coach.explanation.check.text":
    "{0} L'avversario deve rispondere all'attacco al re.",
  "coach.explanation.check.focus": "Vedi l'attacco al re avversario",
  "coach.explanation.develop.centerControl":
    "Da qui attacca {0}, aiutandoti a controllare il centro.",
  "coach.explanation.develop.purpose":
    "Sviluppare i pezzi dalla traversa iniziale ti dà più pezzi da usare nelle prossime mosse.",
  "coach.explanation.develop.title": "Sviluppa un altro pezzo",
  "coach.explanation.develop.text":
    "Il tuo pezzo ({0}) lascia la traversa iniziale per {1}. {2}",
  "coach.explanation.develop.focus": "Vedi il pezzo e le caselle centrali",
  "coach.explanation.center.title": "Occupa il centro",
  "coach.explanation.center.text":
    "Il pedone guadagna spazio al centro in {0}. Attacca {1}, limitando le caselle sicure per i pezzi avversari.",
  "coach.explanation.center.focus": "Vedi il controllo centrale del pedone",
  "coach.explanation.openFile.title": "Porta la torre su una colonna aperta",
  "coach.explanation.openFile.text":
    "Non ci sono pedoni sulla colonna {0}, dove si sposta la torre. Cerca le caselle raggiungibili prima che un altro pezzo blocchi il percorso.",
  "coach.explanation.openFile.focus": "Vedi la colonna aperta",
  "coach.explanation.rook.title": "Migliora la posizione della torre",
  "coach.explanation.rook.text":
    "Prova la torre in {0}. Segui la risposta per vedere quali linee e obiettivi può sfruttare.",
  "coach.explanation.rook.focus": "Vedi la mossa della torre",
  "coach.explanation.king.title": "Migliora la posizione del re",
  "coach.explanation.king.text":
    "Il re passa da {0} a {1}. Controlla cosa possono fare i pezzi avversari prima di scegliere la casella successiva.",
  "coach.explanation.king.focus": "Vedi la mossa del re",
  "coach.explanation.pawn.title": "Guadagna spazio con il pedone",
  "coach.explanation.pawn.text":
    "Il pedone avanza in {0}, guadagnando spazio. Tieni d'occhio le caselle che lascia dietro di sé.",
  "coach.explanation.pawn.focus": "Vedi l'avanzata del pedone",
  "coach.explanation.nearCenter.title": "Migliora un pezzo vicino al centro",
  "coach.explanation.nearCenter.text":
    "Il tuo pezzo ({0}) si sposta in {1}, vicino al centro. {2}",
  "coach.explanation.nearCenter.reply":
    "Guarda la risposta avversaria prima di scegliere la prossima mossa del pezzo.",
  "coach.explanation.nearCenter.focus": "Vedi la mossa vicino al centro",
  "coach.explanation.reposition.title": "Riposiziona il tuo pezzo ({0})",
  "coach.explanation.reposition.text":
    "Prova il tuo pezzo ({0}) in {1}. Segui le prossime mosse per vedere le risposte avversarie e dove finiranno i pezzi.",
  "coach.explanation.reposition.focus": "Vedi la mossa del tuo pezzo ({0})",
  "coach.reply.checkmate": "Possono dare matto con {0} ({1} in {2}).",
  "coach.reply.castle": "arroccare {0}",
  "chess.castling.kingside": "corto",
  "chess.castling.queenside": "lungo",
  "coach.reply.capture":
    "catturare il tuo pezzo ({0}) in {1}{2} con il loro pezzo ({3})",
  "coach.reply.enPassant": " en passant",
  "coach.reply.move": "spostare il loro pezzo ({0}) in {1}",
  "coach.reply.promotion": " e promuovere a {0}",
  "coach.reply.check": " e dare scacco",
  "coach.reply.summary": "Possono {0}{1}{2} ({3}).",
  "coach.warning.check":
    "Rispondi prima allo scacco. Cerca una mossa di re, una cattura dell'attaccante o un pezzo che blocchi l'attacco.",
  "coach.warning.undefended":
    "Il tuo pezzo ({0}) in {1} è sotto attacco e senza difesa. Puoi spostarlo, proteggerlo o creare una minaccia a cui debbano rispondere prima?",
  "coach.warning.defended":
    "Il tuo pezzo ({0}) in {1} è sotto attacco. Ha un difensore, ma segui lo scambio prima di lasciarlo lì.",
  "coach.warning.general":
    "Prima di muovere, controlla scacchi, catture e attacchi ai pezzi non protetti. Inizia dalla risposta probabile sotto la tua mossa.",
  "coach.strategy.attack": "{0} mette {1} sotto attacco del tuo pezzo ({2}).",
  "coach.piece.theirsOnSquare": "il pezzo avversario ({0}) in {1}",
  "coach.strategy.undefended.singular":
    "Il tuo pezzo ({0}) è sotto attacco e senza difesa.",
  "coach.strategy.undefended.plural":
    "I tuoi pezzi ({0}) sono sotto attacco e senza difesa.",
  "coach.strategy.center": "I tuoi pezzi controllano {0} al centro.",
  "coach.strategy.line.checkmate":
    "{0} conclude questa linea con scacco matto.",
  "coach.strategy.line.capture":
    "L'anteprima termina con una cattura: {0} gioca {1}. Lo scambio può continuare.",
  "coach.strategy.material.gain.singular":
    "In questa possibile linea guadagneresti l'equivalente di {0} pedone di materiale.",
  "coach.strategy.material.gain.plural":
    "In questa possibile linea guadagneresti l'equivalente di {0} pedoni di materiale.",
  "coach.strategy.material.loss.singular":
    "In questa possibile linea cederesti l'equivalente di {0} pedone di materiale.",
  "coach.strategy.material.loss.plural":
    "In questa possibile linea cederesti l'equivalente di {0} pedoni di materiale.",
  "coach.strategy.material.even":
    "Il bilancio materiale resta invariato in questa linea.",
  "coach.strategy.change.check":
    "{0} mette il re sotto scacco. Risolvere lo scacco viene prima di tutto.",
  "coach.strategy.change.undefended":
    "{0} lascia il tuo pezzo ({1}) in {2} sotto attacco e senza difesa. Occupatene prima di continuare il piano.",
  "coach.strategy.change.capture":
    "Hanno appena catturato il tuo pezzo ({0}) con {1}. Guarda {2} prima di decidere come rispondere.",
  "coach.strategy.change.center":
    "{0} cambia il controllo avversario di {1}. Prova {2} e osserva le possibili risposte.",
  "coach.strategy.change.move":
    "Il pezzo avversario ({0}) è ora in {1}. Prova {2}{3}.",
  "coach.strategy.change.reply": "; una risposta da esaminare è {0}",
  "coach.strategy.change.respond": " e osserva la risposta",
  "coach.strategy.compare.forced": "Questa posizione ha una sola mossa legale.",
  "coach.strategy.compare.onlyRecommendation":
    "{0} è l'unica mossa consigliata. Le altre mosse analizzate concedono troppo al confronto.",
  "coach.strategy.compare.mate":
    "Qui le minacce di matto contano più di una piccola differenza di valutazione. Segui {0} e {1}, prestando attenzione agli scacchi.",
  "coach.strategy.compare.similar":
    "{0} e {1} sembrano entrambe buone. Segui le risposte e scegli la posizione che preferisci.",
  "coach.strategy.compare.stronger":
    "{0} sembra più forte di {1}. Segui entrambe le risposte per confrontare le posizioni.",
  "coach.continuation.previewReply": "Anteprima della risposta probabile: {0}",
  "coach.continuation.replyHeading": "RISPOSTA PROBABILE",
  "coach.continuation.label": "Continuazione del motore",
  "coach.continuation.heading": "POSSIBILI MOSSE SUCCESSIVE",
  "coach.continuation.previewMove": "Anteprima della mossa {0}: {1} gioca {2}",
  "engine.error.noLegalCandidates":
    "Il motore non ha restituito mosse legali. Riprova l'analisi.",
  "coach.position.heading": "Su questa posizione",
  "coach.position.changed": "COSA È CAMBIATO",
  "coach.position.hideSquares": "Nascondi caselle chiave",
  "coach.position.showSquares": "Evidenzia caselle chiave",
  "coach.position.squaresDescription":
    "I contorni verde acqua indicano le caselle descritte: {0}.",
  "coach.analysis.status.thinking": "Analisi in corso…",
  "coach.analysis.status.unavailable": "Motore non disponibile",
  "coach.analysis.status.ready": "Consigli pronti",
  "coach.analysis.reviewingPosition":
    "Revisione di {0}. L'analisi riguarda questa posizione.",
  "coach.analysis.errorHeading": "Riproviamo.",
  "coach.analysis.retry": "Riprova analisi",
  "coach.analysis.label": "Mossa migliore e strategia",
  "coach.analysis.search.heading": "RICERCA DELLA MOSSA",
  "coach.analysis.search.bestMove": "Ricerca della mossa migliore per {0}…",
  "coach.analysis.search.history":
    "Analisi delle tue opzioni e delle risposte da questa posizione precedente.",
  "coach.analysis.search.live":
    "Analisi delle tue opzioni e delle risposte avversarie. Puoi continuare a giocare.",
  "coach.analysis.search.depth": "Analisi più profonda · profondità {0}",
  "coach.analysis.search.estimate": "Di solito pronto in un paio di secondi",
  "coach.warnings.heading": "Fai attenzione a",
  "coach.warnings.description":
    "Passa il puntatore o usa il focus per evidenziare il pezzo minacciato e gli attaccanti.",
  "coach.best.escapeCheck": "Esci dallo scacco",
  "coach.best.heading": "MOSSA MIGLIORE",
  "coach.best.forced": "Unica mossa legale",
  "coach.best.continuity": "Il piano continua",
  "coach.best.play": "Gioca la mossa migliore {0}",
  "coach.best.hideReply": "Nascondi risposta",
  "coach.best.previewReply": "Anteprima risposta",
  "coach.best.explore": "Esplora le prossime mosse",
  "coach.review.error.failed":
    "Il motore non ha potuto valutare la mossa. Riprova.",
  "coach.review.error.comparison":
    "Il motore non ha potuto confrontare la mossa in modo affidabile. Riprova.",
  "coach.review.error.reply":
    "Il motore non ha potuto verificare la risposta. Riprova.",
  "coach.feedback.status.reviewing": "Revisione in corso…",
  "coach.feedback.status.unavailable": "Revisione non disponibile",
  "coach.feedback.label": "Valutazione della mossa",
  "coach.feedback.toggleDescription": "{0}: {1}. {2}. {3} dettagli",
  "common.show": "Mostra",
  "common.hide": "Nascondi",
  "coach.feedback.pending":
    "Esame della tua mossa e delle migliori alternative…",
  "coach.feedback.retry": "Riprova revisione",
  "coach.feedback.nextTime": "La prossima volta",
  "coach.feedback.likelyReply": "Risposta probabile",
  "coach.feedback.evaluationDescription":
    "La differenza di valutazione è espressa in pedoni. I giudizi considerano l'intera posizione; il matto non ha un valore in pedoni.",
  "coach.feedback.quickReview": "Revisione rapida",
  "coach.feedback.evaluationDrop": "{0} di calo nella valutazione",
  "coach.explanation.matingAttack.title": "Continua l'attacco di matto",
  "coach.explanation.matingAttack.text":
    "Secondo questa analisi, c'è matto in {0} mosse iniziando con {1}. Segui le risposte per capire l'attacco.",
  "coach.explanation.matingAttack.focus": "Vedi l'inizio dell'attacco di matto",
  "coach.explanation.mateDefense.title": "Trova la difesa più tenace",
  "coach.explanation.mateDefense.text":
    "Il re è in grave pericolo: l'analisi trova ancora un matto forzato dopo {0}. Segui gli scacchi avversari per capire il pericolo.",
  "coach.explanation.mateDefense.focus": "Vedi la mossa difensiva",
  "coach.reply.unavailable":
    "L'anteprima non include una risposta. Prova la mossa per esplorare il seguito.",
  "coach.reply.continuation": " Potresti continuare con {0}: {1}.",
  "coach.reply.terminal.checkmate": "È scacco matto. Non hanno risposte.",
  "coach.reply.terminal.draw": "Questa mossa conclude la partita in patta.",
  "coach.estimate.mate": "Matto forzato per {0}",
  "coach.estimate.balanced": "Posizione equilibrata",
  "coach.estimate.smallEdge": "{0} ha un leggero vantaggio",
  "coach.estimate.advantage": "{0} ha il vantaggio",
  "coach.estimate.winning": "{0} ha un vantaggio decisivo",
  "coach.status.checkmate": "Scacco matto",
  "coach.status.draw": "Patta",
  "coach.status.previewCheck": "Anteprima · Scacco",
  "coach.status.preview": "Anteprima",
  "coach.status.check": "Scacco",
  "coach.status.paused": "In pausa",
  "coach.status.replying": "Risposta in arrivo…",
  "coach.status.thinking": "Riflessione…",
  "coach.status.reviewing": "Revisione",
  "coach.status.yourTurn": "Tocca a te",
  "coach.panel.label": "Analisi della posizione",
  "coach.panel.heading": "Il tuo allenatore",
  "coach.turn.label": "Tratto a",
  "coach.turn.select": "Chi gioca adesso",
  "coach.turn.changeDescription":
    "Cambiare il turno avvia una nuova posizione e cancella la cronologia.",
  "coach.panel.backToBoard": "Torna alla scacchiera ↑",
  "coach.calculate.label.waiting": "In attesa del computer",
  "coach.calculate.label.thinking": "Calcolo delle migliori mosse",
  "coach.calculate.label.ready": "Calcola le migliori mosse",
  "coach.calculate.text.waiting": "In attesa del computer…",
  "coach.calculate.text.thinking": "Calcolo in corso…",
  "common.dismissError": "Chiudi errore",
  "game.history.controls": "Controlli della cronologia",
  "game.history.backToLatest": "Torna all'ultima",
  "coach.context.preview": "Anteprima · {0}",
  "coach.context.reviewingUpdating":
    "Revisione di {0} · Aggiornamento dell'analisi",
  "coach.context.reviewingReady":
    "Revisione di {0} · L'analisi riguarda questa posizione",
  "coach.context.reviewingIdle":
    "Revisione di {0} · Analizza quando vuoi un consiglio",
  "computer.status.movingSoon": "Il computer muoverà tra poco…",
  "computer.status.choosingReply": "Il computer sta scegliendo una risposta…",
  "coach.context.updating":
    "Aggiornamento dell'analisi di {0} · Puoi continuare a giocare",
  "coach.panel.returnToGame": "Torna alla partita",
  "computer.status.invalidPosition":
    "Prepara una posizione legale con entrambi i re per giocare contro il computer.",
  "computer.status.gameEnded": "La partita è terminata. Iniziane una nuova.",
  "computer.status.preview": "Torna alla partita per continuare a giocare.",
  "computer.status.enable":
    "Attiva «Gioca contro il computer» per affrontare {0}.",
  "computer.status.settings": "Partita in pausa mentre scegli le impostazioni.",
  "computer.error.move":
    "Il computer non ha potuto scegliere una mossa. Riprova.",
  "computer.status.thinking": "Il computer sta pensando…",
  "computer.status.yourTurn": "Tocca a te. Gioca una mossa sulla scacchiera.",
  "computer.error.saveDifficulty":
    "Impossibile salvare il livello del computer in questo browser.",
  "computer.toggle.label": "Gioca contro il computer",
  "computer.toggle.text": "Computer",
  "computer.settings.heading": "Impostazioni del computer",
  "computer.retry": "Riprova computer",
  "computer.settings.close": "Chiudi impostazioni del computer",
  "computer.settings.side": "Il tuo lato",
  "computer.settings.difficulty": "La tua sfida",
  "common.retry": "Riprova",
  "common.done": "Fatto",
  "game.history.startingPosition": "Posizione iniziale",
  "game.save.error.unavailable":
    "Lo spazio del browser è pieno o non disponibile. Le ultime modifiche potrebbero andare perse ricaricando.",
  "game.save.error.backup":
    "Impossibile creare una copia del salvataggio originale. Il salvataggio automatico resta in pausa. Le ultime modifiche potrebbero andare perse ricaricando.",
  "game.status.continuing": "Continuazione dalla posizione selezionata.",
  "game.result.label": "Risultato della partita",
  "game.result.checkmate": "SCACCO MATTO",
  "game.result.draw": "PATTA",
  "game.result.drawHeading": "Onori condivisi.",
  "game.result.checkmateMessage": "Un finale regale. Un'altra partita?",
  "game.result.drawMessage": "Bella partita. C'è sempre un'altra occasione.",
  "game.result.score": "Risultato finale: Bianco {0}, Nero {1}",
  "game.result.playAgain": "Gioca ancora",
  "game.promotion.label": "Scegli un pezzo per la promozione",
  "game.promotion.cancel": "Annulla promozione",
  "game.promotion.heading": "Il pedone è arrivato.",
  "game.promotion.description": "Scegli il suo prossimo capitolo.",
  "game.promotion.choose": "Promuovi a {0}",
  "game.save.label": "Stato del salvataggio",
  "game.save.recoveryHeading": "La partita salvata richiede un recupero",
  "game.save.unavailableHeading": "Salvataggio non disponibile",
  "game.save.backupHeading": "Salvataggio originale conservato",
  "game.save.backupDescription":
    "I dati originali sono conservati in una copia di recupero separata nel browser. Il salvataggio automatico è ripreso.",
  "game.save.resume": "Mantieni partita e riprendi salvataggio",
  "game.save.dismiss": "Chiudi avviso di recupero",
  "position.error.invalidInput": "Questo FEN non è valido.",
  "position.error.clipboard":
    "Gli appunti non sono disponibili. Seleziona il testo FEN e copialo manualmente.",
  "position.controls.label": "Controlli della posizione FEN",
  "position.controls.heading": "Posizione FEN",
  "position.controls.input": "Incolla una posizione FEN",
  "position.controls.copy": "Copia FEN attuale",
  "position.controls.load": "Carica",
  "game.save.error.readStorage":
    "Impossibile leggere lo spazio del browser. La partita salvata potrebbe non essere disponibile.",
  "game.save.error.restoredPosition":
    "Impossibile leggere la partita salvata. È stata ripristinata l'ultima posizione valida, senza cronologia. Il salvataggio automatico è in pausa per proteggere i dati originali.",
  "game.save.error.freshBoard":
    "Impossibile leggere la partita salvata. È stata aperta una nuova scacchiera. Il salvataggio automatico è in pausa per proteggere i dati originali.",
  "game.save.error.verifyBackup":
    "Impossibile verificare la copia di recupero.",
  "game.history.label": "Mosse della partita",
  "game.history.heading": "Cronologia delle mosse",
  "game.history.viewStart": "Vedi posizione iniziale",
  "game.history.start": "Inizio",
  "game.history.viewMove": "Vedi posizione dopo {0}",
  "chess.piece.pawn": "pedone",
  "chess.piece.knight": "cavallo",
  "chess.piece.bishop": "alfiere",
  "chess.piece.rook": "torre",
  "chess.piece.queen": "donna",
  "chess.piece.king": "re",
  "computer.level.beginner": "Principiante",
  "computer.level.easy": "Facile",
  "computer.level.medium": "Medio",
  "computer.level.hard": "Difficile",
  "computer.level.expert": "Esperto",
  "coach.grade.best": "Mossa migliore",
  "coach.grade.good": "Buona mossa",
  "coach.grade.inaccuracy": "Imprecisione",
  "coach.grade.mistake": "Errore",
  "coach.grade.blunder": "Grave errore",
  "coach.feedback.context.yourLastMove": "La tua ultima mossa",
  "coach.feedback.context.selectedMove": "Mossa selezionata",
  "page.title": "Tempo — La tua prossima mossa, spiegata.",
  "position.fen.fields": "deve contenere sei campi separati da spazi",
  "position.fen.moveNumber":
    "il numero della mossa deve essere un intero positivo",
  "position.fen.halfMoveCounter":
    "il contatore delle semimosse deve essere un intero non negativo",
  "position.fen.enPassantSquare": "la casella en passant non è valida",
  "position.fen.castlingRights": "i diritti di arrocco non sono validi",
  "position.fen.sideToMove": "il lato al tratto non è valido",
  "position.fen.rows":
    "i dati dei pezzi devono contenere 8 traverse separate da «/»",
  "position.fen.consecutiveNumbers":
    "dati dei pezzi non validi: numeri consecutivi",
  "position.fen.invalidPiece": "dati dei pezzi non validi: pezzo sconosciuto",
  "position.fen.rankSize":
    "dati dei pezzi non validi: troppe caselle in una traversa",
  "position.fen.illegalEnPassant": "casella en passant illegale",
  "position.fen.pawnOnEdge":
    "ci sono pedoni sulla prima o sull'ultima traversa",
  "coach.feedback.context.lastMove": "Ultima mossa",
  "position.notice.loaded": "Posizione caricata",
  "position.notice.copied": "Posizione copiata",
  "position.fen.emptySquares": "usa 1–8 per le caselle vuote",
  "game.result.winner": "{0} vince!",
  "board.tray.label": "Pezzi di {0}",
  "coach.alternatives.description": "Alternativa: {0}. {1}. {2}",
} satisfies Catalog;
