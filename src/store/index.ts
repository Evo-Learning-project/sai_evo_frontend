import {
  Course,
  Event,
  Exercise,
  getBlankExercise,
  Tag,
  User,
} from '@/models';
import { createStore } from 'vuex';
import { getCourses, getTags } from '@/api/courses';
import { createExercise, getExercises } from '@/api/exercises';
import axios from 'axios';
export default createStore({
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
  },
  getters: {
    courses: (state): Course[] => state.courses,
    exercises: (state): Exercise[] => state.exercises,
    tags: (state): Tag[] => state.tags,
    selectedExercises: (state): Exercise[] => state.selectedExercises,
  },
  mutations: {
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
      const newExercise = getBlankExercise(); //await createExercise(courseId, exercise);
      if (courseId == state.activeCourseId) {
        commit('setExercises', [newExercise, ...state.exercises]);
      }
    },
    getExercises: async (
      { commit, state },
      courseId,
      refresh = false,
      filter = null
    ) => {
      if (courseId != state.activeCourseId || refresh) {
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
    // getEvents: async ({ commit }, courseId) => {
    //   const events = await getEvents(courseId);
    //   commit('setEvents', events);
    // },
  },
  modules: {},
});
