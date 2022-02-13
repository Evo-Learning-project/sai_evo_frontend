/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventParticipation } from '@/models';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';

export const studentStore = {
  namespaced: true,
  state: () => ({
    currentEventParticipation: null as EventParticipation | null,
    eventParticipations: [] as EventParticipation[],
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
