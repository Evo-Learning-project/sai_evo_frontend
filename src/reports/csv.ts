import { ExerciseTestCase } from "./../models/interfaces";
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
      const ret: string[] = [`slots[${i}].exercise.label`]; // TODO! if exercise has no label, put text instead
      // for each exercise type, check if any participation has that type in the
      // slot with current number, in which case add relevant headers
      const samePositionSlotTypes = participations.map(
        (p) => p.slots[i].exercise.exercise_type
      );
      if (
        samePositionSlotTypes.some((t) =>
          [ExerciseType.OPEN_ANSWER, ExerciseType.JS].includes(
            t as ExerciseType
          )
        )
      ) {
        ret.push(`slots[${i}].answer_text`);
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
      if (samePositionSlotTypes.some((t) => t === ExerciseType.JS)) {
        ret.push(
          `slots[${i}].passed_testcases`,
          `slots[${i}].failed_testcases`
        );
      } else {
        ret.push(`slots[${i}].score`);
      }
      // TODO! handle upload exercises and aggregated exercises
      return ret;
    })
    .flat(),
];

const getHeaderString = (header: string) => {
  const tokens = header.split(".");
  let i = 0;
  for (const t of tokens) {
    // if the string is in the form "reports.csv_headers.slot[n].something"
    // get the slot number and return the string corresponding to the translation
    // of "report.csv_headers.slot" + n + "reports.csv_headers.slots.something"
    const match = t.match(/slots\[(\d+)\]/);
    if (match != null) {
      const slotNumber = parseInt(match[1]) + 1; // get slot number
      return (
        _("reports.csv_headers.slot") +
        " " +
        slotNumber +
        " " +
        _(
          "reports.csv_headers.slots." +
            tokens.filter((t, j) => j > i).join(".")
        )
      );
    }
    i++;
  }
  return _("reports.csv_headers." + header);
};

const getCellValue = (participation: EventParticipation, field: string) => {
  // for fields that don't actually exist on the participation,
  // or need additional processing, manually set the value
  const matchPassedTestCases = field.match(/slots\[(\d+)\].passed_testcases/);
  const matchFailedTestCases = field.match(/slots\[(\d+)\].failed_testcases/);
  const matchSelectedChoices = field.match(/slots\[(\d+)\].selected_choices/);

  if (matchSelectedChoices !== null) {
    // take the id of the selected choices and map them to the texts of
    // the corresponding choices
    const slot = participation.slots[parseInt(matchSelectedChoices[1])];
    return slot.selected_choices.map(
      (cId) => slot.exercise.choices?.find((c) => c.id === cId)?.text
    );
    // TODO! .join("\r\n"); doesn't work because the value gets stringified, try \\r\\n
  } else if (matchFailedTestCases !== null || matchPassedTestCases !== null) {
    const slot =
      participation.slots[
        parseInt(
          (
            (matchFailedTestCases ?? matchPassedTestCases) as RegExpMatchArray
          )[1]
        )
      ];
    const results = slot.execution_results as any;
    console.log(results, "results", "tests" in results);
    const passedTests =
      results.tests?.filter((t: { passed: boolean }) => t.passed).length ?? 0;
    return matchPassedTestCases !== null
      ? passedTests
      : (slot.exercise.testcases as ExerciseTestCase[]).length - passedTests;
  }

  // otherwise, simply access the field on the participation or its children objects
  return get(participation, field);
};

export const getParticipationsAsCsv = (
  participations: EventParticipation[]
): string => {
  const headers = getEventParticipationHeaders(participations);
  const replacer = (key: string, value: string) =>
    value === null
      ? ""
      : typeof value === "string"
      ? value.replace(/"/g, '""')
      : value;

  const ret = [
    headers.map((h) => getHeaderString(h)).join(","),
    ...participations.map((p) =>
      headers
        .map((field) =>
          JSON.stringify(getCellValue(p, field), replacer).replace(/\\"/g, '"')
        )
        .join(",")
    ),
  ].join("\r\n");
  console.log(ret);
  return ret;
};
