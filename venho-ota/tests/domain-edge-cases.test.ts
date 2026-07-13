import { describe, expect, it } from 'vitest';
import { enforceGuardrails, recommendationExpiry } from '@venho/domain';
import { assertWriteAllowed } from '@venho/agent';
import { UnauthorizedWriteError } from '@venho/shared';

describe('guardrails edge cases', () => {
  it('throws when floor exceeds ceiling', () => {
    expect(() =>
      enforceGuardrails({ candidateRate: 500_000, floor: 900_000, ceiling: 800_000, commission: 0, promoStacking: 0, paymentCost: 0, minAcceptableNetRate: 0 }),
    ).toThrow('floor exceeds ceiling');
  });

  it('rejects non-integer input (VND must be an integer)', () => {
    expect(() =>
      enforceGuardrails({ candidateRate: 500_000.5, floor: 400_000, ceiling: 800_000, commission: 0, promoStacking: 0, paymentCost: 0, minAcceptableNetRate: 0 }),
    ).toThrow('candidateRate must be a non-negative VND integer');
  });

  it('rejects negative input', () => {
    expect(() =>
      enforceGuardrails({ candidateRate: -1, floor: 400_000, ceiling: 800_000, commission: 0, promoStacking: 0, paymentCost: 0, minAcceptableNetRate: 0 }),
    ).toThrow();
  });

  it('clamps a candidate below floor up to the floor', () => {
    const result = enforceGuardrails({ candidateRate: 100_000, floor: 400_000, ceiling: 800_000, commission: 0, promoStacking: 0, paymentCost: 0, minAcceptableNetRate: 0 });
    expect(result.finalRate).toBe(400_000);
  });

  it('clamps a candidate above ceiling down to the ceiling', () => {
    const result = enforceGuardrails({ candidateRate: 1_000_000, floor: 400_000, ceiling: 800_000, commission: 0, promoStacking: 0, paymentCost: 0, minAcceptableNetRate: 0 });
    expect(result.finalRate).toBe(800_000);
  });

  it('allows floor === ceiling (fixed-rate edge case)', () => {
    const result = enforceGuardrails({ candidateRate: 500_000, floor: 600_000, ceiling: 600_000, commission: 0, promoStacking: 0, paymentCost: 0, minAcceptableNetRate: 0 });
    expect(result.finalRate).toBe(600_000);
  });
});

describe('ttl-policy boundaries (§5.3 lead-time buckets)', () => {
  const created = new Date('2026-07-13T10:00:00Z');

  it('leadTime=2d -> 2h TTL (boundary, inclusive)', () => {
    expect(recommendationExpiry(created, 2).getTime() - created.getTime()).toBe(2 * 3_600_000);
  });

  it('leadTime=3d -> 6h TTL (first day of next bucket)', () => {
    expect(recommendationExpiry(created, 3).getTime() - created.getTime()).toBe(6 * 3_600_000);
  });

  it('leadTime=7d -> 6h TTL (boundary, inclusive)', () => {
    expect(recommendationExpiry(created, 7).getTime() - created.getTime()).toBe(6 * 3_600_000);
  });

  it('leadTime=8d -> EOD Asia/Ho_Chi_Minh (first day of next bucket)', () => {
    const expiry = recommendationExpiry(created, 8);
    expect(expiry.toISOString()).toBe('2026-07-13T16:59:00.000Z');
  });

  it('leadTime=30d -> EOD Asia/Ho_Chi_Minh (boundary, inclusive)', () => {
    const expiry = recommendationExpiry(created, 30);
    expect(expiry.toISOString()).toBe('2026-07-13T16:59:00.000Z');
  });

  it('leadTime=31d -> 24h TTL (first day of next bucket)', () => {
    expect(recommendationExpiry(created, 31).getTime() - created.getTime()).toBe(24 * 3_600_000);
  });

  it('rejects negative or non-integer lead time', () => {
    expect(() => recommendationExpiry(created, -1)).toThrow();
    expect(() => recommendationExpiry(created, 1.5)).toThrow();
  });
});

describe('mode-guard.assertWriteAllowed', () => {
  it('allows writes only in RUNNING mode', () => {
    expect(() => assertWriteAllowed('RUNNING')).not.toThrow();
  });

  it.each(['READ_ONLY', 'PAUSED', 'EMERGENCY_STOP'] as const)('blocks writes in %s mode', (mode) => {
    expect(() => assertWriteAllowed(mode)).toThrow(UnauthorizedWriteError);
  });
});
