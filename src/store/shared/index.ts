/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Course, Tag, User } from '@/models';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';

// import VuexPersistence from 'vuex-persist';

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage,
//   modules: ['shared'],
//   reducer: (state: any) => ({
//     user: state.user,
//     token: state.token,
//     refreshToken: state.refreshToken,
//   }),
// });

export const sharedStore = {
  namespaced: true,
  //plugins: [vuexLocal.plugin],
  state: () => ({
    user: {} as User,
    courses: [] as Course[],
    token: '',
    refreshToken: '',
    loading: false,
    saving: false,
    savingError: false,
    showSuccessFeedback: false,
    tags: [] as Tag[],
  }),
  mutations: {
    ...mutations,
  },
  actions: {
    ...actions,
  },
  getters: {
    ...getters,
  },
};
