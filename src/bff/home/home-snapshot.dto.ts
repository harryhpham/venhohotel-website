/**
 * @layer bff
 * @context home
 * @owns Mother Dashboard home snapshot DTO
 * @depends-on shared-kernel
 * @invariant Presentation DTO only; no metric calculation and no provider calls.
 */

import type { SourceFreshness } from "@/shared/kernel/freshness";

export type SectionState = "loading" | "empty" | "stale" | "partial_error" | "permission" | "ok";

export type HomeSection<T> = {
  state: SectionState;
  data: T;
  advisory?: string;
};

export type WorkspaceHeaderDto = {
  workspaceName: string;
  propertyName: string;
  businessDate: string;
  timezone: "Asia/Bangkok";
  lastSyncLabel: string;
};

export type TodaysFocusDto = {
  objective: string;
  priority: string;
  milestone: string;
  nextAction: string;
  eta: string;
  actionRoute: string;
};

export type CurrentWorkDto = {
  taskTitle: string;
  progressPercent: number;
  currentStep: string;
  status: "READY" | "IN_PROGRESS" | "BLOCKED" | "IN_REVIEW";
  continueRoute: string;
};

export type OperatingPulseDto = {
  domain: "revenue" | "inventory" | "reputation" | "agent-data";
  status: "HEALTHY" | "WATCH" | "ACTION_REQUIRED" | "UNKNOWN";
  reason: string;
  action: string;
};

export type DecisionReviewDto = {
  id: string;
  icon: string;
  title: string;
  source: string;
  risk: "normal" | "high";
  actionLabel: string;
  actionRoute: string;
};

export type PublicationApprovalDto = {
  id: string;
  channel: "Facebook" | "Instagram" | "Google Business" | "Website";
  contentTitle: string;
  status: "READY_FOR_APPROVAL" | "APPROVED" | "SCHEDULED";
  actionRoute: string;
};

export type QuickActionDto = {
  id: string;
  label: string;
  route: string;
  enabled: boolean;
};

export type AgentWorkflowHealthDto = {
  label: string;
  status: "ready" | "watch" | "blocked";
  action: string;
};

export type ActivityEventDto = {
  id: string;
  time: string;
  event: string;
  module: string;
  route: string;
};

export type HomeSnapshotDto = {
  header: WorkspaceHeaderDto;
  todaysFocus: HomeSection<TodaysFocusDto>;
  currentWork: HomeSection<CurrentWorkDto>;
  operatingPulse: HomeSection<OperatingPulseDto[]>;
  needsReview: HomeSection<DecisionReviewDto[]>;
  readyToPublish: HomeSection<PublicationApprovalDto[]>;
  quickActions: HomeSection<QuickActionDto[]>;
  agentWorkflowHealth: HomeSection<AgentWorkflowHealthDto[]>;
  recentActivity: HomeSection<ActivityEventDto[]>;
  meta: {
    partialErrors: string[];
    sectionFreshness: Record<string, SourceFreshness>;
  };
};
