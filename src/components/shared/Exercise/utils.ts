import { Exercise, ExerciseType, programmingExerciseTypes } from "@/models";

export const isProgrammingExercise = (exercise: Exercise): boolean =>
  programmingExerciseTypes.includes(exercise.exercise_type as ExerciseType);

export const isOpenAnswerExercise = (exercise: Exercise): boolean =>
  exercise.exercise_type === ExerciseType.OPEN_ANSWER;

export const getCorrectChoices = (exercise: Exercise): string[] => {
  const choices = exercise.choices ?? [];
  const subExercises = exercise.sub_exercises ?? [];
  if (
    exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
  ) {
    return choices
      .filter((c) => (c.correctness_percentage ?? 0) >= 0)
      .map((c) => c.id);
  }
  if (exercise.exercise_type === ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE) {
    const maxCorrectnessPercentage = Math.max(
      ...choices.map((c) => c.correctness_percentage ?? 0)
    );
    console.log("mapped", maxCorrectnessPercentage, choices);
    return choices
      .filter(
        (c) => (c.correctness_percentage ?? 0) == maxCorrectnessPercentage // TODO use === once api normalization is complete
      )
      .map((c) => c.id);
  }
  if (exercise.exercise_type === ExerciseType.COMPLETION) {
    return subExercises.flatMap((s) => getCorrectChoices(s));
  }
  return [];
};
