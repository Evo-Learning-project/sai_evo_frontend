/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from 'lodash/debounce';
import moment from 'moment';
import 'moment/locale/it';
import { getTranslatedString } from './i18n';

const EDITOR_DEBOUNCE_TIME_MS = 3000;
const EDITOR_DEBOUNCE_MAX_WAIT_MS = 6000;

const SEARCH_DEBOUNCE_TIME_MS = 500;
const SEARCH_DEBOUNCE_MAX_WAIT_MS = 1000;

const STUDENT_DEBOUNCE_TEXT_TIME_MS = 5000;
const STUDENT_DEBOUNCE_TEXT_MAX_WAIT_MS = 10000;

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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getDebouncedForStudentText = (callback: any) =>
  debounce(callback, STUDENT_DEBOUNCE_TEXT_TIME_MS, {
    maxWait: STUDENT_DEBOUNCE_TEXT_MAX_WAIT_MS,
  });

export const getFormattedTimestamp = (
  timestamp: string,
  dateOnly = false
): string => {
  moment().locale('it');
  return (
    moment(timestamp)
      //.calendar()
      .format(
        'DD MMMM YYYY' +
          (dateOnly
            ? ''
            : `, [${getTranslatedString('misc.at')}] HH:mm`)
      )
  );
};
