import SidebarNavigation, { isOSSection, type OSSection } from "@/components/os/layout/SidebarNavigation";
import HomeWorkspace from "@/components/os/home/HomeWorkspace";
import HermesNousSection from "@/components/os/sections/hermes-nous/HermesNousSection";
import LunaSection from "@/components/os/sections/luna/LunaSection";

export default async function OSPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const params = await searchParams;
  const requestedSection = params.section || "";
  const section: OSSection = isOSSection(requestedSection) ? requestedSection : "home";
  return (
    <main className="os-shell">
      <div className="os-layout">
        <SidebarNavigation activeSection={section} />
        <div className="os-content">
          {section === "home" ? <HomeWorkspace /> : null}
          {section === "hermes-nous" ? (
            <HermesNousSection />
          ) : section === "luna" ? (
            <LunaSection />
          ) : null}
        </div>
      </div>
    </main>
  );
}
