"use client";

import { useState } from "react";
import type { LunaTool } from "@/bff/luna/luna.dto";

export default function LunaToolsPanel({ tools, onChanged }: { tools: LunaTool[]; onChanged: () => Promise<void> }) {
  const [name, setName] = useState("");
  async function createTool() {
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await fetch("/api/v1/luna/tools", { method: "POST", body: JSON.stringify({ name, slug, tool_type: "internal", enabled: false, config_schema: { type: "object" } }) });
    setName("");
    await onChanged();
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2 rounded border bg-white p-3">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tool name" className="min-w-0 flex-1 rounded border px-3 py-2" />
        <button onClick={createTool} className="rounded bg-[#1B2D4F] px-3 py-2 text-white">Create</button>
      </div>
      {tools.length === 0 ? <div className="rounded border bg-white p-5">No tools.</div> : tools.map((tool) => (
        <div key={tool.id} className="flex flex-wrap items-center justify-between gap-3 rounded border bg-white p-3">
          <div><div className="font-semibold">{tool.name}</div><div className="text-xs text-[#6B6B6B]">{tool.slug} · {tool.tool_type}</div></div>
          <div className="flex gap-2">
            <button onClick={async () => { await fetch(`/api/v1/luna/tools/${tool.id}`, { method: "PATCH", body: JSON.stringify({ enabled: !tool.enabled }) }); await onChanged(); }} className="rounded border px-3 py-2 text-sm">Edit</button>
            <button onClick={async () => { await fetch(`/api/v1/luna/tools/${tool.id}`, { method: "DELETE" }); await onChanged(); }} className="rounded border px-3 py-2 text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
