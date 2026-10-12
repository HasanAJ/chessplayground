import { useSyncExternalStore } from "react";

const navigationEvent = "tempo:navigate";

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener(navigationEvent, listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener(navigationEvent, listener);
  };
}

export function navigate(url: string) {
  if (`${window.location.pathname}${window.location.search}` === url) return;
  window.history.pushState(null, "", url);
  window.dispatchEvent(new window.Event(navigationEvent));
}

export function useLocation() {
  return useSyncExternalStore(
    subscribe,
    () => `${window.location.pathname}${window.location.search}`,
  );
}
