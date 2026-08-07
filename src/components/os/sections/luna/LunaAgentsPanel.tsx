"use client";

import { useState } from "react";
import type { LunaAgent } from "@/bff/luna/luna.dto";

export default function LunaAgentsPanel({ agents, onChanged }: { agents: LunaAgent[]; onChanged: () => Promise<void> }) {
  const [name, setName] = useState("");
  async function createAgent() {
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await fetch("/api/v1/luna/agents", { method: "POST", body: JSON.stringify({ name, slug, provider: "local", model_name: "local", status: "draft", enabled: false }) });
    setName("");
    await onChanged();
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2 rounded border bg-white p-3">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Agent name" className="min-w-0 flex-1 rounded border px-3 py-2" />
        <button onClick={createAgent} className="rounded bg-[#1B2D4F] px-3 py-2 text-white">Create</button>
      </div>
      {agents.length === 0 ? <div className="rounded border bg-white p-5">No agents.</div> : agents.map((agent) => (
        <div key={agent.id} className="flex flex-wrap items-center justify-between gap-3 rounded border bg-white p-3">
          <div><div className="font-semibold">{agent.name}</div><div className="text-xs text-[#6B6B6B]">{agent.slug} · {agent.provider} · {agent.status}</div></div>
          <div className="flex gap-2">
            <button onClick={async () => { await fetch(`/api/v1/luna/agents/${agent.id}`, { method: "PATCH", body: JSON.stringify({ status: agent.status === "active" ? "paused" : "active" }) }); await onChanged(); }} className="rounded border px-3 py-2 text-sm">Edit</button>
            <button onClick={async () => { await fetch(`/api/v1/luna/agents/${agent.id}`, { method: "DELETE" }); await onChanged(); }} className="rounded border px-3 py-2 text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
