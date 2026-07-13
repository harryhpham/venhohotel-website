# OTA module working rules

Đọc `PLAN_OTA.md` trước mọi task. Phase hiện tại là P0; không code vượt phase khi G0 chưa ký.

- Enforce R1-R10; dependency chỉ hướng `domain <- application <- adapters|api|agent|dashboard`.
- Không auto-reopen. LLM không nằm trên critical path.
- External write cần approval/allowlist, idempotency key, revalidation và append-only audit.
- Chạy `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm golden` cho DoD.
