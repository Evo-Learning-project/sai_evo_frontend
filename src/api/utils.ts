import { SearchFilter } from "./interfaces";
import store from "@/store";
import { EventTemplateRule, EventTemplateRuleType, Tag } from "@/models";

export const tagNamesToTags = (names: string[]): Tag[] =>
  // converts a list of tag names to a list of their id's, as per
  // the format used by the backend
  names.map((n) => store.getters["shared/tagByName"](n));

export const tagIdsToTags = (ids: string[]): Tag[] => {
  return ids.map((i) => store.getters["shared/tagById"](i) as Tag);
};

export const getUrlQueryParams = (filters: SearchFilter | null): string => {
  if (!filters) {
    return "";
  }
  let ret = "";
  if (
    (filters.label?.length ?? 0) > 0 ||
    (filters.exercise_types?.length ?? 0) > 0 ||
    (filters.states?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0 ||
    (filters.text?.length ?? 0) > 0
  ) {
    ret += "&";
  }
  if (filters.label || filters.text) {
    ret += `search=${encodeURIComponent(
      filters.label ?? ""
    )} ${encodeURIComponent(filters.text ?? "")}`;
  }

  return ret;
};

export const convertEventTemplateRules = (
  rules?: EventTemplateRule[]
): EventTemplateRule[] | undefined => {
  // convert tag-based template rules from backend's format (which uses a list of
  //ids to represent the field `tags` on EventTemplateRuleClause) to the
  // frontend's format, which uses Tag[] for that field
  const processedRules = rules?.map((r) => {
    if (r.rule_type != EventTemplateRuleType.TAG_BASED) {
      return r;
    }
    return {
      ...r,
      clauses: r.clauses?.map((c) => ({
        ...c,
        // we're expecting to receive EventTemplateRuleClause, but the server is sending
        // {id: string, tags: string[]}, so the conversion is needed here
        // ? might fix this by having an EventPayload, EventTemplatePayload, ... interfaces
        tags: tagIdsToTags(c.tags as unknown as string[]),
      })),
    };
  });

  return processedRules;
};
