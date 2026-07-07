"""
post_to_make.py — Send generated social content to a Make.com custom webhook.

Expected environment:
  MAKE_WEBHOOK_URL=https://hook.make.com/...
  MAKE_WEBHOOK_SECRET=optional-shared-secret
"""

import json
import mimetypes
import os
import uuid
from pathlib import Path
from urllib import request


def _field_part(boundary: str, name: str, value: str) -> bytes:
    return (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="{name}"\r\n\r\n'
        f"{value}\r\n"
    ).encode("utf-8")


def _file_part(boundary: str, name: str, file_path: Path) -> bytes:
    filename = file_path.name
    content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
    header = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'
        f"Content-Type: {content_type}\r\n\r\n"
    ).encode("utf-8")
    return header + file_path.read_bytes() + b"\r\n"


def send_to_make(pillar: dict, topic: dict, content: dict, file_info: dict, image_path: Path) -> str:
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
    }

    boundary = f"----VenHoMakeBoundary{uuid.uuid4().hex}"
    body = bytearray()

    # Flat fields make mapping easier in Make.com.
    for key, value in payload.items():
        if isinstance(value, (list, dict)):
            value = json.dumps(value, ensure_ascii=False)
        body.extend(_field_part(boundary, key, str(value)))

    body.extend(_field_part(boundary, "payload_json", json.dumps(payload, ensure_ascii=False)))
    body.extend(_file_part(boundary, "image", image_path))
    body.extend(f"--{boundary}--\r\n".encode("utf-8"))

    headers = {
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "User-Agent": "VenHoSocialManager/1.0",
    }
    webhook_secret = os.environ.get("MAKE_WEBHOOK_SECRET", "").strip()
    if webhook_secret:
        headers["X-VenHo-Secret"] = webhook_secret

    req = request.Request(webhook_url, data=bytes(body), headers=headers, method="POST")
    with request.urlopen(req, timeout=60) as resp:
        response_text = resp.read().decode("utf-8", errors="replace")
        return f"posted: HTTP {resp.status} {response_text[:200]}"
