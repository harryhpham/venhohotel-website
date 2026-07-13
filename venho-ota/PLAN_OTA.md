# PLAN_OTA v1.4 — implementation pointer

Nguồn quy chuẩn được Owner cung cấp: `PLAN_OTA_DENSE.md v1.4-dense` (263 dòng). File nguồn thắng khi mâu thuẫn.

## Phase P0 đang thực thi

Scaffold clean architecture; shared Zod schemas; domain entities/state machines/guardrails/TTL; SQLite WAL + migrations + backup; mock connector + seed; orchestrator/mode guard/control API; dashboard wireframe. Không kết nối thật và không external write trước G0.

## Hard rules

R1 LLM không ở critical path. R2 mọi external write cần approval hoặc allowlist, idempotency và audit. R3 re-read/context hash trước write. R4 STALE/EXPIRED không execute. R5 guardrails chỉ ở domain policy. R6 dashboard giao tiếp qua API/SQLite, không file. R7 không auto-reopen. R8 mode check đầu run và trước write; E-stop chặn cứng. R9 secret từ env, mask PII. R10 schema/version/run/audit đầy đủ.

## P0 QA pass (2026-07-13)

Rà soát toàn bộ scaffold P0 (domain/application/adapters/agent/api/shared + tests/scripts). Kết quả: `pnpm typecheck`, `pnpm lint`, `pnpm test` (44/44), `pnpm golden` (3/3) đều pass sau các sửa lỗi sau:

- **Sửa lỗi nghiêm trọng:** `SqliteUnitOfWork.transaction` bọc callback async trong `db.transaction()` của better-sqlite3 (chỉ hỗ trợ sync) → vỡ atomicity giữa control-write và audit-append (R2/R6), crash `POST /agent/mode` khi chạy với DB thật. Đã viết lại dùng `BEGIN IMMEDIATE`/`COMMIT`/`ROLLBACK` thủ công quanh raw sqlite instance.
- **Sửa lỗi:** `POST /api/v1/agent/mode` không kiểm tra `req.body` null/không phải object trước khi đọc `.mode` → có thể crash 500 thay vì trả lỗi `{code:'VALIDATION',...}` đúng hợp đồng §8.1. Đã thêm guard.
- **Sửa lệch kiến trúc:** migration `0000_p0.sql` trước đây rỗng (chỉ có PRAGMA), DDL thật nằm trùng lặp inline trong `database.ts` → hai nguồn sự thật cho schema. Đã chuyển toàn bộ `CREATE TABLE`/trigger vào file migration, `database.ts` giờ đọc và áp dụng migration files.
- **Sửa lỗi phát sinh khi chạy `pnpm typecheck`/`pnpm test` lần đầu (chưa từng chạy được trước đó):** root `package.json` thiếu mọi `@venho/*` làm devDependency nên **toàn bộ test suite (kể cả các file test có sẵn) chưa từng resolve/chạy được**; domain package thiếu `zod` như dependency trực tiếp (lỗi type khi build với pnpm strict); `guardrails.ts` truyền thẳng interface cụ thể vào tham số `Record<string,unknown>`; kiểu trả về `createDatabase()` không thể emit declaration do dùng type ẩn danh từ `@types/better-sqlite3`. Tất cả đã sửa.
- **Bổ sung test:** `tests/integration/sqlite-uow.test.ts` (transaction thật + migration + append-only trigger), `tests/api/server.test.ts` (Fastify `inject()`: auth, validation, E-Stop 2 bước), `tests/agent-orchestrator.test.ts` (SKIPPED/SUCCESS/FAILED path), `tests/domain-edge-cases.test.ts` (guardrails floor>ceiling/non-integer/negative, ttl-policy biên 2/3/7/8/30/31 ngày, mode-guard).
- **Ghi nhận, chưa tự sửa:** `/health` hiện vẫn yêu cầu bearer token như mọi route khác — cần Harry quyết định có nên bỏ auth cho endpoint liveness này không trước khi đổi.
