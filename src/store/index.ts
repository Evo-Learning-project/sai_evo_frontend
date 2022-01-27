import {
  Course,
  Event,
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
import { actions } from './actions';

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
    user: {} as User,
    courses: [] as Course[],
    exercises: [] as Exercise[],
    events: [] as Event[],
    templates: [] as EventTemplate[],
    tags: [] as Tag[],
    activeCourseId: null as string | null,
    currentExercisePage: 1,
    selectedExercises: [] as Exercise[],
    token: '',
    refreshToken: '',
    loading: false,
  },
  getters,
  mutations,
  actions,
  modules: {},
});
