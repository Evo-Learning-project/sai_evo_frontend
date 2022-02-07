import { Event, EventTemplateRule, Exercise, ExerciseType } from '.';

export enum ExerciseValidationError {
  BLANK_TEXT,
  NO_CHOICES,
  BLANK_CHOICE,
  NO_TESTCASES,
  NO_SUB_EXERCISES,
}

export enum ExamValidationError {
  NO_NAME,
  NO_BEGIN_TIMESTAMP,
  NO_END_TIMESTAMP,
  NO_VALID_TEMPLATE_RULES,
  INVALID_TIMESTAMPS,
}

export const isTemplateRuleValid = (
  rule: EventTemplateRule
): boolean => {
  // TODO implement
  return true;
};

export const getExamValidationErrors = (
  exam: Event
): ExamValidationError[] => {
  const err = ExamValidationError;
  const errors = [] as ExamValidationError[];
  if (exam.name.length === 0) {
    errors.push(err.NO_NAME);
  }

  if (!exam.begin_timestamp) {
    errors.push(err.NO_BEGIN_TIMESTAMP);
  }

  if (!exam.end_timestamp) {
    errors.push(err.NO_END_TIMESTAMP);
  }

  if (
    exam.template?.rules?.length === 0 ||
    exam.template?.rules?.every((r) => !isTemplateRuleValid(r))
  ) {
    errors.push(err.NO_VALID_TEMPLATE_RULES);
  }

  return errors;
};

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
