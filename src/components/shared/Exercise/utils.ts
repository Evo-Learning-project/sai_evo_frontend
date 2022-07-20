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

export const getCorrectChoices = (exercise: Exercise): string[] => {
  const choices = exercise.choices ?? [];
  const subExercises = exercise.sub_exercises ?? [];
  if (
    exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
  ) {
    return choices.filter((c) => (c.correctness ?? 0) >= 0).map((c) => c.id);
  }
  if (exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE) {
    const maxCorrectness = Math.max(...choices.map((c) => c.correctness ?? 0));
    console.log("mapped", maxCorrectness, choices);
    return choices
      .filter(
        (c) => (c.correctness ?? 0) == maxCorrectness // TODO use === once api normalization is complete
      )
      .map((c) => c.id);
  }
  if (exercise.exercise_type === ExerciseType.COMPLETION) {
    return subExercises.flatMap((s) => getCorrectChoices(s));
  }
  return [];
};
