import { Exercise, ExerciseType, programmingExerciseTypes } from "@/models";

export const isProgrammingExercise = (exercise: Exercise): boolean =>
	programmingExerciseTypes.includes(exercise.exercise_type as ExerciseType);

export const isOpenAnswerExercise = (exercise: Exercise): boolean =>
	exercise.exercise_type === ExerciseType.OPEN_ANSWER;

export const isMultipleChoiceExercise = (exercise: Exercise): boolean =>
	[
		ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
		ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
	].includes(exercise.exercise_type as ExerciseType);

export const getMaxScore = (exercise: Exercise): number | null => {
	const exType = exercise.exercise_type as ExerciseType;
	if ([ExerciseType.OPEN_ANSWER, ExerciseType.ATTACHMENT].includes(exType)) {
		return null;
	}
	if ([ExerciseType.COMPLETION, ExerciseType.AGGREGATED].includes(exType)) {
		return (
			(exercise.sub_exercises ?? [])
				// TODO is 0 the appropriate default? what if I have an aggregated exercise, the sub-exercise is an open answer and its weight is 3? shouldn't it have a 3?
				.map(s => (getMaxScore(s) ?? 0) * (s.child_weight ?? 0))
				.reduce((a, b) => a + b, 0)
		);
	}
	if ([ExerciseType.C, ExerciseType.JS, ExerciseType.PYTHON].includes(exType)) {
		return (exercise.testcases ?? []).length;
	}
	if (exType === ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE) {
		const choices = exercise.choices ?? [];
		if (choices.length === 0) {
			return 0;
		}
		return Math.max(...choices.map(c => c.correctness ?? 0));
	}
	if (exType === ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE) {
		return (exercise.choices ?? [])
			.filter(c => (c.correctness ?? 0) > 0)
			.map(c => c.correctness ?? 0)
			.reduce((a, b) => a + b, 0);
	}
	throw new Error("undefined for exercise type " + exType);
};

export const getCorrectChoices = (exercise: Exercise): string[] => {
	const choices = exercise.choices ?? [];
	const subExercises = exercise.sub_exercises ?? [];
	if (exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE) {
		return choices.filter(c => (c.correctness ?? 0) >= 0).map(c => c.id);
	}
	if (exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE) {
		const maxCorrectness = Math.max(...choices.map(c => c.correctness ?? 0));
		return choices
			.filter(
				c => (c.correctness ?? 0) == maxCorrectness, // TODO use === once api normalization is complete
			)
			.map(c => c.id);
	}
	if (exercise.exercise_type === ExerciseType.COMPLETION) {
		return subExercises.flatMap(s => getCorrectChoices(s));
	}
	return [];
};
