import {
  Course,
  Event,
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
  getEvent,
  getEvents,
  updateEvent,
} from '@/api/events';

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
    tags: [] as Tag[],
    activeCourseId: null as string | null,
    selectedExercises: [] as Exercise[],
    token: '',
    refreshToken: '',
    loading: false,
  },
  getters: {
    event: (state) => (eventId: string) =>
      state.events.find((e) => e.id == eventId) ?? {},
    email: (state): string => state.user?.email,
    courses: (state): Course[] => state.courses,
    exercises: (state): Exercise[] => state.exercises,
    exams: (state): Event[] =>
      state.events.filter((e) => e.event_type == EventType.EXAM),
    tags: (state): Tag[] => state.tags,
    selectedExercises: (state): Exercise[] => state.selectedExercises,
    loading: (state): boolean => state.loading,
  },
  mutations: {
    initStore: (state) => {
      if (state.token) {
        console.log('restoring token');
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + state.token;
      }
    },
    setLoading: (state, val: boolean) => (state.loading = val),
    setUser: (state, user) => {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken: (state, token) => {
      state.token = token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + token;
    },
    resetToken: (state) => {
      state.token = '';
      localStorage.removeItem('token');
      axios.defaults.headers.common['Authorization'] = '';
    },
    setRefreshToken: (state, token) => {
      state.refreshToken = token;
      localStorage.setItem('refreshToken', token);
    },
    setCourses: (state, courses: Course[]) =>
      (state.courses = courses),
    setExercises: (state, exercises: Exercise[]) =>
      (state.exercises = exercises),
    setEvents: (state, events: Event[]) => (state.events = events),
    setEvent: (state, { eventId, event }) =>
      Object.assign(
        state.events.find((e) => e.id == eventId),
        event
      ),
    setTags: (state, tags: Tag[]) => (state.tags = tags),
    setActiveCourseId: (state, courseId: string) => {
      if (state.activeCourseId !== courseId) {
        state.selectedExercises = [];
      }
      state.activeCourseId = courseId;
    },
    resetSelectedExercises: (state) => (state.selectedExercises = []),
    toggleSelectedExercise: (state, exercise: Exercise) => {
      const index = state.selectedExercises.findIndex(
        (e) => e.id === exercise.id
      );
      if (index !== -1) {
        state.selectedExercises.splice(index, 1);
      } else {
        state.selectedExercises.push(exercise);
      }
    },
  },
  actions: {
    // converts a token issued by Google to a token usable to authenticate requests to the backend
    convertToken: ({ commit }, token) => {
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
    getUserData: ({ commit }) => {
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
    getCourses: async ({ commit }) => {
      const courses = await getCourses();
      commit('setCourses', courses);
    },
    createExercise: async (
      { commit, state },
      { courseId, exercise }
    ) => {
      const newExercise = await createExercise(courseId, exercise); // getBlankExercise(); //
      if (courseId == state.activeCourseId) {
        commit('setExercises', [newExercise, ...state.exercises]);
      }
      return newExercise;
    },
    createEvent: async ({ commit, state }, { courseId, event }) => {
      const newEvent = await createEvent(courseId, event);
      if (courseId == state.activeCourseId) {
        commit('setEvents', [newEvent, ...state.events]);
      }
      return newEvent;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateExercise: async ({ commit }, { courseId, exercise }) => {
      await updateExercise(courseId, exercise.id, exercise);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateEvent: async ({ commit }, { courseId, event }) => {
      await updateEvent(courseId, event.id, event);
    },
    updateExerciseChoice: async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      { commit },
      { courseId, exerciseId, choice }
    ) => {
      await updateExerciseChoice(
        courseId,
        exerciseId,
        choice.id,
        choice
      );
    },
    addExerciseChoice: async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      { commit, state },
      { courseId, exerciseId, choice }
    ) => {
      const newChoice = await createExerciseChoice(
        courseId,
        exerciseId,
        choice
      );
      state.exercises
        .find((e) => e.id === (exerciseId as string))
        ?.choices?.push(newChoice);
    },
    getExercises: async (
      { commit, state },
      courseId,
      refresh = false,
      filter = null
    ) => {
      // eslint-disable-next-line no-constant-condition
      if (true || courseId != state.activeCourseId || refresh) {
        const exercises = await getExercises(courseId);
        commit('setExercises', exercises);
        commit('setActiveCourseId', courseId);
      }
    },
    getTags: async ({ commit, state }, courseId, refresh = false) => {
      if (courseId != state.activeCourseId || refresh) {
        const tags = await getTags(courseId);
        commit('setTags', tags);
        commit('setActiveCourseId', courseId);
      }
    },
    getEvents: async ({ commit }, courseId) => {
      const events = await getEvents(courseId);
      commit('setEvents', events);
    },
    getEvent: async ({ commit, state }, { courseId, eventId }) => {
      console.log('GETTIN');
      const event = await getEvent(courseId, eventId);
      commit('setEvents', [event, ...state.events]);
    },
  },
  modules: {},
});
