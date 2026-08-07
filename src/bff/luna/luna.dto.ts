export type LunaBffStatus = "ok" | "not_configured" | "unreachable" | "timeout" | "error";
export type LunaProvider = "openai" | "anthropic" | "openrouter";
export type LunaAgentStatus = "draft" | "active" | "paused" | "disabled" | "error";
export type LunaTaskStatus = "pending" | "assigned" | "running" | "completed" | "failed" | "cancelled" | "awaiting_tool_approval";
export type LunaTaskPriority = "low" | "normal" | "high" | "critical";
export type LunaToolType = "shell" | "http" | "filesystem" | "filesystem_read" | "git" | "internal";
export type LunaPolicyScope = "global" | "agent";

export type LunaResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: LunaBffStatus; message: string };

export interface LunaMetrics {
  agents_total: number;
  tasks_by_status: Partial<Record<LunaTaskStatus, number>>;
  tools_total: number;
  scheduler: "running" | "stopped";
  database: "ok" | "error";
  redis: "ok" | "error";
}

export interface LunaProviderInfo {
  provider: LunaProvider;
  status: "configured" | "missing_api_key";
}

export interface LunaAgent {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  provider: "openai" | "anthropic" | "openrouter" | "local";
  model_name: string;
  status: LunaAgentStatus;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export type LunaAgentCreate = Omit<LunaAgent, "id" | "created_at" | "updated_at">;
export type LunaAgentUpdate = Partial<LunaAgentCreate>;

export interface LunaTask {
  id: string;
  title: string;
  description: string | null;
  status: LunaTaskStatus;
  priority: LunaTaskPriority;
  agent_id: string | null;
  input_payload: Record<string, unknown> | null;
  result_payload: Record<string, unknown> | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface LunaTaskExecutionResponse {
  task_id: string;
  status: "completed" | "failed";
  agent_id?: string;
  provider?: string;
  model_name?: string;
  result?: { content?: string; [key: string]: unknown };
  error_code?: string;
  error_message?: string;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface LunaExecutionPolicy {
  id: string;
  scope_type: LunaPolicyScope;
  scope_id: string | null;
  enabled: boolean;
  allowed_providers: string[] | null;
  allowed_models: string[] | null;
  max_input_chars: number | null;
  max_output_chars: number | null;
  max_input_tokens: number | null;
  max_output_tokens: number | null;
  timeout_seconds: number | null;
  max_executions_per_hour: number | null;
  daily_token_limit: number | null;
  monthly_token_limit: number | null;
  daily_cost_limit_usd: string | null;
  monthly_cost_limit_usd: string | null;
  created_at: string;
  updated_at: string;
}

export type LunaExecutionPolicyCreate = Omit<LunaExecutionPolicy, "id" | "created_at" | "updated_at">;
export type LunaExecutionPolicyUpdate = Partial<Omit<LunaExecutionPolicyCreate, "scope_type" | "scope_id">>;

export interface LunaExecutionUsage {
  id: string;
  task_id: string;
  agent_id: string;
  provider: string;
  model_name: string;
  status: "completed" | "failed" | "timeout" | "blocked";
  input_tokens: number | null;
  output_tokens: number | null;
  total_tokens: number | null;
  estimated_cost_usd: string | null;
  duration_ms: number | null;
  executed_at: string;
}

export interface LunaExecutionUsageSummaryWindow {
  executions: number;
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  estimated_cost_usd: number;
}

export interface LunaExecutionUsageSummary {
  today: LunaExecutionUsageSummaryWindow;
  month: LunaExecutionUsageSummaryWindow;
}

export interface LunaTaskCreate {
  title: string;
  description?: string | null;
  priority?: LunaTaskPriority;
  agent_id?: string | null;
  input_payload?: Record<string, unknown> | null;
}

export type LunaTaskUpdate = Partial<Pick<LunaTaskCreate, "title" | "description" | "priority" | "input_payload">>;

export interface LunaTool {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tool_type: LunaToolType;
  handler_key: string | null;
  enabled: boolean;
  config_schema: Record<string, unknown> | null;
  input_schema: Record<string, unknown> | null;
  output_schema: Record<string, unknown> | null;
  execution_policy: Record<string, unknown> | null;
  version: string;
  created_at: string;
  updated_at: string;
}

export type LunaToolCreate = Omit<LunaTool, "id" | "created_at" | "updated_at">;
export type LunaToolUpdate = Partial<LunaToolCreate>;

export interface LunaAuditLog {
  id: string;
  request_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  status: string;
  audit_metadata?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface LunaOverviewSnapshot {
  status: LunaBffStatus;
  metrics: LunaMetrics | null;
  providers: LunaProviderInfo[];
  health: {
    api: LunaBffStatus;
    database: "ok" | "error" | "unknown";
    redis: "ok" | "error" | "unknown";
    scheduler: "running" | "stopped" | "unknown";
  };
  message?: string;
}

export interface LunaToolRequest {
  id: string;
  task_id: string;
  agent_id: string;
  tool_id: string;
  tool_call_id: string;
  tool_name: string;
  tool_type: string;
  status: string;
  request_payload: Record<string, unknown> | null;
  policy_snapshot: Record<string, unknown> | null;
  error_code: string | null;
  error_message: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface LunaToolExecution {
  id: string;
  request_id: string | null;
  task_id: string;
  agent_id: string;
  tool_id: string;
  tool_name: string;
  tool_type: string;
  status: string;
  request_payload: Record<string, unknown> | null;
  response_payload: Record<string, unknown> | null;
  error_code: string | null;
  error_message: string | null;
  duration_ms: number | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface LunaWorkflow {
  id: string;
  name: string;
  description: string | null;
  version: number;
  status: "draft" | "active" | "disabled" | "archived";
  input_schema: Record<string, unknown> | null;
  output_schema: Record<string, unknown> | null;
  execution_policy: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LunaWorkflowStep {
  id: string;
  workflow_definition_id: string;
  step_key: string;
  name: string;
  description: string | null;
  position: number;
  step_type: "agent_execution" | "tool_execution" | "transform";
  agent_id: string | null;
  tool_id: string | null;
  instruction_template: string | null;
  input_mapping: Record<string, unknown> | null;
  output_mapping: Record<string, unknown> | null;
  condition_expression: Record<string, unknown> | null;
  timeout_seconds: number | null;
  continue_on_failure: boolean;
  created_at: string;
  updated_at: string;
}

export interface LunaWorkflowRun {
  id: string;
  workflow_definition_id: string;
  workflow_version: number;
  status: "pending" | "running" | "paused" | "awaiting_tool_approval" | "completed" | "failed" | "cancelled";
  current_step_position: number | null;
  input_payload: Record<string, unknown> | null;
  output_payload: Record<string, unknown> | null;
  context_payload: Record<string, unknown> | null;
  error_code: string | null;
  error_message: string | null;
  started_by: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LunaWorkflowStepRun {
  id: string;
  workflow_run_id: string;
  workflow_step_id: string;
  step_key: string;
  position: number;
  status: string;
  input_payload: Record<string, unknown> | null;
  output_payload: Record<string, unknown> | null;
  error_code: string | null;
  error_message: string | null;
  agent_id: string | null;
  tool_id: string | null;
  task_id: string | null;
  tool_request_id: string | null;
  duration_ms: number | null;
}

export interface LunaOrchestration {
  id: string;
  name: string;
  description: string | null;
  version: number;
  status: "draft" | "active" | "disabled" | "archived";
  input_schema: Record<string, unknown> | null;
  output_schema: Record<string, unknown> | null;
  execution_policy: Record<string, unknown> | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LunaOrchestrationRole {
  id: string;
  orchestration_definition_id: string;
  role_key: string;
  name: string;
  description: string | null;
  position: number;
  role_type: "coordinator" | "specialist" | "reviewer" | "finalizer";
  agent_id: string;
  instruction_template: string;
  input_mapping: Record<string, unknown> | null;
  output_mapping: Record<string, unknown> | null;
  condition_expression: Record<string, unknown> | null;
  required_output_schema: Record<string, unknown> | null;
  timeout_seconds: number | null;
  continue_on_failure: boolean;
  can_request_tools: boolean;
  created_at: string;
  updated_at: string;
}

export interface LunaOrchestrationRun {
  id: string;
  orchestration_definition_id: string;
  orchestration_version: number;
  status: "pending" | "running" | "paused" | "awaiting_tool_approval" | "completed" | "failed" | "cancelled";
  current_role_position: number | null;
  input_payload: Record<string, unknown> | null;
  output_payload: Record<string, unknown> | null;
  shared_context: Record<string, unknown> | null;
  error_code: string | null;
  error_message: string | null;
  idempotency_key: string | null;
  started_by: string | null;
  started_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LunaOrchestrationRoleRun {
  id: string;
  orchestration_run_id: string;
  orchestration_role_id: string;
  role_key: string;
  role_type: string;
  position: number;
  status: string;
  attempt_number: number;
  agent_id: string;
  task_id: string | null;
  tool_request_id: string | null;
  input_payload: Record<string, unknown> | null;
  output_payload: Record<string, unknown> | null;
  error_code: string | null;
  error_message: string | null;
  duration_ms: number | null;
}
