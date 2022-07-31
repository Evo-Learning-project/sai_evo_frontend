import { VoteType } from "./../models/types";
import {
  normalizeIncomingExercise,
  normalizeIncomingExerciseChoice,
} from "./converters";
import { ExerciseSolution, ExerciseTestCase } from "./../models/interfaces";
/* eslint-disable no-constant-condition */
import {
  CodeExecutionResults,
  Exercise,
  ExerciseChoice,
  ExerciseSolutionComment,
} from "@/models";
import axios from "axios";
import { ExerciseSearchFilter } from "./interfaces";
import { getExerciseUrlQueryParams } from "./utils";

// export async function getExercises(
//   courseId: string
// ): Promise<Exercise[]> {
//   const response = await axios.get(`/courses/${courseId}/exercises/`);
//   return response.data;
// }

export async function getExercises(
  courseId: string,
  pageNumber: number,
  filter: ExerciseSearchFilter | null
): Promise<{ exercises: Exercise[]; moreResults: boolean }> {
  const filterUrlQuery = getExerciseUrlQueryParams(filter);
  const response = await axios.get(
    `/courses/${courseId}/exercises/?page=${pageNumber}${filterUrlQuery}`
  );
  return {
    exercises: (response.data.results as Exercise[]).map((e) =>
      normalizeIncomingExercise(e)
    ),
    moreResults: !!response.data.next,
  };
}

export async function getExercisesById(
  courseId: string,
  exerciseIds: string[]
): Promise<Exercise[]> {
  const url = `/courses/${courseId}/exercises/bulk_get/?ids=${exerciseIds.join(
    ","
  )}`;
  const response = await axios.get(url);
  return response.data.map((e: Exercise) => normalizeIncomingExercise(e));
}

export async function addTagToExercise(
  courseId: string,
  exerciseId: string,
  tag: string,
  isPublic: boolean
): Promise<void> {
  await axios.put(`/courses/${courseId}/exercises/${exerciseId}/tags/`, {
    tag,
    public: isPublic,
  });
}

export async function removeTagFromExercise(
  courseId: string,
  exerciseId: string,
  tag: string,
  isPublic: boolean
): Promise<void> {
  await axios.delete(`/courses/${courseId}/exercises/${exerciseId}/tags/`, {
    data: { tag, public: isPublic },
  });
}

export async function createExercise(
  courseId: string,
  exercise: Exercise
): Promise<Exercise> {
  const response = await axios.post(`courses/${courseId}/exercises/`, exercise);
  return normalizeIncomingExercise(response.data);
}

export async function bulkCreateExercises(
  courseId: string,
  exercises: Exercise[]
): Promise<Exercise[]> {
  const response = await axios.post(
    `courses/${courseId}/exercises/`,
    exercises
  );
  return response.data.map((e: Exercise) => normalizeIncomingExercise(e));
}

export async function updateExercise(
  courseId: string,
  exerciseId: string,
  exercise: Exercise
): Promise<Exercise> {
  const response = await axios.put(
    `courses/${courseId}/exercises/${exerciseId}/`,
    exercise
  );
  return normalizeIncomingExercise(response.data);
}

export async function testProgrammingExerciseSolution(
  courseId: string,
  exerciseId: string
): Promise<CodeExecutionResults> {
  const response = await axios.post(
    `courses/${courseId}/exercises/${exerciseId}/solution_execution_results/`
  );
  return response.data;
}

export async function deleteExercise(
  courseId: string,
  exerciseId: string
): Promise<void> {
  const response = await axios.delete(
    `/courses/${courseId}/exercises/${exerciseId}/`
  );
  return response.data;
}

export async function getExerciseChoices(
  courseId: string,
  exerciseId: string
): Promise<ExerciseChoice[]> {
  const response = await axios.get(
    `/courses/${courseId}/exercises/${exerciseId}/choices/`
  );
  return response.data.map((c: ExerciseChoice) =>
    normalizeIncomingExerciseChoice(c)
  );
}

export async function createExerciseChoice(
  courseId: string,
  exerciseId: string,
  choice: ExerciseChoice
): Promise<ExerciseChoice> {
  const response = await axios.post(
    `/courses/${courseId}/exercises/${exerciseId}/choices/`,
    choice
  );
  return normalizeIncomingExerciseChoice(response.data);
}

export async function updateExerciseChoice(
  courseId: string,
  exerciseId: string,
  choiceId: string,
  choice: ExerciseChoice
): Promise<ExerciseChoice> {
  const response = await axios.put(
    `/courses/${courseId}/exercises/${exerciseId}/choices/${choiceId}/`,
    choice
  );
  return normalizeIncomingExerciseChoice(response.data);
}

export async function deleteExerciseChoice(
  courseId: string,
  exerciseId: string,
  choiceId: string
): Promise<ExerciseChoice> {
  const response = await axios.delete(
    `/courses/${courseId}/exercises/${exerciseId}/choices/${choiceId}/`
  );
  return response.data;
}

export async function deleteExerciseTestCase(
  courseId: string,
  exerciseId: string,
  testcaseId: string
): Promise<ExerciseChoice> {
  const response = await axios.delete(
    `/courses/${courseId}/exercises/${exerciseId}/testcases/${testcaseId}/`
  );
  return response.data;
}

export async function getExerciseSubExercises(
  courseId: string,
  exerciseId: string
): Promise<Exercise[]> {
  const response = await axios.get(
    `/courses/${courseId}/exercises/${exerciseId}/sub_exercises/`
  );
  return response.data.map((e: Exercise) => normalizeIncomingExercise(e));
}

export async function createExerciseSubExercise(
  courseId: string,
  exerciseId: string,
  subExercise: Exercise
): Promise<Exercise> {
  const response = await axios.post(
    `/courses/${courseId}/exercises/${exerciseId}/sub_exercises/`,
    subExercise
  );
  return normalizeIncomingExercise(response.data);
}

export async function updateExerciseSubExercise(
  courseId: string,
  exerciseId: string,
  subExerciseId: string,
  subExercise: Exercise
): Promise<Exercise> {
  const response = await axios.put(
    `/courses/${courseId}/exercises/${exerciseId}/sub_exercises/${subExerciseId}/`,
    subExercise
  );
  return normalizeIncomingExercise(response.data);
}

export async function deleteExerciseSubExercise(
  courseId: string,
  exerciseId: string,
  subExerciseId: string
): Promise<void> {
  const response = await axios.delete(
    `/courses/${courseId}/exercises/${exerciseId}/sub_exercises/${subExerciseId}/`
  );
  return response.data;
}

export async function createExerciseTestCase(
  courseId: string,
  exerciseId: string,
  testcase: ExerciseTestCase
): Promise<ExerciseTestCase> {
  const response = await axios.post(
    `/courses/${courseId}/exercises/${exerciseId}/testcases/`,
    testcase
  );
  return response.data;
}

export async function updateExerciseTestCase(
  courseId: string,
  exerciseId: string,
  testcaseId: string,
  testcase: ExerciseTestCase
): Promise<ExerciseTestCase> {
  const response = await axios.put(
    `/courses/${courseId}/exercises/${exerciseId}/testcases/${testcaseId}/`,
    testcase
  );
  return response.data;
}

export async function createExerciseSolution(
  courseId: string,
  exerciseId: string,
  solution: ExerciseSolution
): Promise<ExerciseSolution> {
  const response = await axios.post(
    `/courses/${courseId}/exercises/${exerciseId}/solutions/`,
    solution
  );
  return response.data;
}

export async function updateExerciseSolution(
  courseId: string,
  exerciseId: string,
  solutionId: string,
  solution: ExerciseSolution
): Promise<ExerciseSolution> {
  const response = await axios.patch(
    `/courses/${courseId}/exercises/${exerciseId}/solutions/${solutionId}/`,
    solution
  );
  return response.data;
}

export async function createExerciseSolutionComment(
  courseId: string,
  exerciseId: string,
  solutionId: string,
  comment: ExerciseSolutionComment
): Promise<ExerciseSolutionComment> {
  const response = await axios.post(
    `/courses/${courseId}/exercises/${exerciseId}/solutions/${solutionId}/comments/`,
    comment
  );
  return response.data;
}

export async function voteExerciseSolution(
  courseId: string,
  exerciseId: string,
  solutionId: string,
  voteType: VoteType
): Promise<void> {
  const response = await axios.post(
    `/courses/${courseId}/exercises/${exerciseId}/solutions/${solutionId}/vote/`,
    voteType
  );
  return response.data;
}
