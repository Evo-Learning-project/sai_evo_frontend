import {
	EventParticipation,
	Exercise,
	EventParticipationSlot,
	ExerciseChoice,
	CodeExecutionResults,
	ExerciseTestCase,
} from "@/models";
import { getTranslatedString as _ } from "@/i18n";
import { DataFrequency } from "@/reports/misc";

// returns an array of pairs <s, f> where s is a score and f is the
// frequency with which that score appears among the given participations
export const getScoreFrequencyFromParticipations = (
	participations: EventParticipation[],
): DataFrequency<string>[] =>
	(
		participations
			.filter(p => typeof p.score !== "undefined" && p.score !== null)
			.map(p => p.score) as string[]
	)
		.reduce((a, s) => {
			const normalizedDatum = String(isNaN(parseFloat(s)) ? s : parseFloat(s));
			const record = a.find(r => r.datum == normalizedDatum);
			if (record) {
				record.frequency++;
			} else {
				a.push({ datum: normalizedDatum, frequency: 1 });
			}
			return a;
		}, [] as DataFrequency<string>[])
		// put numbers first, in ascending order; then non-numeric
		// values in ascending lexicographical order
		.sort((a, b) =>
			isNaN(parseFloat(a.datum))
				? isNaN(parseFloat(b.datum))
					? a.datum < b.datum
						? -1
						: 1
					: -1
				: isNaN(parseFloat(b.datum))
				? isNaN(parseFloat(a.datum))
					? a.datum < b.datum
						? -1
						: 1
					: -1
				: parseFloat(a.datum) < parseFloat(b.datum)
				? -1
				: 1,
		);

export const getTestCasePassingFrequencyFor = (
	exercise: Exercise,
	slots: EventParticipationSlot[],
): {
	scoreFrequency: DataFrequency<number>[];
	testCasePassingRate: Record<string, number>;
} => ({
	scoreFrequency: slots
		.flatMap(s => s.execution_results ?? ({ state: "completed" } as CodeExecutionResults))
		.reduce((a, e) => {
			const testCasesDetails = e.tests ?? [];
			const passedTestCases = testCasesDetails.filter(t => t.passed).length;
			const record = a.find(r => r.datum === passedTestCases);
			if (record) {
				record.frequency++;
			} else {
				a.push({ datum: passedTestCases, frequency: 1 });
			}
			return a;
		}, [] as DataFrequency<number>[])
		.sort((a, b) => (a.datum < b.datum ? -1 : 1)),
	testCasePassingRate: (exercise.testcases as ExerciseTestCase[]).reduce((d, t) => {
		// for each test case in the exercise, get slots
		// whose submission passed the test case
		d[t.id] = slots.filter(s => {
			const testCaseResults = (s.execution_results?.tests ?? []).find(
				rt => String(rt.id) === String(t.id),
			);
			return testCaseResults && testCaseResults.passed;
		}).length;
		return d;
	}, {} as Record<string, number>),
});

// returns an array of pairs <c, f> where c is an ExerciseChoice and
// f is the frequency with which it's been selected in the given slots
export const getChoiceSelectionFrequencyFor = (
	exercise: Exercise,
	slots: EventParticipationSlot[],
): DataFrequency<ExerciseChoice>[] => {
	const selectedChoicesIds = new Set<string>();

	const selectedChoicesFrequency = slots
		.flatMap(s => s.selected_choices)
		.reduce((a, c) => {
			const choice = (exercise.choices ?? []).find(ch => ch.id == c) as ExerciseChoice;
			const record = a.find(r => r.datum.id == c);
			if (record) {
				record.frequency++;
			} else {
				a.push({ datum: choice, frequency: 1 });
			}
			selectedChoicesIds.add(String(c));
			return a;
		}, [] as DataFrequency<ExerciseChoice>[])
		.sort((a, b) => (String(a.datum.id) < String(b.datum.id) ? -1 : 1));

	return [
		...selectedChoicesFrequency,
		// include choices that weren't selected with frequency 0
		...(exercise.choices ?? [])
			.filter(c => !selectedChoicesIds.has(String(c.id)))
			.map(c => ({
				datum: c,
				frequency: 0,
			})),
	];
};
