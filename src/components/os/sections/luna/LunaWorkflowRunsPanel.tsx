"use client";

import type { LunaWorkflow, LunaWorkflowRun } from "@/bff/luna/luna.dto";

export default function LunaWorkflowRunsPanel({ workflows, runs, onChanged }: { workflows: LunaWorkflow[]; runs: LunaWorkflowRun[]; onChanged: () => Promise<void> }) {
  const workflowName = (id: string) => workflows.find((workflow) => workflow.id === id)?.name || id.slice(0, 8);

  async function command(run: LunaWorkflowRun, action: "continue" | "pause" | "cancel") {
    await fetch(`/api/v1/luna/workflow-runs/${run.id}/${action}`, { method: "POST" });
    await onChanged();
  }

  return (
    <div className="space-y-3">
      {runs.length === 0 ? <div className="rounded border bg-white p-5">No workflow runs.</div> : runs.map((run) => (
        <div key={run.id} className="rounded border bg-white p-3 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><div className="font-semibold">{workflowName(run.workflow_definition_id)} v{run.workflow_version}</div><div className="text-xs text-[#6B6B6B]">{run.status} · current step {run.current_step_position ?? "-"} · {run.started_at ? new Date(run.started_at).toLocaleString() : "not started"}</div></div>
            <div className="flex gap-2">
              <button disabled={!["paused", "awaiting_tool_approval"].includes(run.status)} onClick={() => command(run, "continue")} className="rounded bg-[#C9A84C] px-3 py-2 text-black disabled:opacity-40">Continue</button>
              <button disabled={run.status !== "running"} onClick={() => command(run, "pause")} className="rounded border px-3 py-2 disabled:opacity-40">Pause</button>
              <button disabled={["completed", "failed", "cancelled"].includes(run.status)} onClick={() => command(run, "cancel")} className="rounded border px-3 py-2 disabled:opacity-40">Cancel</button>
            </div>
          </div>
          {run.error_code ? <div className="mt-2 text-xs text-red-700">{run.error_code}: {run.error_message}</div> : null}
          <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded bg-[#F7F4EF] p-3 text-xs">{JSON.stringify(run.context_payload || run.output_payload || {}, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
