import { Exercise } from "./interfaces";
import { ExerciseType } from ".";

export const multipleChoiceExerciseTypes = [
  ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
  ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
];

export const programmingExerciseTypes = [ExerciseType.JS, ExerciseType.C];

export const exerciseChildrenNames = {
  sub_exercise: "sub_exercises",
  testcase: "testcases",
  choice: "choices",
} as Record<string, "sub_exercises" | "testcases" | "choices">;
