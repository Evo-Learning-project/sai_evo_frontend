import {
  EventParticipation,
  ParticipationAssessmentProgress,
  EventTemplateRule,
  EventParticipationState,
  Exercise,
  Event,
} from "@/models";

export const areAllParticipationsFullyAssessed = (
  participations: EventParticipation[]
) =>
  participations.every(
    (p: EventParticipation) =>
      p.assessment_progress === ParticipationAssessmentProgress.FULLY_ASSESSED
  );

export const getParticipationsAverageProgress = (
  participations: EventParticipation[],
  event: Event
) => {
  if (!participations?.length) {
    return 0;
  }
  const divisor =
    (event.template?.rules as EventTemplateRule[])
      .map((r) => r.amount)
      .reduce((a, b) => a + b, 0) * participations.length;

  const perc =
    (100 *
      participations
        .map((p) =>
          p.state === EventParticipationState.TURNED_IN
            ? p.slots.length
            : p.current_slot_cursor ?? 0
        )
        .reduce((a, b) => a + b)) /
    divisor;
  return Math.round(perc * 100) / 100;
};

// given an array of participations to an event, returns an array of exercises
// where each member has been assigned to a slot in at least one participation
export const getExerciseListFromParticipations = (
  participations: EventParticipation[]
): Exercise[] =>
  participations
    .flatMap((p) => p.slots)
    .map((s) => s.exercise)
    .filter((e, i, a) => a.findIndex((o) => o?.id == e?.id) === i); // eliminate duplicates
