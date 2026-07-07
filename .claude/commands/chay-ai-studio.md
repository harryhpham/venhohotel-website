Chạy VENHO AI Studio — pipeline chuyển ảnh thành DNA / observation file.

## Đầu vào

`$ARGUMENTS` có thể là:
- Subject ngắn: `/chay-ai-studio room` → Mode B với subject room
- Để trống → Claude hỏi từng bước

---

## Quy trình thực hiện

### Bước 0 — Xác định mode và subject

Nếu `$ARGUMENTS` trống, hỏi Harry:

1. **Mode nào?**
   - **A** — Phân tích từng ảnh riêng lẻ (bất kỳ ảnh nào → ra `.md` + `.json`)
   - **B** — Tổng hợp nhiều ảnh cùng subject → DNA file (khuyến nghị cho hotel)

2. **Subject** (chỉ hỏi nếu Mode B):
   - `room` — Phòng khách sạn (8 ảnh sẵn có)
   - `lobby` — Sảnh
   - `linh_an` — Khuôn mặt Linh An
   - `westlake` — Hồ Tây
   - Subject khác (sẽ dùng universal schema)

3. **Thư mục ảnh đầu vào** (nếu không dùng thư mục mặc định):
   - Mặc định Mode B room: `data/media/rooms`
   - Mặc định Mode A: `data/projects/_inbox/media`

---

### Bước 1 — Chạy pipeline

**Working directory:** `/Users/hanhpham/Developer/Claude-Workspace/projects/03_AI_STUDIO/venho-ai-studio`

Chạy bằng Bash tool với lệnh tương ứng:

**Mode B (tổng hợp DNA):**
```bash
cd "/Users/hanhpham/Developer/Claude-Workspace/projects/03_AI_STUDIO/venho-ai-studio" && \
export PATH="$HOME/Library/Python/3.9/bin:$PATH" && \
venho vision observe --mode b --project venho_hotel --subject {subject} --input {input_dir}
```

**Mode A (phân tích từng ảnh):**
```bash
cd "/Users/hanhpham/Developer/Claude-Workspace/projects/03_AI_STUDIO/venho-ai-studio" && \
export PATH="$HOME/Library/Python/3.9/bin:$PATH" && \
venho vision observe --mode a --input {input_dir} --output {output_dir}
```

Nếu `venho` không tìm thấy, dùng fallback:
```bash
python3 -m knowledge_studio.vision.cli vision observe --mode {mode} ...
```

---

### Bước 2 — Báo kết quả

Sau khi chạy xong, đọc output và báo Harry:

**Mode B:**
- File DNA tạo ra: `data/projects/venho_hotel/knowledge/VENHO_HOTEL_{SUBJECT}_DNA.md`
- Bao nhiêu INVARIANT features (đặc điểm cố định)
- Bao nhiêu VARIABLE features (đặc điểm thay đổi)
- Bao nhiêu FORBIDDEN (gợi ý cấm cho AI)
- Nếu "no change detected" → báo DNA đã up-to-date, không mất thêm API cost

**Mode A:**
- Bao nhiêu ảnh đã xử lý
- Output directory
- Cache hits (ảnh đã cache trước → không tốn API)

---

### Bước 3 — Hỏi tiếp theo

Sau khi hoàn tất:
- Mode B: "Bạn có muốn mình đọc và tóm tắt DNA vừa tạo không?"
- Mode A: "Bạn có muốn mình đọc observation của ảnh cụ thể nào không?"

---

## Thông tin tham chiếu

**AI Studio location:** `/Users/hanhpham/Developer/Claude-Workspace/projects/03_AI_STUDIO/venho-ai-studio/`

**Subjects & input dirs:**
| Subject | Input dir | Output |
|---------|-----------|--------|
| room | `data/media/rooms` | `data/projects/venho_hotel/knowledge/VENHO_HOTEL_ROOM_DNA.md` |
| lobby | `data/media/lobby` | `data/projects/venho_hotel/knowledge/VENHO_HOTEL_LOBBY_DNA.md` |
| linh_an | `data/media/linh_an` | `data/projects/venho_hotel/knowledge/VENHO_HOTEL_LINH_AN_DNA.md` |
| westlake | `data/media/westlake` | `data/projects/venho_hotel/knowledge/VENHO_HOTEL_WESTLAKE_DNA.md` |

**Chi phí ước tính Mode B — 8 ảnh phòng:**
- Pass 1 (GPT-4o Vision): ~$0.04–0.08
- Pass 2B (Claude): < $0.01
- **Tổng: ~$0.05–0.10** (< 2,500đ)

**Không muốn tốn API — thêm `--provider mock`** vào lệnh để chạy thử offline.

**Pass 2A là code thuần (không gọi AI)** — tính coverage + consistency tất định:
- `coverage ≥ 60% AND consistency ≥ 70%` → INVARIANT
- `coverage ≥ 60% but consistency < 70%` → VARIABLE
- `coverage < 30%` → WEAK FEATURE
