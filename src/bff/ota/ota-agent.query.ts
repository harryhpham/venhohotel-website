import "server-only";

import { OtaAgentError, otaAgentGet } from "@/bff/ota/ota-agent.client";
import type { OtaAgentControlDto, OtaAgentSnapshotDto } from "@/bff/ota/ota-agent.dto";

/**
 * @layer bff
 * @context ota
 * @owns OTA-01 agent status snapshot for Mother Dashboard (Agents / Operations sections)
 * @depends-on ota-agent.client, ota-agent.dto
 * @invariant Never throws. A down, unconfigured, or unreachable agent must degrade to a
 * snapshot state, not break the Mother Dashboard render — same rule the home snapshot BFF
 * already follows for every other section.
 */

export async function getOtaAgentSnapshot(): Promise<OtaAgentSnapshotDto> {
  const observedAt = new Date().toISOString();
  try {
    const control = await otaAgentGet<OtaAgentControlDto>("/api/v1/agent/status");
    return { state: "ok", control, observedAt };
  } catch (error) {
    if (error instanceof OtaAgentError) {
      return {
        state: error.kind === "not_configured" ? "not_configured" : "unreachable",
        control: null,
        observedAt,
        advisory: error.message,
      };
    }
    return {
      state: "unreachable",
      control: null,
      observedAt,
      advisory: error instanceof Error ? error.message : "Unknown OTA-01 agent error",
    };
  }
}
