# Tracking Changelog

## 2026-07-15 — G1 Meta Tracking Patch Evidence

- PATCH-01: kept first `PageView` in Meta base snippet and skipped the first route-change effect.
- PATCH-02: changed booking-intent CTAs from checkout/contact semantics to `ViewContent`.
- PATCH-03: constrained `Contact` to real contact channels and non-PII params.
- PATCH-04: kept `Lead` after successful booking API response only, with non-PII payload.
- PATCH-05: recorded cleanup boundary for historical Contact audience contamination.

Evidence file: `docs/QuangCao/G1_TRACKING_EVIDENCE_2026-07-15.md`.

External Events Manager screenshots: pending owner/browser verification after deploy.
