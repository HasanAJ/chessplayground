export type SearchSettings = { seconds: number; moves: number };

export const DEFAULT_SEARCH_SETTINGS: SearchSettings = { seconds: 2, moves: 3 };
export const SEARCH_LIMITS = {
  seconds: { min: 0.5, max: 60, step: 0.5 },
  moves: { min: 1, max: 10, step: 1 },
};

export function validSearchSetting(key: keyof SearchSettings, value: number) {
  const { min, max, step } = SEARCH_LIMITS[key];
  return (
    Number.isFinite(value) &&
    value >= min &&
    value <= max &&
    Number.isInteger((value - min) / step)
  );
}
