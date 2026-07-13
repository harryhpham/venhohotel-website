import type { AgentMode, Booking, DomainError, Result } from '@venho/shared';
export interface ClockPort { now(): Date; }
export interface ConnectorCapabilities { canWrite:boolean; syncLatencySla:number; supportsWebhook:boolean; }
export interface PmsConnectorPort { readBookings(cursor?:string):Promise<{items:readonly Booking[];nextCursor?:string}>; readInventory(from:string,to:string):Promise<readonly unknown[]>; readRates(from:string,to:string):Promise<readonly unknown[]>; capabilities():ConnectorCapabilities; }
export interface AgentControlRecord { schemaVersion:string; mode:AgentMode; changedBy:string; changedAt:string; reason:string; }
export interface AgentControlRepository { get():Promise<AgentControlRecord>; set(record:AgentControlRecord):Promise<void>; }
export interface AuditPort { append(event:{schemaVersion:string;eventType:string;actor:string;at:string;payload:Readonly<Record<string,unknown>>}):Promise<void>; }
export interface UnitOfWorkPort { transaction<T>(work:()=>Promise<T>):Promise<T>; }
export interface UseCase<I,O> { execute(input:I):Promise<Result<O,DomainError>>; }
