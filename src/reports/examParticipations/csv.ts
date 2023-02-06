import { ReportField, ReportSettings } from "./types";
import { getTranslatedString as _ } from "@/i18n";
import { EventParticipation, ExerciseType, ExerciseTestCase } from "@/models";
import { get } from "lodash";
import { isNumeric } from "@/api/utils";

/**
 * Returns a list of headers to be used when generating the CSV report.
 * The list is constructed by using the given settings and only including
 * the fields which are enabled in the settings.
 */
const getEventParticipationHeaders = (
	participations: EventParticipation[],
	reportSettings: ReportSettings,
): string[] => [
	...(reportSettings.fields.includes(ReportField.STUDENT_EMAIL) ? ["user.email"] : []),
	...(reportSettings.fields.includes(ReportField.STUDENT_MAT) ? ["user.mat"] : []),
	...(reportSettings.fields.includes(ReportField.STUDENT_COURSE) ? ["user.course"] : []),
	...(reportSettings.fields.includes(ReportField.STUDENT_FULL_NAME)
		? ["user.last_name", "user.first_name"]
		: []),
	// TODO explicit condition for timestamp fields
	...(reportSettings.fields.includes(ReportField.EXERCISES_ANSWER) ||
	reportSettings.fields.includes(ReportField.EXERCISES_SCORE) ||
	reportSettings.fields.includes(ReportField.EXERCISES_LABEL)
		? ["begin_timestamp", "end_timestamp"]
		: []),
	...(reportSettings.fields.includes(ReportField.EXERCISES_ANSWER) ||
	reportSettings.fields.includes(ReportField.EXERCISES_SCORE) ||
	reportSettings.fields.includes(ReportField.EXERCISES_LABEL)
		? participations[0].slots.map((__, i) => {
				const ret: string[] = reportSettings.fields.includes(ReportField.EXERCISES_LABEL)
					? [`slots[${i}].exercise.label`]
					: []; // TODO! if exercise has no label, put text instead
				// for each exercise type, check if any participation has that type in the
				// slot with current number, in which case add relevant headers
				const samePositionSlotTypes = participations.map(
					p => p.slots[i].exercise.exercise_type,
				);
				const samePositionExercises = participations.map(p => p.slots[i].exercise);
				if (
					reportSettings.fields.includes(ReportField.EXERCISES_ANSWER) &&
					samePositionSlotTypes.some(t =>
						[ExerciseType.OPEN_ANSWER, ExerciseType.JS, ExerciseType.C].includes(
							t as ExerciseType,
						),
					)
				) {
					ret.push(`slots[${i}].answer_text`);
				}
				if (
					reportSettings.fields.includes(ReportField.EXERCISES_ANSWER) &&
					samePositionSlotTypes.some(t =>
						[
							ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
							ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
						].includes(t as ExerciseType),
					)
				) {
					ret.push(`slots[${i}].selected_choices`);
				}
				if (
					reportSettings.fields.includes(ReportField.EXERCISES_SCORE) &&
					samePositionSlotTypes.some(t =>
						[ExerciseType.JS, ExerciseType.C].includes(t as ExerciseType),
					)
				) {
					const otherProgrammingExercises = samePositionExercises.filter(e =>
						[ExerciseType.JS, ExerciseType.C].includes(e.exercise_type as ExerciseType),
					);
					// add as many "testcase i passed" columns as the highest number
					// of testcases in the exercises of the same slot
					const maxTestcases = Math.max(
						...otherProgrammingExercises.map(e => e.testcases?.length ?? 0),
					);
					[...Array(maxTestcases)].forEach((_, j) =>
						ret.push(`slots[${i}].passed_testcase_${j}`),
					);

					ret.push(`slots[${i}].passed_testcases`, `slots[${i}].failed_testcases`);
				} else if (reportSettings.fields.includes(ReportField.EXERCISES_SCORE)) {
					ret.push(`slots[${i}].score`);
				}
				// TODO! handle upload exercises and aggregated exercises
				return ret;
		  })
		: []
	).flat(),
	...(reportSettings.fields.includes(ReportField.SCORE) ? ["score"] : []),
];

/**
 * Takes in a header and returns its trnslated version
 */
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
				_("reports.csv_headers.slots." + tokens.filter((t, j) => j > i).join("."))
			);
		}
		i++;
	}
	return _("reports.csv_headers." + header);
};

/**
 * Takes in a participation and the name of a field of the CSV report.
 * Returns the value of the field on the participation, performing nested
 * lookups as needed. The exact nature of the performed lookup depends
 * on the field accessed.
 */
const getCellValue = (participation: EventParticipation, field: string) => {
	// for fields that don't actually exist on the participation,
	// or need additional processing, manually set the value
	const matchPassedTestCases = field.match(/slots\[(\d+)\].passed_testcases/);
	const matchPassedTestCase = field.match(/slots\[(\d+)\].passed_testcase_(\d+)/);
	const matchFailedTestCases = field.match(/slots\[(\d+)\].failed_testcases/);
	const matchSelectedChoices = field.match(/slots\[(\d+)\].selected_choices/);

	if (matchSelectedChoices !== null) {
		// take the id of the selected choices and map them to the texts of
		// the corresponding choices
		const slot = participation.slots[parseInt(matchSelectedChoices[1])];
		return slot.selected_choices
			.map(cId => slot.exercise.choices?.find(c => c.id === cId)?.text) // TODO strip off html from text - write a general function that does that from any text and use for answers etc.
			.join(" --- ");
	} else if (matchFailedTestCases !== null || matchPassedTestCases !== null) {
		const slot =
			participation.slots[
				parseInt(((matchFailedTestCases ?? matchPassedTestCases) as RegExpMatchArray)[1])
			];
		const results = slot.execution_results ?? { tests: [] };
		const passedTests =
			results.tests?.filter((t: { passed: boolean }) => t.passed).length ?? 0;
		return matchPassedTestCases !== null
			? passedTests
			: (slot.exercise.testcases as ExerciseTestCase[]).length - passedTests;
	} else if (matchPassedTestCase !== null) {
		const slot = participation.slots[parseInt(matchPassedTestCase[1])];
		const testcaseIndex = parseInt(matchPassedTestCase[2]);
		const testcase = slot.exercise.testcases?.[testcaseIndex] as ExerciseTestCase;

		const executionResults = slot.execution_results ?? { tests: [] };

		return executionResults.tests?.find(t => t.id == testcase?.id)?.passed ?? false;
	}

	// otherwise, simply access the field on the participation or its children objects
	return get(participation, field);
};

/**
 * Takes in an array of participations and a settings object, and returns
 * a string which is a valid CSV containing the report of those participations.
 */
export const getParticipationsAsCsv = (
	participations: EventParticipation[],
	reportSettings: ReportSettings,
): string => {
	const headers = getEventParticipationHeaders(participations, reportSettings);
	const replacer = (key: string, value: string) => {
		if (value === null) {
			return null;
		}
		if (isNumeric(value)) {
			// ! TODO keep an eye on this, locale problems
			return String(parseFloat(value)).replace(".", ",");
		}

		if (typeof value === "string") {
			return value
				.replace(/\\n/g, "\n")
				.replace(/<img src="[^"]+"/g, "[img]")
				.replace(/"/g, '""');
		}
		return value;
	};

	const ret = [
		headers.map(h => getHeaderString(h)).join(","),
		...participations.map(p =>
			headers
				.map(field =>
					JSON.stringify(getCellValue(p, field), replacer).replace(/\\"/g, '"'),
				)
				.join(","),
		),
	].join("\r\n");
	return ret;
};
