/**
 * POST /api/v1/studio/save-script
 * Saves a video script markdown file and returns the next script number.
 *
 * POST body: { content: string, filename: string } — saves the script
 * GET — returns { nextNum: number }
 */

import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { VIDEO_SCRIPTS_DIR } from "@/lib/studio/paths";

function getNextScriptNum(): number {
  if (!fs.existsSync(VIDEO_SCRIPTS_DIR)) return 6;
  const files = fs.readdirSync(VIDEO_SCRIPTS_DIR).filter((f) => f.endsWith(".md"));
  const nums = files
    .map((f) => parseInt(f.split("-")[0], 10))
    .filter((n) => !isNaN(n));
  return nums.length > 0 ? Math.max(...nums) + 1 : 6;
}

export async function GET() {
  return NextResponse.json({ nextNum: getNextScriptNum() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.content || !body?.filename) {
    return NextResponse.json({ ok: false, error: "content and filename required" }, { status: 400 });
  }

  // Prevent path traversal
  const filename = path.basename(body.filename as string);
  if (!filename.endsWith(".md")) {
    return NextResponse.json({ ok: false, error: "Only .md files allowed" }, { status: 400 });
  }

  fs.mkdirSync(VIDEO_SCRIPTS_DIR, { recursive: true });
  const outPath = path.join(VIDEO_SCRIPTS_DIR, filename);
  fs.writeFileSync(outPath, body.content as string, "utf-8");

  return NextResponse.json({ ok: true, savedTo: outPath });
}
