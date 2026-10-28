import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import renderLabMarkdown from "../lab/markdown.js";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const context = { window: {} };
runInNewContext(read("lab/data.js"), context, { filename: "lab/data.js", timeout: 1000 });

const lab = renderLabMarkdown(context.window.LAB);
const files = new Map([
  ["lab/index.md", lab + "\n"],
  // The lab is retained locally but is hidden from the public site for now.
  ["llms-full.txt", read("index.md").trim() + "\n"],
]);
const check = process.argv.includes("--check");

for (const [path, content] of files) {
  if (check) {
    let current;
    try { current = read(path); }
    catch (error) { if (error.code !== "ENOENT") throw error; }
    if (current !== content) {
      console.error(`${path}: stale or missing; run node scripts/generate-agent-pages.mjs`);
      process.exitCode = 1;
    } else console.log(`${path}: up to date`);
  } else {
    writeFileSync(new URL(path, root), content);
    console.log(`Generated ${fileURLToPath(new URL(path, root))}`);
  }
}
