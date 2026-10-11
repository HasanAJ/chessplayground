import type { Language } from "./translate";

type SiteContent = {
  title: string;
  description: string;
  imageAlt: string;
  heading: string;
  intro: string;
  stepsHeading: string;
  steps: string[];
  analysisHeading: string;
  analysis: string;
  languagesLabel: string;
  javascript: string;
};

export const siteContent: Record<Language, SiteContent> = {
  en: {
    title: "Tempo — Chess Coach & Position Playground",
    description:
      "Free online chess analysis with Stockfish. Set up positions, explore explained moves, and practice against a computer in your browser.",
    imageAlt: "Tempo chess coach: your next move, explained.",
    heading: "Free chess analysis and practice",
    intro:
      "Play for either side, practice against a computer, or build a position to study. Tempo uses Stockfish 19 Lite to suggest chess moves and explain captures, threats, and plans in plain language.",
    stepsHeading: "Explore a chess position",
    steps: [
      "Click a piece and a legal destination, or drag a legal move to play.",
      "Add pieces from the trays or paste a FEN below the board to study a specific position.",
      "Choose Calculate best moves, then preview a reply or continuation to understand the suggestion.",
    ],
    analysisHeading: "Understand your next move",
    analysis:
      "Analysis runs in your browser, and your game saves here when storage is available. Move reviews compare your choices with engine alternatives. Short searches and explanations are learning aids; deeper analysis can change a move’s grade.",
    languagesLabel: "Available languages",
    javascript:
      "Enable JavaScript to use the interactive chessboard and local engine.",
  },
  es: {
    title: "Tempo — Entrenador de ajedrez y análisis de posiciones",
    description:
      "Análisis de ajedrez gratis con Stockfish. Prepara posiciones, explora jugadas explicadas y practica contra el ordenador desde tu navegador.",
    imageAlt: "Tempo, tu entrenador de ajedrez: tu próxima jugada, explicada.",
    heading: "Análisis y práctica de ajedrez gratis",
    intro:
      "Juega con ambos bandos, practica contra el ordenador o prepara una posición para estudiarla. Tempo usa Stockfish 19 Lite para sugerir jugadas y explicar capturas, amenazas y planes con palabras sencillas.",
    stepsHeading: "Explora una posición de ajedrez",
    steps: [
      "Haz clic en una pieza y un destino legal, o arrastra una jugada legal para jugar.",
      "Añade piezas desde las bandejas o pega un FEN debajo del tablero para estudiar una posición concreta.",
      "Elige Calcular mejores jugadas y previsualiza una respuesta o continuación para entender la sugerencia.",
    ],
    analysisHeading: "Entiende tu próxima jugada",
    analysis:
      "El análisis se ejecuta en tu navegador y la partida se guarda aquí cuando el almacenamiento está disponible. Las revisiones comparan tus jugadas con las alternativas del motor. Las búsquedas breves y las explicaciones ayudan a aprender; un análisis más profundo puede cambiar la valoración de una jugada.",
    languagesLabel: "Idiomas disponibles",
    javascript:
      "Activa JavaScript para usar el tablero interactivo y el motor local.",
  },
  de: {
    title: "Tempo — Schachtrainer und Stellungsanalyse",
    description:
      "Kostenlose Schachanalyse mit Stockfish. Baue Stellungen auf, erkunde erklärte Züge und übe gegen den Computer direkt im Browser.",
    imageAlt: "Tempo Schachtrainer: Dein nächster Zug, erklärt.",
    heading: "Kostenlose Schachanalyse und Übung",
    intro:
      "Spiele beide Seiten, übe gegen den Computer oder baue eine Stellung zum Lernen auf. Tempo nutzt Stockfish 19 Lite, um Schachzüge vorzuschlagen und Schläge, Drohungen und Pläne verständlich zu erklären.",
    stepsHeading: "Erkunde eine Schachstellung",
    steps: [
      "Klicke auf eine Figur und ein legales Zielfeld oder ziehe einen legalen Zug auf dem Brett.",
      "Füge Figuren aus der Ablage hinzu oder füge unter dem Brett eine FEN ein, um eine bestimmte Stellung zu untersuchen.",
      "Wähle Beste Züge berechnen und sieh dir eine Antwort oder Fortsetzung an, um den Vorschlag zu verstehen.",
    ],
    analysisHeading: "Verstehe deinen nächsten Zug",
    analysis:
      "Die Analyse läuft in deinem Browser. Deine Partie wird hier gespeichert, wenn der Browserspeicher verfügbar ist. Zugbewertungen vergleichen deine Wahl mit Alternativen der Engine. Kurze Suchen und Erklärungen helfen beim Lernen; eine tiefere Analyse kann die Bewertung eines Zuges ändern.",
    languagesLabel: "Verfügbare Sprachen",
    javascript:
      "Aktiviere JavaScript, um das interaktive Schachbrett und die lokale Engine zu nutzen.",
  },
  it: {
    title: "Tempo — Allenatore di scacchi e analisi delle posizioni",
    description:
      "Analisi scacchistica gratuita con Stockfish. Prepara posizioni, esplora mosse spiegate e allenati contro il computer nel browser.",
    imageAlt:
      "Tempo, il tuo allenatore di scacchi: la tua prossima mossa, spiegata.",
    heading: "Analisi e pratica scacchistica gratuite",
    intro:
      "Gioca con entrambi i colori, allenati contro il computer o prepara una posizione da studiare. Tempo usa Stockfish 19 Lite per suggerire mosse e spiegare catture, minacce e piani con parole semplici.",
    stepsHeading: "Esplora una posizione di scacchi",
    steps: [
      "Fai clic su un pezzo e su una destinazione legale, oppure trascina una mossa legale per giocare.",
      "Aggiungi pezzi dalle vaschette o incolla una FEN sotto la scacchiera per studiare una posizione specifica.",
      "Scegli Calcola le migliori mosse e guarda una risposta o continuazione per capire il suggerimento.",
    ],
    analysisHeading: "Comprendi la tua prossima mossa",
    analysis:
      "L’analisi viene eseguita nel browser e la partita viene salvata qui quando lo spazio di archiviazione è disponibile. Le revisioni confrontano le tue mosse con le alternative del motore. Le ricerche brevi e le spiegazioni aiutano a imparare; un’analisi più approfondita può cambiare la valutazione di una mossa.",
    languagesLabel: "Lingue disponibili",
    javascript:
      "Attiva JavaScript per usare la scacchiera interattiva e il motore locale.",
  },
  fr: {
    title: "Tempo — Coach d’échecs et analyse de positions",
    description:
      "Analyse d’échecs gratuite avec Stockfish. Préparez des positions, explorez des coups expliqués et entraînez-vous contre l’ordinateur dans votre navigateur.",
    imageAlt: "Tempo, votre coach d’échecs : votre prochain coup, expliqué.",
    heading: "Analyse et entraînement aux échecs gratuits",
    intro:
      "Jouez les deux camps, entraînez-vous contre l’ordinateur ou préparez une position à étudier. Tempo utilise Stockfish 19 Lite pour suggérer des coups et expliquer les captures, les menaces et les plans avec des mots simples.",
    stepsHeading: "Explorez une position d’échecs",
    steps: [
      "Cliquez sur une pièce puis sur une destination légale, ou glissez un coup légal pour jouer.",
      "Ajoutez des pièces depuis les réserves ou collez un FEN sous l’échiquier pour étudier une position précise.",
      "Choisissez Calculer les meilleurs coups, puis regardez une réponse ou une suite pour comprendre la suggestion.",
    ],
    analysisHeading: "Comprenez votre prochain coup",
    analysis:
      "L’analyse s’exécute dans votre navigateur et la partie y est enregistrée quand le stockage est disponible. Les examens de coups comparent vos choix aux alternatives du moteur. Les recherches courtes et les explications aident à apprendre ; une analyse plus poussée peut modifier la note d’un coup.",
    languagesLabel: "Langues disponibles",
    javascript:
      "Activez JavaScript pour utiliser l’échiquier interactif et le moteur local.",
  },
};
