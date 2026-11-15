import { useEffect, useLayoutEffect, useRef } from "react";
import { scrollToBoard } from "../board/scrollToBoard.ts";

export function usePanelFocus(promotion: object | null, onClose: () => void) {
  const dismiss = useRef(onClose);
  useLayoutEffect(() => {
    dismiss.current = onClose;
  });
  useEffect(() => {
    if (promotion === null) return;
    const origin = document.activeElement;
    const panel = document.querySelector<HTMLElement>(".promotion-card");
    panel
      ?.querySelector<HTMLButtonElement>(".promotion-choices button")
      ?.focus({ preventScroll: true });
    if (window.matchMedia("(max-width: 900px)").matches) scrollToBoard(panel);
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss.current();
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      if (origin instanceof window.HTMLElement && origin.isConnected)
        origin.focus({ preventScroll: true });
    };
  }, [promotion]);
}
