import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '@venho/api';

const ORIGINAL_ENV = { ...process.env };

describe('OTA API server', () => {
  let app: FastifyInstance;

  beforeEach(() => {
    process.env.DATABASE_PATH = ':memory:';
    process.env.API_AUTH_TOKEN = 'test-token';
    app = buildServer();
  });

  afterEach(async () => {
    await app.close();
    process.env = { ...ORIGINAL_ENV };
  });

  it('rejects requests without a bearer token', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/agent/status' });
    expect(res.statusCode).toBe(401);
  });

  it('/health is reachable', async () => {
    const res = await app.inject({ method: 'GET', url: '/health', headers: { authorization: 'Bearer test-token' } });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok', phase: 'P0' });
  });

  it('returns 400 VALIDATION (not a 500 crash) when no body is sent at all', async () => {
    // No payload and no content-type: Fastify parses this as req.body === undefined,
    // which used to reach `(req.body as Record<string,unknown>).mode` unguarded and throw.
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/agent/mode',
      headers: { authorization: 'Bearer test-token' },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().code).toBe('VALIDATION');
  });

  it('returns 400 (not 500) for an empty JSON body', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/agent/mode',
      headers: { authorization: 'Bearer test-token', 'content-type': 'application/json' },
      payload: '',
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for an invalid mode enum value', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/agent/mode',
      headers: { authorization: 'Bearer test-token', 'x-actor-id': 'owner' },
      payload: { mode: 'NOT_A_MODE', reason: 'test' },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().code).toBe('VALIDATION');
  });

  it('requires actor header', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/agent/mode',
      headers: { authorization: 'Bearer test-token' },
      payload: { mode: 'RUNNING', reason: 'test' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('rejects EMERGENCY_STOP without confirmation and reauthentication', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/agent/mode',
      headers: { authorization: 'Bearer test-token', 'x-actor-id': 'owner' },
      payload: { mode: 'EMERGENCY_STOP', reason: 'drill' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('accepts a valid mode change and persists it', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/agent/mode',
      headers: { authorization: 'Bearer test-token', 'x-actor-id': 'owner' },
      payload: { mode: 'RUNNING', reason: 'start of day' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().mode).toBe('RUNNING');

    const status = await app.inject({ method: 'GET', url: '/api/v1/agent/status', headers: { authorization: 'Bearer test-token' } });
    expect(status.json().mode).toBe('RUNNING');
  });
});
