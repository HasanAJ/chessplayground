import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Move, Square } from "chess.js";
import { useTranslation } from "../../i18n/LanguageProvider";
import { moveDescription } from "../../chess/moves";

type Input = "hover" | "focus";
type Highlight = { square: Square; owner: string; key: string; move?: Move };
const SquareHighlightContext = createContext<{
  show: (square: Square, owner: string, input: Input, move?: Move) => void;
  clear: (owner: string, input?: Input) => void;
} | null>(null);
const HighlightedSquareContext = createContext<Square | null>(null);
const HighlightedMoveContext = createContext<Move | null>(null);

export function SquareHighlightProvider({
  positionKey,
  children,
}: {
  positionKey: string;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState<Highlight | null>(null);
  const [focused, setFocused] = useState<Highlight | null>(null);
  const active = hovered ?? focused;
  const square = active?.key === positionKey ? active.square : null;
  const move = active?.key === positionKey ? (active.move ?? null) : null;
  const show = useCallback(
    (square: Square, owner: string, input: Input, move?: Move) => {
      const set = input === "hover" ? setHovered : setFocused;
      set({ square, owner, key: positionKey, move });
    },
    [positionKey],
  );
  const clear = useCallback((owner: string, input?: Input) => {
    if (!input || input === "hover")
      setHovered((current) => (current?.owner === owner ? null : current));
    if (!input || input === "focus")
      setFocused((current) => (current?.owner === owner ? null : current));
  }, []);
  useEffect(() => {
    setHovered(null);
    setFocused(null);
  }, [positionKey]);
  useEffect(() => {
    if (!square) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHovered(null);
        setFocused(null);
      }
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [square]);
  const actions = useMemo(() => ({ show, clear }), [show, clear]);
  return (
    <SquareHighlightContext.Provider value={actions}>
      <HighlightedSquareContext.Provider value={square}>
        <HighlightedMoveContext.Provider value={move}>
          {children}
        </HighlightedMoveContext.Provider>
      </HighlightedSquareContext.Provider>
    </SquareHighlightContext.Provider>
  );
}

export function useHighlightedSquare() {
  return useContext(HighlightedSquareContext);
}

export function useHighlightedMove() {
  return useContext(HighlightedMoveContext);
}

export function SquareText({
  text,
  focusable = true,
  move,
}: {
  text: string;
  focusable?: boolean;
  move?: Move;
}) {
  const highlight = useContext(SquareHighlightContext);
  const { t } = useTranslation();
  const owner = useId();
  const clear = highlight?.clear;
  useEffect(() => () => clear?.(owner), [clear, owner, text, move]);
  const parts: ReactNode[] = [];
  let end = 0;
  // Include notation such as Nf3, Nbd2, exd5 and e8=Q+, as well as bare squares.
  for (const match of text.matchAll(
    /\b(?:[KQRBN](?:[a-h][1-8]|[a-h1-8])?x?|[a-h]x)?([a-h][1-8])(?:=[QRBN])?[+#]?(?!\w)/g,
  )) {
    const square = match[1] as Square;
    const referenceMove = move?.to === square ? move : undefined;
    parts.push(text.slice(end, match.index));
    const Tag = focusable && highlight ? "button" : "span";
    parts.push(
      <Tag
        key={match.index}
        className="square-reference"
        data-square-reference={square}
        type={Tag === "button" ? "button" : undefined}
        aria-label={
          Tag === "button"
            ? `${match[0]}: ${referenceMove ? moveDescription(referenceMove, t) : t("board.square.highlight", square)}`
            : undefined
        }
        onClick={() => highlight?.show(square, owner, "focus", referenceMove)}
        onMouseEnter={() => highlight?.show(square, owner, "hover", referenceMove)}
        onMouseLeave={() => clear?.(owner, "hover")}
        onFocus={() => highlight?.show(square, owner, "focus", referenceMove)}
        onBlur={() => clear?.(owner, "focus")}
      >
        {match[0]}
      </Tag>,
    );
    end = match.index + match[0].length;
  }
  parts.push(text.slice(end));
  return <>{parts}</>;
}
