import type { Language } from "./translate.ts";

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
      "Set up a position and find strong moves with Stockfish. Try a suggested move or preview a reply to see what happens next.",
    analysis:
      "Your coach explains captures and threats by showing how the next few moves could play out. Everything runs in your browser. Your game saves here when your browser allows it. More time to analyze can change the suggested moves and position score.",
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
      "Prepara una posición y encuentra buenas jugadas con Stockfish. Prueba una sugerencia o mira una posible respuesta para descubrir qué pasa después.",
    analysis:
      "Tu entrenador explica capturas y amenazas mostrando cómo podrían seguir las próximas jugadas. Todo funciona en tu navegador. Tu partida se guarda aquí cuando el navegador lo permite. Con más tiempo de análisis, las jugadas sugeridas y la valoración pueden cambiar.",
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
      "Baue eine Stellung auf und finde starke Züge mit Stockfish. Probiere einen Zugvorschlag aus oder sieh dir eine Antwort an, um zu sehen, wie es weitergeht.",
    analysis:
      "Dein Trainer erklärt Schlagzüge und Drohungen anhand der nächsten möglichen Züge. Alles läuft in deinem Browser. Deine Partie wird hier gespeichert, wenn dein Browser es zulässt. Mehr Zeit für die Analyse kann die Zugvorschläge und die Stellungsbewertung verändern.",
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
      "Prepara una posizione e trova buone mosse con Stockfish. Prova una mossa suggerita o guarda una possibile risposta per scoprire cosa succede dopo.",
    analysis:
      "Il tuo allenatore spiega catture e minacce mostrando come potrebbero proseguire le prossime mosse. Tutto funziona nel browser. La partita viene salvata qui quando il browser lo consente. Con più tempo per l’analisi, le mosse suggerite e la valutazione possono cambiare.",
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
      "Préparez une position et trouvez de bons coups avec Stockfish. Essayez un coup proposé ou regardez une réponse possible pour découvrir la suite.",
    analysis:
      "Votre coach explique les captures et les menaces en montrant les prochains coups possibles. Tout fonctionne dans votre navigateur. Votre partie y est enregistrée quand le navigateur le permet. Avec plus de temps d’analyse, les coups proposés et l’évaluation peuvent changer.",
    languagesLabel: "Langues disponibles",
    javascript:
      "Activez JavaScript pour utiliser l’échiquier interactif et le moteur local.",
  },
};
