import type { EngineLine } from "./uci";

/** Keep comparable rankings separate from a final move's newer, incomplete depth. */
export class MultiPvResults {
  private readonly depths = new Map<number, Map<number, EngineLine>>();
  private complete: EngineLine[] = [];

  constructor(private readonly expected: number) {}

  get lines(): EngineLine[] {
    return this.complete;
  }

  add(info: EngineLine): boolean {
    if (info.rank < 1 || info.rank > this.expected) return false;
    let batch = this.depths.get(info.depth);
    if (!batch) {
      batch = new Map();
      this.depths.set(info.depth, batch);
    }
    batch.set(info.rank, info);
    if (
      batch.size !== this.expected ||
      info.depth < (this.complete[0]?.depth ?? 0)
    )
      return false;

    const lines = [...batch.values()].sort((a, b) => a.rank - b.rank);
    if (new Set(lines.map((line) => line.pv[0])).size !== this.expected)
      return false;

    this.complete = lines;
    return true;
  }

  bestLine(bestMove: string | undefined): EngineLine | undefined {
    let best: EngineLine | undefined;
    for (const batch of this.depths.values()) {
      for (const line of batch.values()) {
        if (line.pv[0] === bestMove && (!best || line.depth >= best.depth))
          best = line;
      }
    }
    return best;
  }
}
