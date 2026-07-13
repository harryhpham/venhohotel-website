/**
 * @layer interface
 * @context home
 * @owns Home Workspace presentation
 * @depends-on bff-dto
 * @invariant Dumb prop-driven UI; no metric calculation, no prompt build, no provider call.
 * @invariant Layout order per PLAN §13.3: Focus→CurrentWork→Pulse→Decision∥Publish→QuickActions∥AgentHealth→Activity
 */

import type { AgentWorkflowHealthDto, HomeSnapshotDto, OperatingPulseDto } from "@/bff/home/home-snapshot.dto";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[#E8E5DF] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] ${className}`}>
      {children}
    </section>
  );
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "watch" | "critical" }) {
  const colors = {
    neutral: "bg-[#F2F0EC] text-[#6B6B6B]",
    good: "bg-[#EEF6F0] text-[#5F8F6F]",
    watch: "bg-[#FFF6E4] text-[#8A621A]",
    critical: "bg-[#FDECEA] text-[#C96A5C]",
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[tone]}`}>{children}</span>;
}

function pulseTone(status: OperatingPulseDto["status"]): "good" | "watch" | "critical" | "neutral" {
  if (status === "HEALTHY") return "good";
  if (status === "ACTION_REQUIRED") return "critical";
  if (status === "WATCH") return "watch";
  return "neutral"; // UNKNOWN stays neutral — never conflate with HEALTHY (PLAN §13.5)
}

function agentTone(status: AgentWorkflowHealthDto["status"]): "good" | "watch" | "critical" {
  if (status === "ready") return "good";
  if (status === "blocked") return "critical";
  return "watch";
}

export default function HomeWorkspace({ snapshot }: { snapshot: HomeSnapshotDto }) {
  const focus = snapshot.todaysFocus.data;
  const work = snapshot.currentWork.data;

  return (
    <main className="space-y-6 bg-[#F8F7F4] p-8">
      <Card className="min-h-[140px]">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C867C]">Today&apos;s Focus</div>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-[#242424]">{focus.objective}</h1>
            <div className="mt-4 grid gap-2 text-sm text-[#6B6B6B] md:grid-cols-2">
              <div>Priority #1: <strong className="text-[#242424]">{focus.priority}</strong></div>
              <div>Milestone: <strong className="text-[#242424]">{focus.milestone}</strong></div>
              <div>Next Action: <strong className="text-[#242424]">{focus.nextAction}</strong></div>
              <div>ETA: <strong className="text-[#242424]">{focus.eta}</strong></div>
            </div>
          </div>
          <a className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2F6F91] px-5 text-sm font-bold text-white" href={focus.actionRoute}>
            Continue
          </a>
        </div>
      </Card>

      <Card className="min-h-[180px]">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#8C867C]">Current Work</div>
            <h2 className="mt-3 text-2xl font-bold text-[#242424]">{work.taskTitle}</h2>
            <div className="mt-3 text-sm text-[#6B6B6B]">{work.currentStep}</div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#EEEAE3]">
              <div className="h-full rounded-full bg-[#2F6F91]" style={{ width: `${work.progressPercent}%` }} />
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <Badge tone="watch">{work.status}</Badge>
            <a className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2F6F91] px-5 text-sm font-bold text-white" href={work.continueRoute}>
              Continue
            </a>
          </div>
        </div>
      </Card>

      {/* Operating Pulse — exceptions only, ≤4 items, UNKNOWN ≠ HEALTHY (PLAN §13.5) */}
      <Card>
        <h2 className="text-xl font-bold text-[#242424]">Operating Pulse</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {snapshot.operatingPulse.data.slice(0, 4).map((item) => (
            <div className="rounded-xl bg-[#F8F7F4] p-4" key={item.domain}>
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-bold capitalize text-[#242424]">{item.domain.replace("-", " ")}</div>
                <Badge tone={pulseTone(item.status)}>{item.status}</Badge>
              </div>
              <div className="mt-2 text-xs leading-5 text-[#6B6B6B]">{item.reason}</div>
              <div className="mt-2 text-xs font-semibold text-[#2F6F91]">{item.action}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Decision ∥ Publish (PLAN §13.3) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold text-[#242424]">Needs Review</h2>
          <div className="mt-4 divide-y divide-[#E8E5DF]">
            {snapshot.needsReview.data.slice(0, 5).map((item) => (
              <div className="grid min-h-16 grid-cols-[32px_1fr_auto] items-center gap-3 py-3" key={item.id}>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#FDECEA] text-sm font-bold text-[#C96A5C]">{item.icon}</span>
                <div>
                  <div className="text-sm font-bold text-[#242424]">{item.title}</div>
                  <div className="text-xs text-[#8C867C]">{item.source} · {item.risk === "high" ? "⚠ high-risk" : "normal"}</div>
                </div>
                {/* High-risk: no 1-click approve until detail opened (PLAN §13.4) */}
                <a className="rounded-full bg-[#EAF3F7] px-4 py-2 text-xs font-bold text-[#2F6F91]" href={item.actionRoute}>
                  {item.actionLabel}
                </a>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold text-[#242424]">Ready to Publish</h2>
          <div className="mt-4 divide-y divide-[#E8E5DF]">
            {snapshot.readyToPublish.data.slice(0, 5).map((item) => (
              <div className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 py-3" key={item.id}>
                <div>
                  <div className="text-sm font-bold text-[#242424]">{item.contentTitle}</div>
                  <div className="text-xs text-[#8C867C]">{item.channel}</div>
                </div>
                {/* Approve ≠ publish — separate transition (PLAN §6.12, §13.3) */}
                <a className="rounded-full bg-[#2F6F91] px-4 py-2 text-xs font-bold text-white" href={item.actionRoute}>
                  Approve
                </a>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* QuickActions ∥ AgentHealth (PLAN §13.3) */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <h2 className="text-xl font-bold text-[#242424]">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {snapshot.quickActions.data.slice(0, 6).map((action) => (
              <a
                key={action.id}
                href={action.enabled ? action.route : undefined}
                aria-disabled={!action.enabled}
                className={`inline-flex min-h-[52px] items-center justify-center rounded-full border px-4 text-sm font-bold transition ${
                  action.enabled
                    ? "border-[#D7E8EF] bg-[#EAF3F7] text-[#2F6F91] hover:bg-[#D7E8EF]"
                    : "cursor-not-allowed border-[#E8E5DF] bg-[#F2F0EC] text-[#8C867C]"
                }`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </Card>

        {/* Agent/Workflow Health — level NOT changeable from Home (PLAN §13.6) */}
        <Card>
          <h2 className="text-xl font-bold text-[#242424]">Agent Health</h2>
          <div className="mt-4 space-y-3">
            {snapshot.agentWorkflowHealth.data.slice(0, 4).map((agent) => (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8F7F4] p-3" key={agent.label}>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-[#242424]">{agent.label}</div>
                  <div className="mt-0.5 text-xs text-[#6B6B6B]">{agent.action}</div>
                </div>
                <Badge tone={agentTone(agent.status)}>{agent.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity (PLAN §13.3 — last in order) */}
      <Card>
        <h2 className="text-xl font-bold text-[#242424]">Recent Activity</h2>
        <div className="mt-4 divide-y divide-[#E8E5DF]">
          {snapshot.recentActivity.data.slice(0, 10).map((item) => (
            <a className="grid gap-2 py-3 text-sm md:grid-cols-[72px_1fr_auto]" href={item.route} key={item.id}>
              <span className="font-mono text-xs text-[#8C867C]">{item.time}</span>
              <span className="font-semibold text-[#242424]">{item.event}</span>
              <span className="text-xs font-bold text-[#2F6F91]">{item.module}</span>
            </a>
          ))}
        </div>
      </Card>
    </main>
  );
}
