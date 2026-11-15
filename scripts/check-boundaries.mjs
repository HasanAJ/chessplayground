import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../src/", import.meta.url));
const forbidden = {
  domain: ["ui", "application", "infrastructure"],
  application: ["ui", "infrastructure"],
};
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? files(resolve(directory, entry.name))
          : resolve(directory, entry.name),
      ),
    )
  ).flat();
}
const failures = [];
for (const [layer, dependencies] of Object.entries(forbidden)) {
  for (const file of await files(resolve(root, layer))) {
    if (!/\.tsx?$/.test(file)) continue;
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(
      /(?:from\s*|import\s*\()(["'])([^"']+)\1/g,
    )) {
      const imported = match[2];
      const target = imported.startsWith(".")
        ? relative(root, resolve(dirname(file), imported)).split("/")[0]
        : imported;
      if (
        dependencies.includes(target) ||
        target === "react" ||
        target === "react-dom" ||
        target.startsWith("react-dom/") ||
        target.startsWith("react/")
      )
        failures.push(`${relative(root, file)} imports ${imported}`);
    }
  }
}
if (failures.length)
  throw new Error(`Dependency direction violations:\n${failures.join("\n")}`);
console.log("Domain and application dependency boundaries passed.");
