import {
  Event,
  EventState,
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
  EventTemplateRuleType,
  EventType,
  Exercise,
  ExerciseChoice,
  ExerciseState,
  ExerciseType,
} from '.';

export const getBlankChoice = (): ExerciseChoice => ({
  text: '',
  score: 0,
});

export const getBlankExercise = (): Exercise => ({
  label: 'ex-01-abc',
  text: 'wreh09rtruw9r0ertirwereu09rtrwe90uer90rweu09errwqjeoweru09t3reiwqojadsfihur9e0tiwropjadsifgtr',
  exercise_type: null,
  state: ExerciseState.DRAFT,
  solution: '',
  tags: [{ name: 'tag1' }, { name: 'tag2' }, { name: 'tag3' }],
  choices: [],
});

export const getBlankExam = (): Event => ({
  name: '',
  instructions: '',
  begin_timestamp: null,
  end_timestamp: null,
  event_type: EventType.EXAM,
  state: EventState.DRAFT,
  exercises_shown_at_a_time: 1,
  allow_going_back: true,
});

export const getBlankEventTemplate = (): EventTemplate => ({
  rules: [],
  name: '',
});

export const getBlankIdBasedEventTemplateRule = (
  slotNumber: number
): EventTemplateRule => ({
  rule_type: EventTemplateRuleType.ID_BASED,
  exercises: [],
  target_slot_number: slotNumber,
});

export const getBlankTagBasedEventTemplateRule = (
  slotNumber: number
): EventTemplateRule => ({
  rule_type: EventTemplateRuleType.TAG_BASED,
  clauses: [],
  target_slot_number: slotNumber,
});

export const getBlankTagBasedEventTemplateRuleClause =
  (): EventTemplateRuleClause => ({
    tags: [],
  });
