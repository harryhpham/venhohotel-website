import { NextRequest, NextResponse } from "next/server";

// Temporary, one-time bootstrap route for venho-ota-agent's Zalo OA OAuth flow (G0C-6 P1-alert
// channel, 2026-07-15). Zalo requires a verified real domain as the redirect_uri — this repo's
// domain (venhohotel.com) was already verified for the Zalo app, so this route exists only to
// display the `code`/`oa_id` query params for Harry to copy into the token-exchange script running
// on his own machine. Stores nothing, calls nothing external, and should be deleted once the
// initial refresh token has been obtained — see venho-ota-agent/task_memory.md.
function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const oaId = req.nextUrl.searchParams.get("oa_id");

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Zalo OA callback</title></head>
<body style="font-family: monospace; padding: 2rem; max-width: 640px;">
  <h2>Zalo OA authorization callback</h2>
  <p>Copy 2 giá trị dưới đây vào script lấy token trên máy — không gửi qua chat/email.</p>
  <p><strong>code:</strong><br><textarea readonly style="width:100%;height:4rem;">${escapeHtml(code ?? "(không có)")}</textarea></p>
  <p><strong>oa_id:</strong><br><textarea readonly style="width:100%;height:2rem;">${escapeHtml(oaId ?? "(không có)")}</textarea></p>
</body></html>`;

  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
