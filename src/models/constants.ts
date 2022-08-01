import { Exercise } from "./interfaces";
import { ExerciseType } from ".";

export const multipleChoiceExerciseTypes = [
  ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
  ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
];

export const programmingExerciseTypes = [ExerciseType.JS, ExerciseType.C];

export type exerciseChildName =
  | "choice"
  | "testcase"
  | "sub_exercise"
  | "solution";

export const exerciseChildrenNames = {
  sub_exercise: "sub_exercises",
  testcase: "testcases",
  choice: "choices",
  solution: "solutions",
} as Record<
  exerciseChildName,
  "sub_exercises" | "testcases" | "choices" | "solutions"
>;
