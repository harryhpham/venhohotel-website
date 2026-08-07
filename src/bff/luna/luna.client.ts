import "server-only";

import type {
  LunaAgent,
  LunaAgentCreate,
  LunaAgentUpdate,
  LunaAuditLog,
  LunaExecutionPolicy,
  LunaExecutionPolicyCreate,
  LunaExecutionPolicyUpdate,
  LunaExecutionUsage,
  LunaExecutionUsageSummary,
  LunaMetrics,
  LunaOrchestration,
  LunaOrchestrationRole,
  LunaOrchestrationRoleRun,
  LunaOrchestrationRun,
  LunaProviderInfo,
  LunaResult,
  LunaTask,
  LunaTaskCreate,
  LunaTaskExecutionResponse,
  LunaTaskUpdate,
  LunaTool,
  LunaToolCreate,
  LunaToolExecution,
  LunaToolRequest,
  LunaToolUpdate,
  LunaWorkflow,
  LunaWorkflowRun,
  LunaWorkflowStep,
  LunaWorkflowStepRun,
} from "@/bff/luna/luna.dto";

const DEFAULT_TIMEOUT_MS = 10_000;

function baseUrl(): string | null {
  return process.env.LUNA_API_BASE_URL || "http://127.0.0.1:8001";
}

function timeoutMs(): number {
  const value = Number(process.env.LUNA_REQUEST_TIMEOUT_MS);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_TIMEOUT_MS;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<LunaResult<T>> {
  const base = baseUrl();
  if (!base) return { ok: false, status: "not_configured", message: "Luna API is not configured" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  if (init.body) headers.set("content-type", "application/json");
  const token = process.env.LUNA_API_TOKEN;
  if (token) headers.set("authorization", `Bearer ${token}`);

  try {
    const response = await fetch(`${base}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
      cache: "no-store",
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      return { ok: false, status: "error", message: data?.error_message || data?.detail || `Luna HTTP ${response.status}` };
    }
    return { ok: true, data: data as T };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, status: "timeout", message: "Luna request timed out" };
    }
    return { ok: false, status: "unreachable", message: "Luna API is unreachable" };
  } finally {
    clearTimeout(timer);
  }
}

export const lunaClient = {
  getProviders: () => request<LunaProviderInfo[]>("/providers"),
  getMetrics: () => request<LunaMetrics>("/metrics"),
  getAgents: () => request<LunaAgent[]>("/agents"),
  getAgent: (id: string) => request<LunaAgent>(`/agents/${id}`),
  createAgent: (payload: LunaAgentCreate) => request<LunaAgent>("/agents", { method: "POST", body: JSON.stringify(payload) }),
  updateAgent: (id: string, payload: LunaAgentUpdate) => request<LunaAgent>(`/agents/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteAgent: (id: string) => request<null>(`/agents/${id}`, { method: "DELETE" }),
  getTasks: () => request<LunaTask[]>("/tasks"),
  getTask: (id: string) => request<LunaTask>(`/tasks/${id}`),
  createTask: (payload: LunaTaskCreate) => request<LunaTask>("/tasks", { method: "POST", body: JSON.stringify(payload) }),
  updateTask: (id: string, payload: LunaTaskUpdate) => request<LunaTask>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  assignTask: (id: string, payload: { agent_id: string }) => request<LunaTask>(`/tasks/${id}/assign`, { method: "POST", body: JSON.stringify(payload) }),
  startTask: (id: string) => request<LunaTask>(`/tasks/${id}/start`, { method: "POST" }),
  completeTask: (id: string, payload: { result_payload?: Record<string, unknown> | null }) => request<LunaTask>(`/tasks/${id}/complete`, { method: "POST", body: JSON.stringify(payload) }),
  failTask: (id: string, payload: { error_message: string }) => request<LunaTask>(`/tasks/${id}/fail`, { method: "POST", body: JSON.stringify(payload) }),
  cancelTask: (id: string) => request<LunaTask>(`/tasks/${id}/cancel`, { method: "POST" }),
  executeTask: (id: string, payload: { instruction?: string | null }) => request<LunaTaskExecutionResponse>(`/tasks/${id}/execute`, { method: "POST", body: JSON.stringify(payload) }),
  getTools: () => request<LunaTool[]>("/tools"),
  getTool: (id: string) => request<LunaTool>(`/tools/${id}`),
  createTool: (payload: LunaToolCreate) => request<LunaTool>("/tools", { method: "POST", body: JSON.stringify(payload) }),
  updateTool: (id: string, payload: LunaToolUpdate) => request<LunaTool>(`/tools/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteTool: (id: string) => request<null>(`/tools/${id}`, { method: "DELETE" }),
  getAuditLogs: () => request<LunaAuditLog[]>("/audit-logs"),
  getToolRequests: () => request<LunaToolRequest[]>("/tool-requests"),
  approveToolRequest: (id: string) => request<LunaToolExecution>(`/tool-requests/${id}/approve`, { method: "POST" }),
  rejectToolRequest: (id: string, payload: { reason?: string | null }) => request<LunaToolRequest>(`/tool-requests/${id}/reject`, { method: "POST", body: JSON.stringify(payload) }),
  getToolExecutions: () => request<LunaToolExecution[]>("/tool-executions"),
  getWorkflows: () => request<LunaWorkflow[]>("/workflows"),
  createWorkflow: (payload: { name: string; description?: string | null }) => request<LunaWorkflow>("/workflows", { method: "POST", body: JSON.stringify(payload) }),
  activateWorkflow: (id: string) => request<LunaWorkflow>(`/workflows/${id}/activate`, { method: "POST" }),
  disableWorkflow: (id: string) => request<LunaWorkflow>(`/workflows/${id}/disable`, { method: "POST" }),
  cloneWorkflow: (id: string) => request<LunaWorkflow>(`/workflows/${id}/clone`, { method: "POST" }),
  deleteWorkflow: (id: string) => request<null>(`/workflows/${id}`, { method: "DELETE" }),
  getWorkflowSteps: (id: string) => request<LunaWorkflowStep[]>(`/workflows/${id}/steps`),
  createWorkflowStep: (id: string, payload: Record<string, unknown>) => request<LunaWorkflowStep>(`/workflows/${id}/steps`, { method: "POST", body: JSON.stringify(payload) }),
  reorderWorkflowSteps: (id: string, payload: Array<{ id: string; position: number }>) => request<LunaWorkflowStep[]>(`/workflows/${id}/steps/reorder`, { method: "POST", body: JSON.stringify(payload) }),
  getWorkflowRuns: () => request<LunaWorkflowRun[]>("/workflow-runs"),
  startWorkflowRun: (id: string, payload: { input_payload?: Record<string, unknown> | null }) => request<LunaWorkflowRun>(`/workflows/${id}/runs`, { method: "POST", body: JSON.stringify(payload) }),
  continueWorkflowRun: (id: string) => request<LunaWorkflowRun>(`/workflow-runs/${id}/continue`, { method: "POST" }),
  pauseWorkflowRun: (id: string) => request<LunaWorkflowRun>(`/workflow-runs/${id}/pause`, { method: "POST" }),
  cancelWorkflowRun: (id: string) => request<LunaWorkflowRun>(`/workflow-runs/${id}/cancel`, { method: "POST" }),
  getWorkflowStepRuns: (id: string) => request<LunaWorkflowStepRun[]>(`/workflow-runs/${id}/steps`),
  getOrchestrations: () => request<LunaOrchestration[]>("/orchestrations"),
  createOrchestration: (payload: { name: string; description?: string | null; execution_policy?: Record<string, unknown> | null }) => request<LunaOrchestration>("/orchestrations", { method: "POST", body: JSON.stringify(payload) }),
  activateOrchestration: (id: string) => request<LunaOrchestration>(`/orchestrations/${id}/activate`, { method: "POST" }),
  disableOrchestration: (id: string) => request<LunaOrchestration>(`/orchestrations/${id}/disable`, { method: "POST" }),
  cloneOrchestration: (id: string) => request<LunaOrchestration>(`/orchestrations/${id}/clone`, { method: "POST" }),
  deleteOrchestration: (id: string) => request<null>(`/orchestrations/${id}`, { method: "DELETE" }),
  getOrchestrationRoles: (id: string) => request<LunaOrchestrationRole[]>(`/orchestrations/${id}/roles`),
  createOrchestrationRole: (id: string, payload: Record<string, unknown>) => request<LunaOrchestrationRole>(`/orchestrations/${id}/roles`, { method: "POST", body: JSON.stringify(payload) }),
  reorderOrchestrationRoles: (id: string, payload: Array<{ id: string; position: number }>) => request<LunaOrchestrationRole[]>(`/orchestrations/${id}/roles/reorder`, { method: "POST", body: JSON.stringify(payload) }),
  getOrchestrationRuns: () => request<LunaOrchestrationRun[]>("/orchestration-runs"),
  startOrchestrationRun: (id: string, payload: { input_payload?: Record<string, unknown> | null }) => request<LunaOrchestrationRun>(`/orchestrations/${id}/runs`, { method: "POST", body: JSON.stringify(payload) }),
  continueOrchestrationRun: (id: string) => request<LunaOrchestrationRun>(`/orchestration-runs/${id}/continue`, { method: "POST" }),
  pauseOrchestrationRun: (id: string) => request<LunaOrchestrationRun>(`/orchestration-runs/${id}/pause`, { method: "POST" }),
  cancelOrchestrationRun: (id: string) => request<LunaOrchestrationRun>(`/orchestration-runs/${id}/cancel`, { method: "POST" }),
  getOrchestrationRoleRuns: (id: string) => request<LunaOrchestrationRoleRun[]>(`/orchestration-runs/${id}/roles`),
  getExecutionPolicies: () => request<LunaExecutionPolicy[]>("/execution-policies"),
  getExecutionPolicy: (id: string) => request<LunaExecutionPolicy>(`/execution-policies/${id}`),
  createExecutionPolicy: (payload: LunaExecutionPolicyCreate) => request<LunaExecutionPolicy>("/execution-policies", { method: "POST", body: JSON.stringify(payload) }),
  updateExecutionPolicy: (id: string, payload: LunaExecutionPolicyUpdate) => request<LunaExecutionPolicy>(`/execution-policies/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteExecutionPolicy: (id: string) => request<null>(`/execution-policies/${id}`, { method: "DELETE" }),
  getExecutionUsage: () => request<LunaExecutionUsage[]>("/execution-usage"),
  getExecutionUsageSummary: () => request<LunaExecutionUsageSummary>("/execution-usage/summary"),
};
