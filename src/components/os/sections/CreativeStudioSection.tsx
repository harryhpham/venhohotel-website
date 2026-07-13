"use client";

import { useEffect, useState } from "react";
import {
  DAY_NAMES_VI,
  ENV_BLOCKS,
  OUTFIT_BY_PILLAR,
  OUTFITS,
  PILLARS,
  VIDEO_PILLARS,
  type VideoPillar,
} from "@/lib/studio/constants";
import {
  assembleImagePrompt,
  buildCaptionPrompt,
  generateVideoScript,
  getScenes,
  slugify,
} from "@/lib/studio/prompt-builder";
import { CopyBtn, Field, PrimaryBtn, SectionHeader, TabBar, inputCls, textareaCls } from "@/components/os/shared/ui";

// ── Tạo Ảnh AI ───────────────────────────────────────────────────────────────

function TaoAnhAI() {
  const [topic, setTopic] = useState("");
  const [hasLinhAn, setHasLinhAn] = useState(false);
  const [scenario, setScenario] = useState(Object.keys(ENV_BLOCKS)[0]);
  const [outfitKey, setOutfitKey] = useState(Object.keys(OUTFITS)[0]);
  const [action, setAction] = useState("");
  const [useRef, setUseRef] = useState(true);
  const [size, setSize] = useState("portrait");
  const [count, setCount] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPrompt(assembleImagePrompt(scenario, hasLinhAn, outfitKey, action, ""));
  }, [scenario, hasLinhAn, outfitKey, action]);

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const outputRel = `photos-ai/${today.getFullYear()}/${dateStr}-${slugify(topic || "image-ai")}`;

  async function generate() {
    if (!topic.trim()) { setError("Cần nhập topic."); return; }
    setError(null);
    setImagePaths([]);
    setLoading(true);

    const newPaths: string[] = [];
    for (let i = 0; i < count; i++) {
      const resp = await fetch("/api/v1/studio/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, outputRel, size, hasLinhAn, useRef }),
      });
      const data = await resp.json() as { ok: boolean; imagePath?: string; error?: string };
      if (data.ok && data.imagePath) {
        newPaths.push(data.imagePath);
      } else {
        setError(data.error ?? "Generation failed");
        break;
      }
    }
    setImagePaths(newPaths);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Tạo Ảnh AI" caption="gpt-image-2 · Linh An v3.1 · Hotel DNA" />

      <Field label="Topic / Concept">
        <input className={inputCls} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="VD: Hoàng hôn Hồ Tây nhìn từ rooftop" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Kích thước">
          <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="portrait">portrait — 4:5 (Instagram)</option>
            <option value="square">square — 1:1 (Đa nền tảng)</option>
            <option value="story">story — 9:16 (Reels)</option>
          </select>
        </Field>
        <Field label="Số lượng ảnh">
          <input type="number" min={1} max={4} className={inputCls} value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </Field>
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <input type="checkbox" checked={hasLinhAn} onChange={(e) => setHasLinhAn(e.target.checked)} />
        <span className="text-sm font-semibold text-[#242424]">Có Linh An trong ảnh</span>
      </label>

      <Field label="Scenario">
        <select className={inputCls} value={scenario} onChange={(e) => setScenario(e.target.value)}>
          {Object.keys(ENV_BLOCKS).map((k) => <option key={k}>{k}</option>)}
        </select>
      </Field>

      {hasLinhAn && (
        <>
          <Field label="Outfit Linh An">
            <select className={inputCls} value={outfitKey} onChange={(e) => setOutfitKey(e.target.value)}>
              {Object.keys(OUTFITS).map((k) => <option key={k}>{k}</option>)}
            </select>
          </Field>
          <Field label="Hành động / Pose (tiếng Anh)" caption="VD: riding a bicycle · sitting at a café table · leaning on the railing">
            <input className={inputCls} value={action} onChange={(e) => setAction(e.target.value)} placeholder="VD: standing at the rooftop railing, looking toward the lake" />
          </Field>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={useRef} onChange={(e) => setUseRef(e.target.checked)} />
            <span className="text-sm text-[#242424]">Dùng reference image (khuyến nghị cho portrait / đứng)</span>
          </label>
        </>
      )}

      <Field label="Image Prompt (có thể chỉnh sửa)">
        <div className="mb-1 flex justify-end">
          <CopyBtn text={prompt} />
        </div>
        <textarea className={textareaCls} rows={8} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      </Field>

      <p className="text-xs text-[#8C867C]">Output: <code className="rounded bg-[#F2F0EC] px-1">{`ops/VenHoSocialManager/${outputRel}/`}</code></p>

      {error && <p className="rounded-xl bg-[#FDECEA] p-3 text-sm text-[#C96A5C]">{error}</p>}

      <PrimaryBtn onClick={generate} disabled={loading}>
        {loading ? "Đang tạo…" : "▶ Tạo ảnh"}
      </PrimaryBtn>

      {imagePaths.length > 0 && (
        <div className="mt-4 grid gap-4">
          {imagePaths.map((p, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-[#E8E5DF]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/v1/studio/file?path=${encodeURIComponent(p)}`}
                alt={`Generated image ${i + 1}`}
                className="w-full"
              />
              <p className="px-3 py-2 text-xs text-[#6B6B6B]">{p}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tạo Social Post ───────────────────────────────────────────────────────────

function TaoSocialPost() {
  const pillarKeys = Object.keys(PILLARS);
  const [concept, setConcept] = useState("");
  const [pillar, setPillar] = useState(pillarKeys[0]);
  const [hasLinhAn, setHasLinhAn] = useState(false);
  const [size, setSize] = useState("portrait");
  const [scenario, setScenario] = useState(Object.keys(ENV_BLOCKS)[0]);
  const [outfitKey, setOutfitKey] = useState(Object.keys(OUTFITS)[0]);
  const [action, setAction] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);

  const pillarInfo = PILLARS[pillar] ?? { funnel: "TOFU", golden_rule: "Inspire", persona: "Persona 1", hashtags: "#VenHoHotel" };

  const captionPrompt = concept.trim()
    ? buildCaptionPrompt({
        concept,
        pillar,
        funnel: pillarInfo.funnel,
        persona: pillarInfo.persona,
        goldenRule: pillarInfo.golden_rule,
        hasLinhAn,
        hashtags: pillarInfo.hashtags,
      })
    : "";

  const today = new Date();
  const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const imgOutputRel = `database/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${ymd}_${slugify(concept)}`;

  async function generateImage() {
    if (!concept.trim()) { setImgError("Cần nhập concept."); return; }
    setImgError(null);
    setImagePath(null);
    setImgLoading(true);
    const imgPrompt = assembleImagePrompt(scenario, hasLinhAn, outfitKey, action, "");
    const resp = await fetch("/api/v1/studio/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: imgPrompt, outputRel: imgOutputRel, size, hasLinhAn }),
    });
    const data = await resp.json() as { ok: boolean; imagePath?: string; error?: string };
    setImgLoading(false);
    if (data.ok && data.imagePath) setImagePath(data.imagePath);
    else setImgError(data.error ?? "Generation failed");
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Tạo Social Post" caption="Content Strategy v2.0 · Captions + Ảnh AI" />

      <Field label="Concept bài viết">
        <textarea className={textareaCls} rows={3} value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="VD: Hoàng hôn Hồ Tây tháng 7 — ánh vàng chiều tà trên mặt hồ" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Content Pillar">
          <select className={inputCls} value={pillar} onChange={(e) => setPillar(e.target.value)}>
            {pillarKeys.map((k) => <option key={k}>{k}</option>)}
          </select>
        </Field>
        <Field label="Kích thước ảnh">
          <select className={inputCls} value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="portrait">portrait — 4:5 (Instagram)</option>
            <option value="square">square — 1:1 (Đa nền tảng)</option>
            <option value="story">story — 9:16 (Reels)</option>
          </select>
        </Field>
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <input type="checkbox" checked={hasLinhAn} onChange={(e) => setHasLinhAn(e.target.checked)} />
        <span className="text-sm font-semibold text-[#242424]">Có Linh An trong ảnh</span>
      </label>

      {concept.trim() && (
        <>
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-[#E8E5DF] bg-[#F8F7F4] p-4">
            {[
              ["Persona", pillarInfo.persona.split("—")[0].trim()],
              ["Funnel", pillarInfo.funnel],
              ["Nguyên tắc vàng", pillarInfo.golden_rule],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#8C867C]">{label}</p>
                <p className="mt-0.5 text-sm font-bold text-[#242424]">{value}</p>
              </div>
            ))}
          </div>

          <Field label="Prompt cho ChatGPT / Claude — Viết 3 Caption">
            <div className="mb-1 flex justify-end">
              <CopyBtn text={captionPrompt} />
            </div>
            <textarea className={textareaCls} rows={10} value={captionPrompt} readOnly />
          </Field>

          <div className="h-px bg-[#E8E5DF]" />
          <p className="text-sm font-semibold text-[#242424]">Tạo ảnh</p>

          <Field label="Scenario ảnh">
            <select className={inputCls} value={scenario} onChange={(e) => setScenario(e.target.value)}>
              {Object.keys(ENV_BLOCKS).map((k) => <option key={k}>{k}</option>)}
            </select>
          </Field>

          {hasLinhAn && (
            <>
              <Field label="Outfit Linh An">
                <select className={inputCls} value={outfitKey} onChange={(e) => setOutfitKey(e.target.value)}>
                  {Object.keys(OUTFITS).map((k) => <option key={k}>{k}</option>)}
                </select>
              </Field>
              <Field label="Hành động / Pose">
                <input className={inputCls} value={action} onChange={(e) => setAction(e.target.value)} placeholder="VD: looking at West Lake from the rooftop railing" />
              </Field>
            </>
          )}

          <p className="text-xs text-[#8C867C]">Output: <code className="rounded bg-[#F2F0EC] px-1">{`ops/VenHoSocialManager/${imgOutputRel}/`}</code></p>
          {imgError && <p className="rounded-xl bg-[#FDECEA] p-3 text-sm text-[#C96A5C]">{imgError}</p>}
          <PrimaryBtn onClick={generateImage} disabled={imgLoading}>{imgLoading ? "Đang tạo…" : "▶ Tạo ảnh"}</PrimaryBtn>

          {imagePath && (
            <div className="mt-4 overflow-hidden rounded-xl border border-[#E8E5DF]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/v1/studio/file?path=${encodeURIComponent(imagePath)}`} alt="Generated" className="w-full" />
              <p className="px-3 py-2 text-xs text-[#6B6B6B]">{imagePath}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Tạo Video Script ──────────────────────────────────────────────────────────

function TaoVideoScript() {
  const [concept, setConcept] = useState("");
  const [pillar, setPillar] = useState<VideoPillar>("View & Vibe");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 10));
  const [scriptContent, setScriptContent] = useState<string | null>(null);
  const [scriptFilename, setScriptFilename] = useState("");
  const [nextNum, setNextNum] = useState(6);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/v1/studio/save-script")
      .then((r) => r.json())
      .then((d: { nextNum: number }) => setNextNum(d.nextNum))
      .catch(() => {});
  }, []);

  function generateScript() {
    if (!concept.trim()) return;
    const date = new Date(scheduledDate);
    const dayName = DAY_NAMES_VI[date.getDay() === 0 ? 6 : date.getDay() - 1];
    const dateStr = `${dayName}, ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    const outfitKey = OUTFIT_BY_PILLAR[pillar];
    const outfitDesc = OUTFITS[outfitKey] ?? "";
    const scenes = getScenes(pillar);
    const slug = slugify(concept);
    const filename = `${String(nextNum).padStart(3, "0")}-${slug}.md`;

    setScriptContent(generateVideoScript({ concept, pillar, dateStr, outfitDesc, scenes, scriptNum: nextNum }));
    setScriptFilename(filename);
    setSaved(false);
  }

  async function saveScript() {
    if (!scriptContent || !scriptFilename) return;
    setSaving(true);
    const resp = await fetch("/api/v1/studio/save-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: scriptContent, filename: scriptFilename }),
    });
    const data = await resp.json() as { ok: boolean };
    setSaving(false);
    if (data.ok) {
      setSaved(true);
      setNextNum((n) => n + 1);
    }
  }

  return (
    <div className="space-y-4">
      <SectionHeader title="Tạo Video Script" caption="LitMedia Seedance 2.0 · 15 giây · 3 cảnh · Linh An" />

      <Field label="Concept video">
        <textarea className={textareaCls} rows={3} value={concept} onChange={(e) => setConcept(e.target.value)} placeholder="VD: Buổi sáng tại Ven Hồ Hotel — Linh An thưởng thức cà phê nhìn ra Hồ Tây" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Content Pillar">
          <select className={inputCls} value={pillar} onChange={(e) => setPillar(e.target.value as VideoPillar)}>
            {VIDEO_PILLARS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Ngày đăng dự kiến">
          <input type="date" className={inputCls} value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
        </Field>
      </div>

      <p className="text-xs text-[#8C867C]">
        File sẽ lưu: <code className="rounded bg-[#F2F0EC] px-1">{`local-generated/social-video/scripts/${String(nextNum).padStart(3, "0")}-${slugify(concept || "video-script")}.md`}</code>
      </p>

      <PrimaryBtn onClick={generateScript} disabled={!concept.trim()}>▶ Tạo Script</PrimaryBtn>

      {scriptContent && (
        <div className="mt-4 space-y-3">
          <div className="overflow-hidden rounded-xl border border-[#E8E5DF]">
            <div className="flex items-center justify-between border-b border-[#E8E5DF] bg-[#F8F7F4] px-4 py-2">
              <span className="text-xs font-semibold text-[#4D4A45]">Preview — {scriptFilename}</span>
              <CopyBtn text={scriptContent} />
            </div>
            <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap p-4 text-xs leading-5 text-[#4D4A45]">
              {scriptContent}
            </pre>
          </div>
          <div className="flex items-center gap-3">
            <PrimaryBtn onClick={saveScript} disabled={saving || saved}>
              {saving ? "Đang lưu…" : saved ? "✓ Đã lưu" : "Lưu file script"}
            </PrimaryBtn>
            <button
              onClick={() => { setScriptContent(null); setSaved(false); }}
              className="rounded-xl border border-[#E8E5DF] px-4 py-2.5 text-sm font-semibold text-[#6B6B6B] hover:bg-[#F2F0EC]"
            >
              Xóa preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section root ──────────────────────────────────────────────────────────────

const TABS = ["Tạo Ảnh AI", "Tạo Social Post", "Tạo Video Script"] as const;
type Tab = typeof TABS[number];

export default function CreativeStudioSection() {
  const [tab, setTab] = useState<Tab>("Tạo Ảnh AI");

  return (
    <div className="p-8">
      <div className="rounded-2xl border border-[#E8E5DF] bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <TabBar tabs={TABS} active={tab} onSelect={setTab} />
        {tab === "Tạo Ảnh AI" && <TaoAnhAI />}
        {tab === "Tạo Social Post" && <TaoSocialPost />}
        {tab === "Tạo Video Script" && <TaoVideoScript />}
      </div>
    </div>
  );
}
