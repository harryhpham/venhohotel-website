import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function source(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

describe("Luna Control cockpit execution", () => {
  it("renders Run only for assigned tasks and tracks loading state", () => {
    const tasksPanel = source("src/components/os/sections/luna/LunaTasksPanel.tsx");

    expect(tasksPanel).toContain('task.status === "assigned"');
    expect(tasksPanel).toContain("runningTaskId === task.id");
    expect(tasksPanel).toContain("Running");
  });

  it("shows sanitized error state and read-only plain result content", () => {
    const tasksPanel = source("src/components/os/sections/luna/LunaTasksPanel.tsx");

    expect(tasksPanel).toContain("setMessage");
    expect(tasksPanel).toContain("task.result_payload?.content");
    expect(tasksPanel).not.toContain("dangerouslySetInnerHTML");
  });

  it("does not call Luna FastAPI directly from React components", () => {
    const lunaSectionFiles = [
      "src/components/os/sections/luna/LunaSection.tsx",
      "src/components/os/sections/luna/LunaAgentsPanel.tsx",
      "src/components/os/sections/luna/LunaTasksPanel.tsx",
      "src/components/os/sections/luna/LunaToolsPanel.tsx",
      "src/components/os/sections/luna/LunaGuardrailsPanel.tsx",
      "src/components/os/sections/luna/LunaUsagePanel.tsx",
      "src/components/os/sections/luna/LunaToolRequestsPanel.tsx",
      "src/components/os/sections/luna/LunaToolExecutionsPanel.tsx",
      "src/components/os/sections/luna/LunaWorkflowsPanel.tsx",
      "src/components/os/sections/luna/LunaWorkflowRunsPanel.tsx",
      "src/components/os/sections/luna/LunaOrchestrationsPanel.tsx",
      "src/components/os/sections/luna/LunaOrchestrationRunsPanel.tsx",
    ];

    for (const path of lunaSectionFiles) {
      const text = source(path);
      expect(text).not.toContain("127.0.0.1:8000");
      expect(text).not.toContain("localhost:8000");
      expect(text).not.toContain("LUNA_API_BASE_URL");
    }
  });

  it("exposes guardrails and usage panels without pricing config", () => {
    const section = source("src/components/os/sections/luna/LunaSection.tsx");
    const guardrails = source("src/components/os/sections/luna/LunaGuardrailsPanel.tsx");
    const usage = source("src/components/os/sections/luna/LunaUsagePanel.tsx");

    expect(section).toContain("Guardrails");
    expect(section).toContain("Usage");
    expect(guardrails).toContain("min={0}");
    expect(guardrails).toContain("window.confirm");
    expect(guardrails).toContain("inherited/default");
    expect(usage).toContain("Blocked");
    expect(`${section}${guardrails}${usage}`).not.toContain("LUNA_MODEL_PRICING_JSON");
  });

  it("shows execute preview while leaving backend authoritative", () => {
    const tasksPanel = source("src/components/os/sections/luna/LunaTasksPanel.tsx");

    expect(tasksPanel).toContain("Run preview");
    expect(tasksPanel).toContain("remaining budget checked by backend");
    expect(tasksPanel).toContain("/api/v1/luna/tasks/${task.id}/execute");
  });

  it("exposes tool approval cockpit with sanitized review flow", () => {
    const section = source("src/components/os/sections/luna/LunaSection.tsx");
    const requests = source("src/components/os/sections/luna/LunaToolRequestsPanel.tsx");
    const executions = source("src/components/os/sections/luna/LunaToolExecutionsPanel.tsx");
    const rbac = source("src/bff/luna/luna.rbac.ts");
    const tasksPanel = source("src/components/os/sections/luna/LunaTasksPanel.tsx");

    expect(section).toContain("Tool Requests");
    expect(section).toContain("Tool Executions");
    expect(requests).toContain("window.confirm");
    expect(requests).toContain("/api/v1/luna/tool-requests/${request.id}/approve");
    expect(requests).toContain("/api/v1/luna/tool-requests/${request.id}/reject");
    expect(executions).toContain("response_payload");
    expect(rbac).toContain("luna:tools:approve");
    expect(tasksPanel).toContain("Awaiting Tool Approval");
    expect(`${requests}${executions}`).not.toContain("dangerouslySetInnerHTML");
  });

  it("exposes manual workflow controls and workflow RBAC", () => {
    const section = source("src/components/os/sections/luna/LunaSection.tsx");
    const workflows = source("src/components/os/sections/luna/LunaWorkflowsPanel.tsx");
    const runs = source("src/components/os/sections/luna/LunaWorkflowRunsPanel.tsx");
    const rbac = source("src/bff/luna/luna.rbac.ts");

    expect(section).toContain("Workflows");
    expect(section).toContain("Workflow Runs");
    expect(workflows).toContain("/api/v1/luna/workflows");
    expect(workflows).toContain("/runs");
    expect(runs).toContain("Continue");
    expect(runs).toContain("Pause");
    expect(runs).toContain("Cancel");
    expect(rbac).toContain("luna:workflows:execute");
    expect(`${workflows}${runs}`).not.toContain("127.0.0.1:8000");
  });

  it("exposes manual multi-agent orchestration controls and RBAC", () => {
    const section = source("src/components/os/sections/luna/LunaSection.tsx");
    const orchestrations = source("src/components/os/sections/luna/LunaOrchestrationsPanel.tsx");
    const runs = source("src/components/os/sections/luna/LunaOrchestrationRunsPanel.tsx");
    const rbac = source("src/bff/luna/luna.rbac.ts");
    const route = source("src/app/api/v1/luna/[...path]/route.ts");

    expect(section).toContain("Orchestrations");
    expect(section).toContain("Orchestration Runs");
    expect(orchestrations).toContain("/api/v1/luna/orchestrations");
    expect(orchestrations).toContain("/roles");
    expect(orchestrations).toContain("/runs");
    expect(runs).toContain("Continue");
    expect(runs).toContain("Pause");
    expect(runs).toContain("Cancel");
    expect(rbac).toContain("luna:orchestrations:execute");
    expect(rbac).toContain("luna:orchestrations:review");
    expect(route).toContain("getOrchestrationRuns");
    expect(`${orchestrations}${runs}`).not.toContain("127.0.0.1:8000");
  });
});
