# VENHO OS OTA-01

Phase hiện tại: **P0**. Đây là workspace độc lập cho OTA operations, không can thiệp website hiện hữu.

P0 chỉ dùng mock connector. Không có external write, direct OTA connectivity, RPA hay auto-reopen. Các quyết định G0 phải được Owner ký trước P1.

## Chạy local

```bash
corepack enable
pnpm install
pnpm validate:config
pnpm test
pnpm typecheck
pnpm seed
pnpm dev:api
```

API mặc định tại `http://127.0.0.1:4801`; mọi request cần `Authorization: Bearer $API_AUTH_TOKEN`.
