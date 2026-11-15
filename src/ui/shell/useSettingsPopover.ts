import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export function useSettingsPopover(
  open: boolean,
  onOpenChange: (open: boolean) => void,
) {
  const root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null);
  const change = useRef(onOpenChange);
  useLayoutEffect(() => {
    change.current = onOpenChange;
  });
  const close = useCallback(() => {
    change.current(false);
    trigger.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: Event) => {
      if (event instanceof window.KeyboardEvent) {
        if (event.key === "Escape") close();
      } else if (
        event.target instanceof Node &&
        !root.current?.contains(event.target)
      )
        change.current(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", dismiss);
    };
  }, [open, close]);
  return { root, trigger, close };
}
