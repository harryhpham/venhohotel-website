"use client";

import { useState } from "react";
import LiveLog, { type LogLine } from "@/components/os/workbench/LiveLog";
import { KNOWN_SUBJECTS } from "@/lib/studio/constants";
import { Field, PrimaryBtn, SectionHeader, inputCls } from "@/components/os/shared/ui";

// ── SSE runner ────────────────────────────────────────────────────────────────

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
      } catch { /* ignore parse errors */ }
    }
  }
}

// ── Mode A ────────────────────────────────────────────────────────────────────

function ModeAForm() {
  const [inputDir, setInputDir] = useState("data/projects/_inbox/media");
  const [outputDir, setOutputDir] = useState("");
  const [provider, setProvider] = useState("mock");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  async function run() {
    if (!inputDir.trim()) return;
    setLogs([]);
    setRunning(true);
    setStatus("idle");

    const body: Record<string, string> = { mode: "a", inputDir: inputDir.trim() };
    if (outputDir.trim()) body.outputDir = outputDir.trim();
    if (provider !== "config") body.provider = provider;

    await runSSE(
      "/api/v1/studio/observe",
      body,
      (l) => setLogs((prev) => [...prev, l]),
      (code) => {
        setRunning(false);
        setStatus(code === 0 ? "ok" : "error");
      },
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Mode A — Observe"
        caption="Mỗi ảnh → 1 file quan sát .md + .json. Không tạo DNA."
      />
      <Field label="Folder ảnh input (path tuyệt đối hoặc relative từ venho-ai-studio)">
        <input className={inputCls} value={inputDir} onChange={(e) => setInputDir(e.target.value)} />
      </Field>
      <Field label="Folder output (để trống = mặc định)">
        <input className={inputCls} value={outputDir} onChange={(e) => setOutputDir(e.target.value)} placeholder="Để trống = data/projects/_inbox/output" />
      </Field>
      <Field label="Provider">
        <select className={inputCls} value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="mock">mock (offline test)</option>
          <option value="openai">openai</option>
          <option value="claude">claude</option>
          <option value="config">config mặc định</option>
        </select>
      </Field>
      <div className="flex items-center gap-3">
        <PrimaryBtn onClick={run} disabled={running}>
          {running ? "Đang chạy…" : "▶ Chạy Mode A"}
        </PrimaryBtn>
        {status === "ok" && <span className="text-sm font-semibold text-[#5F8F6F]">✓ Xong</span>}
        {status === "error" && <span className="text-sm font-semibold text-[#C96A5C]">✗ Lỗi</span>}
      </div>
      <LiveLog lines={logs} running={running} />
    </div>
  );
}

// ── Mode B ────────────────────────────────────────────────────────────────────

function ModeBForm() {
  const [project, setProject] = useState("venho_hotel");
  const [subject, setSubject] = useState("lake_view_room");
  const [subjectManual, setSubjectManual] = useState("");
  const [inputDir, setInputDir] = useState("");
  const [dnaVersion, setDnaVersion] = useState("1.0");
  const [provider, setProvider] = useState("mock");
  const [confirmed, setConfirmed] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");

  const resolvedSubject = subjectManual.trim() || subject;
  const defaultInput = `data/projects/${project}/media/${resolvedSubject}`;

  async function run() {
    if (!resolvedSubject || !confirmed) return;
    const dir = inputDir.trim() || defaultInput;
    setLogs([]);
    setRunning(true);
    setStatus("idle");

    const body: Record<string, string> = {
      mode: "b",
      project,
      subject: resolvedSubject,
      inputDir: dir,
      dnaVersion,
    };
    if (provider !== "config") body.provider = provider;

    await runSSE(
      "/api/v1/studio/observe",
      body,
      (l) => setLogs((prev) => [...prev, l]),
      (code) => {
        setRunning(false);
        setStatus(code === 0 ? "ok" : "error");
      },
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Mode B — Build DNA"
        caption="Nhiều ảnh cùng 1 subject → DNA .md + .json. §2.1: 1 folder = 1 tier/subject."
      />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Project">
          <input className={inputCls} value={project} onChange={(e) => setProject(e.target.value)} />
        </Field>
        <Field label="DNA Version">
          <input className={inputCls} value={dnaVersion} onChange={(e) => setDnaVersion(e.target.value)} />
        </Field>
      </div>
      <Field label="Subject">
        <select className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)}>
          {KNOWN_SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Hoặc nhập subject khác (ghi đè dropdown)">
        <input className={inputCls} value={subjectManual} onChange={(e) => setSubjectManual(e.target.value)} placeholder="vd: new_room_type" />
      </Field>
      <Field label={`Folder ảnh input (để trống = ${defaultInput})`}>
        <input className={inputCls} value={inputDir} onChange={(e) => setInputDir(e.target.value)} placeholder={defaultInput} />
      </Field>
      <Field label="Provider">
        <select className={inputCls} value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="mock">mock (offline test)</option>
          <option value="openai">openai</option>
          <option value="claude">claude</option>
          <option value="config">config mặc định</option>
        </select>
      </Field>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#FFF6E4] bg-[#FFF6E4] p-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-sm text-[#8A621A]">
          Xác nhận (v2.4 §2.1): folder này chỉ chứa ảnh của 1 tier/subject duy nhất
        </span>
      </label>
      <div className="flex items-center gap-3">
        <PrimaryBtn onClick={run} disabled={running || !confirmed}>
          {running ? "Đang chạy…" : "▶ Chạy Mode B"}
        </PrimaryBtn>
        {status === "ok" && <span className="text-sm font-semibold text-[#5F8F6F]">✓ DNA đã tạo</span>}
        {status === "error" && <span className="text-sm font-semibold text-[#C96A5C]">✗ Lỗi</span>}
      </div>
      <LiveLog lines={logs} running={running} />
    </div>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────────────────

import { TabBar } from "@/components/os/shared/ui";

type Tab = "Mode A" | "Mode B";
const TABS = ["Mode A", "Mode B"] as const;

// ── Section root ──────────────────────────────────────────────────────────────

export default function WorkbenchSection() {
  const [tab, setTab] = useState<Tab>("Mode A");

  return (
    <div className="p-8">
      <div className="rounded-2xl border border-[#E8E5DF] bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <TabBar tabs={TABS} active={tab} onSelect={setTab} />
        {tab === "Mode A" && <ModeAForm />}
        {tab === "Mode B" && <ModeBForm />}
      </div>
    </div>
  );
}
