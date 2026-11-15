import type { EngineLine } from "../../domain/analysis/lines.ts";

/** Rankings are comparable only when every distinct root has the same depth. */
export class MultiPvResults {
  private batches = new Map<number, Map<number, EngineLine>>();
  private latestByMove = new Map<string, EngineLine>();
  private completed: EngineLine[] = [];
  constructor(private expected: number) {}
  get lines() {
    return this.completed;
  }

  add(line: EngineLine): boolean {
    if (line.rank > this.expected || line.rank < 1) return false;
    const previous = this.latestByMove.get(line.pv[0]);
    if (!previous || previous.depth <= line.depth)
      this.latestByMove.set(line.pv[0], line);
    if (line.depth < (this.completed[0]?.depth ?? 0)) return false;
    const batch = this.batches.get(line.depth) ?? new Map<number, EngineLine>();
    batch.set(line.rank, line);
    this.batches.set(line.depth, batch);
    if (batch.size !== this.expected) return false;
    const ranked = [...batch.values()].sort((a, b) => a.rank - b.rank);
    if (new Set(ranked.map((entry) => entry.pv[0])).size !== this.expected)
      return false;
    this.completed = ranked;
    for (const depth of this.batches.keys())
      if (depth < line.depth) this.batches.delete(depth);
    return true;
  }
  bestLine(move?: string) {
    return move ? this.latestByMove.get(move) : undefined;
  }
}
