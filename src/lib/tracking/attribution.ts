/**
 * Campaign attribution capture for booking enquiries.
 *
 * Why (2026-08-06): the Growth Agent tags every published post with
 * `?utm_content=<publication_id>` pointing at venhohotel.com, but the booking
 * form discarded those params entirely — so "which post produced this
 * booking?" had no answer on the receiving end, and DoD #25 (publication →
 * qualified inquiry) was a one-ended pipe.
 *
 * The params must survive navigation: someone lands on /lien-he?utm_content=…
 * from Facebook, browses two room pages, then submits the form from a URL
 * with no params left on it. sessionStorage is the right lifetime — it keeps
 * the attribution for the visit that actually came from the post, and drops
 * it when the tab closes rather than crediting a post for a visit weeks later.
 */

export type AttributionParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
};

export const ATTRIBUTION_STORAGE_KEY = "venho_attribution";

const TRACKED_KEYS = ["utm_source", "utm_medium", "utm_content"] as const;

/** utm values are echoed into an email and matched against publication ids —
 * keep them to the shape ids actually take, so nothing else rides along. */
function sanitize(value: string | null): string | undefined {
  if (!value) return undefined;
  const cleaned = value.trim().slice(0, 120).replace(/[^A-Za-z0-9_.:-]/g, "");
  return cleaned || undefined;
}

export function parseAttribution(search: string): AttributionParams {
  const params = new URLSearchParams(search);
  const result: AttributionParams = {};
  for (const key of TRACKED_KEYS) {
    const value = sanitize(params.get(key));
    if (value) result[key] = value;
  }
  return result;
}

export function hasAttribution(params: AttributionParams): boolean {
  return TRACKED_KEYS.some((key) => Boolean(params[key]));
}

/**
 * Store this visit's attribution, if the URL carries any. A later page view
 * without params must not wipe what the landing page captured.
 */
export function captureAttribution(
  search: string,
  storage: Pick<Storage, "getItem" | "setItem"> | undefined = typeof window === "undefined" ? undefined : window.sessionStorage
): AttributionParams {
  const parsed = parseAttribution(search);
  if (!storage) return parsed;
  if (hasAttribution(parsed)) {
    try {
      storage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // Private mode / storage disabled: attribution is a nice-to-have, never
      // a reason for a booking form to break.
    }
    return parsed;
  }
  return readAttribution(storage);
}

export function readAttribution(
  storage: Pick<Storage, "getItem"> | undefined = typeof window === "undefined" ? undefined : window.sessionStorage
): AttributionParams {
  if (!storage) return {};
  try {
    const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AttributionParams;
    const result: AttributionParams = {};
    for (const key of TRACKED_KEYS) {
      const value = sanitize(parsed?.[key] ?? null);
      if (value) result[key] = value;
    }
    return result;
  } catch {
    return {};
  }
}

/** Attribution for the current page: URL params win, stored visit is fallback. */
export function currentAttribution(): AttributionParams {
  if (typeof window === "undefined") return {};
  return captureAttribution(window.location.search);
}
