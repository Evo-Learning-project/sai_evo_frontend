import { helpers, required } from "@vuelidate/validators";
import {
  courseNameUnique,
  idBasedRulePopulated,
  ruleTypeSet,
  tagBasedRulePopulated,
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
};

export const eventTemplateValidation = {
  rules: {
    $each: helpers.forEach(eventTemplateRuleValidation),
    $autoDirty: true,
  },
};
