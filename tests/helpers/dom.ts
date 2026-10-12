import type { TestContext } from "node:test";
import { act } from "react";
import { JSDOM } from "jsdom";

function installGlobals(values: Record<string, unknown>) {
  const previous = Object.keys(values).map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  for (const [key, value] of Object.entries(values))
    Object.defineProperty(globalThis, key, { value, configurable: true });
  return () => {
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  };
}

// React DOM detects native input-event support when it is first imported.
const bootstrap = new JSDOM("");
const restoreGlobals = installGlobals({
  window: bootstrap.window,
  document: bootstrap.window.document,
});
const { createRoot } = await import("react-dom/client");
restoreGlobals();
bootstrap.window.close();

export function createTestRoot(t: TestContext) {
  const dom = new JSDOM('<div id="root"></div>', { url: "https://tempo.test" });
  const restore = installGlobals({
    window: dom.window,
    document: dom.window.document,
    Node: dom.window.Node,
    localStorage: dom.window.localStorage,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  Object.defineProperty(dom.window, "matchMedia", {
    value: () => ({
      matches: false,
      addEventListener() {},
      removeEventListener() {},
    }),
    configurable: true,
  });
  const root = createRoot(dom.window.document.getElementById("root")!);
  t.after(async () => {
    await act(() => root.unmount());
    dom.window.close();
    restore();
  });
  return { dom, root };
}
