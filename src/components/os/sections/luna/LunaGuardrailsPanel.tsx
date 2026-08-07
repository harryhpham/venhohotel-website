"use client";

import { useState } from "react";

import type { LunaAgent, LunaExecutionPolicy } from "@/bff/luna/luna.dto";

const providers = ["openai", "anthropic", "openrouter"];

function splitCsv(value: string): string[] | null {
  const items = value.split(",").map((item) => item.trim()).filter(Boolean);
  return items.length ? items : null;
}

function numberValue(value: string): number | null {
  if (value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export default function LunaGuardrailsPanel({ agents, policies, onChanged }: { agents: LunaAgent[]; policies: LunaExecutionPolicy[]; onChanged: () => Promise<void> }) {
  const globalPolicy = policies.find((policy) => policy.scope_type === "global");
  const [agentId, setAgentId] = useState(agents[0]?.id || "");
  const [allowedProviders, setAllowedProviders] = useState("openai,anthropic,openrouter");
  const [allowedModels, setAllowedModels] = useState("");
  const [timeoutSeconds, setTimeoutSeconds] = useState("60");
  const [maxInputTokens, setMaxInputTokens] = useState("16000");
  const [maxOutputTokens, setMaxOutputTokens] = useState("4000");
  const [maxExecutionsPerHour, setMaxExecutionsPerHour] = useState("10");
  const [dailyTokenLimit, setDailyTokenLimit] = useState("");
  const [monthlyTokenLimit, setMonthlyTokenLimit] = useState("");
  const [dailyCostLimitUsd, setDailyCostLimitUsd] = useState("");
  const [monthlyCostLimitUsd, setMonthlyCostLimitUsd] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function savePolicy(scope: "global" | "agent") {
    const existing = scope === "global" ? globalPolicy : policies.find((policy) => policy.scope_type === "agent" && policy.scope_id === agentId);
    const payload = {
      scope_type: scope,
      scope_id: scope === "agent" ? agentId : null,
      enabled: true,
      allowed_providers: splitCsv(allowedProviders),
      allowed_models: splitCsv(allowedModels),
      max_input_chars: null,
      max_output_chars: null,
      max_input_tokens: numberValue(maxInputTokens),
      max_output_tokens: numberValue(maxOutputTokens),
      timeout_seconds: numberValue(timeoutSeconds),
      max_executions_per_hour: numberValue(maxExecutionsPerHour),
      daily_token_limit: numberValue(dailyTokenLimit),
      monthly_token_limit: numberValue(monthlyTokenLimit),
      daily_cost_limit_usd: dailyCostLimitUsd || null,
      monthly_cost_limit_usd: monthlyCostLimitUsd || null,
    };
    if (scope === "agent" && !agentId) return;
    const response = await fetch(`/api/v1/luna/execution-policies${existing ? `/${existing.id}` : ""}`, {
      method: existing ? "PATCH" : "POST",
      body: JSON.stringify(existing ? Object.fromEntries(Object.entries(payload).filter(([key]) => !["scope_type", "scope_id"].includes(key))) : payload),
    });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Policy saved." : data?.message || data?.detail || "Policy save failed.");
    if (response.ok) await onChanged();
  }

  async function disable(policy: LunaExecutionPolicy) {
    if (!window.confirm("Disable this execution policy?")) return;
    const response = await fetch(`/api/v1/luna/execution-policies/${policy.id}`, { method: "PATCH", body: JSON.stringify({ enabled: false }) });
    setMessage(response.ok ? "Policy disabled." : "Policy disable failed.");
    if (response.ok) await onChanged();
  }

  async function remove(policy: LunaExecutionPolicy) {
    const response = await fetch(`/api/v1/luna/execution-policies/${policy.id}`, { method: "DELETE" });
    setMessage(response.ok ? "Policy deleted." : "Policy delete failed.");
    if (response.ok) await onChanged();
  }

  return (
    <div className="space-y-3">
      {message ? <div className="rounded border bg-white p-3 text-sm">{message}</div> : null}
      <div className="grid gap-3 rounded border bg-white p-3 md:grid-cols-3">
        <label className="text-sm">Agent override<select value={agentId} onChange={(event) => setAgentId(event.target.value)} className="mt-1 w-full rounded border px-3 py-2">{agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select></label>
        <label className="text-sm">Allowed providers<input value={allowedProviders} onChange={(event) => setAllowedProviders(event.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label className="text-sm">Allowed models<input value={allowedModels} onChange={(event) => setAllowedModels(event.target.value)} placeholder="Inherited when blank" className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label className="text-sm">Timeout seconds<input min={1} type="number" value={timeoutSeconds} onChange={(event) => setTimeoutSeconds(event.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label className="text-sm">Max input tokens<input min={0} type="number" value={maxInputTokens} onChange={(event) => setMaxInputTokens(event.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label className="text-sm">Max output tokens<input min={1} type="number" value={maxOutputTokens} onChange={(event) => setMaxOutputTokens(event.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label className="text-sm">Executions/hour<input min={0} type="number" value={maxExecutionsPerHour} onChange={(event) => setMaxExecutionsPerHour(event.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label className="text-sm">Daily tokens<input min={0} type="number" value={dailyTokenLimit} onChange={(event) => setDailyTokenLimit(event.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label className="text-sm">Monthly tokens<input min={0} type="number" value={monthlyTokenLimit} onChange={(event) => setMonthlyTokenLimit(event.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label className="text-sm">Daily cost USD<input min={0} type="number" value={dailyCostLimitUsd} onChange={(event) => setDailyCostLimitUsd(event.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <label className="text-sm">Monthly cost USD<input min={0} type="number" value={monthlyCostLimitUsd} onChange={(event) => setMonthlyCostLimitUsd(event.target.value)} className="mt-1 w-full rounded border px-3 py-2" /></label>
        <div className="flex items-end gap-2"><button onClick={() => savePolicy("global")} className="rounded bg-[#1B2D4F] px-3 py-2 text-sm text-white">Save Global</button><button onClick={() => savePolicy("agent")} className="rounded bg-[#C9A84C] px-3 py-2 text-sm text-black">Save Agent</button></div>
      </div>
      <div className="space-y-2">
        {policies.map((policy) => (
          <div key={policy.id} className="rounded border bg-white p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><strong>{policy.scope_type}</strong> {policy.scope_id ? `override ${agents.find((agent) => agent.id === policy.scope_id)?.name || policy.scope_id}` : "policy"} · {policy.enabled ? "enabled" : "disabled"}</div>
              <div className="flex gap-2"><button onClick={() => disable(policy)} className="rounded border px-3 py-1">Disable</button><button onClick={() => remove(policy)} className="rounded border px-3 py-1">Delete</button></div>
            </div>
            <div className="mt-2 text-xs text-[#6B6B6B]">providers {policy.allowed_providers?.join(", ") || "inherited/default"} · models {policy.allowed_models?.join(", ") || "inherited/default"} · timeout {policy.timeout_seconds ?? "inherited"} · output {policy.max_output_tokens ?? "inherited"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
