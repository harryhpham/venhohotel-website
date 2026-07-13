/**
 * POST /api/v1/studio/generate-image
 * Runs generate_image.py and returns the output image path.
 * Local-only — requires OPENAI_API_KEY in .env.local
 *
 * Body: { prompt: string, outputRel: string, size: "portrait"|"square"|"story", hasLinhAn: boolean, useRef?: boolean }
 * Response: { ok: true, imagePath: string } | { ok: false, error: string }
 */

import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { NextRequest, NextResponse } from "next/server";
import { SOCIAL_MANAGER_DIR, VENHO_PATH } from "@/lib/studio/paths";

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.prompt || !body?.outputRel || !body?.size) {
    return NextResponse.json({ ok: false, error: "prompt, outputRel, size required" }, { status: 400 });
  }

  const { prompt, outputRel, size, hasLinhAn = false, useRef = true } = body as {
    prompt: string;
    outputRel: string;
    size: string;
    hasLinhAn: boolean;
    useRef?: boolean;
  };

  // Prevent path traversal
  const safeRel = path.normalize(outputRel).replace(/^(\.\.\/)+/, "");

  const args = ["generate_image.py", prompt, safeRel, size];
  if (hasLinhAn && useRef) {
    args.push("--ref", "assets/linh-an-master-face.png");
  }

  try {
    const { stdout, stderr } = await execFileAsync("python3", args, {
      cwd: SOCIAL_MANAGER_DIR,
      env: { ...process.env, PATH: VENHO_PATH },
      timeout: 300_000,
    });

    const imagePath = path.join(SOCIAL_MANAGER_DIR, safeRel, "image.png");
    const imageExists = fs.existsSync(imagePath);

    return NextResponse.json({
      ok: imageExists,
      imagePath: imageExists ? imagePath : null,
      stdout,
      stderr: stderr || undefined,
      error: imageExists ? undefined : "Image file not found after generation",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
