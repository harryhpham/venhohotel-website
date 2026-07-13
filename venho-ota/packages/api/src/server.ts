import Fastify from 'fastify';
import { createDatabase, SqliteAuditRepository, SqliteControlRepository, SqliteUnitOfWork } from '@venho/adapters';
import { GetAgentStatus, SetAgentMode } from '@venho/application';
import { AgentModeSchema } from '@venho/shared';

export function buildServer() {
  const app = Fastify({ logger: { redact: ['req.headers.authorization'] } });
  const database = createDatabase();
  const controls = new SqliteControlRepository(database.db);
  const audit = new SqliteAuditRepository(database.db);
  const uow = new SqliteUnitOfWork(database.sqlite);
  const clock = { now: () => new Date() };

  app.addHook('onRequest', async (req, reply) => {
    if (req.url === '/health') return; // liveness probe: no secrets, must stay reachable by process managers without a token
    const token = process.env.API_AUTH_TOKEN;
    if (!token || req.headers.authorization !== `Bearer ${token}`) {
      return reply.code(401).send({ code: 'UNAUTHORIZED', message: 'Valid bearer token required', details: {} });
    }
  });

  app.get('/api/v1/agent/status', async () => new GetAgentStatus(controls).execute());

  app.post('/api/v1/agent/mode', async (req, reply) => {
    const body = req.body;
    if (typeof body !== 'object' || body === null) {
      return reply.code(400).send({ code: 'VALIDATION', message: 'Request body must be a JSON object', details: {} });
    }
    const record = body as Record<string, unknown>;
    const mode = AgentModeSchema.safeParse(record.mode);
    if (!mode.success) {
      return reply.code(400).send({ code: 'VALIDATION', message: 'Invalid mode', details: { issues: mode.error.issues } });
    }
    const actor = typeof req.headers['x-actor-id'] === 'string' ? req.headers['x-actor-id'] : '';
    if (!actor) {
      return reply.code(400).send({ code: 'VALIDATION', message: 'x-actor-id is required', details: {} });
    }
    const result = await new SetAgentMode(controls, audit, uow, clock).execute({
      mode: mode.data,
      actor,
      reason: typeof record.reason === 'string' ? record.reason : '',
      ...(typeof record.confirmation === 'string' && { confirmation: record.confirmation }),
      ...(typeof record.reauthenticated === 'boolean' && { reauthenticated: record.reauthenticated }),
    });
    if (!result.ok) {
      return reply.code(400).send({ code: result.error.code, message: result.error.message, details: result.error.details });
    }
    return result.value;
  });

  app.get('/health', async () => ({ status: 'ok', schema_version: '1.0', phase: 'P0' }));

  app.addHook('onClose', async () => {
    database.close();
  });

  return app;
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  const app = buildServer();
  const port = Number(process.env.API_PORT ?? 4801);
  app.listen({ host: '127.0.0.1', port }).catch((error) => {
    app.log.error(error);
    process.exitCode = 1;
  });
  process.on('SIGTERM', async () => {
    await app.close();
  });
}
