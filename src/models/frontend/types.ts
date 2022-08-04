import { ADT, matchI } from "ts-adt";

export enum ExerciseType {
  MULTIPLE_CHOICE_SINGLE_POSSIBLE,
  MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
  OPEN_ANSWER,
  COMPLETION,
  AGGREGATED,
  JS,
  ATTACHMENT,
  C,
}

interface ExerciseSolutionsFields {
  solutions: string[]; // ExerciseSolution[]
}

interface ExerciseTeacherFields extends Lockable, Orderable {
  label: string;
  state: string; //TODO ExerciseState
  private_tags: string[]; // TODO Tag[];
}

interface BaseExerciseFields {
  id: string;
  text: string;
  public_tags: string[]; // TODO use Tag and use empty array if absent
  child_weight: number; // TODO put to 1 if absent
}

interface MultipleChoiceRadioExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE;
  choices: string[]; // TODO ExerciseChoice[]
}

interface MultipleChoiceCheckboxExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE;
  choices: string[]; // TODO ExerciseChoice[]
}

interface JSExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.JS;
  requires_typescript: boolean;
  testcases: unknown[]; // TODO JSTestCase[]
}

interface CExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.C;
  testcases: unknown[]; // TODO CTestCase[]
}

interface OpenAnswerExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.OPEN_ANSWER;
}

interface AttachmentExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.ATTACHMENT;
}

interface ClozeExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.COMPLETION;
  sub_exercises: Exercise[];
}

interface AggregatedExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.AGGREGATED;
  sub_exercises: Exercise[];
}

/* with solutions */

interface MultipleChoiceRadioExerciseWithSolutions
  extends MultipleChoiceRadioExercise,
    ExerciseSolutionsFields {}

interface MultipleChoiceCheckboxExerciseWithSolutions
  extends MultipleChoiceCheckboxExercise,
    ExerciseSolutionsFields {}

interface JSExerciseWithSolutions extends JSExercise, ExerciseSolutionsFields {}

interface CExerciseWithSolutions extends CExercise, ExerciseSolutionsFields {}

interface OpenAnswerExerciseWithSolutions
  extends OpenAnswerExercise,
    ExerciseSolutionsFields {}

interface AttachmentExerciseWithSolutions
  extends AttachmentExercise,
    ExerciseSolutionsFields {}

interface ClozeExerciseWithSolutions
  extends ClozeExercise,
    ExerciseSolutionsFields {}

interface AggregatedExerciseWithSolutions
  extends AggregatedExercise,
    ExerciseSolutionsFields {}

/* with teacher fields */

interface MultipleChoiceRadioExerciseWithTeacherFields
  extends MultipleChoiceRadioExerciseWithSolutions,
    ExerciseTeacherFields {}

interface MultipleChoiceCheckboxExerciseWithTeacherFields
  extends MultipleChoiceCheckboxExerciseWithSolutions,
    ExerciseTeacherFields {}

interface JSExerciseWithTeacherFields
  extends JSExerciseWithSolutions,
    ExerciseTeacherFields {}

interface CExerciseWithTeacherFields
  extends CExerciseWithSolutions,
    ExerciseTeacherFields {}

interface OpenAnswerExerciseWithTeacherFields
  extends OpenAnswerExerciseWithSolutions,
    ExerciseTeacherFields {}

interface AttachmentExerciseWithTeacherFields
  extends AttachmentExerciseWithSolutions,
    ExerciseTeacherFields {}

interface ClozeExerciseWithTeacherFields
  extends ClozeExerciseWithSolutions,
    ExerciseTeacherFields {}

interface AggregatedExerciseWithTeacherFields
  extends AggregatedExerciseWithSolutions,
    ExerciseTeacherFields {}

/* ----------------- */

export type Exercise = ADT<{
  MultipleChoiceRadioExercise: MultipleChoiceRadioExercise;
  MultipleChoiceRadioExerciseWithSolutions: MultipleChoiceRadioExerciseWithSolutions;
  MultipleChoiceRadioExerciseWithTeacherFields: MultipleChoiceRadioExerciseWithTeacherFields;

  MultipleChoiceCheckboxExercise: MultipleChoiceCheckboxExercise;
  MultipleChoiceCheckboxExerciseWithSolutions: MultipleChoiceCheckboxExerciseWithSolutions;
  MultipleChoiceCheckboxExerciseWithTeacherFields: MultipleChoiceCheckboxExerciseWithTeacherFields;

  JSExercise: JSExercise;
  JSExerciseWithSolutions: JSExerciseWithSolutions;
  JSExerciseWithTeacherFields: JSExerciseWithTeacherFields;

  CExercise: CExercise;
  CExerciseWithSolutions: CExerciseWithSolutions;
  CExerciseWithTeacherFields: CExerciseWithTeacherFields;

  OpenAnswerExercise: OpenAnswerExercise;
  OpenAnswerExerciseWithSolutions: OpenAnswerExerciseWithSolutions;
  OpenAnswerExerciseWithTeacherFields: OpenAnswerExerciseWithTeacherFields;

  AttachmentExercise: AttachmentExercise;
  AttachmentExerciseWithSolutions: AttachmentExerciseWithSolutions;
  AttachmentExerciseWithTeacherFields: AttachmentExerciseWithTeacherFields;

  ClozeExercise: ClozeExercise;
  ClozeExerciseWithSolutions: ClozeExerciseWithSolutions;
  ClozeExerciseWithTeacherFields: ClozeExerciseWithTeacherFields;

  AggregatedExercise: AggregatedExercise;
  AggregatedExerciseWithSolutions: AggregatedExerciseWithSolutions;
  AggregatedExerciseWithTeacherFields: AggregatedExerciseWithTeacherFields;
}>;

// export type ExerciseWithSolutions =
//   | MultipleChoiceCheckboxExerciseWithSolutions
//   | MultipleChoiceRadioExerciseWithSolutions
//   | JSExerciseWithSolutions
//   | CExerciseWithSolutions
//   | AttachmentExerciseWithSolutions
//   | AggregatedExerciseWithSolutions
//   | ClozeExerciseWithSolutions
//   | OpenAnswerExerciseWithSolutions;

export type ExerciseWithSolutions = Extract<Exercise, ExerciseSolutionsFields>;

export function isExerciseWithSolutions(
  exercise: Exercise
): exercise is ExerciseWithSolutions {
  return [
    "MultipleChoiceCheckboxExerciseWithSolutions",
    "MultipleChoiceRadioExerciseWithSolutions",
    "JSExerciseWithSolutions",
    "CExerciseWithSolutions",
    "AttachmentExerciseWithSolutions",
    "AggregatedExerciseWithSolutions",
    "ClozeExerciseWithSolutions",
    "OpenAnswerExerciseWithSolutions",
  ].includes(exercise._type);
}

type TeacherExercises = Extract<
  Exercise,
  {
    _type:
      | "AggregatedExerciseWithTeacherFields"
      | "ClozeExerciseWithTeacherFields";
  }
>;

interface Orderable {
  _ordering?: number;
}

interface Lockable {
  locked_by?: unknown; // TODO User;
}

export interface IExerciseChoice {
  _ordering?: number;
  id: string;
  text: string;
  correctness?: number;
}

export type CodeExecutionResults = ADT<{
  running: {};
  internal_error: {};
  completed: {
    compilation_errors?: string;
    execution_error?: string;
    tests?: TestCaseExecutionResults[];
  };
}>;

export type TestCaseExecutionResults = ADT<{
  passed: { id: string };
  failed: { error?: string; stdout?: string; stderr?: string };
}>;

declare const t: TestCaseExecutionResults;

matchI(t)({
  failed: () => null,
  passed: () => null,
});
