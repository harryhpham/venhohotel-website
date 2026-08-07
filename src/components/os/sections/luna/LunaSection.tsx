"use client";

import { useEffect, useMemo, useState } from "react";

import LunaAgentsPanel from "@/components/os/sections/luna/LunaAgentsPanel";
import LunaAuditPanel from "@/components/os/sections/luna/LunaAuditPanel";
import LunaGuardrailsPanel from "@/components/os/sections/luna/LunaGuardrailsPanel";
import LunaHealthPanel from "@/components/os/sections/luna/LunaHealthPanel";
import LunaOrchestrationRunsPanel from "@/components/os/sections/luna/LunaOrchestrationRunsPanel";
import LunaOrchestrationsPanel from "@/components/os/sections/luna/LunaOrchestrationsPanel";
import LunaOverview from "@/components/os/sections/luna/LunaOverview";
import LunaTasksPanel from "@/components/os/sections/luna/LunaTasksPanel";
import LunaToolsPanel from "@/components/os/sections/luna/LunaToolsPanel";
import LunaToolExecutionsPanel from "@/components/os/sections/luna/LunaToolExecutionsPanel";
import LunaToolRequestsPanel from "@/components/os/sections/luna/LunaToolRequestsPanel";
import LunaUsagePanel from "@/components/os/sections/luna/LunaUsagePanel";
import LunaWorkflowRunsPanel from "@/components/os/sections/luna/LunaWorkflowRunsPanel";
import LunaWorkflowsPanel from "@/components/os/sections/luna/LunaWorkflowsPanel";
import type { LunaAgent, LunaAuditLog, LunaExecutionPolicy, LunaExecutionUsage, LunaExecutionUsageSummary, LunaOrchestration, LunaOrchestrationRun, LunaOverviewSnapshot, LunaTask, LunaTool, LunaToolExecution, LunaToolRequest, LunaWorkflow, LunaWorkflowRun } from "@/bff/luna/luna.dto";

type Tab = "overview" | "agents" | "tasks" | "workflows" | "workflowRuns" | "orchestrations" | "orchestrationRuns" | "tools" | "toolRequests" | "toolExecutions" | "guardrails" | "usage" | "audit" | "health";

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init?.headers || {}) } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export default function LunaSection() {
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<LunaOverviewSnapshot | null>(null);
  const [agents, setAgents] = useState<LunaAgent[]>([]);
  const [tasks, setTasks] = useState<LunaTask[]>([]);
  const [tools, setTools] = useState<LunaTool[]>([]);
  const [auditLogs, setAuditLogs] = useState<LunaAuditLog[]>([]);
  const [policies, setPolicies] = useState<LunaExecutionPolicy[]>([]);
  const [usage, setUsage] = useState<LunaExecutionUsage[]>([]);
  const [usageSummary, setUsageSummary] = useState<LunaExecutionUsageSummary | null>(null);
  const [toolRequests, setToolRequests] = useState<LunaToolRequest[]>([]);
  const [toolExecutions, setToolExecutions] = useState<LunaToolExecution[]>([]);
  const [workflows, setWorkflows] = useState<LunaWorkflow[]>([]);
  const [workflowRuns, setWorkflowRuns] = useState<LunaWorkflowRun[]>([]);
  const [orchestrations, setOrchestrations] = useState<LunaOrchestration[]>([]);
  const [orchestrationRuns, setOrchestrationRuns] = useState<LunaOrchestrationRun[]>([]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, agentsData, tasksData, workflowsData, workflowRunsData, orchestrationsData, orchestrationRunsData, toolsData, toolRequestData, toolExecutionData, policyData, usageData, usageSummaryData, auditData] = await Promise.all([
        fetchJson<LunaOverviewSnapshot>("/api/v1/luna/overview"),
        fetchJson<LunaAgent[]>("/api/v1/luna/agents"),
        fetchJson<LunaTask[]>("/api/v1/luna/tasks"),
        fetchJson<LunaWorkflow[]>("/api/v1/luna/workflows"),
        fetchJson<LunaWorkflowRun[]>("/api/v1/luna/workflow-runs"),
        fetchJson<LunaOrchestration[]>("/api/v1/luna/orchestrations"),
        fetchJson<LunaOrchestrationRun[]>("/api/v1/luna/orchestration-runs"),
        fetchJson<LunaTool[]>("/api/v1/luna/tools"),
        fetchJson<LunaToolRequest[]>("/api/v1/luna/tool-requests"),
        fetchJson<LunaToolExecution[]>("/api/v1/luna/tool-executions"),
        fetchJson<LunaExecutionPolicy[]>("/api/v1/luna/execution-policies"),
        fetchJson<LunaExecutionUsage[]>("/api/v1/luna/execution-usage"),
        fetchJson<LunaExecutionUsageSummary>("/api/v1/luna/execution-usage/summary"),
        fetchJson<LunaAuditLog[]>("/api/v1/luna/audit-logs"),
      ]);
      setOverview(overviewData);
      setAgents(Array.isArray(agentsData) ? agentsData : []);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setWorkflows(Array.isArray(workflowsData) ? workflowsData : []);
      setWorkflowRuns(Array.isArray(workflowRunsData) ? workflowRunsData : []);
      setOrchestrations(Array.isArray(orchestrationsData) ? orchestrationsData : []);
      setOrchestrationRuns(Array.isArray(orchestrationRunsData) ? orchestrationRunsData : []);
      setTools(Array.isArray(toolsData) ? toolsData : []);
      setPolicies(Array.isArray(policyData) ? policyData : []);
      setToolRequests(Array.isArray(toolRequestData) ? toolRequestData : []);
      setToolExecutions(Array.isArray(toolExecutionData) ? toolExecutionData : []);
      setUsage(Array.isArray(usageData) ? usageData : []);
      setUsageSummary(usageSummaryData);
      setAuditLogs(Array.isArray(auditData) ? auditData : []);
    } catch {
      setError("Luna is not configured or unreachable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const tabs = useMemo(
    () => [
      ["overview", "Overview"],
      ["agents", "Agents"],
      ["tasks", "Tasks"],
      ["workflows", "Workflows"],
      ["workflowRuns", "Workflow Runs"],
      ["orchestrations", "Orchestrations"],
      ["orchestrationRuns", "Orchestration Runs"],
      ["tools", "Tools"],
      ["toolRequests", "Tool Requests"],
      ["toolExecutions", "Tool Executions"],
      ["guardrails", "Guardrails"],
      ["usage", "Usage"],
      ["audit", "Audit Logs"],
      ["health", "Health"],
    ] as const,
    [],
  );

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Luna Control Center</h1>
          <p className="text-sm text-[#6B6B6B]">Metadata control surface for Luna Orchestrator.</p>
        </div>
        <button onClick={refresh} className="rounded bg-[#1B2D4F] px-4 py-2 text-sm text-white">Refresh</button>
      </header>
      <div className="flex flex-wrap gap-2">
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`rounded px-3 py-2 text-sm ${tab === id ? "bg-[#C9A84C] text-black" : "bg-white"}`}>
            {label}
          </button>
        ))}
      </div>
      {loading ? <div className="rounded border bg-white p-5">Loading Luna...</div> : null}
      {error ? <div className="rounded border border-red-200 bg-white p-5 text-red-700">{error}</div> : null}
      {!loading && !error && tab === "overview" && <LunaOverview overview={overview} />}
      {!loading && !error && tab === "agents" && <LunaAgentsPanel agents={agents} onChanged={refresh} />}
      {!loading && !error && tab === "tasks" && <LunaTasksPanel agents={agents} tasks={tasks} onChanged={refresh} />}
      {!loading && !error && tab === "workflows" && <LunaWorkflowsPanel agents={agents} tools={tools} workflows={workflows} onChanged={refresh} />}
      {!loading && !error && tab === "workflowRuns" && <LunaWorkflowRunsPanel workflows={workflows} runs={workflowRuns} onChanged={refresh} />}
      {!loading && !error && tab === "orchestrations" && <LunaOrchestrationsPanel agents={agents} orchestrations={orchestrations} onChanged={refresh} />}
      {!loading && !error && tab === "orchestrationRuns" && <LunaOrchestrationRunsPanel orchestrations={orchestrations} runs={orchestrationRuns} onChanged={refresh} />}
      {!loading && !error && tab === "tools" && <LunaToolsPanel tools={tools} onChanged={refresh} />}
      {!loading && !error && tab === "toolRequests" && <LunaToolRequestsPanel agents={agents} tasks={tasks} requests={toolRequests} onChanged={refresh} />}
      {!loading && !error && tab === "toolExecutions" && <LunaToolExecutionsPanel executions={toolExecutions} />}
      {!loading && !error && tab === "guardrails" && <LunaGuardrailsPanel agents={agents} policies={policies} onChanged={refresh} />}
      {!loading && !error && tab === "usage" && <LunaUsagePanel agents={agents} usage={usage} summary={usageSummary} />}
      {!loading && !error && tab === "audit" && <LunaAuditPanel auditLogs={auditLogs} />}
      {!loading && !error && tab === "health" && <LunaHealthPanel overview={overview} />}
    </section>
  );
}
