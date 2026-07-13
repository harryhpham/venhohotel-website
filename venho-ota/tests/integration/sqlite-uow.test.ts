import { describe, expect, it } from 'vitest';
import { createDatabase, SqliteAuditRepository, SqliteControlRepository, SqliteUnitOfWork } from '@venho/adapters';
import type { AgentControlRecord } from '@venho/application';

function record(mode: AgentControlRecord['mode']): AgentControlRecord {
  return { schemaVersion: '1.0', mode, changedBy: 'owner', changedAt: '2026-07-13T00:00:00.000Z', reason: 'test' };
}

describe('SqliteUnitOfWork (real better-sqlite3 driver)', () => {
  it('commits control write and audit append together on success', async () => {
    const database = createDatabase(':memory:');
    const controls = new SqliteControlRepository(database.db);
    const audit = new SqliteAuditRepository(database.db);
    const uow = new SqliteUnitOfWork(database.sqlite);

    await uow.transaction(async () => {
      await controls.set(record('RUNNING'));
      await audit.append({ schemaVersion: '1.0', eventType: 'AGENT_MODE_CHANGED', actor: 'owner', at: '2026-07-13T00:00:00.000Z', payload: { mode: 'RUNNING' } });
    });

    const stored = await controls.get();
    expect(stored.mode).toBe('RUNNING');
    const auditCount = database.sqlite.prepare('SELECT COUNT(*) as n FROM audit_events').get() as { n: number };
    expect(auditCount.n).toBe(1);
    database.close();
  });

  it('rolls back all writes if any step in the transaction throws', async () => {
    const database = createDatabase(':memory:');
    const controls = new SqliteControlRepository(database.db);
    const uow = new SqliteUnitOfWork(database.sqlite);

    await expect(
      uow.transaction(async () => {
        await controls.set(record('RUNNING'));
        throw new Error('audit append failed');
      }),
    ).rejects.toThrow('audit append failed');

    const stored = await controls.get();
    expect(stored.mode).toBe('PAUSED');
    database.close();
  });

  it('applies the P0 migration so all expected tables exist', () => {
    const database = createDatabase(':memory:');
    const tables = database.sqlite
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as Array<{ name: string }>;
    const names = tables.map((t) => t.name);
    for (const expected of ['agent_control', 'audit_events', 'runs', 'bookings', 'alerts']) {
      expect(names).toContain(expected);
    }
    database.close();
  });

  it('rejects writes to audit_events (append-only trigger)', () => {
    const database = createDatabase(':memory:');
    database.sqlite
      .prepare("INSERT INTO audit_events(schema_version,event_type,actor,at,payload) VALUES('1.0','X','owner','2026-07-13T00:00:00.000Z','{}')")
      .run();
    expect(() => database.sqlite.prepare("UPDATE audit_events SET actor='other' WHERE audit_id=1").run()).toThrow();
    expect(() => database.sqlite.prepare('DELETE FROM audit_events WHERE audit_id=1').run()).toThrow();
    database.close();
  });
});
