import { normalizeOptionalStringContainingNumber, tagIdsToTags } from "./utils";
import {
	Event,
	EventTemplateRule,
	EventParticipation,
	EventTemplate,
	Exercise,
	ExerciseChoice,
	EventTemplateRuleClause,
	EventParticipationSlot,
	ExerciseSolution,
} from "@/models";

export const normalizeIncomingExercise = (exercise: Exercise): Exercise => ({
	...exercise,
	sub_exercises: (exercise.sub_exercises ?? []).map(s => normalizeIncomingExercise(s)),
	child_weight: normalizeOptionalStringContainingNumber(exercise.child_weight) as number,
	choices: (exercise.choices ?? []).map(c => normalizeIncomingExerciseChoice(c)),
});

export const normalizeIncomingExerciseChoice = (
	choice: ExerciseChoice,
): ExerciseChoice => ({
	...choice,
	...(typeof choice.correctness === "undefined"
		? {}
		: {
				correctness: normalizeOptionalStringContainingNumber(
					choice.correctness,
				) as number,
		  }),
});

export const normalizeIncomingEventParticipation = (
	participation: EventParticipation,
): EventParticipation => ({
	...participation,
	...(typeof participation.score === "undefined"
		? {}
		: {
				score: String(
					// score can currently only be a string, so normalize to get
					// rid of trailing decimal 0's and re-convert to string
					normalizeOptionalStringContainingNumber(participation.score),
				),
		  }),
	slots: (participation.slots ?? []).map(s => normalizeIncomingEventParticipationSlot(s)),
});

export const normalizeIncomingEventParticipationSlot = (
	slot: EventParticipationSlot,
): EventParticipationSlot => ({
	...slot,
	weight: normalizeOptionalStringContainingNumber(slot.weight) as number,
	...(typeof slot.score === "undefined"
		? {}
		: {
				score: normalizeOptionalStringContainingNumber(slot.score) as number | null,
		  }),
});

export const normalizeIncomingEventTemplateRuleClause = (
	clause: EventTemplateRuleClause,
): EventTemplateRuleClause => ({
	...clause,
	// clause tags are sent as id's - convert them to Tag objects
	tags: tagIdsToTags(clause.tags as any), // TODO use interfaces for incoming data
});

export const normalizeIncomingEventTemplateRule = (
	rule: EventTemplateRule,
): EventTemplateRule => ({
	...rule,
	weight: normalizeOptionalStringContainingNumber(rule.weight) as number,
	...(typeof rule.clauses === "undefined"
		? {}
		: {
				clauses: rule.clauses.map(c => normalizeIncomingEventTemplateRuleClause(c)),
		  }),
});

export const normalizeIncomingEventTemplate = (
	template: EventTemplate,
): EventTemplate => ({
	...template,
	rules: template.rules.map(r => normalizeIncomingEventTemplateRule(r)),
});

export const normalizeIncomingEvent = (event: Event): Event => ({
	...event,
	time_limit_seconds: normalizeOptionalStringContainingNumber(
		event.time_limit_seconds,
	) as number | null,
	...(typeof event.template === "undefined"
		? {}
		: { template: normalizeIncomingEventTemplate(event.template) }),
});

export const aggregateExerciseSolutionThreads = (
	solutions: (ExerciseSolution & { exercise: Exercise })[],
): Exercise[] => {
	const exercises = solutions
		.map(s => s.exercise)
		.filter((e, i, a) => a.findIndex(ex => ex.id == e.id) === i);
	solutions.forEach(s => {
		const solutionExercise = exercises.find(e => e.id == s.exercise.id) as Exercise;
		solutionExercise.solutions ??= [];
		const { exercise, ...solution } = s;
		solutionExercise.solutions.push(solution);
	});
	return exercises;
};
