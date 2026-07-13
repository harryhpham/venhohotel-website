/**
 * @layer bff
 * @context home
 * @owns Mother Dashboard home snapshot composition
 * @depends-on execution-domain, module-registry-application, bff-dto
 * @invariant Query-ports/read-model only; 0 external calls; no metric formula calculation.
 * @invariant OTA-01 data surfaced via Operating Pulse + AgentHealth — no direct OTA provider call here.
 */

import type {
  ActivityEventDto,
  AgentWorkflowHealthDto,
  CurrentWorkDto,
  DecisionReviewDto,
  HomeSection,
  HomeSnapshotDto,
  OperatingPulseDto,
  PublicationApprovalDto,
  QuickActionDto,
  TodaysFocusDto,
} from "@/bff/home/home-snapshot.dto";
import { chooseTodaysFocus, type FocusCandidate } from "@/modules/execution/domain/focus-scoring";
import { resolveHomeQuickActions } from "@/modules/module-registry/application/queries/resolve-quick-actions";

const BUSINESS_TIMEZONE = "Asia/Bangkok" as const;

function okSection<T>(data: T): HomeSection<T> {
  return { state: "ok", data };
}

function businessDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function businessTime(): string {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: BUSINESS_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function focusCandidates(): FocusCandidate[] {
  return [
    {
      id: "focus-review-validation",
      title: "Review failed OTA validation evidence",
      route: "/os?section=tasks",
      priority: 1,
      dueUrgency: 0.92,
      continuity: 0.85,
      milestoneGate: 0.8,
      businessImpact: 0.85,
      effortFit: 0.9,
      evidenceFresh: true,
      hasHumanOwner: true,
      suppressed: false,
    },
    {
      id: "focus-publish-room-post",
      title: "Approve lake-view room post for publishing",
      route: "/os?section=publishing",
      priority: 0.72,
      dueUrgency: 0.65,
      continuity: 0.5,
      milestoneGate: 0.4,
      businessImpact: 0.55,
      effortFit: 0.8,
      evidenceFresh: true,
      hasHumanOwner: true,
      suppressed: false,
    },
  ];
}

function buildTodaysFocus(): TodaysFocusDto {
  const focus = chooseTodaysFocus(focusCandidates());

  if (!focus) {
    return {
      objective: "Keep VenHo OS ready for business execution",
      priority: "Review recent activity",
      milestone: "Daily workspace check",
      nextAction: "Open Recent Activity",
      eta: "5 min",
      actionRoute: "/os",
    };
  }

  return {
    objective: "Move Ven Hồ Hotel operation forward",
    priority: focus.title,
    milestone: "Evidence before automation",
    nextAction: "Continue",
    eta: "15 min",
    actionRoute: focus.route,
  };
}

function currentWork(): CurrentWorkDto {
  return {
    taskTitle: "Review failed OTA validation evidence",
    progressPercent: 38,
    currentStep: "Step 3 / 8 · Open source evidence",
    status: "IN_PROGRESS",
    continueRoute: "/os?section=tasks",
  };
}

function operatingPulse(): OperatingPulseDto[] {
  // A7 pre-computed snapshots only — BFF never calculates metrics (PLAN §7 guardrail)
  // OTA-01 status surfaced here as agent-data domain item
  return [
    {
      domain: "revenue",
      status: "WATCH",
      reason: "A7 snapshot: pickup needs review. Dashboard does not calculate the metric.",
      action: "Open Reports",
    },
    {
      domain: "inventory",
      status: "ACTION_REQUIRED",
      reason: "OTA-01: evidence freshness stale on Agoda channel — automation blocked.",
      action: "Open Operations",
    },
    {
      domain: "reputation",
      status: "HEALTHY",
      reason: "No high-risk review waiting in the current pulse.",
      action: "Monitor",
    },
    {
      domain: "agent-data",
      status: "WATCH",
      reason: "Automation read-only until K1-K4 readiness is met. OTA-01 setup required.",
      action: "Open Workbench",
    },
  ];
}

function needsReview(): DecisionReviewDto[] {
  return [
    {
      id: "dec-ota-validation",
      icon: "!",
      title: "Open failed OTA validation evidence",
      source: "Approval Decision",
      risk: "high",
      actionLabel: "Review",
      actionRoute: "/os?section=tasks",
    },
    {
      id: "dec-inventory-safety",
      icon: "S",
      title: "Inventory safety blocker before automation",
      source: "Agent Control",
      risk: "high",
      actionLabel: "Open",
      actionRoute: "/os?section=workbench",
    },
    {
      id: "dec-content",
      icon: "C",
      title: "Review generated room prompt package",
      source: "Creative",
      risk: "normal",
      actionLabel: "Review",
      actionRoute: "/os?section=creative-studio",
    },
  ];
}

function readyToPublish(): PublicationApprovalDto[] {
  return [
    {
      id: "pub-lake-view-room",
      channel: "Facebook",
      contentTitle: "Lake-view room morning post",
      status: "READY_FOR_APPROVAL",
      actionRoute: "/os?section=publishing",
    },
    {
      id: "pub-google-business",
      channel: "Google Business",
      contentTitle: "West Lake location update",
      status: "READY_FOR_APPROVAL",
      actionRoute: "/os?section=publishing",
    },
  ];
}

function agentWorkflowHealth(): AgentWorkflowHealthDto[] {
  // OTA-01 (A4 OTA Revenue Agent) surfaces here — setup required before Level 1 automation
  return [
    { label: "A1 Data Foundation", status: "watch", action: "Review stale evidence" },
    { label: "A3 Creative (M01–M09)", status: "ready", action: "Continue content package" },
    { label: "A4 OTA Revenue", status: "watch", action: "Complete OTA-01 setup · Open Operations" },
    { label: "A7 Control Tower", status: "ready", action: "Open pulse" },
  ];
}

function recentActivity(): ActivityEventDto[] {
  return [
    {
      id: "act-1",
      time: "09:12",
      event: "Validation evidence flagged as stale",
      module: "Approval Decision",
      route: "/os?section=tasks",
    },
    {
      id: "act-2",
      time: "08:55",
      event: "A7 operating pulse snapshot imported",
      module: "Control Tower",
      route: "/os?section=reports",
    },
    {
      id: "act-3",
      time: "08:40",
      event: "OTA-01: Agoda channel sync completed · evidence pending review",
      module: "Operations",
      route: "/os?section=operations",
    },
    {
      id: "act-4",
      time: "08:21",
      event: "Facebook post prepared, waiting approval",
      module: "Publishing",
      route: "/os?section=publishing",
    },
  ];
}

export async function getHomeSnapshot(): Promise<HomeSnapshotDto> {
  return {
    header: {
      workspaceName: "VENHO OS",
      propertyName: "Ven Hồ Hotel · 12 rooms",
      businessDate: businessDate(),
      timezone: BUSINESS_TIMEZONE,
      lastSyncLabel: businessTime(),
    },
    todaysFocus: okSection(buildTodaysFocus()),
    currentWork: okSection(currentWork()),
    operatingPulse: okSection(operatingPulse()),
    needsReview: okSection(needsReview()),
    readyToPublish: okSection(readyToPublish()),
    quickActions: okSection(resolveHomeQuickActions() as QuickActionDto[]),
    agentWorkflowHealth: okSection(agentWorkflowHealth()),
    recentActivity: okSection(recentActivity()),
    meta: {
      partialErrors: [],
      sectionFreshness: {
        operatingPulse: {
          source: "A7 operating_pulse_snapshots",
          status: "FRESH",
          observedAt: new Date().toISOString(),
          thresholdMinutes: 60,
        },
        approvals: {
          source: "approval_decision.decision_queue",
          status: "FRESH",
          observedAt: new Date().toISOString(),
          thresholdMinutes: 30,
        },
        publishing: {
          source: "publishing.publication_items",
          status: "FRESH",
          observedAt: new Date().toISOString(),
          thresholdMinutes: 30,
        },
      },
    },
  };
}
