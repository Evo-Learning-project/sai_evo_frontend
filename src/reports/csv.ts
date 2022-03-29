import { getTranslatedString as _ } from "@/i18n";
import { EventParticipation, ExerciseType } from "@/models";
import { get } from "lodash";

const getEventParticipationHeaders = (
  participations: EventParticipation[]
): string[] => [
  "user.email",
  "user.full_name",
  "begin_timestamp",
  "end_timestamp",
  ...participations[0].slots
    .map((__, i) => {
      const ret: string[] = [`slots[${i}].exercise.label`];
      // for each exercise type, check if any participation has that type in the
      // slot with current number, in which case add relevant headers
      const samePositionSlotTypes = participations.map(
        (p) => p.slots[i].exercise.exercise_type
      );
      if (samePositionSlotTypes.some((t) => t === ExerciseType.OPEN_ANSWER)) {
        ret.push(`slots[${i}].answer_text`);
      }
      if (samePositionSlotTypes.some((t) => t === ExerciseType.JS)) {
        ret.push(
          `slots[${i}].passed_testcases`, //! this property doesn't actually exist
          `slots[${i}].failed_testcases` //! this property doesn't actually exist
        );
      }
      if (
        samePositionSlotTypes.some((t) =>
          [
            ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
            ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
          ].includes(t as ExerciseType)
        )
      ) {
        ret.push(`slots[${i}].selected_choices`);
      }
      return ret;
    })
    .flat(),
];

export const getParticipationsAsCsv = (
  participations: EventParticipation[]
): string => {
  const headers = getEventParticipationHeaders(participations);
  const replacer = (key: string, value: string) =>
    value === null ? "" : value;

  return [
    headers.map((h) => _("reports.csv_headers." + h)).join(","),
    ...participations.map((p) =>
      headers.map((field) => JSON.stringify(get(p, field), replacer)).join(",")
    ),
  ].join("\r\n");
};
