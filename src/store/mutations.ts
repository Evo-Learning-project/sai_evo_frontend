/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Course,
  Event,
  EventTemplate,
  Exercise,
  Tag,
  User,
} from '@/models';
import axios from 'axios';

export const mutations = {
  initStore: (state: any) => {
    if (state.token) {
      console.log('restoring token');
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + state.token;
    }
  },
  setLoading: (state: any, val: boolean) => (state.loading = val),
  setUser: (state: any, user: User) => {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  },
  setToken: (state: any, token: string) => {
    state.token = token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] =
      'Bearer ' + token;
  },
  resetToken: (state: any) => {
    state.token = '';
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
  },
  setRefreshToken: (state: any, token: string) => {
    state.refreshToken = token;
    localStorage.setItem('refreshToken', token);
  },
  setCourses: (state: any, courses: Course[]) =>
    (state.courses = courses),
  setExercises: (state: any, exercises: Exercise[]) =>
    (state.exercises = exercises),
  setCurrentExercisePage: (state: any, pageNumber: number) =>
    (state.currentExercisePage = pageNumber),
  setEvents: (state: any, events: Event[]) => (state.events = events),
  setTemplates: (state: any, templates: EventTemplate[]) =>
    (state.templates = templates),
  setEvent: (
    state: any,
    { eventId, event }: { eventId: string; event: Event }
  ) =>
    Object.assign(
      state.events.find((e: Event) => e.id == eventId),
      event
    ),
  setTags: (state: any, tags: Tag[]) => (state.tags = tags),
  setActiveCourseId: (state: any, courseId: string) => {
    if (state.activeCourseId !== courseId) {
      state.selectedExercises = [];
    }
    state.activeCourseId = courseId;
  },
  resetSelectedExercises: (state: any) =>
    (state.selectedExercises = []),
  toggleSelectedExercise: (state: any, exercise: Exercise) => {
    const index = state.selectedExercises.findIndex(
      (e: Exercise) => e.id === exercise.id
    );
    if (index !== -1) {
      state.selectedExercises.splice(index, 1);
    } else {
      state.selectedExercises.push(exercise);
    }
  },
};
