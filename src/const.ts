import { FieldList } from "./autoSave";
import { SelectableOption } from "./interfaces";
import {
  Event,
  EventParticipationSlot,
  Exercise,
  ExerciseChoice,
  ExerciseState,
  ExerciseTestCase,
  ExerciseTestCaseType,
  ExerciseType,
} from "./models";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import { icons as testCaseTypeIcons } from "@/assets/exerciseTestCaseTypeIcons";
import { getTranslatedString as _ } from "@/i18n";

export const TEST_CASE_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const TEST_CASE_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<ExerciseTestCase> =
  ["code", "text"];

export const EVENT_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const EVENT_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<Event> = [
  "name",
  "instructions",
];

export const EXERCISE_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const EXERCISE_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<Exercise> = [
  "label",
  "text",
  "solution",
];

export const EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCE_TIME_MS = 3000;
export const EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCED_FIELDS: FieldList<ExerciseChoice> =
  ["text"];

export const EVENT_PARTICIPATION_SLOT_DEBOUNCE_TIME_MS = 10000;
export const EVENT_PARTICIPATION_SLOT_DEBOUNCED_FIELDS: FieldList<EventParticipationSlot> =
  ["answer_text"];

export const exerciseTypeOptions: SelectableOption[] = (
  Object.keys(ExerciseType) as unknown[] as ExerciseType[]
)
  .filter((key: string | number) => parseInt(key as string) == key)
  .map((key) => ({
    icons: exerciseTypesIcons[key],
    value: parseInt(String(key)),
    content: _("exercise_types." + key),
  }));

export const exerciseStateOptions: SelectableOption[] = (
  Object.keys(ExerciseState) as unknown[] as ExerciseState[]
)
  .filter((key: string | number) => parseInt(key as string) == key)
  .map((key) => ({
    icons: exerciseStatesIcons[key],
    value: parseInt(String(key)),
    content: _("exercise_states." + key),
    description: _("exercise_states_descriptions." + key),
  }));

export const testcaseTypeOptions: SelectableOption[] = (
  Object.keys(ExerciseTestCaseType) as unknown[] as ExerciseTestCaseType[]
)
  .filter((key: string | number) => parseInt(key as string) == key)
  .map((key) => ({
    icons: testCaseTypeIcons[key],
    value: parseInt(String(key)),
    content: _("testcase_types." + key),
    description: _("exercise_states_descriptions." + key),
  }));
