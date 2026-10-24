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
import type { Square } from "chess.js";
import { useTranslation } from "../../i18n/LanguageProvider";

type Input = "hover" | "focus";
type Highlight = { square: Square; owner: string; key: string };
const SquareHighlightContext = createContext<{
  show: (square: Square, owner: string, input: Input) => void;
  clear: (owner: string, input?: Input) => void;
} | null>(null);
const HighlightedSquareContext = createContext<Square | null>(null);

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
  const show = useCallback(
    (square: Square, owner: string, input: Input) => {
      const set = input === "hover" ? setHovered : setFocused;
      set({ square, owner, key: positionKey });
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
        {children}
      </HighlightedSquareContext.Provider>
    </SquareHighlightContext.Provider>
  );
}

export function useHighlightedSquare() {
  return useContext(HighlightedSquareContext);
}

export function SquareText({
  text,
  focusable = true,
}: {
  text: string;
  focusable?: boolean;
}) {
  const highlight = useContext(SquareHighlightContext);
  const { t } = useTranslation();
  const owner = useId();
  const clear = highlight?.clear;
  useEffect(() => () => clear?.(owner), [clear, owner, text]);
  const parts: ReactNode[] = [];
  let end = 0;
  // Include notation such as Nf3, Nbd2, exd5 and e8=Q+, as well as bare squares.
  for (const match of text.matchAll(
    /\b(?:[KQRBN](?:[a-h][1-8]|[a-h1-8])?x?|[a-h]x)?([a-h][1-8])(?:=[QRBN])?[+#]?(?!\w)/g,
  )) {
    const square = match[1] as Square;
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
            ? `${match[0]}: ${t("board.square.highlight", square)}`
            : undefined
        }
        onClick={() => highlight?.show(square, owner, "focus")}
        onMouseEnter={() => highlight?.show(square, owner, "hover")}
        onMouseLeave={() => clear?.(owner, "hover")}
        onFocus={() => highlight?.show(square, owner, "focus")}
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
