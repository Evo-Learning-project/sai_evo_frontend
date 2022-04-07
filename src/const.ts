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
  ["code", "text", "stdin", "expected_stdout"];

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

export enum ProgrammingExerciseTabs {
  TEXT,
  EDITOR,
  TEST_CASES,
}

export const teacherTourSteps = [
  {
    // exercises
    target: "#sidebar-option-2",
    header: {
      title: _("tour.add_exercises_header"),
    },
    content: _("tour.add_exercises_content"),
    params: {
      placement: "right",
    },
  },
  {
    // exams
    target: "#sidebar-option-1",
    header: {
      title: _("tour.add_exams_header"),
    },
    content: _("tour.add_exams_content"),
    params: {
      placement: "right",
    },
  },
  {
    // permissions
    target: "#sidebar-option-3",
    header: {
      title: _("tour.permissions_header"),
    },
    content: _("tour.permissions_content"),
    params: {
      placement: "right",
    },
  },
];

export const tourOptions = {
  highlight: true,

  labels: {
    buttonSkip: _("tour.skip"),
    buttonPrevious: _("tour.previous"),
    buttonNext: _("tour.next"),
    buttonStop: _("tour.finish"),
  },
};

export const programmingExerciseTabsOptions: SelectableOption[] = [
  {
    value: ProgrammingExerciseTabs.TEXT,
    content: _("programming_exercise.tab_text"),
    icons: ["description-sm"],
  },
  {
    value: ProgrammingExerciseTabs.EDITOR,
    content: _("programming_exercise.tab_editor"),
    icons: ["code-sm"],
  },
  {
    value: ProgrammingExerciseTabs.TEST_CASES,
    content: _("programming_exercise.tab_testcases"),
    icons: ["integration_instructions-sm"],
  },
];

export const CLOZE_SEPARATOR = "[[?]]";
