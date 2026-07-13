// Pure TypeScript port of Python prompt assembly functions from studio_app.py.
// No side effects, no file I/O — safe to call from both client and server.

import {
  ENV_BLOCKS,
  LINH_AN_FACE_LOCK,
  NEGATIVE_BLOCK,
  OUTFITS,
  SCENE_STRUCTURES,
  TECH_BLOCK,
  type SceneTuple,
  type VideoPillar,
} from "./constants";

export function slugify(text: string, maxChars = 30): string {
  const slug = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return (slug || "item").slice(0, maxChars);
}

function extractDnaSection(compact: string, section: string): string {
  const lines = compact.split("\n");
  const result: string[] = [];
  let inSection = false;
  for (const line of lines) {
    if (line.trimStart().startsWith(`## ${section}`)) {
      inSection = true;
      continue;
    }
    if (inSection && line.startsWith("## ")) break;
    if (inSection) result.push(line);
  }
  return result.join("\n").trim();
}

export function assembleImagePrompt(
  scenario: string,
  hasLinhAn: boolean,
  outfitKey: string,
  action: string,
  dnaCompact: string,
): string {
  const env = ENV_BLOCKS[scenario] ?? "";
  const hasAction = hasLinhAn && action.trim().length > 0;
  const parts: string[] = [];

  if (hasLinhAn) {
    const outfitDesc = OUTFITS[outfitKey] ?? "";
    const act = action.trim();
    if (act) {
      const subjectPrefix = act.toLowerCase().startsWith("linh an") ? "" : "Linh An ";
      const isSport = outfitKey.startsWith("E — Sport");
      const hairDesc = isSport
        ? "long dark chocolate brown hair tied back in a sporty ponytail"
        : "long dark chocolate brown layered wavy hair";
      const subjectBlock =
        `${subjectPrefix}${act} in the scene, ` +
        `she is the MAIN SUBJECT prominently in the foreground, full body visible, ` +
        `Vietnamese female lifestyle influencer 24 years old, ` +
        `fair warm ivory skin, healthy natural glow, realistic skin texture, ` +
        `${hairDesc}, small pearl drop earrings, wearing ${outfitDesc}, ` +
        `slim elegant 168cm figure, photorealistic, natural beauty, no conical hat.`;

      if (env) {
        parts.push(`${subjectBlock}\nSetting: ${env.trim()}`);
      } else {
        parts.push(subjectBlock);
      }
    } else {
      parts.push(`${LINH_AN_FACE_LOCK}\nOutfit: ${outfitDesc}.`);
      if (env) parts.push(env);
    }
  } else {
    if (env) parts.push(env);
  }

  if (dnaCompact) {
    const invariant = extractDnaSection(dnaCompact, "INVARIANT");
    if (invariant) parts.push(`DNA context: ${invariant}`);
  }

  if (hasAction) {
    parts.push(
      "Fujifilm GFX100S, 35mm lens, moderate depth of field, photorealistic 8K,\n" +
        "natural skin texture, editorial lifestyle photography, authentic Vietnamese atmosphere.",
    );
  } else {
    parts.push(TECH_BLOCK);
  }

  const actionNeg = hasAction
    ? " No conical hat on main subject, no dark work clothes on main subject," +
      " no anonymous passerby as main subject, no decorative ornate wrought-iron railing."
    : "";
  parts.push(`Negative: ${NEGATIVE_BLOCK}${actionNeg}`);

  return parts.join("\n\n");
}

export function buildCaptionPrompt(params: {
  concept: string;
  pillar: string;
  funnel: string;
  persona: string;
  goldenRule: string;
  hasLinhAn: boolean;
  hashtags: string;
}): string {
  const { concept, pillar, funnel, persona, goldenRule, hasLinhAn, hashtags } = params;
  const funnelDesc: Record<string, string> = {
    TOFU: "Thu hút người chưa biết (60%)",
    MOFU: "Xây dựng niềm tin (30%)",
    BOFU: "Chuyển đổi — đặt phòng (10%)",
  };
  const linhAnNote = hasLinhAn
    ? "Có — đề cập tự nhiên, Linh An là người sống gần Hồ Tây, không phải người quảng cáo"
    : "Không";

  return (
    `Bạn là social media manager của khách sạn Ven Hồ Hotel tại Hà Nội.\n\n` +
    `CONCEPT: ${concept}\n` +
    `PILLAR: ${pillar}\n` +
    `FUNNEL: ${funnel} — ${funnelDesc[funnel] ?? funnel}\n` +
    `PERSONA: ${persona}\n` +
    `NGUYÊN TẮC VÀNG: ${goldenRule}\n` +
    `CÓ LINH AN: ${linhAnNote}\n\n` +
    `BRAND VOICE: Boutique · Local · Trustworthy · Helpful\n` +
    `KHÔNG: quảng cáo lộ liễu · 'sang trọng đẳng cấp' · hard-sell · CTA ép buộc · emoji spam\n` +
    `LUÔN: cụ thể · hình ảnh rõ · câu chuyện thật · CTA mềm kiểu 'Nếu bạn đang tìm...'\n` +
    `HỒ TÂY LÀ NHÂN VẬT CHÍNH — khách sạn là nơi trải nghiệm Hồ Tây tốt nhất\n\n` +
    `---\n\n` +
    `Viết 3 caption theo format CHÍNH XÁC dưới đây:\n\n` +
    `## FACEBOOK (150–250 từ · storytelling · tiếng Việt)\n` +
    `Hook 1 câu → câu chuyện 3–4 câu → thông tin thực tế → CTA mềm\n` +
    `Kết thúc với:\n` +
    `📍 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội\n` +
    `📞 024 3847 4646\n` +
    `🌐 venhohotel.com\n` +
    `Hashtag 5–8 không dấu: ${hashtags} [thêm phù hợp]\n\n` +
    `## INSTAGRAM (80–120 từ · lifestyle · visual)\n` +
    `Hook mạnh dòng 1 · Nội dung 3–5 dòng\n` +
    `📍 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội\n` +
    `📲 Đặt phòng: Link in bio\n` +
    `Hashtag 15–20 không dấu\n\n` +
    `## THREADS (100–150 từ · conversational · gần gũi · ít emoji · 3–5 hashtag)`
  );
}

export function generateVideoScript(params: {
  concept: string;
  pillar: VideoPillar;
  dateStr: string;
  outfitDesc: string;
  scenes: SceneTuple[];
  scriptNum: number;
}): string {
  const { concept, pillar, dateStr, outfitDesc, scenes, scriptNum } = params;

  const scenesMd = scenes
    .map(([descVi, action, scenarioKey, camera, lighting], i) => {
      const env = ENV_BLOCKS[scenarioKey] ?? "";
      const seedance =
        `[Shot ${i + 1}/3 · 5 seconds · 9:16 vertical]\n\n` +
        `Linh An: a Vietnamese woman in her mid-20s, long dark brown wavy hair flowing ` +
        `past her shoulders, elegant East Asian features, soft natural makeup (subtle warm ` +
        `eyeshadow, rosy cheeks, nude-pink lips), small pearl-drop earrings, fair porcelain skin.\n` +
        `Outfit: ${outfitDesc}.\n` +
        `${action}\n` +
        `${env}\n` +
        `Camera: ${camera}.\n` +
        `Style: ${lighting}. Ultra-realistic, 4K, cinematic depth of field.`;

      return (
        `### Scene ${i + 1} — ${descVi} (${i * 5}–${(i + 1) * 5}s)\n` +
        `**Mô tả:** ${descVi}\n\n` +
        `**Seedance Prompt:**\n\`\`\`\n${seedance}\n\`\`\``
      );
    })
    .join("\n\n");

  return (
    `# Script ${String(scriptNum).padStart(3, "0")} — ${concept}\n\n` +
    `**Pillar:** ${pillar}  \n` +
    `**Đăng:** ${dateStr}  \n` +
    `**Thời lượng:** 15 giây (3 cảnh × 5 giây)  \n` +
    `**Tool:** LitMedia Seedance 2.0 — litmedia.ai  \n` +
    `**Nhân vật:** Linh An (AI KOL — Fashion & Lifestyle Creator)\n\n` +
    `---\n\n## Concept\n\n${concept}\n\n---\n\n` +
    `## Scene Breakdown + Seedance Prompts\n\n${scenesMd}\n\n---\n\n` +
    `## Hướng dẫn generate trên LitMedia\n\n` +
    `1. Vào **litmedia.ai** → chọn model **Seedance 2.0**\n` +
    `2. Settings: **9:16** · **1080p** · **Full** (không phải Fast)\n` +
    `3. Generate Scene 1 → Download → Scene 2 → Download → Scene 3 → Download\n` +
    `4. Ghép 3 clips trong CapCut + thêm nhạc + text overlay + AI Caption\n\n---\n\n` +
    `## Nhạc gợi ý\n\nTìm trên CapCut phù hợp với pillar **${pillar}**: ambient/soft instrumental, 80–100 BPM.\n\n---\n\n` +
    `## Caption\n\n` +
    `### TikTok\n\`\`\`\n[Hook mạnh dòng đầu — gây tò mò hoặc cảm xúc ngay]\n\nVen Hồ Hotel, 181 Nguyễn Đình Thi, Tây Hồ\nLink đặt phòng in bio\n\n#VenHoHotel #HoTay #TayHo #HanoiHotel\n\`\`\`\n\n` +
    `### Instagram Reels\n\`\`\`\n[Kể chuyện 3–5 dòng — tone lifestyle, chân thực]\n\n📍 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội\n📲 Đặt phòng: Link in bio\n\n#VenHoHotel #HoTay #TayHo #HanoiHotel #KhachSanHaNoi #HanoiTravel\n\`\`\`\n\n---\n\n` +
    `## Checklist\n\n` +
    `- [ ] Generate 3 clips trên Seedance 2.0\n` +
    `- [ ] Ghép clips trong CapCut (Scene 1 → 2 → 3)\n` +
    `- [ ] Thêm nhạc nền\n` +
    `- [ ] Text overlay: tên khách sạn + CTA ở cuối\n` +
    `- [ ] AI Caption bật\n` +
    `- [ ] Export 9:16 · 1080p · 30fps\n` +
    `- [ ] Đăng đúng giờ: TikTok 20:00–22:00 / Reels 11:00–13:00\n`
  );
}

export function getScenes(pillar: VideoPillar): SceneTuple[] {
  return (
    SCENE_STRUCTURES[pillar] ?? [
      ["Cảnh 1", "standing in hotel area", "Hotel Room (Lake View)", "slow push in", "natural light"],
      ["Cảnh 2", "looking at West Lake", "Rooftop Ven Hồ Hotel", "slow pan", "golden hour"],
      ["Cảnh 3", "relaxing by the window", "Hotel Room (Lake View)", "static", "soft evening light"],
    ]
  );
}
