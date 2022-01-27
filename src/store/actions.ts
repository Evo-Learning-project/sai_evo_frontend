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
  createExercise,
  createExerciseChoice,
  getExercises,
  updateExercise,
  updateExerciseChoice,
} from '@/api/exercises';

import {
  createEvent,
  createEventTemplate,
  createEventTemplateRule,
  getEvent,
  getEvents,
  partialUpdateEvent,
  updateEvent,
  updateEventTemplateRule,
} from '@/api/events';
import { SearchFilter } from '@/api/interfaces';

export const actions = {
  // converts a token issued by Google to a token usable to authenticate requests to the backend
  convertToken: ({ commit }: { commit: Commit }, token: string) => {
    // console.log('converting token...');
    return new Promise((resolve, reject) => {
      axios
        .post('/users/auth/convert-token/', {
          token,
          grant_type: 'convert_token',
          client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
          client_secret:
            process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET,
          backend: 'google-oauth2',
        })
        .then((response) => {
          // console.log('committing setToken');
          commit('setToken', response.data.access_token);

          // console.log('committing setRefreshToken');
          commit('setRefreshToken', response.data.refresh_token);

          // console.log('resolving');
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getUserData: ({ commit }: { commit: Commit }) => {
    console.log('getting user...');
    return new Promise((resolve, reject) => {
      axios
        .get('/users/me/')
        .then((response) => {
          commit('setUser', response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getCourses: async ({ commit }: { commit: Commit }) => {
    const courses = await getCourses();
    commit('setCourses', courses);
  },
  createExercise: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, exercise }: { courseId: string; exercise: Exercise }
  ) => {
    const newExercise = await createExercise(courseId, exercise);
    if (courseId == state.activeCourseId) {
      commit('setExercises', [newExercise, ...state.exercises]);
    }
    return newExercise;
  },
  createEvent: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, event }: { courseId: string; event: Event }
  ) => {
    const newEvent = await createEvent(courseId, event);
    if (courseId == state.activeCourseId) {
      commit('setEvents', [newEvent, ...state.events]);
    }
    return newEvent;
  },
  createEventTemplate: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      template,
    }: { courseId: string; template: EventTemplate }
  ) => {
    const newTemplate = await createEventTemplate(courseId, template);
    if (courseId == state.activeCourseId) {
      commit('setTemplates', [newTemplate, ...state.templates]);
    }
    return newTemplate;
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
    commit('setActiveCourseId', courseId);
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
