import { EventTemplateRule } from "./../models/interfaces";
import {
  Course,
  EventTemplateRuleClause,
  EventTemplateRuleSatisfying,
  EventTemplateRuleType,
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

// export const rulePopulated = (rule: EventTemplateRule) =>
//   (typeof rule.rule_type !== "undefined" &&
//     rule.rule_type != null &&
//     ((rule.rule_type === EventTemplateRuleType.ID_BASED && // if it's ID-based, it must include at least one exercise
//       (rule.exercises?.length ?? 0) > 0) ||
//       (rule.rule_type === EventTemplateRuleType.TAG_BASED && // if it's tag-based, it must have at least one clause
//         (rule.clauses?.length ?? 0) > 0 &&
//         rule.clauses?.some((c) => c.tags.length > 0)))) ??
//   false; // at least one clause must not be empty
