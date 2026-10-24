export function scrollToBoard(
  board: HTMLElement | null = document.querySelector("#board .board-with-eval"),
) {
  if (!board) return;
  const bounds = board.getBoundingClientRect();
  const controlsHeight = window.matchMedia("(max-width: 900px)").matches
    ? (document
        .querySelector(".calculation-controls")
        ?.getBoundingClientRect().height ?? 0)
    : 0;
  if (bounds.top >= 0 && bounds.bottom <= window.innerHeight - controlsHeight)
    return;
  board.scrollIntoView({
    block: "start",
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}
