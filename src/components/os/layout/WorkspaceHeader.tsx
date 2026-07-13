/**
 * @layer interface
 * @context dashboard-layout
 * @owns Workspace header presentation
 * @depends-on bff-dto
 * @invariant Dumb component; no business logic and no provider calls.
 */

import type { WorkspaceHeaderDto } from "@/bff/home/home-snapshot.dto";

export default function WorkspaceHeader({
  header,
  sectionTitle = "Home Workspace",
}: {
  header: WorkspaceHeaderDto;
  sectionTitle?: string;
}) {
  return (
    <header className="grid min-h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-6 border-b border-[#E8E5DF] bg-white px-8">
      <div>
        <div className="text-lg font-bold text-[#242424]">VENHO OS</div>
        <div className="text-sm font-medium text-[#6B6B6B]">{sectionTitle}</div>
      </div>
      <div className="rounded-full bg-[#EAF3F7] px-4 py-2 text-sm font-semibold text-[#2F6F91]">
        {header.propertyName}
      </div>
      <div className="flex items-center justify-end gap-4 text-sm text-[#6B6B6B]">
        <span>Last Sync {header.lastSyncLabel}</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F2F0EC] font-bold text-[#2F6F91]">!</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F2F0EC] font-bold text-[#2F6F91]">U</span>
      </div>
    </header>
  );
}
