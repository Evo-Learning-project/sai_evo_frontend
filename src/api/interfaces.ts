import { ExerciseState, ExerciseType, EventType } from "@/models";

export interface ExerciseSearchFilter {
  label: string;
  text: string;
  tags: string[];
  exercise_types: ExerciseType[];
  states: ExerciseState[];
}

export interface CourseSearchFilter {
  name: string;
  hidden: boolean;
  withPrivileges: boolean;
}

export interface EventSearchFilter {
  event_type?: EventType;
}
