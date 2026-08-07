import { describe, expect, it } from "vitest";

import {
  ATTRIBUTION_STORAGE_KEY,
  captureAttribution,
  parseAttribution,
  readAttribution,
} from "@/lib/tracking/attribution";

function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    dump: () => Object.fromEntries(data),
  };
}

describe("parseAttribution", () => {
  it("reads the growth agent's utm params off a landing URL", () => {
    expect(parseAttribution("?utm_source=facebook&utm_medium=social&utm_content=pub-friday-facebook-ced0d28d")).toEqual({
      utm_source: "facebook",
      utm_medium: "social",
      utm_content: "pub-friday-facebook-ced0d28d",
    });
  });

  it("ignores unrelated query params", () => {
    expect(parseAttribution("?room=deluxe-double&fbclid=abc")).toEqual({});
  });

  it("strips characters a publication id never contains", () => {
    // The value is echoed into an email body; nothing but id-shaped text rides along.
    expect(parseAttribution("?utm_content=pub-1<script>").utm_content).toBe("pub-1script");
  });
});

describe("captureAttribution", () => {
  it("persists the landing page's attribution for the rest of the visit", () => {
    const storage = fakeStorage();
    captureAttribution("?utm_content=pub-friday-facebook-1", storage);

    expect(JSON.parse(storage.dump()[ATTRIBUTION_STORAGE_KEY])).toEqual({ utm_content: "pub-friday-facebook-1" });
  });

  it("keeps the original attribution when a later page has no params", () => {
    // The real path: land on /lien-he?utm_content=…, browse rooms, submit from
    // a clean URL. Losing it here would credit every booking to "direct".
    const storage = fakeStorage({ [ATTRIBUTION_STORAGE_KEY]: JSON.stringify({ utm_content: "pub-monday-facebook-1" }) });

    expect(captureAttribution("?room=deluxe-double", storage)).toEqual({ utm_content: "pub-monday-facebook-1" });
  });

  it("lets a newer post's link overwrite an older one in the same visit", () => {
    const storage = fakeStorage({ [ATTRIBUTION_STORAGE_KEY]: JSON.stringify({ utm_content: "pub-old" }) });

    expect(captureAttribution("?utm_content=pub-new", storage)).toEqual({ utm_content: "pub-new" });
  });

  it("never throws when storage is unavailable", () => {
    const broken = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    };

    expect(() => captureAttribution("?utm_content=pub-1", broken)).not.toThrow();
    expect(readAttribution(broken)).toEqual({});
  });
});

describe("readAttribution", () => {
  it("returns nothing for corrupted storage rather than propagating junk", () => {
    expect(readAttribution(fakeStorage({ [ATTRIBUTION_STORAGE_KEY]: "not json" }))).toEqual({});
  });
});
