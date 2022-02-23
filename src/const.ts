import { FieldList } from './autoSave';
import { Exercise, ExerciseChoice } from './models';

export const EXERCISE_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const EXERCISE_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<Exercise> =
  ['label', 'text', 'solution'];

export const EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<ExerciseChoice> =
  ['text'];
