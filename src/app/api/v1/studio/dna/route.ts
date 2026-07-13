/**
 * GET /api/v1/studio/dna
 *   → { subjects: SubjectMeta[] }
 *
 * GET /api/v1/studio/dna?subject=lake_view_room
 *   → { subject, content: string, manifest: object }
 *
 * SubjectMeta: { subject, version, generated_at, provider, imageCount, hasCompact }
 */

import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { DNA_COMPACT_DIR } from "@/lib/studio/paths";

interface SubjectMeta {
  subject: string;
  version: string;
  generated_at: string;
  provider: string;
  model: string;
  imageCount: number;
  hasCompact: boolean;
  overlayApplied: boolean;
}

function readManifest(subject: string): SubjectMeta | null {
  const manifestPath = path.join(DNA_COMPACT_DIR, `dna_manifest_${subject}.json`);
  if (!fs.existsSync(manifestPath)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    return {
      subject: raw.subject ?? subject,
      version: raw.current_version ?? "?",
      generated_at: raw.generated_at ?? "",
      provider: raw.provider ?? "?",
      model: raw.model ?? "?",
      imageCount: (raw.source_hashes ?? []).length,
      hasCompact: fs.existsSync(path.join(DNA_COMPACT_DIR, `VENHO_HOTEL_${subject.toUpperCase()}_DNA_COMPACT.md`)),
      overlayApplied: raw.overlay_applied ?? false,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const subject = req.nextUrl.searchParams.get("subject");

  if (!subject) {
    // List all subjects
    if (!fs.existsSync(DNA_COMPACT_DIR)) {
      return NextResponse.json({ subjects: [] });
    }
    const manifests = fs
      .readdirSync(DNA_COMPACT_DIR)
      .filter((f) => f.startsWith("dna_manifest_") && f.endsWith(".json"))
      .map((f) => f.replace("dna_manifest_", "").replace(".json", ""))
      .map(readManifest)
      .filter(Boolean) as SubjectMeta[];

    manifests.sort((a, b) => a.subject.localeCompare(b.subject));
    return NextResponse.json({ subjects: manifests });
  }

  // Single subject — return compact .md content + manifest
  const subjectUpper = subject.toUpperCase();
  const compactPath = path.join(DNA_COMPACT_DIR, `VENHO_HOTEL_${subjectUpper}_DNA_COMPACT.md`);
  const fullPath = path.join(DNA_COMPACT_DIR, `VENHO_HOTEL_${subjectUpper}_DNA.md`);

  // Security: must stay inside DNA_COMPACT_DIR
  const resolvedCompact = path.resolve(compactPath);
  const resolvedFull = path.resolve(fullPath);
  if (!resolvedCompact.startsWith(DNA_COMPACT_DIR) && !resolvedFull.startsWith(DNA_COMPACT_DIR)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  let content = "";
  if (fs.existsSync(resolvedCompact)) {
    content = fs.readFileSync(resolvedCompact, "utf-8");
  } else if (fs.existsSync(resolvedFull)) {
    content = fs.readFileSync(resolvedFull, "utf-8");
  } else {
    return NextResponse.json({ error: "DNA not found" }, { status: 404 });
  }

  const manifest = readManifest(subject);
  return NextResponse.json({ subject, content, manifest });
}
