import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

function source(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

describe("G1 tracking patch source evidence", () => {
  it("keeps the initial PageView in the Meta base snippet and skips the first route effect", () => {
    const metaPixel = source("src/components/ui/MetaPixel.tsx");

    expect(metaPixel).toContain("fbq('track', 'PageView');");
    expect(metaPixel).toContain("const firstPath = useRef(true);");
    expect(metaPixel).toContain("if (firstPath.current)");
    expect(metaPixel).toContain("return;");
  });

  it("maps booking-intent CTAs to ViewContent instead of Lead, Contact, or InitiateCheckout", () => {
    const checkedFiles = [
      "src/components/sections/Hero.tsx",
      "src/components/sections/BookingBar.tsx",
      "src/components/ui/MobileStickyCTA.tsx",
      "src/components/sections/RoomDetailClient.tsx",
    ];

    for (const path of checkedFiles) {
      const text = source(path);
      expect(text).toContain('"ViewContent"');
      expect(text).toContain("bookingIntentPayload");
      expect(text).not.toContain('"Lead"');
      expect(text).not.toContain('"InitiateCheckout"');
    }
  });

  it("fires Lead only after /api/booking returns ok in contact forms", () => {
    const contactClient = source("src/components/sections/ContactClient.tsx");
    const locationBlock = source("src/components/sections/LocationBlock.tsx");

    expect(contactClient.indexOf("if (res.ok)")).toBeLessThan(contactClient.indexOf('trackPixel("Lead"'));
    expect(locationBlock.indexOf("if (!res.ok)")).toBeLessThan(locationBlock.indexOf('window.fbq?.("track", "Lead"'));
    expect(contactClient).toContain('trackPixel("Lead"');
    expect(locationBlock).toContain('window.fbq?.("track", "Lead"');
  });

  it("does not send PII-shaped fields in Meta payload helpers", () => {
    const trackingHelpers = source("src/lib/tracking/meta-events.ts");

    for (const forbidden of ["phone", "email", "checkin", "checkout", "guests", "num_guests", "note", "name"]) {
      expect(trackingHelpers).not.toMatch(new RegExp(`(^|[\\s,{])${forbidden}:`, "m"));
    }
  });
});
