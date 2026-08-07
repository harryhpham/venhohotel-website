import { NextResponse } from "next/server";

import { getHermesNousRuntimeStatus } from "@/bff/hermes-nous/hermes-nous.query";

export async function GET() {
  const status = await getHermesNousRuntimeStatus();
  return NextResponse.json(status, { status: status.status === "ok" ? 200 : 503 });
}
