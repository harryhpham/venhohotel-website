import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type RawSqliteDatabase = Database.Database;
export type SqliteDatabase = ReturnType<typeof drizzle>;
export interface OtaDatabase {
  sqlite: RawSqliteDatabase;
  db: SqliteDatabase;
  close: () => void;
}

const migrationsDir = resolve(dirname(fileURLToPath(import.meta.url)), 'migrations');

function applyMigrations(sqlite: RawSqliteDatabase): void {
  const files = readdirSync(migrationsDir)
    .filter((name) => name.endsWith('.sql'))
    .sort();
  for (const file of files) {
    sqlite.exec(readFileSync(resolve(migrationsDir, file), 'utf8'));
  }
}

export function createDatabase(path = process.env.DATABASE_PATH ?? './data/ota.db'): OtaDatabase {
  const isMemory = path === ':memory:';
  const target = isMemory ? path : resolve(path);
  if (!isMemory) mkdirSync(dirname(target), { recursive: true });
  const sqlite = new Database(target);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('busy_timeout = 5000');
  applyMigrations(sqlite);
  const db = drizzle(sqlite);
  return { sqlite, db, close: () => sqlite.close() };
}
