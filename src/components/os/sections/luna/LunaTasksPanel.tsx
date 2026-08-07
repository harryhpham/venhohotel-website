"use client";

import { useState } from "react";
import type { LunaAgent, LunaTask } from "@/bff/luna/luna.dto";

const transitions: Record<string, string[]> = { pending: ["assign", "cancel"], assigned: ["start", "cancel"], running: ["complete", "fail"] };

export default function LunaTasksPanel({ agents, tasks, onChanged }: { agents: LunaAgent[]; tasks: LunaTask[]; onChanged: () => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  async function createTask() {
    if (!title.trim()) return;
    await fetch("/api/v1/luna/tasks", { method: "POST", body: JSON.stringify({ title, priority: "normal" }) });
    setTitle("");
    await onChanged();
  }
  async function transition(task: LunaTask, action: string) {
    const body = action === "assign" ? { agent_id: agents[0]?.id } : action === "complete" ? { result_payload: { ok: true } } : action === "fail" ? { error_message: "Marked failed from Control Center" } : undefined;
    if (action === "assign" && !agents[0]) return;
    await fetch(`/api/v1/luna/tasks/${task.id}/${action}`, { method: "POST", body: body ? JSON.stringify(body) : undefined });
    await onChanged();
  }
  async function execute(task: LunaTask) {
    if (!window.confirm("Run this assigned task now?")) return;
    setRunningTaskId(task.id);
    setMessage(null);
    try {
      const response = await fetch(`/api/v1/luna/tasks/${task.id}/execute`, { method: "POST", body: JSON.stringify({ instruction: null }) });
      const data = await response.json();
      if (!response.ok) setMessage(data?.error_message || data?.message || "Execution failed.");
      else setMessage("Task execution completed.");
      await onChanged();
    } catch {
      setMessage("Execution request failed.");
    } finally {
      setRunningTaskId(null);
    }
  }
  function executionPreview(task: LunaTask) {
    const agent = agents.find((item) => item.id === task.agent_id);
    const text = `${task.title}\n${task.description || ""}\n${JSON.stringify(task.input_payload || {})}`;
    return {
      provider: agent?.provider || "-",
      model: agent?.model_name || "-",
      estimatedTokens: Math.ceil(text.length / 4),
      maxOutputTokens: 4000,
      timeoutSeconds: 60,
    };
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-2 rounded border bg-white p-3">
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" className="min-w-0 flex-1 rounded border px-3 py-2" />
        <button onClick={createTask} className="rounded bg-[#1B2D4F] px-3 py-2 text-white">Create</button>
      </div>
      {message ? <div className="rounded border bg-white p-3 text-sm">{message}</div> : null}
      {tasks.length === 0 ? <div className="rounded border bg-white p-5">No tasks.</div> : tasks.map((task) => (
        <div key={task.id} className="rounded border bg-white p-3">
          {(() => {
            const preview = executionPreview(task);
            return task.status === "assigned" ? <div className="mb-2 rounded bg-[#F7F4EF] p-2 text-xs text-[#4B4B4B]">Run preview: {preview.provider} · {preview.model} · estimated input {preview.estimatedTokens} tokens · max output {preview.maxOutputTokens} · timeout {preview.timeoutSeconds}s · remaining budget checked by backend</div> : null;
          })()}
          <div className="flex flex-wrap justify-between gap-3">
            <div><div className="font-semibold">{task.title}</div><div className="text-xs text-[#6B6B6B]">{task.status === "awaiting_tool_approval" ? "Awaiting Tool Approval" : task.status} · {task.priority}</div></div>
            <div className="flex gap-2">
              <button onClick={async () => { await fetch(`/api/v1/luna/tasks/${task.id}`, { method: "PATCH", body: JSON.stringify({ priority: task.priority === "high" ? "normal" : "high" }) }); await onChanged(); }} className="rounded border px-3 py-2 text-sm">Edit</button>
              {(transitions[task.status] || []).map((action) => (
                <button key={action} onClick={() => transition(task, action)} disabled={action === "assign" && agents.length === 0} className="rounded border px-3 py-2 text-sm disabled:opacity-40">{action}</button>
              ))}
              {task.status === "assigned" ? (
                <button onClick={() => execute(task)} disabled={runningTaskId === task.id} className="rounded bg-[#C9A84C] px-3 py-2 text-sm text-black disabled:opacity-40">
                  {runningTaskId === task.id ? "Running" : "Run"}
                </button>
              ) : null}
            </div>
          </div>
          {task.result_payload?.content ? <pre className="mt-3 whitespace-pre-wrap rounded bg-[#F7F4EF] p-3 text-xs">{String(task.result_payload.content)}</pre> : null}
        </div>
      ))}
    </div>
  );
}
