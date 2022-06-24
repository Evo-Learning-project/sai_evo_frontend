import { ExerciseTestCase } from "./interfaces";
import {
  Course,
  Event,
  EventParticipationSlot,
  EventState,
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
  EventTemplateRuleType,
  EventType,
  Exercise,
  ExerciseChoice,
  ExerciseState,
  ExerciseTestCaseType,
  ExerciseType,
  Tag,
} from ".";
import { EventAccessRule } from "./types";

export const getBlankCourse = (): Course => ({
  id: "",
  name: "",
  privileges: [],
});

export const getBlankChoice = (): ExerciseChoice => ({
  id: "",
  text: "",
  score_selected: 0,
  score_unselected: 0,
});

export const getBlankTestCase = (): ExerciseTestCase => ({
  id: "",
  text: "",
  code: "",
  testcase_type: ExerciseTestCaseType.SHOW_CODE_SHOW_TEXT,
  stdin: "",
  expected_stdout: "",
});

export const getBlankExercise = (): Exercise => ({
  id: "",
  label: "",
  text: "",
  exercise_type: ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
  state: ExerciseState.DRAFT,
  solution: "",
  // FIXME remove default tags
  //tags: [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }],
  choices: [],
});

export const getBlankExam = (): Event => ({
  id: "",
  name: "",
  instructions: "",
  begin_timestamp: null,
  end_timestamp: null,
  event_type: EventType.EXAM,
  state: EventState.DRAFT,
  exercises_shown_at_a_time: 1,
  allow_going_back: true,
  randomize_rule_order: false,
  access_rule: EventAccessRule.ALLOW_ACCESS,
  access_rule_exceptions: [],
  template: { rules: [] },
  time_limit_seconds: null,
});

export const getBlankPractice = (): Event => ({
  id: "",
  name: "",
  instructions: "",
  begin_timestamp: null,
  end_timestamp: null,
  event_type: EventType.SELF_SERVICE_PRACTICE,
  state: EventState.OPEN,
  exercises_shown_at_a_time: null,
  allow_going_back: true,
  randomize_rule_order: false,
  time_limit_seconds: null,
});

export const getBlankEventTemplate = (): EventTemplate => ({
  rules: [],
  name: "",
});

export const getBlankEventTemplateRule = (
  rule_type?: EventTemplateRuleType,
  initialAmount?: number
): EventTemplateRule => ({
  id: "",
  amount: initialAmount ?? 1,
  rule_type,
});

export const getBlankTag = (): Tag => ({
  id: "",
  name: "",
});

export const getBlankTagBasedEventTemplateRuleClause = (
  tag?: Tag
): EventTemplateRuleClause => ({
  id: "",
  tags: tag ? [tag] : [],
});

export const getFakeEventParticipationSlot = (
  exercise: Exercise
): EventParticipationSlot => ({
  id: "",
  exercise,
  answer_text: "",
  selected_choices: [],
  sub_slots: [
    ...(exercise.sub_exercises?.map((e) => getFakeEventParticipationSlot(e)) ??
      []),
  ],
});
