import { EventParticipation, Exercise } from "./models/interfaces";

export interface DataFrequency<T> {
  datum: T;
  frequency: number;
}

// given an array of participations to an event, returns an array of exercises
// where each member has been assigned to a slot in at least one participation
export const getExerciseListFromParticipations = (
  participations: EventParticipation[]
): Exercise[] => participations.flatMap((p) => p.slots).map((s) => s.exercise);

export const getScoreFrequencyFromParticipations = (
  participations: EventParticipation[]
): DataFrequency<string>[] =>
  (
    participations
      .filter((p) => typeof p.score !== "undefined" && p.score !== null)
      .map((p) => p.score) as string[]
  ).reduce((a, s) => {
    const record = a.find((r) => r.datum == s);
    if (record) {
      record.frequency++;
    } else {
      a.push({ datum: s, frequency: 1 });
    }
    return a;
  }, [] as DataFrequency<string>[]);
