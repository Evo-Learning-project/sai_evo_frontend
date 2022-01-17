/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'lodash/debounce';

const DEBOUNCE_TIME_MS = 3000;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getDebounced = (callback: any) =>
  debounce(callback, DEBOUNCE_TIME_MS);
