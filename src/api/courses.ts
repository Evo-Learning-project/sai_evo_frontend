import { Course } from '@/models';
import { apiCall } from './base';

export async function getCourses(): Promise<Course[]> {
  const response = await apiCall('get', `/courses/`);
  return response.data;
}

export async function getCourse(courseId: string): Promise<Course> {
  const response = await apiCall('get', `/courses/${courseId}/`);
  return response.data;
}

export async function createCourse(course: Course): Promise<Course> {
  const response = await apiCall('post', `/courses/`, { ...course });
  return response.data;
}

export async function updateCourse(
  courseId: string,
  course: Course
): Promise<Course> {
  const response = await apiCall('put', `/courses/${courseId}/`, {
    ...course,
  });
  return response.data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  const response = await apiCall('delete', `/courses/${courseId}/`);
  return response.data;
}
