/**
 * @layer domain
 * @context execution
 * @owns Pure focus scoring for Today's Focus selection
 * @depends-on none
 * @invariant Domain imports no framework and performs no I/O.
 */

export type FocusCandidate = {
  id: string;
  title: string;
  route: string;
  priority: number;
  dueUrgency: number;
  continuity: number;
  milestoneGate: number;
  businessImpact: number;
  effortFit: number;
  evidenceFresh: boolean;
  hasHumanOwner: boolean;
  suppressed: boolean;
};

export type RankedFocusCandidate = FocusCandidate & {
  focusScore: number;
};

function clampUnit(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function scoreFocusCandidate(candidate: FocusCandidate): RankedFocusCandidate {
  const focusScore =
    clampUnit(candidate.priority) * 0.25 +
    clampUnit(candidate.dueUrgency) * 0.2 +
    clampUnit(candidate.continuity) * 0.2 +
    clampUnit(candidate.milestoneGate) * 0.15 +
    clampUnit(candidate.businessImpact) * 0.1 +
    clampUnit(candidate.effortFit) * 0.1;

  return {
    ...candidate,
    focusScore: Number(focusScore.toFixed(4)),
  };
}

export function chooseTodaysFocus(candidates: FocusCandidate[]): RankedFocusCandidate | null {
  const validCandidates = candidates
    .filter((candidate) => candidate.evidenceFresh)
    .filter((candidate) => candidate.hasHumanOwner)
    .filter((candidate) => !candidate.suppressed)
    .map(scoreFocusCandidate)
    .sort((a, b) => b.focusScore - a.focusScore);

  return validCandidates[0] ?? null;
}
