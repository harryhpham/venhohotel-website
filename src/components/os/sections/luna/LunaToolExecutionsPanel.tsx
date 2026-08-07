"use client";

import type { LunaToolExecution } from "@/bff/luna/luna.dto";

export default function LunaToolExecutionsPanel({ executions }: { executions: LunaToolExecution[] }) {
  return (
    <div className="space-y-3">
      {executions.length === 0 ? <div className="rounded border bg-white p-5">No tool executions.</div> : executions.map((execution) => (
        <div key={execution.id} className="rounded border bg-white p-3 text-sm">
          <div className="flex flex-wrap justify-between gap-2"><strong>{execution.tool_name}</strong><span>{execution.status} · {execution.duration_ms ?? "-"} ms</span></div>
          <div className="mt-1 text-xs text-[#6B6B6B]">input {JSON.stringify(execution.request_payload || {}).length} bytes · output {JSON.stringify(execution.response_payload || {}).length} bytes · error {execution.error_code || "-"}</div>
          {execution.response_payload ? <pre className="mt-3 whitespace-pre-wrap rounded bg-[#F7F4EF] p-3 text-xs">{JSON.stringify(execution.response_payload, null, 2)}</pre> : null}
        </div>
      ))}
    </div>
  );
}
