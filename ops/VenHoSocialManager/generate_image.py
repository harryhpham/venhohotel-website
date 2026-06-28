#!/usr/bin/env python3
"""
generate_image.py — Tạo ảnh bằng gpt-image-2 từ prompt cho trước.
Dùng bởi skill /tao-social-post trong VSCode.

Usage:
    # Text-to-image (không có reference)
    python3 generate_image.py "prompt" "output_dir" [size]

    # Image editing (có reference face — khuyến nghị cho Linh An)
    python3 generate_image.py "prompt" "output_dir" [size] --ref "assets/linh-an-master-face.png"

    # Dual reference (face + environment)
    python3 generate_image.py "prompt" "output_dir" [size] --ref "assets/linh-an-master-face.png" --ref-env "assets/Rooftop-railing.jpeg"

    size (tuỳ chọn):
        square   → 1024x1024  (mặc định — FB, IG vuông)
        portrait → 1024x1280  (4:5 — IG Feed dọc, tối ưu reach)
        story    → 1088x1920  (9:16 — Stories, Reels)
        hoặc trực tiếp WIDTHxHEIGHT bất kỳ (cả hai chia hết 16, tỷ lệ 1:3 → 3:1)
"""

import base64
import json
import sys
from pathlib import Path
from datetime import datetime

from dotenv import load_dotenv
from openai import OpenAI

BASE_DIR = Path(__file__).parent
load_dotenv(BASE_DIR / ".env")

CONFIG     = json.loads((BASE_DIR / "config.json").read_text(encoding="utf-8"))
MODEL      = CONFIG.get("dalle_model", "gpt-image-2")
QUALITY    = CONFIG.get("image_quality", "high")
SIZE_PRESETS = CONFIG.get("image_sizes", {
    "square":   "1024x1024",
    "portrait": "1024x1280",
    "story":    "1088x1920",
})


def log(msg: str):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


def resolve_size(raw: str) -> str:
    return SIZE_PRESETS.get(raw, raw) if raw else SIZE_PRESETS["square"]


def parse_args(argv):
    """Parse arguments, hỗ trợ --ref và --ref-env flags."""
    if len(argv) < 3:
        print("Usage: python3 generate_image.py \"prompt\" \"output_dir\" [square|portrait|story|WxH] [--ref path] [--ref-env path]")
        sys.exit(1)

    prompt     = argv[1]
    output_dir = Path(argv[2])
    ref_path     = None
    ref_env_path = None
    size_raw   = "square"

    remaining = argv[3:]
    i = 0
    while i < len(remaining):
        if remaining[i] == "--ref" and i + 1 < len(remaining):
            ref_path = Path(remaining[i + 1])
            i += 2
        elif remaining[i] == "--ref-env" and i + 1 < len(remaining):
            ref_env_path = Path(remaining[i + 1])
            i += 2
        else:
            size_raw = remaining[i]
            i += 1

    return prompt, output_dir, resolve_size(size_raw), ref_path, ref_env_path


def generate_with_text(client, prompt, size):
    """Text-to-image thuần tuý."""
    return client.images.generate(
        model=MODEL,
        prompt=prompt,
        size=size,
        quality=QUALITY,
        output_format="png",
        n=1,
    )


def generate_with_reference(client, prompt, size, ref_path, ref_env_path=None):
    """Image editing — dùng ảnh tham chiếu để giữ khuôn mặt nhân vật.
    Nếu có ref_env_path, truyền cả hai để AI hiểu environment thực tế."""
    if not ref_path.exists():
        log(f"LỖI — Không tìm thấy ảnh tham chiếu: {ref_path}")
        log("Chuyển sang text-to-image (không có reference)...")
        return generate_with_text(client, prompt, size)

    if ref_env_path and ref_env_path.exists():
        log(f"Reference face: {ref_path}")
        log(f"Reference env : {ref_env_path}")
        with open(ref_path, "rb") as face_file, open(ref_env_path, "rb") as env_file:
            return client.images.edit(
                model=MODEL,
                image=[face_file, env_file],
                prompt=prompt,
                size=size,
                n=1,
            )
    else:
        log(f"Reference: {ref_path}")
        with open(ref_path, "rb") as img_file:
            return client.images.edit(
                model=MODEL,
                image=img_file,
                prompt=prompt,
                size=size,
                n=1,
            )


def main():
    prompt, output_dir, size, ref_path, ref_env_path = parse_args(sys.argv)

    output_dir.mkdir(parents=True, exist_ok=True)

    if ref_path and ref_env_path:
        mode = "edit (face + environment refs)"
    elif ref_path:
        mode = "edit (reference face)"
    else:
        mode = "generate (text-to-image)"

    log(f"Model   : {MODEL}  (quality={QUALITY})")
    log(f"Mode    : {mode}")
    log(f"Size    : {size}")
    log(f"Output  : {output_dir}")
    log("Đang tạo ảnh...")

    client = OpenAI()

    if ref_path:
        result = generate_with_reference(client, prompt, size, ref_path, ref_env_path)
    else:
        result = generate_with_text(client, prompt, size)

    image_path = output_dir / "image.png"
    image_data = result.data[0]

    # gpt-image-2 trả về b64_json hoặc url tuỳ endpoint
    if hasattr(image_data, "b64_json") and image_data.b64_json:
        image_path.write_bytes(base64.b64decode(image_data.b64_json))
    elif hasattr(image_data, "url") and image_data.url:
        import urllib.request
        urllib.request.urlretrieve(image_data.url, image_path)
    else:
        log("LỖI — Không nhận được dữ liệu ảnh từ API.")
        sys.exit(1)

    log(f"OK — Ảnh lưu tại: {image_path.resolve()}")


if __name__ == "__main__":
    main()
