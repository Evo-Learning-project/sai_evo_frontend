import { Exercise, ExerciseChoice, ExerciseTestCase } from "./interfaces";
import { ExerciseType } from ".";

export const multipleChoiceExerciseTypes = [
	ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
	ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
];

export const programmingExerciseTypes = [
	ExerciseType.JS,
	ExerciseType.C,
	ExerciseType.PYTHON,
];

export type exerciseChildName = "choice" | "testcase" | "sub_exercise";
export type exerciseChildrenName = "choices" | "testcases" | "sub_exercises";
export type exerchiseChild = ExerciseChoice | ExerciseTestCase | Exercise;

export interface exerciseChildNameToChildType {
	choice: ExerciseChoice;
	testcase: ExerciseTestCase;
	sub_exercise: Exercise;
}

export interface exerciseChildrenNameToChildType {
	choices: ExerciseChoice[];
	testcases: ExerciseTestCase[];
	sub_exercises: Exercise[];
}

export const exerciseChildrenNames = {
	sub_exercise: "sub_exercises",
	testcase: "testcases",
	choice: "choices",
} as Record<exerciseChildName, exerciseChildrenName>;

export type ProgrammingExerciseType =
	| ExerciseType.JS
	| ExerciseType.C
	| ExerciseType.PYTHON;

export const programmingExerciseTypeToLanguageId: Record<
	ProgrammingExerciseType,
	string
> = {
	[ExerciseType.C]: "c",
	[ExerciseType.JS]: "typescript",
	[ExerciseType.PYTHON]: "python",
};
