Tạo ảnh AI cho Ven Hồ Hotel / West Lake Living Universe bằng gpt-image-2.
Áp dụng đầy đủ DNA: Linh An v3.1 + West Lake v2.1 + Hotel Reference Pack v1.
Lưu local + upload Google Drive theo cấu trúc: Photos AI / YYYY / DD-MM-slug.

## Đầu vào

`$ARGUMENTS` có thể là concept ngắn: `/tao-anh-ai Hoàng hôn Hồ Tây nhìn từ rooftop`

Nếu `$ARGUMENTS` trống, hỏi lần lượt:
1. Topic / concept là gì? (1–2 câu mô tả ý tưởng ảnh)
2. Có Linh An trong ảnh không? (có / không)
3. Kích thước: portrait (4:5 · Instagram feed) / square (1:1 · đa nền tảng) / story (9:16 · Reels/Stories)
4. Số lượng ảnh: 1–4

---

## Quy trình thực hiện

### Bước 1 — Xác định thư mục output

- Lấy ngày hôm nay `YYYY-MM-DD`
- Tạo slug từ topic: chữ thường, không dấu, gạch ngang, tối đa 4 từ
  - VD: "Linh An uống cà phê rooftop" → `linh-an-cafe-rooftop`
- **Local:** `../venho-social-content-agent/photos-ai/YYYY/DD-MM-{slug}/`
- **Drive:** `Photos AI / YYYY / DD-MM-{slug} /`

---

### Bước 2 — Phân loại scenario

Đọc topic và phân vào một trong các scenario:

| Scenario | Từ khóa gợi ý | Environment block dùng | DNA subject (Bước 2b) |
|----------|---------------|----------------------|------------------------|
| Nguyễn Đình Thi / lakeside | ven hồ, dạo bộ, đường, xe máy | Street-Level block | `westlake` (+ `outside`, lọc `space_type: street_level_exterior`, nếu thấy mặt tiền khách sạn) |
| Rooftop | rooftop, sân thượng, tầng thượng | Rooftop block | `outside` (lọc `space_type: rooftop_terrace`) |
| Hotel room / balcony | phòng, ban công, cửa sổ, checkin | Hotel Room block | `lake_view_room` (view hồ) hoặc `deluxe_double` (không view hồ) |
| Tây Hồ café | cà phê, café, ngồi | West Lake Café block | *(chưa có DNA — dùng block cứng)* |
| Chân dung / portrait | chân dung, portrait, close-up | Hero Portrait block | `linh_an` |
| West Lake landscape | cảnh, hoàng hôn, bình minh, mặt hồ | Wide Lake View block | `westlake` |
| Mặt tiền / lobby khách sạn | mặt tiền, sảnh, lễ tân, check-in | Rooftop/Hotel Room block gần nhất | `facade` (mặt tiền) hoặc `lobby` (sảnh) |

---

### Bước 2b — Đọc DNA compact tương ứng (bắt buộc)

Trước khi viết prompt ở Bước 3, **Read** file COMPACT DNA khớp với subject ở bảng trên:

```
projects/03_AI_STUDIO/venho-ai-studio/data/projects/venho_hotel/knowledge/VENHO_HOTEL_{SUBJECT}_DNA_COMPACT.md
```
(SUBJECT viết hoa, VD: `VENHO_HOTEL_LINH_AN_DNA_COMPACT.md`, `VENHO_HOTEL_WESTLAKE_DNA_COMPACT.md`, `VENHO_HOTEL_LAKE_VIEW_ROOM_DNA_COMPACT.md`, `VENHO_HOTEL_FACADE_DNA_COMPACT.md`, `VENHO_HOTEL_LOBBY_DNA_COMPACT.md`, `VENHO_HOTEL_DELUXE_DOUBLE_DNA_COMPACT.md`, `VENHO_HOTEL_OUTSIDE_DNA_COMPACT.md`)

File này có 3 phần: **INVARIANT** (đặc điểm bắt buộc — đưa thẳng vào prompt), **ALLOWED IMPERFECTIONS** (chi tiết tự nhiên được phép, không cần ép tránh), **FORBIDDEN** (thêm vào Global Negative Prompt ở Bước 3).

**Nếu DNA compact mâu thuẫn với Environment block cứng bên dưới → DNA compact thắng** (đây là nguồn đã qua Pass 2A tất định + QC, cập nhật hơn). Environment block cứng chỉ là fallback khi chưa có DNA cho subject đó (café).

**Lưu ý riêng cho `outside`:** subject này gộp nhiều loại không gian ngoài trời (street-level, rooftop, balcony, entrance) trong một schema — `space_type` là **VARIABLE**, không phải INVARIANT. Compact chỉ hiện phần INVARIANT chung cho mọi loại; khi cần khóa đúng loại không gian (VD rooftop vs street-level), đọc thêm bản đầy đủ `VENHO_HOTEL_OUTSIDE_DNA.md` và chọn giá trị `space_type` phù hợp trong mục VARIABLE (`rooftop_terrace`, `street_level_exterior`, `balcony`, `entrance_area`) để đưa vào prompt.

Nếu không có Linh An trong ảnh, bỏ qua `linh_an` DNA.

---

### Bước 3 — Tạo detailed English prompt(s)

**Cấu trúc 1 prompt = [CHARACTER] + [ENVIRONMENT] + [STORY/ACTION] + [LIGHTING] + [TECHNICAL] + [NEGATIVE]**

#### Khi Linh An = CÓ:

Prepend block sau (Face Lock v3.1 — KHÔNG mô tả khuôn mặt thêm, đã lock qua `--ref`):

```
Linh An, Vietnamese female influencer, 24 years old,
soft elongated oval face, balanced facial geometry,
slim natural nose bridge, long almond eyes, horizontal eye emphasis,
slightly narrow eye opening, thin upper eyelid, warm brown irises,
very subtle outer corner lift, natural eye asymmetry,
low-position eyebrows, minimal arch, close eye-brow distance,
natural full lips with slightly thinner upper lip and slightly fuller lower lip,
very subtle upward lip corners, slightly shorter philtrum,
soft feminine jawline, delicate chin,
fair warm ivory skin, healthy natural glow, realistic skin texture, natural pores,
long dark chocolate brown layered wavy hair, natural center part,
small pearl drop earrings,
gentle feminine beauty, elegant Vietnamese appearance,
luxury lifestyle creator, consistent facial identity,
photorealistic, natural beauty,
no plastic skin, no doll face, no exaggerated makeup.
168cm height, slim elegant body, defined waistline,
long legs, natural feminine curves, healthy feminine silhouette,
graceful posture, confident but relaxed body language.
10-20 degree soft hero left angle, natural eye contact,
Living Expression — subtle anticipation smile, genuine engagement.
```

**Chọn outfit theo scenario:**
- Rooftop / View & Vibe / hoàng hôn → **Outfit B:** flowing white dress, minimal gold jewelry
- Café / Local Life / buổi sáng → **Outfit A:** cream knit top, beige A-line skirt, small luxury handbag
- Street / Nguyễn Đình Thi → **Outfit C:** white button-up shirt, high-waist trousers, denim jacket
- Hotel room / checkin / business → **Outfit D:** light beige blazer, white blouse, elegant trousers
- Áo dài / mùa lễ / đặc biệt → contemporary áo dài, soft neutral tones

**Quy tắc khi dùng `--ref`:** Không mô tả khuôn mặt trong prompt — chỉ mô tả outfit, background, action, ánh sáng.

---

#### Khi Linh An = KHÔNG:

Tạo prompt cảnh/hotel/landscape thuần, không có nhân vật. Áp dụng West Lake DNA + Hotel DNA.

---

#### Environment blocks (copy vào prompt theo scenario):

**Street-Level Nguyễn Đình Thi:**
```
Authentic Nguyễn Đình Thi Street beside West Lake Hanoi, current 2026 lakeside environment,
ivory-white metal railing with rounded top handrail, multiple horizontal bars,
angled triangular support frames, simple modern functional railing, no stone pillars, no green railing,
narrow local lakeside sidewalk with gray paving, mature trees growing close to the railing,
natural leafy branches extending over the path, strong tree shadows on the pavement,
light motorbike and bicycle traffic on the two-lane road,
wide calm West Lake water immediately beside the railing,
distant low and mid-rise Hanoi skyline across the lake,
large open sky with soft clouds, authentic local West Lake residential atmosphere,
not touristy, not resort-like.
```

**Rooftop Ven Hồ Hotel:**
```
Ven Hồ Hotel rooftop terrace overlooking West Lake Hanoi,
open rooftop with terracotta floor tiles,
black metal rooftop railing with simple circular details on top bar,
panoramic view of calm West Lake, distant Hanoi skyline,
huge sky with soft clouds, light local atmosphere.
```

**Hotel Room / Balcony** (dùng `--ref-env "assets/View-Ho-room-from-inside.png"` hoặc `"assets/View-Ho-room.png"`):
```
Ven Hồ Hotel authentic lake view room, Hanoi mini hotel interior,
long narrow room layout, white walls, white ceiling with simple crown molding,
warm recessed LED ceiling lights,
dark reddish-brown mahogany wood furniture throughout: queen bed with dark wood frame and headboard, white bedding,
light wood laminate flooring,
large black aluminum cross-mullion window (2x2 pane grid, not floor-to-ceiling height),
dark gray-brown thick curtains pulled open to both sides,
black ornate wrought-iron decorative railing outside window with scroll and floral pattern,
two wooden armchairs with cushions and small glass-top wooden table positioned directly in front of window,
three pastel pink floral framed artworks on wall above headboard area,
wooden vanity desk with rectangular mirror and table lamp beside headboard,
West Lake water and mature green trees visible through window beyond the railing,
authentic functional Hanoi mini hotel atmosphere, not luxury, not resort, not boutique designer.
```

**West Lake Café:**
```
Cozy West Lake Hanoi café, large windows facing the lake,
warm natural light, authentic Vietnamese café atmosphere,
West Lake visible outside, calm morning mood.
```

**Wide West Lake landscape:**
```
Panoramic West Lake Hanoi view from elevated position,
calm jade-teal water surface #4E8FA0 extending to horizon,
low and mid-rise Hanoi skyline in distance, slightly hazy,
mature green tree belt along the shore, huge open sky 40–55% frame,
authentic Hanoi atmosphere, not Singapore, not Seoul, not Shanghai.
```

---

#### Màu nước Hồ Tây theo thời điểm:
- Bình minh / sáng → silver-gray, blue-gray, soft reflective gray-green
- Trưa nắng → jade-green, turquoise-green #4E8FA0
- Trời흐u / cloudy → muted blue-gray, olive-gray
- Hoàng hôn → reflects warm golden-orange #C07840

---

#### Lighting block theo thời điểm:
- Bình minh (05:30–08:30): soft morning light, gentle golden haze, calm reflections
- Buổi sáng (08:00–11:00): clean bright light, high contrast, fresh local mood
- Hoàng hôn (17:00–18:45): honey gold, warm highlights, lake reflections, cinematic
- Đêm: warm hotel lights, quiet street, soft ambient glow

---

#### Technical block (append mọi prompt):
```
Fujifilm GFX100S, 85mm lens, shallow depth of field, photorealistic 8K,
natural skin texture, editorial luxury lifestyle photography, authentic Vietnamese atmosphere.
```

---

#### Logo Ven Hồ Hotel — khi cần xuất hiện trong ảnh:

Logo Ven Hồ Hotel: gold lotus flower with star emblem inside an arched oval frame, text "VEN HO HOTEL" above "LAKE SHORE" in gold serif font on white background.

Các vật phẩm có thể mang logo (thêm vào prompt khi phù hợp):
- Ly cà phê: `white ceramic mug with gold Ven Ho Hotel lotus logo`
- Khăn tắm: `white towel folded with embroidered gold Ven Ho Hotel branding`
- Thẻ phòng: `hotel keycard with gold Ven Ho Hotel lotus emblem`
- Menu: `white card with gold Ven Ho Hotel lotus logo on wooden table`

Chỉ thêm logo khi concept yêu cầu (VD: "ly cà phê khách sạn") — không tự động thêm vào mọi ảnh.

---

#### Global Negative Prompt (append cuối mọi prompt):
```
Do not make the subject look Korean, Japanese, Chinese, European, or generic fashion model.
Avoid anime style, cartoon style, plastic skin, beauty filter, K-pop styling,
futuristic architecture, Singapore skyline, Seoul skyline, Tokyo skyline, Shanghai skyline,
luxury skyscraper wall, distorted hands, extra fingers,
floor-to-ceiling glass wall hotel, marble luxury interior, modern minimalist designer room,
beige boutique aesthetic, cream and white luxury room, generic AI hotel room,
artificial lighting, over-sharpening, excessive HDR, AI artifacts,
duplicate objects, floating objects, unrealistic reflections,
green railing, pink stone pillars, old Hồ Tây railing style,
resort luxury pool, marina lifestyle, tropical ocean scene, tourist crowd.
```

---

#### Với N > 1 ảnh: tạo N variation prompts

Thay đổi ít nhất 2 trong: góc máy, ánh sáng, action của Linh An, composition, foreground element. Đánh số rõ: `Prompt 1:`, `Prompt 2:`, ...

---

### Bước 4 — Lưu image_prompt.txt và generate ảnh

Lưu toàn bộ prompt(s) vào `../venho-social-content-agent/photos-ai/YYYY/DD-MM-{slug}/image_prompt.txt`.

**Chọn engine:**
| Engine | Khi nào dùng |
|--------|-------------|
| **GPT Image 2** (`generate_image.py --ref`) | Social posts, volume, on-demand |
| **Google Flow / Nano Banana 2** (litmedia.ai) | Hero portrait, branding — load Master Face #001 làm Ingredient, tắt Image Search Grounding |

Generate từng ảnh lần lượt (GPT Image 2):

```bash
cd "../venho-social-content-agent"

# Nếu có Linh An:
python3 generate_image.py "[Prompt N]" "photos-ai/YYYY/DD-MM-slug" [size] --ref "assets/linh-an-master-face.png"
mv "photos-ai/YYYY/DD-MM-slug/image.png" "photos-ai/YYYY/DD-MM-slug/image-N.png"

# Nếu không có Linh An:
python3 generate_image.py "[Prompt N]" "photos-ai/YYYY/DD-MM-slug" [size]
mv "photos-ai/YYYY/DD-MM-slug/image.png" "photos-ai/YYYY/DD-MM-slug/image-N.png"
```

*Lặp cho mỗi ảnh từ 1 → N. Rename ngay sau mỗi lần generate để không bị ghi đè.*

---

### Bước 4b — QC Scoring (07F Rubric)

Chấm điểm từng ảnh sau khi generate. Dùng **10-second fast triage** trước:

| Câu hỏi | Fail nếu |
|---------|---------|
| Mắt có dài ngang, không tròn? | Mắt to tròn → G1 FAIL |
| Lông mày có thấp, sát mắt? | Lông mày cao hoặc arch rõ → G2 FAIL |
| Có Living Expression (không cười rộng)? | Cười lộ răng → G3 FAIL |
| Da có trông thật? | Da plastic / quá mịn → G4 FAIL |
| Có đúng là Linh An? | Khác người → G6 FAIL |

**Verdict threshold (theo 07F):**
- **≥ 9.0** → APPROVED: dùng hero / branding / đăng chính thức
- **8.0–8.9** → CONDITIONAL: dùng scene phụ / story
- **< 8.0 hoặc bất kỳ FAIL** → REJECT: re-anchor Master Face #001, regenerate

*Full weighted rubric: `projects/02_KNOWLEDGE/DNA/Linh An Universe/07_LINH_AN_KOL_SYSTEM/07F_QC_CHECKLIST_SCORING_RUBRIC_v1_0.md`*

---

### Bước 5 — Tạo meta.json

Tạo file `../venho-social-content-agent/photos-ai/YYYY/DD-MM-{slug}/meta.json`:

```json
{
  "date": "YYYY-MM-DD",
  "topic": "[topic gốc Harry nhập]",
  "slug": "DD-MM-slug",
  "linh_an": true,
  "outfit": "B",
  "size": "portrait",
  "count": 2,
  "source": "tao-anh-ai-skill",
  "dna_version": "linh-an-v3.1 / westlake-v2.1 / hotel-ref-v1",
  "status": "done"
}
```

---

### Bước 6 — Upload lên Google Drive

```bash
cd "../venho-social-content-agent"
python3 google_drive.py upload-photos-ai "photos-ai/YYYY/DD-MM-slug"
```

In ra Drive URL khi hoàn thành. Nếu lỗi xác thực, chạy `python3 google_drive.py` để re-auth.

---

## Reference nhanh — DNA sources

**Production DNA (dùng ở Bước 2b — nguồn xác thực, tất định + QC):**
`projects/03_AI_STUDIO/venho-ai-studio/data/projects/venho_hotel/knowledge/VENHO_HOTEL_{SUBJECT}_DNA_COMPACT.md`
Subjects hiện có: `linh_an` · `westlake` · `outside` · `facade` · `lobby` · `lake_view_room` · `deluxe_double` · `room` · `room_1` · `room_2`

**Narrative DNA (bối cảnh, character bible — tham khảo khi cần mô tả sâu hơn):**

| Tài liệu | Đường dẫn |
|----------|-----------|
| Linh An Visual DNA v3.1 | `projects/02_KNOWLEDGE/DNA/Linh An Universe/07_LINH_AN_KOL_SYSTEM/07A_LINH_AN_VISUAL_DNA_v3.1.md` |
| Master Reference Pack v3.0 | `projects/02_KNOWLEDGE/DNA/Linh An Universe/07_LINH_AN_KOL_SYSTEM/07B_MASTER_REFERENCE_PACK_v3.0.md` |
| Face Lock System v1.1 | `projects/02_KNOWLEDGE/DNA/Linh An Universe/07_LINH_AN_KOL_SYSTEM/07C_FACE_LOCK_SYSTEM_v1.1.md` |
| **Production Prompt System v1.1** | `projects/02_KNOWLEDGE/DNA/Linh An Universe/07_LINH_AN_KOL_SYSTEM/07E_PRODUCTION_PROMPT_SYSTEM_v1_1.md` ← engine guides |
| **QC Scoring Rubric v1.0** | `projects/02_KNOWLEDGE/DNA/Linh An Universe/07_LINH_AN_KOL_SYSTEM/07F_QC_CHECKLIST_SCORING_RUBRIC_v1_0.md` ← **chấm điểm** |
| West Lake Environment v2.1 | `projects/02_KNOWLEDGE/DNA/Linh An Universe/05_WEST_LAKE_ENVIRONMENT_SYSTEM/05_WEST_LAKE_ENVIRONMENT_SYSTEM_v2_1.md` |
| **Location Master Ref v2.7** | `projects/02_KNOWLEDGE/DNA/Linh An Universe/06_LOCATION_LIBRARY_SYSTEM/06_LOCATION_MASTER_REFERENCE_PACK_v2.7_FINAL.md` |
| Hotel Master Reference Pack (LOCKED) | `projects/02_KNOWLEDGE/DNA/VENHO_HOTEL_MASTER_REFERENCE_PACK_v2.0_FINAL.md` |

**Reference images** (`../venho-social-content-agent/assets/`):

| File | Loại | Dùng khi |
|------|------|---------|
| `linh-an-master-face.png` | Face Linh An | `--ref` cho mọi ảnh có Linh An |
| `B3_Hero.png` | Face 3/4 trái | Thay thế face chính thức |
| `A2_Front.png` | Face thẳng | Cần góc đối xứng |
| `Rooftop-railing.png` | Env — rooftop + hồ | `--ref-env` cho scene rooftop |
| `View-Ho-room.png` | Env — phòng wide | `--ref-env` cho scene phòng (góc rộng) |
| `View-Ho-room-from-inside.png` | Env — cửa sổ + hồ | `--ref-env` cho scene phòng (focus cửa sổ) |
| `Logo.png` | Logo Ven Hồ Hotel | Tham khảo khi cần mô tả logo trên vật phẩm |
