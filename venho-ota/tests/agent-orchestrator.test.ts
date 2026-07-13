import { describe, expect, it } from 'vitest';
import { Orchestrator, type RunRecorder, type RunStep } from '@venho/agent';
import type { AgentControlRepository } from '@venho/application';

function controlsWithMode(mode: 'RUNNING' | 'READ_ONLY' | 'PAUSED' | 'EMERGENCY_STOP'): AgentControlRepository {
  return {
    get: async () => ({ schemaVersion: '1.0', mode, changedBy: 'owner', changedAt: '2026-07-13T00:00:00.000Z', reason: 'test' }),
    set: async () => undefined,
  };
}

function recorder() {
  const events: string[] = [];
  const runs: RunRecorder = {
    start: async (input) => {
      events.push(`start:${input.runType}`);
    },
    finish: async (input) => {
      events.push(`finish:${input.result}${input.errorCode ? `:${input.errorCode}` : ''}`);
    },
  };
  return { runs, events };
}

const clock = { now: () => new Date('2026-07-13T00:00:00.000Z') };

describe('Orchestrator.executeRun', () => {
  it('skips a scheduled run when the mode disallows scheduled runs (PAUSED)', async () => {
    const { runs, events } = recorder();
    const orchestrator = new Orchestrator(controlsWithMode('PAUSED'), runs, clock, 'v1');
    const result = await orchestrator.executeRun('SYNC_RUN', [], false);
    expect(result.status).toBe('SKIPPED');
    expect(events).toEqual([]);
  });

  it('skips a manual run only in EMERGENCY_STOP', async () => {
    const { runs, events } = recorder();
    const orchestrator = new Orchestrator(controlsWithMode('EMERGENCY_STOP'), runs, clock, 'v1');
    const result = await orchestrator.executeRun('SYNC_RUN', [], true);
    expect(result.status).toBe('SKIPPED');
    expect(events).toEqual([]);
  });

  it('runs steps in order and records SUCCESS', async () => {
    const { runs, events } = recorder();
    const executed: string[] = [];
    const steps: RunStep[] = [
      { name: 'a', execute: async () => void executed.push('a') },
      { name: 'b', execute: async () => void executed.push('b') },
    ];
    const orchestrator = new Orchestrator(controlsWithMode('RUNNING'), runs, clock, 'v1');
    const result = await orchestrator.executeRun('SYNC_RUN', steps, false);
    expect(result.status).toBe('SUCCESS');
    expect(executed).toEqual(['a', 'b']);
    expect(events).toEqual(['start:SYNC_RUN', 'finish:SUCCESS']);
  });

  it('stops on the first failing step and records FAILED with the error name', async () => {
    const { runs, events } = recorder();
    const executed: string[] = [];
    const steps: RunStep[] = [
      { name: 'a', execute: async () => void executed.push('a') },
      {
        name: 'b',
        execute: async () => {
          throw new RangeError('boom');
        },
      },
      { name: 'c', execute: async () => void executed.push('c') },
    ];
    const orchestrator = new Orchestrator(controlsWithMode('RUNNING'), runs, clock, 'v1');
    const result = await orchestrator.executeRun('SYNC_RUN', steps, false);
    expect(result.status).toBe('FAILED');
    expect(executed).toEqual(['a']);
    expect(events).toEqual(['start:SYNC_RUN', 'finish:FAILED:RangeError']);
  });

  it('does not throw out of executeRun when a step fails (no rethrow)', async () => {
    const { runs } = recorder();
    const steps: RunStep[] = [
      {
        name: 'a',
        execute: async () => {
          throw new Error('boom');
        },
      },
    ];
    const orchestrator = new Orchestrator(controlsWithMode('RUNNING'), runs, clock, 'v1');
    await expect(orchestrator.executeRun('SYNC_RUN', steps, false)).resolves.toMatchObject({ status: 'FAILED' });
  });
});
