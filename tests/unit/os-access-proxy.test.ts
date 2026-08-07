import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const proxy = readFileSync(join(process.cwd(), "src/proxy.ts"), "utf8");

describe("VENHO OS access proxy", () => {
  it("fails closed when credentials are absent and challenges unauthenticated requests", () => {
    expect(proxy).toContain('if (!username || !password) return false;');
    expect(proxy).toContain('status: 401');
    expect(proxy).toContain('WWW-Authenticate');
  });

  it("protects the OS page and both local-agent API namespaces", () => {
    expect(proxy).toContain('"/os/:path*"');
    expect(proxy).toContain('"/api/v1/luna/:path*"');
    expect(proxy).toContain('"/api/v1/hermes-nous/:path*"');
  });
});
