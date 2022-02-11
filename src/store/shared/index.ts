/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Course, User } from '@/models';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';

export const shared = {
  state: () => ({
    user: {} as User,
    courses: [] as Course[],
    token: '',
    refreshToken: '',
    loading: false,
    saving: false,
    savingError: false,
    showSuccessFeedback: false,
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
