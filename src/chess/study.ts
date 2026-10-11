import { Chess } from "chess.js";
import { checkedGame } from "./position";
import { uciMove } from "./moves";

type StudyNode = { id: string; parent: string; uci: string };
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
export const SESSION_KEY = "tempo-session-v1";
const MAX_STUDY_NODES = 10000;

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

export function nodePath(study: Study, id = study.tipId): StudyNode[] {
  const byId = new Map(study.nodes.map((node) => [node.id, node]));
  const path: StudyNode[] = [];
  const seen = new Set<string>();
  while (id !== ROOT) {
    const node = byId.get(id);
    if (!node || seen.has(id))
      throw new Error("This saved game has an invalid move path.");
    seen.add(id);
    path.push(node);
    id = node.parent;
  }
  return path.reverse();
}

export function gameAt(study: Study, id = study.tipId): Chess {
  const game = checkedGame(study.rootFen);
  for (const node of nodePath(study, id)) uciMove(game, node.uci);
  return game;
}

export function addStudyMove(study: Study, parent: string, uci: string): Study {
  const game = gameAt(study, parent);
  const move = uciMove(game, uci);
  const existing = study.nodes.find(
    (node) => node.parent === parent && node.uci === move.lan,
  );
  const node = existing ?? { id: crypto.randomUUID(), parent, uci: move.lan };
  return {
    ...study,
    nodes: existing ? study.nodes : [...study.nodes, node],
    tipId: node.id,
    mainTipId: parent === study.mainTipId ? node.id : study.mainTipId,
    updatedAt: new Date().toISOString(),
  };
}

export function parseStudy(value: unknown): Study {
  if (!value || typeof value !== "object")
    throw new Error("This saved game is not valid.");
  const study = value as Study;
  if (
    study.version !== 1 ||
    typeof study.id !== "string" ||
    typeof study.name !== "string" ||
    typeof study.rootFen !== "string" ||
    !Array.isArray(study.nodes) ||
    study.nodes.length > MAX_STUDY_NODES ||
    typeof study.tipId !== "string" ||
    typeof study.mainTipId !== "string"
  )
    throw new Error("This saved game has an unsupported format.");
  checkedGame(study.rootFen);
  const positions = new Map<string, string>([[ROOT, study.rootFen]]);
  for (const node of study.nodes) {
    if (
      typeof node.id !== "string" ||
      node.id === ROOT ||
      positions.has(node.id) ||
      typeof node.uci !== "string" ||
      !positions.has(node.parent)
    )
      throw new Error("This saved game has an invalid variation.");
    const game = new Chess(positions.get(node.parent)!);
    uciMove(game, node.uci);
    positions.set(node.id, game.fen());
  }
  if (!positions.has(study.tipId) || !positions.has(study.mainTipId))
    throw new Error("This saved game is missing its current position.");
  return study;
}
