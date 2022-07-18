import { isMultipleChoiceExercise } from "./../components/shared/Exercise/utils";
import { EventTemplateRule } from "./../models/interfaces";
import {
  Course,
  EventTemplateRuleClause,
  EventTemplateRuleSatisfying,
  EventTemplateRuleType,
  Exercise,
  ExerciseChoice,
  ExerciseType,
} from "@/models";
import store from "@/store";
import { SharedState } from "@/store/types";

export const courseNameUnique = (name: string, course: Course): boolean => {
  return (store.state as { shared: SharedState }).shared.courses.every(
    (c) => c.name !== name || c.id == course.id
  );
};

export const idBasedRulePopulated = (
  exercises: string[] | undefined,
  rule: EventTemplateRule
) =>
  rule.rule_type !== EventTemplateRuleType.ID_BASED ||
  (exercises?.length ?? 0) > 0;

export const tagBasedRulePopulated = (
  clauses: EventTemplateRuleClause[] | undefined,
  rule: EventTemplateRule
) =>
  rule.rule_type !== EventTemplateRuleType.TAG_BASED ||
  (((clauses?.length ?? 0) > 0 && clauses?.some((c) => c.tags.length > 0)) ??
    false);

export const tagBasedRuleSatisfied = (
  satisfying: EventTemplateRuleSatisfying,
  rule: EventTemplateRule
) =>
  rule.rule_type !== EventTemplateRuleType.TAG_BASED ||
  (satisfying?.count ?? 0) >= rule.amount;

export const ruleTypeSet = (ruleType: EventTemplateRuleType) =>
  typeof ruleType !== "undefined" && ruleType !== null;

export const choicesRequiredIfMultipleChoiceExercise = (
  choices: ExerciseChoice[],
  exercise: Exercise
) => !isMultipleChoiceExercise(exercise) || (choices?.length ?? 0) > 0;

export const atLeastOneCorrectChoice = (
  choices: ExerciseChoice[],
  exercise: Exercise
) => {
  if (exercise.exercise_type !== ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE) {
    return true;
  }
  return choices.some((c) => (c.correctness_percentage ?? 0) === 10);
};

export const choiceCorrectnessAddsUp = (
  choices: ExerciseChoice[],
  exercise: Exercise
) => {
  if (
    exercise.exercise_type !== ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE
  ) {
    return true;
  }
  // check that, for checkbox exercises, the correctness_percentage values of
  // the correct choices (i.e. those with a strictly positive value) add
  // up to 100% +- 0.01%
  // TODO review this logic
  return (
    Math.abs(
      100 -
        choices
          .filter((c) => (c.correctness_percentage ?? 0) > 0)
          .map((c) => c.correctness_percentage ?? 0)
          .reduce((a, b) => a + b, 0)
    ) < 0.01
  );
};

export const subExerciseWeightAddsUp = (
  subExercises: Exercise[],
  exercise: Exercise
) => {
  if (
    ![ExerciseType.AGGREGATED, ExerciseType.COMPLETION].includes(
      exercise.exercise_type as ExerciseType
    )
  ) {
    return true;
  }
  // check that, for checkbox exercises, the child_weight values of
  // the sub-exercises add up to 100% +- 0.01%
  // TODO review this logic
  return (
    Math.abs(
      100 -
        (exercise.sub_exercises ?? [])
          .map((s) => s.child_weight ?? 0)
          .reduce((a, b) => a + b, 0)
    ) < 0.01
  );
};

// export const rulePopulated = (rule: EventTemplateRule) =>
//   (typeof rule.rule_type !== "undefined" &&
//     rule.rule_type != null &&
//     ((rule.rule_type === EventTemplateRuleType.ID_BASED && // if it's ID-based, it must include at least one exercise
//       (rule.exercises?.length ?? 0) > 0) ||
//       (rule.rule_type === EventTemplateRuleType.TAG_BASED && // if it's tag-based, it must have at least one clause
//         (rule.clauses?.length ?? 0) > 0 &&
//         rule.clauses?.some((c) => c.tags.length > 0)))) ??
//   false; // at least one clause must not be empty
