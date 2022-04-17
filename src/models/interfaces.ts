import { ExerciseTestCaseType } from "./types";
import {
  EventState,
  EventType,
  ExerciseState,
  ExerciseType,
  EventTemplateRuleType,
  EventParticipationState,
  CoursePrivilege,
  ParticipationAssessmentProgress,
  AssessmentSlotState,
  AssessmentVisibility,
} from ".";

interface Orderable {
  _ordering?: number;
}

interface Lockable {
  locked_by?: User;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  is_teacher: boolean;
  course_privileges?: CoursePrivilege[];
  mat: string;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  privileges?: CoursePrivilege[];
  hidden?: boolean;
  creator?: User;

  // student fields
  participations?: EventParticipation[];
  unstarted_practice_events?: Event[];
  public_exercises_exist?: boolean;
}

export interface Exercise extends Orderable, Lockable {
  id: string;
  text: string;
  solution?: string;
  label?: string;
  exercise_type: ExerciseType | null;
  state?: ExerciseState;
  choices?: ExerciseChoice[];
  testcases?: ExerciseTestCase[];
  sub_exercises?: Exercise[];
  public_tags?: Tag[];
  private_tags?: Tag[];
  max_score?: number;
  correct_choices?: string[];
  requires_typescript?: boolean;
}

export interface ExerciseChoice extends Orderable {
  id: string;
  text: string;
  score_selected?: number;
  score_unselected?: number;
}

export interface ExerciseTestCase {
  id: string;
  code: string;
  text: string;
  stdin: string;
  expected_stdout: string;
  testcase_type: ExerciseTestCaseType;
}

export interface Tag {
  id?: string;
  name: string;
}

export interface Event extends Lockable {
  id: string;
  name: string;
  instructions: string;
  creator?: string;
  begin_timestamp: string | null;
  end_timestamp: string | null;
  event_type: EventType;
  state: EventState;
  users_allowed_past_closure?: string[];
  template?: EventTemplate;
  exercises_shown_at_a_time: number | null;
  allow_going_back: boolean;
  participation_exists?: boolean;
}

export interface EventTemplate {
  id?: string;
  name?: string;
  public?: boolean;
  creator?: string;
  randomize_rule_order: boolean;
  rules: EventTemplateRule[];
}

export interface EventTemplateRule {
  id: string;
  rule_type?: EventTemplateRuleType;
  exercises?: string[];
  clauses?: EventTemplateRuleClause[];
  amount: number;
  _ordering?: number;
  satisfying?: { count: number; example?: Exercise };
}

export interface EventTemplateRuleClause {
  id: string;
  tags: Tag[];
}

export interface EventParticipation {
  id: string;
  event: Event;
  user: User;
  state: EventParticipationState;
  slots: EventParticipationSlot[];
  score?: string;
  max_score?: number;
  last_slot_number?: number;
  begin_timestamp: string;
  end_timestamp?: string;

  // student-only field to indicate whether the assessment has been published for this participation
  assessment_available?: boolean;

  // teacher-only fields
  assessment_progress?: ParticipationAssessmentProgress;
  visibility?: AssessmentVisibility;
  score_edited?: boolean;
}

export interface EventParticipationSlot {
  id: string;
  slot_number?: number;
  exercise: Exercise;
  score?: number;
  comment?: string;
  score_edited?: boolean;
  assessment_state?: AssessmentSlotState;
  sub_slots: EventParticipationSlot[];
  selected_choices: string[];
  answer_text: string;
  seen_at?: string;
  answered_at?: string;
  is_first?: boolean;
  is_last?: boolean;
  execution_results?: CodeExecutionResults;
  attachment?:
    | { name: string; size: number } // download representation
    | Blob; // upload representation
}

export interface CodeExecutionResults {
  state: "running" | "completed" | "internal_error";
  compilation_errors?: string;
  tests?: {
    id: string;
    passed: boolean;
    error?: string;
    stdout?: string;
    stderr?: string;
  }[];
}
