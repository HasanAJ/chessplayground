import { Chess } from "chess.js";
import { checkedGame, gameOutcome } from "./position.ts";
import { uciMove } from "./moves.ts";

export type StudyNode = { id: string; parent: string; uci: string };
export type Study = {
  version: 1;
  id: string;
  name: string;
  rootFen: string;
  nodes: StudyNode[];
  tipId: string;
  mainTipId: string;
  updatedAt: string;
};
export const ROOT = "root";

export function createStudy(fen: string, name = "Untitled game"): Study {
  return {
    version: 1,
    id: crypto.randomUUID(),
    name,
    rootFen: checkedGame(fen).fen(),
    nodes: [],
    tipId: ROOT,
    mainTipId: ROOT,
    updatedAt: new Date().toISOString(),
  };
}

export function nodePath(study: Study, tip = study.tipId): StudyNode[] {
  const nodes = new Map(study.nodes.map((node) => [node.id, node]));
  const path: StudyNode[] = [];
  const visited = new Set<string>();
  for (let id = tip; id !== ROOT;) {
    const node = nodes.get(id);
    if (!node || visited.has(id))
      throw new Error("This saved game has an invalid move path.");
    path.push(node);
    visited.add(id);
    id = node.parent;
  }
  return path.reverse();
}

export function replayStudy(study: Study, tip = study.tipId) {
  const game = checkedGame(study.rootFen);
  const history = [];
  const outcomes = [gameOutcome(game)];
  for (const node of nodePath(study, tip)) {
    if (outcomes.at(-1)!.terminal)
      throw new Error("This saved game continues after the game ended.");
    history.push(uciMove(game, node.uci));
    outcomes.push(gameOutcome(game));
  }
  return { game, history, outcomes };
}

export function addStudyMove(study: Study, parent: string, uci: string): Study {
  if (parent !== ROOT && !study.nodes.some((node) => node.id === parent))
    throw new Error("Cannot attach a move to a missing position.");
  const found = study.nodes.find(
    (node) => node.parent === parent && node.uci === uci,
  );
  const next = found ?? { id: crypto.randomUUID(), parent, uci };
  return {
    ...study,
    nodes: found ? study.nodes : [...study.nodes, next],
    tipId: next.id,
    mainTipId: parent === study.mainTipId ? next.id : study.mainTipId,
    updatedAt: new Date().toISOString(),
  };
}

export function parseStudy(value: unknown): Study {
  if (!value || typeof value !== "object")
    throw new Error("This saved game is not valid.");
  const data = value as Record<string, unknown>;
  if (
    data.version !== 1 ||
    !["id", "name", "rootFen", "tipId", "mainTipId"].every(
      (key) => typeof data[key] === "string",
    ) ||
    !Array.isArray(data.nodes) ||
    data.nodes.length > 10000
  )
    throw new Error("This saved game has an unsupported format.");
  const rootFen = checkedGame(data.rootFen as string).fen();
  const positions = new Map<string, string>([[ROOT, rootFen]]);
  const nodes: StudyNode[] = [];
  for (const raw of data.nodes) {
    if (
      !raw ||
      typeof raw !== "object" ||
      typeof raw.id !== "string" ||
      typeof raw.parent !== "string" ||
      typeof raw.uci !== "string" ||
      raw.id === ROOT ||
      positions.has(raw.id) ||
      !positions.has(raw.parent)
    )
      throw new Error("This saved game has an invalid variation.");
    const position = new Chess(positions.get(raw.parent)!);
    const move = uciMove(position, raw.uci);
    nodes.push({ id: raw.id, parent: raw.parent, uci: move.lan });
    positions.set(raw.id, position.fen());
  }
  if (
    !positions.has(data.tipId as string) ||
    !positions.has(data.mainTipId as string)
  )
    throw new Error("This saved game is missing its current position.");
  const study: Study = {
    version: 1,
    id: data.id as string,
    name: data.name as string,
    rootFen,
    tipId: data.tipId as string,
    mainTipId: data.mainTipId as string,
    nodes,
    updatedAt:
      typeof data.updatedAt === "string"
        ? data.updatedAt
        : new Date().toISOString(),
  };
  replayStudy(study);
  return study;
}
