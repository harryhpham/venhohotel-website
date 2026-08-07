export type MetaEventPayload = Record<string, string>;

export function bookingIntentPayload(source: string): MetaEventPayload {
  return {
    content_name: "booking_form",
    content_category: "booking_intent",
    source,
  };
}

export function contactPayload(channel: "phone" | "email" | "messenger" | "instagram" | "zalo", source: string): MetaEventPayload {
  return { channel, source };
}

export function leadPayload(source: string, roomType?: string): MetaEventPayload {
  return {
    content_name: roomType || "not_selected",
    content_category: "booking_inquiry_lead",
    source,
  };
}
