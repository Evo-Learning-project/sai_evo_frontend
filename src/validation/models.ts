import { helpers, required } from "@vuelidate/validators";
import {
  courseNameUnique,
  idBasedRulePopulated,
  ruleTypeSet,
  tagBasedRulePopulated,
  tagBasedRuleSatisfied,
} from "./validators";

export const courseValidation = {
  name: {
    required,
    unique: courseNameUnique,
    $autoDirty: true,
  },
};

export const eventTemplateRuleValidation = {
  rule_type: {
    ruleTypeSet,
  },
  exercises: {
    idBasedRulePopulated,
  },
  clauses: {
    tagBasedRulePopulated,
  },
  satisfying: {
    tagBasedRuleSatisfied,
  },
};

export const eventTemplateValidation = {
  rules: {
    $each: helpers.forEach(eventTemplateRuleValidation),
    $autoDirty: true,
  },
};

export const eventValidation = {
  name: {
    required,
    $autoDirty: true,
  },
  begin_timestamp: {
    required,
    $autoDirty: true,
  },
  end_timestamp: {
    required,
    $autoDirty: true,
  },
  // template: {
  //   eventTemplateValidation,
  // },
};
