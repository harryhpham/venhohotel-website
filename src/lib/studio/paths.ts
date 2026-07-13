import path from "path";

// Next.js project root = .../projects/Ven Ho Hotel
const ROOT = process.cwd();

export const STUDIO_DIR = path.resolve(ROOT, "../../03_AI_STUDIO/venho-ai-studio");
export const SOCIAL_MANAGER_DIR = path.resolve(ROOT, "ops/VenHoSocialManager");
export const VIDEO_SCRIPTS_DIR = path.resolve(ROOT, "local-generated/social-video/scripts");
export const DNA_COMPACT_DIR = path.join(STUDIO_DIR, "data/projects/venho_hotel/knowledge");

// Python bin where the venho CLI lives
export const PYTHON_BIN = "/Users/hanhpham/Library/Python/3.9/bin";
export const VENHO_PATH = `${PYTHON_BIN}:/usr/local/bin:/usr/bin:/bin`;
