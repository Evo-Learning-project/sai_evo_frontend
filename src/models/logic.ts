import { Event, EventTemplateRule, Exercise, ExerciseType } from ".";

export enum ExerciseValidationError {
  BLANK_TEXT,
  NO_CHOICES,
  BLANK_CHOICE,
  NO_TESTCASES,
  NO_SUB_EXERCISES,
}

export const getExerciseValidationErrors = (
  exercise: Exercise
): ExerciseValidationError[] => {
  const errors = [] as ExerciseValidationError[];

  const et = ExerciseType;
  const err = ExerciseValidationError;

  if (
    [
      et.OPEN_ANSWER,
      et.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
      et.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
    ].includes(exercise.exercise_type as ExerciseType) &&
    exercise.text.length == 0
  ) {
    errors.push(err.BLANK_TEXT);
  }

  if (
    [
      et.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
      et.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
    ].includes(exercise.exercise_type as ExerciseType)
  ) {
    if (exercise.choices?.length == 0) {
      errors.push(err.NO_CHOICES);
    }
    if (exercise.choices?.some((choice) => choice.text.length == 0)) {
      errors.push(err.BLANK_CHOICE);
    }
  }

  return errors;
};
