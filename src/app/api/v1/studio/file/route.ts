/**
 * GET /api/v1/studio/file?path=/absolute/path/to/image.png
 * Serves a local file so generated images can be displayed in the browser.
 * Restricted to known safe directories to prevent arbitrary file reads.
 */

import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { SOCIAL_MANAGER_DIR, VIDEO_SCRIPTS_DIR, STUDIO_DIR } from "@/lib/studio/paths";

const ALLOWED_DIRS = [SOCIAL_MANAGER_DIR, VIDEO_SCRIPTS_DIR, STUDIO_DIR];
const ALLOWED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".md", ".json"]);

export async function GET(req: NextRequest) {
  const filePath = req.nextUrl.searchParams.get("path");
  if (!filePath) return NextResponse.json({ error: "path required" }, { status: 400 });

  const resolved = path.resolve(filePath);
  const ext = path.extname(resolved).toLowerCase();

  const isAllowedDir = ALLOWED_DIRS.some((dir) => resolved.startsWith(dir));
  if (!isAllowedDir || !ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!fs.existsSync(resolved)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const data = fs.readFileSync(resolved);
  const mimeMap: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".md": "text/plain; charset=utf-8",
    ".json": "application/json",
  };

  return new Response(data, {
    headers: {
      "Content-Type": mimeMap[ext] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
