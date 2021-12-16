import { Course } from '@/models';
import axios from 'axios';

export async function getCourses(): Promise<Course[]> {
  const response = await axios.get(`/courses/`);
  return response.data;
}

export async function getCourse(courseId: string): Promise<Course> {
  const response = await axios.get(`/courses/${courseId}/`);
  return response.data;
}

export async function createCourse(course: Course): Promise<Course> {
  const response = await axios.post(`/courses/`, course);
  return response.data;
}

export async function updateCourse(
  courseId: string,
  course: Course
): Promise<Course> {
  const response = await axios.put(`/courses/${courseId}/`, course);
  return response.data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  const response = await axios.delete(`/courses/${courseId}/`);
  return response.data;
}
