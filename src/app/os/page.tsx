import SidebarNavigation from "@/components/os/layout/SidebarNavigation";
import HermesNousSection from "@/components/os/sections/hermes-nous/HermesNousSection";
import LunaSection from "@/components/os/sections/luna/LunaSection";

export default async function OSPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const params = await searchParams;
  const section = params.section || "home";
  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#1A1A1A]">
      <div className="grid min-h-screen md:grid-cols-[220px_1fr]">
        <SidebarNavigation activeSection={section} />
        <div className="p-4 md:p-6">
          {section === "hermes-nous" ? (
            <HermesNousSection />
          ) : section === "luna" ? (
            <LunaSection />
          ) : (
            <section className="rounded border border-[#D9D9D9] bg-white p-5">
              <h1 className="text-xl font-semibold">VENHO OS</h1>
              <p className="mt-2 text-sm text-[#6B6B6B]">Select Hermes Nous or Luna Control from the sidebar.</p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
