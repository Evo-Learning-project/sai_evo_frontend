import { SearchFilter } from './interfaces';
import store from '@/store';
import { Tag } from '@/models';

export const tagNamesToTags = (names: string[]): Tag[] =>
  // converts a list of tag names to a list of their id's, as per
  // the format used by the backend
  names.map((n) => store.getters.tagByName(n));

export const tagIdsToTags = (ids: string[]): Tag[] => {
  return ids.map((i) => store.getters.tagById(i) as Tag);
};

export const getUrlQueryParams = (
  filters: SearchFilter | null
): string => {
  if (!filters) {
    return '';
  }
  let ret = '';
  if (
    (filters.label?.length ?? 0) > 0 ||
    (filters.exercise_types?.length ?? 0) > 0 ||
    (filters.states?.length ?? 0) > 0 ||
    (filters.tags?.length ?? 0) > 0 ||
    (filters.text?.length ?? 0) > 0
  ) {
    ret += '&';
  }
  if (filters.label || filters.text) {
    ret += `search=${filters.label ?? ''} ${filters.text ?? ''}`;
  }

  return ret;
};
