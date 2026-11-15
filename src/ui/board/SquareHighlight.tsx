import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Move, Square } from "chess.js";
import { useTranslation } from "../../i18n/LanguageProvider.tsx";
import { moveDescription } from "../../domain/chess/moves.ts";

type Input = "hover" | "focus";
type Reference = { square: Square; owner: string; key: string; move?: Move };
type Channels = Record<Input, Reference | null>;
type Action =
  | { type: "show"; input: Input; reference: Reference }
  | { type: "clear"; owner?: string; input?: Input };
type Actions = {
  show: (square: Square, owner: string, input: Input, move?: Move) => void;
  clear: (owner: string, input?: Input) => void;
};
const ActionsContext = createContext<Actions | null>(null);
const SquareContext = createContext<Square | null>(null);
const MoveContext = createContext<Move | null>(null);
const empty: Channels = { hover: null, focus: null };
function reduce(state: Channels, action: Action): Channels {
  if (action.type === "show")
    return { ...state, [action.input]: action.reference };
  const next = { ...state };
  for (const channel of ["hover", "focus"] as const) {
    if (
      (action.input && action.input !== channel) ||
      (action.owner && state[channel]?.owner !== action.owner)
    )
      continue;
    next[channel] = null;
  }
  return next.hover === state.hover && next.focus === state.focus
    ? state
    : next;
}

export function SquareHighlightProvider({
  positionKey,
  children,
}: {
  positionKey: string;
  children: ReactNode;
}) {
  const [channels, dispatch] = useReducer(reduce, empty);
  const reference = [channels.hover, channels.focus].find(
    (entry) => entry?.key === positionKey,
  );
  const show = useCallback<Actions["show"]>(
    (square, owner, input, move) =>
      dispatch({
        type: "show",
        input,
        reference: { square, owner, key: positionKey, move },
      }),
    [positionKey],
  );
  const clear = useCallback<Actions["clear"]>(
    (owner, input) => dispatch({ type: "clear", owner, input }),
    [],
  );
  const actions = useMemo(() => ({ show, clear }), [show, clear]);
  useEffect(() => {
    dispatch({ type: "clear" });
  }, [positionKey]);
  useEffect(() => {
    if (!reference) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch({ type: "clear" });
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [!!reference]);
  return (
    <ActionsContext.Provider value={actions}>
      <SquareContext.Provider value={reference?.square ?? null}>
        <MoveContext.Provider value={reference?.move ?? null}>
          {children}
        </MoveContext.Provider>
      </SquareContext.Provider>
    </ActionsContext.Provider>
  );
}
export const useHighlightedSquare = () => useContext(SquareContext);
export const useHighlightedMove = () => useContext(MoveContext);

function references(text: string) {
  const tokens: (string | { text: string; square: Square; offset: number })[] =
    [];
  const notation =
    /\b(?:[KQRBN](?:[a-h][1-8]|[a-h1-8])?x?|[a-h]x)?([a-h][1-8])(?:=[QRBN])?[+#]?(?!\w)/g;
  let cursor = 0;
  for (const match of text.matchAll(notation)) {
    tokens.push(text.slice(cursor, match.index));
    tokens.push({
      text: match[0],
      square: match[1] as Square,
      offset: match.index,
    });
    cursor = match.index + match[0].length;
  }
  tokens.push(text.slice(cursor));
  return tokens;
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
  const actions = useContext(ActionsContext),
    owner = useId();
  const { t } = useTranslation();
  const tokens = useMemo(() => references(text), [text]);
  useEffect(() => () => actions?.clear(owner), [actions, owner, text, move]);
  return (
    <>
      {tokens.map((token, index) => {
        if (typeof token === "string") return token;
        const incoming = move?.to === token.square ? move : undefined;
        const Tag = focusable && actions ? "button" : "span";
        const show = (input: Input) =>
          actions?.show(token.square, owner, input, incoming);
        return (
          <Tag
            key={token.offset + ":" + index}
            className="square-reference"
            data-square-reference={token.square}
            type={Tag === "button" ? "button" : undefined}
            aria-label={
              Tag === "button"
                ? `${token.text}: ${incoming ? moveDescription(incoming, t) : t("board.square.highlight", token.square)}`
                : undefined
            }
            onClick={() => show("focus")}
            onFocus={() => show("focus")}
            onBlur={() => actions?.clear(owner, "focus")}
            onMouseEnter={() => show("hover")}
            onMouseLeave={() => actions?.clear(owner, "hover")}
          >
            {token.text}
          </Tag>
        );
      })}
    </>
  );
}
