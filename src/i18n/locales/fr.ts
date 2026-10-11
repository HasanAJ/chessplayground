import type { Catalog } from "./en";

export default {
  "The chess engine could not load. Check your connection and retry analysis.":
    "Le moteur n’a pas pu se charger. Vérifiez votre connexion et relancez l’analyse.",
  "The engine took too long to load. Try analyzing the position again.":
    "Le chargement du moteur a pris trop de temps. Analysez à nouveau la position.",
  "The chess engine could not start. Try refreshing the page or using a browser with WebAssembly support.":
    "Le moteur n’a pas pu démarrer. Actualisez la page ou utilisez un navigateur compatible avec WebAssembly.",
  "The engine took too long to respond. Try analyzing the position again.":
    "Le moteur a mis trop de temps à répondre. Analysez à nouveau la position.",
  "No complete analysis was returned. Try this position again.":
    "Aucune analyse complète reçue. Réessayez cette position.",
  Language: "Langue",
  "Invalid FEN: {0}": "FEN non valide : {0}",
  "{0} can have at most 8 pawns. Remove one before adding another.":
    "{0} : 8 pions maximum. Retirez-en un avant d’en ajouter un autre.",
  "{0} can have at most 16 pieces. Remove one before adding another.":
    "{0} : 16 pièces maximum. Retirez-en une avant d’en ajouter une autre.",
  "Add the {0} king to play or calculate.":
    "Ajoutez le roi des {0} pour jouer ou analyser.",
  "The {0} king is in check, but it is {1}'s turn. Change whose turn it is or move the king to safety.":
    "Le roi des {0} est en échec, mais c’est aux {1} de jouer. Changez le trait ou mettez le roi à l’abri.",
  "Castling right {0} needs the {1} king and rook on their original squares.":
    "Le droit de roque {0} exige que le roi et la tour des {1} soient sur leurs cases de départ.",
  "Missing {0} king.": "Il manque le roi des {0}.",
  "Too many {0} kings.": "Trop de rois pour les {0}.",
  White: "Blancs",
  Black: "Noirs",
  "Tempo home": "Accueil de Tempo",
  "Your chess playground": "Votre terrain de jeu d’échecs",
  "Your next move,": "Votre prochain coup,",
  "explained.": "expliqué.",
  "Explore the board. Understand the plan. Try a move.":
    "Explorez l’échiquier. Comprenez le plan. Essayez un coup.",
  "Click a piece and its destination to play a move, or drag pieces from the trays to build your own position.":
    "Cliquez sur une pièce puis sur sa case de destination pour jouer un coup, ou faites glisser des pièces depuis les réserves pour créer votre propre position.",
  "Select “{0}” for suggestions and explanations, then preview a reply or try a move.":
    "Sélectionnez « {0} » pour voir des suggestions et des explications, puis prévisualisez une réponse ou essayez un coup.",
  "Play both sides, or turn on the computer opponent to practice against it.":
    "Jouez les deux camps ou activez l’adversaire contrôlé par l’ordinateur pour vous entraîner.",
  "A good move starts with a little understanding.":
    "Un bon coup commence par un peu de compréhension.",
  "Powered by Stockfish 19": "Avec Stockfish 19",
  "{0}{1} from {2} to {3}": "{0}{1} de {2} à {3}",
  "Castle: king {0} to {1}, rook {2}": "Roque : roi de {0} à {1}, tour {2}",
  "h{0} to f{1}": "de h{0} à f{1}",
  "a{0} to d{1}": "de a{0} à d{1}",
  ", taking the {0}{1}": ", avec capture de {0}{1}",
  " on {0} en passant": " en {0} en passant",
  ", promoting to a {0}": ", avec promotion en {0}",
  " — checkmate": " — échec et mat",
  " — check": " — échec",
  "Add both kings to play or calculate.":
    "Ajoutez les deux rois pour jouer ou analyser.",
  "Move pawns off the first and last ranks to play or calculate.":
    "Retirez les pions de la première et de la dernière rangée pour jouer ou analyser.",
  "Arrange a legal position to play or calculate.":
    "Créez une position légale pour jouer ou analyser.",
  "This position is not valid.": "Cette position n’est pas valide.",
  "The FEN’s move counters must be whole numbers within the supported range.":
    "Les compteurs du FEN doivent être des nombres entiers dans la plage prise en charge.",
  "Castling availability must list each right (KQkq) once, or use “-” for none.":
    "Chaque droit de roque (KQkq) ne doit apparaître qu’une fois ; utilisez «-» pour aucun.",
  "Invalid FEN: piece data must use 1–8 for empty squares.":
    "FEN non valide : utilisez 1–8 pour les cases vides.",
  "An en passant target needs a zero half-move counter because the last move was a pawn move.":
    "Une case en passant exige un compteur de demi-coups à zéro, car le dernier coup était un mouvement de pion.",
  "The en passant square needs an opposing pawn that has just advanced two squares. Check the FEN’s fourth field.":
    "La case en passant exige un pion adverse qui vient d’avancer de deux cases. Vérifiez le quatrième champ du FEN.",
  "{0} wins by checkmate.": "Les {0} gagnent par échec et mat.",
  "Stalemate. There are no legal moves, and the king is safe.":
    "Pat. Aucun coup légal et le roi n’est pas en échec.",
  "Draw by threefold repetition.": "Nulle par triple répétition.",
  "Draw. Neither side has enough material to checkmate.":
    "Nulle. Aucun camp n’a assez de matériel pour mater.",
  "Draw by the fifty-move rule.": "Nulle par la règle des cinquante coups.",
  "Chess board and position controls": "Échiquier et commandes de position",
  "Start a new game from the standard chess position":
    "Commencer une partie depuis la position initiale",
  "New game": "Nouvelle partie",
  "Clear board": "Vider l’échiquier",
  "Game move navigation": "Navigation des coups",
  "Previous game move": "Coup précédent",
  "Next game move": "Coup suivant",
  "Flip board": "Retourner l’échiquier",
  "See your coach": "Voir votre coach",
  "{0} {1}": "{1} · {0}",
  "Calculate best moves to see the evaluation":
    "Calculez les meilleurs coups pour voir l’évaluation",
  "Evaluation paused during board preview":
    "Évaluation en pause pendant l’aperçu",
  "+ = White ahead · − = Black ahead":
    "+ = avantage aux Blancs · − = avantage aux Noirs",
  "White evaluation {0}": "Évaluation côté Blancs : {0}",
  "Evaluation pending": "Évaluation en attente",
  "Move preview chessboard": "Échiquier d’aperçu",
  "Game history chessboard": "Échiquier de l’historique",
  "Interactive chessboard": "Échiquier interactif",
  " empty": " vide",
  " in check": " en échec",
  "Place {0} {1}": "Placer : {1} · {0}",
  "Add {0} {1} · Click or drag to board":
    "Ajouter : {1} · {0} · Cliquez ou glissez sur l’échiquier",
  "Other good options": "Autres bonnes options",
  "Position estimate in pawn units: + favors White, − favors Black.":
    "Estimation en pions : + favorise les Blancs, − les Noirs.",
  "Play {0}": "Jouer {0}",
  "Before moving, check whether their pieces can reach your king on {0}. Here, {1} ends the game.":
    "Avant de jouer, vérifiez si leurs pièces peuvent atteindre votre roi en {0}. Ici, {1} termine la partie.",
  "See their checkmate threat": "Voir leur menace de mat",
  "leaves your {0} on {1} with no defender. Their {2} can take it with {3}":
    "laisse votre {0} en {1} sans défense. Leur {2} peut capturer cette pièce avec {3}",
  "allows their {0} to take your {1} on {2} with {3}. Your piece has a defender, so follow the rest of the trade":
    "permet à leur {0} de capturer votre {1} en {2} avec {3}. Votre pièce est défendue ; suivez la suite de l’échange",
  "Before moving, check which of your pieces they can capture and whether you can capture back.":
    "Avant de jouer, vérifiez quelles pièces peuvent être capturées et si vous pouvez reprendre.",
  "Before accepting a trade, compare the pieces both sides can capture, including the next reply.":
    "Avant d’accepter un échange, comparez les captures possibles des deux camps, y compris la réponse suivante.",
  "See the piece they can capture": "Voir la pièce qu’ils peuvent capturer",
  "allows the shown line to reach {0}, where their {1} takes your {2} on {3}. Further trades may follow":
    "permet d’atteindre {0} dans la ligne affichée, où leur {1} capture votre {2} en {3}. D’autres échanges peuvent suivre",
  "Follow their checks as well as their captures. A check may force you to respond before you can protect another piece.":
    "Suivez leurs échecs autant que leurs captures. Un échec peut vous obliger à répondre avant de protéger une autre pièce.",
  "Look beyond their first reply: follow the next captures too before deciding whether a trade helps you.":
    "Regardez au-delà de leur première réponse : suivez les captures suivantes avant de juger un échange.",
  "See the later capture in this line":
    "Voir la capture ultérieure dans cette ligne",
  "your {0} on {1}": "votre {0} en {1}",
  " and ": " et ",
  "allows a fork: their {0} on {1} attacks {2} at once":
    "permet une fourchette : leur {0} en {1} attaque {2} à la fois",
  "Look for replies that attack two pieces at once. Moving or protecting one may leave the other under attack.":
    "Cherchez les réponses qui attaquent deux pièces à la fois. En sauver une peut laisser l’autre sous attaque.",
  "See the two attacks": "Voir les deux attaques",
  "Compare the capture on {0} with {1}. Preview their reply before deciding whether the capture helps.":
    "Comparez la capture en {0} avec {1}. Regardez leur réponse avant de décider si la capture vous aide.",
  "Check which of your pieces need protection. {0} offers another way to defend your position.":
    "Vérifiez quelles pièces ont besoin de protection. {0} offre une autre façon de défendre votre position.",
  "Check whether a piece is under attack before starting another plan. {0} moves a piece out of danger.":
    "Vérifiez si une pièce est attaquée avant de lancer un autre plan. {0} met une pièce à l’abri.",
  "Check their checks, captures, and attacks before choosing your move. Preview {0} to compare the alternative.":
    "Vérifiez leurs échecs, captures et attaques avant de choisir. Regardez {0} pour comparer l’alternative.",
  "The move needs analysis of the resulting position.":
    "Le coup nécessite une analyse de la position résultante.",
  "{0} delivers checkmate. Their king has no way out—you’ve finished the game.":
    "{0} donne échec et mat. Leur roi n’a aucune issue : vous avez terminé la partie.",
  "{0} is the top choice here. {1}": "{0} est le meilleur choix ici. {1}",
  "gets you a draw, close to the best result found here":
    "obtient la nulle, proche du meilleur résultat trouvé ici",
  "keeps your checkmate on track in the analyzed line":
    "préserve le mat dans la ligne analysée",
  "holds up about as well as the best defense found here, though the analysis still finds mate against you":
    "résiste presque aussi bien que la meilleure défense trouvée, même si l’analyse voit toujours un mat contre vous",
  "keeps your strong advantage. You’re still in a great position":
    "préserve votre net avantage. Votre position reste excellente",
  "holds up about as well as the best option in an already tough position":
    "résiste presque aussi bien que la meilleure option dans une position déjà difficile",
  "looks good here, with chances close to {0}":
    "semble bon ici, avec des chances proches de {0}",
  "leads to a draw. {0} offered better chances":
    "mène à la nulle. {0} offrait de meilleures chances",
  "allows a forced checkmate in the analyzed line":
    "permet un mat forcé dans la ligne analysée",
  "lets a forced checkmate slip away": "laisse échapper un mat forcé",
  "gives your opponent better chances than {0} would":
    "donne à l’adversaire de meilleures chances que {0}",
  "Try the other move to see what you could keep playing for.":
    "Essayez l’autre coup pour voir ce que vous pourriez encore viser.",
  "Play through the reply to see what they could do next.":
    "Parcourez la réponse pour voir ce qu’ils pourraient faire ensuite.",
  "Build pressure on {0}": "Accentuez la pression sur {0}",
  "Your {0} joins another piece in attacking their {1} on {2}. They now have more than one attacker to deal with.":
    "Votre {0} rejoint une autre pièce pour attaquer leur {1} en {2}. Ils doivent maintenant faire face à plusieurs attaquants.",
  "See the attack on their {0}": "Voir l’attaque sur leur {0}",
  "Support your center": "Soutenez votre centre",
  "Defend your {0}": "Défendez votre {0}",
  "Your {0} on {1} now defends the {2} on {3}. If they capture it, your {4} may be able to capture back; check the reply before trading.":
    "Votre {0} en {1} défend maintenant votre {2} en {3}. En cas de capture, votre {4} pourrait reprendre ; vérifiez la réponse avant d’échanger.",
  "See the defense of your {0}": "Voir la défense de votre {0}",
  "Move your {0} out of danger": "Mettez votre {0} à l’abri",
  "Your {0} was under attack on {1}. On {2}, none of their pieces currently attack it.":
    "Une attaque visait votre {0} en {1}. En {2}, aucune pièce adverse ne l’attaque actuellement.",
  "See your {0} move out of danger": "Voir votre {0} se mettre à l’abri",
  "Attack the {0}": "Attaquez leur {0}",
  "Your {0} on {1} attacks their {2} on {3}. Watch for a retreat, a defense, or a threat of their own.":
    "Votre {0} en {1} attaque leur {2} en {3}. Surveillez une retraite, une défense ou une menace adverse.",
  "Your {0} on {1} now attacks their {2} on {3}. They may move it or defend it, so look at the reply before counting on a capture.":
    "Votre {0} en {1} attaque maintenant leur {2} en {3}. Ils peuvent déplacer cette pièce ou la défendre ; regardez la réponse avant de compter sur une capture.",
  "{0} on {1}": "{0} en {1}",
  "Your {0} give check.": "Vos pièces ({0}) donnent échec.",
  "Your {0} gives check.": "Votre {0} donne échec.",
  "Your pawn promotes to a {0} on {1}. ":
    "Votre pion se promeut en {0} en {1}. ",
  "Finish with checkmate": "Terminez par échec et mat",
  "{0}Your {1} deliver checkmate. Their king has no way out.":
    "{0}Vos pièces ({1}) donnent échec et mat. Leur roi n’a aucune issue.",
  "{0}Your {1} delivers checkmate. Their king has no way out.":
    "{0}Votre {1} donne échec et mat. Leur roi n’a aucune issue.",
  "See the checkmate": "Voir l’échec et mat",
  "Promote your pawn": "Promouvez votre pion",
  "You now have a {0} in place of that pawn. Look at the reply to see how they respond.":
    "Vous avez maintenant une pièce ({0}) à la place du pion. Regardez leur réponse.",
  "See the promotion": "Voir la promotion",
  "Castle and bring your rook into play": "Roquez et activez votre tour",
  "Castling moves your king away from the center and brings your rook toward the middle.{0}":
    "Le roque éloigne votre roi du centre et rapproche votre tour du milieu.{0}",
  "See the king and rook move": "Voir le déplacement du roi et de la tour",
  "Get your king out of check": "Sortez votre roi de l’échec",
  "{0} gets you out of check{1}.{2}": "{0} vous sort de l’échec{1}.{2}",
  " and takes the {0} on {1}": " et capture leur {0} en {1}",
  " by blocking the attack with your {0}":
    " en bloquant l’attaque avec votre {0}",
  " by moving your king to {0}": " en déplaçant votre roi en {0}",
  " Your king is no longer under attack, so you can continue playing.":
    " Votre roi n’est plus attaqué, vous pouvez continuer à jouer.",
  "See how you escape check": "Voir comment sortir de l’échec",
  "Capture with check": "Capturez avec échec",
  "Capture the {0}": "Capturez leur {0}",
  "Your {0} takes the {1} on {2}{3}. {4}":
    "Votre {0} capture leur {1} en {2}{3}. {4}",
  " en passant, landing on ": " en passant, en arrivant en ",
  "Their pieces attack your {0} on {1}; preview the reply to check whether they capture back.":
    "Leurs pièces attaquent votre {0} en {1} ; regardez la réponse pour vérifier s’ils reprennent.",
  "None of their pieces currently attack your {0} on {1}.":
    "Aucune pièce adverse n’attaque actuellement votre {0} en {1}.",
  "See the capture and possible attackers":
    "Voir la capture et les attaquants possibles",
  "Give check": "Donnez échec",
  "{0} Your opponent has to deal with the attack on their king.":
    "{0} Votre adversaire doit répondre à l’attaque sur son roi.",
  "See the attack on their king": "Voir l’attaque sur leur roi",
  "From here, it attacks {0}, helping you control the center.":
    "Depuis cette case, la pièce attaque {0}, vous aidant à contrôler le centre.",
  "Bringing pieces off the starting row gives you more pieces to use in your next moves.":
    "Sortir les pièces de leur rangée de départ vous donne plus de pièces disponibles pour les prochains coups.",
  "Bring another piece into play": "Développez une autre pièce",
  "Your {0} comes off the back rank to {1}. {2}":
    "Votre {0} quitte la rangée de départ pour {1}. {2}",
  "See your piece and the center squares":
    "Voir votre pièce et les cases centrales",
  "Claim the center": "Occupez le centre",
  "Your pawn takes space in the center on {0}. It attacks {1}, helping limit where their pieces can move safely.":
    "Votre pion gagne de l’espace au centre en {0}. Il attaque {1}, limitant les cases sûres pour leurs pièces.",
  "See the pawn’s control of the center": "Voir le contrôle central du pion",
  "Put your rook on an open file": "Placez votre tour sur une colonne ouverte",
  "There are no pawns on the {0}-file, the column your rook moves to. With no pawns in that column, look for squares your rook can reach before another piece blocks its path.":
    "Aucun pion sur la colonne {0}, où se place votre tour. Cherchez les cases qu’elle peut atteindre avant qu’une autre pièce ne lui bloque le passage.",
  "See the open file": "Voir la colonne ouverte",
  "Improve your rook’s position": "Améliorez la position de votre tour",
  "Try your rook on {0}. Play through the reply below to see which lines and targets it can work with.":
    "Essayez votre tour en {0}. Parcourez la réponse pour voir quelles lignes et cibles elle peut exploiter.",
  "See your rook’s move": "Voir le coup de votre tour",
  "Improve your king’s position": "Améliorez la position de votre roi",
  "Your king steps from {0} to {1}. Check what their pieces can do before choosing its next square.":
    "Votre roi passe de {0} à {1}. Vérifiez les possibilités adverses avant de choisir sa prochaine case.",
  "See your king’s move": "Voir le coup de votre roi",
  "Gain space with your pawn": "Gagnez de l’espace avec votre pion",
  "Your pawn moves up to {0}, claiming more space. Keep an eye on the squares it leaves behind.":
    "Votre pion avance en {0} et gagne de l’espace. Surveillez les cases qu’il laisse derrière lui.",
  "See your pawn’s advance": "Voir l’avancée de votre pion",
  "Improve a piece near the center": "Améliorez une pièce près du centre",
  "Your {0} moves to {1}, near the center. {2}":
    "Votre {0} se place en {1}, près du centre. {2}",
  "Preview the reply to see how they can respond before choosing its next move.":
    "Regardez leur réponse avant de choisir le prochain coup de cette pièce.",
  "See the move near the center": "Voir le coup près du centre",
  "Reposition your {0}": "Replacez votre {0}",
  "Try your {0} on {1}. Play through the next few moves to see how your opponent can respond and where your pieces end up.":
    "Essayez votre {0} en {1}. Parcourez les prochains coups pour voir les réponses adverses et les positions finales de vos pièces.",
  "See your {0}’s move": "Voir le coup de votre {0}",
  "They can checkmate with {0} ({1} to {2}).":
    "Ils peuvent mater avec {0} ({1} en {2}).",
  "castle {0}": "roquer {0}",
  kingside: "du petit côté",
  queenside: "du grand côté",
  "take your {0} on {1}{2} with their {3}":
    "capturer votre {0} en {1}{2} avec leur {3}",
  " en passant": " en passant",
  "move their {0} to {1}": "déplacer leur {0} en {1}",
  " and promote to a {0}": " et promouvoir en {0}",
  " and give check": " et donner échec",
  "They may {0}{1}{2} ({3}).": "Ils peuvent {0}{1}{2} ({3}).",
  "Deal with the check first. Look for a king move, a way to take the attacker, or a piece that can block the attack.":
    "Répondez d’abord à l’échec. Cherchez un coup de roi, une capture de l’attaquant ou une pièce pour bloquer l’attaque.",
  "Your {0} on {1} is under attack with no defender. Can you move it, protect it, or make a threat they have to answer first?":
    "Votre {0} en {1} subit une attaque sans défense. Pouvez-vous déplacer ou protéger cette pièce, ou créer une menace prioritaire ?",
  "Your {0} on {1} is under attack. It has a defender, but play out the trade before leaving it there.":
    "Votre {0} en {1} subit une attaque. Une autre pièce assure sa défense, mais examinez l’échange avant de laisser cette pièce sur place.",
  "Before you move, take a quick look at their checks, captures, and attacks on unprotected pieces. Start with the likely reply below your move.":
    "Avant de jouer, regardez leurs échecs, captures et attaques sur les pièces non protégées. Commencez par la réponse probable sous votre coup.",
  "{0} puts {1} under attack from your {2}.":
    "{0} met {1} sous l’attaque de votre {2}.",
  "their {0} on {1}": "leur {0} en {1}",
  "Your {0} is under attack with no defender.":
    "Votre {0} subit une attaque sans défense.",
  "Your {0} are under attack with no defender.":
    "Vos pièces ({0}) sont attaquées sans défense.",
  "Your pieces cover {0} in the center.":
    "Vos pièces contrôlent {0} au centre.",
  "{0} finishes this line with checkmate.":
    "{0} termine cette ligne par échec et mat.",
  "The preview ends with {0} playing {1}, a capture. The exchange may continue.":
    "L’aperçu se termine par une capture : les {0} jouent {1}. L’échange peut continuer.",
  "In this possible line, you’d gain the equivalent of {0} pawn in material.":
    "Dans cette ligne possible, vous gagneriez l’équivalent de {0} pion de matériel.",
  "In this possible line, you’d gain the equivalent of {0} pawns in material.":
    "Dans cette ligne possible, vous gagneriez l’équivalent de {0} pions de matériel.",
  "In this possible line, you’d give up the equivalent of {0} pawn in material.":
    "Dans cette ligne possible, vous céderiez l’équivalent de {0} pion de matériel.",
  "In this possible line, you’d give up the equivalent of {0} pawns in material.":
    "Dans cette ligne possible, vous céderiez l’équivalent de {0} pions de matériel.",
  "The material balance stays the same in this line.":
    "L’équilibre matériel reste inchangé dans cette ligne.",
  "{0} puts your king in check. Getting out of check comes first.":
    "{0} met votre roi en échec. Sortir de l’échec est prioritaire.",
  "{0} leaves your {1} on {2} under attack with no defender. Take care of it before carrying on with your plan.":
    "{0} laisse votre {1} en {2} sans défense face à une attaque. Occupez-vous-en avant de poursuivre votre plan.",
  "They’ve just taken your {0} with {1}. Look at {2} before deciding how to answer.":
    "Ils viennent de capturer votre {0} avec {1}. Regardez {2} avant de choisir votre réponse.",
  "{0} changes their control of {1}. Try {2} now, and see how they might respond.":
    "{0} modifie leur contrôle de {1}. Essayez {2} et regardez leurs réponses possibles.",
  "Their {0} is now on {1}. Try {2}{3}.":
    "Leur {0} est maintenant en {1}. Essayez {2}{3}.",
  "; one reply to look at is {0}": " ; une réponse à examiner est {0}",
  " and see how they respond": " et regardez leur réponse",
  "This position has only one legal move.":
    "Cette position n’a qu’un seul coup légal.",
  "{0} is the only recommended move here. The other moves checked give up too much compared with it.":
    "{0} est le seul coup recommandé ici. Les autres coups analysés concèdent trop en comparaison.",
  "Here, checkmate threats matter more than a small difference in score. Play through {0} and {1}, and follow the checks carefully.":
    "Ici, les menaces de mat comptent plus qu’un petit écart de score. Parcourez {0} et {1} en suivant attentivement les échecs.",
  "{0} and {1} both look good here. Play through their replies and choose the position you’d rather have.":
    "{0} et {1} semblent tous deux bons. Parcourez leurs réponses et choisissez la position que vous préférez.",
  "{0} looks stronger than {1} here. Play through both replies to see how the positions differ.":
    "{0} semble plus fort que {1}. Parcourez les deux réponses pour comparer les positions.",
  "Preview likely reply: {0}": "Aperçu de la réponse probable : {0}",
  "LIKELY REPLY": "RÉPONSE PROBABLE",
  "Engine continuation": "Suite du moteur",
  "POSSIBLE NEXT MOVES": "PROCHAINS COUPS POSSIBLES",
  "Preview move {0}: {1} plays {2}": "Aperçu du coup {0} : les {1} jouent {2}",
  "The engine returned no legal candidates. Please retry analysis.":
    "Le moteur n’a renvoyé aucun coup légal. Relancez l’analyse.",
  "About this position": "À propos de cette position",
  "WHAT CHANGED": "CE QUI A CHANGÉ",
  "Hide key squares": "Masquer les cases clés",
  "Highlight key squares": "Surligner les cases clés",
  "Teal outlines mark the squares discussed above: {0}.":
    "Les contours turquoise indiquent les cases évoquées : {0}.",
  "Analyzing…": "Analyse en cours…",
  "Engine unavailable": "Moteur indisponible",
  "Recommendations ready": "Recommandations prêtes",
  "Reviewing {0}. Analysis is for this position.":
    "Examen de {0}. L’analyse concerne cette position.",
  "Let’s try that again.": "Essayons à nouveau.",
  "Retry analysis": "Relancer l’analyse",
  "Best move and strategy": "Meilleur coup et stratégie",
  "FINDING YOUR MOVE": "RECHERCHE DE VOTRE COUP",
  "Finding {0}’s best move…": "Recherche du meilleur coup des {0}…",
  "Looking at your options and their replies from this earlier position.":
    "Examen de vos options et de leurs réponses depuis cette position antérieure.",
  "Checking your options and your opponent’s replies. Feel free to keep playing.":
    "Examen de vos options et des réponses adverses. Vous pouvez continuer à jouer.",
  "Checking deeper · depth {0}": "Analyse approfondie · profondeur {0}",
  "Usually ready in a couple of seconds":
    "Généralement prêt en quelques secondes",
  "Watch out for": "Attention à",
  "Hover or focus to highlight the threatened piece and its attackers.":
    "Survolez ou placez le focus pour surligner la pièce menacée et ses attaquants.",
  "Escape check": "Sortez de l’échec",
  "BEST MOVE": "MEILLEUR COUP",
  "Only legal move": "Seul coup légal",
  "Plan continues": "Le plan continue",
  "Play best move {0}": "Jouer le meilleur coup {0}",
  "Hide reply": "Masquer la réponse",
  "Preview reply": "Voir la réponse",
  "Explore next moves": "Explorer les coups suivants",
  "The engine could not review this move. Try again.":
    "Le moteur n’a pas pu examiner ce coup. Réessayez.",
  "The engine could not reliably compare this move. Try again.":
    "Le moteur n’a pas pu comparer ce coup de façon fiable. Réessayez.",
  "The engine could not check the reply. Try again.":
    "Le moteur n’a pas pu vérifier la réponse. Réessayez.",
  "Reviewing…": "Examen en cours…",
  "Review unavailable": "Examen indisponible",
  "Move feedback": "Évaluation du coup",
  "{0}: {1}. {2}. {3} details": "{0} : {1}. {2}. {3} les détails",
  Show: "Afficher",
  Hide: "Masquer",
  "Looking at your move and the best alternatives…":
    "Examen de votre coup et des meilleures alternatives…",
  "Retry move review": "Relancer l’examen du coup",
  "Next time": "La prochaine fois",
  "Likely reply": "Réponse probable",
  "The evaluation difference is measured in pawn units. Grades account for the overall position; mate outcomes have no pawn score.":
    "L’écart d’évaluation est mesuré en pions. Les notes tiennent compte de toute la position ; le mat n’a pas de valeur en pions.",
  "Quick review": "Examen rapide",
  "{0} evaluation drop": "{0} de baisse d’évaluation",
  "Keep the mating attack going": "Poursuivez l’attaque de mat",
  "There’s a checkmate in {0} moves starting with {1}, according to this analysis. Play through the replies to see how the attack works.":
    "Selon cette analyse, il y a un mat en {0} coups en commençant par {1}. Parcourez les réponses pour comprendre l’attaque.",
  "See the start of the mating attack": "Voir le début de l’attaque de mat",
  "Find the toughest defense": "Trouvez la défense la plus tenace",
  "Your king is in serious trouble: this analysis still finds a forced checkmate after {0}. Play through their checks to see where the danger comes from.":
    "Votre roi est en grand danger : l’analyse trouve toujours un mat forcé après {0}. Parcourez leurs échecs pour comprendre le danger.",
  "See the defensive move": "Voir le coup défensif",
  "No reply is included in this preview. Try the move to explore what comes next.":
    "Cet aperçu ne contient pas de réponse. Essayez le coup pour explorer la suite.",
  " You could follow with {0}: {1}.":
    " Vous pourriez poursuivre par {0} : {1}.",
  "That’s checkmate. They have no reply.":
    "C’est échec et mat. Ils n’ont aucune réponse.",
  "This move ends the game in a draw.":
    "Ce coup termine la partie par la nulle.",
  "A forced mate for {0}": "Mat forcé pour les {0}",
  "A balanced position": "Position équilibrée",
  "{0} has a small edge": "Les {0} ont un léger avantage",
  "{0} has the advantage": "Les {0} ont l’avantage",
  "{0} has a winning advantage": "Les {0} ont un avantage décisif",
  Checkmate: "Échec et mat",
  Draw: "Nulle",
  "Preview · Check": "Aperçu · Échec",
  Preview: "Aperçu",
  Check: "Échec",
  Paused: "En pause",
  "Replying…": "Réponse en cours…",
  "Thinking…": "Réflexion…",
  Reviewing: "Examen",
  "Your turn": "À vous de jouer",
  "Position analysis": "Analyse de position",
  "Your coach": "Votre coach",
  "To move": "Trait aux",
  "Who plays next": "Qui joue maintenant",
  "Changing the player starts a new position and clears the move history.":
    "Changer le trait crée une nouvelle position et efface l’historique.",
  "Back to board ↑": "Retour à l’échiquier ↑",
  "Waiting for computer": "En attente de l’ordinateur",
  "Calculating best moves": "Calcul des meilleurs coups",
  "Calculate best moves": "Calculer les meilleurs coups",
  "Waiting for computer…": "En attente de l’ordinateur…",
  "Calculating…": "Calcul en cours…",
  "Dismiss error": "Fermer l’erreur",
  "Move history controls": "Commandes de l’historique",
  "Back to latest": "Revenir au présent",
  "Preview · {0}": "Aperçu · {0}",
  "Reviewing {0} · Updating this position’s analysis":
    "Examen de {0} · Mise à jour de l’analyse",
  "Reviewing {0} · Analysis is for this position":
    "Examen de {0} · L’analyse concerne cette position",
  "Reviewing {0} · Calculate when you want guidance":
    "Examen de {0} · Lancez l’analyse pour des conseils",
  "Computer moves in a moment…": "L’ordinateur va jouer dans un instant…",
  "Computer is choosing a reply…": "L’ordinateur choisit une réponse…",
  "Updating {0}’s analysis · You can keep playing":
    "Mise à jour de l’analyse des {0} · Vous pouvez continuer à jouer",
  "Return to game": "Revenir à la partie",
  "Arrange a legal position with both kings to play the computer.":
    "Créez une position légale avec les deux rois pour jouer contre l’ordinateur.",
  "This game has ended. Start a new game to play.":
    "Cette partie est terminée. Commencez une nouvelle partie.",
  "Return to your game to continue playing.":
    "Revenez à votre partie pour continuer à jouer.",
  "Turn on “Play computer” to play against {0}.":
    "Activez «Jouer contre l’ordinateur» pour affronter les {0}.",
  "Game paused while you choose your settings.":
    "Partie en pause pendant le choix des réglages.",
  "The computer could not choose a move. Try again.":
    "L’ordinateur n’a pas pu choisir un coup. Réessayez.",
  "Computer is thinking…": "L’ordinateur réfléchit…",
  "Your turn. Make a move on the board.":
    "À vous de jouer. Jouez un coup sur l’échiquier.",
  "Your computer difficulty could not be saved in this browser.":
    "Le niveau de l’ordinateur n’a pas pu être enregistré dans ce navigateur.",
  "Play computer": "Jouer contre l’ordinateur",
  Computer: "Ordinateur",
  "Computer settings": "Réglages de l’ordinateur",
  "Retry computer": "Relancer l’ordinateur",
  "Close computer settings": "Fermer les réglages de l’ordinateur",
  "You play as": "Votre camp",
  "Your challenge": "Votre défi",
  Retry: "Réessayer",
  Done: "Terminé",
  "Starting position": "Position initiale",
  "Browser storage is unavailable or full. Your latest changes may not survive a reload.":
    "Le stockage du navigateur est indisponible ou plein. Vos dernières modifications pourraient être perdues au rechargement.",
  "The original save could not be backed up. Autosave remains paused. Your latest changes may not survive a reload.":
    "Impossible de sauvegarder les données d’origine. L’enregistrement automatique reste en pause. Les dernières modifications pourraient être perdues au rechargement.",
  "Continuing from the selected position.":
    "Reprise depuis la position sélectionnée.",
  "Game result": "Résultat de la partie",
  CHECKMATE: "ÉCHEC ET MAT",
  DRAW: "NULLE",
  "Honors shared.": "Les honneurs sont partagés.",
  "A royal finish. Ready for another round?":
    "Une fin royale. Une autre partie ?",
  "Good game. There’s always another round.":
    "Belle partie. Il y aura toujours une autre manche.",
  "Final score: White {0}, Black {1}": "Score final : Blancs {0}, Noirs {1}",
  "Play again": "Rejouer",
  "Choose a promotion piece": "Choisissez une pièce de promotion",
  "Cancel promotion": "Annuler la promotion",
  "Your pawn made it.": "Votre pion y est arrivé.",
  "Choose its next chapter.": "Choisissez sa nouvelle vie.",
  "Promote to {0}": "Promouvoir en {0}",
  "Game saving status": "État de l’enregistrement",
  "Saved game needs recovery": "La partie enregistrée doit être récupérée",
  "Browser save unavailable": "Enregistrement indisponible",
  "Original save preserved": "Données d’origine conservées",
  "The original data is kept in a separate browser recovery backup. Autosave has resumed.":
    "Les données d’origine sont conservées dans une copie de récupération distincte du navigateur. L’enregistrement automatique a repris.",
  "Keep current game & resume saving":
    "Garder la partie et reprendre l’enregistrement",
  "Dismiss recovery notice": "Fermer l’avis de récupération",
  "This FEN is not valid.": "Ce FEN n’est pas valide.",
  "Clipboard access is unavailable. Select the FEN text and copy it manually.":
    "Le presse-papiers est indisponible. Sélectionnez le texte FEN et copiez-le manuellement.",
  "FEN position controls": "Commandes de position FEN",
  "FEN position": "Position FEN",
  "Paste a FEN position": "Collez une position FEN",
  "Copy current FEN": "Copier le FEN actuel",
  Load: "Charger",
  "Browser storage could not be read. Your saved game may be unavailable.":
    "Impossible de lire le stockage du navigateur. Votre partie enregistrée pourrait être indisponible.",
  "Your saved game could not be read. The last valid position was restored, without its move history. Autosave is paused to protect the original data.":
    "Impossible de lire votre partie enregistrée. La dernière position valide a été restaurée sans historique. L’enregistrement automatique est en pause pour protéger les données d’origine.",
  "Your saved game could not be read. A fresh board is open. Autosave is paused to protect the original data.":
    "Impossible de lire votre partie enregistrée. Un nouvel échiquier est ouvert. L’enregistrement automatique est en pause pour protéger les données d’origine.",
  "Recovery backup could not be verified.":
    "La copie de récupération n’a pas pu être vérifiée.",
  "Game moves": "Coups de la partie",
  "Move history": "Historique des coups",
  "View starting position": "Voir la position initiale",
  Start: "Début",
  "View position after {0}": "Voir la position après {0}",
  pawn: "pion",
  knight: "cavalier",
  bishop: "fou",
  rook: "tour",
  queen: "dame",
  king: "roi",
  Beginner: "Débutant",
  Easy: "Facile",
  Medium: "Moyen",
  Hard: "Difficile",
  Expert: "Expert",
  "Best move": "Meilleur coup",
  "Good move": "Bon coup",
  Inaccuracy: "Imprécision",
  Mistake: "Erreur",
  Blunder: "Gaffe",
  "Your last move": "Votre dernier coup",
  "Selected move": "Coup sélectionné",
  "Tempo — Your next move, explained.":
    "Tempo — Votre prochain coup, expliqué.",
  "must contain six space-delimited fields":
    "doit contenir six champs séparés par des espaces",
  "move number must be a positive integer":
    "le numéro du coup doit être un entier positif",
  "half move counter number must be a non-negative integer":
    "le compteur de demi-coups doit être un entier positif ou nul",
  "en-passant square is invalid": "la case en passant n’est pas valide",
  "castling availability is invalid": "les droits de roque ne sont pas valides",
  "side-to-move is invalid": "le trait n’est pas valide",
  "piece data does not contain 8 '/'-delimited rows":
    "les données des pièces doivent contenir 8 rangées séparées par «/»",
  "piece data is invalid (consecutive number)":
    "données de pièces non valides : nombres consécutifs",
  "piece data is invalid (invalid piece)":
    "données de pièces non valides : pièce inconnue",
  "piece data is invalid (too many squares in rank)":
    "données de pièces non valides : trop de cases dans une rangée",
  "illegal en-passant square": "case en passant illégale",
  "some pawns are on the edge rows":
    "des pions sont sur la première ou la dernière rangée",
  "Last move": "Dernier coup",
  "Position loaded": "Position chargée",
  "Position copied": "Position copiée",
  "piece data must use 1–8 for empty squares.":
    "utilisez 1–8 pour les cases vides",
  "{0} wins!": "Les {0} gagnent !",
  "{0} pieces": "Pièces des {0}",
  "Alternative: {0}. {1}. {2}": "Alternative : {0}. {1}. {2}",
} satisfies Catalog;
