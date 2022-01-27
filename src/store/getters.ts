/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Course,
  Event,
  EventTemplate,
  EventType,
  Exercise,
  Tag,
} from '@/models';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const getters = {
  event: (state: any) => (eventId: string) =>
    state.events.find((e: Event) => e.id == eventId) ?? {},
  exercise: (state: any) => (exerciseId: string) =>
    state.exercises.find((e: Exercise) => e.id == exerciseId) ?? {},
  template: (state: any, getters: any) => (eventId: string) =>
    state.templates.find(
      (t: EventTemplate) => t.id == getters.event(eventId).template
    ),
  email: (state: any): string => state.user?.email,
  courses: (state: any): Course[] => state.courses,
  exercises: (state: any): Exercise[] => state.exercises,
  exams: (state: any): Event[] =>
    state.events.filter((e: Event) => e.event_type == EventType.EXAM),
  templates: (state: any): EventTemplate[] => state.templates,
  tags: (state: any): Tag[] => state.tags,
  selectedExercises: (state: any): Exercise[] =>
    state.selectedExercises,
  loading: (state: any): boolean => state.loading,
};
