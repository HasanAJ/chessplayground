import type { Catalog } from "./en";

export default {
  "The chess engine could not load. Check your connection and retry analysis.":
    "Impossibile caricare il motore. Controlla la connessione e riprova l'analisi.",
  "The engine took too long to load. Try analyzing the position again.":
    "Il motore ha impiegato troppo tempo a caricarsi. Analizza di nuovo la posizione.",
  "The chess engine could not start. Try refreshing the page or using a browser with WebAssembly support.":
    "Impossibile avviare il motore. Ricarica la pagina o usa un browser che supporti WebAssembly.",
  "The engine took too long to respond. Try analyzing the position again.":
    "Il motore ha impiegato troppo tempo a rispondere. Analizza di nuovo la posizione.",
  "No complete analysis was returned. Try this position again.":
    "Nessuna analisi completa ricevuta. Riprova questa posizione.",
  Language: "Lingua",
  "Invalid FEN: {0}": "FEN non valido: {0}",
  "{0} can have at most 8 pawns. Remove one before adding another.":
    "{0}: massimo 8 pedoni. Rimuovine uno prima di aggiungerne un altro.",
  "{0} can have at most 16 pieces. Remove one before adding another.":
    "{0}: massimo 16 pezzi. Rimuovine uno prima di aggiungerne un altro.",
  "Add the {0} king to play or calculate.":
    "Aggiungi il re di {0} per giocare o analizzare.",
  "The {0} king is in check, but it is {1}'s turn. Change whose turn it is or move the king to safety.":
    "Il re di {0} è sotto scacco, ma tocca a {1}. Cambia il turno o metti il re al sicuro.",
  "Castling right {0} needs the {1} king and rook on their original squares.":
    "Il diritto di arrocco {0} richiede re e torre di {1} sulle caselle iniziali.",
  "Missing {0} king.": "Manca il re di {0}.",
  "Too many {0} kings.": "Troppi re per {0}.",
  White: "Bianco",
  Black: "Nero",
  "Tempo home": "Pagina iniziale di Tempo",
  "Your chess playground": "Il tuo spazio per gli scacchi",
  "Your next move,": "La tua prossima mossa,",
  "explained.": "spiegata.",
  "Explore the board. Understand the plan. Try a move.":
    "Esplora la scacchiera. Comprendi il piano. Prova una mossa.",
  "Click a piece and its destination to play a move, or drag pieces from the trays to build your own position.":
    "Fai clic su un pezzo e sulla casella di destinazione per giocare una mossa, oppure trascina i pezzi dai vassoi per creare la tua posizione.",
  "Select “{0}” for suggestions and explanations, then preview a reply or try a move.":
    "Seleziona «{0}» per vedere suggerimenti e spiegazioni, poi visualizza una risposta in anteprima o prova una mossa.",
  "Play both sides, or turn on the computer opponent to practice against it.":
    "Gioca con entrambi i colori oppure attiva l’avversario controllato dal computer per allenarti.",
  "A good move starts with a little understanding.":
    "Una buona mossa inizia con un po' di comprensione.",
  "Powered by Stockfish 19": "Con Stockfish 19",
  "{0}{1} from {2} to {3}": "{0}{1} da {2} a {3}",
  "Castle: king {0} to {1}, rook {2}": "Arrocco: re da {0} a {1}, torre {2}",
  "h{0} to f{1}": "da h{0} a f{1}",
  "a{0} to d{1}": "da a{0} a d{1}",
  ", taking the {0}{1}": ", catturando {0}{1}",
  " on {0} en passant": " in {0} en passant",
  ", promoting to a {0}": ", promuovendo a {0}",
  " — checkmate": " — scacco matto",
  " — check": " — scacco",
  "Add both kings to play or calculate.":
    "Aggiungi entrambi i re per giocare o analizzare.",
  "Move pawns off the first and last ranks to play or calculate.":
    "Sposta i pedoni dalla prima e dall'ultima traversa per giocare o analizzare.",
  "Arrange a legal position to play or calculate.":
    "Prepara una posizione legale per giocare o analizzare.",
  "This position is not valid.": "Questa posizione non è valida.",
  "The FEN’s move counters must be whole numbers within the supported range.":
    "I contatori delle mosse nel FEN devono essere numeri interi nell'intervallo supportato.",
  "Castling availability must list each right (KQkq) once, or use “-” for none.":
    "Ogni diritto di arrocco (KQkq) va indicato una sola volta, oppure usa «-» per nessuno.",
  "Invalid FEN: piece data must use 1–8 for empty squares.":
    "FEN non valido: usa 1–8 per le caselle vuote.",
  "An en passant target needs a zero half-move counter because the last move was a pawn move.":
    "Una casella en passant richiede un contatore delle semimosse a zero, perché l'ultima mossa era di pedone.",
  "The en passant square needs an opposing pawn that has just advanced two squares. Check the FEN’s fourth field.":
    "La casella en passant richiede un pedone avversario appena avanzato di due caselle. Controlla il quarto campo del FEN.",
  "{0} wins by checkmate.": "{0} vince per scacco matto.",
  "Stalemate. There are no legal moves, and the king is safe.":
    "Stallo. Non ci sono mosse legali e il re non è sotto scacco.",
  "Draw by threefold repetition.": "Patta per triplice ripetizione.",
  "Draw. Neither side has enough material to checkmate.":
    "Patta. Nessun lato ha materiale sufficiente per dare matto.",
  "Draw by the fifty-move rule.": "Patta per la regola delle cinquanta mosse.",
  "Chess board and position controls": "Scacchiera e controlli della posizione",
  "Start a new game from the standard chess position":
    "Inizia una partita dalla posizione iniziale",
  "New game": "Nuova partita",
  "Clear board": "Svuota scacchiera",
  "Game move navigation": "Navigazione delle mosse",
  "Previous game move": "Mossa precedente",
  "Next game move": "Mossa successiva",
  "Flip board": "Ruota scacchiera",
  "See your coach": "Vai all'allenatore",
  "{0} {1}": "{1} · {0}",
  "Calculate best moves to see the evaluation":
    "Calcola le migliori mosse per vedere la valutazione",
  "Evaluation paused during board preview":
    "Valutazione sospesa durante l'anteprima",
  "+ = White ahead · − = Black ahead":
    "+ = vantaggio del Bianco · − = vantaggio del Nero",
  "White evaluation {0}": "Valutazione per il Bianco: {0}",
  "Evaluation pending": "Valutazione in attesa",
  "Move preview chessboard": "Scacchiera di anteprima",
  "Game history chessboard": "Scacchiera della cronologia",
  "Interactive chessboard": "Scacchiera interattiva",
  " empty": " vuota",
  " in check": " sotto scacco",
  "Place {0} {1}": "Posiziona: {1} · {0}",
  "Add {0} {1} · Click or drag to board":
    "Aggiungi: {1} · {0} · Clicca o trascina sulla scacchiera",
  "Other good options": "Altre buone opzioni",
  "Position estimate in pawn units: + favors White, − favors Black.":
    "Stima in pedoni: + favorisce il Bianco, − il Nero.",
  "Play {0}": "Gioca {0}",
  "Before moving, check whether their pieces can reach your king on {0}. Here, {1} ends the game.":
    "Prima di muovere, controlla se i pezzi avversari possono raggiungere il tuo re in {0}. Qui, {1} conclude la partita.",
  "See their checkmate threat": "Vedi la minaccia di matto",
  "leaves your {0} on {1} with no defender. Their {2} can take it with {3}":
    "lascia il tuo pezzo ({0}) in {1} senza difesa. Il pezzo avversario ({2}) può catturarlo con {3}",
  "allows their {0} to take your {1} on {2} with {3}. Your piece has a defender, so follow the rest of the trade":
    "permette al pezzo avversario ({0}) di catturare il tuo pezzo ({1}) in {2} con {3}. Ha un difensore: segui il resto dello scambio",
  "Before moving, check which of your pieces they can capture and whether you can capture back.":
    "Prima di muovere, controlla quali tuoi pezzi possono essere catturati e se puoi ricatturare.",
  "Before accepting a trade, compare the pieces both sides can capture, including the next reply.":
    "Prima di accettare uno scambio, confronta le catture di entrambi i lati, inclusa la risposta successiva.",
  "See the piece they can capture": "Vedi il pezzo che possono catturare",
  "allows the shown line to reach {0}, where their {1} takes your {2} on {3}. Further trades may follow":
    "permette di arrivare a {0} nella linea mostrata, dove il pezzo avversario ({1}) cattura il tuo pezzo ({2}) in {3}. Possono seguire altri scambi",
  "Follow their checks as well as their captures. A check may force you to respond before you can protect another piece.":
    "Segui gli scacchi oltre alle catture. Uno scacco può costringerti a rispondere prima di proteggere un altro pezzo.",
  "Look beyond their first reply: follow the next captures too before deciding whether a trade helps you.":
    "Guarda oltre la prima risposta: segui anche le catture successive prima di valutare lo scambio.",
  "See the later capture in this line":
    "Vedi la cattura successiva nella linea",
  "your {0} on {1}": "il tuo pezzo ({0}) in {1}",
  " and ": " e ",
  "allows a fork: their {0} on {1} attacks {2} at once":
    "permette una forchetta: il pezzo avversario ({0}) in {1} attacca {2} contemporaneamente",
  "Look for replies that attack two pieces at once. Moving or protecting one may leave the other under attack.":
    "Cerca risposte che attaccano due pezzi insieme. Muoverne o proteggerne uno può lasciare l'altro sotto attacco.",
  "See the two attacks": "Vedi i due attacchi",
  "Compare the capture on {0} with {1}. Preview their reply before deciding whether the capture helps.":
    "Confronta la cattura in {0} con {1}. Guarda la risposta prima di decidere se catturare ti aiuta.",
  "Check which of your pieces need protection. {0} offers another way to defend your position.":
    "Controlla quali pezzi hanno bisogno di protezione. {0} offre un altro modo di difendere la posizione.",
  "Check whether a piece is under attack before starting another plan. {0} moves a piece out of danger.":
    "Controlla se un pezzo è sotto attacco prima di iniziare un altro piano. {0} lo allontana dal pericolo.",
  "Check their checks, captures, and attacks before choosing your move. Preview {0} to compare the alternative.":
    "Controlla scacchi, catture e attacchi avversari prima di scegliere. Guarda {0} per confrontare l'alternativa.",
  "The move needs analysis of the resulting position.":
    "La mossa richiede l'analisi della posizione risultante.",
  "{0} delivers checkmate. Their king has no way out—you’ve finished the game.":
    "{0} dà scacco matto. Il re avversario non ha scampo: hai concluso la partita.",
  "{0} is the top choice here. {1}": "{0} è la scelta migliore qui. {1}",
  "gets you a draw, close to the best result found here":
    "ottiene una patta, vicina al miglior risultato trovato",
  "keeps your checkmate on track in the analyzed line":
    "mantiene il matto nella linea analizzata",
  "holds up about as well as the best defense found here, though the analysis still finds mate against you":
    "resiste quasi quanto la miglior difesa trovata, anche se l'analisi vede ancora un matto contro di te",
  "keeps your strong advantage. You’re still in a great position":
    "mantiene il tuo forte vantaggio. La posizione resta ottima",
  "holds up about as well as the best option in an already tough position":
    "resiste quasi quanto la migliore opzione in una posizione già difficile",
  "looks good here, with chances close to {0}":
    "sembra buona qui, con possibilità vicine a {0}",
  "leads to a draw. {0} offered better chances":
    "porta alla patta. {0} offriva migliori possibilità",
  "allows a forced checkmate in the analyzed line":
    "permette un matto forzato nella linea analizzata",
  "lets a forced checkmate slip away": "lascia sfuggire un matto forzato",
  "gives your opponent better chances than {0} would":
    "offre all'avversario più possibilità rispetto a {0}",
  "Try the other move to see what you could keep playing for.":
    "Prova l'altra mossa per vedere per cosa potresti continuare a giocare.",
  "Play through the reply to see what they could do next.":
    "Segui la risposta per vedere cosa potrebbero fare dopo.",
  "Build pressure on {0}": "Aumenta la pressione su {0}",
  "Your {0} joins another piece in attacking their {1} on {2}. They now have more than one attacker to deal with.":
    "Il tuo pezzo ({0}) si unisce a un altro per attaccare il pezzo avversario ({1}) in {2}. Ora devono gestire più di un attaccante.",
  "See the attack on their {0}": "Vedi l'attacco al pezzo avversario ({0})",
  "Support your center": "Sostieni il centro",
  "Defend your {0}": "Difendi il tuo pezzo ({0})",
  "Your {0} on {1} now defends the {2} on {3}. If they capture it, your {4} may be able to capture back; check the reply before trading.":
    "Il tuo pezzo ({0}) in {1} ora difende il pezzo ({2}) in {3}. Se viene catturato, il tuo pezzo ({4}) potrebbe ricatturare: controlla la risposta prima dello scambio.",
  "See the defense of your {0}": "Vedi la difesa del tuo pezzo ({0})",
  "Move your {0} out of danger": "Allontana il tuo pezzo ({0}) dal pericolo",
  "Your {0} was under attack on {1}. On {2}, none of their pieces currently attack it.":
    "Il tuo pezzo ({0}) era sotto attacco in {1}. In {2}, nessun pezzo avversario lo attacca al momento.",
  "See your {0} move out of danger":
    "Vedi il tuo pezzo ({0}) uscire dal pericolo",
  "Attack the {0}": "Attacca il pezzo avversario ({0})",
  "Your {0} on {1} attacks their {2} on {3}. Watch for a retreat, a defense, or a threat of their own.":
    "Il tuo pezzo ({0}) in {1} attacca il pezzo avversario ({2}) in {3}. Attenzione a una ritirata, una difesa o una minaccia avversaria.",
  "Your {0} on {1} now attacks their {2} on {3}. They may move it or defend it, so look at the reply before counting on a capture.":
    "Il tuo pezzo ({0}) in {1} ora attacca il pezzo avversario ({2}) in {3}. Potrebbero spostarlo o difenderlo: guarda la risposta prima di contare sulla cattura.",
  "{0} on {1}": "{0} in {1}",
  "Your {0} give check.": "I tuoi pezzi ({0}) danno scacco.",
  "Your {0} gives check.": "Il tuo pezzo ({0}) dà scacco.",
  "Your pawn promotes to a {0} on {1}. ":
    "Il tuo pedone promuove a {0} in {1}. ",
  "Finish with checkmate": "Concludi con scacco matto",
  "{0}Your {1} deliver checkmate. Their king has no way out.":
    "{0}I tuoi pezzi ({1}) danno scacco matto. Il re avversario non ha scampo.",
  "{0}Your {1} delivers checkmate. Their king has no way out.":
    "{0}Il tuo pezzo ({1}) dà scacco matto. Il re avversario non ha scampo.",
  "See the checkmate": "Vedi lo scacco matto",
  "Promote your pawn": "Promuovi il pedone",
  "You now have a {0} in place of that pawn. Look at the reply to see how they respond.":
    "Ora hai un pezzo ({0}) al posto del pedone. Guarda la risposta avversaria.",
  "See the promotion": "Vedi la promozione",
  "Castle and bring your rook into play": "Arrocca e attiva la torre",
  "Castling moves your king away from the center and brings your rook toward the middle.{0}":
    "L'arrocco allontana il re dal centro e avvicina la torre al centro.{0}",
  "See the king and rook move": "Vedi il movimento di re e torre",
  "Get your king out of check": "Sottrai il re allo scacco",
  "{0} gets you out of check{1}.{2}": "{0} risolve lo scacco{1}.{2}",
  " and takes the {0} on {1}": " e cattura il pezzo avversario ({0}) in {1}",
  " by blocking the attack with your {0}":
    " bloccando l'attacco con il tuo pezzo ({0})",
  " by moving your king to {0}": " spostando il re in {0}",
  " Your king is no longer under attack, so you can continue playing.":
    " Il re non è più sotto attacco e puoi continuare a giocare.",
  "See how you escape check": "Vedi come risolvere lo scacco",
  "Capture with check": "Cattura con scacco",
  "Capture the {0}": "Cattura il pezzo avversario ({0})",
  "Your {0} takes the {1} on {2}{3}. {4}":
    "Il tuo pezzo ({0}) cattura il pezzo avversario ({1}) in {2}{3}. {4}",
  " en passant, landing on ": " en passant, arrivando in ",
  "Their pieces attack your {0} on {1}; preview the reply to check whether they capture back.":
    "I pezzi avversari attaccano il tuo pezzo ({0}) in {1}: guarda la risposta per verificare se ricatturano.",
  "None of their pieces currently attack your {0} on {1}.":
    "Nessun pezzo avversario attacca al momento il tuo pezzo ({0}) in {1}.",
  "See the capture and possible attackers":
    "Vedi la cattura e i possibili attaccanti",
  "Give check": "Dai scacco",
  "{0} Your opponent has to deal with the attack on their king.":
    "{0} L'avversario deve rispondere all'attacco al re.",
  "See the attack on their king": "Vedi l'attacco al re avversario",
  "From here, it attacks {0}, helping you control the center.":
    "Da qui attacca {0}, aiutandoti a controllare il centro.",
  "Bringing pieces off the starting row gives you more pieces to use in your next moves.":
    "Sviluppare i pezzi dalla traversa iniziale ti dà più pezzi da usare nelle prossime mosse.",
  "Bring another piece into play": "Sviluppa un altro pezzo",
  "Your {0} comes off the back rank to {1}. {2}":
    "Il tuo pezzo ({0}) lascia la traversa iniziale per {1}. {2}",
  "See your piece and the center squares":
    "Vedi il pezzo e le caselle centrali",
  "Claim the center": "Occupa il centro",
  "Your pawn takes space in the center on {0}. It attacks {1}, helping limit where their pieces can move safely.":
    "Il pedone guadagna spazio al centro in {0}. Attacca {1}, limitando le caselle sicure per i pezzi avversari.",
  "See the pawn’s control of the center":
    "Vedi il controllo centrale del pedone",
  "Put your rook on an open file": "Porta la torre su una colonna aperta",
  "There are no pawns on the {0}-file, the column your rook moves to. With no pawns in that column, look for squares your rook can reach before another piece blocks its path.":
    "Non ci sono pedoni sulla colonna {0}, dove si sposta la torre. Cerca le caselle raggiungibili prima che un altro pezzo blocchi il percorso.",
  "See the open file": "Vedi la colonna aperta",
  "Improve your rook’s position": "Migliora la posizione della torre",
  "Try your rook on {0}. Play through the reply below to see which lines and targets it can work with.":
    "Prova la torre in {0}. Segui la risposta per vedere quali linee e obiettivi può sfruttare.",
  "See your rook’s move": "Vedi la mossa della torre",
  "Improve your king’s position": "Migliora la posizione del re",
  "Your king steps from {0} to {1}. Check what their pieces can do before choosing its next square.":
    "Il re passa da {0} a {1}. Controlla cosa possono fare i pezzi avversari prima di scegliere la casella successiva.",
  "See your king’s move": "Vedi la mossa del re",
  "Gain space with your pawn": "Guadagna spazio con il pedone",
  "Your pawn moves up to {0}, claiming more space. Keep an eye on the squares it leaves behind.":
    "Il pedone avanza in {0}, guadagnando spazio. Tieni d'occhio le caselle che lascia dietro di sé.",
  "See your pawn’s advance": "Vedi l'avanzata del pedone",
  "Improve a piece near the center": "Migliora un pezzo vicino al centro",
  "Your {0} moves to {1}, near the center. {2}":
    "Il tuo pezzo ({0}) si sposta in {1}, vicino al centro. {2}",
  "Preview the reply to see how they can respond before choosing its next move.":
    "Guarda la risposta avversaria prima di scegliere la prossima mossa del pezzo.",
  "See the move near the center": "Vedi la mossa vicino al centro",
  "Reposition your {0}": "Riposiziona il tuo pezzo ({0})",
  "Try your {0} on {1}. Play through the next few moves to see how your opponent can respond and where your pieces end up.":
    "Prova il tuo pezzo ({0}) in {1}. Segui le prossime mosse per vedere le risposte avversarie e dove finiranno i pezzi.",
  "See your {0}’s move": "Vedi la mossa del tuo pezzo ({0})",
  "They can checkmate with {0} ({1} to {2}).":
    "Possono dare matto con {0} ({1} in {2}).",
  "castle {0}": "arroccare {0}",
  kingside: "corto",
  queenside: "lungo",
  "take your {0} on {1}{2} with their {3}":
    "catturare il tuo pezzo ({0}) in {1}{2} con il loro pezzo ({3})",
  " en passant": " en passant",
  "move their {0} to {1}": "spostare il loro pezzo ({0}) in {1}",
  " and promote to a {0}": " e promuovere a {0}",
  " and give check": " e dare scacco",
  "They may {0}{1}{2} ({3}).": "Possono {0}{1}{2} ({3}).",
  "Deal with the check first. Look for a king move, a way to take the attacker, or a piece that can block the attack.":
    "Rispondi prima allo scacco. Cerca una mossa di re, una cattura dell'attaccante o un pezzo che blocchi l'attacco.",
  "Your {0} on {1} is under attack with no defender. Can you move it, protect it, or make a threat they have to answer first?":
    "Il tuo pezzo ({0}) in {1} è sotto attacco e senza difesa. Puoi spostarlo, proteggerlo o creare una minaccia a cui debbano rispondere prima?",
  "Your {0} on {1} is under attack. It has a defender, but play out the trade before leaving it there.":
    "Il tuo pezzo ({0}) in {1} è sotto attacco. Ha un difensore, ma segui lo scambio prima di lasciarlo lì.",
  "Before you move, take a quick look at their checks, captures, and attacks on unprotected pieces. Start with the likely reply below your move.":
    "Prima di muovere, controlla scacchi, catture e attacchi ai pezzi non protetti. Inizia dalla risposta probabile sotto la tua mossa.",
  "{0} puts {1} under attack from your {2}.":
    "{0} mette {1} sotto attacco del tuo pezzo ({2}).",
  "their {0} on {1}": "il pezzo avversario ({0}) in {1}",
  "Your {0} is under attack with no defender.":
    "Il tuo pezzo ({0}) è sotto attacco e senza difesa.",
  "Your {0} are under attack with no defender.":
    "I tuoi pezzi ({0}) sono sotto attacco e senza difesa.",
  "Your pieces cover {0} in the center.":
    "I tuoi pezzi controllano {0} al centro.",
  "{0} finishes this line with checkmate.":
    "{0} conclude questa linea con scacco matto.",
  "The preview ends with {0} playing {1}, a capture. The exchange may continue.":
    "L'anteprima termina con una cattura: {0} gioca {1}. Lo scambio può continuare.",
  "In this possible line, you’d gain the equivalent of {0} pawn in material.":
    "In questa possibile linea guadagneresti l'equivalente di {0} pedone di materiale.",
  "In this possible line, you’d gain the equivalent of {0} pawns in material.":
    "In questa possibile linea guadagneresti l'equivalente di {0} pedoni di materiale.",
  "In this possible line, you’d give up the equivalent of {0} pawn in material.":
    "In questa possibile linea cederesti l'equivalente di {0} pedone di materiale.",
  "In this possible line, you’d give up the equivalent of {0} pawns in material.":
    "In questa possibile linea cederesti l'equivalente di {0} pedoni di materiale.",
  "The material balance stays the same in this line.":
    "Il bilancio materiale resta invariato in questa linea.",
  "{0} puts your king in check. Getting out of check comes first.":
    "{0} mette il re sotto scacco. Risolvere lo scacco viene prima di tutto.",
  "{0} leaves your {1} on {2} under attack with no defender. Take care of it before carrying on with your plan.":
    "{0} lascia il tuo pezzo ({1}) in {2} sotto attacco e senza difesa. Occupatene prima di continuare il piano.",
  "They’ve just taken your {0} with {1}. Look at {2} before deciding how to answer.":
    "Hanno appena catturato il tuo pezzo ({0}) con {1}. Guarda {2} prima di decidere come rispondere.",
  "{0} changes their control of {1}. Try {2} now, and see how they might respond.":
    "{0} cambia il controllo avversario di {1}. Prova {2} e osserva le possibili risposte.",
  "Their {0} is now on {1}. Try {2}{3}.":
    "Il pezzo avversario ({0}) è ora in {1}. Prova {2}{3}.",
  "; one reply to look at is {0}": "; una risposta da esaminare è {0}",
  " and see how they respond": " e osserva la risposta",
  "This position has only one legal move.":
    "Questa posizione ha una sola mossa legale.",
  "{0} is the only recommended move here. The other moves checked give up too much compared with it.":
    "{0} è l'unica mossa consigliata. Le altre mosse analizzate concedono troppo al confronto.",
  "Here, checkmate threats matter more than a small difference in score. Play through {0} and {1}, and follow the checks carefully.":
    "Qui le minacce di matto contano più di una piccola differenza di valutazione. Segui {0} e {1}, prestando attenzione agli scacchi.",
  "{0} and {1} both look good here. Play through their replies and choose the position you’d rather have.":
    "{0} e {1} sembrano entrambe buone. Segui le risposte e scegli la posizione che preferisci.",
  "{0} looks stronger than {1} here. Play through both replies to see how the positions differ.":
    "{0} sembra più forte di {1}. Segui entrambe le risposte per confrontare le posizioni.",
  "Preview likely reply: {0}": "Anteprima della risposta probabile: {0}",
  "LIKELY REPLY": "RISPOSTA PROBABILE",
  "Engine continuation": "Continuazione del motore",
  "POSSIBLE NEXT MOVES": "POSSIBILI MOSSE SUCCESSIVE",
  "Preview move {0}: {1} plays {2}": "Anteprima della mossa {0}: {1} gioca {2}",
  "The engine returned no legal candidates. Please retry analysis.":
    "Il motore non ha restituito mosse legali. Riprova l'analisi.",
  "About this position": "Su questa posizione",
  "WHAT CHANGED": "COSA È CAMBIATO",
  "Hide key squares": "Nascondi caselle chiave",
  "Highlight key squares": "Evidenzia caselle chiave",
  "Teal outlines mark the squares discussed above: {0}.":
    "I contorni verde acqua indicano le caselle descritte: {0}.",
  "Analyzing…": "Analisi in corso…",
  "Engine unavailable": "Motore non disponibile",
  "Recommendations ready": "Consigli pronti",
  "Reviewing {0}. Analysis is for this position.":
    "Revisione di {0}. L'analisi riguarda questa posizione.",
  "Let’s try that again.": "Riproviamo.",
  "Retry analysis": "Riprova analisi",
  "Best move and strategy": "Mossa migliore e strategia",
  "FINDING YOUR MOVE": "RICERCA DELLA MOSSA",
  "Finding {0}’s best move…": "Ricerca della mossa migliore per {0}…",
  "Looking at your options and their replies from this earlier position.":
    "Analisi delle tue opzioni e delle risposte da questa posizione precedente.",
  "Checking your options and your opponent’s replies. Feel free to keep playing.":
    "Analisi delle tue opzioni e delle risposte avversarie. Puoi continuare a giocare.",
  "Checking deeper · depth {0}": "Analisi più profonda · profondità {0}",
  "Usually ready in a couple of seconds":
    "Di solito pronto in un paio di secondi",
  "Watch out for": "Fai attenzione a",
  "Hover or focus to highlight the threatened piece and its attackers.":
    "Passa il puntatore o usa il focus per evidenziare il pezzo minacciato e gli attaccanti.",
  "Escape check": "Esci dallo scacco",
  "BEST MOVE": "MOSSA MIGLIORE",
  "Only legal move": "Unica mossa legale",
  "Plan continues": "Il piano continua",
  "Play best move {0}": "Gioca la mossa migliore {0}",
  "Hide reply": "Nascondi risposta",
  "Preview reply": "Anteprima risposta",
  "Explore next moves": "Esplora le prossime mosse",
  "The engine could not review this move. Try again.":
    "Il motore non ha potuto valutare la mossa. Riprova.",
  "The engine could not reliably compare this move. Try again.":
    "Il motore non ha potuto confrontare la mossa in modo affidabile. Riprova.",
  "The engine could not check the reply. Try again.":
    "Il motore non ha potuto verificare la risposta. Riprova.",
  "Reviewing…": "Revisione in corso…",
  "Review unavailable": "Revisione non disponibile",
  "Move feedback": "Valutazione della mossa",
  "{0}: {1}. {2}. {3} details": "{0}: {1}. {2}. {3} dettagli",
  Show: "Mostra",
  Hide: "Nascondi",
  "Looking at your move and the best alternatives…":
    "Esame della tua mossa e delle migliori alternative…",
  "Retry move review": "Riprova revisione",
  "Next time": "La prossima volta",
  "Likely reply": "Risposta probabile",
  "The evaluation difference is measured in pawn units. Grades account for the overall position; mate outcomes have no pawn score.":
    "La differenza di valutazione è espressa in pedoni. I giudizi considerano l'intera posizione; il matto non ha un valore in pedoni.",
  "Quick review": "Revisione rapida",
  "{0} evaluation drop": "{0} di calo nella valutazione",
  "Keep the mating attack going": "Continua l'attacco di matto",
  "There’s a checkmate in {0} moves starting with {1}, according to this analysis. Play through the replies to see how the attack works.":
    "Secondo questa analisi, c'è matto in {0} mosse iniziando con {1}. Segui le risposte per capire l'attacco.",
  "See the start of the mating attack": "Vedi l'inizio dell'attacco di matto",
  "Find the toughest defense": "Trova la difesa più tenace",
  "Your king is in serious trouble: this analysis still finds a forced checkmate after {0}. Play through their checks to see where the danger comes from.":
    "Il re è in grave pericolo: l'analisi trova ancora un matto forzato dopo {0}. Segui gli scacchi avversari per capire il pericolo.",
  "See the defensive move": "Vedi la mossa difensiva",
  "No reply is included in this preview. Try the move to explore what comes next.":
    "L'anteprima non include una risposta. Prova la mossa per esplorare il seguito.",
  " You could follow with {0}: {1}.": " Potresti continuare con {0}: {1}.",
  "That’s checkmate. They have no reply.":
    "È scacco matto. Non hanno risposte.",
  "This move ends the game in a draw.":
    "Questa mossa conclude la partita in patta.",
  "A forced mate for {0}": "Matto forzato per {0}",
  "A balanced position": "Posizione equilibrata",
  "{0} has a small edge": "{0} ha un leggero vantaggio",
  "{0} has the advantage": "{0} ha il vantaggio",
  "{0} has a winning advantage": "{0} ha un vantaggio decisivo",
  Checkmate: "Scacco matto",
  Draw: "Patta",
  "Preview · Check": "Anteprima · Scacco",
  Preview: "Anteprima",
  Check: "Scacco",
  Paused: "In pausa",
  "Replying…": "Risposta in arrivo…",
  "Thinking…": "Riflessione…",
  Reviewing: "Revisione",
  "Your turn": "Tocca a te",
  "Position analysis": "Analisi della posizione",
  "Your coach": "Il tuo allenatore",
  "To move": "Tratto a",
  "Who plays next": "Chi gioca adesso",
  "Changing the player starts a new position and clears the move history.":
    "Cambiare il turno avvia una nuova posizione e cancella la cronologia.",
  "Back to board ↑": "Torna alla scacchiera ↑",
  "Waiting for computer": "In attesa del computer",
  "Calculating best moves": "Calcolo delle migliori mosse",
  "Calculate best moves": "Calcola le migliori mosse",
  "Waiting for computer…": "In attesa del computer…",
  "Calculating…": "Calcolo in corso…",
  "Dismiss error": "Chiudi errore",
  "Move history controls": "Controlli della cronologia",
  "Back to latest": "Torna all'ultima",
  "Preview · {0}": "Anteprima · {0}",
  "Reviewing {0} · Updating this position’s analysis":
    "Revisione di {0} · Aggiornamento dell'analisi",
  "Reviewing {0} · Analysis is for this position":
    "Revisione di {0} · L'analisi riguarda questa posizione",
  "Reviewing {0} · Calculate when you want guidance":
    "Revisione di {0} · Analizza quando vuoi un consiglio",
  "Computer moves in a moment…": "Il computer muoverà tra poco…",
  "Computer is choosing a reply…": "Il computer sta scegliendo una risposta…",
  "Updating {0}’s analysis · You can keep playing":
    "Aggiornamento dell'analisi di {0} · Puoi continuare a giocare",
  "Return to game": "Torna alla partita",
  "Arrange a legal position with both kings to play the computer.":
    "Prepara una posizione legale con entrambi i re per giocare contro il computer.",
  "This game has ended. Start a new game to play.":
    "La partita è terminata. Iniziane una nuova.",
  "Return to your game to continue playing.":
    "Torna alla partita per continuare a giocare.",
  "Turn on “Play computer” to play against {0}.":
    "Attiva «Gioca contro il computer» per affrontare {0}.",
  "Game paused while you choose your settings.":
    "Partita in pausa mentre scegli le impostazioni.",
  "The computer could not choose a move. Try again.":
    "Il computer non ha potuto scegliere una mossa. Riprova.",
  "Computer is thinking…": "Il computer sta pensando…",
  "Your turn. Make a move on the board.":
    "Tocca a te. Gioca una mossa sulla scacchiera.",
  "Your computer difficulty could not be saved in this browser.":
    "Impossibile salvare il livello del computer in questo browser.",
  "Play computer": "Gioca contro il computer",
  Computer: "Computer",
  "Computer settings": "Impostazioni del computer",
  "Retry computer": "Riprova computer",
  "Close computer settings": "Chiudi impostazioni del computer",
  "You play as": "Il tuo lato",
  "Your challenge": "La tua sfida",
  Retry: "Riprova",
  Done: "Fatto",
  "Starting position": "Posizione iniziale",
  "Browser storage is unavailable or full. Your latest changes may not survive a reload.":
    "Lo spazio del browser è pieno o non disponibile. Le ultime modifiche potrebbero andare perse ricaricando.",
  "The original save could not be backed up. Autosave remains paused. Your latest changes may not survive a reload.":
    "Impossibile creare una copia del salvataggio originale. Il salvataggio automatico resta in pausa. Le ultime modifiche potrebbero andare perse ricaricando.",
  "Continuing from the selected position.":
    "Continuazione dalla posizione selezionata.",
  "Game result": "Risultato della partita",
  CHECKMATE: "SCACCO MATTO",
  DRAW: "PATTA",
  "Honors shared.": "Onori condivisi.",
  "A royal finish. Ready for another round?":
    "Un finale regale. Un'altra partita?",
  "Good game. There’s always another round.":
    "Bella partita. C'è sempre un'altra occasione.",
  "Final score: White {0}, Black {1}": "Risultato finale: Bianco {0}, Nero {1}",
  "Play again": "Gioca ancora",
  "Choose a promotion piece": "Scegli un pezzo per la promozione",
  "Cancel promotion": "Annulla promozione",
  "Your pawn made it.": "Il pedone è arrivato.",
  "Choose its next chapter.": "Scegli il suo prossimo capitolo.",
  "Promote to {0}": "Promuovi a {0}",
  "Game saving status": "Stato del salvataggio",
  "Saved game needs recovery": "La partita salvata richiede un recupero",
  "Browser save unavailable": "Salvataggio non disponibile",
  "Original save preserved": "Salvataggio originale conservato",
  "The original data is kept in a separate browser recovery backup. Autosave has resumed.":
    "I dati originali sono conservati in una copia di recupero separata nel browser. Il salvataggio automatico è ripreso.",
  "Keep current game & resume saving":
    "Mantieni partita e riprendi salvataggio",
  "Dismiss recovery notice": "Chiudi avviso di recupero",
  "This FEN is not valid.": "Questo FEN non è valido.",
  "Clipboard access is unavailable. Select the FEN text and copy it manually.":
    "Gli appunti non sono disponibili. Seleziona il testo FEN e copialo manualmente.",
  "FEN position controls": "Controlli della posizione FEN",
  "FEN position": "Posizione FEN",
  "Paste a FEN position": "Incolla una posizione FEN",
  "Copy current FEN": "Copia FEN attuale",
  Load: "Carica",
  "Browser storage could not be read. Your saved game may be unavailable.":
    "Impossibile leggere lo spazio del browser. La partita salvata potrebbe non essere disponibile.",
  "Your saved game could not be read. The last valid position was restored, without its move history. Autosave is paused to protect the original data.":
    "Impossibile leggere la partita salvata. È stata ripristinata l'ultima posizione valida, senza cronologia. Il salvataggio automatico è in pausa per proteggere i dati originali.",
  "Your saved game could not be read. A fresh board is open. Autosave is paused to protect the original data.":
    "Impossibile leggere la partita salvata. È stata aperta una nuova scacchiera. Il salvataggio automatico è in pausa per proteggere i dati originali.",
  "Recovery backup could not be verified.":
    "Impossibile verificare la copia di recupero.",
  "Game moves": "Mosse della partita",
  "Move history": "Cronologia delle mosse",
  "View starting position": "Vedi posizione iniziale",
  Start: "Inizio",
  "View position after {0}": "Vedi posizione dopo {0}",
  pawn: "pedone",
  knight: "cavallo",
  bishop: "alfiere",
  rook: "torre",
  queen: "donna",
  king: "re",
  Beginner: "Principiante",
  Easy: "Facile",
  Medium: "Medio",
  Hard: "Difficile",
  Expert: "Esperto",
  "Best move": "Mossa migliore",
  "Good move": "Buona mossa",
  Inaccuracy: "Imprecisione",
  Mistake: "Errore",
  Blunder: "Grave errore",
  "Your last move": "La tua ultima mossa",
  "Selected move": "Mossa selezionata",
  "Tempo — Your next move, explained.":
    "Tempo — La tua prossima mossa, spiegata.",
  "must contain six space-delimited fields":
    "deve contenere sei campi separati da spazi",
  "move number must be a positive integer":
    "il numero della mossa deve essere un intero positivo",
  "half move counter number must be a non-negative integer":
    "il contatore delle semimosse deve essere un intero non negativo",
  "en-passant square is invalid": "la casella en passant non è valida",
  "castling availability is invalid": "i diritti di arrocco non sono validi",
  "side-to-move is invalid": "il lato al tratto non è valido",
  "piece data does not contain 8 '/'-delimited rows":
    "i dati dei pezzi devono contenere 8 traverse separate da «/»",
  "piece data is invalid (consecutive number)":
    "dati dei pezzi non validi: numeri consecutivi",
  "piece data is invalid (invalid piece)":
    "dati dei pezzi non validi: pezzo sconosciuto",
  "piece data is invalid (too many squares in rank)":
    "dati dei pezzi non validi: troppe caselle in una traversa",
  "illegal en-passant square": "casella en passant illegale",
  "some pawns are on the edge rows":
    "ci sono pedoni sulla prima o sull'ultima traversa",
  "Last move": "Ultima mossa",
  "Position loaded": "Posizione caricata",
  "Position copied": "Posizione copiata",
  "piece data must use 1–8 for empty squares.": "usa 1–8 per le caselle vuote",
  "{0} wins!": "{0} vince!",
  "{0} pieces": "Pezzi di {0}",
  "Alternative: {0}. {1}. {2}": "Alternativa: {0}. {1}. {2}",
} satisfies Catalog;
