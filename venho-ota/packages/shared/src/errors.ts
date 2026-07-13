export type ErrorCode = 'VALIDATION' | 'INVALID_TRANSITION' | 'GUARDRAIL_VIOLATION' | 'STALE_CONTEXT' | 'UNAUTHORIZED_WRITE' | 'CONNECTOR';
export class DomainError extends Error { constructor(readonly code: ErrorCode, message: string, readonly details: Readonly<Record<string, unknown>> = {}) { super(message); this.name = new.target.name; } }
export class InvalidTransitionError extends DomainError { constructor(from: string, to: string) { super('INVALID_TRANSITION', `Transition ${from} -> ${to} is not allowed`, { from, to }); } }
export class GuardrailViolationError extends DomainError { constructor(message: string, details: Readonly<Record<string, unknown>>) { super('GUARDRAIL_VIOLATION', message, details); } }
export class UnauthorizedWriteError extends DomainError { constructor(mode: string) { super('UNAUTHORIZED_WRITE', `Writes are disabled in ${mode} mode`, { mode }); } }
