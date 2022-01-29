import {
  Course,
  Event,
  EventParticipation,
  EventTemplate,
  EventType,
  Exercise,
  Tag,
  User,
} from '@/models';
import { createStore } from 'vuex';
import { getCourses, getTags } from '@/api/courses';
import {
  createExercise,
  createExerciseChoice,
  getExercises,
  updateExercise,
  updateExerciseChoice,
} from '@/api/exercises';
import VuexPersistence from 'vuex-persist';
import axios from 'axios';
import {
  createEvent,
  createEventTemplate,
  createEventTemplateRule,
  getEvent,
  getEvents,
  getEventTemplate,
  updateEvent,
  updateEventTemplateRule,
} from '@/api/events';
import { SearchFilter } from '@/api/interfaces';
import { mutations } from './mutations';
import { getters } from './getters';
import { actions as teacherActions } from './teacherActions';
import { actions as studentActions } from './studentActions';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state: {
    user: User;
    token: string;
    refreshToken: string;
  }) => ({
    user: state.user,
    token: state.token,
    refreshToken: state.refreshToken,
  }),
});
export default createStore({
  plugins: [vuexLocal.plugin],
  state: {
    /* shared state */
    user: {} as User,
    courses: [] as Course[],
    token: '',
    refreshToken: '',
    loading: false,

    /* teachers only state*/
    exercises: [] as Exercise[],
    events: [] as Event[],
    templates: [] as EventTemplate[],
    tags: [] as Tag[],
    activeCourseId: null as string | null,
    currentExercisePage: 1,

    /* students only state */
    eventParticipation: null as EventParticipation | null,
  },
  getters,
  mutations,
  actions: {
    ...teacherActions,
    ...studentActions,
  },
  modules: {},
});
