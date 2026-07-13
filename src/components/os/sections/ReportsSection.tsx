"use client";

import { useState, useEffect } from "react";
import { SectionHeader, TabBar } from "@/components/os/shared/ui";

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

// ── shared UI ────────────────────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}

function statusBadge(status: string) {
  switch (status) {
    case "pending_review": return <Badge label="Chờ duyệt" color="bg-yellow-100 text-yellow-800" />;
    case "published": return <Badge label="Đã đăng" color="bg-green-100 text-green-800" />;
    case "draft": return <Badge label="Draft" color="bg-gray-100 text-gray-600" />;
    default: return <Badge label={status} color="bg-gray-100 text-gray-600" />;
  }
}

// ── DNA Status tab ────────────────────────────────────────────────────────────

function DnaStatusTab() {
  const [subjects, setSubjects] = useState<SubjectMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/studio/dna")
      .then((r) => r.json())
      .then((d) => {
        setSubjects(d.subjects ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function formatDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // Summary stats
  const totalImages = subjects.reduce((s, x) => s + x.imageCount, 0);
  const withOverlay = subjects.filter((s) => s.overlayApplied).length;
  const withCompact = subjects.filter((s) => s.hasCompact).length;

  return (
    <div className="space-y-5">
      <SectionHeader title="DNA Status" caption="Trạng thái Knowledge Base — tất cả subjects đã có DNA." />

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Subjects", value: subjects.length, sub: "đã có DNA" },
          { label: "Ảnh nguồn", value: totalImages, sub: "tổng cộng" },
          { label: "Overlay", value: withOverlay, sub: "có curated overlay" },
          { label: "Compact", value: withCompact, sub: "có COMPACT.md" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] px-4 py-4">
            <div className="text-2xl font-bold text-[#2F6F91]">{loading ? "…" : card.value}</div>
            <div className="text-sm font-semibold text-[#242424] mt-0.5">{card.label}</div>
            <div className="text-xs text-[#8C867C]">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Subject table */}
      {loading ? (
        <div className="rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] px-5 py-10 text-center text-sm text-[#8C867C]">
          Đang tải…
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E8E5DF]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E5DF] bg-[#F8F7F4]">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Version</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Ảnh</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Ngày tạo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {subjects.map((s) => (
                <tr key={s.subject} className="hover:bg-[#FAFAF9] transition-colors">
                  <td className="px-5 py-3 font-medium text-[#242424]">{s.subject.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-[#6B6B6B] font-mono text-xs">v{s.version}</td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{s.imageCount}</td>
                  <td className="px-4 py-3 text-[#6B6B6B] text-xs">{s.provider}</td>
                  <td className="px-4 py-3 text-[#6B6B6B] text-xs">{formatDate(s.generated_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {s.hasCompact && <Badge label="compact" color="bg-blue-100 text-blue-700" />}
                      {s.overlayApplied && <Badge label="overlay" color="bg-green-100 text-green-700" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Social Content Log tab ────────────────────────────────────────────────────

function SocialContentLogTab() {
  const [entries, setEntries] = useState<SocialEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterPillar, setFilterPillar] = useState("all");

  useEffect(() => {
    fetch("/api/v1/studio/social-index")
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.entries ?? []);
        setLastUpdated(d.lastUpdated ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Unique pillar names for filter
  const pillars = Array.from(new Set(entries.map((e) => e.pillar_name).filter(Boolean))) as string[];

  const filtered =
    filterPillar === "all" ? entries : entries.filter((e) => e.pillar_name === filterPillar);

  function formatDate(dateStr: string) {
    if (!dateStr) return "—";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  // Stats
  const published = entries.filter((e) => e.status === "published").length;
  const pending = entries.filter((e) => e.status === "pending_review").length;
  const withScore = entries.filter((e) => e.score !== undefined);
  const avgScore = withScore.length > 0
    ? Math.round(withScore.reduce((s, e) => s + (e.score ?? 0), 0) / withScore.length)
    : null;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Social Content Log"
        caption="Lịch sử bài đăng từ VenHoSocialManager — tự động T2/T4/T6."
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Tổng bài", value: entries.length, sub: "đã tạo" },
          { label: "Đã đăng", value: published, sub: "published" },
          { label: "Chờ duyệt", value: pending, sub: "pending review" },
          { label: "Avg Score", value: avgScore !== null ? avgScore : "—", sub: "AI quality score" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] px-4 py-4">
            <div className="text-2xl font-bold text-[#2F6F91]">{loading ? "…" : card.value}</div>
            <div className="text-sm font-semibold text-[#242424] mt-0.5">{card.label}</div>
            <div className="text-xs text-[#8C867C]">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      {pillars.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#8C867C]">Pillar:</span>
          {["all", ...pillars].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPillar(p)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                filterPillar === p
                  ? "bg-[#2F6F91] text-white"
                  : "bg-[#F8F7F4] text-[#6B6B6B] hover:bg-[#E8E5DF]"
              }`}
            >
              {p === "all" ? "Tất cả" : p}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] px-5 py-10 text-center text-sm text-[#8C867C]">
          Đang tải…
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E8E5DF] px-5 py-10 text-center text-sm text-[#8C867C]">
          Chưa có bài nào.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E8E5DF]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E5DF] bg-[#F8F7F4]">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Ngày</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Tiêu đề</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Pillar</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#8C867C]">Drive</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {filtered.map((e, i) => (
                <tr key={i} className="hover:bg-[#FAFAF9] transition-colors">
                  <td className="px-5 py-3 text-[#6B6B6B] text-xs whitespace-nowrap">{formatDate(e.date)}</td>
                  <td className="px-4 py-3 font-medium text-[#242424] max-w-[240px]">
                    <div className="truncate" title={e.title}>{e.title}</div>
                    {e.topic_title && e.topic_title !== e.title && (
                      <div className="text-xs text-[#8C867C] truncate mt-0.5">{e.topic_title}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#6B6B6B] text-xs">
                    <div>{e.pillar_name ?? "—"}</div>
                    {e.funnel_stage && <div className="text-[#8C867C]">{e.funnel_stage}</div>}
                  </td>
                  <td className="px-4 py-3">
                    {e.score !== undefined ? (
                      <span className={`font-mono text-xs font-bold ${e.score >= 85 ? "text-[#5F8F6F]" : e.score >= 70 ? "text-[#8A621A]" : "text-[#C96A5C]"}`}>
                        {e.score}
                      </span>
                    ) : <span className="text-[#8C867C]">—</span>}
                  </td>
                  <td className="px-4 py-3">{statusBadge(e.status)}</td>
                  <td className="px-4 py-3">
                    {e.drive_url ? (
                      <a
                        href={e.drive_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#2F6F91] hover:underline"
                      >
                        Drive ↗
                      </a>
                    ) : <span className="text-[#8C867C]">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lastUpdated && (
        <p className="text-xs text-[#8C867C]">
          Index cập nhật: {new Date(lastUpdated).toLocaleString("vi-VN")}
        </p>
      )}
    </div>
  );
}

// ── Tab bar ────────────────────────────────────────────────────────────────────

type Tab = "DNA Status" | "Social Content Log";
const TABS = ["DNA Status", "Social Content Log"] as const;

// ── Section root ──────────────────────────────────────────────────────────────

export default function ReportsSection() {
  const [tab, setTab] = useState<Tab>("DNA Status");

  return (
    <div className="p-8">
      <div className="rounded-2xl border border-[#E8E5DF] bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <TabBar tabs={TABS} active={tab} onSelect={setTab} />
        {tab === "DNA Status" && <DnaStatusTab />}
        {tab === "Social Content Log" && <SocialContentLogTab />}
      </div>
    </div>
  );
}
