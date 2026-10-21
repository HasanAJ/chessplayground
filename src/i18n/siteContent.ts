import type { Language } from "./translate";

type SiteContent = {
  title: string;
  description: string;
  imageAlt: string;
  heading: string;
  intro: string;
  analysis: string;
  languagesLabel: string;
  javascript: string;
};

export const siteContent: Record<Language, SiteContent> = {
  en: {
    title: "Free Chess Analysis with Move Explanations | Tempo",
    description:
      "Analyze chess positions free with Stockfish. Explore suggested moves with plain-language explanations, set up a board, and practice against the computer.",
    imageAlt: "Tempo: free chess analysis with move explanations.",
    heading: "How to use Tempo",
    intro:
      "Set up a position on the board, calculate suggested moves with Stockfish, then preview replies or play a suggestion to explore what happens next.",
    analysis:
      "The coach explains captures, threats, and other tactical features using short engine continuations. Analysis runs in your browser, and your game saves locally when storage is available. A deeper search may change the assessment.",
    languagesLabel: "Available languages",
    javascript:
      "Enable JavaScript to use the interactive chessboard and local engine.",
  },
  es: {
    title: "Análisis de ajedrez gratis con jugadas explicadas | Tempo",
    description:
      "Analiza posiciones de ajedrez gratis con Stockfish. Explora jugadas explicadas con palabras sencillas, prepara el tablero y practica contra el ordenador.",
    imageAlt: "Tempo: análisis de ajedrez gratis con jugadas explicadas.",
    heading: "Cómo usar Tempo",
    intro:
      "Prepara una posición en el tablero, calcula jugadas con Stockfish y previsualiza respuestas o juega una sugerencia para explorar qué ocurre después.",
    analysis:
      "El entrenador explica capturas, amenazas y otros aspectos tácticos a partir de variantes cortas del motor. El análisis se ejecuta en tu navegador y la partida se guarda localmente cuando el almacenamiento está disponible. Una búsqueda más profunda puede cambiar la valoración.",
    languagesLabel: "Idiomas disponibles",
    javascript:
      "Activa JavaScript para usar el tablero interactivo y el motor local.",
  },
  de: {
    title: "Kostenlose Schachanalyse mit erklärten Zügen | Tempo",
    description:
      "Analysiere Schachstellungen kostenlos mit Stockfish. Entdecke verständlich erklärte Zugvorschläge, baue Stellungen auf und übe gegen den Computer.",
    imageAlt: "Tempo: kostenlose Schachanalyse mit erklärten Zügen.",
    heading: "So nutzt du Tempo",
    intro:
      "Baue eine Stellung auf dem Brett auf, berechne Zugvorschläge mit Stockfish und sieh dir Antworten an oder spiele einen Vorschlag, um die Fortsetzung zu erkunden.",
    analysis:
      "Der Trainer erklärt Schlagzüge, Drohungen und andere taktische Merkmale anhand kurzer Engine-Varianten. Die Analyse läuft in deinem Browser, und deine Partie wird bei verfügbarem Browserspeicher lokal gespeichert. Eine tiefere Suche kann die Bewertung ändern.",
    languagesLabel: "Verfügbare Sprachen",
    javascript:
      "Aktiviere JavaScript, um das interaktive Schachbrett und die lokale Engine zu nutzen.",
  },
  it: {
    title: "Analisi scacchistica gratuita con mosse spiegate | Tempo",
    description:
      "Analizza posizioni di scacchi gratis con Stockfish. Esplora mosse spiegate con parole semplici, prepara la scacchiera e allenati contro il computer.",
    imageAlt: "Tempo: analisi scacchistica gratuita con mosse spiegate.",
    heading: "Come usare Tempo",
    intro:
      "Prepara una posizione sulla scacchiera, calcola le mosse con Stockfish, poi visualizza le risposte o gioca un suggerimento per esplorare il seguito.",
    analysis:
      "L’allenatore spiega catture, minacce e altri aspetti tattici usando brevi varianti del motore. L’analisi viene eseguita nel browser e la partita viene salvata localmente quando lo spazio di archiviazione è disponibile. Una ricerca più approfondita può cambiare la valutazione.",
    languagesLabel: "Lingue disponibili",
    javascript:
      "Attiva JavaScript per usare la scacchiera interattiva e il motore locale.",
  },
  fr: {
    title: "Analyse d’échecs gratuite avec coups expliqués | Tempo",
    description:
      "Analysez des positions d’échecs gratuitement avec Stockfish. Découvrez des coups expliqués simplement, préparez l’échiquier et jouez contre l’ordinateur.",
    imageAlt: "Tempo : analyse d’échecs gratuite avec coups expliqués.",
    heading: "Comment utiliser Tempo",
    intro:
      "Préparez une position sur l’échiquier, calculez des coups avec Stockfish, puis prévisualisez les réponses ou jouez une suggestion pour explorer la suite.",
    analysis:
      "Le coach explique les captures, les menaces et d’autres aspects tactiques à partir de courtes variantes du moteur. L’analyse s’exécute dans votre navigateur et la partie est enregistrée localement quand le stockage est disponible. Une recherche plus poussée peut modifier l’évaluation.",
    languagesLabel: "Langues disponibles",
    javascript:
      "Activez JavaScript pour utiliser l’échiquier interactif et le moteur local.",
  },
};
