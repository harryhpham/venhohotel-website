import type { AgentMode } from '@venho/shared';
export type RunType = 'SYNC_RUN'|'PRICING_RUN'|'COMPETITOR_RUN'|'LISTING_AUDIT'|'BRIEF_RUN'|'EVENT_RUN';
export const modeAllowsScheduledRun = (mode: AgentMode): boolean => mode === 'RUNNING' || mode === 'READ_ONLY';
export const modeAllowsManualRun = (mode: AgentMode): boolean => mode !== 'EMERGENCY_STOP';
export const modeAllowsWrite = (mode: AgentMode): boolean => mode === 'RUNNING';
