-- P0 schema bootstrap. WAL / foreign_keys / busy_timeout pragmas are per-connection
-- settings applied in code (database.ts), not schema, so they are not repeated here.

CREATE TABLE IF NOT EXISTS agent_control(
  id INTEGER PRIMARY KEY CHECK(id = 1),
  schema_version TEXT NOT NULL,
  mode TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  changed_at TEXT NOT NULL,
  reason TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events(
  audit_id INTEGER PRIMARY KEY AUTOINCREMENT,
  schema_version TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor TEXT NOT NULL,
  at TEXT NOT NULL,
  payload TEXT NOT NULL
);

-- audit_events is append-only: no UPDATE/DELETE, enforced by triggers below.
CREATE TRIGGER IF NOT EXISTS audit_no_update BEFORE UPDATE ON audit_events
BEGIN
  SELECT RAISE(ABORT, 'audit_events is append-only');
END;

CREATE TRIGGER IF NOT EXISTS audit_no_delete BEFORE DELETE ON audit_events
BEGIN
  SELECT RAISE(ABORT, 'audit_events is append-only');
END;

CREATE TABLE IF NOT EXISTS runs(
  run_id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL,
  run_type TEXT NOT NULL,
  mode_at_start TEXT NOT NULL,
  rule_version TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  result TEXT NOT NULL,
  stats TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings(
  booking_id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL,
  ota TEXT NOT NULL,
  ota_booking_id TEXT NOT NULL,
  dedupe_key TEXT NOT NULL UNIQUE,
  source_version INTEGER NOT NULL,
  status TEXT NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  room_type_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(ota, ota_booking_id)
);

CREATE TABLE IF NOT EXISTS alerts(
  alert_id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL,
  severity TEXT NOT NULL,
  condition_code TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);
