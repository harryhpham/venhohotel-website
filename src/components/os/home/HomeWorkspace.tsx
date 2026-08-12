import dashboard from "@/lib/data/os-dashboard.json";

type IconName = "arrow" | "check" | "clock" | "spark" | "review" | "publish" | "play" | "dot";

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (name === "arrow") return <svg {...common}><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
  if (name === "clock") return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>;
  if (name === "spark") return <svg {...common}><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" /><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" /></svg>;
  if (name === "review") return <svg {...common}><path d="M5 5h14v14H5z" /><path d="M8 9h8M8 13h5" /></svg>;
  if (name === "publish") return <svg {...common}><path d="M5 12h13M13 6l6 6-6 6" /><path d="M5 6v12" /></svg>;
  if (name === "play") return <svg {...common}><path d="m9 6 8 6-8 6V6Z" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></svg>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <article className={`os-card ${className}`}>{children}</article>;
}

function SectionHeading({ eyebrow, title, count }: { eyebrow: string; title: string; count?: number }) {
  return <div className="os-section-heading"><div><p className="os-eyebrow">{eyebrow}</p><h2>{title}</h2></div>{typeof count === "number" ? <span className="os-count">{count}</span> : null}</div>;
}

export default function HomeWorkspace() {
  return (
    <div className="os-workspace">
      <header className="os-topbar">
        <div><p className="os-brand">VENHO OS</p><p className="os-topbar-subtitle">Home workspace</p></div>
        <div className="os-project"><span className="os-status-dot" />{dashboard.workspace.name}<span className="os-project-label">/ {dashboard.workspace.label}</span></div>
        <div className="os-topbar-actions"><span className="os-sync"><Icon name="check" size={15} /> Synced {dashboard.workspace.lastSync}</span><button className="os-icon-button" aria-label="Notifications"><Icon name="dot" /></button><div className="os-user-avatar" aria-label={`Signed in as ${dashboard.workspace.user}`}>HP</div></div>
      </header>

      <main className="os-main-content">
        <div className="os-page-intro"><div><p className="os-eyebrow">Tuesday, 11 August 2026</p><h1>Good morning, Hạnh.</h1><p className="os-intro-copy">Một không gian rõ ràng để tiếp tục công việc quan trọng nhất.</p></div><span className="os-live-badge"><Icon name="dot" size={13} /> Workspace live</span></div>

        <Card className="os-focus-card"><div className="os-focus-main"><div className="os-focus-icon"><Icon name="spark" size={21} /></div><div><p className="os-eyebrow">{dashboard.focus.eyebrow}</p><h2>{dashboard.focus.objective}</h2><p className="os-muted">{dashboard.focus.priority}</p></div></div><div className="os-focus-meta"><div><span>Milestone</span><strong>{dashboard.focus.milestone}</strong></div><div><span>Next action</span><strong>{dashboard.focus.nextAction}</strong></div><div><span>ETA</span><strong>{dashboard.focus.eta}</strong></div><button className="os-primary-button">Continue <Icon name="arrow" size={16} /></button></div></Card>

        <Card className="os-current-card"><div className="os-current-top"><div><p className="os-eyebrow">Current work</p><h2>{dashboard.currentWork.title}</h2><p className="os-muted">{dashboard.currentWork.description}</p></div><span className="os-pill os-pill-blue"><Icon name="play" size={13} /> {dashboard.currentWork.status}</span></div><div className="os-progress-row"><div className="os-progress-track"><span style={{ width: `${dashboard.currentWork.progress}%` }} /></div><span className="os-progress-label">{dashboard.currentWork.progress}%</span><span className="os-step-label">Step {dashboard.currentWork.step}</span><button className="os-quiet-button">Open work <Icon name="arrow" size={15} /></button></div></Card>

        <div className="os-two-column"><Card><SectionHeading eyebrow="Decision queue" title="Needs review" count={dashboard.needsReview.length} /><div className="os-list">{dashboard.needsReview.map((item) => <div className="os-list-row" key={item.title}><div className="os-list-icon"><Icon name="review" size={17} /></div><div className="os-list-copy"><strong>{item.title}</strong><span>{item.source} · {item.age}</span></div><button className="os-row-action" aria-label={`Review ${item.title}`}>Review <Icon name="arrow" size={14} /></button></div>)}</div></Card><Card><SectionHeading eyebrow="Publishing queue" title="Ready to publish" count={dashboard.readyToPublish.length} /><div className="os-list">{dashboard.readyToPublish.map((item) => <div className="os-list-row" key={item.title}><div className="os-list-icon os-list-icon-gold"><Icon name="publish" size={17} /></div><div className="os-list-copy"><strong>{item.title}</strong><span>{item.platform} · {item.status}</span></div><button className="os-row-action" aria-label={`Open ${item.title}`}>Open <Icon name="arrow" size={14} /></button></div>)}</div></Card></div>

        <Card><SectionHeading eyebrow="Shortcuts" title="Quick actions" /><div className="os-actions-grid">{dashboard.quickActions.map((action, index) => <button className={`os-action-button ${index === 1 ? "os-action-primary" : ""}`} key={action.label}><span><strong>{action.label}</strong><small>{action.description}</small></span><Icon name={index === 1 ? "spark" : "arrow"} size={17} /></button>)}</div></Card>

        <Card><SectionHeading eyebrow="System trace" title="Recent activity" /><div className="os-timeline">{dashboard.activity.map((item) => <div className="os-timeline-row" key={`${item.time}-${item.event}`}><span className="os-time">{item.time}</span><span className="os-timeline-dot"><Icon name="dot" size={12} /></span><div><strong>{item.event}</strong><span>{item.module}</span></div><button className="os-row-action">Open <Icon name="arrow" size={14} /></button></div>)}</div></Card>
      </main>
    </div>
  );
}
