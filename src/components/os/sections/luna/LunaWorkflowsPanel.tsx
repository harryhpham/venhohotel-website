"use client";

import { useState } from "react";

import type { LunaAgent, LunaTool, LunaWorkflow } from "@/bff/luna/luna.dto";

export default function LunaWorkflowsPanel({ agents, tools, workflows, onChanged }: { agents: LunaAgent[]; tools: LunaTool[]; workflows: LunaWorkflow[]; onChanged: () => Promise<void> }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function createWorkflow() {
    if (!name.trim()) return;
    const response = await fetch("/api/v1/luna/workflows", { method: "POST", body: JSON.stringify({ name }) });
    setMessage(response.ok ? "Workflow draft created." : "Workflow create failed.");
    setName("");
    await onChanged();
  }

  async function addTransform(workflow: LunaWorkflow) {
    const position = Number(window.prompt("Step position", "1") || "1");
    if (!Number.isFinite(position) || position < 1) return setMessage("Invalid step position.");
    const response = await fetch(`/api/v1/luna/workflows/${workflow.id}/steps`, {
      method: "POST",
      body: JSON.stringify({ step_key: `step_${position}`, name: `Step ${position}`, position, step_type: "transform", output_mapping: { operation: "merge", values: { ok: true } } }),
    });
    setMessage(response.ok ? "Step added." : "Step add failed.");
    await onChanged();
  }

  async function action(workflow: LunaWorkflow, command: string) {
    const response = await fetch(`/api/v1/luna/workflows/${workflow.id}/${command}`, { method: "POST" });
    setMessage(response.ok ? `Workflow ${command}.` : `Workflow ${command} failed.`);
    await onChanged();
  }

  async function start(workflow: LunaWorkflow) {
    const response = await fetch(`/api/v1/luna/workflows/${workflow.id}/runs`, { method: "POST", body: JSON.stringify({ input_payload: {} }) });
    setMessage(response.ok ? "Workflow started." : "Workflow start failed.");
    await onChanged();
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 rounded border bg-white p-3">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Workflow name" className="min-w-0 flex-1 rounded border px-3 py-2" />
        <button onClick={createWorkflow} className="rounded bg-[#1B2D4F] px-3 py-2 text-white">Create</button>
      </div>
      {message ? <div className="rounded border bg-white p-3 text-sm">{message}</div> : null}
      {workflows.length === 0 ? <div className="rounded border bg-white p-5">No workflows.</div> : workflows.map((workflow) => (
        <div key={workflow.id} className="rounded border bg-white p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><div className="font-semibold">{workflow.name}</div><div className="text-xs text-[#6B6B6B]">{workflow.status} · v{workflow.version} · agents {agents.length} · tools {tools.length}</div></div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => addTransform(workflow)} className="rounded border px-3 py-2">Add Step</button>
              <button onClick={() => action(workflow, "activate")} className="rounded border px-3 py-2">Activate</button>
              <button onClick={() => action(workflow, "disable")} className="rounded border px-3 py-2">Disable</button>
              <button onClick={() => action(workflow, "clone")} className="rounded border px-3 py-2">Clone</button>
              <button disabled={workflow.status !== "active"} onClick={() => start(workflow)} className="rounded bg-[#C9A84C] px-3 py-2 text-black disabled:opacity-40">Start</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
