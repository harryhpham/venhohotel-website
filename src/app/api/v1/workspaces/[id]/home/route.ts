/**
 * @layer interface
 * @context home-api
 * @owns GET /api/v1/workspaces/{id}/home
 * @depends-on bff-home
 * @invariant API returns BFF read model; no external call and no metric calculation.
 * @invariant Stage 0 auth: bearer token check against VENHO_OS_API_SECRET env var.
 *            Replace with full workspace-scoped authZ in Stage 1 (PLAN §15.1).
 */

import { NextRequest, NextResponse } from "next/server";
import { getHomeSnapshot } from "@/bff/home/home-snapshot.query";

export async function GET(req: NextRequest) {
  // Stage 0 auth guard — workspace authZ added in Stage 1 (PLAN §15.1)
  const secret = process.env.VENHO_OS_API_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (token !== secret) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
  }

  const snapshot = await getHomeSnapshot();
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "no-store" },
  });
}
