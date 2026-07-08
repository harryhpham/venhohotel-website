"""
post_to_make.py — Send generated social content to a Make.com custom webhook.

Gửi JSON thuần (không đính kèm file binary). Make.com module `HTTP -> Get a file`
sẽ tự tải ảnh từ `image_url` (link public trên Google Drive).

Expected environment:
  MAKE_WEBHOOK_URL=https://hook.make.com/...
  MAKE_WEBHOOK_SECRET=optional-shared-secret
"""

import json
import os
from urllib import request


def send_to_make(pillar: dict, topic: dict, content: dict, file_info: dict, image_url: str) -> str:
    webhook_url = os.environ.get("MAKE_WEBHOOK_URL", "").strip()
    if not webhook_url:
        return "skipped: MAKE_WEBHOOK_URL is not set"

    payload = {
        "source": "VenHoSocialManager",
        "status": "ready_to_publish",
        "date": file_info["date"],
        "folder": file_info["folder"],
        "pillar_id": pillar["id"],
        "pillar_name": pillar["name"],
        "topic_id": topic["id"],
        "topic_title": topic["title"],
        "title": content["title"],
        "facebook_caption": content["facebook_caption"],
        "instagram_caption": content["instagram_caption"],
        "threads_caption": content.get("threads_caption", ""),
        "hashtags_all": content.get("hashtags_all", []),
        "image_prompt": content.get("image_prompt", ""),
        "image_url": image_url,
    }

    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "VenHoSocialManager/1.0",
    }
    webhook_secret = os.environ.get("MAKE_WEBHOOK_SECRET", "").strip()
    if webhook_secret:
        headers["X-VenHo-Secret"] = webhook_secret

    req = request.Request(webhook_url, data=body, headers=headers, method="POST")
    with request.urlopen(req, timeout=60) as resp:
        response_text = resp.read().decode("utf-8", errors="replace")
        return f"posted: HTTP {resp.status} {response_text[:200]}"
