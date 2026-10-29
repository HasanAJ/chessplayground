export type EngineLine = {
  rank: number;
  depth: number;
  cp?: number;
  mate?: number;
  pv: string[];
};

export function selectBestLine(
  lines: EngineLine[],
  bestMove?: string,
  bestLine?: EngineLine,
): EngineLine | undefined {
  if (!bestMove) return lines[0];
  if (bestLine?.pv[0] === bestMove) return bestLine;
  return lines.find((line) => line.pv[0] === bestMove);
}

export function parseInfo(line: string): EngineLine | null {
  if (
    !line.startsWith("info ") ||
    line.includes("upperbound") ||
    line.includes("lowerbound")
  )
    return null;
  const depth = line.match(/\bdepth (\d+)/),
    rank = line.match(/\bmultipv (\d+)/),
    score = line.match(/\bscore (cp|mate) (-?\d+)/),
    pv = line.match(/\bpv (.+)$/);
  if (!depth || !score || !pv) return null;
  return {
    rank: Number(rank?.[1] ?? 1),
    depth: Number(depth[1]),
    [score[1]]: Number(score[2]),
    pv: pv[1].trim().split(/\s+/),
  };
}
