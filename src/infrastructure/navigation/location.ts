import { useSyncExternalStore } from "react";

const changed = "tempo:navigate";
const locationSnapshot = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;
function subscribe(listener: () => void) {
  for (const event of ["popstate", "hashchange", changed])
    window.addEventListener(event, listener);
  return () => {
    for (const event of ["popstate", "hashchange", changed])
      window.removeEventListener(event, listener);
  };
}
export function navigate(path: string) {
  const target = new URL(path, window.location.href);
  if (target.origin !== window.location.origin)
    throw new Error("App navigation requires a same-origin URL.");
  const next = target.pathname + target.search + target.hash;
  if (locationSnapshot() === next) return;
  window.history.pushState(null, "", next);
  window.dispatchEvent(new window.Event(changed));
}
export function useLocation() {
  return useSyncExternalStore(subscribe, locationSnapshot, () => "/");
}
