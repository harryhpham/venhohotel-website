"use client";

import { useState, useEffect, useCallback } from "react";
import LiveLog, { type LogLine } from "@/components/os/workbench/LiveLog";
import { Field, PrimaryBtn, SectionHeader, TabBar, inputCls } from "@/components/os/shared/ui";

// ── types ─────────────────────────────────────────────────────────────────────

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

interface SearchResult {
  subject: string;
  file: string;
  lineNumber: number;
  line: string;
  context: string[];
}


// ── DNA section parser ────────────────────────────────────────────────────────

type DnaBlock = { heading: string; items: string[] };

function parseDnaCompact(content: string): { meta: string; blocks: DnaBlock[] } {
  const lines = content.split("\n");
  let meta = "";
  const blocks: DnaBlock[] = [];
  let current: DnaBlock | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) blocks.push(current);
      current = { heading: line.replace("## ", ""), items: [] };
    } else if (line.startsWith("# ") || line.startsWith("_")) {
      meta += line + " ";
    } else if (line.startsWith("- ") && current) {
      current.items.push(line.slice(2));
    }
  }
  if (current) blocks.push(current);
  return { meta: meta.trim(), blocks };
}

function blockColor(heading: string): string {
  if (heading.includes("INVARIANT")) return "border-[#2F6F91] bg-[#F0F7FF]";
  if (heading.includes("FORBIDDEN")) return "border-[#C96A5C] bg-[#FFF5F5]";
  if (heading.includes("ALLOWED")) return "border-[#5F8F6F] bg-[#F0FFF4]";
  return "border-[#E8E5DF] bg-[#F8F7F4]";
}

function blockTextColor(heading: string): string {
  if (heading.includes("INVARIANT")) return "text-[#1A4F72]";
  if (heading.includes("FORBIDDEN")) return "text-[#8A2A1A]";
  if (heading.includes("ALLOWED")) return "text-[#2A5C3F]";
  return "text-[#242424]";
}

// ── DNA Library tab ───────────────────────────────────────────────────────────

function DnaLibraryTab() {
  const [subjects, setSubjects] = useState<SubjectMeta[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [dnaContent, setDnaContent] = useState<string>("");
  const [dnaManifest, setDnaManifest] = useState<SubjectMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    fetch("/api/v1/studio/dna")
      .then((r) => r.json())
      .then((d) => {
        setSubjects(d.subjects ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadSubject = useCallback(async (subject: string) => {
    setSelectedSubject(subject);
    setContentLoading(true);
    setDnaContent("");
    setDnaManifest(null);
    try {
      const res = await fetch(`/api/v1/studio/dna?subject=${encodeURIComponent(subject)}`);
      const data = await res.json();
      setDnaContent(data.content ?? "");
      setDnaManifest(data.manifest ?? null);
    } catch {
      setDnaContent("Lỗi khi đọc DNA file.");
    }
    setContentLoading(false);
  }, []);

  function formatDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  const parsed = dnaContent ? parseDnaCompact(dnaContent) : null;

  return (
    <div className="flex gap-6">
      {/* Left: subject list */}
      <div className="w-56 shrink-0">
        <div className="rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E8E5DF]">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8C867C]">DNA Subjects</span>
          </div>
          {loading ? (
            <div className="px-4 py-6 text-sm text-[#8C867C]">Đang tải…</div>
          ) : subjects.length === 0 ? (
            <div className="px-4 py-6 text-sm text-[#8C867C]">Không có DNA nào.</div>
          ) : (
            <ul>
              {subjects.map((s) => (
                <li key={s.subject}>
                  <button
                    onClick={() => loadSubject(s.subject)}
                    className={`w-full text-left px-4 py-3 text-sm border-b border-[#E8E5DF] last:border-0 transition-colors ${
                      selectedSubject === s.subject
                        ? "bg-[#2F6F91] text-white font-semibold"
                        : "text-[#242424] hover:bg-white"
                    }`}
                  >
                    <div className="font-medium">{s.subject.replace(/_/g, " ")}</div>
                    <div className={`text-xs mt-0.5 ${selectedSubject === s.subject ? "text-blue-200" : "text-[#8C867C]"}`}>
                      v{s.version} · {s.imageCount} ảnh
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right: DNA content */}
      <div className="flex-1 min-w-0">
        {!selectedSubject ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[#E8E5DF] text-[#8C867C] text-sm">
            ← Chọn một subject để xem DNA
          </div>
        ) : contentLoading ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-[#E8E5DF] text-[#8C867C] text-sm">
            Đang tải DNA…
          </div>
        ) : (
          <div className="space-y-4">
            {/* Manifest bar */}
            {dnaManifest && (
              <div className="rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] px-5 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#6B6B6B]">
                <span><strong className="text-[#242424]">Subject:</strong> {dnaManifest.subject}</span>
                <span><strong className="text-[#242424]">Version:</strong> {dnaManifest.version}</span>
                <span><strong className="text-[#242424]">Provider:</strong> {dnaManifest.provider} / {dnaManifest.model}</span>
                <span><strong className="text-[#242424]">Generated:</strong> {formatDate(dnaManifest.generated_at)}</span>
                <span><strong className="text-[#242424]">Images:</strong> {dnaManifest.imageCount}</span>
                {dnaManifest.overlayApplied && (
                  <span className="rounded-full bg-[#2F6F91] px-2 py-0.5 text-white font-semibold">overlay ✓</span>
                )}
              </div>
            )}

            {/* Parsed DNA blocks */}
            {parsed?.blocks.map((block) => (
              <div key={block.heading} className={`rounded-xl border ${blockColor(block.heading)} overflow-hidden`}>
                <div className={`px-5 py-2.5 border-b ${blockColor(block.heading).split(" ")[0]}`}>
                  <span className={`text-sm font-bold ${blockTextColor(block.heading)}`}>{block.heading}</span>
                </div>
                <ul className="px-5 py-3 space-y-1">
                  {block.items.filter(Boolean).map((item, i) => (
                    <li key={i} className={`text-sm ${blockTextColor(block.heading)}`}>
                      {item.includes("**") ? (
                        <span dangerouslySetInnerHTML={{
                          __html: item.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code class="bg-black/10 px-1 rounded text-xs">$1</code>')
                        }} />
                      ) : (
                        <span>{item}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {!parsed?.blocks.length && dnaContent && (
              <pre className="rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] p-4 text-xs text-[#242424] overflow-x-auto whitespace-pre-wrap">
                {dnaContent}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Vault Search tab ──────────────────────────────────────────────────────────

function VaultSearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function search() {
    if (!query.trim() || query.trim().length < 2) return;
    setSearching(true);
    setSearched(false);
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/v1/studio/vault-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Lỗi"); } else { setResults(data.results ?? []); }
    } catch {
      setError("Network error");
    }
    setSearching(false);
    setSearched(true);
  }

  // Group results by subject
  const grouped: Record<string, SearchResult[]> = {};
  for (const r of results) {
    if (!grouped[r.subject]) grouped[r.subject] = [];
    grouped[r.subject].push(r);
  }

  function highlight(text: string, q: string) {
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 rounded px-0.5">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Vault Search"
        caption="Tìm kiếm toàn văn trong tất cả DNA files của dự án."
      />
      <div className="flex gap-3">
        <input
          className={inputCls + " flex-1"}
          placeholder="vd: black aluminum, no marble, boutique…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <PrimaryBtn onClick={search} disabled={searching || query.trim().length < 2}>
          {searching ? "Đang tìm…" : "🔍 Tìm"}
        </PrimaryBtn>
      </div>

      {error && <p className="text-sm text-[#C96A5C]">{error}</p>}

      {searched && results.length === 0 && !error && (
        <div className="rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] px-5 py-8 text-center text-sm text-[#8C867C]">
          Không tìm thấy kết quả cho &ldquo;{query}&rdquo;
        </div>
      )}

      {Object.keys(grouped).map((subject) => (
        <div key={subject} className="rounded-xl border border-[#E8E5DF] overflow-hidden">
          <div className="bg-[#F0F7FF] border-b border-[#E8E5DF] px-5 py-2.5 flex items-center gap-2">
            <span className="text-sm font-bold text-[#1A4F72]">{subject.replace(/_/g, " ")}</span>
            <span className="text-xs text-[#6B6B6B] ml-auto">{grouped[subject].length} kết quả</span>
          </div>
          <ul className="divide-y divide-[#F0F0F0]">
            {grouped[subject].map((r, i) => (
              <li key={i} className="px-5 py-3">
                <div className="text-xs text-[#8C867C] mb-1">
                  {r.file.includes("_COMPACT") ? "COMPACT" : "FULL"} · dòng {r.lineNumber}
                </div>
                <div className="text-sm text-[#242424] font-mono bg-[#F8F7F4] rounded px-3 py-1.5">
                  {highlight(r.line, query)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ── Mode C — Linh An DNA Studio ───────────────────────────────────────────────

async function runSSE(
  endpoint: string,
  body: object,
  onLine: (l: LogLine) => void,
  onDone: (code: number) => void,
) {
  const resp = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!resp.ok || !resp.body) {
    const err = await resp.text().catch(() => "Network error");
    onLine({ text: `Error: ${err}`, err: true });
    onDone(-1);
    return;
  }
  const reader = resp.body.getReader();
  const dec = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const chunk of chunks) {
      const dataLine = chunk.split("\n").find((l) => l.startsWith("data: "));
      if (!dataLine) continue;
      try {
        const data = JSON.parse(dataLine.slice(6)) as { line?: string; err?: boolean; done?: boolean; code?: number };
        if (data.line) onLine({ text: data.line, err: data.err });
        if (data.done) onDone(data.code ?? -1);
      } catch { /* ignore */ }
    }
  }
}

const LINH_AN_WARDROBE_SUBJECTS = [
  "sport_active",
  "cafe_girl",
  "west_lake_sunset",
  "street_style",
  "business_travel",
  "casual_morning",
];

function ModeCTab() {
  const [subject, setSubject] = useState("cafe_girl");
  const [subjectManual, setSubjectManual] = useState("");
  const [inputDir, setInputDir] = useState("");
  const [dnaVersion, setDnaVersion] = useState("1.0");
  const [confirmed, setConfirmed] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const resolvedSubject = subjectManual.trim() || subject;
  const defaultInput = `data/projects/linh_an/wardrobe/${resolvedSubject}`;

  async function run() {
    if (!resolvedSubject || !confirmed) return;
    const dir = inputDir.trim() || defaultInput;
    setLogs([]);
    setRunning(true);
    setStatus("idle");

    await runSSE(
      "/api/v1/studio/observe",
      {
        mode: "b",
        project: "linh_an",
        subject: resolvedSubject,
        inputDir: dir,
        dnaVersion,
      },
      (l) => setLogs((prev) => [...prev, l]),
      (code) => {
        setRunning(false);
        setStatus(code === 0 ? "ok" : "error");
      },
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Mode C — Linh An DNA Studio"
        caption="Upload outfit images → tạo LINH_AN_{OUTFIT}_DNA.md cho wardrobe library."
      />

      <div className="rounded-xl border border-[#FFF6E4] bg-[#FFF6E4] px-5 py-4">
        <p className="text-sm font-semibold text-[#8A621A] mb-1">Wardrobe DNA System</p>
        <p className="text-xs text-[#8A621A]">
          Mỗi outfit là 1 project/subject trong linh_an. Ảnh nguồn đặt trong{" "}
          <code className="bg-yellow-100 px-1 rounded">data/projects/linh_an/wardrobe/{'{'}{resolvedSubject}{'}'}/</code>{" "}
          trong thư mục venho-ai-studio.
        </p>
      </div>

      <Field label="Wardrobe Subject">
        <select className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)}>
          {LINH_AN_WARDROBE_SUBJECTS.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </Field>

      <Field label="Hoặc nhập subject khác (ghi đè)">
        <input
          className={inputCls}
          value={subjectManual}
          onChange={(e) => setSubjectManual(e.target.value)}
          placeholder="vd: hanbok_special"
        />
      </Field>

      <Field label={`Folder ảnh input (để trống = ${defaultInput})`}>
        <input
          className={inputCls}
          value={inputDir}
          onChange={(e) => setInputDir(e.target.value)}
          placeholder={defaultInput}
        />
      </Field>

      <Field label="DNA Version">
        <input className={inputCls} value={dnaVersion} onChange={(e) => setDnaVersion(e.target.value)} />
      </Field>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#FFF6E4] bg-[#FFF6E4] p-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-sm text-[#8A621A]">
          Xác nhận: folder chỉ chứa ảnh của outfit <strong>{resolvedSubject}</strong> — 1 outfit = 1 folder
        </span>
      </label>

      <div className="flex items-center gap-3">
        <PrimaryBtn onClick={run} disabled={running || !confirmed}>
          {running ? "Đang tạo DNA…" : "▶ Build Linh An DNA"}
        </PrimaryBtn>
        {status === "ok" && <span className="text-sm font-semibold text-[#5F8F6F]">✓ DNA đã tạo</span>}
        {status === "error" && <span className="text-sm font-semibold text-[#C96A5C]">✗ Lỗi</span>}
      </div>

      <LiveLog lines={logs} running={running} />
    </div>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────────────────

type Tab = "DNA Library" | "Vault Search" | "Mode C — Linh An";
const TABS = ["DNA Library", "Vault Search", "Mode C — Linh An"] as const;

// ── Section root ──────────────────────────────────────────────────────────────

export default function KnowledgeSection() {
  const [tab, setTab] = useState<Tab>("DNA Library");

  return (
    <div className="p-8">
      <div className="rounded-2xl border border-[#E8E5DF] bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <TabBar tabs={TABS} active={tab} onSelect={setTab} />
        {tab === "DNA Library" && <DnaLibraryTab />}
        {tab === "Vault Search" && <VaultSearchTab />}
        {tab === "Mode C — Linh An" && <ModeCTab />}
      </div>
    </div>
  );
}
