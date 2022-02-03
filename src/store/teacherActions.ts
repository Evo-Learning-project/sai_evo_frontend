/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';
import {
  Course,
  Event,
  EventTemplate,
  EventTemplateRule,
  EventType,
  Exercise,
  ExerciseChoice,
  Tag,
  User,
} from '@/models';
import { getCourses, getTags } from '@/api/courses';

import { Commit } from 'vuex';

import {
  addTagToExercise,
  createExercise,
  createExerciseChoice,
  getExercises,
  removeTagFromExercise,
  updateExercise,
  updateExerciseChoice,
} from '@/api/exercises';

import {
  createEvent,
  createEventTemplateRule,
  getEvent,
  getEventParticipation,
  getEventParticipations,
  getEvents,
  partialUpdateEvent,
  updateEvent,
  updateEventTemplateRule,
} from '@/api/events';
import { SearchFilter } from '@/api/interfaces';

export const actions = {
  createExercise: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, exercise }: { courseId: string; exercise: Exercise }
  ) => {
    const newExercise = await createExercise(courseId, exercise);
    //if (courseId == state.activeCourseId) {
    commit('setExercises', [newExercise, ...state.exercises]);
    //}
    return newExercise;
  },
  createEvent: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, event }: { courseId: string; event: Event }
  ) => {
    const newEvent = await createEvent(courseId, event);
    //if (courseId == state.activeCourseId) {
    commit('setEvents', [newEvent, ...state.events]);
    //}
    return newEvent;
  },
  getEventParticipations: async (
    { commit }: { commit: Commit },
    { courseId, eventId }: { courseId: string; eventId: string }
  ) => {
    const participations = await getEventParticipations(
      courseId,
      eventId
    );
    commit('setEventParticipations', participations);
  },
  getEventParticipation: async (
    { commit }: { commit: Commit },
    {
      courseId,
      eventId,
      participationId,
    }: { courseId: string; eventId: string; participationId: string }
  ) => {
    const participation = await getEventParticipation(
      courseId,
      eventId,
      participationId
    );
    commit('setEventParticipation', participation);
  },
  updateExercise: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit }: { commit: Commit },
    { courseId, exercise }: { courseId: string; exercise: Exercise }
  ) => {
    await updateExercise(courseId, exercise.id, exercise);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateEvent: async (
    { commit }: { commit: Commit },
    { courseId, event }: { courseId: string; event: Event }
  ) => {
    await updateEvent(courseId, event.id, event);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  partialUpdateEvent: async (
    { commit }: { commit: Commit },
    {
      courseId,
      eventId,
      changes,
    }: {
      courseId: string;
      eventId: string;
      changes: Record<keyof Event, unknown>;
    }
  ) => {
    await partialUpdateEvent(courseId, eventId, changes);
  },
  updateExerciseChoice: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit }: { commit: Commit },
    {
      courseId,
      exerciseId,
      choice,
    }: {
      courseId: string;
      exerciseId: string;
      choice: ExerciseChoice;
    }
  ) => {
    await updateExerciseChoice(
      courseId,
      exerciseId,
      choice.id,
      choice
    );
  },
  updateEventTemplateRule: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit }: { commit: Commit },
    {
      courseId,
      templateId,
      rule,
    }: {
      courseId: string;
      templateId: string;
      rule: EventTemplateRule;
    }
  ) => {
    await updateEventTemplateRule(
      courseId,
      templateId,
      rule.id,
      rule
    );
  },
  addExerciseChoice: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      exerciseId,
      choice,
    }: {
      courseId: string;
      exerciseId: string;
      choice: ExerciseChoice;
    }
  ) => {
    const newChoice = await createExerciseChoice(
      courseId,
      exerciseId,
      choice
    );
    state.exercises
      .find((e: Exercise) => e.id === (exerciseId as string))
      ?.choices?.push(newChoice);
  },
  addEventTemplateRule: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      templateId,
      rule,
    }: {
      courseId: string;
      templateId: string;
      rule: EventTemplateRule;
    }
  ) => {
    const newRule = await createEventTemplateRule(
      courseId,
      templateId,
      rule
    );
    state.events
      .find((e: Event) => e.template?.id === (templateId as string))
      ?.template?.rules?.push(newRule);
  },
  getExercises: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      fromFirstPage = true,
      filters = null,
    }: {
      courseId: string;
      fromFirstPage: boolean;
      filters: SearchFilter | null;
    }
  ) => {
    if (fromFirstPage) {
      commit('setCurrentExercisePage', 1);
    }
    const { exercises, moreResults } = await getExercises(
      courseId,
      state.currentExercisePage,
      filters
    );
    commit(
      'setExercises',
      fromFirstPage ? exercises : [...state.exercises, ...exercises]
    );
    //commit('setActiveCourseId', courseId);
    if (exercises.length > 0) {
      commit('setCurrentExercisePage', state.currentExercisePage + 1);
    }

    return moreResults;
  },
  getTags: async (
    { commit }: { commit: Commit },
    courseId: string
  ) => {
    return;
    // const tags = await getTags(courseId);
    // commit('setTags', tags);
    // commit('setActiveCourseId', courseId);
  },
  addExerciseTag: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      exerciseId,
      tag,
    }: {
      courseId: string;
      exerciseId: string;
      tag: string;
    }
  ) => {
    await addTagToExercise(courseId, exerciseId, tag);
    state.exercises
      .find((e: Exercise) => e.id === (exerciseId as string))
      ?.tags?.push({ name: tag } as Tag);
  },
  removeExerciseTag: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      exerciseId,
      tag,
    }: {
      courseId: string;
      exerciseId: string;
      tag: string;
    }
  ) => {
    await removeTagFromExercise(courseId, exerciseId, tag);
    const target = state.exercises.find(
      (e: Exercise) => e.id === (exerciseId as string)
    ) as Exercise;
    target.tags = target.tags?.filter((t) => t.name != tag);
  },
  getEvents: async (
    { commit }: { commit: Commit },
    courseId: string
  ) => {
    const events = await getEvents(courseId);
    commit('setEvents', events);
  },
  getEvent: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, eventId }: { courseId: string; eventId: string }
  ) => {
    const event = await getEvent(courseId, eventId);
    commit('setEvents', [event, ...state.events]);
  },
};
