import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Every var(--x) written in an inline style must actually exist.
 *
 * Tailwind classes fail loudly enough — an unknown class simply produces no
 * CSS and the element looks obviously unstyled. An inline `fill="var(--ink)"`
 * fails silently: SVG falls back to black, which looks correct on a light
 * background and is invisible on a dark one. That is exactly how --ink, which
 * has never existed (the token is --text), shipped through four days of
 * screenshots.
 */

/** Set at runtime rather than in the stylesheet. */
const RUNTIME_DEFINED = new Set([
  "--font-literata",
  "--font-mono",
  "--delay",
  "--duration",
  "--dx",
  "--rot",
  "--tx",
  "--ty",
  "--drag-x",
  "--drag-rot",
]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

describe("CSS custom properties", () => {
  it("are all defined before they are used", () => {
    const css = readFileSync("app/globals.css", "utf8");
    const defined = new Set(css.match(/--[a-z0-9-]+(?=\s*:)/g) ?? []);

    const missing = new Map<string, string[]>();
    for (const file of [...walk("app"), ...walk("components"), ...walk("lib")]) {
      const source = readFileSync(file, "utf8");
      // exec in a loop rather than matchAll: the project compiles to ES5 and
      // iterating a RegExp iterator needs downlevelIteration.
      const pattern = /var\((--[a-z0-9-]+)\)/g;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source)) !== null) {
        const name = match[1];
        if (defined.has(name) || RUNTIME_DEFINED.has(name)) continue;
        missing.set(name, [...(missing.get(name) ?? []), file]);
      }
    }

    expect(Object.fromEntries(missing)).toEqual({});
  });
});
