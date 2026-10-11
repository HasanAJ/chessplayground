import type { Catalog } from "./en";

export default {
  "The chess engine could not load. Check your connection and retry analysis.":
    "El motor de ajedrez no se pudo cargar. Comprueba tu conexión y vuelve a analizar.",
  "The engine took too long to load. Try analyzing the position again.":
    "El motor tardó demasiado en cargar. Vuelve a analizar la posición.",
  "The chess engine could not start. Try refreshing the page or using a browser with WebAssembly support.":
    "El motor no pudo iniciarse. Recarga la página o usa un navegador compatible con WebAssembly.",
  "The engine took too long to respond. Try analyzing the position again.":
    "El motor tardó demasiado en responder. Vuelve a analizar la posición.",
  "No complete analysis was returned. Try this position again.":
    "No se recibió un análisis completo. Vuelve a probar esta posición.",
  Language: "Idioma",
  "Invalid FEN: {0}": "FEN no válido: {0}",
  "{0} can have at most 8 pawns. Remove one before adding another.":
    "{0}: máximo 8 peones. Retira uno antes de añadir otro.",
  "{0} can have at most 16 pieces. Remove one before adding another.":
    "{0}: máximo 16 piezas. Retira una antes de añadir otra.",
  "Add the {0} king to play or calculate.":
    "Añade el rey de {0} para jugar o calcular.",
  "The {0} king is in check, but it is {1}'s turn. Change whose turn it is or move the king to safety.":
    "El rey de {0} está en jaque, pero es el turno de {1}. Cambia el turno o pon el rey a salvo.",
  "Castling right {0} needs the {1} king and rook on their original squares.":
    "El derecho de enroque {0} requiere que el rey y la torre de {1} estén en sus casillas iniciales.",
  "Missing {0} king.": "Falta el rey de {0}.",
  "Too many {0} kings.": "Demasiados reyes de {0}.",
  White: "Blancas",
  Black: "Negras",
  "Tempo home": "Inicio de Tempo",
  "Your chess playground": "Tu espacio de ajedrez",
  "How it works": "Cómo funciona",
  "Your next move,": "Tu próxima jugada,",
  "explained.": "explicada.",
  "Explore the board. Understand the plan. Try a move.":
    "Explora el tablero. Entiende el plan. Prueba una jugada.",
  "A good move starts with a little understanding.":
    "Una buena jugada empieza con un poco de comprensión.",
  "Powered by Stockfish 19": "Con Stockfish 19",
  "{0}{1} from {2} to {3}": "{0}{1} de {2} a {3}",
  "Castle: king {0} to {1}, rook {2}": "Enroque: rey de {0} a {1}, torre {2}",
  "h{0} to f{1}": "de h{0} a f{1}",
  "a{0} to d{1}": "de a{0} a d{1}",
  ", taking the {0}{1}": ", capturando {0}{1}",
  " on {0} en passant": " en {0} al paso",
  ", promoting to a {0}": ", coronando a {0}",
  " — checkmate": " — jaque mate",
  " — check": " — jaque",
  "Add both kings to play or calculate.":
    "Añade ambos reyes para jugar o calcular.",
  "Move pawns off the first and last ranks to play or calculate.":
    "Retira los peones de la primera y última fila para jugar o calcular.",
  "Arrange a legal position to play or calculate.":
    "Prepara una posición legal para jugar o calcular.",
  "This position is not valid.": "Esta posición no es válida.",
  "The FEN’s move counters must be whole numbers within the supported range.":
    "Los contadores de jugadas del FEN deben ser enteros dentro del rango admitido.",
  "Castling availability must list each right (KQkq) once, or use “-” for none.":
    "Los derechos de enroque deben indicar cada opción (KQkq) una vez, o «-» para ninguna.",
  "Invalid FEN: piece data must use 1–8 for empty squares.":
    "FEN no válido: usa 1–8 para las casillas vacías.",
  "An en passant target needs a zero half-move counter because the last move was a pawn move.":
    "Una casilla al paso requiere un contador de medias jugadas a cero, pues la última jugada fue de peón.",
  "The en passant square needs an opposing pawn that has just advanced two squares. Check the FEN’s fourth field.":
    "La casilla al paso requiere un peón rival que acabe de avanzar dos casillas. Revisa el cuarto campo del FEN.",
  "{0} wins by checkmate.": "{0} ganan por jaque mate.",
  "Stalemate. There are no legal moves, and the king is safe.":
    "Ahogado. No hay jugadas legales y el rey no está en jaque.",
  "Draw by threefold repetition.": "Tablas por triple repetición.",
  "Draw. Neither side has enough material to checkmate.":
    "Tablas. Ningún bando tiene material suficiente para dar mate.",
  "Draw by the fifty-move rule.":
    "Tablas por la regla de las cincuenta jugadas.",
  "Chess board and position controls": "Tablero y controles de posición",
  "Start a new game from the standard chess position":
    "Iniciar una partida desde la posición inicial",
  "New game": "Nueva partida",
  "Clear board": "Vaciar tablero",
  "Game move navigation": "Navegación de jugadas",
  "Previous game move": "Jugada anterior",
  "Next game move": "Jugada siguiente",
  "Flip board": "Girar tablero",
  "See your coach": "Ver tu entrenador",
  "{0} {1}": "{1} · {0}",
  "Calculate best moves to see the evaluation":
    "Calcula las mejores jugadas para ver la evaluación",
  "Evaluation paused during board preview":
    "Evaluación pausada durante la vista previa",
  "+ = White ahead · − = Black ahead":
    "+ = ventaja de Blancas · − = ventaja de Negras",
  "White evaluation {0}": "Evaluación para Blancas: {0}",
  "Evaluation pending": "Evaluación pendiente",
  "Move preview chessboard": "Tablero de vista previa",
  "Game history chessboard": "Tablero del historial",
  "Interactive chessboard": "Tablero interactivo",
  " empty": " vacía",
  " in check": " en jaque",
  "Place {0} {1}": "Colocar: {1} · {0}",
  "Add {0} {1} · Click or drag to board":
    "Añadir: {1} · {0} · Haz clic o arrastra al tablero",
  "Other good options": "Otras buenas opciones",
  "Position estimate in pawn units: + favors White, − favors Black.":
    "Estimación en peones: + favorece a Blancas, − a Negras.",
  "Play {0}": "Jugar {0}",
  "Before moving, check whether their pieces can reach your king on {0}. Here, {1} ends the game.":
    "Antes de mover, comprueba si sus piezas pueden llegar a tu rey en {0}. Aquí, {1} termina la partida.",
  "See their checkmate threat": "Ver su amenaza de mate",
  "leaves your {0} on {1} with no defender. Their {2} can take it with {3}":
    "deja tu {0} en {1} sin defensa. Su {2} puede capturarlo con {3}",
  "allows their {0} to take your {1} on {2} with {3}. Your piece has a defender, so follow the rest of the trade":
    "permite que su {0} capture tu {1} en {2} con {3}. Tu pieza tiene defensa; sigue el resto del cambio",
  "Before moving, check which of your pieces they can capture and whether you can capture back.":
    "Antes de mover, comprueba qué piezas pueden capturarte y si puedes recapturar.",
  "Before accepting a trade, compare the pieces both sides can capture, including the next reply.":
    "Antes de aceptar un cambio, compara las capturas de ambos bandos, incluida la siguiente respuesta.",
  "See the piece they can capture": "Ver la pieza que pueden capturar",
  "allows the shown line to reach {0}, where their {1} takes your {2} on {3}. Further trades may follow":
    "permite llegar a {0} en la línea mostrada, donde su {1} captura tu {2} en {3}. Pueden seguir más cambios",
  "Follow their checks as well as their captures. A check may force you to respond before you can protect another piece.":
    "Sigue sus jaques además de sus capturas. Un jaque puede obligarte a responder antes de proteger otra pieza.",
  "Look beyond their first reply: follow the next captures too before deciding whether a trade helps you.":
    "Mira más allá de su primera respuesta: sigue las siguientes capturas antes de decidir si un cambio te ayuda.",
  "See the later capture in this line":
    "Ver la captura posterior en esta línea",
  "your {0} on {1}": "tu {0} en {1}",
  " and ": " y ",
  "allows a fork: their {0} on {1} attacks {2} at once":
    "permite un ataque doble: su {0} en {1} ataca {2} a la vez",
  "Look for replies that attack two pieces at once. Moving or protecting one may leave the other under attack.":
    "Busca respuestas que ataquen dos piezas a la vez. Mover o proteger una puede dejar la otra atacada.",
  "See the two attacks": "Ver los dos ataques",
  "Compare the capture on {0} with {1}. Preview their reply before deciding whether the capture helps.":
    "Compara la captura en {0} con {1}. Mira su respuesta antes de decidir si te conviene capturar.",
  "Check which of your pieces need protection. {0} offers another way to defend your position.":
    "Comprueba qué piezas necesitan protección. {0} ofrece otra forma de defender tu posición.",
  "Check whether a piece is under attack before starting another plan. {0} moves a piece out of danger.":
    "Comprueba si tienes una pieza atacada antes de iniciar otro plan. {0} aparta una pieza del peligro.",
  "Check their checks, captures, and attacks before choosing your move. Preview {0} to compare the alternative.":
    "Comprueba sus jaques, capturas y ataques antes de elegir. Mira {0} para comparar la alternativa.",
  "The move needs analysis of the resulting position.":
    "La jugada requiere analizar la posición resultante.",
  "{0} delivers checkmate. Their king has no way out—you’ve finished the game.":
    "{0} da jaque mate. Su rey no tiene salida: has terminado la partida.",
  "{0} is the top choice here. {1}": "{0} es la mejor opción aquí. {1}",
  "gets you a draw, close to the best result found here":
    "consigue tablas, cerca del mejor resultado encontrado aquí",
  "keeps your checkmate on track in the analyzed line":
    "mantiene el mate en la línea analizada",
  "holds up about as well as the best defense found here, though the analysis still finds mate against you":
    "resiste casi tan bien como la mejor defensa encontrada, aunque el análisis aún encuentra mate en tu contra",
  "keeps your strong advantage. You’re still in a great position":
    "mantiene tu gran ventaja. Sigues en una posición muy favorable",
  "holds up about as well as the best option in an already tough position":
    "resiste casi tan bien como la mejor opción en una posición ya difícil",
  "looks good here, with chances close to {0}":
    "parece buena aquí, con posibilidades cercanas a {0}",
  "leads to a draw. {0} offered better chances":
    "lleva a tablas. {0} ofrecía mejores posibilidades",
  "allows a forced checkmate in the analyzed line":
    "permite un mate forzado en la línea analizada",
  "lets a forced checkmate slip away": "deja escapar un mate forzado",
  "gives your opponent better chances than {0} would":
    "da al rival mejores posibilidades que {0}",
  "Try the other move to see what you could keep playing for.":
    "Prueba la otra jugada para ver por qué podrías seguir luchando.",
  "Play through the reply to see what they could do next.":
    "Recorre la respuesta para ver qué podrían hacer después.",
  "Build pressure on {0}": "Aumenta la presión sobre {0}",
  "Your {0} joins another piece in attacking their {1} on {2}. They now have more than one attacker to deal with.":
    "Tu {0} se une a otra pieza para atacar su {1} en {2}. Ahora deben hacer frente a más de un atacante.",
  "See the attack on their {0}": "Ver el ataque a su {0}",
  "Support your center": "Apoya tu centro",
  "Defend your {0}": "Defiende tu {0}",
  "Your {0} on {1} now defends the {2} on {3}. If they capture it, your {4} may be able to capture back; check the reply before trading.":
    "Tu {0} en {1} defiende ahora tu {2} en {3}. Si lo capturan, tu {4} podría recapturar; revisa la respuesta antes de cambiar.",
  "See the defense of your {0}": "Ver la defensa de tu {0}",
  "Move your {0} out of danger": "Aparta tu {0} del peligro",
  "Your {0} was under attack on {1}. On {2}, none of their pieces currently attack it.":
    "Tu {0} estaba bajo ataque en {1}. En {2}, ninguna pieza rival lo ataca actualmente.",
  "See your {0} move out of danger": "Ver cómo tu {0} sale del peligro",
  "Attack the {0}": "Ataca su {0}",
  "Your {0} on {1} attacks their {2} on {3}. Watch for a retreat, a defense, or a threat of their own.":
    "Tu {0} en {1} ataca su {2} en {3}. Vigila una retirada, una defensa o una amenaza rival.",
  "Your {0} on {1} now attacks their {2} on {3}. They may move it or defend it, so look at the reply before counting on a capture.":
    "Tu {0} en {1} ataca ahora su {2} en {3}. Pueden moverlo o defenderlo; mira la respuesta antes de contar con una captura.",
  "{0} on {1}": "{0} en {1}",
  "Your {0} give check.": "Tus piezas ({0}) dan jaque.",
  "Your {0} gives check.": "Tu {0} da jaque.",
  "Your pawn promotes to a {0} on {1}. ": "Tu peón corona a {0} en {1}. ",
  "Finish with checkmate": "Termina con jaque mate",
  "{0}Your {1} deliver checkmate. Their king has no way out.":
    "{0}Tus piezas ({1}) dan jaque mate. Su rey no tiene salida.",
  "{0}Your {1} delivers checkmate. Their king has no way out.":
    "{0}Tu {1} da jaque mate. Su rey no tiene salida.",
  "See the checkmate": "Ver el jaque mate",
  "Promote your pawn": "Corona tu peón",
  "You now have a {0} in place of that pawn. Look at the reply to see how they respond.":
    "Ahora tienes una pieza ({0}) en lugar de ese peón. Mira la respuesta del rival.",
  "See the promotion": "Ver la coronación",
  "Castle and bring your rook into play": "Enroca y activa tu torre",
  "Castling moves your king away from the center and brings your rook toward the middle.{0}":
    "El enroque aleja tu rey del centro y acerca tu torre al medio.{0}",
  "See the king and rook move": "Ver el movimiento de rey y torre",
  "Get your king out of check": "Saca tu rey del jaque",
  "{0} gets you out of check{1}.{2}": "{0} te saca del jaque{1}.{2}",
  " and takes the {0} on {1}": " y captura su {0} en {1}",
  " by blocking the attack with your {0}": " bloqueando el ataque con tu {0}",
  " by moving your king to {0}": " moviendo tu rey a {0}",
  " Your king is no longer under attack, so you can continue playing.":
    " Tu rey ya no está bajo ataque y puedes seguir jugando.",
  "See how you escape check": "Ver cómo sales del jaque",
  "Capture with check": "Captura con jaque",
  "Capture the {0}": "Captura su {0}",
  "Your {0} takes the {1} on {2}{3}. {4}":
    "Tu {0} captura su {1} en {2}{3}. {4}",
  " en passant, landing on ": " al paso, llegando a ",
  "Their pieces attack your {0} on {1}; preview the reply to check whether they capture back.":
    "Sus piezas atacan tu {0} en {1}; mira la respuesta para comprobar si recapturan.",
  "None of their pieces currently attack your {0} on {1}.":
    "Ninguna pieza rival ataca actualmente tu {0} en {1}.",
  "See the capture and possible attackers":
    "Ver la captura y los posibles atacantes",
  "Give check": "Da jaque",
  "{0} Your opponent has to deal with the attack on their king.":
    "{0} Tu rival tiene que responder al ataque sobre su rey.",
  "See the attack on their king": "Ver el ataque a su rey",
  "From here, it attacks {0}, helping you control the center.":
    "Desde aquí ataca {0}, ayudándote a controlar el centro.",
  "Bringing pieces off the starting row gives you more pieces to use in your next moves.":
    "Sacar las piezas de su fila inicial te da más piezas disponibles para las próximas jugadas.",
  "Bring another piece into play": "Desarrolla otra pieza",
  "Your {0} comes off the back rank to {1}. {2}":
    "Tu {0} sale de la última fila hacia {1}. {2}",
  "See your piece and the center squares":
    "Ver tu pieza y las casillas centrales",
  "Claim the center": "Ocupa el centro",
  "Your pawn takes space in the center on {0}. It attacks {1}, helping limit where their pieces can move safely.":
    "Tu peón gana espacio en el centro en {0}. Ataca {1}, limitando las casillas seguras para sus piezas.",
  "See the pawn’s control of the center": "Ver el control central del peón",
  "Put your rook on an open file": "Coloca tu torre en una columna abierta",
  "There are no pawns on the {0}-file, the column your rook moves to. With no pawns in that column, look for squares your rook can reach before another piece blocks its path.":
    "No hay peones en la columna {0}, a la que se mueve tu torre. Busca las casillas a las que puede llegar antes de que otra pieza bloquee el camino.",
  "See the open file": "Ver la columna abierta",
  "Improve your rook’s position": "Mejora la posición de tu torre",
  "Try your rook on {0}. Play through the reply below to see which lines and targets it can work with.":
    "Prueba tu torre en {0}. Recorre la respuesta para ver qué líneas y objetivos puede aprovechar.",
  "See your rook’s move": "Ver la jugada de tu torre",
  "Improve your king’s position": "Mejora la posición de tu rey",
  "Your king steps from {0} to {1}. Check what their pieces can do before choosing its next square.":
    "Tu rey pasa de {0} a {1}. Comprueba qué pueden hacer sus piezas antes de elegir la siguiente casilla.",
  "See your king’s move": "Ver la jugada de tu rey",
  "Gain space with your pawn": "Gana espacio con tu peón",
  "Your pawn moves up to {0}, claiming more space. Keep an eye on the squares it leaves behind.":
    "Tu peón avanza a {0} y gana espacio. Vigila las casillas que deja atrás.",
  "See your pawn’s advance": "Ver el avance de tu peón",
  "Improve a piece near the center": "Mejora una pieza cerca del centro",
  "Your {0} moves to {1}, near the center. {2}":
    "Tu {0} se mueve a {1}, cerca del centro. {2}",
  "Preview the reply to see how they can respond before choosing its next move.":
    "Mira su respuesta antes de elegir la siguiente jugada de esta pieza.",
  "See the move near the center": "Ver la jugada cerca del centro",
  "Reposition your {0}": "Reubica tu {0}",
  "Try your {0} on {1}. Play through the next few moves to see how your opponent can respond and where your pieces end up.":
    "Prueba tu {0} en {1}. Recorre las próximas jugadas para ver cómo puede responder tu rival y dónde acaban tus piezas.",
  "See your {0}’s move": "Ver la jugada de tu {0}",
  "They can checkmate with {0} ({1} to {2}).":
    "Pueden dar mate con {0} ({1} a {2}).",
  "castle {0}": "enrocar {0}",
  kingside: "en corto",
  queenside: "en largo",
  "take your {0} on {1}{2} with their {3}":
    "capturar tu {0} en {1}{2} con su {3}",
  " en passant": " al paso",
  "move their {0} to {1}": "mover su {0} a {1}",
  " and promote to a {0}": " y coronar a {0}",
  " and give check": " y dar jaque",
  "They may {0}{1}{2} ({3}).": "Pueden {0}{1}{2} ({3}).",
  "Deal with the check first. Look for a king move, a way to take the attacker, or a piece that can block the attack.":
    "Resuelve primero el jaque. Busca un movimiento de rey, una captura del atacante o una pieza que bloquee el ataque.",
  "Your {0} on {1} is under attack with no defender. Can you move it, protect it, or make a threat they have to answer first?":
    "Tu {0} en {1} está bajo ataque y sin defensa. ¿Puedes moverlo, protegerlo o crear una amenaza que deban responder primero?",
  "Your {0} on {1} is under attack. It has a defender, but play out the trade before leaving it there.":
    "Tu {0} en {1} está bajo ataque. Tiene defensa, pero recorre el cambio antes de dejarlo ahí.",
  "Before you move, take a quick look at their checks, captures, and attacks on unprotected pieces. Start with the likely reply below your move.":
    "Antes de mover, revisa sus jaques, capturas y ataques a piezas sin protección. Empieza por la respuesta probable bajo tu jugada.",
  "{0} puts {1} under attack from your {2}.": "{0} hace que tu {2} ataque {1}.",
  "their {0} on {1}": "su {0} en {1}",
  "Your {0} is under attack with no defender.":
    "Tu {0} está bajo ataque y sin defensa.",
  "Your {0} are under attack with no defender.":
    "Tus piezas ({0}) están bajo ataque y sin defensa.",
  "Your pieces cover {0} in the center.":
    "Tus piezas controlan {0} en el centro.",
  "{0} finishes this line with checkmate.":
    "{0} termina esta línea con jaque mate.",
  "The preview ends with {0} playing {1}, a capture. The exchange may continue.":
    "La vista previa termina con una captura: {0} juegan {1}. El cambio puede continuar.",
  "In this possible line, you’d gain the equivalent of {0} pawn in material.":
    "En esta posible línea ganarías el equivalente a {0} peón de material.",
  "In this possible line, you’d gain the equivalent of {0} pawns in material.":
    "En esta posible línea ganarías el equivalente a {0} peones de material.",
  "In this possible line, you’d give up the equivalent of {0} pawn in material.":
    "En esta posible línea cederías el equivalente a {0} peón de material.",
  "In this possible line, you’d give up the equivalent of {0} pawns in material.":
    "En esta posible línea cederías el equivalente a {0} peones de material.",
  "The material balance stays the same in this line.":
    "El equilibrio de material se mantiene en esta línea.",
  "{0} puts your king in check. Getting out of check comes first.":
    "{0} pone tu rey en jaque. Salir del jaque es lo primero.",
  "{0} leaves your {1} on {2} under attack with no defender. Take care of it before carrying on with your plan.":
    "{0} deja tu {1} en {2} bajo ataque y sin defensa. Ocúpate de ello antes de seguir con tu plan.",
  "They’ve just taken your {0} with {1}. Look at {2} before deciding how to answer.":
    "Acaban de capturar tu {0} con {1}. Mira {2} antes de decidir cómo responder.",
  "{0} changes their control of {1}. Try {2} now, and see how they might respond.":
    "{0} cambia su control de {1}. Prueba {2} y observa cómo podrían responder.",
  "Their {0} is now on {1}. Try {2}{3}.":
    "Su {0} está ahora en {1}. Prueba {2}{3}.",
  "; one reply to look at is {0}": "; una respuesta a revisar es {0}",
  " and see how they respond": " y observa cómo responden",
  "This position has only one legal move.":
    "Esta posición solo tiene una jugada legal.",
  "{0} is the only recommended move here. The other moves checked give up too much compared with it.":
    "{0} es la única jugada recomendada. Las otras jugadas analizadas ceden demasiado en comparación.",
  "Here, checkmate threats matter more than a small difference in score. Play through {0} and {1}, and follow the checks carefully.":
    "Aquí, las amenazas de mate importan más que una pequeña diferencia de evaluación. Recorre {0} y {1}, siguiendo los jaques con cuidado.",
  "{0} and {1} both look good here. Play through their replies and choose the position you’d rather have.":
    "{0} y {1} parecen buenas. Recorre sus respuestas y elige la posición que prefieras.",
  "{0} looks stronger than {1} here. Play through both replies to see how the positions differ.":
    "{0} parece más fuerte que {1}. Recorre ambas respuestas para comparar las posiciones.",
  "Preview likely reply: {0}": "Vista previa de la respuesta probable: {0}",
  "LIKELY REPLY": "RESPUESTA PROBABLE",
  "Engine continuation": "Continuación del motor",
  "POSSIBLE NEXT MOVES": "POSIBLES PRÓXIMAS JUGADAS",
  "Preview move {0}: {1} plays {2}":
    "Vista previa de la jugada {0}: {1} juegan {2}",
  "The engine returned no legal candidates. Please retry analysis.":
    "El motor no devolvió jugadas legales. Vuelve a analizar.",
  "About this position": "Sobre esta posición",
  "WHAT CHANGED": "QUÉ HA CAMBIADO",
  "Hide key squares": "Ocultar casillas clave",
  "Highlight key squares": "Resaltar casillas clave",
  "Teal outlines mark the squares discussed above: {0}.":
    "Los contornos turquesa marcan las casillas comentadas: {0}.",
  "Analyzing…": "Analizando…",
  "Engine unavailable": "Motor no disponible",
  "Recommendations ready": "Recomendaciones listas",
  "Reviewing {0}. Analysis is for this position.":
    "Revisando {0}. El análisis corresponde a esta posición.",
  "Let’s try that again.": "Vamos a intentarlo de nuevo.",
  "Retry analysis": "Reintentar análisis",
  "Best move and strategy": "Mejor jugada y estrategia",
  "FINDING YOUR MOVE": "BUSCANDO TU JUGADA",
  "Finding {0}’s best move…": "Buscando la mejor jugada de {0}…",
  "Looking at your options and their replies from this earlier position.":
    "Analizando tus opciones y sus respuestas desde esta posición anterior.",
  "Checking your options and your opponent’s replies. Feel free to keep playing.":
    "Analizando tus opciones y las respuestas del rival. Puedes seguir jugando.",
  "Checking deeper · depth {0}": "Profundizando · nivel {0}",
  "Usually ready in a couple of seconds":
    "Suele estar listo en un par de segundos",
  "Watch out for": "Presta atención a",
  "Hover or focus to highlight the threatened piece and its attackers.":
    "Pasa el cursor o enfoca para resaltar la pieza amenazada y sus atacantes.",
  "Escape check": "Sal del jaque",
  "BEST MOVE": "MEJOR JUGADA",
  "Only legal move": "Única jugada legal",
  "Plan continues": "El plan continúa",
  "Play best move {0}": "Jugar la mejor jugada {0}",
  "Hide reply": "Ocultar respuesta",
  "Preview reply": "Ver respuesta",
  "Explore next moves": "Explorar próximas jugadas",
  "The engine could not review this move. Try again.":
    "El motor no pudo revisar esta jugada. Inténtalo de nuevo.",
  "The engine could not reliably compare this move. Try again.":
    "El motor no pudo comparar esta jugada con fiabilidad. Inténtalo de nuevo.",
  "The engine could not check the reply. Try again.":
    "El motor no pudo comprobar la respuesta. Inténtalo de nuevo.",
  "Reviewing…": "Revisando…",
  "Review unavailable": "Revisión no disponible",
  "Move feedback": "Valoración de la jugada",
  "{0}: {1}. {2}. {3} details": "{0}: {1}. {2}. {3} detalles",
  Show: "Mostrar",
  Hide: "Ocultar",
  "Looking at your move and the best alternatives…":
    "Revisando tu jugada y las mejores alternativas…",
  "Retry move review": "Reintentar revisión",
  "Next time": "Para la próxima",
  "Likely reply": "Respuesta probable",
  "The evaluation difference is measured in pawn units. Grades account for the overall position; mate outcomes have no pawn score.":
    "La diferencia de evaluación se mide en peones. Las notas tienen en cuenta toda la posición; los mates no tienen una puntuación en peones.",
  "Quick review": "Revisión rápida",
  "{0} evaluation drop": "{0} de caída en la evaluación",
  "Close help": "Cerrar ayuda",
  "WELCOME TO TEMPO": "TE DAMOS LA BIENVENIDA A TEMPO",
  "A board. A plan. Your next move.": "Un tablero. Un plan. Tu próxima jugada.",
  "Make it your position.": "Crea tu posición.",
  "The piece trays above and below the board are always available. Drag a tray piece onto the board, or select it and click a square. Drag a legal board move to play it. Other board drops arrange a new position and restart history. Right-click a piece or drag it off the board to remove it. “Clear board” beside New game empties the board. Click a piece and a legal destination to play a move. Choose who plays next under “Your coach,” then press “Calculate best moves” whenever you want guidance for that position.":
    "Las bandejas de piezas siempre están disponibles encima y debajo del tablero. Arrastra una pieza al tablero o selecciónala y haz clic en una casilla. Arrastra una jugada legal para jugarla; otros movimientos organizan una nueva posición y reinician el historial. Haz clic derecho en una pieza o arrástrala fuera para retirarla. «Vaciar tablero», junto a «Nueva partida», elimina las piezas. También puedes jugar haciendo clic en una pieza y en su destino legal. Elige el siguiente turno en «Tu entrenador» y pulsa «Calcular mejores jugadas» cuando quieras orientación.",
  "Understand your options.": "Entiende tus opciones.",
  "The best move appears with a short explanation and a plain-language move description. Use “Preview reply” to see the response, then “Explore next moves” for the longer line. Open “About this position” for more context. “Other good options” appears only when worthwhile alternatives exist. Hover anywhere on the Best Move card, or focus one of its controls, to see its arrow. You can also hover or focus an alternative move. Hover a continuation move or “Likely reply” to see that position temporarily. Moving away restores the board. Keyboard focus and previews work the same way. Clicking or tapping keeps the preview, even when you jump back to the board. Choose “Return to game” or press Escape to finish a kept preview.":
    "La mejor jugada incluye una explicación breve y una descripción sencilla. «Ver respuesta» muestra la respuesta rival; «Explorar próximas jugadas» amplía la línea. Abre «Sobre esta posición» para más contexto. «Otras buenas opciones» aparece si hay alternativas útiles. Pasa el cursor sobre la tarjeta de la mejor jugada, enfoca sus controles o una alternativa para ver su flecha. Pasa el cursor o enfoca una continuación o «Respuesta probable» para verla temporalmente; al salir se restaura el tablero. Haz clic o toca para mantener la vista previa, incluso al volver al tablero. Usa «Volver a la partida» o Escape para salir.",
  "Learn as you go.": "Aprende mientras juegas.",
  "Use the “See” link below an explanation to preview its moves, attacks, or defenses with teal arrows and outlines. Your game stays unchanged. Move feedback includes a “Next time” lesson when the analysis finds a stronger alternative.":
    "Usa el enlace «Ver» bajo una explicación para previsualizar sus jugadas, ataques o defensas con flechas y contornos turquesa. Tu partida se conserva. La valoración de la jugada incluye una lección «Para la próxima» cuando el análisis encuentra una alternativa más fuerte.",
  "Keep the conversation going.": "Sigue explorando.",
  "Click a piece and its destination to play for either side, or use a suggested move. Click “Calculate best moves” whenever you want guidance for the current position. Use the arrows above the board, or click a move in your history, to revisit its position and analysis. Use “Back to latest” to continue your game, or play a move from the selected position to continue from there.":
    "Haz clic en una pieza y su destino para jugar con cualquier bando, o usa una jugada sugerida. Pulsa «Calcular mejores jugadas» para recibir orientación en la posición actual. Las flechas sobre el tablero y las jugadas del historial permiten volver a posiciones anteriores y analizarlas. «Volver a la actual» continúa tu partida; jugar desde una posición anterior continúa desde allí.",
  "Practice your way.": "Practica a tu manera.",
  "Use the computer toggle beside “Your coach” to turn the opponent on or off. Open its settings to choose your side and level. Your last move’s review opens above the recommendations. Calculating best moves collapses it to the move and rating; select the row to reopen the details.":
    "Activa o desactiva el rival con el interruptor junto a «Tu entrenador». Abre sus ajustes para elegir bando y nivel. La revisión de tu última jugada se abre sobre las recomendaciones. Calcular las mejores jugadas la reduce a la jugada y su nota; selecciona la fila para reabrir los detalles.",
  "Keep your discoveries.": "Conserva tus descubrimientos.",
  "Your game is autosaved in this browser. Use the FEN controls below the board to load or copy a position.":
    "Tu partida se guarda automáticamente en este navegador. Usa los controles FEN bajo el tablero para cargar o copiar una posición.",
  "Stockfish 19 Lite analyzes locally for about two seconds per position. Explanations use board patterns and the engine’s continuation. They’re a starting point for understanding; they aren’t a complete tactical proof. Move grades account for the overall position and compare alternatives at the same search depth. Grades can change with deeper analysis. Games are saved in this browser.":
    "Stockfish 19 Lite analiza localmente durante unos dos segundos por posición. Las explicaciones se basan en patrones del tablero y en la continuación del motor: ayudan a entender, pero no son una demostración táctica completa. Las notas tienen en cuenta toda la posición y comparan alternativas a la misma profundidad. Un análisis más profundo puede cambiarlas. Las partidas se guardan en este navegador.",
  "Let’s explore": "Vamos a explorar",
  "Keep the mating attack going": "Continúa el ataque de mate",
  "There’s a checkmate in {0} moves starting with {1}, according to this analysis. Play through the replies to see how the attack works.":
    "Según este análisis, hay mate en {0} jugadas empezando con {1}. Recorre las respuestas para entender el ataque.",
  "See the start of the mating attack": "Ver el inicio del ataque de mate",
  "Find the toughest defense": "Busca la defensa más resistente",
  "Your king is in serious trouble: this analysis still finds a forced checkmate after {0}. Play through their checks to see where the danger comes from.":
    "Tu rey corre un grave peligro: el análisis aún encuentra un mate forzado tras {0}. Recorre sus jaques para ver de dónde viene el peligro.",
  "See the defensive move": "Ver la jugada defensiva",
  "No reply is included in this preview. Try the move to explore what comes next.":
    "Esta vista previa no incluye una respuesta. Prueba la jugada para explorar qué viene después.",
  " You could follow with {0}: {1}.": " Podrías seguir con {0}: {1}.",
  "That’s checkmate. They have no reply.":
    "Es jaque mate. No tienen respuesta.",
  "This move ends the game in a draw.":
    "Esta jugada termina la partida en tablas.",
  "A forced mate for {0}": "Mate forzado a favor de {0}",
  "A balanced position": "Posición equilibrada",
  "{0} has a small edge": "{0} tienen una ligera ventaja",
  "{0} has the advantage": "{0} tienen ventaja",
  "{0} has a winning advantage": "{0} tienen una ventaja ganadora",
  Checkmate: "Jaque mate",
  Draw: "Tablas",
  "Preview · Check": "Vista previa · Jaque",
  Preview: "Vista previa",
  Check: "Jaque",
  Paused: "En pausa",
  "Replying…": "Respondiendo…",
  "Thinking…": "Pensando…",
  Reviewing: "Revisando",
  "Your turn": "Tu turno",
  "Position analysis": "Análisis de posición",
  "Your coach": "Tu entrenador",
  "To move": "Turno de",
  "Who plays next": "Quién juega ahora",
  "Changing the player starts a new position and clears the move history.":
    "Cambiar el turno inicia una nueva posición y borra el historial.",
  "Back to board ↑": "Volver al tablero ↑",
  "Waiting for computer": "Esperando al ordenador",
  "Calculating best moves": "Calculando mejores jugadas",
  "Calculate best moves": "Calcular mejores jugadas",
  "Waiting for computer…": "Esperando al ordenador…",
  "Calculating…": "Calculando…",
  "Dismiss error": "Cerrar error",
  "Move history controls": "Controles del historial",
  "Back to latest": "Volver a la actual",
  "Preview · {0}": "Vista previa · {0}",
  "Reviewing {0} · Updating this position’s analysis":
    "Revisando {0} · Actualizando el análisis de esta posición",
  "Reviewing {0} · Analysis is for this position":
    "Revisando {0} · El análisis corresponde a esta posición",
  "Reviewing {0} · Calculate when you want guidance":
    "Revisando {0} · Calcula cuando quieras orientación",
  "Computer moves in a moment…": "El ordenador moverá en un momento…",
  "Computer is choosing a reply…": "El ordenador está eligiendo su respuesta…",
  "Updating {0}’s analysis · You can keep playing":
    "Actualizando el análisis de {0} · Puedes seguir jugando",
  "Return to game": "Volver a la partida",
  "Arrange a legal position with both kings to play the computer.":
    "Prepara una posición legal con ambos reyes para jugar contra el ordenador.",
  "This game has ended. Start a new game to play.":
    "La partida ha terminado. Inicia una nueva para jugar.",
  "Return to your game to continue playing.":
    "Vuelve a tu partida para seguir jugando.",
  "Turn on “Play computer” to play against {0}.":
    "Activa «Jugar contra el ordenador» para enfrentarte a {0}.",
  "Game paused while you choose your settings.":
    "Partida en pausa mientras eliges los ajustes.",
  "The computer could not choose a move. Try again.":
    "El ordenador no pudo elegir una jugada. Inténtalo de nuevo.",
  "Computer is thinking…": "El ordenador está pensando…",
  "Your turn. Make a move on the board.":
    "Tu turno. Haz una jugada en el tablero.",
  "Your computer difficulty could not be saved in this browser.":
    "No se pudo guardar el nivel del ordenador en este navegador.",
  "Play computer": "Jugar contra el ordenador",
  Computer: "Ordenador",
  "Computer settings": "Ajustes del ordenador",
  "Retry computer": "Reintentar ordenador",
  "Close computer settings": "Cerrar ajustes del ordenador",
  "You play as": "Tu bando",
  "Your challenge": "Tu nivel de desafío",
  Retry: "Reintentar",
  Done: "Listo",
  "Starting position": "Posición inicial",
  "Browser storage is unavailable or full. Your latest changes may not survive a reload.":
    "El almacenamiento del navegador no está disponible o está lleno. Tus últimos cambios podrían perderse al recargar.",
  "The original save could not be backed up. Autosave remains paused. Your latest changes may not survive a reload.":
    "No se pudo crear una copia del guardado original. El guardado automático sigue en pausa. Tus últimos cambios podrían perderse al recargar.",
  "Continuing from the selected position.":
    "Continuando desde la posición seleccionada.",
  "Game result": "Resultado de la partida",
  CHECKMATE: "JAQUE MATE",
  DRAW: "TABLAS",
  "Honors shared.": "Empate bien luchado.",
  "A royal finish. Ready for another round?": "Un final real. ¿Otra partida?",
  "Good game. There’s always another round.":
    "Buena partida. Siempre hay otra oportunidad.",
  "Final score: White {0}, Black {1}":
    "Resultado final: Blancas {0}, Negras {1}",
  "Play again": "Jugar de nuevo",
  "Choose a promotion piece": "Elige una pieza para coronar",
  "Cancel promotion": "Cancelar coronación",
  "Your pawn made it.": "Tu peón ha llegado.",
  "Choose its next chapter.": "Elige su siguiente capítulo.",
  "Promote to {0}": "Coronar a {0}",
  "Game saving status": "Estado del guardado",
  "Saved game needs recovery": "La partida guardada necesita recuperarse",
  "Browser save unavailable": "Guardado no disponible",
  "Original save preserved": "Guardado original conservado",
  "The original data is kept in a separate browser recovery backup. Autosave has resumed.":
    "Los datos originales se conservan en una copia de recuperación del navegador. El guardado automático se ha reanudado.",
  "Keep current game & resume saving": "Conservar partida y reanudar guardado",
  "Dismiss recovery notice": "Cerrar aviso de recuperación",
  "This FEN is not valid.": "Este FEN no es válido.",
  "Clipboard access is unavailable. Select the FEN text and copy it manually.":
    "El portapapeles no está disponible. Selecciona el texto FEN y cópialo manualmente.",
  "FEN position controls": "Controles de posición FEN",
  "FEN position": "Posición FEN",
  "Paste a FEN position": "Pega una posición FEN",
  "Copy current FEN": "Copiar FEN actual",
  Load: "Cargar",
  "Browser storage could not be read. Your saved game may be unavailable.":
    "No se pudo leer el almacenamiento del navegador. Tu partida guardada podría no estar disponible.",
  "Your saved game could not be read. The last valid position was restored, without its move history. Autosave is paused to protect the original data.":
    "No se pudo leer tu partida guardada. Se recuperó la última posición válida sin su historial. El guardado automático está en pausa para proteger los datos originales.",
  "Your saved game could not be read. A fresh board is open. Autosave is paused to protect the original data.":
    "No se pudo leer tu partida guardada. Se abrió un tablero nuevo. El guardado automático está en pausa para proteger los datos originales.",
  "Recovery backup could not be verified.":
    "No se pudo verificar la copia de recuperación.",
  "Game moves": "Jugadas de la partida",
  "Move history": "Historial de jugadas",
  "View starting position": "Ver posición inicial",
  Start: "Inicio",
  "View position after {0}": "Ver posición tras {0}",
  pawn: "peón",
  knight: "caballo",
  bishop: "alfil",
  rook: "torre",
  queen: "dama",
  king: "rey",
  Beginner: "Principiante",
  Easy: "Fácil",
  Medium: "Medio",
  Hard: "Difícil",
  Expert: "Experto",
  "Best move": "Mejor jugada",
  "Good move": "Buena jugada",
  Inaccuracy: "Imprecisión",
  Mistake: "Error",
  Blunder: "Error grave",
  "Your last move": "Tu última jugada",
  "Selected move": "Jugada seleccionada",
  "Tempo — Your next move, explained.": "Tempo — Tu próxima jugada, explicada.",
  "must contain six space-delimited fields":
    "debe contener seis campos separados por espacios",
  "move number must be a positive integer":
    "el número de jugada debe ser un entero positivo",
  "half move counter number must be a non-negative integer":
    "el contador de medias jugadas debe ser un entero no negativo",
  "en-passant square is invalid": "la casilla al paso no es válida",
  "castling availability is invalid": "los derechos de enroque no son válidos",
  "side-to-move is invalid": "el bando al turno no es válido",
  "piece data does not contain 8 '/'-delimited rows":
    "los datos de piezas deben tener 8 filas separadas por «/»",
  "piece data is invalid (consecutive number)":
    "datos de piezas no válidos: números consecutivos",
  "piece data is invalid (invalid piece)":
    "datos de piezas no válidos: pieza desconocida",
  "piece data is invalid (too many squares in rank)":
    "datos de piezas no válidos: demasiadas casillas en una fila",
  "illegal en-passant square": "casilla al paso ilegal",
  "some pawns are on the edge rows": "hay peones en la primera o última fila",
  "Last move": "Última jugada",
  "Position loaded": "Posición cargada",
  "Position copied": "Posición copiada",
  "piece data must use 1–8 for empty squares.":
    "usa 1–8 para las casillas vacías",
  "{0} wins!": "¡Ganan {0}!",
  "{0} pieces": "Piezas de {0}",
  "Alternative: {0}. {1}. {2}": "Alternativa: {0}. {1}. {2}",
} satisfies Catalog;
