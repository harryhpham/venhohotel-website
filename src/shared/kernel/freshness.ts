/**
 * @layer shared-kernel
 * @context cross-context
 * @owns Source freshness value objects
 * @depends-on none
 * @invariant Freshness is per source; there is no single global lastSyncAt.
 */

export type FreshnessStatus = "FRESH" | "STALE" | "UNKNOWN";

export type SourceFreshness = {
  source: string;
  status: FreshnessStatus;
  observedAt: string | null;
  thresholdMinutes: number;
};

export function freshnessLabel(item: SourceFreshness): string {
  if (item.status === "UNKNOWN") return `${item.source}: unknown`;
  if (!item.observedAt) return `${item.source}: ${item.status.toLowerCase()}`;
  return `${item.source}: ${item.status.toLowerCase()} at ${item.observedAt}`;
}
