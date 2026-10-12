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
    title: "Tempo — Chess Coach & Position Playground",
    description:
      "Free online chess analysis with Stockfish. Set up positions, explore explained moves, and practice against a computer in your browser.",
    imageAlt: "Tempo chess coach: your next move, explained.",
    heading: "About your chess coach",
    intro:
      "Tempo uses Stockfish 19 Lite to suggest strong moves and explain captures, threats, and plans in plain language.",
    analysis:
      "Analysis runs in your browser, and your game saves locally when storage is available. Move reviews compare your choices with engine alternatives. Short searches are learning aids; deeper analysis can change a move’s grade.",
    languagesLabel: "Available languages",
    javascript:
      "Enable JavaScript to use the interactive chessboard and local engine.",
  },
  es: {
    title: "Tempo — Entrenador de ajedrez y análisis de posiciones",
    description:
      "Análisis de ajedrez gratis con Stockfish. Prepara posiciones, explora jugadas explicadas y practica contra el ordenador desde tu navegador.",
    imageAlt: "Tempo, tu entrenador de ajedrez: tu próxima jugada, explicada.",
    heading: "Sobre tu entrenador de ajedrez",
    intro:
      "Tempo usa Stockfish 19 Lite para sugerir buenas jugadas y explicar capturas, amenazas y planes con palabras sencillas.",
    analysis:
      "El análisis se ejecuta en tu navegador y la partida se guarda localmente cuando el almacenamiento está disponible. Las revisiones comparan tus jugadas con las alternativas del motor. Las búsquedas breves ayudan a aprender; un análisis más profundo puede cambiar la valoración de una jugada.",
    languagesLabel: "Idiomas disponibles",
    javascript:
      "Activa JavaScript para usar el tablero interactivo y el motor local.",
  },
  de: {
    title: "Tempo — Schachtrainer und Stellungsanalyse",
    description:
      "Kostenlose Schachanalyse mit Stockfish. Baue Stellungen auf, erkunde erklärte Züge und übe gegen den Computer direkt im Browser.",
    imageAlt: "Tempo Schachtrainer: Dein nächster Zug, erklärt.",
    heading: "Über deinen Schachtrainer",
    intro:
      "Tempo nutzt Stockfish 19 Lite, um starke Züge vorzuschlagen und Schlagzüge, Drohungen und Pläne verständlich zu erklären.",
    analysis:
      "Die Analyse läuft in deinem Browser. Deine Partie wird lokal gespeichert, wenn der Browserspeicher verfügbar ist. Zugbewertungen vergleichen deine Wahl mit Alternativen der Engine. Kurze Suchen helfen beim Lernen; eine tiefere Analyse kann die Bewertung eines Zuges ändern.",
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
    heading: "Il tuo allenatore di scacchi",
    intro:
      "Tempo usa Stockfish 19 Lite per suggerire buone mosse e spiegare catture, minacce e piani con parole semplici.",
    analysis:
      "L’analisi viene eseguita nel browser e la partita viene salvata localmente quando lo spazio di archiviazione è disponibile. Le revisioni confrontano le tue mosse con le alternative del motore. Le ricerche brevi aiutano a imparare; un’analisi più approfondita può cambiare la valutazione di una mossa.",
    languagesLabel: "Lingue disponibili",
    javascript:
      "Attiva JavaScript per usare la scacchiera interattiva e il motore locale.",
  },
  fr: {
    title: "Tempo — Coach d’échecs et analyse de positions",
    description:
      "Analyse d’échecs gratuite avec Stockfish. Préparez des positions, explorez des coups expliqués et entraînez-vous contre l’ordinateur dans votre navigateur.",
    imageAlt: "Tempo, votre coach d’échecs : votre prochain coup, expliqué.",
    heading: "À propos de votre coach d’échecs",
    intro:
      "Tempo utilise Stockfish 19 Lite pour suggérer de bons coups et expliquer les captures, les menaces et les plans avec des mots simples.",
    analysis:
      "L’analyse s’exécute dans votre navigateur et la partie est enregistrée localement quand le stockage est disponible. Les évaluations comparent vos choix aux alternatives du moteur. Les recherches courtes aident à apprendre ; une analyse plus poussée peut modifier la note d’un coup.",
    languagesLabel: "Langues disponibles",
    javascript:
      "Activez JavaScript pour utiliser l’échiquier interactif et le moteur local.",
  },
};
