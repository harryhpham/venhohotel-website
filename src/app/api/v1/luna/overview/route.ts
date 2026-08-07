import { NextResponse } from "next/server";

import { getLunaOverviewSnapshot } from "@/bff/luna/luna.query";
import { requireLunaPermission } from "@/bff/luna/luna.rbac";

export async function GET() {
  const denied = requireLunaPermission("GET");
  if (denied) return denied;
  return NextResponse.json(await getLunaOverviewSnapshot());
}
