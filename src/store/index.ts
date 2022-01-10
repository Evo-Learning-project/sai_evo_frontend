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
export default createStore({
  state: {
    user: {} as User,
    courses: [] as Course[],
    exercises: [] as Exercise[],
    events: [] as Event[],
    tags: [] as Tag[],
    activeCourseId: null as string | null,
    selectedExercises: [] as Exercise[],
  },
  getters: {
    courses: (state): Course[] => state.courses,
    exercises: (state): Exercise[] => state.exercises,
    tags: (state): Tag[] => state.tags,
    selectedExercises: (state): Exercise[] => state.selectedExercises,
  },
  mutations: {
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
