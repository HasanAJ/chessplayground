export type EngineLine = {
  rank: number;
  depth: number;
  cp?: number;
  mate?: number;
  pv: string[];
};

export const isUciMove = (value: string): boolean =>
  /^[a-h][1-8][a-h][1-8][qrbn]?$/.test(value);

export function selectBestLine(
  lines: EngineLine[],
  move?: string,
  final?: EngineLine,
) {
  if (!move) return lines[0];
  return final?.pv[0] === move
    ? final
    : lines.find((line) => line.pv[0] === move);
}
