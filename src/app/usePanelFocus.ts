import { useEffect, useLayoutEffect, useRef } from "react";

export function usePanelFocus(
  helpOpen: boolean,
  promotion: object | null,
  onClose: () => void,
) {
  const close = useRef(onClose);
  useLayoutEffect(() => {
    close.current = onClose;
  });
  useEffect(() => {
    if (!helpOpen && !promotion) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = document.querySelector<HTMLElement>(
      promotion ? ".promotion-card" : ".help-card",
    );
    panel
      ?.querySelector<HTMLElement>(
        promotion ? ".promotion-choices button" : "button",
      )
      ?.focus({ preventScroll: true });
    if (window.matchMedia("(max-width: 900px)").matches)
      panel?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close.current();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previous?.focus({ preventScroll: true });
    };
  }, [helpOpen, promotion]);
}
