"use client";

import { useState } from "react";

import type { LunaAgent, LunaTask, LunaToolRequest } from "@/bff/luna/luna.dto";

export default function LunaToolRequestsPanel({ agents, tasks, requests, onChanged }: { agents: LunaAgent[]; tasks: LunaTask[]; requests: LunaToolRequest[]; onChanged: () => Promise<void> }) {
  const [message, setMessage] = useState<string | null>(null);
  const agentName = (id: string) => agents.find((agent) => agent.id === id)?.name || id.slice(0, 8);
  const taskTitle = (id: string) => tasks.find((task) => task.id === id)?.title || id.slice(0, 8);

  async function approve(request: LunaToolRequest) {
    if (!window.confirm("Approve this sandboxed tool request?")) return;
    const response = await fetch(`/api/v1/luna/tool-requests/${request.id}/approve`, { method: "POST" });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Tool request approved." : data?.message || data?.error_message || "Approve failed.");
    await onChanged();
  }

  async function reject(request: LunaToolRequest) {
    const reason = window.prompt("Reject reason") || "Rejected from Control Center";
    const response = await fetch(`/api/v1/luna/tool-requests/${request.id}/reject`, { method: "POST", body: JSON.stringify({ reason }) });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Tool request rejected." : data?.message || data?.error_message || "Reject failed.");
    await onChanged();
  }

  return (
    <div className="space-y-3">
      {message ? <div className="rounded border bg-white p-3 text-sm">{message}</div> : null}
      {requests.length === 0 ? <div className="rounded border bg-white p-5">No tool requests.</div> : requests.map((request) => (
        <div key={request.id} className="rounded border bg-white p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><div className="font-semibold">{request.tool_name}</div><div className="text-xs text-[#6B6B6B]">{request.status} · {taskTitle(request.task_id)} · {agentName(request.agent_id)}</div></div>
            <div className="flex gap-2">
              <button disabled={request.status !== "pending"} onClick={() => approve(request)} className="rounded bg-[#C9A84C] px-3 py-2 text-sm text-black disabled:opacity-40">Approve</button>
              <button disabled={request.status !== "pending"} onClick={() => reject(request)} className="rounded border px-3 py-2 text-sm disabled:opacity-40">Reject</button>
            </div>
          </div>
          <pre className="mt-3 whitespace-pre-wrap rounded bg-[#F7F4EF] p-3 text-xs">{JSON.stringify(request.request_payload || {}, null, 2)}</pre>
          <div className="mt-2 text-xs text-[#6B6B6B]">expires {new Date(request.expires_at).toLocaleString()} · confirmation {String(request.policy_snapshot?.require_tool_confirmation ?? true)}</div>
        </div>
      ))}
    </div>
  );
}
