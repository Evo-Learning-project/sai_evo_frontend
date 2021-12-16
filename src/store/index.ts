import { Course, Event, Exercise, User } from '@/models';
import { createStore } from 'vuex';
import { getCourses } from '@/api/courses';
import { getExercises } from '@/api/exercises';
export default createStore({
  state: {
    user: {} as User,
    courses: [] as Course[],
    exercises: [] as Exercise[],
    events: [] as Event[],
  },
  getters: {
    courses: (state): Course[] => state.courses,
    exercises: (state): Exercise[] => state.exercises,
  },
  mutations: {
    setCourses: (state, courses: Course[]) =>
      (state.courses = courses),
    setExercises: (state, exercises: Exercise[]) =>
      (state.exercises = exercises),
  },
  actions: {
    getCourses: async ({ commit }) => {
      const courses = await getCourses();
      commit('setCourses', courses);
    },
    getExercises: async ({ commit }, courseId) => {
      const exercises = await getExercises(courseId);
      commit('setExercises', exercises);
    },
    // getEvents: async ({ commit }, courseId) => {
    //   const events = await getEvents(courseId);
    //   commit('setEvents', events);
    // },
  },
  modules: {},
});
