// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = new URL("../", import.meta.url);
const read = (file: string) => readFileSync(new URL(file, root), "utf8");

describe("standalone deployment", () => {
  it("uses the standard Next.js build with a pinned Node major", () => {
    const config = JSON.parse(read("vercel.json"));
    const pkg = JSON.parse(read("package.json"));
    expect(config).toMatchObject({ framework: "nextjs", installCommand: "npm ci", buildCommand: "npm run build" });
    expect(pkg.engines.node).toBe("24.x");
    expect(pkg.scripts.build).toBe("next build --webpack");
    expect(pkg.devDependencies).not.toHaveProperty("wrangler");
    expect(pkg.devDependencies).not.toHaveProperty("@opennextjs/cloudflare");
    expect(config).not.toHaveProperty("outputDirectory");
  });

  it("excludes previous hosting identities and runtime state", () => {
    for (const file of [".openai", ".wrangler", "wrangler.jsonc", "open-next.config.ts", "scripts/stage-worker.mjs", "lib/api/edgeCache.ts"]) {
      expect(existsSync(fileURLToPath(new URL(file, root)))).toBe(false);
    }
    expect(read(".gitignore")).toContain(".env*");
    expect(read(".gitignore")).toContain("!.env.example");
    expect(read(".gitignore")).toContain(".vercel/");
  });

  it("ships no populated credential fields in the environment example", () => {
    const credentials = read(".env.example").split(/\r?\n/).filter(line => /(?:PASSWORD|TOKEN|API_KEY|USERNAME)=/.test(line));
    expect(credentials.length).toBeGreaterThan(0);
    for (const line of credentials) expect(line.split("=").slice(1).join("=")).toBe("");
  });
});
