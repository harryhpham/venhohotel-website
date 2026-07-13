// Ported from venho-ai-studio/ui/studio_app.py

export const OUTFITS: Record<string, string> = {
  "A — Cafe Girl": "cream knit top, beige A-line skirt, small luxury handbag",
  "B — West Lake Sunset": "flowing white dress, minimal gold jewelry",
  "C — Street Style": "white button-up shirt, high-waist trousers, denim jacket",
  "D — Business Travel": "light beige blazer, white blouse, elegant trousers",
  "E — Sport & Active":
    "mint-green Nike racerback loose crop tank top, dual Swoosh logos at collar, perforated ventilation panels on chest and back, mint-green Nike running shorts (3-inch inseam) with mesh waistband and small Swoosh logo on leg, white Nike running shoes, white ankle socks, sleek high ponytail",
};

export const ENV_BLOCKS: Record<string, string> = {
  "Nguyễn Đình Thi (Street Level)": `Authentic Nguyễn Đình Thi Street beside West Lake Hanoi, current 2026 lakeside environment,
ivory-white metal railing with rounded top handrail, multiple horizontal bars,
angled triangular support frames, simple modern functional railing, no stone pillars, no green railing,
narrow local lakeside sidewalk with gray paving, mature trees growing close to the railing,
natural leafy branches extending over the path, strong tree shadows on the pavement,
light motorbike and bicycle traffic on the two-lane road,
wide calm West Lake water immediately beside the railing,
distant low and mid-rise Hanoi skyline across the lake,
large open sky with soft clouds, authentic local West Lake residential atmosphere,
not touristy, not resort-like.`,
  "Rooftop Ven Hồ Hotel": `Ven Hồ Hotel rooftop terrace overlooking West Lake Hanoi,
open rooftop with terracotta floor tiles,
black metal rooftop railing with simple circular details on top bar,
panoramic view of calm West Lake, distant Hanoi skyline,
huge sky with soft clouds, light local atmosphere.`,
  "Hotel Room (Lake View)": `Ven Hồ Hotel authentic lake view room, Hanoi mini hotel interior,
long narrow room layout, white walls, white ceiling with simple crown molding,
warm recessed LED ceiling lights,
dark reddish-brown mahogany wood furniture: queen bed with dark wood frame and headboard, white bedding,
light wood laminate flooring,
large black aluminum cross-mullion window (2x2 pane grid, not floor-to-ceiling height),
dark gray-brown thick curtains pulled open to both sides,
black ornate wrought-iron decorative railing outside window with scroll and floral pattern,
two wooden armchairs with cushions and small glass-top wooden table in front of window,
West Lake water and mature green trees visible through window beyond the railing,
authentic functional Hanoi mini hotel atmosphere, not luxury, not resort, not boutique designer.`,
  "West Lake Café": `Cozy West Lake Hanoi café, large windows facing the lake,
warm natural light, authentic Vietnamese café atmosphere,
West Lake visible outside, calm morning mood.`,
  "West Lake Landscape (Wide)": `Panoramic West Lake Hanoi view from elevated position,
calm jade-teal water surface #4E8FA0 extending to horizon,
low and mid-rise Hanoi skyline in distance, slightly hazy,
mature green tree belt along the shore, huge open sky 40–55% frame,
authentic Hanoi atmosphere, not Singapore, not Seoul, not Shanghai.`,
};

export const SCENARIO_SUBJECT: Record<string, string | null> = {
  "Nguyễn Đình Thi (Street Level)": "westlake",
  "Rooftop Ven Hồ Hotel": "outside",
  "Hotel Room (Lake View)": "lake_view_room",
  "West Lake Café": null,
  "West Lake Landscape (Wide)": "westlake",
};

export const TECH_BLOCK =
  "Fujifilm GFX100S, 85mm lens, shallow depth of field, photorealistic 8K,\nnatural skin texture, editorial luxury lifestyle photography, authentic Vietnamese atmosphere.";

export const NEGATIVE_BLOCK =
  "Do not make the subject look Korean, Japanese, Chinese, European, or generic fashion model. " +
  "Avoid anime style, cartoon style, plastic skin, beauty filter, K-pop styling, " +
  "futuristic architecture, Singapore skyline, Seoul skyline, Tokyo skyline, Shanghai skyline, " +
  "luxury skyscraper wall, distorted hands, extra fingers, " +
  "floor-to-ceiling glass wall hotel, marble luxury interior, modern minimalist designer room, " +
  "beige boutique aesthetic, cream and white luxury room, generic AI hotel room, " +
  "artificial lighting, over-sharpening, excessive HDR, AI artifacts, " +
  "duplicate objects, floating objects, unrealistic reflections, " +
  "green railing, pink stone pillars, old Hồ Tây railing style, " +
  "resort luxury pool, marina lifestyle, tropical ocean scene, tourist crowd.";

export const LINH_AN_FACE_LOCK = `Linh An, Vietnamese female influencer, 24 years old,
soft elongated oval face, slightly fuller cheeks, balanced facial proportions,
slim natural nose bridge, long almond eyes, horizontal eye emphasis,
slightly narrow eye opening, thin upper eyelid, warm brown irises,
very subtle outer corner lift, natural eye asymmetry,
low-position eyebrows, minimal arch, close eye-brow distance,
natural full lips with slightly thinner upper lip and slightly fuller lower lip,
very subtle upward lip corners, slightly shorter philtrum,
soft feminine jawline, delicate chin,
fair warm ivory skin, healthy natural glow, realistic skin texture, natural pores,
long dark chocolate brown layered wavy hair, natural center part,
small pearl drop earrings,
gentle feminine beauty, elegant Vietnamese appearance,
luxury lifestyle creator, consistent facial identity,
photorealistic, natural beauty,
no plastic skin, no doll face, no exaggerated makeup.
168cm height, slim elegant body, defined waistline,
long legs, natural feminine curves, healthy feminine silhouette,
graceful posture, confident but relaxed body language.
10-20 degree soft hero left angle, natural eye contact,
Living Expression — subtle anticipation smile, genuine engagement.`;

export const VIDEO_PILLARS = ["View & Vibe", "Room Tour", "Local Life", "Deal", "Guest Story"] as const;
export type VideoPillar = (typeof VIDEO_PILLARS)[number];

export const OUTFIT_BY_PILLAR: Record<VideoPillar, string> = {
  "View & Vibe": "B — West Lake Sunset",
  "Room Tour": "D — Business Travel",
  "Local Life": "A — Cafe Girl",
  Deal: "B — West Lake Sunset",
  "Guest Story": "A — Cafe Girl",
};

export const DAY_NAMES_VI = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"];

export type SceneTuple = [
  descVi: string,
  action: string,
  envKey: string,
  cameraMove: string,
  lighting: string,
];

export const SCENE_STRUCTURES: Record<VideoPillar, SceneTuple[]> = {
  "View & Vibe": [
    ["Cảnh Hồ Tây rộng từ rooftop", "standing at the rooftop railing, arms resting lightly, looking towards the calm West Lake", "Rooftop Ven Hồ Hotel", "slow pan right", "golden hour, warm honey light, soft lake haze"],
    ["Khoảnh khắc thư giãn tại phòng", "sitting in the armchair by the window, holding a small cup of tea, gazing at the lake outside", "Hotel Room (Lake View)", "slow push in", "soft afternoon light through window, warm and serene"],
    ["Cinematic close-up hoàng hôn", "gentle turn toward camera with a soft warm smile, golden light on face, West Lake bokeh behind", "Rooftop Ven Hồ Hotel", "gentle zoom in", "cinematic backlight, golden hour glow, dreamy"],
  ],
  "Room Tour": [
    ["Exterior khách sạn — Nguyễn Đình Thi", "walking toward the hotel entrance along the lakeside sidewalk, relaxed confident stride", "Nguyễn Đình Thi (Street Level)", "tracking shot", "bright morning light, fresh local atmosphere"],
    ["Khám phá trong phòng", "opening the dark grey curtains slowly to reveal the lake view, turning to look at the room interior", "Hotel Room (Lake View)", "slow pull back", "natural light flooding in, warm and inviting"],
    ["Reveal view Hồ Tây qua cửa sổ", "standing at the window, both hands on the iron railing outside, West Lake filling the frame beyond", "Hotel Room (Lake View)", "static then push in", "soft afternoon light, calm and elegant"],
  ],
  "Local Life": [
    ["Bắt đầu từ khách sạn — buổi sáng", "stepping out of the hotel entrance onto Nguyễn Đình Thi street, looking left toward the lake with a smile", "Nguyễn Đình Thi (Street Level)", "tracking shot", "early morning golden light, fresh authentic atmosphere"],
    ["Dạo bộ ven hồ Nguyễn Đình Thi", "walking slowly along the ivory railing beside West Lake, one hand trailing the railing, looking at the water", "Nguyễn Đình Thi (Street Level)", "tracking side", "midday soft light, green tree shadows, local calm"],
    ["Quay về nghỉ ngơi — chiều tối", "sitting in the hotel room armchair, feet curled up, looking out the window at the fading lake light, peaceful", "Hotel Room (Lake View)", "slow push in", "warm evening ambient light, cozy and relaxing"],
  ],
  Deal: [
    ["Hook — đứng trước khách sạn tự tin", "standing confidently in front of the hotel facade, slight warm smile directly at camera", "Nguyễn Đình Thi (Street Level)", "slow push in", "clean bright daylight, professional and fresh"],
    ["Phòng đẹp — showcase value", "sitting in the room armchair, gesturing naturally toward the large lake-view window, inviting expression", "Hotel Room (Lake View)", "slow pan", "soft natural light, warm and comfortable"],
    ["CTA — rooftop với toàn cảnh hồ", "standing at the rooftop railing, looking directly at camera with confident warm smile, West Lake panorama behind", "Rooftop Ven Hồ Hotel", "gentle zoom out", "golden hour, cinematic warm light"],
  ],
  "Guest Story": [
    ["Quote / Review — trong phòng", "sitting on the bed edge, looking at phone screen showing a review, soft smile of satisfaction", "Hotel Room (Lake View)", "slow push in", "warm room light, intimate and authentic"],
    ["Cảnh phòng + view Hồ Tây", "standing beside the window with one hand on the dark iron railing, West Lake stretching beyond, reflective mood", "Hotel Room (Lake View)", "static wide", "natural afternoon light, calm and beautiful"],
    ["CTA cảm xúc — rooftop hoàng hôn", "at the rooftop, turning from the lake to face camera with a genuine peaceful smile, warm golden sky behind", "Rooftop Ven Hồ Hotel", "slow push in", "golden hour backlight, emotional and warm"],
  ],
};

export const PILLARS: Record<string, { funnel: string; golden_rule: string; persona: string; hashtags: string }> = {
  "P1 — Khám Phá Hồ Tây (40%)": {
    funnel: "TOFU",
    golden_rule: "Inspire",
    persona: "Persona 1 — Khách du lịch Việt (25–45)",
    hashtags: "#VenHoHotel #HoTay #TayHo #HanoiSunset #BinhMinhHaNoi",
  },
  "P2 — Ẩm Thực Hồ Tây (20%)": {
    funnel: "TOFU",
    golden_rule: "Educate",
    persona: "Persona 1 — Khách du lịch Việt (25–45)",
    hashtags: "#VenHoHotel #HoTay #HanoiFood #HanoiCafe #AmThucHaNoi",
  },
  "P3 — Kinh Nghiệm Công Tác (15%)": {
    funnel: "MOFU",
    golden_rule: "Educate",
    persona: "Persona 2 — Khách công tác (28–55)",
    hashtags: "#VenHoHotel #HoTay #BusinessTravel #CongTacHaNoi #WorkFromHanoi",
  },
  "P4 — Trải Nghiệm Khách Hàng (15%)": {
    funnel: "MOFU",
    golden_rule: "Trust",
    persona: "Persona 1 — Khách du lịch Việt (25–45)",
    hashtags: "#VenHoHotel #HoTay #GuestLove #ReviewThat #AgodaReview #CheckinHanoi",
  },
  "P5 — Thương Hiệu Ven Hồ Hotel (10%)": {
    funnel: "BOFU",
    golden_rule: "Inspire",
    persona: "Persona 1 — Khách du lịch Việt (25–45)",
    hashtags: "#VenHoHotel #HoTay #KhachSanHoTay #BoutiqueHotel #HanoiHotel",
  },
};

export const KNOWN_SUBJECTS = [
  "lake_view_room",
  "deluxe_double",
  "lobby",
  "facade",
  "linh_an",
  "westlake",
  "outside",
];
