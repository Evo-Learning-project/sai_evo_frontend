/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventParticipation } from '@/models';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';

export const shared = {
  state: () => ({
    eventParticipation: null as EventParticipation | null,
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
