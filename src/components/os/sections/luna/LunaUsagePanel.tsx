"use client";

import type { LunaAgent, LunaExecutionUsage, LunaExecutionUsageSummary } from "@/bff/luna/luna.dto";

export default function LunaUsagePanel({ agents, usage, summary }: { agents: LunaAgent[]; usage: LunaExecutionUsage[]; summary: LunaExecutionUsageSummary | null }) {
  const blocked = usage.filter((item) => item.status === "blocked").length;
  const providerCounts = usage.reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.provider]: (acc[item.provider] || 0) + 1 }), {});
  const agentName = (id: string) => agents.find((agent) => agent.id === id)?.name || id.slice(0, 8);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded border bg-white p-3"><div className="text-xs text-[#6B6B6B]">Today executions</div><div className="text-xl font-semibold">{summary?.today.executions ?? 0}</div></div>
        <div className="rounded border bg-white p-3"><div className="text-xs text-[#6B6B6B]">Today tokens</div><div className="text-xl font-semibold">{summary?.today.total_tokens ?? 0}</div></div>
        <div className="rounded border bg-white p-3"><div className="text-xs text-[#6B6B6B]">Month tokens</div><div className="text-xl font-semibold">{summary?.month.total_tokens ?? 0}</div></div>
        <div className="rounded border bg-white p-3"><div className="text-xs text-[#6B6B6B]">Blocked</div><div className="text-xl font-semibold">{blocked}</div></div>
      </div>
      <div className="rounded border bg-white p-3 text-sm">Providers: {Object.entries(providerCounts).map(([provider, count]) => `${provider} ${count}`).join(" · ") || "No usage"}</div>
      <div className="space-y-2">
        {usage.map((item) => (
          <div key={item.id} className="rounded border bg-white p-3 text-sm">
            <div className="flex flex-wrap justify-between gap-2"><strong>{item.status}</strong><span>{item.provider} · {item.model_name} · {agentName(item.agent_id)}</span></div>
            <div className="mt-1 text-xs text-[#6B6B6B]">input {item.input_tokens ?? "-"} · output {item.output_tokens ?? "-"} · total {item.total_tokens ?? "-"} · cost {item.estimated_cost_usd ?? "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
