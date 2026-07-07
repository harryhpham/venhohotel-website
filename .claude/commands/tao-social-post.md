Tạo bài viết text + ảnh AI bằng gpt-image-2 để đăng Facebook, Instagram và Threads cho Ven Hồ Hotel.
Tuân theo Content Strategy v2.0 — bao gồm phân tích funnel, nguyên tắc vàng và chấm điểm 100 trước khi xuất bản.

## Đầu vào

`$ARGUMENTS` có thể là:
- Concept ngắn: `/tao-social-post Hoàng hôn Hồ Tây tháng 7`
- Pillar + concept: `/tao-social-post [P4] Khách đoàn từ Sài Gòn check-in cuối tuần`
- Hoặc để trống — Claude hỏi thêm

Nếu `$ARGUMENTS` trống, hỏi Harry:
1. Concept bài viết là gì? (1–2 câu)
2. Pillar: P1 Khám Phá Hồ Tây / P2 Ẩm Thực Hồ Tây / P3 Kinh Nghiệm Công Tác / P4 Trải Nghiệm Khách Hàng / P5 Thương Hiệu Ven Hồ Hotel?
3. Có muốn Linh An xuất hiện trong ảnh không?

---

## Quy trình thực hiện

### Bước 1 — Xác định thư mục output

- Lấy ngày hôm nay dạng `YYYY-MM-DD`
- Tạo slug từ concept: chữ thường, dấu gạch ngang, tối đa 4 từ tiếng Việt không dấu  
  VD: "Hoàng hôn Hồ Tây" → `hoang-hon-ho-tay`
- Đường dẫn output:
  ```
  ops/VenHoSocialManager/database/YYYY/MM/YYYY-MM-DD_{slug}/
  ```

---

### Bước 2 — Phân tích trước khi viết (Content Strategy v2.0)

Trước khi viết, phân tích và ghi rõ ra:

**A. Người đọc là ai?**  
Chọn persona phù hợp nhất:
- Persona 1 — Khách du lịch Việt (25–45, nghỉ cuối tuần, check-in đẹp)
- Persona 2 — Khách công tác (28–55, yên tĩnh, wifi, tiện di chuyển)
- Persona 3 — Khách quốc tế (Hàn, Nhật, Châu Âu, Mỹ)

**B. Họ đang quan tâm điều gì?**  
Ví dụ: Ở đâu gần Hồ Tây? · Hồ Tây có gì chơi? · Gần đó có gì ăn uống? · Khách sạn có yên tĩnh không?

**C. Funnel stage:**
- **TOFU (60%)** — Hồ Tây, cảnh đẹp, ẩm thực, địa điểm → thu hút người chưa biết
- **MOFU (30%)** — Review, kinh nghiệm, social proof → xây dựng niềm tin
- **BOFU (10%)** — Giới thiệu phòng, ưu đãi, CTA đặt phòng → chuyển đổi

**D. Nguyên tắc vàng — bài phải thuộc ít nhất một trong:**
- **Inspire** — truyền cảm hứng (cảnh đẹp, câu chuyện, cảm xúc)
- **Educate** — cung cấp giá trị thực tế (tips, kinh nghiệm, thông tin hữu ích)
- **Trust** — tạo niềm tin (review thật, social proof, số liệu thật)

> **Nếu bài chỉ bán phòng mà không Inspire / Educate / Trust → không viết, đề xuất lại concept.**

**E. Linh An có xuất hiện không?** (30–40% bài đăng)

Ghi tóm tắt phân tích ra trước khi sang Bước 3.

---

### Bước 3 — Viết 3 caption + 1 image prompt

Dựa vào phân tích ở Bước 2 để viết đúng tone và funnel stage.

#### Facebook (lưu vào `facebook.txt`)

- 150–250 từ, tiếng Việt
- Tone: storytelling, ấm áp, chân thực — như kể chuyện cho bạn
- Cấu trúc: **Hook 1 câu** → câu chuyện 3–4 câu → thông tin thực tế → CTA mềm
- CTA chuẩn v2.0: *"Nếu bạn đang tìm..."* — **không** dùng *"Đặt ngay hôm nay!"*
- Cuối bài: địa chỉ + phone + website
- Hashtag: 5–8 hashtag, đặt dưới cùng

```
[Viết caption Facebook đầy đủ ở đây]

📍 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội
📞 024 3847 4646
🌐 venhohotel.com

#VenHoHotel #HoTay #TayHo [thêm hashtag phù hợp với pillar]
```

**Hashtag theo pillar:**
- P1 Khám Phá Hồ Tây: `#HồTây` `#WestLake` `#HanoiSunset` `#BìnhMinhHàNội` `#HàNộiMùaHoa`
- P2 Ẩm Thực Hồ Tây: `#HanoiFood` `#HanoiCafe` `#ẨmThựcHàNội` `#BánhTômHồTây`
- P3 Kinh Nghiệm Công Tác: `#BusinessTravel` `#CôngTácHàNội` `#WorkFromHanoi`
- P4 Trải Nghiệm Khách Hàng: `#GuestLove` `#ReviewThật` `#AgodaReview` `#CheckinHanoi`
- P5 Thương Hiệu: `#VenHoHotel` `#KháchSạnHồTây` `#BoutiqueHotel`

#### Instagram (lưu vào `instagram.txt`)

- 80–120 từ
- Tone: lifestyle, visual, gọn gàng — ngắn hơn Facebook
- Dòng đầu là hook mạnh (emoji OK, nhưng tiết kiệm)
- Không kể dài dòng — gợi cảm xúc qua hình ảnh ngôn từ
- Hashtag: 15–20 (mix VI/EN, mỗi hashtag ngắn)

```
[Hook mạnh dòng 1]

[Nội dung 3–5 dòng]

📍 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội
📲 Đặt phòng: Link in bio

#VenHoHotel #HoTay #TayHo #HanoiHotel #KhachSanHaNoi #HanoiTravel #WestLake [thêm]
```

#### Threads (lưu vào `threads.txt`)

- 100–150 từ
- Tone: conversational, gần gũi, như nói chuyện với người quen
- Ít emoji hơn — không phải visual platform
- Hashtag: 3–5 tối đa
- CTA nhẹ nhàng, tự nhiên — không ép

#### Image Prompt (lưu vào `image_prompt.txt`)

- Viết bằng tiếng Anh
- Mô tả: subject → environment → lighting → mood → style
- Phải phù hợp với concept và tạo được ảnh đẹp cho social media
- Nếu Linh An xuất hiện: thêm **Face Lock v3.0** vào đầu prompt (xem phần tham chiếu bên dưới)
- Kết thúc với: `Photorealistic, 4K, professional photography, luxury boutique hotel aesthetic, warm tones.`

Ví dụ format (không có Linh An):
```
A tranquil West Lake view at golden hour seen from a hotel balcony.
Soft warm light reflects on the calm lake surface. A cup of tea sits
on the railing. Bokeh background, lush green trees lining the shore.
Cinematic depth of field. Photorealistic, 4K, professional photography,
luxury boutique hotel aesthetic, warm tones.
```

**Hotel Visual DNA — áp dụng khi ảnh có khách sạn / phòng / Hồ Tây:**

| Element | Mô tả bắt buộc trong prompt |
|---------|----------------------------|
| Phòng & cửa sổ | Large black-frame floor-to-ceiling windows, dark grey curtains |
| Lan can phòng | Black artistic iron railing, symmetrical scroll pattern, floral center motif |
| Lan can ven hồ | Ivory white modern iron railing running continuously along lakeside |
| Mặt tiền | White neoclassical facade, decorative columns, black railings on every floor |
| Rooftop | Red brick open rooftop, no fixed roof — sky 55–65%, lake 25–35% |
| Màu nước Hồ Tây | Jade-teal `#4E8FA0` (ngày) · golden orange reflection (hoàng hôn 16:30–18:30) |
| Hoàng hôn | Buildings on Nguyễn Đình Thi turn golden orange, lake reflects warm sunlight |
| Nguyễn Đình Thi | 2-lane road, Hanoi motorcycles, parked cars, large mature trees |

**KHÔNG BAO GIỜ generate:** blue-glass modern hotel · Korean/Singapore style · artificial lake · dense urban skyline

> Nguồn đầy đủ: `projects/VenHoBrandSystem/DNA/VENHO_HOTEL_MASTER_REFERENCE_PACK_v1_FINAL.md`

---

### Bước 4 — Chấm điểm nội dung (100 điểm)

Tự chấm điểm 3 caption (Facebook, Instagram, Threads) theo thang sau. Nếu < 80 → chỉnh sửa trước khi tiếp tục.

| Tiêu chí | Điểm tối đa | Câu hỏi kiểm tra |
|---------|-------------|-----------------|
| SEO | 25 | Có keyword tự nhiên không? (Hồ Tây, Tây Hồ, Nguyễn Đình Thi, Hà Nội...) |
| Giá trị cho người đọc | 25 | Người đọc học được / cảm nhận được điều gì mới không? |
| Khả năng chia sẻ | 20 | Có đủ hấp dẫn để share / save không? |
| Khả năng chuyển đổi | 15 | CTA mềm, tự nhiên, không ép buộc? |
| Độ phù hợp thương hiệu | 15 | Đúng tone Boutique · Local · Trustworthy · Helpful? |

**Kết quả:**
- ≥ 80 điểm → tiếp tục
- < 80 điểm → ghi rõ điểm nào thiếu → chỉnh sửa caption → chấm lại

**Nguyên tắc vàng check (lần cuối):**
- [ ] Inspire / Educate / Trust — đã pass ít nhất 1?
- [ ] Bài không chỉ bán phòng?

**Decision Framework — 5 câu hỏi cuối trước khi tiếp tục:**
1. Nội dung này có giúp ích cho người đọc không?
2. Nội dung này có củng cố thương hiệu Ven Hồ Hotel không?
3. Nội dung này có phù hợp với Hồ Tây không?
4. Nội dung này có phù hợp với định vị Boutique · Local · Trustworthy không?
5. Harry có approve nội dung này không?
> Nếu bất kỳ câu nào = Không → chỉnh lại, không sang Bước 5.

---

### Bước 5 — Tạo file meta.json

```json
{
  "date": "YYYY-MM-DD",
  "concept": "[concept Harry nhập]",
  "pillar": "[P1–P5 + tên pillar]",
  "funnel_stage": "[TOFU|MOFU|BOFU]",
  "persona": "[Persona 1|2|3]",
  "golden_rule": "[Inspire|Educate|Trust]",
  "score": [điểm 0–100],
  "linh_an": [true|false],
  "source": "manual-skill",
  "status": "pending_review"
}
```

### Bước 6 — Ghi tất cả file

Dùng Write tool lưu 5 file:
- `facebook.txt`
- `instagram.txt`
- `threads.txt`
- `image_prompt.txt`
- `meta.json`

Tất cả vào đúng thư mục output đã xác định ở Bước 1.

---

### Bước 7 — Tạo ảnh bằng gpt-image-2

gpt-image-2 hỗ trợ 3 kích thước platform-specific. Chọn size phù hợp:

| Size | Dùng khi |
|------|----------|
| `portrait` (1024×1280, 4:5) | Instagram Feed — **khuyến nghị mặc định** |
| `square` (1024×1024, 1:1) | Facebook, đăng đồng thời nhiều nền tảng |
| `story` (1088×1920, 9:16) | Stories, Reels |

Hỏi Harry: "Ảnh dùng chủ yếu cho platform nào?" — rồi chạy:

**Nếu `linh_an: true` — BẮT BUỘC dùng `--ref` với Master Face (đạt 9/10 nhận diện):**
```bash
cd "ops/VenHoSocialManager" && python3 generate_image.py "[scene prompt]" "database/YYYY/MM/YYYY-MM-DD_{slug}" [portrait|square|story] --ref "assets/linh-an-master-face.png"
```

> **Image prompt khi dùng `--ref`:** KHÔNG mô tả lại khuôn mặt. Chỉ mô tả SCENE: outfit, background, action, ánh sáng. AI tự giữ khuôn mặt từ reference.

**Nếu không có Linh An — text-to-image thông thường:**
```bash
cd "ops/VenHoSocialManager" && python3 generate_image.py "[full image prompt]" "database/YYYY/MM/YYYY-MM-DD_{slug}" [portrait|square|story]
```

**Reference images có sẵn tại `ops/VenHoSocialManager/assets/`:**
| File | Góc | Dùng khi |
|------|-----|---------|
| `linh-an-master-face.png` | ~15° trái, tóc xõa | Lifestyle, scene tự nhiên |
| `B3_Hero.png` | 3/4 trái — Hero canonical | Production chính thức |
| `A2_Front.png` | Thẳng mặt | Cần góc đối xứng |
| `C_LeftProfile.png` | Profile trái | Silhouette shots |
| `D_RightProfile.png` | Profile phải | Silhouette shots |

Nếu script báo lỗi thiếu thư viện: `pip3 install openai python-dotenv`

---

### Bước 7b — Upload Google Drive + cập nhật Content bank

**Chạy ngay sau khi ảnh được tạo xong.**

**1. Upload lên Google Drive:**
```bash
cd "ops/VenHoSocialManager" && python3 google_drive.py upload "database/YYYY/MM/YYYY-MM-DD_{slug}"
```
Ghi lại URL Drive từ output (dòng cuối, dạng `https://drive.google.com/drive/folders/...`).

**2. Cập nhật `meta.json`** — thêm `drive_url`:
Dùng Edit tool, thêm trường `"drive_url": "[URL vừa lấy]"` vào `meta.json`.

**3. Cập nhật `database/index.json`** — đọc file, thêm entry mới vào cuối mảng `entries`:
```json
{
  "date": "YYYY-MM-DD",
  "pillar_name": "[P1–P5 + tên pillar]",
  "funnel_stage": "[TOFU|MOFU|BOFU]",
  "topic_title": "[3-4 từ tóm tắt concept]",
  "title": "[concept đầy đủ]",
  "score": [điểm],
  "status": "pending_review",
  "folder": "YYYY/MM/YYYY-MM-DD_{slug}",
  "drive_url": "[URL Drive]",
  "source": "manual-skill"
}
```

**4. Cập nhật `database/index.md`** — thêm dòng mới vào cuối bảng:
```
| YYYY-MM-DD | [emoji] [pillar] | [funnel] | [topic ngắn] | [score]/100 | pending_review |
```

Emoji pillar: P1 Khám Phá Hồ Tây → 🌅 · P2 Ẩm Thực Hồ Tây → 🍜 · P3 Công Tác → 💼 · P4 Trải Nghiệm Khách → ⭐ · P5 Thương Hiệu → 🏨

---

### Bước 8 — Báo cáo kết quả

Trình bày cho Harry:

1. **Phân tích:** Persona · Funnel stage · Nguyên tắc vàng
2. **Điểm số:** [X]/100 — ghi điểm từng tiêu chí
3. **Đường dẫn output:** `ops/VenHoSocialManager/database/YYYY/MM/YYYY-MM-DD_{slug}/`
4. **Facebook** — preview 3 dòng đầu
5. **Instagram** — preview 3 dòng đầu
6. **Threads** — preview 3 dòng đầu
7. **Ảnh:** đã tạo / lỗi (ghi rõ nếu lỗi)

Sau đó hiển thị checklist đăng bài:

```
Checklist đăng bài:
  [ ] Xem ảnh image.png — đạt chất lượng?
  [ ] Điểm nội dung ≥ 80/100?
  [ ] Copy facebook.txt → đăng Facebook Page
  [ ] Copy instagram.txt + ảnh → đăng Instagram Feed
  [ ] Copy threads.txt → đăng Threads
  [ ] Lên lịch: FB 07:00/11:30/19:00 · IG 08:00/20:00
```

Hỏi cuối: "Muốn mình gửi email preview không?" — nếu có:
```bash
cd "ops/VenHoSocialManager" && python3 send_email.py
```

---

## Thông tin tham chiếu

### Khách sạn
- **Tên:** Ven Hồ Hotel · **Tagline:** *"Nơi Hồ Tây Gặp Gỡ Sự Tinh Tế"*
- **Địa chỉ:** 181 Nguyễn Đình Thi, Tây Hồ, Hà Nội
- **Phone:** 024 3847 4646 · **Email:** venhohotel@gmail.com
- **Website:** venhohotel.com · **Facebook:** venhohotelhanoi · **Instagram:** @venhohotelhanoi
- **Agoda:** 8.5/10 tổng thể · 9.2/10 vị trí · 45 reviews
- **Giá:** Deluxe Đôi từ 400K · View Hồ Tây từ 600K · Triple từ 500K · 12 phòng boutique

### Brand Voice (v2.0)
- **Phong cách:** Boutique · Local · Trustworthy · Helpful
- **KHÔNG:** quảng cáo lộ liễu · clichê "sang trọng đẳng cấp" · emoji spam · hard-sell · CTA ép *"Đặt ngay!"*
- **LUÔN:** cụ thể · hình ảnh rõ ràng · câu chuyện thật · CTA nhẹ nhàng kiểu *"Nếu bạn đang tìm..."*
- **Hồ Tây là nhân vật chính** — khách sạn là nơi trải nghiệm Hồ Tây tốt nhất

### 5 Content Pillars (v2.0)
1. **P1 — Khám Phá Hồ Tây** (40%) — bình minh, hoàng hôn, Nguyễn Đình Thi, mùa sen, mùa thu
2. **P2 — Ẩm Thực Hồ Tây** (20%) — bánh tôm, phở, bún chả, cafe ven hồ, quán địa phương
3. **P3 — Kinh Nghiệm Công Tác** (15%) — lịch trình, coworking, di chuyển sân bay, tips
4. **P4 — Trải Nghiệm Khách Hàng** (15%) — review Agoda, câu chuyện khách, social proof
5. **P5 — Thương Hiệu Ven Hồ Hotel** (10%) — đội ngũ, hậu trường, phòng, ưu đãi

### Linh An — Face Lock v3.0 (production validated)
Dùng khi `linh_an: true` — thêm vào **đầu** image prompt:

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

**Outfit theo Pillar:**
- P1 View & Vibe → Outfit B: flowing white dress, minimal gold jewelry
- P2 Ẩm Thực / Local → Outfit A: cream knit top, beige A-line skirt
- P3 Công Tác → Outfit D: light beige blazer, white blouse, elegant trousers
- P4 Guest Story → Outfit A hoặc B
- P5 Thương Hiệu → Outfit D

### Brand Principles (DNA v1.1)
- **Core Values:** Hospitality · Authenticity · Simplicity · Reliability · Warmth
- **Xung đột:** Authenticity > Beauty · Trust > Promotion · Brand Value > Short-Term
- **Không bao giờ:** clickbait · hard-sell · luxury exaggeration · generic travel clichés
- **DNA đầy đủ:** `projects/VenHoBrandSystem/DNA/Linh An Universe/01_BRAND_SYSTEM.md`

### Màu sắc brand
Gold `#C9A84C` · Deep Navy `#1B2D4F` · Warm White `#F7F4EF` · Cream `#EDE8E0`

### Hotel Visual DNA — LOCKED v1.0
*(19 DNA blocks — dùng để verify mọi ảnh AI trước khi xuất bản)*

**Building:** White neoclassical facade · decorative columns · black metal railings all floors · VEN HO HOTEL signage  
**Lobby:** Brown-red wood reception desk · marble floor with circular brown pattern · high ceiling  
**Lake View Room:** Double bed · wood floor · brown furniture · black-frame large windows reaching ceiling · dark grey curtains  
**Railing (phòng):** Black artistic iron · symmetrical scroll · floral center — **dấu hiệu nhận diện mạnh nhất**  
**Railing (rooftop):** Black box iron · uniform vertical bars · horizontal rails · round circles signature  
**Rooftop:** Red brick · fully open · Sky 55–65% · Lake 25–35% · Foreground 10–15%  
**Nguyễn Đình Thi:** 2-lane · motorcycles · ivory white modern lakeside railing  
**Hồ Tây:** Jade-teal `#4E8FA0` · very wide · sky 50–65% frame · low horizon  
**Hoàng hôn:** 16:30–18:30 · buildings turn golden orange · lake reflects warm light  
**Linh An tại Ven Hồ:** Đúng lan can đen · đúng cửa sổ khung đen · đúng Hồ Tây · đúng Nguyễn Đình Thi · đúng màu nước

**KHÔNG:** Blue-glass modern hotel · Korean/Singapore/Dubai style · artificial lake · dense skyline · old jade stone railing

> File: `projects/VenHoBrandSystem/DNA/VENHO_HOTEL_MASTER_REFERENCE_PACK_v1_FINAL.md`
