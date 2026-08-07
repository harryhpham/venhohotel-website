import "server-only";

import { lunaClient } from "@/bff/luna/luna.client";
import type { LunaOverviewSnapshot } from "@/bff/luna/luna.dto";

export async function getLunaOverviewSnapshot(): Promise<LunaOverviewSnapshot> {
  const [metrics, providers] = await Promise.all([lunaClient.getMetrics(), lunaClient.getProviders()]);
  if (!metrics.ok) {
    return {
      status: metrics.status,
      metrics: null,
      providers: providers.ok ? providers.data : [],
      health: { api: metrics.status, database: "unknown", redis: "unknown", scheduler: "unknown" },
      message: metrics.message,
    };
  }
  return {
    status: "ok",
    metrics: metrics.data,
    providers: providers.ok ? providers.data : [],
    health: {
      api: "ok",
      database: metrics.data.database,
      redis: metrics.data.redis,
      scheduler: metrics.data.scheduler,
    },
  };
}

export const getLunaAgentsSnapshot = () => lunaClient.getAgents();
export const getLunaTasksSnapshot = () => lunaClient.getTasks();
export const getLunaToolsSnapshot = () => lunaClient.getTools();
export const getLunaAuditSnapshot = () => lunaClient.getAuditLogs();
