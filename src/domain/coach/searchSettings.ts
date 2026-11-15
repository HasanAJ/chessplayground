export type SearchSettings = { seconds: number; moves: number };
export const DEFAULT_SEARCH_SETTINGS: SearchSettings = { seconds: 2, moves: 3 };
export const SEARCH_LIMITS = {
  seconds: { min: 0.5, max: 60, step: 0.5 },
  moves: { min: 1, max: 10, step: 1 },
};
export function validSearchSetting(
  setting: keyof SearchSettings,
  value: number,
) {
  if (!Number.isFinite(value)) return false;
  const limit = SEARCH_LIMITS[setting];
  const units = (value - limit.min) / limit.step;
  return units >= 0 && value <= limit.max && Number.isInteger(units);
}
