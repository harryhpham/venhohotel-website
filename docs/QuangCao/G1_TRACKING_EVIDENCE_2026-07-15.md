# G1 Tracking Evidence — 2026-07-15

## Scope

Repo: `Ven Ho Hotel` website.

Plan item: `VENHO_FB_GROWTH_PLAN_AI_BUILD_v2.1.md` Step G1 — tracking patches PATCH-01 to PATCH-05.

## Local Evidence

Commands run on 2026-07-15:

```bash
npm test -- --run
npm run lint
npm run build
```

Result:

- `npm test -- --run`: 2 files passed, 7 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed, 27 routes generated successfully.

Expected local assertions:

- Meta Pixel base snippet still emits the first `PageView`.
- Route-change effect skips first render, preventing duplicate initial `PageView`.
- Booking-intent CTAs emit `ViewContent` with `content_category=booking_intent`.
- Real contact actions emit `Contact` with `channel` and `source` only.
- Booking inquiry forms emit `Lead` only after `/api/booking` returns `2xx`.
- Meta payload helpers do not expose name, phone, email, stay dates, guest count, or notes.

## Source Evidence

- `src/components/ui/MetaPixel.tsx` implements first-route skip with `useRef(true)`.
- `src/lib/tracking/meta-events.ts` centralizes non-PII payload builders.
- `tests/unit/tracking/meta-events.test.ts` verifies payload shape.
- `tests/unit/tracking/g1-source-evidence.test.ts` verifies source-level G1 invariants.

## Events Manager Evidence

Status: pending external verification.

Reason: this requires access to Meta Events Manager and the deployed website session. Local tests can prove source invariants and production build health, but cannot produce Meta's server-side Test Events screenshots.

Manual verification required after deploy:

1. Open Meta Events Manager → Test Events for pixel `2558756207893221`.
2. Load the deployed homepage once and confirm exactly one initial `PageView`.
3. Click hero booking CTA and confirm `ViewContent`, not `Contact` or `Lead`.
4. Click phone/Zalo/contact links and confirm `Contact` contains only `channel` and `source`.
5. Submit booking form successfully and confirm `Lead` fires only after successful API response.
6. Submit/force a failed booking request and confirm no `Lead`.

## Custom Audience / Conversion Note

`Hotel Contact 180 Days` may have historical contamination from booking-intent clicks before PATCH-02/03.
Use 2026-07-15 as the cleanup boundary. If campaign history is low, recreate the audience; otherwise analyze only post-boundary traffic.

`Room Booking Lead` should be interpreted as inquiry lead, not confirmed booking. Recommended label: `Room Booking Inquiry Lead`.
