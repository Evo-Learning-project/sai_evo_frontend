import { EventParticipation } from "./models/interfaces";
import { FieldList } from "./autoSave";
import { SelectableOption } from "./interfaces";
import {
  Event,
  EventParticipationSlot,
  EventParticipationState,
  Exercise,
  ExerciseChoice,
  ExerciseState,
  ExerciseTestCase,
  ExerciseTestCaseType,
  ExerciseType,
  ParticipationAssessmentProgress,
} from "./models";
import { icons as exerciseTypesIcons } from "@/assets/exerciseTypesIcons";
import { icons as exerciseStatesIcons } from "@/assets/exerciseStatesIcons";
import { icons as testCaseTypeIcons } from "@/assets/exerciseTestCaseTypeIcons";
import { getTranslatedString as _ } from "@/i18n";
import { ColDef } from "ag-grid-community";

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

export const courseSelectionOptions: SelectableOption[] = [
  { value: "A", content: "Corso A" },
  { value: "B", content: "Corso B" },
  { value: "C", content: "Corso C" },
];

export const CLOZE_SEPARATOR = "[[?]]";

import { icons as assessmentStateIcons } from "@/assets/assessmentStateIcons";
import { icons as participationStateIcons } from "@/assets/participationStateIcons";
export const getEventParticipationMonitorHeaders = (
  resultsMode: boolean,
  eventParticipations: EventParticipation[]
): ColDef[] => {
  if ((eventParticipations?.length ?? 0) === 0) {
    return [];
  }
  const ret = [
    { field: "id", hide: true },
    {
      field: "email",
      headerName: _("event_participation_headings.email"),
      filterParams: {
        filterOptions: ["contains"],
        suppressAndOrCondition: true,
      },
      filter: "agTextColumnFilter",
      width: 300,
      resizable: true,
      cellRenderer: (params: any) =>
        `<div class="flex items-center space-x-1">
            <span class="p-2 mr-2 text-sm ag-selectable-cell material-icons-outlined">launch</span>
            ${params.value}</div>`,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
    },
    {
      field: "fullName",
      headerName: _("misc.full_name"),
      filterParams: {
        filterOptions: ["contains"],
        suppressAndOrCondition: true,
      },
      filter: "agTextColumnFilter",
      minWidth: 120,
      resizable: true,
      flex: 1,
    },
    {
      field: "mat",
      headerName: _("event_participation_headings.mat"),
      filterParams: {
        filterOptions: ["contains"],
        suppressAndOrCondition: true,
      },
      filter: "agTextColumnFilter",
    },
    {
      field: "course",
      headerName: _("event_participation_headings.course"),
      filterParams: {
        filterOptions: ["contains"],
        suppressAndOrCondition: true,
      },
      filter: "agTextColumnFilter",
    },
    { field: "visibility", hide: true },
    ...(resultsMode
      ? [
          {
            field: "state", // assessment progress
            width: 90,
            headerName: _("event_participation_headings.state"),
            cellRenderer: (params: any) =>
              `<span class="${
                params.value ==
                ParticipationAssessmentProgress.PARTIALLY_ASSESSED
                  ? "text-yellow-900"
                  : "text-success"
              } pt-2 ml-1 text-lg material-icons-outlined">${
                assessmentStateIcons[
                  params.value as ParticipationAssessmentProgress
                ]
              }</span>`,
          },
        ]
      : []),
    ...(!resultsMode
      ? [
          {
            field: "state", // participation state (in progress / turned in)
            width: 90,
            headerName: _("event_participation_headings.participation_state"),
            cellRenderer: (params: any) =>
              `<div title="${_(
                "event_participation_states." + params.value
              )}" class=" ag-selectable-cell">
                  <span  class="mx-auto ${
                    params.value == EventParticipationState.IN_PROGRESS
                      ? "text-muted"
                      : "text-success"
                  } text-lg material-icons-outlined">${
                participationStateIcons[params.value as EventParticipationState]
              }</span></div>`,
          },
        ]
      : []),
  ] as ColDef[];
  (eventParticipations[0] as EventParticipation).slots.forEach((s) =>
    ret.push({
      width: 90,
      cellClassRules: {
        //'bg-danger bg-opacity-30': '!x'
      },
      type: "numericColumn",
      field: "slot-" + ((s.slot_number as number) + 1),
      headerName:
        _("event_participation_headings.exercise") +
        " " +
        ((s.slot_number as number) + 1),
      cellRenderer: (params: any) =>
        `<div class="ml-10 -mr-2 ag-selectable-cell ${
          params.value.score ??
          "transition-opacity duration-75 hover:opacity-100 opacity-70 "
        }">` +
        `<span class="mx-auto ${
          resultsMode
            ? params.value.score ??
              "text-lg text-yellow-900 material-icons-outlined"
            : "material-icons-outlined text-lg " +
              (params.data.currentSlotCursor > params.value.slot_number ||
              params.data.state === EventParticipationState.TURNED_IN
                ? "text-success opacity-70"
                : "text-muted opacity-70")
        }">
                  ${
                    resultsMode
                      ? Number.isInteger(parseFloat(params.value.score))
                        ? parseInt(params.value.score)
                        : params.value.score ?? "pending_actions"
                      : params.data.currentSlotCursor >
                          params.value.slot_number ||
                        params.data.state === EventParticipationState.TURNED_IN
                      ? "done"
                      : "more_horiz"
                  }
                </span>` +
        `</div>`,
    })
  );
  return ret;
};

export const MAX_PRACTICE_EXERCISE_COUNT = 50;
