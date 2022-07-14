import { Exercise, ExerciseType, programmingExerciseTypes } from "@/models";

export const isProgrammingExercise = (exercise: Exercise): boolean =>
  programmingExerciseTypes.includes(exercise.exercise_type as ExerciseType);

export const isOpenAnswerExercise = (exercise: Exercise): boolean =>
  exercise.exercise_type === ExerciseType.OPEN_ANSWER;
