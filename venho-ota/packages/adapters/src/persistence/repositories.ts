import type { AgentControlRecord, AgentControlRepository, AuditPort, UnitOfWorkPort } from '@venho/application';
import { agentControl, auditEvents } from './schema.js';
import type { RawSqliteDatabase, SqliteDatabase } from './database.js';

export class SqliteControlRepository implements AgentControlRepository {
  constructor(private readonly db: SqliteDatabase) {}

  async get(): Promise<AgentControlRecord> {
    const row = await this.db.select().from(agentControl).get();
    if (!row) {
      return { schemaVersion: '1.0', mode: 'PAUSED', changedBy: 'system', changedAt: new Date(0).toISOString(), reason: 'Initial safe state' };
    }
    return { schemaVersion: row.schemaVersion, mode: row.mode as AgentControlRecord['mode'], changedBy: row.changedBy, changedAt: row.changedAt, reason: row.reason };
  }

  async set(record: AgentControlRecord): Promise<void> {
    await this.db
      .insert(agentControl)
      .values({ id: 1, schemaVersion: record.schemaVersion, mode: record.mode, changedBy: record.changedBy, changedAt: record.changedAt, reason: record.reason })
      .onConflictDoUpdate({
        target: agentControl.id,
        set: { schemaVersion: record.schemaVersion, mode: record.mode, changedBy: record.changedBy, changedAt: record.changedAt, reason: record.reason },
      });
  }
}

export class SqliteAuditRepository implements AuditPort {
  constructor(private readonly db: SqliteDatabase) {}

  async append(event: Parameters<AuditPort['append']>[0]): Promise<void> {
    await this.db.insert(auditEvents).values({
      schemaVersion: event.schemaVersion,
      eventType: event.eventType,
      actor: event.actor,
      at: event.at,
      payload: JSON.stringify(event.payload),
    });
  }
}

// better-sqlite3 (and the drizzle driver built on it) only supports *synchronous*
// transaction callbacks. All repository calls made through `db` here resolve
// synchronously under the hood (no real async I/O), so driving the transaction
// boundary with raw BEGIN/COMMIT/ROLLBACK statements around an awaited callback
// is safe and lets multi-repository writes (e.g. control write + audit append)
// commit or roll back together, unlike wrapping an async fn in `db.transaction()`.
export class SqliteUnitOfWork implements UnitOfWorkPort {
  constructor(private readonly sqlite: RawSqliteDatabase) {}

  async transaction<T>(work: () => Promise<T>): Promise<T> {
    this.sqlite.exec('BEGIN IMMEDIATE');
    try {
      const result = await work();
      this.sqlite.exec('COMMIT');
      return result;
    } catch (error) {
      this.sqlite.exec('ROLLBACK');
      throw error;
    }
  }
}
