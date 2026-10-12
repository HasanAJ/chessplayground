import type { Square } from "chess.js";
import { text, type Localized } from "./content";
import { setupLength, type OpeningBranch, type OpeningLesson } from "./lessons";

export type TeachingNote = {
  ply: number;
  explanation: Localized;
  squares: readonly Square[];
  arrows: readonly (readonly [Square, Square])[];
};

function note(
  ply: number,
  explanation: Localized,
  arrows: TeachingNote["arrows"] = [],
  squares: readonly Square[] = [],
): TeachingNote {
  return {
    ply,
    explanation,
    arrows,
    squares: [...new Set([...squares, ...arrows.flat()])],
  };
}

// Plies count from the first move after the shared setup, separately for each branch.
export const annotations: Record<
  string,
  Record<OpeningBranch, readonly TeachingNote[]>
> = {
  "wayward-rook": {
    trap: [
      note(
        1,
        text(
          "g6 chases the queen but leaves e5 undefended. Taking e5 gives check and opens the diagonal to h8.",
          "g6 ataca la dama, pero deja e5 sin defensa. Capturarlo da jaque y abre la diagonal a h8.",
          "g6 greift die Dame an, lässt aber e5 ungedeckt. Das Schlagen gibt Schach und öffnet die Diagonale nach h8.",
          "g6 attacca la donna ma lascia e5 indifeso. La cattura dà scacco e apre la diagonale verso h8.",
          "g6 attaque la dame mais laisse e5 sans défense. La capture donne échec et ouvre la diagonale vers h8.",
        ),
        [["h5", "e5"]],
      ),
      note(
        2,
        text(
          "The queen attacks the king on e8 and rook on h8 together. Black must answer the check first.",
          "La dama ataca al rey e8 y a la torre h8 a la vez. Las negras deben responder al jaque.",
          "Die Dame greift König e8 und Turm h8 zugleich an. Schwarz muss zuerst das Schach abwehren.",
          "La donna attacca insieme il re e8 e la torre h8. Il Nero deve prima parare lo scacco.",
          "La dame attaque ensemble le roi e8 et la tour h8. Les Noirs doivent d’abord parer l’échec.",
        ),
        [
          ["e5", "e8"],
          ["e5", "h8"],
        ],
      ),
      note(
        4,
        text(
          "The queen takes the corner rook. White has won a rook and pawn, but still needs to develop safely.",
          "La dama captura la torre de la esquina. Las blancas ganan torre y peón, pero aún deben desarrollar con seguridad.",
          "Die Dame schlägt den Eckturm. Weiß gewinnt Turm und Bauer, muss sich aber noch sicher entwickeln.",
          "La donna prende la torre d’angolo. Il Bianco guadagna torre e pedone, ma deve ancora svilupparsi con sicurezza.",
          "La dame prend la tour du coin. Les Blancs gagnent tour et pion, mais doivent encore se développer prudemment.",
        ),
        [],
        ["h8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nc6 protects e5 before chasing the queen. The checking capture that won the rook is no longer available.",
          "Nc6 defiende e5 antes de atacar la dama. Ya no existe la captura con jaque que ganaba la torre.",
          "Nc6 deckt e5 vor dem Angriff auf die Dame. Das Schlagen mit Schach und Turmgewinn funktioniert nicht mehr.",
          "Nc6 difende e5 prima di attaccare la donna. La cattura con scacco che vinceva la torre non funziona più.",
          "Nc6 protège e5 avant de chasser la dame. La capture avec échec qui gagnait la tour ne fonctionne plus.",
        ),
        [["c6", "e5"]],
      ),
    ],
  },
  "scholars-mate": {
    trap: [
      note(
        1,
        text(
          "Nf6 attacks the queen but ignores f7. The bishop on c4 already supports the queen’s mating capture.",
          "Nf6 ataca la dama, pero ignora f7. El alfil c4 ya protege a la dama cuando captura en f7 para dar mate.",
          "Nf6 greift die Dame an, übersieht aber f7. Der Läufer c4 deckt bereits das Mattfeld der Dame.",
          "Nf6 attacca la donna ma ignora f7. L’alfiere c4 protegge già la donna quando cattura in f7 per dare matto.",
          "Nf6 attaque la dame mais oublie f7. Le fou c4 protège déjà la dame lorsqu’elle prend en f7 pour donner mat.",
        ),
        [
          ["h5", "f7"],
          ["c4", "f7"],
        ],
      ),
      note(
        2,
        text(
          "The bishop protects the queen on f7, so the king cannot capture her. Every escape is covered: checkmate.",
          "El alfil protege la dama f7: el rey no puede capturarla. No hay casilla de escape: jaque mate.",
          "Der Läufer deckt die Dame auf f7; der König kann sie nicht schlagen. Es gibt kein Fluchtfeld: Matt.",
          "L’alfiere protegge la donna f7: il re non può catturarla. Non ci sono vie di fuga: scacco matto.",
          "Le fou protège la dame f7 : le roi ne peut pas la prendre. Aucune fuite n’est possible : échec et mat.",
        ),
        [["c4", "f7"]],
        ["e8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "g6 blocks the queen’s route to f7 and attacks her. White must spend another move moving the queen.",
          "g6 corta el camino de la dama a f7 y la ataca. Las blancas deben volver a moverla.",
          "g6 versperrt der Dame den Weg nach f7 und greift sie an. Weiß muss die Dame erneut ziehen.",
          "g6 blocca il percorso della donna verso f7 e la attacca. Il Bianco deve muoverla di nuovo.",
          "g6 coupe la route de la dame vers f7 et l’attaque. Les Blancs doivent encore la déplacer.",
        ),
        [["g6", "h5"]],
      ),
    ],
  },
  "scholars-f3": {
    trap: [
      note(
        1,
        text(
          "d6 supports the centre but does nothing about f7. The queen and bishop can still combine there.",
          "d6 sostiene el centro, pero no defiende f7. La dama y el alfil aún pueden combinar allí.",
          "d6 stützt das Zentrum, schützt aber f7 nicht. Dame und Läufer können dort weiter zusammen angreifen.",
          "d6 sostiene il centro ma non difende f7. Donna e alfiere possono ancora attaccare insieme lì.",
          "d6 soutient le centre mais ne protège pas f7. Dame et fou peuvent toujours y combiner leurs forces.",
        ),
        [
          ["f3", "f7"],
          ["c4", "f7"],
        ],
      ),
      note(
        2,
        text(
          "The queen reaches f7 with the bishop’s protection. The trapped king has no legal reply.",
          "La dama llega a f7 protegida por el alfil. El rey encerrado no tiene respuesta legal.",
          "Die Dame erreicht f7 mit Läuferschutz. Der eingeschlossene König hat keinen legalen Gegenzug.",
          "La donna arriva in f7 protetta dall’alfiere. Il re intrappolato non ha risposte legali.",
          "La dame arrive en f7 protégée par le fou. Le roi enfermé n’a aucune réponse légale.",
        ),
        [["c4", "f7"]],
        ["e8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nf6 blocks the queen’s route up the f-file and develops a defender. The immediate mate is stopped.",
          "Nf6 corta el camino de la dama por la columna f y desarrolla una pieza. Detiene el mate inmediato.",
          "Nf6 blockiert den Weg der Dame auf der f-Linie und entwickelt einen Verteidiger. Das sofortige Matt ist verhindert.",
          "Nf6 blocca il percorso della donna sulla colonna f e sviluppa un difensore. Il matto immediato è fermato.",
          "Nf6 bloque la route de la dame sur la colonne f et développe un défenseur. Le mat immédiat est évité.",
        ),
        [],
        ["f6", "f7"],
      ),
    ],
  },
  "italian-fork": {
    trap: [
      note(
        1,
        text(
          "h6 asks the knight to retreat, but f7 is a stronger destination. From there it attacks queen and rook.",
          "h6 pide que el caballo retroceda, pero f7 es mejor: desde allí ataca dama y torre.",
          "h6 fordert den Springerrückzug, aber f7 ist stärker: Von dort greift er Dame und Turm an.",
          "h6 invita il cavallo a ritirarsi, ma f7 è più forte: da lì attacca donna e torre.",
          "h6 invite le cavalier à reculer, mais f7 est plus fort : il y attaque dame et tour.",
        ),
        [["g5", "f7"]],
      ),
      note(
        2,
        text(
          "The knight forks the queen on d8 and rook on h8. Saving the queen leaves the rook available.",
          "El caballo hace una horquilla a la dama d8 y la torre h8. Salvar la dama deja la torre indefensa.",
          "Der Springer gabelt Dame d8 und Turm h8. Wenn die Dame gerettet wird, bleibt der Turm angreifbar.",
          "Il cavallo attacca donna d8 e torre h8 insieme. Salvare la donna lascia la torre in presa.",
          "Le cavalier attaque ensemble la dame d8 et la tour h8. Sauver la dame laisse la tour en prise.",
        ),
        [
          ["f7", "d8"],
          ["f7", "h8"],
        ],
      ),
      note(
        4,
        text(
          "White takes the rook, but the knight is far from home. Plan its escape while developing the remaining pieces.",
          "Las blancas toman la torre, pero el caballo queda lejos. Prepara su salida mientras desarrollas las demás piezas.",
          "Weiß schlägt den Turm, doch der Springer steht weit weg. Plane seinen Rückweg und entwickle die übrigen Figuren.",
          "Il Bianco prende la torre, ma il cavallo è lontano. Prepara la sua fuga sviluppando gli altri pezzi.",
          "Les Blancs prennent la tour, mais le cavalier est loin. Préparez son retour en développant les autres pièces.",
        ),
        [],
        ["h8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "d5 attacks the bishop and interrupts its diagonal toward f7. Black fights the attack in the centre.",
          "d5 ataca el alfil y corta su diagonal a f7. Las negras combaten el ataque en el centro.",
          "d5 greift den Läufer an und unterbricht seine Diagonale nach f7. Schwarz begegnet dem Angriff im Zentrum.",
          "d5 attacca l’alfiere e interrompe la diagonale verso f7. Il Nero reagisce all’attacco al centro.",
          "d5 attaque le fou et coupe sa diagonale vers f7. Les Noirs combattent l’attaque au centre.",
        ),
        [["d5", "c4"]],
      ),
    ],
  },
  legal: {
    trap: [
      note(
        2,
        text(
          "Nxe5 offers the queen on d1. White’s bishops and knights are ready to attack before Black can use the extra material.",
          "Nxe5 ofrece la dama d1. Los alfiles y caballos blancos atacarán antes de que las negras aprovechen el material.",
          "Nxe5 bietet die Dame d1 an. Weiße Läufer und Springer greifen an, bevor Schwarz den Materialgewinn nutzen kann.",
          "Nxe5 offre la donna d1. Alfieri e cavalli bianchi attaccano prima che il Nero sfrutti il materiale in più.",
          "Nxe5 offre la dame d1. Fous et cavaliers blancs attaquent avant que les Noirs profitent du matériel gagné.",
        ),
        [["h5", "d1"]],
        ["c4", "c3"],
      ),
      note(
        3,
        text(
          "Taking the queen ignores Bxf7+. That check draws the king forward into the knights’ mating net.",
          "Tomar la dama ignora Bxf7+. Ese jaque atrae al rey a la red de mate de los caballos.",
          "Der Damenschlag übersieht Bxf7+. Dieses Schach lockt den König in das Mattnetz der Springer.",
          "Prendere la donna ignora Bxf7+. Lo scacco attira il re nella rete di matto dei cavalli.",
          "Prendre la dame oublie Bxf7+. Cet échec attire le roi dans le réseau de mat des cavaliers.",
        ),
        [["c4", "f7"]],
      ),
      note(
        6,
        text(
          "Nd5 gives check while the bishop and other knight cover the king’s escapes. The queen sacrifice ends in mate.",
          "Nd5 da jaque; el alfil y el otro caballo cubren las salidas. El sacrificio de dama acaba en mate.",
          "Nd5 gibt Schach; Läufer und zweiter Springer decken die Fluchtfelder. Das Damenopfer endet mit Matt.",
          "Nd5 dà scacco; alfiere e altro cavallo coprono le fughe. Il sacrificio di donna termina in matto.",
          "Nd5 donne échec ; le fou et l’autre cavalier couvrent les fuites. Le sacrifice de dame se termine par un mat.",
        ),
        [["d5", "e7"]],
        ["f7", "e5"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Bxf3 exchanges the attacking knight instead of preserving the pin. White recaptures, but the mating combination is gone.",
          "Bxf3 cambia el caballo atacante en vez de conservar la clavada. Las blancas recapturan, pero desaparece la combinación de mate.",
          "Bxf3 tauscht den Angriffsspringer statt die Fesselung zu erhalten. Weiß schlägt zurück, doch die Mattkombination entfällt.",
          "Bxf3 cambia il cavallo attaccante invece di mantenere l’inchiodatura. Il Bianco riprende, ma la combinazione di matto sparisce.",
          "Bxf3 échange le cavalier attaquant au lieu de maintenir le clouage. Les Blancs reprennent, mais la combinaison de mat disparaît.",
        ),
        [],
        ["f3"],
      ),
    ],
  },
  petrov: {
    trap: [
      note(
        3,
        text(
          "Retreating to f6 leaves the queen on d8 exposed to a knight jump that also uncovers check on the e-file.",
          "Retroceder a f6 deja la dama d8 expuesta a un salto de caballo que también descubre jaque por la columna e.",
          "Der Rückzug nach f6 lässt Dame d8 einem Springersprung ausgesetzt, der zugleich Schach auf der e-Linie aufdeckt.",
          "Ritirarsi in f6 lascia la donna d8 esposta a un salto di cavallo che scopre anche scacco sulla colonna e.",
          "Reculer en f6 expose la dame d8 à un saut de cavalier qui découvre aussi un échec sur la colonne e.",
        ),
        [["e5", "c6"]],
        ["e2", "d8"],
      ),
      note(
        4,
        text(
          "Moving the knight uncovers the queen’s check on e8 and attacks d8. Black must answer the king’s danger first.",
          "Mover el caballo descubre el jaque de la dama a e8 y ataca d8. Las negras deben salvar primero al rey.",
          "Der Springerzug öffnet das Damenschach auf e8 und greift d8 an. Schwarz muss zuerst den König schützen.",
          "Il cavallo scopre lo scacco della donna su e8 e attacca d8. Il Nero deve prima salvare il re.",
          "Le cavalier découvre l’échec de la dame sur e8 et attaque d8. Les Noirs doivent d’abord protéger le roi.",
        ),
        [
          ["e2", "e8"],
          ["c6", "d8"],
        ],
      ),
      note(
        7,
        text(
          "Black recaptures the knight, but has lost a queen for it. The discovered check made the material win possible.",
          "Las negras recapturan el caballo, pero han perdido una dama por él. El jaque descubierto permitió ganar material.",
          "Schwarz schlägt den Springer zurück, hat aber eine Dame dafür verloren. Das Abzugsschach ermöglichte den Materialgewinn.",
          "Il Nero riprende il cavallo, ma ha perso una donna in cambio. Lo scacco di scoperta ha permesso il guadagno.",
          "Les Noirs reprennent le cavalier, mais ont perdu une dame contre lui. L’échec à la découverte a permis ce gain.",
        ),
        [],
        ["d8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "d6 attacks White’s advanced knight before Black takes e4. This move order prevents the discovered-check trap.",
          "d6 ataca el caballo avanzado antes de tomar e4. Este orden evita la trampa del jaque descubierto.",
          "d6 greift den vorgerückten Springer an, bevor Schwarz e4 schlägt. Diese Zugfolge verhindert die Abzugsschachfalle.",
          "d6 attacca il cavallo avanzato prima di prendere e4. Questo ordine evita la trappola dello scacco di scoperta.",
          "d6 attaque le cavalier avancé avant de prendre e4. Cet ordre évite le piège de l’échec à la découverte.",
        ),
        [["d6", "e5"]],
      ),
    ],
  },
  "caro-smothered": {
    trap: [
      note(
        1,
        text(
          "Ngf6 develops naturally, but Nd6 will clear the e-file with check. The e7 pawn will then be pinned and unable to capture.",
          "Ngf6 desarrolla, pero Nd6 abrirá la columna e con jaque. Entonces e7 quedará clavado y no podrá capturar.",
          "Ngf6 entwickelt, doch Nd6 öffnet die e-Linie mit Schach. Dann ist e7 gefesselt und darf nicht schlagen.",
          "Ngf6 sviluppa, ma Nd6 aprirà la colonna e con scacco. Il pedone e7 sarà inchiodato e non potrà prendere.",
          "Ngf6 développe, mais Nd6 ouvrira la colonne e avec échec. Le pion e7 sera alors cloué et ne pourra pas prendre.",
        ),
        [
          ["e4", "d6"],
          ["e2", "e8"],
        ],
      ),
      note(
        2,
        text(
          "The knight checks from d6. The pinned e7 pawn cannot take it, and Black’s own pieces block the king’s escapes.",
          "El caballo da jaque desde d6. El peón e7 clavado no puede tomarlo, y las propias piezas bloquean al rey.",
          "Der Springer gibt auf d6 Schach. Der gefesselte e7-Bauer darf ihn nicht schlagen; eigene Figuren versperren die Flucht.",
          "Il cavallo dà scacco da d6. Il pedone e7 inchiodato non può prenderlo e i pezzi neri bloccano le fughe.",
          "Le cavalier donne échec depuis d6. Le pion e7 cloué ne peut pas le prendre, et les pièces noires bloquent les fuites.",
        ),
        [["d6", "e8"]],
        ["e7"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "The d7 knight goes to f6, leaving d7 available to the king. The smothered-mate pattern no longer works.",
          "El caballo d7 va a f6 y deja d7 libre para el rey. El patrón de mate ahogado ya no funciona.",
          "Der d7-Springer geht nach f6 und räumt d7 für den König. Das erstickte Matt funktioniert nicht mehr.",
          "Il cavallo d7 va in f6 e libera d7 per il re. Il matto affogato non funziona più.",
          "Le cavalier d7 va en f6 et libère d7 pour le roi. Le mat à l’étouffée ne fonctionne plus.",
        ),
        [],
        ["d7", "f6"],
      ),
    ],
  },
  budapest: {
    trap: [
      note(
        1,
        text(
          "Taking the bishop on b4 ignores Nd3#. That knight jump opens the queen’s line to e1, pinning the e2 pawn.",
          "Tomar el alfil b4 ignora Nd3#. Ese salto abre la línea de la dama a e1 y clava el peón e2.",
          "Das Schlagen auf b4 übersieht Nd3#. Der Springersprung öffnet die Damenlinie nach e1 und fesselt den e2-Bauern.",
          "Prendere l’alfiere b4 ignora Nd3#. Il salto apre la linea della donna verso e1 e inchioda il pedone e2.",
          "Prendre le fou b4 oublie Nd3#. Le saut ouvre la ligne de la dame vers e1 et cloue le pion e2.",
        ),
        [
          ["e5", "d3"],
          ["e7", "e1"],
        ],
      ),
      note(
        2,
        text(
          "The knight delivers mate on d3. The pinned pawn cannot capture, and White’s pieces leave the king no escape.",
          "El caballo da mate en d3. El peón clavado no puede capturar y las piezas blancas encierran a su rey.",
          "Der Springer setzt auf d3 matt. Der gefesselte Bauer darf nicht schlagen, und weiße Figuren sperren den König ein.",
          "Il cavallo dà matto in d3. Il pedone inchiodato non può prendere e i pezzi bianchi bloccano il re.",
          "Le cavalier mate en d3. Le pion cloué ne peut pas prendre et les pièces blanches enferment leur roi.",
        ),
        [["d3", "e1"]],
        ["e2"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nxe5 removes the knight that was threatening d3. White chooses to stop mate instead of taking the bishop.",
          "Nxe5 elimina el caballo que amenazaba d3. Las blancas frenan el mate en vez de tomar el alfil.",
          "Nxe5 entfernt den Springer, der d3 bedrohte. Weiß verhindert das Matt statt den Läufer zu schlagen.",
          "Nxe5 elimina il cavallo che minacciava d3. Il Bianco ferma il matto invece di prendere l’alfiere.",
          "Nxe5 élimine le cavalier qui menaçait d3. Les Blancs empêchent le mat au lieu de prendre le fou.",
        ),
        [],
        ["e5", "d3"],
      ),
    ],
  },
  "damiano-rook": {
    trap: [
      note(
        1,
        text(
          "fxe5 accepts the knight but opens the diagonal to the king. Qh5+ starts a forcing attack.",
          "fxe5 acepta el caballo, pero abre la diagonal al rey. Qh5+ inicia un ataque forzado.",
          "fxe5 nimmt den Springer, öffnet aber die Diagonale zum König. Qh5+ beginnt einen zwingenden Angriff.",
          "fxe5 accetta il cavallo ma apre la diagonale al re. Qh5+ avvia un attacco forzante.",
          "fxe5 accepte le cavalier mais ouvre la diagonale vers le roi. Qh5+ lance une attaque forcée.",
        ),
        [["d1", "h5"]],
        ["e8"],
      ),
      note(
        4,
        text(
          "Qxe5+ attacks the king and corner rook together. Black must block the check before protecting h8.",
          "Qxe5+ ataca al rey y a la torre de la esquina. Las negras deben tapar el jaque antes de defender h8.",
          "Qxe5+ greift König und Eckturm zugleich an. Schwarz muss das Schach blockieren, bevor h8 geschützt wird.",
          "Qxe5+ attacca re e torre d’angolo insieme. Il Nero deve parare lo scacco prima di difendere h8.",
          "Qxe5+ attaque ensemble le roi et la tour du coin. Les Noirs doivent parer l’échec avant de protéger h8.",
        ),
        [
          ["e5", "e8"],
          ["e5", "h8"],
        ],
      ),
      note(
        6,
        text(
          "White takes the rook after sacrificing a knight. The captured pawns add to the material gain.",
          "Las blancas toman la torre tras sacrificar un caballo. Los peones capturados aumentan la ganancia de material.",
          "Weiß schlägt den Turm nach einem Springeropfer. Die geschlagenen Bauern vergrößern den Materialgewinn.",
          "Il Bianco prende la torre dopo aver sacrificato un cavallo. I pedoni catturati aumentano il guadagno.",
          "Les Blancs prennent la tour après avoir sacrifié un cavalier. Les pions capturés augmentent le gain matériel.",
        ),
        [],
        ["h8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Qe7 attacks the knight on e5 instead of accepting the sacrifice. Black can recover e4 without opening the king’s diagonal.",
          "Qe7 ataca el caballo e5 sin aceptar el sacrificio. Las negras recuperan e4 sin abrir la diagonal del rey.",
          "Qe7 greift Springer e5 an statt das Opfer anzunehmen. Schwarz kann e4 zurückgewinnen, ohne die Königsdiagonale zu öffnen.",
          "Qe7 attacca il cavallo e5 invece di accettare il sacrificio. Il Nero può recuperare e4 senza aprire la diagonale del re.",
          "Qe7 attaque le cavalier e5 au lieu d’accepter le sacrifice. Les Noirs peuvent récupérer e4 sans ouvrir la diagonale du roi.",
        ),
        [["e7", "e5"]],
      ),
    ],
  },
  stafford: {
    trap: [
      note(
        1,
        text(
          "Bg5 pins the knight to the queen, but the pin is bait. Black can sacrifice the queen for an attack on f2.",
          "Bg5 clava el caballo contra la dama, pero es un cebo. Las negras pueden sacrificar la dama para atacar f2.",
          "Bg5 fesselt den Springer an die Dame, doch die Fesselung ist ein Köder. Schwarz kann die Dame für einen Angriff auf f2 opfern.",
          "Bg5 inchioda il cavallo alla donna, ma è un’esca. Il Nero può sacrificare la donna per attaccare f2.",
          "Bg5 cloue le cavalier à la dame, mais c’est un appât. Les Noirs peuvent sacrifier la dame pour attaquer f2.",
        ),
        [["c5", "f2"]],
        ["d8", "f6"],
      ),
      note(
        3,
        text(
          "White takes the queen, leaving the king exposed to Bxf2+. The bishop check forces the king onto e2.",
          "Las blancas toman la dama y exponen al rey a Bxf2+. El jaque obliga al rey a ir a e2.",
          "Weiß schlägt die Dame und lässt Bxf2+ zu. Das Läuferschach zwingt den König nach e2.",
          "Il Bianco prende la donna ed espone il re a Bxf2+. Lo scacco forza il re in e2.",
          "Les Blancs prennent la dame et exposent le roi à Bxf2+. Cet échec force le roi en e2.",
        ),
        [["c5", "f2"]],
      ),
      note(
        6,
        text(
          "Bg4 mates the king on e2. The knight on e4 and bishop on f2 cover its remaining escapes.",
          "Bg4 da mate al rey e2. El caballo e4 y el alfil f2 cubren sus otras salidas.",
          "Bg4 setzt den König e2 matt. Springer e4 und Läufer f2 decken seine übrigen Fluchtfelder.",
          "Bg4 dà matto al re e2. Il cavallo e4 e l’alfiere f2 coprono le altre fughe.",
          "Bg4 mate le roi e2. Le cavalier e4 et le fou f2 couvrent ses autres cases de fuite.",
        ),
        [["g4", "e2"]],
        ["e4", "f2"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Be2 develops and prepares castling instead of chasing Black’s queen. White keeps the king out of the mating net.",
          "Be2 desarrolla y prepara el enroque sin perseguir la dama negra. Las blancas evitan la red de mate.",
          "Be2 entwickelt und bereitet die Rochade vor, statt die schwarze Dame zu jagen. Weiß meidet das Mattnetz.",
          "Be2 sviluppa e prepara l’arrocco invece di inseguire la donna nera. Il Bianco evita la rete di matto.",
          "Be2 développe et prépare le roque au lieu de poursuivre la dame noire. Les Blancs évitent le réseau de mat.",
        ),
        [],
        ["e2", "e1"],
      ),
    ],
  },
  elephant: {
    trap: [
      note(
        1,
        text(
          "Nxd5 relies on the f6 knight being pinned. Black can break that pin because a bishop check will win back the queen.",
          "Nxd5 confía en la clavada del caballo f6. Las negras pueden romperla: un jaque de alfil recuperará la dama.",
          "Nxd5 vertraut auf die Fesselung des f6-Springers. Schwarz kann sie lösen, weil ein Läuferschach die Dame zurückgewinnt.",
          "Nxd5 conta sul cavallo f6 inchiodato. Il Nero può liberarlo: uno scacco di alfiere recupererà la donna.",
          "Nxd5 compte sur le clouage du cavalier f6. Les Noirs peuvent le rompre : un échec de fou récupérera la dame.",
        ),
        [["f6", "d5"]],
        ["f8", "b4"],
      ),
      note(
        4,
        text(
          "Bb4+ interrupts White’s celebration. Blocking with the queen on d2 lets Black capture her with check.",
          "Bb4+ interrumpe la ganancia blanca. Tapar con la dama en d2 permite capturarla con jaque.",
          "Bb4+ unterbricht den weißen Damengewinn. Das Blockieren mit der Dame auf d2 erlaubt Schwarz, sie mit Schach zu schlagen.",
          "Bb4+ interrompe il guadagno bianco. Parare con la donna d2 permette al Nero di catturarla con scacco.",
          "Bb4+ interrompt le gain des Blancs. Bloquer avec la dame d2 permet de la prendre avec échec.",
        ),
        [["b4", "e1"]],
        ["d2"],
      ),
      note(
        8,
        text(
          "Both queens are gone, but Black has won an extra knight for a pawn. The forcing checks made the difference.",
          "Desaparecen ambas damas, pero las negras ganan un caballo por un peón. Los jaques forzados marcan la diferencia.",
          "Beide Damen sind weg, doch Schwarz gewinnt einen Springer für einen Bauern. Die zwingenden Schachs waren entscheidend.",
          "Le donne sono scomparse, ma il Nero guadagna un cavallo per un pedone. Gli scacchi forzanti hanno fatto la differenza.",
          "Les deux dames ont disparu, mais les Noirs gagnent un cavalier contre un pion. Les échecs forcés ont été décisifs.",
        ),
        [],
        ["d8", "d5"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "e3 develops the position without testing the false pin on f6. White can bring the bishop out and castle.",
          "e3 desarrolla sin poner a prueba la falsa clavada de f6. Las blancas pueden sacar el alfil y enrocar.",
          "e3 entwickelt die Stellung, ohne die scheinbare Fesselung auf f6 auszunutzen. Weiß kann den Läufer entwickeln und rochieren.",
          "e3 sviluppa senza sfruttare la falsa inchiodatura in f6. Il Bianco può uscire con l’alfiere e arroccare.",
          "e3 développe sans exploiter le faux clouage en f6. Les Blancs peuvent sortir le fou et roquer.",
        ),
        [],
        ["e3", "f1"],
      ),
    ],
  },
  french: {
    trap: [
      note(
        3,
        text(
          "The queen takes d4, but the bishop on d3 can move with check. That will uncover White’s queen on d1.",
          "La dama toma d4, pero el alfil d3 puede moverse con jaque. Así descubrirá el ataque de la dama d1.",
          "Die Dame schlägt d4, doch der Läufer d3 kann mit Schach ziehen. Damit öffnet er den Angriff der Dame d1.",
          "La donna prende d4, ma l’alfiere d3 può muovere con scacco. Scoprirà l’attacco della donna d1.",
          "La dame prend d4, mais le fou d3 peut bouger avec échec. Il découvrira l’attaque de la dame d1.",
        ),
        [["d3", "b5"]],
        ["d1", "d4"],
      ),
      note(
        4,
        text(
          "Bb5+ clears the d-file and checks the king. Black cannot save the queen on d4 before answering the check.",
          "Bb5+ despeja la columna d y da jaque. Las negras deben responder antes de salvar su dama d4.",
          "Bb5+ räumt die d-Linie und gibt Schach. Schwarz muss das Schach beantworten, bevor die Dame d4 gerettet wird.",
          "Bb5+ libera la colonna d e dà scacco. Il Nero deve pararlo prima di salvare la donna d4.",
          "Bb5+ libère la colonne d et donne échec. Les Noirs doivent parer l’échec avant de sauver la dame d4.",
        ),
        [
          ["b5", "e8"],
          ["d1", "d4"],
        ],
      ),
      note(
        8,
        text(
          "White captures the queen on d4 after the checking exchanges. Opening the d-file was the purpose of the bishop moves.",
          "Las blancas capturan la dama d4 tras los cambios con jaque. Abrir la columna d era la idea de los movimientos del alfil.",
          "Weiß schlägt die Dame d4 nach den Schachabtäuschen. Das Öffnen der d-Linie war der Zweck der Läuferzüge.",
          "Il Bianco cattura la donna d4 dopo i cambi con scacco. Aprire la colonna d era lo scopo delle mosse d’alfiere.",
          "Les Blancs prennent la dame d4 après les échanges avec échec. Ouvrir la colonne d était le but des coups de fou.",
        ),
        [],
        ["d4"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Bd7 develops and prepares to meet a bishop check. Black postpones taking d4 until the discovered attack is no longer decisive.",
          "Bd7 desarrolla y prepara la respuesta al jaque de alfil. Las negras aplazan tomar d4 hasta que el ataque descubierto no sea decisivo.",
          "Bd7 entwickelt und bereitet eine Antwort auf das Läuferschach vor. Schwarz schlägt d4 erst, wenn der Abzugsangriff nicht mehr entscheidet.",
          "Bd7 sviluppa e prepara la risposta allo scacco d’alfiere. Il Nero rimanda la cattura d4 finché l’attacco di scoperta non decide.",
          "Bd7 développe et prépare la réponse à l’échec de fou. Les Noirs retardent la prise d4 jusqu’à ce que l’attaque à la découverte ne décide plus.",
        ),
        [],
        ["d7", "b5"],
      ),
    ],
  },
  "englund-mate": {
    trap: [
      note(
        1,
        text(
          "Bc3 attacks the queen but leaves the king on an uncastled back rank. Black can answer with a pin on b4.",
          "Bc3 ataca la dama, pero deja al rey sin enrocar en la última fila. Las negras responden con una clavada en b4.",
          "Bc3 greift die Dame an, lässt den König aber unrochiert auf der Grundreihe. Schwarz antwortet mit einer Fesselung auf b4.",
          "Bc3 attacca la donna ma lascia il re non arroccato sull’ultima traversa. Il Nero risponde con un’inchiodatura in b4.",
          "Bc3 attaque la dame mais laisse le roi non roqué sur sa rangée initiale. Les Noirs répondent par un clouage en b4.",
        ),
        [["f8", "b4"]],
        ["e1"],
      ),
      note(
        4,
        text(
          "Bxc3 clears b4 and removes the bishop that blocked the queen’s route. White’s queen is drawn away from the back rank.",
          "Bxc3 despeja b4 y elimina el alfil que cortaba el camino de la dama. La dama blanca se aleja de la última fila.",
          "Bxc3 räumt b4 und entfernt den Läufer, der den Damenweg blockierte. Die weiße Dame wird von der Grundreihe weggelockt.",
          "Bxc3 libera b4 ed elimina l’alfiere che bloccava la donna. La donna bianca viene attirata lontano dall’ultima traversa.",
          "Bxc3 libère b4 et élimine le fou qui bloquait la dame. La dame blanche est attirée loin de la rangée initiale.",
        ),
        [],
        ["b4", "c3", "c1"],
      ),
      note(
        6,
        text(
          "The queen enters c1 with mate. White’s own pieces block the king’s escape squares.",
          "La dama entra en c1 y da mate. Las propias piezas blancas bloquean las salidas del rey.",
          "Die Dame dringt auf c1 mit Matt ein. Weiße Figuren versperren ihrem König die Fluchtfelder.",
          "La donna entra in c1 e dà matto. I pezzi bianchi bloccano le vie di fuga del re.",
          "La dame entre en c1 avec mat. Les pièces blanches bloquent les cases de fuite de leur roi.",
        ),
        [["c1", "e1"]],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nc3 develops instead of attacking the queen with the bishop. White prepares Rb1 to chase the queen without the same back-rank trap.",
          "Nc3 desarrolla en vez de atacar la dama con el alfil. Prepara Rb1 sin caer en la misma trampa de última fila.",
          "Nc3 entwickelt statt die Dame mit dem Läufer anzugreifen. Weiß bereitet Rb1 ohne dieselbe Grundreihenfalle vor.",
          "Nc3 sviluppa invece di attaccare la donna con l’alfiere. Prepara Rb1 senza la stessa trappola sull’ultima traversa.",
          "Nc3 développe au lieu d’attaquer la dame avec le fou. Les Blancs préparent Rb1 sans le même piège de dernière rangée.",
        ),
        [],
        ["c3", "b1"],
      ),
    ],
  },
  "englund-queen": {
    trap: [
      note(
        1,
        text(
          "Qc3 threatens the queen but steps onto the diagonal to e1. A bishop on b4 will pin it to the king.",
          "Qc3 amenaza la dama, pero entra en la diagonal hacia e1. Un alfil en b4 la clavará contra el rey.",
          "Qc3 bedroht die Dame, betritt aber die Diagonale nach e1. Ein Läufer auf b4 wird sie an den König fesseln.",
          "Qc3 minaccia la donna ma entra nella diagonale verso e1. Un alfiere in b4 la inchioderà al re.",
          "Qc3 menace la dame mais entre sur la diagonale vers e1. Un fou en b4 la clouera au roi.",
        ),
        [["f8", "b4"]],
        ["c3", "e1"],
      ),
      note(
        2,
        text(
          "Bb4 pins the queen on c3 to the king on e1. White must deal with the pin before moving the queen freely.",
          "Bb4 clava la dama c3 contra el rey e1. Las blancas deben resolver la clavada antes de mover libremente la dama.",
          "Bb4 fesselt Dame c3 an König e1. Weiß muss die Fesselung lösen, bevor die Dame frei ziehen kann.",
          "Bb4 inchioda la donna c3 al re e1. Il Bianco deve risolvere l’inchiodatura prima di muovere liberamente la donna.",
          "Bb4 cloue la dame c3 au roi e1. Les Blancs doivent lever le clouage avant de déplacer librement la dame.",
        ),
        [["b4", "e1"]],
        ["c3"],
      ),
      note(
        4,
        text(
          "White traded the queen for the bishop on b4. The knight recapture gives Black a large material advantage.",
          "Las blancas cambiaron la dama por el alfil b4. La recaptura con el caballo da gran ventaja material a las negras.",
          "Weiß tauschte die Dame gegen den Läufer b4. Der Springerrückschlag verschafft Schwarz großen Materialvorteil.",
          "Il Bianco ha scambiato la donna per l’alfiere b4. La ripresa di cavallo dà al Nero un grande vantaggio materiale.",
          "Les Blancs ont échangé la dame contre le fou b4. La reprise par le cavalier donne un grand avantage matériel aux Noirs.",
        ),
        [],
        ["b4"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nc3 develops while keeping the queen on d2. It avoids placing the queen on the bishop’s pinning diagonal.",
          "Nc3 desarrolla y mantiene la dama en d2. Evita ponerla en la diagonal de clavada del alfil.",
          "Nc3 entwickelt und hält die Dame auf d2. So gerät sie nicht auf die Fesselungsdiagonale des Läufers.",
          "Nc3 sviluppa e tiene la donna in d2. Evita la diagonale d’inchiodatura dell’alfiere.",
          "Nc3 développe et garde la dame en d2. Elle évite ainsi la diagonale de clouage du fou.",
        ),
        [],
        ["c3", "d2"],
      ),
    ],
  },
  "fishing-pole": {
    trap: [
      note(
        1,
        text(
          "Taking the knight lets Black recapture with the h-pawn. The opened h-file gives the queen a route to the king.",
          "Tomar el caballo permite recapturar con el peón h. La columna h abierta da a la dama una ruta al rey.",
          "Der Springerschlag erlaubt den Rückschlag mit dem h-Bauern. Die offene h-Linie gibt der Dame einen Weg zum König.",
          "Prendere il cavallo permette di riprendere con il pedone h. La colonna h aperta dà alla donna una via verso il re.",
          "Prendre le cavalier permet de reprendre avec le pion h. La colonne h ouverte donne à la dame une route vers le roi.",
        ),
        [["h5", "g4"]],
        ["h2"],
      ),
      note(
        5,
        text(
          "f3 tries to drive away g4, but g3 will block the king’s escape on f2 and support the queen’s arrival on h2.",
          "f3 intenta expulsar al peón g4, pero g3 cerrará la salida f2 y apoyará la llegada de la dama a h2.",
          "f3 soll den Bauern g4 vertreiben, doch g3 sperrt f2 als Fluchtfeld und unterstützt den Dameneinbruch auf h2.",
          "f3 cerca di scacciare il pedone g4, ma g3 chiuderà la fuga f2 e sosterrà l’arrivo della donna in h2.",
          "f3 veut chasser le pion g4, mais g3 fermera la fuite f2 et soutiendra l’arrivée de la dame en h2.",
        ),
        [["g4", "g3"]],
        ["h2", "f2"],
      ),
      note(
        8,
        text(
          "The pawn on g3 protects the queen on h2 and covers f2. White’s king cannot capture or escape: mate.",
          "El peón g3 protege la dama h2 y cubre f2. El rey blanco no puede capturar ni escapar: mate.",
          "Der Bauer g3 deckt Dame h2 und Feld f2. Der weiße König kann weder schlagen noch fliehen: Matt.",
          "Il pedone g3 protegge la donna h2 e copre f2. Il re bianco non può catturare né fuggire: matto.",
          "Le pion g3 protège la dame h2 et couvre f2. Le roi blanc ne peut ni prendre ni fuir : mat.",
        ),
        [
          ["g3", "h2"],
          ["h2", "g1"],
        ],
        ["f2"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "d4 challenges the centre instead of opening the h-file. White leaves the offered knight alone and keeps the king’s shelter intact.",
          "d4 disputa el centro en vez de abrir la columna h. Las blancas ignoran el caballo y conservan el refugio del rey.",
          "d4 kämpft ums Zentrum statt die h-Linie zu öffnen. Weiß lässt den Springer stehen und bewahrt den Königsschutz.",
          "d4 contesta il centro invece di aprire la colonna h. Il Bianco ignora il cavallo e conserva il riparo del re.",
          "d4 conteste le centre au lieu d’ouvrir la colonne h. Les Blancs ignorent le cavalier et préservent l’abri du roi.",
        ),
        [["d4", "e5"]],
        ["h2", "g2"],
      ),
    ],
  },
  tennison: {
    trap: [
      note(
        3,
        text(
          "The king takes the knight on f7, allowing a bishop check on g6. That check will clear the d-file to the queen.",
          "El rey toma el caballo f7 y permite el jaque de alfil g6. Ese jaque despejará la columna d hacia la dama.",
          "Der König schlägt den Springer f7 und erlaubt das Läuferschach g6. Es räumt die d-Linie zur Dame.",
          "Il re prende il cavallo f7 e permette lo scacco d’alfiere g6. Lo scacco libera la colonna d verso la donna.",
          "Le roi prend le cavalier f7 et permet l’échec de fou g6. Cet échec libère la colonne d vers la dame.",
        ),
        [["d3", "g6"]],
        ["d1", "d8"],
      ),
      note(
        4,
        text(
          "Bg6+ moves the last blocker off the d-file. The king must answer while the queen on d8 is exposed.",
          "Bg6+ quita el último bloqueo de la columna d. El rey debe responder y la dama d8 queda expuesta.",
          "Bg6+ räumt den letzten Blockierer der d-Linie. Der König muss reagieren, während Dame d8 ungedeckt ist.",
          "Bg6+ sposta l’ultimo ostacolo dalla colonna d. Il re deve rispondere e la donna d8 resta esposta.",
          "Bg6+ retire le dernier obstacle de la colonne d. Le roi doit répondre tandis que la dame d8 est exposée.",
        ),
        [
          ["g6", "f7"],
          ["d1", "d8"],
        ],
      ),
      note(
        6,
        text(
          "White takes the queen, having given up a knight and bishop. Count the full exchange before judging the gain.",
          "Las blancas toman la dama tras entregar caballo y alfil. Cuenta todo el cambio antes de valorar la ganancia.",
          "Weiß schlägt die Dame, hat aber Springer und Läufer geopfert. Zähle den gesamten Abtausch, um den Gewinn einzuschätzen.",
          "Il Bianco prende la donna dopo aver ceduto cavallo e alfiere. Conta tutto lo scambio prima di valutare il guadagno.",
          "Les Blancs prennent la dame après avoir sacrifié cavalier et fou. Comptez tout l’échange avant d’évaluer le gain.",
        ),
        [],
        ["d8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nc6 develops instead of wasting time chasing the knight. Black can meet the attack while White still owes a pawn.",
          "Nc6 desarrolla sin perder tiempo persiguiendo al caballo. Las negras responden al ataque y las blancas aún tienen un peón menos.",
          "Nc6 entwickelt statt Zeit mit der Springerjagd zu verlieren. Schwarz begegnet dem Angriff, während Weiß noch einen Bauern weniger hat.",
          "Nc6 sviluppa senza perdere tempo a inseguire il cavallo. Il Nero affronta l’attacco e il Bianco ha ancora un pedone in meno.",
          "Nc6 développe au lieu de perdre du temps à chasser le cavalier. Les Noirs répondent à l’attaque avec encore un pion de plus.",
        ),
        [],
        ["c6", "e4"],
      ),
    ],
  },
  danish: {
    trap: [
      note(
        2,
        text(
          "Nxe5 leaves the queen on d1 available. White’s developed pieces can attack the king immediately if Black accepts.",
          "Nxe5 deja la dama d1 en presa. Las piezas desarrolladas blancas atacarán al rey si las negras aceptan.",
          "Nxe5 lässt die Dame d1 angreifbar. Die entwickelten weißen Figuren können bei Annahme sofort den König angreifen.",
          "Nxe5 lascia la donna d1 in presa. I pezzi bianchi sviluppati attaccheranno subito il re se il Nero accetta.",
          "Nxe5 laisse la dame d1 en prise. Les pièces blanches développées peuvent attaquer immédiatement le roi si les Noirs acceptent.",
        ),
        [["g4", "d1"]],
        ["c4", "c3"],
      ),
      note(
        3,
        text(
          "The queen capture ignores Bxf7+. That check brings the king to e7, where Nd5 will finish the attack.",
          "La captura de dama ignora Bxf7+. Ese jaque lleva al rey a e7, donde Nd5 termina el ataque.",
          "Der Damenschlag übersieht Bxf7+. Das Schach bringt den König nach e7, wo Nd5 den Angriff beendet.",
          "La cattura della donna ignora Bxf7+. Lo scacco porta il re in e7, dove Nd5 conclude l’attacco.",
          "La prise de dame oublie Bxf7+. Cet échec amène le roi en e7, où Nd5 termine l’attaque.",
        ),
        [["c4", "f7"]],
      ),
      note(
        6,
        text(
          "Nd5 mates the exposed king on e7. The bishop on f7 and knight on e5 cover its escape squares.",
          "Nd5 da mate al rey expuesto e7. El alfil f7 y el caballo e5 cubren las salidas.",
          "Nd5 setzt den offenen König e7 matt. Läufer f7 und Springer e5 decken die Fluchtfelder.",
          "Nd5 dà matto al re esposto e7. L’alfiere f7 e il cavallo e5 coprono le fughe.",
          "Nd5 mate le roi exposé e7. Le fou f7 et le cavalier e5 couvrent les cases de fuite.",
        ),
        [["d5", "e7"]],
        ["f7", "e5"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nf6 develops and covers central squares instead of opening the queen-bait combination with Ne5. White must build the attack further.",
          "Nf6 desarrolla y cubre el centro sin iniciar la combinación de dama con Ne5. Las blancas deben seguir preparando el ataque.",
          "Nf6 entwickelt und deckt Zentrumsfelder statt mit Ne5 die Damenköderkombination zu erlauben. Weiß muss den Angriff weiter aufbauen.",
          "Nf6 sviluppa e controlla il centro senza permettere la combinazione con Ne5. Il Bianco deve preparare ancora l’attacco.",
          "Nf6 développe et contrôle le centre sans permettre la combinaison de dame avec Ne5. Les Blancs doivent poursuivre leur préparation.",
        ),
        [],
        ["f6", "e4", "d5"],
      ),
    ],
  },
  ponziani: {
    trap: [
      note(
        1,
        text(
          "d6 attacks the knight, but Bb5+ forces Black to respond first. The bishop’s diagonal can then open toward a8.",
          "d6 ataca al caballo, pero Bb5+ obliga a responder primero. Después se abre la diagonal del alfil hacia a8.",
          "d6 greift den Springer an, doch Bb5+ erzwingt zuerst eine Antwort. Danach kann sich die Läuferdiagonale nach a8 öffnen.",
          "d6 attacca il cavallo, ma Bb5+ forza una risposta immediata. Poi la diagonale dell’alfiere può aprirsi verso a8.",
          "d6 attaque le cavalier, mais Bb5+ force d’abord une réponse. La diagonale du fou peut ensuite s’ouvrir vers a8.",
        ),
        [["f1", "b5"]],
        ["a8"],
      ),
      note(
        8,
        text(
          "Bxc6+ removes the knight with check. Black must protect the king, leaving the rook on a8 on the bishop’s diagonal.",
          "Bxc6+ elimina el caballo con jaque. Las negras deben salvar al rey y dejan a8 en la diagonal del alfil.",
          "Bxc6+ entfernt den Springer mit Schach. Schwarz muss den König schützen und lässt Turm a8 auf der Läuferdiagonale.",
          "Bxc6+ elimina il cavallo con scacco. Il Nero deve salvare il re e lascia la torre a8 sulla diagonale dell’alfiere.",
          "Bxc6+ élimine le cavalier avec échec. Les Noirs doivent protéger le roi et laissent la tour a8 sur la diagonale du fou.",
        ),
        [
          ["c6", "e8"],
          ["c6", "a8"],
        ],
      ),
      note(
        10,
        text(
          "The bishop takes a8. The earlier checks bought the time needed to clear this diagonal and win the rook.",
          "El alfil toma a8. Los jaques anteriores dieron tiempo para despejar la diagonal y ganar la torre.",
          "Der Läufer schlägt a8. Die vorherigen Schachs gewannen die Zeit, diese Diagonale zu öffnen und den Turm zu gewinnen.",
          "L’alfiere prende a8. Gli scacchi precedenti hanno dato il tempo di aprire la diagonale e vincere la torre.",
          "Le fou prend a8. Les échecs précédents ont donné le temps d’ouvrir cette diagonale et de gagner la tour.",
        ),
        [],
        ["a8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Ng6 attacks White’s knight instead of pushing d6. Black exchanges the advanced knight before the combination starts.",
          "Ng6 ataca al caballo blanco sin jugar d6. Las negras cambian ese caballo avanzado antes de que empiece la combinación.",
          "Ng6 greift den weißen Springer an und vermeidet d6. Schwarz tauscht den vorgerückten Springer vor Beginn der Kombination.",
          "Ng6 attacca il cavallo bianco evitando d6. Il Nero cambia il cavallo avanzato prima che inizi la combinazione.",
          "Ng6 attaque le cavalier blanc en évitant d6. Les Noirs échangent ce cavalier avancé avant le début de la combinaison.",
        ),
        [["g6", "e5"]],
      ),
    ],
  },
  "fried-liver-mate": {
    trap: [
      note(
        1,
        text(
          "Kg8 retreats into the corner but leaves d5 exposed to a bishop capture with check. Black’s crowded pieces limit the king’s escapes.",
          "Kg8 se retira a la esquina, pero deja Bxd5+ disponible. Las piezas negras amontonadas limitan las salidas del rey.",
          "Kg8 zieht in die Ecke, lässt aber Bxd5+ zu. Die gedrängten schwarzen Figuren beschränken die Fluchtfelder.",
          "Kg8 si ritira nell’angolo ma permette Bxd5+. I pezzi neri ammassati limitano le fughe del re.",
          "Kg8 recule dans le coin mais permet Bxd5+. Les pièces noires entassées limitent les fuites du roi.",
        ),
        [["c4", "d5"]],
        ["g8"],
      ),
      note(
        2,
        text(
          "Bxd5+ clears the diagonal to g8. Blocking on e6 will not help because White’s bishop can capture that blocker with mate.",
          "Bxd5+ despeja la diagonal hacia g8. Tapar en e6 no basta: el alfil podrá capturar ese bloqueo con mate.",
          "Bxd5+ öffnet die Diagonale nach g8. Das Blockieren auf e6 hilft nicht, weil Weiß den Blockierer mit Matt schlagen kann.",
          "Bxd5+ apre la diagonale verso g8. Bloccare in e6 non basta: l’alfiere potrà catturare il blocco con matto.",
          "Bxd5+ ouvre la diagonale vers g8. Bloquer en e6 ne suffit pas : le fou pourra prendre ce bloqueur avec mat.",
        ),
        [["d5", "g8"]],
      ),
      note(
        4,
        text(
          "The bishop takes e6 with mate. The queen on f3 covers f7 and helps close the king’s escape route.",
          "El alfil toma e6 con mate. La dama f3 cubre f7 y ayuda a cerrar las salidas del rey.",
          "Der Läufer schlägt e6 mit Matt. Dame f3 deckt f7 und hilft, die Fluchtwege zu schließen.",
          "L’alfiere prende e6 con matto. La donna f3 copre f7 e aiuta a chiudere le fughe del re.",
          "Le fou prend e6 avec mat. La dame f3 couvre f7 et contribue à fermer les fuites du roi.",
        ),
        [
          ["e6", "g8"],
          ["f3", "f7"],
        ],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Ke6 looks exposed, but the king defends the knight on d5. Black avoids the immediate mate and must continue defending carefully.",
          "Ke6 parece expuesto, pero defiende el caballo d5. Las negras evitan el mate inmediato y deben seguir defendiendo con cuidado.",
          "Ke6 wirkt riskant, doch der König deckt Springer d5. Schwarz verhindert das sofortige Matt und muss weiter sorgfältig verteidigen.",
          "Ke6 sembra esposto, ma il re difende il cavallo d5. Il Nero evita il matto immediato e deve difendersi ancora con cura.",
          "Ke6 paraît exposé, mais le roi défend le cavalier d5. Les Noirs évitent le mat immédiat et doivent encore se défendre prudemment.",
        ),
        [["e6", "d5"]],
      ),
    ],
  },
  "fried-liver-queen": {
    trap: [
      note(
        1,
        text(
          "Qf6 blocks the check but leaves the knight on d5 available. White can recover the sacrificed piece with check.",
          "Qf6 tapa el jaque, pero deja el caballo d5 en presa. Las blancas recuperan la pieza sacrificada con jaque.",
          "Qf6 blockiert das Schach, lässt aber Springer d5 angreifbar. Weiß kann die geopferte Figur mit Schach zurückgewinnen.",
          "Qf6 para lo scacco ma lascia il cavallo d5 in presa. Il Bianco recupera il pezzo sacrificato con scacco.",
          "Qf6 bloque l’échec mais laisse le cavalier d5 en prise. Les Blancs récupèrent la pièce sacrifiée avec échec.",
        ),
        [["c4", "d5"]],
      ),
      note(
        2,
        text(
          "Bxd5+ recovers the knight and keeps the king under attack. This continuation wins back material rather than forcing mate.",
          "Bxd5+ recupera el caballo y mantiene el ataque al rey. Esta línea recupera material, sin forzar mate.",
          "Bxd5+ gewinnt den Springer zurück und hält den König unter Angriff. Diese Variante gewinnt Material zurück, statt Matt zu erzwingen.",
          "Bxd5+ recupera il cavallo e mantiene l’attacco al re. Questa linea recupera materiale senza forzare il matto.",
          "Bxd5+ récupère le cavalier et maintient l’attaque contre le roi. Cette ligne récupère du matériel sans forcer le mat.",
        ),
        [["d5", "f7"]],
      ),
      note(
        3,
        text(
          "The king retreats to e8. White has recovered the sacrificed knight, while Black has lost castling rights.",
          "El rey vuelve a e8. Las blancas recuperaron el caballo sacrificado y las negras perdieron el derecho a enrocar.",
          "Der König geht nach e8 zurück. Weiß hat den geopferten Springer zurückgewonnen; Schwarz hat das Rochaderecht verloren.",
          "Il re torna in e8. Il Bianco ha recuperato il cavallo sacrificato e il Nero ha perso il diritto d’arrocco.",
          "Le roi recule en e8. Les Blancs ont récupéré le cavalier sacrifié et les Noirs ont perdu le droit de roquer.",
        ),
        [],
        ["d5", "e8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "The king actively protects d5 from e6. White must add attackers instead of immediately recovering the knight.",
          "El rey defiende activamente d5 desde e6. Las blancas deben sumar atacantes antes de recuperar el caballo.",
          "Der König deckt d5 aktiv von e6. Weiß muss Angreifer hinzufügen, statt den Springer sofort zurückzugewinnen.",
          "Il re difende attivamente d5 da e6. Il Bianco deve aggiungere attaccanti prima di recuperare il cavallo.",
          "Le roi protège activement d5 depuis e6. Les Blancs doivent ajouter des attaquants avant de récupérer le cavalier.",
        ),
        [["e6", "d5"]],
      ),
    ],
  },
  albin: {
    trap: [
      note(
        1,
        text(
          "e3 tries to remove the d4 pawn, but Bb4+ forces White to deal with the king before opening the centre.",
          "e3 intenta eliminar d4, pero Bb4+ obliga a atender al rey antes de abrir el centro.",
          "e3 will den d4-Bauern beseitigen, doch Bb4+ zwingt Weiß zuerst zum Schutz des Königs.",
          "e3 cerca di eliminare il pedone d4, ma Bb4+ costringe il Bianco a occuparsi prima del re.",
          "e3 veut éliminer le pion d4, mais Bb4+ force les Blancs à protéger d’abord leur roi.",
        ),
        [["f8", "b4"]],
        ["d4", "e3"],
      ),
      note(
        6,
        text(
          "exf2+ pushes the pawn one step from promotion with check. White cannot simply take the queen on d8.",
          "exf2+ deja al peón a un paso de coronar con jaque. Las blancas no pueden limitarse a tomar la dama d8.",
          "exf2+ bringt den Bauern mit Schach vor die Umwandlung. Weiß kann nicht einfach Dame d8 schlagen.",
          "exf2+ porta il pedone a un passo dalla promozione con scacco. Il Bianco non può semplicemente prendere la donna d8.",
          "exf2+ amène le pion à un pas de la promotion avec échec. Les Blancs ne peuvent pas simplement prendre la dame d8.",
        ),
        [["f2", "e1"]],
        ["g1"],
      ),
      note(
        8,
        text(
          "Promoting to a knight checks the king on e2. A queen promotion would not check, giving White time to respond differently.",
          "Promocionar a caballo da jaque al rey e2. Promocionar a dama no daría jaque y permitiría a las blancas otra respuesta.",
          "Die Springerumwandlung gibt König e2 Schach. Eine Dame gäbe kein Schach und ließe Weiß Zeit für eine andere Antwort.",
          "Promuovere a cavallo dà scacco al re e2. Una donna non darebbe scacco, lasciando al Bianco un’altra risposta.",
          "La promotion en cavalier donne échec au roi e2. Une dame ne donnerait pas échec et laisserait une autre réponse aux Blancs.",
        ),
        [["g1", "e2"]],
      ),
      note(
        12,
        text(
          "After the forcing checks, the bishop takes the queen on d1. The knight promotion kept White from breaking the sequence.",
          "Tras los jaques forzados, el alfil toma la dama d1. La promoción a caballo impidió que las blancas cortaran la secuencia.",
          "Nach den zwingenden Schachs schlägt der Läufer Dame d1. Die Springerumwandlung hinderte Weiß daran, die Folge zu unterbrechen.",
          "Dopo gli scacchi forzanti, l’alfiere prende la donna d1. La promozione a cavallo ha impedito al Bianco di interrompere la sequenza.",
          "Après les échecs forcés, le fou prend la dame d1. La promotion en cavalier a empêché les Blancs de casser la séquence.",
        ),
        [],
        ["d1"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nf3 develops without creating the e3 capture target. White can challenge the advanced pawn after securing the king.",
          "Nf3 desarrolla sin crear el blanco e3. Las blancas podrán atacar al peón avanzado tras asegurar su rey.",
          "Nf3 entwickelt, ohne das Angriffsziel e3 zu schaffen. Weiß kann den vorgerückten Bauern nach der Königssicherung angreifen.",
          "Nf3 sviluppa senza creare il bersaglio e3. Il Bianco potrà attaccare il pedone avanzato dopo aver messo al sicuro il re.",
          "Nf3 développe sans créer la cible e3. Les Blancs pourront attaquer le pion avancé après avoir sécurisé leur roi.",
        ),
        [],
        ["f3", "e3"],
      ),
    ],
  },
  siberian: {
    trap: [
      note(
        1,
        text(
          "h3 attacks the knight on g4, but Nd4 brings another attacker forward and attacks the queen on e2.",
          "h3 ataca el caballo g4, pero Nd4 añade otro atacante y amenaza la dama e2.",
          "h3 greift Springer g4 an, doch Nd4 bringt einen weiteren Angreifer und bedroht Dame e2.",
          "h3 attacca il cavallo g4, ma Nd4 aggiunge un altro attaccante e minaccia la donna e2.",
          "h3 attaque le cavalier g4, mais Nd4 ajoute un attaquant et menace la dame e2.",
        ),
        [["c6", "d4"]],
        ["e2"],
      ),
      note(
        2,
        text(
          "Nd4 attacks the queen and tempts Nxd4. Moving the f3 knight would remove the defender of h2.",
          "Nd4 ataca la dama y tienta Nxd4. Mover el caballo f3 elimina al defensor de h2.",
          "Nd4 greift die Dame an und lockt zu Nxd4. Der Zug des f3-Springers entfernt den Verteidiger von h2.",
          "Nd4 attacca la donna e invita Nxd4. Muovere il cavallo f3 elimina il difensore di h2.",
          "Nd4 attaque la dame et invite Nxd4. Déplacer le cavalier f3 retire le défenseur de h2.",
        ),
        [
          ["d4", "e2"],
          ["f3", "h2"],
        ],
      ),
      note(
        3,
        text(
          "Nxd4 wins a knight but abandons h2. Black’s queen can now land there, protected by the knight on g4.",
          "Nxd4 gana un caballo, pero abandona h2. La dama negra llega allí protegida por el caballo g4.",
          "Nxd4 gewinnt einen Springer, gibt aber h2 auf. Die schwarze Dame kann dort mit Schutz des g4-Springers eindringen.",
          "Nxd4 guadagna un cavallo ma abbandona h2. La donna nera può arrivarci protetta dal cavallo g4.",
          "Nxd4 gagne un cavalier mais abandonne h2. La dame noire peut y entrer, protégée par le cavalier g4.",
        ),
        [
          ["c7", "h2"],
          ["g4", "h2"],
        ],
      ),
      note(
        4,
        text(
          "The queen mates on h2. The knight on g4 protects her, and White’s own pawns block the king’s other escapes.",
          "La dama da mate en h2. El caballo g4 la protege y los propios peones blancos cierran las otras salidas.",
          "Die Dame setzt auf h2 matt. Springer g4 deckt sie, und weiße Bauern versperren die übrigen Fluchtfelder.",
          "La donna dà matto in h2. Il cavallo g4 la protegge e i pedoni bianchi chiudono le altre fughe.",
          "La dame mate en h2. Le cavalier g4 la protège et les pions blancs ferment les autres fuites.",
        ),
        [
          ["g4", "h2"],
          ["h2", "g1"],
        ],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nb5 attacks the queen on c7 without moving the f3 defender. White gains time while keeping h2 protected.",
          "Nb5 ataca la dama c7 sin mover al defensor f3. Las blancas ganan tiempo y mantienen h2 protegido.",
          "Nb5 greift Dame c7 an, ohne den Verteidiger f3 zu ziehen. Weiß gewinnt Zeit und hält h2 gedeckt.",
          "Nb5 attacca la donna c7 senza muovere il difensore f3. Il Bianco guadagna tempo e tiene h2 protetto.",
          "Nb5 attaque la dame c7 sans déplacer le défenseur f3. Les Blancs gagnent du temps et gardent h2 protégé.",
        ),
        [
          ["b5", "c7"],
          ["f3", "h2"],
        ],
      ),
    ],
  },
  fajarowicz: {
    trap: [
      note(
        2,
        text(
          "Nxf2 offers the knight with a fork on d1 and h1. Taking it will expose the king to a bishop check.",
          "Nxf2 ofrece el caballo con una horquilla a d1 y h1. Capturarlo expone al rey a un jaque de alfil.",
          "Nxf2 bietet den Springer mit einer Gabel auf d1 und h1 an. Ihn zu schlagen setzt den König einem Läuferschach aus.",
          "Nxf2 offre il cavallo con una forchetta a d1 e h1. Prenderlo espone il re a uno scacco d’alfiere.",
          "Nxf2 offre le cavalier avec une fourchette sur d1 et h1. Le prendre expose le roi à un échec de fou.",
        ),
        [
          ["f2", "d1"],
          ["f2", "h1"],
        ],
      ),
      note(
        3,
        text(
          "Kxf2 accepts the knight but allows Bxg3+. Moving that bishop will uncover the queen’s line down the d-file.",
          "Kxf2 acepta el caballo, pero permite Bxg3+. Mover ese alfil descubre la línea de la dama por la columna d.",
          "Kxf2 nimmt den Springer, erlaubt aber Bxg3+. Der Läuferzug öffnet den Damenangriff auf der d-Linie.",
          "Kxf2 accetta il cavallo ma permette Bxg3+. Muovere l’alfiere scopre la linea della donna sulla colonna d.",
          "Kxf2 accepte le cavalier mais permet Bxg3+. Déplacer le fou découvre la ligne de la dame sur la colonne d.",
        ),
        [["d6", "g3"]],
        ["d8", "d1"],
      ),
      note(
        4,
        text(
          "Bxg3+ clears the d-file with check. White must answer the king’s danger before saving the queen on d1.",
          "Bxg3+ despeja la columna d con jaque. Las blancas deben atender al rey antes de salvar la dama d1.",
          "Bxg3+ räumt die d-Linie mit Schach. Weiß muss den König schützen, bevor Dame d1 gerettet wird.",
          "Bxg3+ libera la colonna d con scacco. Il Bianco deve salvare il re prima della donna d1.",
          "Bxg3+ libère la colonne d avec échec. Les Blancs doivent protéger le roi avant de sauver la dame d1.",
        ),
        [
          ["g3", "f2"],
          ["d8", "d1"],
        ],
      ),
      note(
        6,
        text(
          "Black captures the queen after sacrificing two minor pieces. The checking bishop move made the queen impossible to save in this line.",
          "Las negras capturan la dama tras sacrificar dos piezas menores. El jaque de alfil impidió salvarla en esta línea.",
          "Schwarz schlägt die Dame nach dem Opfer zweier Leichtfiguren. Das Läuferschach machte ihre Rettung in dieser Variante unmöglich.",
          "Il Nero cattura la donna dopo aver sacrificato due pezzi leggeri. Lo scacco d’alfiere ha impedito di salvarla in questa linea.",
          "Les Noirs prennent la dame après avoir sacrifié deux pièces mineures. L’échec de fou empêchait de la sauver dans cette ligne.",
        ),
        [],
        ["d1"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nbd2 develops while the king remains sheltered. White avoids opening the king with a pawn move and a tempting knight capture.",
          "Nbd2 desarrolla y mantiene al rey protegido. Las blancas evitan exponerlo con un avance de peón y una captura tentadora de caballo.",
          "Nbd2 entwickelt bei geschütztem König. Weiß vermeidet es, den König durch einen Bauernzug und einen verlockenden Springerschlag zu entblößen.",
          "Nbd2 sviluppa e mantiene il re al riparo. Il Bianco evita di esporlo con una spinta di pedone e una presa invitante di cavallo.",
          "Nbd2 développe en gardant le roi à l’abri. Les Blancs évitent de l’exposer par un coup de pion et une prise tentante de cavalier.",
        ),
        [],
        ["d2", "e1"],
      ),
    ],
  },
  "noahs-ark": {
    trap: [
      note(
        1,
        text(
          "Qxd4 recovers a pawn, but c5 will attack the queen with tempo. That gives Black time to trap the bishop on b3.",
          "Qxd4 recupera un peón, pero c5 atacará la dama ganando tiempo. Las negras podrán encerrar al alfil b3.",
          "Qxd4 gewinnt einen Bauern zurück, doch c5 greift die Dame mit Tempogewinn an. Schwarz gewinnt Zeit zum Fang des Läufers b3.",
          "Qxd4 recupera un pedone, ma c5 attaccherà la donna guadagnando tempo. Il Nero potrà intrappolare l’alfiere b3.",
          "Qxd4 récupère un pion, mais c5 attaquera la dame avec gain de temps. Les Noirs pourront enfermer le fou b3.",
        ),
        [["c7", "c5"]],
        ["b3"],
      ),
      note(
        8,
        text(
          "c4 attacks the bishop on b3. The b5 pawn and Black’s other pieces have closed its safe retreat squares.",
          "c4 ataca al alfil b3. El peón b5 y las demás piezas negras han cerrado sus retiradas seguras.",
          "c4 greift Läufer b3 an. Der b5-Bauer und weitere schwarze Figuren haben seine sicheren Rückzugsfelder geschlossen.",
          "c4 attacca l’alfiere b3. Il pedone b5 e gli altri pezzi neri hanno chiuso le ritirate sicure.",
          "c4 attaque le fou b3. Le pion b5 et les autres pièces noires ont fermé ses retraites sûres.",
        ),
        [["c4", "b3"]],
        ["a4", "a2", "c2"],
      ),
      note(
        11,
        text(
          "White recovers the pawn on c4, but has lost the bishop for two pawns. The queen attacks gave Black time to build the trap.",
          "Las blancas recuperan c4, pero perdieron el alfil por dos peones. Los ataques a la dama dieron tiempo para montar la trampa.",
          "Weiß gewinnt den Bauern c4 zurück, verliert aber den Läufer für zwei Bauern. Die Damenangriffe gaben Schwarz Zeit für die Falle.",
          "Il Bianco recupera il pedone c4, ma perde l’alfiere per due pedoni. Gli attacchi alla donna hanno dato tempo per la trappola.",
          "Les Blancs récupèrent le pion c4, mais perdent le fou contre deux pions. Les attaques contre la dame ont donné le temps de monter le piège.",
        ),
        [],
        ["c4"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Bd5 moves the bishop before recovering the pawn. White avoids leaving it on b3 for the pawn trap.",
          "Bd5 mueve el alfil antes de recuperar el peón. Las blancas evitan dejarlo en b3 para la trampa de peones.",
          "Bd5 zieht den Läufer vor dem Bauernrückgewinn. Weiß lässt ihn nicht auf b3 für die Bauernfalle stehen.",
          "Bd5 muove l’alfiere prima di recuperare il pedone. Il Bianco evita di lasciarlo in b3 per la trappola di pedoni.",
          "Bd5 déplace le fou avant de récupérer le pion. Les Blancs évitent de le laisser en b3 pour le piège de pions.",
        ),
        [],
        ["d5", "b3"],
      ),
    ],
  },
  "queens-gambit": {
    trap: [
      note(
        2,
        text(
          "a4 challenges the b5 pawn that supports c4. Exchanging these pawns can open the diagonal toward Black’s rook.",
          "a4 ataca al peón b5 que sostiene c4. Los cambios pueden abrir la diagonal hacia la torre negra.",
          "a4 greift den b5-Bauern an, der c4 stützt. Der Bauernabtausch kann die Diagonale zum schwarzen Turm öffnen.",
          "a4 attacca il pedone b5 che sostiene c4. I cambi possono aprire la diagonale verso la torre nera.",
          "a4 attaque le pion b5 qui soutient c4. Les échanges peuvent ouvrir la diagonale vers la tour noire.",
        ),
        [["a4", "b5"]],
        ["c4"],
      ),
      note(
        3,
        text(
          "c6 tries to hold the extra pawn, but the exchanges on b5 will clear the diagonal from f3 to a8.",
          "c6 intenta conservar el peón de más, pero los cambios en b5 despejarán la diagonal de f3 a a8.",
          "c6 will den Mehrbauern halten, doch der Abtausch auf b5 räumt die Diagonale von f3 nach a8.",
          "c6 cerca di tenere il pedone in più, ma i cambi in b5 apriranno la diagonale da f3 ad a8.",
          "c6 veut garder le pion de plus, mais les échanges en b5 libéreront la diagonale de f3 à a8.",
        ),
        [["a4", "b5"]],
        ["f3", "a8"],
      ),
      note(
        6,
        text(
          "Qf3 directly attacks the rook on a8 along the cleared diagonal. Black must now deal with that threat.",
          "Qf3 ataca directamente la torre a8 por la diagonal despejada. Las negras deben responder a esa amenaza.",
          "Qf3 greift Turm a8 auf der geöffneten Diagonale direkt an. Schwarz muss jetzt auf diese Drohung reagieren.",
          "Qf3 attacca direttamente la torre a8 sulla diagonale aperta. Il Nero deve ora rispondere alla minaccia.",
          "Qf3 attaque directement la tour a8 sur la diagonale ouverte. Les Noirs doivent maintenant répondre à cette menace.",
        ),
        [["f3", "a8"]],
      ),
      note(
        8,
        text(
          "Qxc6+ takes the blocking knight with check. Black must save the king before protecting the rook on a8.",
          "Qxc6+ toma el caballo que bloquea con jaque. Las negras deben salvar al rey antes de proteger la torre a8.",
          "Qxc6+ schlägt den blockierenden Springer mit Schach. Schwarz muss den König retten, bevor Turm a8 geschützt wird.",
          "Qxc6+ prende il cavallo che blocca con scacco. Il Nero deve salvare il re prima di proteggere la torre a8.",
          "Qxc6+ prend le cavalier qui bloque avec échec. Les Noirs doivent sauver le roi avant de protéger la tour a8.",
        ),
        [
          ["c6", "e8"],
          ["c6", "a8"],
        ],
      ),
      note(
        10,
        text(
          "The queen takes a8. Black’s attempt to keep the extra c4 pawn has cost a knight and rook.",
          "La dama toma a8. El intento de conservar el peón extra c4 ha costado caballo y torre a las negras.",
          "Die Dame schlägt a8. Der Versuch, den c4-Mehrbauern zu halten, hat Schwarz Springer und Turm gekostet.",
          "La donna prende a8. Il tentativo di conservare il pedone in più c4 è costato al Nero cavallo e torre.",
          "La dame prend a8. La tentative de garder le pion c4 de plus a coûté cavalier et tour aux Noirs.",
        ),
        [],
        ["a8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nf6 develops instead of spending moves holding c4. Black returns the pawn and keeps the queenside intact.",
          "Nf6 desarrolla sin gastar jugadas en conservar c4. Las negras devuelven el peón y mantienen intacto el flanco de dama.",
          "Nf6 entwickelt statt Züge zum Halten von c4 zu verwenden. Schwarz gibt den Bauern zurück und hält den Damenflügel intakt.",
          "Nf6 sviluppa senza perdere mosse per conservare c4. Il Nero restituisce il pedone e mantiene intatto il lato di donna.",
          "Nf6 développe au lieu de perdre des coups à garder c4. Les Noirs rendent le pion et préservent l’aile dame.",
        ),
        [],
        ["f6", "c4", "b7"],
      ),
    ],
  },
  "damiano-king": {
    trap: [
      note(
        1,
        text(
          "Taking the knight opens the king’s diagonal. White can use Qh5+ to begin a sequence of checks instead of retreating.",
          "Tomar el caballo abre la diagonal del rey. Las blancas pueden iniciar una serie de jaques con Qh5+.",
          "Der Springerschlag öffnet die Königsdiagonale. Weiß kann mit Qh5+ eine Schachfolge beginnen, statt zurückzuweichen.",
          "Prendere il cavallo apre la diagonale del re. Il Bianco può iniziare una serie di scacchi con Qh5+.",
          "Prendre le cavalier ouvre la diagonale du roi. Les Blancs peuvent commencer une série d’échecs avec Qh5+.",
        ),
        [["d1", "h5"]],
        ["e8"],
      ),
      note(
        4,
        text(
          "Qxe5+ recovers a pawn and keeps the king moving. Black cannot use this turn to develop or castle.",
          "Qxe5+ recupera un peón y sigue persiguiendo al rey. Las negras no pueden desarrollar ni enrocar en este turno.",
          "Qxe5+ gewinnt einen Bauern zurück und treibt den König weiter. Schwarz kann in diesem Zug weder entwickeln noch rochieren.",
          "Qxe5+ recupera un pedone e continua a inseguire il re. Il Nero non può sviluppare né arroccare in questo turno.",
          "Qxe5+ récupère un pion et continue de chasser le roi. Les Noirs ne peuvent ni développer ni roquer à ce tour.",
        ),
        [["e5", "e7"]],
      ),
      note(
        6,
        text(
          "Bc4+ develops a bishop with another check. Black’s king is exposed, but White has not yet forced mate or recovered the whole sacrifice.",
          "Bc4+ desarrolla con otro jaque. El rey negro está expuesto, pero las blancas aún no fuerzan mate ni recuperan todo el sacrificio.",
          "Bc4+ entwickelt mit einem weiteren Schach. Der schwarze König ist offen, doch Weiß hat noch kein Matt erzwungen oder das ganze Opfer zurückgewonnen.",
          "Bc4+ sviluppa con un altro scacco. Il re nero è esposto, ma il Bianco non ha ancora forzato matto né recuperato tutto il sacrificio.",
          "Bc4+ développe avec un nouvel échec. Le roi noir est exposé, mais les Blancs n’ont pas encore forcé le mat ni récupéré tout le sacrifice.",
        ),
        [["c4", "f7"]],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Qe7 attacks the knight on e5 without opening the king’s diagonal. Black can take e4 after the knight retreats.",
          "Qe7 ataca el caballo e5 sin abrir la diagonal del rey. Las negras pueden tomar e4 cuando el caballo retroceda.",
          "Qe7 greift Springer e5 an, ohne die Königsdiagonale zu öffnen. Schwarz kann e4 nach dem Springerrückzug schlagen.",
          "Qe7 attacca il cavallo e5 senza aprire la diagonale del re. Il Nero può prendere e4 dopo la ritirata del cavallo.",
          "Qe7 attaque le cavalier e5 sans ouvrir la diagonale du roi. Les Noirs peuvent prendre e4 après son recul.",
        ),
        [["e7", "e5"]],
      ),
    ],
  },
  vienna: {
    trap: [
      note(
        1,
        text(
          "exf4 wins a pawn but allows e5 to attack the knight on f6. White gains time to build a broad centre.",
          "exf4 gana un peón, pero permite e5 contra el caballo f6. Las blancas ganan tiempo para construir un centro amplio.",
          "exf4 gewinnt einen Bauern, erlaubt aber e5 gegen Springer f6. Weiß gewinnt Zeit für ein breites Zentrum.",
          "exf4 guadagna un pedone ma permette e5 contro il cavallo f6. Il Bianco guadagna tempo per costruire un ampio centro.",
          "exf4 gagne un pion mais permet e5 contre le cavalier f6. Les Blancs gagnent du temps pour construire un large centre.",
        ),
        [["e4", "e5"]],
        ["f6"],
      ),
      note(
        2,
        text(
          "e5 chases the knight before White plays d4. This gains space and development time rather than winning a piece.",
          "e5 expulsa al caballo antes de d4. Gana espacio y tiempo de desarrollo, en vez de una pieza.",
          "e5 vertreibt den Springer vor d4. Das gewinnt Raum und Entwicklungszeit statt einer Figur.",
          "e5 scaccia il cavallo prima di d4. Guadagna spazio e tempo di sviluppo, non un pezzo.",
          "e5 chasse le cavalier avant d4. Ce coup gagne de l’espace et du temps de développement plutôt qu’une pièce.",
        ),
        [["e5", "f6"]],
      ),
      note(
        8,
        text(
          "h4 challenges the g5 pawn chain. White has space and active play, but still needs to justify the sacrificed pawn.",
          "h4 ataca la cadena g5. Las blancas tienen espacio y actividad, pero aún deben justificar el peón sacrificado.",
          "h4 greift die Bauernkette g5 an. Weiß hat Raum und Aktivität, muss das Bauernopfer aber noch rechtfertigen.",
          "h4 attacca la catena g5. Il Bianco ha spazio e attività, ma deve ancora giustificare il pedone sacrificato.",
          "h4 attaque la chaîne g5. Les Blancs ont espace et activité, mais doivent encore justifier le pion sacrifié.",
        ),
        [["h4", "g5"]],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "d5 strikes the centre immediately instead of taking f4. Black makes White answer a central challenge before starting the attack.",
          "d5 golpea el centro de inmediato en vez de tomar f4. Las blancas deben responder antes de iniciar el ataque.",
          "d5 greift sofort das Zentrum an statt f4 zu schlagen. Weiß muss den zentralen Gegenstoß vor dem Angriff beantworten.",
          "d5 colpisce subito il centro invece di prendere f4. Il Bianco deve rispondere prima di iniziare l’attacco.",
          "d5 frappe immédiatement le centre au lieu de prendre f4. Les Blancs doivent répondre avant de lancer l’attaque.",
        ),
        [["d5", "e4"]],
      ),
    ],
  },
  "scotch-gambit": {
    trap: [
      note(
        1,
        text(
          "dxc3 grabs another pawn while the king remains in the centre. Bxf7+ can draw the king onto a queen-fork diagonal.",
          "dxc3 toma otro peón con el rey aún en el centro. Bxf7+ puede atraerlo a una diagonal de horquilla de dama.",
          "dxc3 nimmt einen weiteren Bauern, während der König noch im Zentrum steht. Bxf7+ kann ihn auf eine Diagonale locken, auf der die Dame König und Läufer zugleich angreifen kann.",
          "dxc3 prende un altro pedone con il re ancora al centro. Bxf7+ può attirarlo su una diagonale di forchetta della donna.",
          "dxc3 prend un autre pion avec le roi encore au centre. Bxf7+ peut l’attirer sur une diagonale de fourchette de dame.",
        ),
        [["c4", "f7"]],
        ["c5"],
      ),
      note(
        4,
        text(
          "Qd5+ checks the king on f7 and attacks the bishop on c5. Black must save the king before the bishop.",
          "Qd5+ da jaque al rey f7 y ataca al alfil c5. Las negras deben salvar primero al rey.",
          "Qd5+ gibt König f7 Schach und greift Läufer c5 an. Schwarz muss zuerst den König retten.",
          "Qd5+ dà scacco al re f7 e attacca l’alfiere c5. Il Nero deve prima salvare il re.",
          "Qd5+ donne échec au roi f7 et attaque le fou c5. Les Noirs doivent d’abord sauver le roi.",
        ),
        [
          ["d5", "f7"],
          ["d5", "c5"],
        ],
      ),
      note(
        8,
        text(
          "The queen recovers c3 after taking the bishop on c5. White has active play and Black cannot castle, but this is not a forced win.",
          "La dama recupera c3 tras tomar el alfil c5. Las blancas tienen actividad y las negras no pueden enrocar, pero no hay victoria forzada.",
          "Nach dem Läufer auf c5 schlägt die Dame auch den Bauern auf c3. Weiß hat Aktivität und Schwarz kann nicht rochieren, doch ein Sieg ist nicht erzwungen.",
          "Dopo aver preso l’alfiere in c5, la donna recupera il pedone c3. Il Bianco ha attività e il Nero non può arroccare, ma non è una vittoria forzata.",
          "Après avoir pris le fou c5, la dame récupère le pion c3. Les Blancs ont de l’activité et les Noirs ne peuvent pas roquer, mais la victoire n’est pas forcée.",
        ),
        [],
        ["c3", "e8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nf6 develops and attacks e4 instead of collecting c3. Black contests the centre while preparing to castle.",
          "Nf6 desarrolla y ataca e4 en vez de tomar c3. Las negras disputan el centro y preparan el enroque.",
          "Nf6 entwickelt und greift e4 an statt c3 einzusammeln. Schwarz kämpft ums Zentrum und bereitet die Rochade vor.",
          "Nf6 sviluppa e attacca e4 invece di prendere c3. Il Nero contesta il centro e prepara l’arrocco.",
          "Nf6 développe et attaque e4 au lieu de prendre c3. Les Noirs contestent le centre et préparent le roque.",
        ),
        [["f6", "e4"]],
      ),
    ],
  },
  evans: {
    trap: [
      note(
        1,
        text(
          "dxc3 accepts more material while Black’s king is still on e8. White can sacrifice on f7 to draw it into a fork.",
          "dxc3 acepta más material con el rey aún en e8. Las blancas pueden sacrificar en f7 para atraerlo a una horquilla.",
          "dxc3 nimmt weiteres Material bei König e8. Weiß kann auf f7 opfern, um ihn in eine Gabel zu locken.",
          "dxc3 accetta altro materiale con il re ancora e8. Il Bianco può sacrificare in f7 per attirarlo in una forchetta.",
          "dxc3 accepte plus de matériel avec le roi encore en e8. Les Blancs peuvent sacrifier en f7 pour l’attirer dans une fourchette.",
        ),
        [["c4", "f7"]],
        ["c5"],
      ),
      note(
        4,
        text(
          "The queen checks on d5 and also attacks c5. The king’s reply gives White time to recover the bishop.",
          "La dama da jaque en d5 y también ataca c5. La respuesta del rey da tiempo para recuperar el alfil.",
          "Die Dame gibt auf d5 Schach und greift zugleich c5 an. Die Königsantwort gibt Weiß Zeit zum Läuferrückgewinn.",
          "La donna dà scacco in d5 e attacca anche c5. La risposta del re dà il tempo di recuperare l’alfiere.",
          "La dame donne échec en d5 et attaque aussi c5. La réponse du roi donne le temps de récupérer le fou.",
        ),
        [
          ["d5", "f7"],
          ["d5", "c5"],
        ],
      ),
      note(
        8,
        text(
          "White recovers the c3 pawn and keeps an active queen. The Evans pawn sacrifice still needs compensation; the trap has not forced victory.",
          "Las blancas recuperan c3 y mantienen la dama activa. El peón sacrificado del Evans aún requiere compensación; la victoria no es forzada.",
          "Weiß gewinnt c3 zurück und behält eine aktive Dame. Das Evans-Bauernopfer braucht weiter Kompensation; die Falle erzwingt keinen Sieg.",
          "Il Bianco recupera c3 e mantiene la donna attiva. Il pedone sacrificato dell’Evans richiede ancora compenso: la vittoria non è forzata.",
          "Les Blancs récupèrent c3 et gardent une dame active. Le pion sacrifié de l’Evans exige encore compensation ; la victoire n’est pas forcée.",
        ),
        [],
        ["c3", "e8"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "d6 supports the centre instead of grabbing c3. Black prepares development while avoiding the immediate f7 combination.",
          "d6 sostiene el centro sin tomar c3. Las negras preparan el desarrollo y evitan la combinación inmediata en f7.",
          "d6 stützt das Zentrum statt c3 zu schlagen. Schwarz bereitet die Entwicklung vor und vermeidet die sofortige f7-Kombination.",
          "d6 sostiene il centro invece di prendere c3. Il Nero prepara lo sviluppo ed evita la combinazione immediata in f7.",
          "d6 soutient le centre au lieu de prendre c3. Les Noirs préparent leur développement et évitent la combinaison immédiate en f7.",
        ),
        [["d6", "e5"]],
      ),
    ],
  },
  blackburne: {
    trap: [
      note(
        3,
        text(
          "Nxf7 forks queen and rook, but ignores the queen’s threat against g2. Black’s attack on the king is more urgent.",
          "Nxf7 hace una horquilla a dama y torre, pero ignora la amenaza de la dama contra g2. El ataque negro al rey es más urgente.",
          "Nxf7 gabelt Dame und Turm, ignoriert aber die Damendrohung gegen g2. Der schwarze Königsangriff ist dringender.",
          "Nxf7 attacca donna e torre, ma ignora la minaccia della donna contro g2. L’attacco nero al re è più urgente.",
          "Nxf7 attaque dame et tour, mais ignore la menace de la dame contre g2. L’attaque noire contre le roi est plus urgente.",
        ),
        [["g5", "g2"]],
      ),
      note(
        6,
        text(
          "Qxe4+ forces White to block the check. That block will trap the king beside its own pieces.",
          "Qxe4+ obliga a tapar el jaque. Ese bloqueo encerrará al rey junto a sus propias piezas.",
          "Qxe4+ zwingt Weiß zum Blockieren. Dieser Block sperrt den König neben seinen eigenen Figuren ein.",
          "Qxe4+ costringe il Bianco a parare lo scacco. Il blocco chiuderà il re accanto ai suoi pezzi.",
          "Qxe4+ oblige les Blancs à bloquer l’échec. Ce bloc enfermera le roi près de ses propres pièces.",
        ),
        [["e4", "e1"]],
      ),
      note(
        8,
        text(
          "Nf3 gives mate. White’s bishop on e2 blocks its king and is pinned by the queen, so it cannot capture.",
          "Nf3 da mate. El alfil e2 bloquea a su rey y está clavado por la dama: no puede capturar.",
          "Nf3 setzt matt. Der Läufer e2 sperrt seinen König ein und ist von der Dame gefesselt; er darf nicht schlagen.",
          "Nf3 dà matto. L’alfiere e2 blocca il proprio re ed è inchiodato dalla donna: non può catturare.",
          "Nf3 mate. Le fou e2 bloque son roi et est cloué par la dame : il ne peut pas prendre.",
        ),
        [
          ["f3", "e1"],
          ["e4", "e1"],
        ],
        ["e2"],
      ),
    ],
    defense: [
      note(
        1,
        text(
          "Nxd4 removes the advanced knight instead of grabbing e5. Black’s queen-and-knight mating pattern disappears.",
          "Nxd4 elimina el caballo avanzado en vez de tomar e5. Desaparece el patrón de mate de dama y caballo.",
          "Nxd4 entfernt den vorgerückten Springer statt e5 zu schlagen. Das Mattmuster mit Dame und Springer entfällt.",
          "Nxd4 elimina il cavallo avanzato invece di prendere e5. Il matto di donna e cavallo non è più possibile.",
          "Nxd4 élimine le cavalier avancé au lieu de prendre e5. Le réseau de mat dame-cavalier disparaît.",
        ),
        [],
        ["d4"],
      ),
    ],
  },
};

export function teachingNote(
  lesson: OpeningLesson,
  branch: OpeningBranch,
  step: number,
) {
  return annotations[lesson.id]?.[branch].find(
    (entry) => entry.ply === step - setupLength(lesson),
  );
}
