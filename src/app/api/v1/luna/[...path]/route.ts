import { NextRequest, NextResponse } from "next/server";

import { lunaClient } from "@/bff/luna/luna.client";
import { requireLunaOrchestrationPermission, requireLunaPermission, requireLunaToolApprovalPermission, requireLunaWorkflowExecutePermission } from "@/bff/luna/luna.rbac";

type Context = { params: Promise<{ path: string[] }> };

async function dispatch(request: NextRequest, context: Context) {
  const { path } = await context.params;
  const [resource, id, action] = path;
  const joined = path.join("/");
  if (resource === "orchestrations" || resource === "orchestration-runs" || resource === "orchestration-role-runs" || resource === "orchestration-handoffs") {
    const orchestrationDenied = requireLunaOrchestrationPermission(request.method, action);
    if (orchestrationDenied) return orchestrationDenied;
  } else if (resource === "tool-requests" && request.method === "POST" && (action === "approve" || action === "reject")) {
    const approvalDenied = requireLunaToolApprovalPermission();
    if (approvalDenied) return approvalDenied;
  } else if ((resource === "workflow-runs" && request.method === "POST") || (resource === "workflows" && request.method === "POST" && action === "runs")) {
    const workflowDenied = requireLunaWorkflowExecutePermission();
    if (workflowDenied) return workflowDenied;
  } else {
    const denied = requireLunaPermission(request.method);
    if (denied) return denied;
  }
  const body = request.method === "GET" || request.method === "DELETE" ? undefined : await request.json().catch(() => undefined);

  const result =
    resource === "agents" && request.method === "GET" && !id ? await lunaClient.getAgents() :
    resource === "agents" && request.method === "GET" && id ? await lunaClient.getAgent(id) :
    resource === "agents" && request.method === "POST" ? await lunaClient.createAgent(body) :
    resource === "agents" && request.method === "PATCH" && id ? await lunaClient.updateAgent(id, body) :
    resource === "agents" && request.method === "DELETE" && id ? await lunaClient.deleteAgent(id) :
    resource === "tasks" && request.method === "GET" && !id ? await lunaClient.getTasks() :
    resource === "tasks" && request.method === "GET" && id ? await lunaClient.getTask(id) :
    resource === "tasks" && request.method === "POST" && !id ? await lunaClient.createTask(body) :
    resource === "tasks" && request.method === "PATCH" && id ? await lunaClient.updateTask(id, body) :
    resource === "tasks" && request.method === "POST" && id && action === "assign" ? await lunaClient.assignTask(id, body) :
    resource === "tasks" && request.method === "POST" && id && action === "start" ? await lunaClient.startTask(id) :
    resource === "tasks" && request.method === "POST" && id && action === "complete" ? await lunaClient.completeTask(id, body || {}) :
    resource === "tasks" && request.method === "POST" && id && action === "fail" ? await lunaClient.failTask(id, body) :
    resource === "tasks" && request.method === "POST" && id && action === "cancel" ? await lunaClient.cancelTask(id) :
    resource === "tasks" && request.method === "POST" && id && action === "execute" ? await lunaClient.executeTask(id, body || {}) :
    resource === "tools" && request.method === "GET" && !id ? await lunaClient.getTools() :
    resource === "tools" && request.method === "GET" && id ? await lunaClient.getTool(id) :
    resource === "tools" && request.method === "POST" ? await lunaClient.createTool(body) :
    resource === "tools" && request.method === "PATCH" && id ? await lunaClient.updateTool(id, body) :
    resource === "tools" && request.method === "DELETE" && id ? await lunaClient.deleteTool(id) :
    resource === "tool-requests" && request.method === "GET" && !id ? await lunaClient.getToolRequests() :
    resource === "tool-requests" && request.method === "POST" && id && action === "approve" ? await lunaClient.approveToolRequest(id) :
    resource === "tool-requests" && request.method === "POST" && id && action === "reject" ? await lunaClient.rejectToolRequest(id, body || {}) :
    resource === "tool-executions" && request.method === "GET" ? await lunaClient.getToolExecutions() :
    resource === "workflows" && request.method === "GET" && !id ? await lunaClient.getWorkflows() :
    resource === "workflows" && request.method === "POST" && !id ? await lunaClient.createWorkflow(body) :
    resource === "workflows" && request.method === "POST" && id && action === "activate" ? await lunaClient.activateWorkflow(id) :
    resource === "workflows" && request.method === "POST" && id && action === "disable" ? await lunaClient.disableWorkflow(id) :
    resource === "workflows" && request.method === "POST" && id && action === "clone" ? await lunaClient.cloneWorkflow(id) :
    resource === "workflows" && request.method === "DELETE" && id ? await lunaClient.deleteWorkflow(id) :
    resource === "workflows" && request.method === "GET" && id && action === "steps" ? await lunaClient.getWorkflowSteps(id) :
    resource === "workflows" && request.method === "POST" && id && action === "steps" && path.length === 3 ? await lunaClient.createWorkflowStep(id, body) :
    resource === "workflows" && request.method === "POST" && id && action === "runs" ? await lunaClient.startWorkflowRun(id, body || {}) :
    resource === "workflows" && request.method === "POST" && id && action === "steps" && path[3] === "reorder" ? await lunaClient.reorderWorkflowSteps(id, body || []) :
    resource === "workflow-runs" && request.method === "GET" && !id ? await lunaClient.getWorkflowRuns() :
    resource === "workflow-runs" && request.method === "POST" && id && action === "continue" ? await lunaClient.continueWorkflowRun(id) :
    resource === "workflow-runs" && request.method === "POST" && id && action === "pause" ? await lunaClient.pauseWorkflowRun(id) :
    resource === "workflow-runs" && request.method === "POST" && id && action === "cancel" ? await lunaClient.cancelWorkflowRun(id) :
    resource === "workflow-runs" && request.method === "GET" && id && action === "steps" ? await lunaClient.getWorkflowStepRuns(id) :
    resource === "orchestrations" && request.method === "GET" && !id ? await lunaClient.getOrchestrations() :
    resource === "orchestrations" && request.method === "POST" && !id ? await lunaClient.createOrchestration(body) :
    resource === "orchestrations" && request.method === "POST" && id && action === "activate" ? await lunaClient.activateOrchestration(id) :
    resource === "orchestrations" && request.method === "POST" && id && action === "disable" ? await lunaClient.disableOrchestration(id) :
    resource === "orchestrations" && request.method === "POST" && id && action === "clone" ? await lunaClient.cloneOrchestration(id) :
    resource === "orchestrations" && request.method === "DELETE" && id ? await lunaClient.deleteOrchestration(id) :
    resource === "orchestrations" && request.method === "GET" && id && action === "roles" ? await lunaClient.getOrchestrationRoles(id) :
    resource === "orchestrations" && request.method === "POST" && id && action === "roles" && path.length === 3 ? await lunaClient.createOrchestrationRole(id, body) :
    resource === "orchestrations" && request.method === "POST" && id && action === "roles" && path[3] === "reorder" ? await lunaClient.reorderOrchestrationRoles(id, body || []) :
    resource === "orchestrations" && request.method === "POST" && id && action === "runs" ? await lunaClient.startOrchestrationRun(id, body || {}) :
    resource === "orchestration-runs" && request.method === "GET" && !id ? await lunaClient.getOrchestrationRuns() :
    resource === "orchestration-runs" && request.method === "POST" && id && action === "continue" ? await lunaClient.continueOrchestrationRun(id) :
    resource === "orchestration-runs" && request.method === "POST" && id && action === "pause" ? await lunaClient.pauseOrchestrationRun(id) :
    resource === "orchestration-runs" && request.method === "POST" && id && action === "cancel" ? await lunaClient.cancelOrchestrationRun(id) :
    resource === "orchestration-runs" && request.method === "GET" && id && action === "roles" ? await lunaClient.getOrchestrationRoleRuns(id) :
    resource === "execution-policies" && request.method === "GET" && !id ? await lunaClient.getExecutionPolicies() :
    resource === "execution-policies" && request.method === "GET" && id ? await lunaClient.getExecutionPolicy(id) :
    resource === "execution-policies" && request.method === "POST" ? await lunaClient.createExecutionPolicy(body) :
    resource === "execution-policies" && request.method === "PATCH" && id ? await lunaClient.updateExecutionPolicy(id, body) :
    resource === "execution-policies" && request.method === "DELETE" && id ? await lunaClient.deleteExecutionPolicy(id) :
    joined === "execution-usage/summary" && request.method === "GET" ? await lunaClient.getExecutionUsageSummary() :
    resource === "execution-usage" && request.method === "GET" ? await lunaClient.getExecutionUsage() :
    resource === "audit-logs" && request.method === "GET" ? await lunaClient.getAuditLogs() :
    { ok: false as const, status: "error" as const, message: "Unsupported Luna route" };

  if (!result.ok) return NextResponse.json(result, { status: result.status === "error" ? 400 : 503 });
  return NextResponse.json(result.data);
}

export const GET = dispatch;
export const POST = dispatch;
export const PATCH = dispatch;
export const DELETE = dispatch;
