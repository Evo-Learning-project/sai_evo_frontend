/* eslint-disable no-constant-condition */
import { Exercise, ExerciseChoice } from '@/models';
import axios from 'axios';
import { SearchFilter } from './interfaces';
import { getUrlQueryParams } from './utils';

// export async function getExercises(
//   courseId: string
// ): Promise<Exercise[]> {
//   const response = await axios.get(`/courses/${courseId}/exercises/`);
//   return response.data;
// }

export async function getExercises(
  courseId: string,
  pageNumber: number,
  filter: SearchFilter | null
): Promise<{ exercises: Exercise[]; moreResults: boolean }> {
  const filterUrlQuery = getUrlQueryParams(filter);
  const response = await axios.get(
    `/courses/${courseId}/exercises/?page=${pageNumber}${filterUrlQuery}`
  );
  return {
    exercises: response.data.results,
    moreResults: !!response.data.next,
  };
}

export async function getExercisesById(
  courseId: string,
  exerciseIds: string[]
): Promise<Exercise[]> {
  let url = `/courses/${courseId}/exercises/`;
  url += `bulk_get/?ids=${exerciseIds.join(',')}`;
  const response = await axios.get(url);
  return response.data;
}

export async function addTagToExercise(
  courseId: string,
  exerciseId: string,
  tag: string
): Promise<void> {
  await axios.put(
    `/courses/${courseId}/exercises/${exerciseId}/tags/`,
    { tag }
  );
}

export async function removeTagFromExercise(
  courseId: string,
  exerciseId: string,
  tag: string
): Promise<void> {
  await axios.delete(
    `/courses/${courseId}/exercises/${exerciseId}/tags/`,
    { data: { tag } }
  );
}

export async function createExercise(
  courseId: string,
  exercise: Exercise
): Promise<Exercise> {
  const response = await axios.post(
    `courses/${courseId}/exercises/`,
    exercise
  );
  return response.data;
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
  return response.data;
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
  return response.data;
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
  return response.data;
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

export async function getExerciseSubExercises(
  courseId: string,
  exerciseId: string
): Promise<Exercise[]> {
  const response = await axios.get(
    `/courses/${courseId}/exercises/${exerciseId}/sub_exercises/`
  );
  return response.data;
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
  return response.data;
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
  return response.data;
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
