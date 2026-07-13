/**
 * @layer bff
 * @context ota
 * @owns OTA-01 agent integration DTOs for Mother Dashboard
 * @depends-on nothing
 * @invariant Presentation DTO only. The agent enforces every business rule (guardrails, TTL,
 * state transitions); this module never recomputes or overrides them.
 */

export type OtaAgentMode = "RUNNING" | "READ_ONLY" | "PAUSED" | "EMERGENCY_STOP";

export type OtaAgentControlDto = {
  schemaVersion: string;
  mode: OtaAgentMode;
  changedBy: string;
  changedAt: string;
  reason: string;
};

export type OtaAgentSnapshotState = "ok" | "unreachable" | "not_configured";

export type OtaAgentSnapshotDto = {
  state: OtaAgentSnapshotState;
  control: OtaAgentControlDto | null;
  observedAt: string;
  advisory?: string;
};
