"use client";

import { useState } from "react";

import type { LunaAgent, LunaOrchestration } from "@/bff/luna/luna.dto";

export default function LunaOrchestrationsPanel({ agents, orchestrations, onChanged }: { agents: LunaAgent[]; orchestrations: LunaOrchestration[]; onChanged: () => Promise<void> }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function createOrchestration() {
    if (!name.trim()) return;
    const response = await fetch("/api/v1/luna/orchestrations", { method: "POST", body: JSON.stringify({ name }) });
    setMessage(response.ok ? "Orchestration draft created." : "Orchestration create failed.");
    setName("");
    await onChanged();
  }

  async function addRole(orchestration: LunaOrchestration) {
    const agent = agents.find((item) => item.enabled && item.status === "active");
    if (!agent) return setMessage("No active agent available.");
    const position = Number(window.prompt("Role position", "1") || "1");
    const roleType = window.prompt("Role type", position === 1 ? "coordinator" : "specialist") || "specialist";
    if (!["coordinator", "specialist", "reviewer", "finalizer"].includes(roleType)) return setMessage("Invalid role type.");
    const response = await fetch(`/api/v1/luna/orchestrations/${orchestration.id}/roles`, {
      method: "POST",
      body: JSON.stringify({
        role_key: `${roleType}_${position}`,
        name: `${roleType} ${position}`,
        position,
        role_type: roleType,
        agent_id: agent.id,
        instruction_template: `Act as ${roleType} for this orchestration role.`,
        can_request_tools: false,
      }),
    });
    setMessage(response.ok ? "Role added." : "Role add failed.");
    await onChanged();
  }

  async function action(orchestration: LunaOrchestration, command: string) {
    const response = await fetch(`/api/v1/luna/orchestrations/${orchestration.id}/${command}`, { method: "POST" });
    setMessage(response.ok ? `Orchestration ${command}.` : `Orchestration ${command} failed.`);
    await onChanged();
  }

  async function start(orchestration: LunaOrchestration) {
    const response = await fetch(`/api/v1/luna/orchestrations/${orchestration.id}/runs`, { method: "POST", body: JSON.stringify({ input_payload: {} }) });
    setMessage(response.ok ? "Orchestration started." : "Orchestration start failed.");
    await onChanged();
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 rounded border bg-white p-3">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Orchestration name" className="min-w-0 flex-1 rounded border px-3 py-2" />
        <button onClick={createOrchestration} className="rounded bg-[#1B2D4F] px-3 py-2 text-white">Create</button>
      </div>
      {message ? <div className="rounded border bg-white p-3 text-sm">{message}</div> : null}
      {orchestrations.length === 0 ? <div className="rounded border bg-white p-5">No orchestrations.</div> : orchestrations.map((orchestration) => (
        <div key={orchestration.id} className="rounded border bg-white p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold">{orchestration.name}</div>
              <div className="text-xs text-[#6B6B6B]">{orchestration.status} · v{orchestration.version} · active agents {agents.filter((agent) => agent.enabled && agent.status === "active").length}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => addRole(orchestration)} className="rounded border px-3 py-2">Add Role</button>
              <button onClick={() => action(orchestration, "activate")} className="rounded border px-3 py-2">Activate</button>
              <button onClick={() => action(orchestration, "disable")} className="rounded border px-3 py-2">Disable</button>
              <button onClick={() => action(orchestration, "clone")} className="rounded border px-3 py-2">Clone</button>
              <button disabled={orchestration.status !== "active"} onClick={() => start(orchestration)} className="rounded bg-[#C9A84C] px-3 py-2 text-black disabled:opacity-40">Start</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
