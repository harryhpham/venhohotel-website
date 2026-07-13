import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getOtaAgentSnapshot } from "@/bff/ota/ota-agent.query";

const ORIGINAL_ENV = { ...process.env };

describe("getOtaAgentSnapshot()", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.unstubAllGlobals();
  });

  it("returns not_configured when env vars are missing, without throwing", async () => {
    delete process.env.OTA_AGENT_BASE_URL;
    delete process.env.OTA_AGENT_API_TOKEN;

    const snapshot = await getOtaAgentSnapshot();

    expect(snapshot.state).toBe("not_configured");
    expect(snapshot.control).toBeNull();
  });

  it("returns ok with the agent's control record on a successful call", async () => {
    process.env.OTA_AGENT_BASE_URL = "http://127.0.0.1:4801";
    process.env.OTA_AGENT_API_TOKEN = "test-token";
    const control = {
      schemaVersion: "1.0",
      mode: "PAUSED",
      changedBy: "system",
      changedAt: "2026-07-13T00:00:00.000Z",
      reason: "Initial safe state",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => control }),
    );

    const snapshot = await getOtaAgentSnapshot();

    expect(snapshot.state).toBe("ok");
    expect(snapshot.control).toEqual(control);
  });

  it("returns unreachable, not a thrown error, when the agent connection fails", async () => {
    process.env.OTA_AGENT_BASE_URL = "http://127.0.0.1:4801";
    process.env.OTA_AGENT_API_TOKEN = "test-token";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("connect ECONNREFUSED")),
    );

    const snapshot = await getOtaAgentSnapshot();

    expect(snapshot.state).toBe("unreachable");
    expect(snapshot.control).toBeNull();
    expect(snapshot.advisory).toContain("ECONNREFUSED");
  });

  it("returns unreachable when the agent responds with a non-2xx status", async () => {
    process.env.OTA_AGENT_BASE_URL = "http://127.0.0.1:4801";
    process.env.OTA_AGENT_API_TOKEN = "wrong-token";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ code: "UNAUTHORIZED", message: "Valid bearer token required", details: {} }),
      }),
    );

    const snapshot = await getOtaAgentSnapshot();

    expect(snapshot.state).toBe("unreachable");
    expect(snapshot.advisory).toBe("Valid bearer token required");
  });
});
