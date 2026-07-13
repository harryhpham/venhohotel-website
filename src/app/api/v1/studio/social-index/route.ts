/**
 * GET /api/v1/studio/social-index
 * Returns social post history from VenHoSocialManager/database/index.json.
 * Response: { entries: SocialEntry[], lastUpdated: string }
 */

import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { SOCIAL_MANAGER_DIR } from "@/lib/studio/paths";

interface SocialEntry {
  date: string;
  title: string;
  pillar_name?: string;
  topic_title?: string;
  funnel_stage?: string;
  score?: number;
  status: string;
  folder: string;
  drive_url?: string;
  source?: string;
}

export async function GET() {
  const indexPath = path.join(SOCIAL_MANAGER_DIR, "database", "index.json");

  if (!fs.existsSync(indexPath)) {
    return NextResponse.json({ entries: [], lastUpdated: null });
  }

  try {
    const raw = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
    // Support both { entries: [] } and [] formats
    const entries: SocialEntry[] = Array.isArray(raw) ? raw : (raw.entries ?? []);

    // Sort newest first
    entries.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

    const stat = fs.statSync(indexPath);
    return NextResponse.json({
      entries,
      lastUpdated: stat.mtime.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to read index" }, { status: 500 });
  }
}
