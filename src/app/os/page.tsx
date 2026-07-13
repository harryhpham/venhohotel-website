/**
 * @layer interface
 * @context home
 * @owns VENHO OS root route — section router
 * @depends-on bff-home, os-components, os-sections
 * @invariant RSC reads local BFF snapshot only; no provider calls at render.
 * @invariant Section routing via ?section= query param; default = home.
 */

import HomeWorkspace from "@/components/os/home/HomeWorkspace";
import SidebarNavigation from "@/components/os/layout/SidebarNavigation";
import WorkspaceHeader from "@/components/os/layout/WorkspaceHeader";
import AgentsSection from "@/components/os/sections/AgentsSection";
import CreativeStudioSection from "@/components/os/sections/CreativeStudioSection";
import KnowledgeSection from "@/components/os/sections/KnowledgeSection";
import OperationsSection from "@/components/os/sections/OperationsSection";
import ProjectsSection from "@/components/os/sections/ProjectsSection";
import PublishingSection from "@/components/os/sections/PublishingSection";
import ReportsSection from "@/components/os/sections/ReportsSection";
import SettingsSection from "@/components/os/sections/SettingsSection";
import TasksSection from "@/components/os/sections/TasksSection";
import WorkbenchSection from "@/components/os/sections/WorkbenchSection";
import { getHomeSnapshot } from "@/bff/home/home-snapshot.query";

const SECTION_TITLES: Record<string, string> = {
  projects: "Projects",
  tasks: "Tasks",
  knowledge: "Knowledge",
  workbench: "Workbench",
  "creative-studio": "Creative Studio",
  agents: "Agents",
  operations: "Operations",
  publishing: "Publishing",
  reports: "Reports",
  settings: "Settings",
};

export const metadata = {
  title: "VENHO OS — Business Workspace",
  description: "Business Operating Workspace for Ven Hồ Hotel.",
};

export default async function VenhoOsPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section: rawSection } = await searchParams;
  const section = rawSection ?? null;
  const sectionTitle = section ? (SECTION_TITLES[section] ?? "Home Workspace") : "Home Workspace";

  const snapshot = await getHomeSnapshot();

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-[#242424]">
      <div className="flex min-h-screen">
        <SidebarNavigation activeSection={section} />
        <div className="min-w-0 flex-1">
          <WorkspaceHeader header={snapshot.header} sectionTitle={sectionTitle} />
          {renderSection(section, snapshot)}
        </div>
      </div>
    </div>
  );
}

function renderSection(
  section: string | null,
  snapshot: Awaited<ReturnType<typeof getHomeSnapshot>>,
) {
  switch (section) {
    case null:
      return <HomeWorkspace snapshot={snapshot} />;
    case "projects":
      return <ProjectsSection />;
    case "tasks":
      return <TasksSection />;
    case "knowledge":
      return <KnowledgeSection />;
    case "workbench":
      return <WorkbenchSection />;
    case "creative-studio":
      return <CreativeStudioSection />;
    case "agents":
      return <AgentsSection />;
    case "operations":
      return <OperationsSection />;
    case "publishing":
      return <PublishingSection />;
    case "reports":
      return <ReportsSection />;
    case "settings":
      return <SettingsSection />;
    default:
      return <HomeWorkspace snapshot={snapshot} />;
  }
}
