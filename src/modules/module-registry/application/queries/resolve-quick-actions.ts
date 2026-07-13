/**
 * @layer application
 * @context module-registry
 * @owns Home Workspace QuickActions read model
 * @depends-on nothing (PLAN §20.1 rule 4: QuickActions must be registry-driven; stub for Stage 0)
 * @invariant Returns QuickActionItem, NOT bff-dto — dependency flows inward only.
 */

// PLAN §14: Quick Actions registry — Stage 0 stub. Replace with DB-driven registry in Stage 1.
export type QuickActionItem = {
  id: string;
  label: string;
  route: string;
  enabled: boolean;
};

export function resolveHomeQuickActions(): QuickActionItem[] {
  return [
    { id: "build-dna", label: "Build DNA", route: "/os?section=knowledge", enabled: true },
    { id: "generate-prompt", label: "Generate Prompt", route: "/os?section=creative-studio", enabled: true },
    { id: "validate", label: "Validate", route: "/os?section=workbench", enabled: true },
    { id: "publish", label: "Publish", route: "/os?section=publishing", enabled: true },
    { id: "video", label: "Video", route: "/os?section=creative-studio", enabled: true },
    { id: "ota-data", label: "OTA Data", route: "/os?section=operations", enabled: true },
  ];
}
