import LunaOverview from "@/components/os/sections/luna/LunaOverview";
import type { LunaOverviewSnapshot } from "@/bff/luna/luna.dto";

export default function LunaHealthPanel({ overview }: { overview: LunaOverviewSnapshot | null }) {
  return <LunaOverview overview={overview} />;
}
