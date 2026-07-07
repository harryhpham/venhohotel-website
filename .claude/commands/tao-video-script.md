Tạo một video script hoàn chỉnh cho Ven Hồ Hotel theo hệ thống Seedance 2.0 + AI KOL Linh An.

## Đầu vào

`$ARGUMENTS` có thể là:
- Tên/ý tưởng video ngắn: `/tao-video-script Golden Hour phòng Deluxe`
- Hoặc để trống — Claude sẽ hỏi

Nếu `$ARGUMENTS` trống, hỏi Harry:
1. Pillar là gì? (View & Vibe / Room Tour / Local Life / Deal / Guest Story)
2. Concept video là gì? (1–2 câu mô tả ý tưởng)
3. Ngày đăng dự kiến? (để điền vào header)

## Quy trình thực hiện

### Bước 1 — Xác định số thứ tự script

Đọc thư mục `local-generated/social-video/scripts/` để tìm file có số lớn nhất (VD: `005-...`), sau đó tạo file mới với số tiếp theo (VD: `006-...`).

### Bước 2 — Đặt tên file

Format: `{số 3 chữ số}-{tên-kebab-case}.md`
Ví dụ: `006-binh-minh-ho-tay.md`

Lưu vào: `local-generated/social-video/scripts/`

### Bước 3 — Viết nội dung script

Dùng **chính xác template dưới đây**. Điền các phần trong `[...]`:

---

```markdown
# Script [NNN] — [Tên Video]

**Pillar:** [View & Vibe / Room Tour / Local Life / Deal / Guest Story]  
**Đăng:** [Ngày cụ thể, VD: Thứ 2, 30/6/2026]  
**Thời lượng:** 15 giây (3 cảnh × 5 giây)  
**Tool:** LitMedia Seedance 2.0 — litmedia.ai  
**Nhân vật:** Linh An (AI KOL — Fashion & Lifestyle Creator)

---

## Concept

[1–2 câu mô tả video này về cái gì, Linh An đang làm gì, tone như thế nào]

---

## Scene Breakdown + Seedance Prompts

### Scene 1 — [Tên cảnh] (0–5s)
**Mô tả:** [Tiếng Việt — Harry hiểu ngay cảnh này là gì]

**Seedance Prompt:**
```
[Shot 1/3 · 5 seconds · 9:16 vertical]

Linh An: a Vietnamese woman in her mid-20s, long dark brown wavy hair flowing 
past her shoulders, elegant East Asian features, soft natural makeup (subtle warm 
eyeshadow, rosy cheeks, nude-pink lips), small pearl-drop earrings, fair porcelain 
skin. [Outfit phù hợp với scene và concept — mô tả cụ thể].
[Linh An đang làm gì — action cụ thể, không nhìn camera].
[Environment: mô tả địa điểm, ánh sáng, chi tiết nền — hotel room / West Lake / corridor].
Camera: [1 camera movement duy nhất — slow pan / slow push in / static / tracking / pull back / gentle zoom].
Style: [mô tả lighting: golden hour / soft morning / cinematic backlight / etc.]. [Mood: warm / serene / luxurious / fresh]. Ultra-realistic, 4K, cinematic depth of field.
```

### Scene 2 — [Tên cảnh] (5–10s)
**Mô tả:** [...]

**Seedance Prompt:**
```
[Shot 2/3 · 5 seconds · 9:16 vertical]

Linh An: a Vietnamese woman in her mid-20s, long dark brown wavy hair flowing 
past her shoulders, elegant East Asian features, soft natural makeup (subtle warm 
eyeshadow, rosy cheeks, nude-pink lips), small pearl-drop earrings, fair porcelain 
skin. [Outfit — phải đồng nhất với Scene 1 trừ khi có lý do thay đổi].
[Action + environment].
Camera: [1 movement].
Style: [lighting + mood]. Ultra-realistic, 4K, cinematic depth of field.
```

### Scene 3 — [Tên cảnh] (10–15s)
**Mô tả:** [...]

**Seedance Prompt:**
```
[Shot 3/3 · 5 seconds · 9:16 vertical]

Linh An: a Vietnamese woman in her mid-20s, long dark brown wavy hair flowing 
past her shoulders, elegant East Asian features, soft natural makeup (subtle warm 
eyeshadow, rosy cheeks, nude-pink lips), small pearl-drop earrings, fair porcelain 
skin. [Outfit].
[Action + environment].
Camera: [1 movement].
Style: [lighting + mood]. Ultra-realistic, 4K, cinematic depth of field.
```

---

## Hướng dẫn generate trên LitMedia

1. Vào **litmedia.ai** → chọn model **Seedance 2.0**
2. Settings: **9:16** · **1080p** · **Full** (không phải Fast)
3. Generate Scene 1 → Download → Scene 2 → Download → Scene 3 → Download
4. Ghép 3 clips trong CapCut + thêm nhạc + text overlay + AI Caption

---

## Nhạc gợi ý

[Gợi ý nhạc phù hợp với tone video: BPM, thể loại, gợi ý tìm kiếm trên CapCut]

---

## Caption

### TikTok
```
[Hook mạnh dòng đầu — gây tò mò hoặc cảm xúc ngay]

Ven Hồ Hotel, 181 Nguyễn Đình Thi, Tây Hồ
Link đặt phòng in bio

#VenHoHotel #HoTay [2–3 hashtag phù hợp thêm]
```

### Instagram Reels
```
[Kể chuyện 3–5 dòng — tone lifestyle, chân thực]

📍 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội
💰 [Giá nếu phù hợp]
📲 Đặt phòng: Link in bio

#VenHoHotel #HoTay #TayHo #HanoiHotel #KhachSanHaNoi #HanoiTravel [thêm hashtag phù hợp, tổng 8–12]
```

---

## Checklist

- [ ] Generate 3 clips trên Seedance 2.0
- [ ] Ghép clips trong CapCut (Scene 1 → 2 → 3)
- [ ] Thêm nhạc nền
- [ ] Text overlay: tên khách sạn + CTA ở cuối
- [ ] AI Caption bật
- [ ] Export 9:16 · 1080p · 30fps
- [ ] Đăng đúng giờ: TikTok 20:00–22:00 / Reels 11:00–13:00
```

---

## Thông tin tham chiếu (không thay đổi)

**Khách sạn:**
- Tên: Ven Hồ Hotel
- Địa chỉ: 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội
- Phone: 024 3847 4646
- Giá: Deluxe Đôi từ 400K · View Hồ từ 600K · Triple từ 500K

---

**Linh An — FACE LOCK v3.0 (production validated · copy vào đầu mỗi Seedance prompt):**
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
gentle feminine beauty, elegant Vietnamese appearance,
luxury lifestyle creator, consistent facial identity,
photorealistic, natural beauty,
no plastic skin, no doll face, no exaggerated makeup
```

**Linh An — BODY LOCK v3.0 (thêm sau Face Lock):**
```
168cm height, slim elegant body, defined waistline,
long legs, natural feminine curves, healthy feminine silhouette,
graceful posture, confident but relaxed body language
```

**Personality:** nhẹ nhàng · thanh lịch · có gu · nữ tính · tinh tế · đáng tin
**KHÔNG:** nhảy nhót quá đà · hài nhảm · biểu cảm lố · sexy quá mức
**KHÔNG nhìn thẳng vào camera** — luôn nhìn về cảnh / hồ / cửa sổ

**Content Universe:** Linh An KHÔNG phải người bán phòng. Cô là cô gái sống gần Hồ Tây, Ven Hồ Hotel là nơi cô thường ghé qua.

---

**Outfit Pack:**
- **Outfit A — Cafe Girl:** cream knit top · beige skirt · small luxury handbag
- **Outfit B — West Lake Sunset:** white dress · minimal jewelry · soft makeup
- **Outfit C — Street Style:** black fitted top · high waist jeans · white sneakers
- **Outfit D — Business Travel:** light beige blazer · white blouse · elegant trousers

**Outfit theo pillar:**
- View & Vibe: **Outfit B** (West Lake Sunset)
- Room Tour: **Outfit D** (Business Travel)
- Local Life: **Outfit A** (Cafe Girl) — Scene 1 trong phòng dùng hotel robe
- Deal: **Outfit B** hoặc **D** — confident, tươi sáng
- Guest Story: **Outfit A** hoặc **B** — casual elegant

**Cấu trúc scene theo pillar:**
- View & Vibe: cảnh hồ → cửa sổ phòng → cinematic close
- Room Tour: exterior khách sạn → trong phòng → reveal view
- Local Life: hotel (bắt đầu) → local context → hotel (kết thúc)
- Deal: text hook → phòng đẹp → CTA mạnh
- Guest Story: quote/review → cảnh phòng/view → CTA

**Màu nhận diện Linh An:** Beige · Cream · White · Gold (đồng bộ Ven Hồ Hotel)

---

**Hotel Visual DNA — environment descriptions trong mỗi scene phải khớp:**

| Scene location | Mô tả environment bắt buộc |
|---------------|---------------------------|
| Phòng (trong) | Wood floor, brown furniture, large black-frame windows reaching ceiling, dark grey curtains, black artistic iron railing visible outside |
| Cửa sổ / view | Black iron railing with symmetrical scroll pattern · jade-teal West Lake beyond · mature trees lining Nguyễn Đình Thi |
| Rooftop | Red brick floor, open sky, panoramic West Lake view · black box iron railings with round circle signature |
| Hành lang | Short corridor, dark brown wood doors, brown-yellow tiled floor |
| Mặt tiền | White neoclassical facade, black railings on every floor, VEN HO HOTEL signage |
| Nguyễn Đình Thi | 2-lane road, Hanoi motorcycles, ivory modern lakeside railing, large mature trees |
| Hoàng hôn | 16:30–18:30 · buildings turn golden orange · lake reflects warm sunlight · Hồ Tây jade-teal `#4E8FA0` |

**KHÔNG generate:** blue-glass modern hotel · Korean/Singapore/Dubai style · artificial lake · dense skyline · old jade stone railing

> Nguồn đầy đủ: `projects/VenHoBrandSystem/DNA/VENHO_HOTEL_MASTER_REFERENCE_PACK_v1_FINAL.md`

## Sau khi tạo xong

Hỏi Harry: "Bạn có muốn mình thêm video này vào `content-calendar.md` không?"
- Nếu có: đọc file calendar, thêm dòng vào tuần phù hợp với ngày đăng đã chọn.
- Nếu không: kết thúc.
