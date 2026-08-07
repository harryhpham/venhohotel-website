const sections = [
  { id: "home", label: "Home" },
  { id: "agents", label: "Agents" },
  { id: "operations", label: "Operations" },
  { id: "hermes-nous", label: "Hermes Nous" },
  { id: "luna", label: "Luna Control" },
];

export default function SidebarNavigation({ activeSection }: { activeSection: string }) {
  return (
    <aside className="border-r border-[#D9D9D9] bg-white">
      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:p-4">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`/os?section=${section.id}`}
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
