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
import { TeacherState } from '../types';

export const getters = {
  exams: (state: TeacherState): Event[] =>
    state.events.filter((e) => e.event_type == EventType.EXAM),
  event: (state: TeacherState) => (eventId: string) =>
    state.events.find((e) => e.id == eventId) ?? getBlankExam(),
  tagById: (state: TeacherState) => (tagId: string) =>
    state.tags.find((t) => t.id == tagId) ?? getBlankTag(),
  tagByName: (state: TeacherState) => (tagName: string) =>
    state.tags.find((t) => t.name == tagName) ?? getBlankTag(),
  exercise: (state: TeacherState) => (exerciseId: string) =>
    state.exercises.find((e) => e.id == exerciseId) ?? {},
};
