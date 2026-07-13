import { describe, expect, it } from "vitest";
import { freshnessLabel, type SourceFreshness } from "@/shared/kernel/freshness";

describe("freshnessLabel()", () => {
  it("returns 'unknown' label when status is UNKNOWN", () => {
    const item: SourceFreshness = { source: "A7", status: "UNKNOWN", observedAt: null, thresholdMinutes: 60 };
    expect(freshnessLabel(item)).toBe("A7: unknown");
  });

  it("returns status-only label when observedAt is null", () => {
    const item: SourceFreshness = { source: "booking", status: "STALE", observedAt: null, thresholdMinutes: 60 };
    expect(freshnessLabel(item)).toBe("booking: stale");
  });

  it("returns status + timestamp when observedAt is set", () => {
    const ts = "2026-07-13T09:00:00.000Z";
    const item: SourceFreshness = { source: "inventory", status: "FRESH", observedAt: ts, thresholdMinutes: 30 };
    expect(freshnessLabel(item)).toBe(`inventory: fresh at ${ts}`);
  });

  it("labels FRESH, STALE, UNKNOWN distinctly (PLAN §8.10 — never collapse)", () => {
    const make = (status: SourceFreshness["status"]): string =>
      freshnessLabel({ source: "s", status, observedAt: null, thresholdMinutes: 60 });
    expect(make("FRESH")).not.toBe(make("STALE"));
    expect(make("STALE")).not.toBe(make("UNKNOWN"));
    expect(make("UNKNOWN")).not.toBe(make("FRESH"));
  });
});
