/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  EventType,
  Event,
  EventTemplate,
  Exercise,
  getBlankExam,
  getBlankTag,
  Tag,
} from '@/models';

export const getters = {
  exams: (state: any): Event[] =>
    state.events.filter((e: Event) => e.event_type == EventType.EXAM),
  event: (state: any) => (eventId: string) =>
    state.events.find((e: Event) => e.id == eventId) ??
    getBlankExam(),
  tagById: (state: any) => (tagId: string) =>
    state.tags.find((t: Tag) => t.id == tagId) ?? getBlankTag(),
  tagByName: (state: any) => (tagName: string) =>
    state.tags.find((t: Tag) => t.name == tagName) ?? getBlankTag(),
  exercise: (state: any) => (exerciseId: string) =>
    state.exercises.find((e: Exercise) => e.id == exerciseId) ?? {},
  template: (state: any, getters: any) => (eventId: string) =>
    state.templates.find(
      (t: EventTemplate) => t.id == getters.event(eventId).template
    ),
};
