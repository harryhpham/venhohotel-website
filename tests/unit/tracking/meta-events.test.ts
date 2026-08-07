import { describe, expect, it } from "vitest";

import { bookingIntentPayload, contactPayload, leadPayload } from "@/lib/tracking/meta-events";

describe("Meta event payloads", () => {
  it("maps booking intent to ViewContent-safe payload", () => {
    expect(bookingIntentPayload("hero_booking_button")).toEqual({
      content_name: "booking_form",
      content_category: "booking_intent",
      source: "hero_booking_button",
    });
  });

  it("keeps Contact payload free of PII", () => {
    expect(contactPayload("phone", "contact_page")).toEqual({
      channel: "phone",
      source: "contact_page",
    });
  });

  it("keeps Lead payload free of dates, phone, email and guest counts", () => {
    expect(leadPayload("contact_page", "double-lake-view")).toEqual({
      content_name: "double-lake-view",
      content_category: "booking_inquiry_lead",
      source: "contact_page",
    });
  });
});
