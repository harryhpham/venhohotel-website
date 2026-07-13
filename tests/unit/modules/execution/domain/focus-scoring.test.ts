import { describe, expect, it } from "vitest";
import {
  chooseTodaysFocus,
  scoreFocusCandidate,
  type FocusCandidate,
} from "@/modules/execution/domain/focus-scoring";

// ── helpers ───────────────────────────────────────────────────────────────────

function makeCandidate(overrides: Partial<FocusCandidate> = {}): FocusCandidate {
  return {
    id: "c1",
    title: "Test task",
    route: "/os?section=tasks",
    priority: 0.8,
    dueUrgency: 0.8,
    continuity: 0.8,
    milestoneGate: 0.8,
    businessImpact: 0.8,
    effortFit: 0.8,
    evidenceFresh: true,
    hasHumanOwner: true,
    suppressed: false,
    ...overrides,
  };
}

// ── scoreFocusCandidate ───────────────────────────────────────────────────────

describe("scoreFocusCandidate()", () => {
  it("returns focusScore in [0, 1] for all-zero inputs", () => {
    const r = scoreFocusCandidate(
      makeCandidate({ priority: 0, dueUrgency: 0, continuity: 0, milestoneGate: 0, businessImpact: 0, effortFit: 0 })
    );
    expect(r.focusScore).toBe(0);
  });

  it("returns focusScore = 1 for all-max inputs", () => {
    const r = scoreFocusCandidate(
      makeCandidate({ priority: 1, dueUrgency: 1, continuity: 1, milestoneGate: 1, businessImpact: 1, effortFit: 1 })
    );
    expect(r.focusScore).toBe(1);
  });

  it("clamps out-of-range values — no negative or >1 score", () => {
    const r = scoreFocusCandidate(makeCandidate({ priority: 5, dueUrgency: -2 }));
    expect(r.focusScore).toBeGreaterThanOrEqual(0);
    expect(r.focusScore).toBeLessThanOrEqual(1);
  });

  it("higher businessImpact produces higher score (all other values equal)", () => {
    const low = scoreFocusCandidate(makeCandidate({ businessImpact: 0.1 }));
    const high = scoreFocusCandidate(makeCandidate({ businessImpact: 0.9 }));
    expect(high.focusScore).toBeGreaterThan(low.focusScore);
  });

  it("weights sum to 1 — formula completeness check (PLAN §8.1)", () => {
    // If all inputs = 0.5 and weights sum to 1, score should equal 0.5
    const r = scoreFocusCandidate(
      makeCandidate({ priority: 0.5, dueUrgency: 0.5, continuity: 0.5, milestoneGate: 0.5, businessImpact: 0.5, effortFit: 0.5 })
    );
    expect(r.focusScore).toBeCloseTo(0.5, 4);
  });

  it("returns NaN-safe score when NaN inputs provided", () => {
    const r = scoreFocusCandidate(makeCandidate({ priority: NaN }));
    expect(Number.isFinite(r.focusScore)).toBe(true);
  });

  it("spreads original candidate fields into result", () => {
    const c = makeCandidate({ id: "my-task", title: "Review OTA" });
    const r = scoreFocusCandidate(c);
    expect(r.id).toBe("my-task");
    expect(r.title).toBe("Review OTA");
  });
});

// ── chooseTodaysFocus ─────────────────────────────────────────────────────────

describe("chooseTodaysFocus()", () => {
  it("returns null for empty candidate list", () => {
    expect(chooseTodaysFocus([])).toBeNull();
  });

  it("returns null when all candidates are suppressed", () => {
    const cs = [makeCandidate({ suppressed: true }), makeCandidate({ suppressed: true })];
    expect(chooseTodaysFocus(cs)).toBeNull();
  });

  it("returns null when all candidates lack evidence freshness (PLAN §8.1 critical alert rule)", () => {
    const cs = [makeCandidate({ evidenceFresh: false }), makeCandidate({ evidenceFresh: false })];
    expect(chooseTodaysFocus(cs)).toBeNull();
  });

  it("returns null when no candidate has a human owner", () => {
    const cs = [makeCandidate({ hasHumanOwner: false }), makeCandidate({ hasHumanOwner: false })];
    expect(chooseTodaysFocus(cs)).toBeNull();
  });

  it("returns the single valid candidate", () => {
    const c = makeCandidate({ id: "solo", priority: 0.9 });
    const result = chooseTodaysFocus([c]);
    expect(result?.id).toBe("solo");
    expect(result?.focusScore).toBeDefined();
  });

  it("returns highest-scoring valid candidate", () => {
    const low = makeCandidate({ id: "low", priority: 0.1, dueUrgency: 0.1, continuity: 0.1, milestoneGate: 0.1, businessImpact: 0.1, effortFit: 0.1 });
    const high = makeCandidate({ id: "high", priority: 0.9, dueUrgency: 0.9, continuity: 0.9, milestoneGate: 0.9, businessImpact: 0.9, effortFit: 0.9 });
    const result = chooseTodaysFocus([low, high]);
    expect(result?.id).toBe("high");
  });

  it("skips suppressed candidates even when they have the highest score", () => {
    const suppressed = makeCandidate({ id: "best-but-suppressed", priority: 1, suppressed: true });
    const valid = makeCandidate({ id: "valid", priority: 0.5 });
    const result = chooseTodaysFocus([suppressed, valid]);
    expect(result?.id).toBe("valid");
  });

  it("skips stale-evidence candidates — PLAN §8.1 evidence guard", () => {
    const stale = makeCandidate({ id: "stale", priority: 1, evidenceFresh: false });
    const fresh = makeCandidate({ id: "fresh", priority: 0.6 });
    const result = chooseTodaysFocus([stale, fresh]);
    expect(result?.id).toBe("fresh");
  });

  it("skips no-human-owner candidates — PLAN §8.1 human-owner guard", () => {
    const noOwner = makeCandidate({ id: "no-owner", priority: 1, hasHumanOwner: false });
    const owned = makeCandidate({ id: "owned", priority: 0.4 });
    const result = chooseTodaysFocus([noOwner, owned]);
    expect(result?.id).toBe("owned");
  });

  it("is deterministic — same input, same output", () => {
    const cs = [makeCandidate({ id: "a" }), makeCandidate({ id: "b", priority: 0.6 })];
    const r1 = chooseTodaysFocus(cs);
    const r2 = chooseTodaysFocus(cs);
    expect(r1?.id).toBe(r2?.id);
  });
});
