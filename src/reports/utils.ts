import {
  ReportField,
  ReportSettings,
  ReportSettingsPreset,
  ReportType,
} from "./types";
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

export const getPresets = (): Record<ReportSettingsPreset, ReportSettings> => ({
  [ReportSettingsPreset.ALL_FIELDS]: getAllFieldsReportPreset(),
  [ReportSettingsPreset.MAT_AND_SCORES]: getMatAndScoreReportPreset(),
  [ReportSettingsPreset.FULL_NAME_AND_SCORES]:
    getFullNameAndScoreReportPreset(),
  [ReportSettingsPreset.CUSTOM]: getCustomReportPreset(),
});

export const getCustomReportPreset = (): ReportSettings => ({
  fields: [],
  // reportType: ReportType.CSV,
});

export const getMatAndScoreReportPreset = (): ReportSettings => ({
  fields: [ReportField.STUDENT_MAT, ReportField.SCORE],
  //  reportType: ReportType.CSV,
});

export const getFullNameAndScoreReportPreset = (): ReportSettings => ({
  fields: [ReportField.STUDENT_FULL_NAME, ReportField.SCORE],
  //  reportType: ReportType.CSV,
});

export const getAllFieldsReportPreset = (): ReportSettings => ({
  fields: [
    ReportField.STUDENT_EMAIL,
    ReportField.STUDENT_FULL_NAME,
    ReportField.STUDENT_MAT,
    ReportField.STUDENT_COURSE,
    ReportField.EXERCISES_LABEL,
    ReportField.EXERCISES_ANSWER,
    ReportField.EXERCISES_SCORE,
    ReportField.SCORE,
  ],
  // reportType: ReportType.CSV,
});
