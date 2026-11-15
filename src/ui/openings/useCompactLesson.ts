import { useCallback, useMemo, useSyncExternalStore } from "react";
export function useCompactLesson() {
  const media = useMemo(() => window.matchMedia("(max-width: 900px)"), []);
  const subscribe = useCallback(
    (changed: () => void) => {
      media.addEventListener("change", changed);
      return () => media.removeEventListener("change", changed);
    },
    [media],
  );
  return useSyncExternalStore(
    subscribe,
    () => media.matches,
    () => false,
  );
}
