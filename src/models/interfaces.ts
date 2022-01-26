import {
  EventState,
  EventType,
  ExerciseState,
  ExerciseType,
  EventTemplateRuleType,
  EventParticipationState,
} from '.';

export interface User {
  email: string;
}

export interface Course {
  id?: string;
  name: string;
  description?: string;
}

export interface Exercise {
  id?: string;
  text: string;
  solution?: string;
  label?: string;
  exercise_type: ExerciseType | null;
  state?: ExerciseState;
  choices?: ExerciseChoice[];
  testcases?: ExerciseTestCase[];
  sub_exercises?: Exercise[];
  tags?: Tag[];
}

export interface ExerciseChoice {
  id?: string;
  text: string;
  score?: number;
}

export interface ExerciseTestCase {
  id?: string;
  code: string;
  label: string;
  hidden?: boolean;
}

export interface Tag {
  id?: string;
  name: string;
}

export interface Event {
  id?: string;
  name: string;
  instructions: string;
  creator?: string;
  begin_timestamp: string | null;
  end_timestamp: string | null;
  event_type: EventType;
  state: EventState;
  template?: EventTemplate;
  exercises_shown_at_a_time: number | null;
  allow_going_back: boolean;
}

export interface EventTemplate {
  id?: string;
  name?: string;
  public?: boolean;
  creator?: string;
  rules: EventTemplateRule[];
}

export interface EventTemplateRule {
  id?: string;
  rule_type?: EventTemplateRuleType;
  exercises?: string[];
  clauses?: EventTemplateRuleClause[];
  target_slot_number?: number;
}

export interface EventTemplateRuleClause {
  id?: string;
  tags: Tag[];
}

export interface EventParticipation {
  id: string;
  user?: string;
  state: EventParticipationState;
  slots: EventParticipationSlot[];
  score: number;
}

export interface EventParticipationSlot {
  id: string;
  exercise: Exercise;
  score?: number;
  sub_slots: EventParticipationSlot[];
  selected_choices: string[];
  answer_text: string;
  seen_at?: string;
  answered_at?: string;
}
