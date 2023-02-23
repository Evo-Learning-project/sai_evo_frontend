import { isMultipleChoiceExercise } from "./../components/shared/Exercise/utils";
import {
	Course,
	EventTemplateRuleClause,
	EventTemplateRuleSatisfying,
	EventTemplateRuleType,
	Exercise,
	ExerciseChoice,
	ExerciseType,
	EventTemplateRule,
} from "@/models";
import { useMainStore } from "@/stores/mainStore";
import { CLOZE_PLACEHOLDER_REGEX } from "@/const";

export const courseNameUnique = (name: string, course: Course): boolean => {
	const mainStore = useMainStore();
	return mainStore.courses.every(c => c.name !== name || c.id == course.id);
};

export const idBasedRulePopulated = (
	exercises: string[] | undefined,
	rule: EventTemplateRule,
) => rule.rule_type !== EventTemplateRuleType.ID_BASED || (exercises?.length ?? 0) > 0;

export const tagBasedRulePopulated = (
	clauses: EventTemplateRuleClause[] | undefined,
	rule: EventTemplateRule,
) =>
	rule.rule_type !== EventTemplateRuleType.TAG_BASED ||
	(((clauses?.length ?? 0) > 0 && clauses?.some(c => c.tags.length > 0)) ?? false);

export const tagBasedRuleSatisfied = (
	satisfying: EventTemplateRuleSatisfying,
	rule: EventTemplateRule,
) =>
	rule.rule_type !== EventTemplateRuleType.TAG_BASED ||
	(satisfying?.count ?? 0) >= rule.amount;

export const ruleTypeSet = (ruleType: EventTemplateRuleType) =>
	typeof ruleType !== "undefined" && ruleType !== null;

export const choicesRequiredIfMultipleChoiceExercise = (
	choices: ExerciseChoice[],
	exercise: Exercise,
) => !isMultipleChoiceExercise(exercise) || (choices?.length ?? 0) > 0;

export const atLeastOneCorrectChoice = (
	choices: ExerciseChoice[],
	exercise: Exercise,
) => {
	if (
		exercise.exercise_type !== ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE &&
		exercise.exercise_type !== ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
	) {
		return true;
	}
	return choices.some(c => (c.correctness ?? 0) > 0);
};

// checks that, for a cloze exercise, all cloze placeholders in its text
// correspond to sub-exercises of the exercise
export const clozeIdsAreValid = (text: string, exercise: Exercise) =>
	exercise.exercise_type !== ExerciseType.COMPLETION ||
	[...text.matchAll(CLOZE_PLACEHOLDER_REGEX)]
		.map(
			m => m[1], // capture group match, in this case the id of the cloze sub exercise
		)
		.every(id => (exercise.sub_exercises ?? []).some(e => e.id == id));
