import {
  Course,
  EventTemplateRule,
  Tag,
  Event,
  EventParticipation,
} from "@/models";
import axios from "axios";
import { convertEventTemplateRules } from "./utils";

export async function getCourses(): Promise<Course[]> {
  const response = await axios.get(`/courses/`);
  return response?.data ?? [];
}

export async function getCourse(courseId: string): Promise<Course> {
  const response = await axios.get(`/courses/${courseId}/`);
  const { unstarted_practice_events, ...course } = response.data;

  if (unstarted_practice_events && unstarted_practice_events.length > 0) {
    const event = unstarted_practice_events[0] as Event; // currently can only have one unstarted event
    const processedRules = convertEventTemplateRules(
      event.template?.rules as EventTemplateRule[]
    );

    const convertedEvent = {
      ...event,
      template: {
        ...event.template,
        rules: processedRules,
      },
    } as Event;

    console.log({
      ...course,
      unstarted_practice_events: [convertedEvent],
    });

    return { ...course, unstarted_practice_events: [convertedEvent] };
  }

  return response.data;
}

export async function createCourse(course: Course): Promise<Course> {
  const response = await axios.post(`/courses/`, course);
  return response.data;
}

export async function getUserCourseParticipations(
  courseId: string,
  userId: string
): Promise<EventParticipation[]> {
  const response = await axios.get(
    `/courses/${courseId}/participations/?user_id=${userId}`
  );
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

export async function getTags(
  courseId: string,
  includeExerciseCount: boolean
): Promise<Tag[]> {
  const response = await axios.get(
    `/courses/${courseId}/tags/${
      includeExerciseCount ? "?include_exercise_count=1" : ""
    }`
  );
  return response.data;
}
