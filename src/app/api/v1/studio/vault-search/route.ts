/**
 * POST /api/v1/studio/vault-search
 * Body: { query: string }
 * Returns: { results: SearchResult[] }
 *
 * SearchResult: { subject, file, lineNumber, line, context: string[] }
 * Searches across all *_DNA*.md files in DNA_COMPACT_DIR.
 */

import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { DNA_COMPACT_DIR } from "@/lib/studio/paths";

interface SearchResult {
  subject: string;
  file: string;
  lineNumber: number;
  line: string;
  context: string[];
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const query = (body?.query ?? "").trim().toLowerCase();
  if (!query) {
    return NextResponse.json({ error: "query required" }, { status: 400 });
  }
  if (query.length < 2) {
    return NextResponse.json({ error: "query too short" }, { status: 400 });
  }

  if (!fs.existsSync(DNA_COMPACT_DIR)) {
    return NextResponse.json({ results: [] });
  }

  // Only search *_DNA_COMPACT.md and *_DNA.md files (not manifests, not archives)
  const mdFiles = fs
    .readdirSync(DNA_COMPACT_DIR)
    .filter((f) => f.endsWith(".md") && f.startsWith("VENHO_HOTEL_"));

  const results: SearchResult[] = [];
  const CONTEXT_LINES = 1;

  for (const filename of mdFiles) {
    const filePath = path.join(DNA_COMPACT_DIR, filename);
    // Derive subject from filename: VENHO_HOTEL_{SUBJECT}_DNA.md
    const subjectMatch = filename.match(/^VENHO_HOTEL_(.+?)(?:_COMPACT)?_DNA\.md$/);
    const subject = subjectMatch ? subjectMatch[1].toLowerCase() : filename;

    let lines: string[];
    try {
      lines = fs.readFileSync(filePath, "utf-8").split("\n");
    } catch {
      continue;
    }

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(query)) {
        const start = Math.max(0, i - CONTEXT_LINES);
        const end = Math.min(lines.length - 1, i + CONTEXT_LINES);
        results.push({
          subject,
          file: filename,
          lineNumber: i + 1,
          line: lines[i],
          context: lines.slice(start, end + 1),
        });
      }
    }
  }

  // Deduplicate: if both COMPACT and full .md match same line, keep COMPACT
  const seen = new Set<string>();
  const deduped = results.filter((r) => {
    const key = `${r.subject}:${r.lineNumber}:${r.line}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: COMPACT files first, then by subject
  deduped.sort((a, b) => {
    const aIsCompact = a.file.includes("_COMPACT");
    const bIsCompact = b.file.includes("_COMPACT");
    if (aIsCompact !== bIsCompact) return aIsCompact ? -1 : 1;
    return a.subject.localeCompare(b.subject);
  });

  return NextResponse.json({ results: deduped.slice(0, 100) });
}
