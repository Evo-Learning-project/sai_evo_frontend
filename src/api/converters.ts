import { EventParticipationSlot } from "./../models/interfaces";
import { normalizeOptionalStringContainingNumber } from "./utils";
import { Event, EventParticipation, Exercise, ExerciseChoice } from "@/models";
export const normalizeIncomingExercise = (exercise: Exercise): Exercise => ({
  ...exercise,
  sub_exercises: (exercise.sub_exercises ?? []).map((s) =>
    normalizeIncomingExercise(s)
  ),
  child_weight: normalizeOptionalStringContainingNumber(
    exercise.child_weight
  ) as number,
  choices: (exercise.choices ?? []).map((c) =>
    normalizeIncomingExerciseChoice(c)
  ),
});

export const normalizeIncomingExerciseChoice = (
  choice: ExerciseChoice
): ExerciseChoice => ({
  ...choice,
  ...(typeof choice.correctness === "undefined"
    ? {}
    : {
        correctness: normalizeOptionalStringContainingNumber(
          choice.correctness
        ) as number,
      }),
});

export const normalizeIncomingEvent = (event: Event): Event => ({
  ...event,
  time_limit_seconds: normalizeOptionalStringContainingNumber(
    event.time_limit_seconds
  ) as number | null,
});

export const normalizeIncomingEventParticipation = (
  participation: EventParticipation
): EventParticipation => ({
  ...participation,
  ...(typeof participation.score !== "undefined"
    ? {
        score: String(
          // score can currently only be a string, so normalize to get
          // rid of trailing decimal 0's and re-convert to string
          normalizeOptionalStringContainingNumber(participation.score)
        ) as string,
      }
    : {}),
  slots: (participation.slots ?? []).map((s) =>
    normalizeIncomingEventParticipationSlot(s)
  ),
});

export const normalizeIncomingEventParticipationSlot = (
  slot: EventParticipationSlot
): EventParticipationSlot => ({
  ...slot,
  ...(typeof slot.score === "undefined"
    ? {}
    : {
        score: normalizeOptionalStringContainingNumber(slot.score) as
          | number
          | null,
      }),
});
