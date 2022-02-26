import { ExerciseState, ExerciseType } from '@/models';

export interface SearchFilter {
  label?: string;
  text?: string;
  tags?: string[];
  exercise_types?: ExerciseType[];
  states?: ExerciseState[];
}
