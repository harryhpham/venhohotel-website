import "server-only";

/**
 * @layer bff
 * @context ota
 * @owns Server-to-server HTTP client for the OTA-01 agent's Internal API
 * @depends-on nothing
 * @invariant Bearer token is read from env and stays server-side; never import this module
 * from a "use client" component or forward the token to the browser.
 * @invariant Follows venho-ota-agent's docs/MOTHER_DASHBOARD_CONTRACT.md — GET-only for now;
 * do not add write calls (POST /agent/mode) here without also building the re-authentication
 * and two-step-confirmation UX the contract requires for EMERGENCY_STOP and other writes.
 */

const TIMEOUT_MS = 3_000;

export class OtaAgentError extends Error {
  constructor(
    readonly kind: "not_configured" | "unreachable" | "http_error",
    message: string,
  ) {
    super(message);
    this.name = "OtaAgentError";
  }
}

type ErrorEnvelope = { code: string; message: string; details: Record<string, unknown> };

function readConfig(): { baseUrl: string; token: string } {
  const baseUrl = process.env.OTA_AGENT_BASE_URL;
  const token = process.env.OTA_AGENT_API_TOKEN;
  if (!baseUrl || !token) {
    throw new OtaAgentError(
      "not_configured",
      "OTA_AGENT_BASE_URL and OTA_AGENT_API_TOKEN must both be set to reach the OTA-01 agent",
    );
  }
  return { baseUrl, token };
}

export async function otaAgentGet<T>(path: string): Promise<T> {
  const { baseUrl, token } = readConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error) {
    throw new OtaAgentError(
      "unreachable",
      `OTA-01 agent request to ${path} failed: ${(error as Error).message}`,
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const envelope = (await response.json().catch(() => null)) as ErrorEnvelope | null;
    throw new OtaAgentError(
      "http_error",
      envelope?.message ?? `OTA-01 agent returned HTTP ${response.status} for ${path}`,
    );
  }

  return (await response.json()) as T;
}
