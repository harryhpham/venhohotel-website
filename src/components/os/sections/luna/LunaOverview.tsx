import type { LunaOverviewSnapshot } from "@/bff/luna/luna.dto";

export default function LunaOverview({ overview }: { overview: LunaOverviewSnapshot | null }) {
  if (!overview) return <div className="rounded border bg-white p-5">No Luna overview available.</div>;
  const metrics = overview.metrics;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Metric label="Luna API" value={overview.status} />
      <Metric label="Agents" value={metrics?.agents_total ?? 0} />
      <Metric label="Tools" value={metrics?.tools_total ?? 0} />
      <Metric label="Scheduler" value={overview.health.scheduler} />
      <Metric label="PostgreSQL" value={overview.health.database} />
      <Metric label="Redis" value={overview.health.redis} />
      <div className="rounded border bg-white p-4 md:col-span-3">
        <div className="text-sm font-semibold">Tasks by status</div>
        <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(metrics?.tasks_by_status ?? {}, null, 2)}</pre>
      </div>
      <div className="rounded border bg-white p-4 md:col-span-3">
        <div className="text-sm font-semibold">Providers</div>
        <div className="mt-2 grid gap-2 md:grid-cols-3">
          {overview.providers.map((provider) => <Metric key={provider.provider} label={provider.provider} value={provider.status} />)}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border bg-white p-4">
      <div className="text-xs uppercase text-[#6B6B6B]">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
