import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="VenHo OS"' },
  });
}

function hasValidCredentials(request: NextRequest) {
  const username = process.env.VENHO_OS_USERNAME;
  const password = process.env.VENHO_OS_PASSWORD;
  if (!username || !password) return false;

  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return false;

  try {
    const credentials = atob(authorization.slice(6));
    const separator = credentials.indexOf(":");
    if (separator < 0) return false;
    return credentials.slice(0, separator) === username && credentials.slice(separator + 1) === password;
  } catch {
    return false;
  }
}

/** Keep the operating cockpit and local-agent control plane private by default. */
export function proxy(request: NextRequest) {
  if (!hasValidCredentials(request)) return unauthorized();
  return NextResponse.next();
}

export const config = {
  matcher: ["/os/:path*", "/api/v1/luna/:path*", "/api/v1/hermes-nous/:path*"],
};
