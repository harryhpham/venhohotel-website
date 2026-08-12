const sections = [
  { id: "home", label: "Home workspace", icon: "H" },
  { id: "hermes-nous", label: "Hermes Nous", icon: "N" },
  { id: "luna", label: "Luna Control", icon: "L" },
] as const;

export type OSSection = (typeof sections)[number]["id"];

export function isOSSection(section: string): section is OSSection {
  return sections.some(({ id }) => id === section);
}

export default function SidebarNavigation({ activeSection }: { activeSection: OSSection }) {
  return (
    <aside className="os-sidebar">
      <div className="os-sidebar-brand"><div className="os-mark">V</div><div><strong>VENHO OS</strong><span>Operating workspace</span></div></div>
      <nav className="os-sidebar-nav" aria-label="Primary navigation">
        <p className="os-nav-label">Workspace</p>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`/os?section=${section.id}`}
            aria-current={activeSection === section.id ? "page" : undefined}
            className={`os-nav-item ${activeSection === section.id ? "is-active" : ""}`}
          >
            <span className="os-nav-icon" aria-hidden="true">{section.icon}</span><span>{section.label}</span>
          </a>
        ))}
      </nav>
      <div className="os-sidebar-footer"><p className="os-nav-label">System</p><a className="os-nav-item" href="#"><span className="os-nav-icon" aria-hidden="true">S</span><span>Settings</span></a><div className="os-sidebar-note"><span className="os-status-dot" />All systems operational</div></div>
    </aside>
  );
}
