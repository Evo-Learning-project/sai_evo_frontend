/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'lodash/debounce';

const EDITOR_DEBOUNCE_TIME_MS = 3000;
const EDITOR_DEBOUNCE_MAX_WAIT_MS = 6000;

const SEARCH_DEBOUNCE_TIME_MS = 500;
const SEARCH_DEBOUNCE_MAX_WAIT_MS = 1000;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getDebouncedForEditor = (callback: any) =>
  debounce(callback, EDITOR_DEBOUNCE_TIME_MS, {
    maxWait: EDITOR_DEBOUNCE_MAX_WAIT_MS,
  });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getDebouncedForFilter = (callback: any) =>
  debounce(callback, SEARCH_DEBOUNCE_TIME_MS, {
    maxWait: SEARCH_DEBOUNCE_MAX_WAIT_MS,
  });

export const getFormattedTimestamp = (timestamp: string): string =>
  timestamp;
