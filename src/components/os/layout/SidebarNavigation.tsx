/**
 * @layer interface
 * @context dashboard-layout
 * @owns Sidebar navigation presentation
 * @depends-on none
 * @invariant Navigation only; no authorization or domain branching here.
 */

import Link from "next/link";

// Sidebar order per PLAN §13.2
const items: { label: string; href: string; section: string | null }[] = [
  { label: "Home Workspace", href: "/os", section: null },
  { label: "Projects", href: "/os?section=projects", section: "projects" },
  { label: "Tasks", href: "/os?section=tasks", section: "tasks" },
  { label: "Knowledge", href: "/os?section=knowledge", section: "knowledge" },
  { label: "Workbench", href: "/os?section=workbench", section: "workbench" },
  { label: "Creative Studio", href: "/os?section=creative-studio", section: "creative-studio" },
  { label: "Agents", href: "/os?section=agents", section: "agents" },
  { label: "Operations", href: "/os?section=operations", section: "operations" },
  { label: "Publishing", href: "/os?section=publishing", section: "publishing" },
  { label: "Reports", href: "/os?section=reports", section: "reports" },
  { label: "Settings", href: "/os?section=settings", section: "settings" },
];

export default function SidebarNavigation({ activeSection }: { activeSection: string | null }) {
  return (
    <aside className="hidden w-[240px] shrink-0 border-r border-[#E8E5DF] bg-white px-5 py-6 md:block">
      <div className="mb-8">
        <div className="text-lg font-bold text-[#242424]">VENHO OS</div>
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8C867C]">Business Workspace</div>
      </div>
      <nav className="space-y-1">
        {items.map(({ label, href, section }) => {
          const isActive = section === activeSection;
          return (
            <Link
              key={label}
              href={href}
              className={`flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[#EAF3F7] text-[#2F6F91]"
                  : "text-[#4D4A45] hover:bg-[#F2F0EC] hover:text-[#2F6F91]"
              }`}
            >
              {isActive && (
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#2F6F91]" />
              )}
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
