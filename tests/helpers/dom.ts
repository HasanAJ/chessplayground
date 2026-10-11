import type { TestContext } from "node:test";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";

export function createTestRoot(t: TestContext) {
  const dom = new JSDOM('<div id="root"></div>', { url: "https://tempo.test" });
  const globals = {
    window: dom.window,
    document: dom.window.document,
    Node: dom.window.Node,
    localStorage: dom.window.localStorage,
    IS_REACT_ACT_ENVIRONMENT: true,
  };
  const previous = Object.keys(globals).map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  for (const [key, value] of Object.entries(globals))
    Object.defineProperty(globalThis, key, { value, configurable: true });
  Object.defineProperty(dom.window, "matchMedia", {
    value: () => ({ matches: false }),
    configurable: true,
  });
  const root = createRoot(dom.window.document.getElementById("root")!);
  t.after(async () => {
    await act(() => root.unmount());
    dom.window.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  });
  return { dom, root };
}
