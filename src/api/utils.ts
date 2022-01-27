import { SearchFilter } from './interfaces';

export const getUrlQueryParams = (
  filters: SearchFilter | null
): string => {
  if (!filters) {
    return '';
  }
  console.log('HERE');
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
