const sections = [
  { id: "home", label: "Home" },
  { id: "hermes-nous", label: "Hermes Nous" },
  { id: "luna", label: "Luna Control" },
] as const;

export type OSSection = (typeof sections)[number]["id"];

export function isOSSection(section: string): section is OSSection {
  return sections.some(({ id }) => id === section);
}

export default function SidebarNavigation({ activeSection }: { activeSection: OSSection }) {
  return (
    <aside className="border-b border-[#D9D9D9] bg-white md:sticky md:top-0 md:h-screen md:border-r md:border-b-0">
      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:p-4">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`/os?section=${section.id}`}
            aria-current={activeSection === section.id ? "page" : undefined}
            className={`whitespace-nowrap rounded px-3 py-2 text-sm ${
              activeSection === section.id ? "bg-[#1B2D4F] text-white" : "text-[#1A1A1A] hover:bg-[#F7F4EF]"
            }`}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
