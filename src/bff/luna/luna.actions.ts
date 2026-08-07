import "server-only";

import { lunaClient } from "@/bff/luna/luna.client";
import type {
  LunaAgentCreate,
  LunaAgentUpdate,
  LunaTaskCreate,
  LunaTaskUpdate,
  LunaToolCreate,
  LunaToolUpdate,
} from "@/bff/luna/luna.dto";

export const createLunaAgent = (payload: LunaAgentCreate) => lunaClient.createAgent(payload);
export const updateLunaAgent = (id: string, payload: LunaAgentUpdate) => lunaClient.updateAgent(id, payload);
export const deleteLunaAgent = (id: string) => lunaClient.deleteAgent(id);

export const createLunaTask = (payload: LunaTaskCreate) => lunaClient.createTask(payload);
export const updateLunaTask = (id: string, payload: LunaTaskUpdate) => lunaClient.updateTask(id, payload);
export function transitionLunaTask(id: string, action: string, payload: Record<string, unknown> = {}) {
  if (action === "assign") return lunaClient.assignTask(id, payload as { agent_id: string });
  if (action === "start") return lunaClient.startTask(id);
  if (action === "complete") return lunaClient.completeTask(id, payload);
  if (action === "fail") return lunaClient.failTask(id, payload as { error_message: string });
  if (action === "cancel") return lunaClient.cancelTask(id);
  if (action === "execute") return lunaClient.executeTask(id, payload as { instruction?: string | null });
  return Promise.resolve({ ok: false as const, status: "error" as const, message: "Unsupported task transition" });
}

export const createLunaTool = (payload: LunaToolCreate) => lunaClient.createTool(payload);
export const updateLunaTool = (id: string, payload: LunaToolUpdate) => lunaClient.updateTool(id, payload);
export const deleteLunaTool = (id: string) => lunaClient.deleteTool(id);
