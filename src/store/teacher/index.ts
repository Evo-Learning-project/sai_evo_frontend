/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventParticipation, Exercise, Tag, User } from '@/models';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';

export const teacherStore = {
  namespaced: true,
  state: () => ({
    exercises: [] as Exercise[],
    events: [] as Event[],
    eventParticipations: [] as EventParticipation[], // participations to current event
    currentExercisePage: 1, // for server-side pagination
    users: [] as User[], // for course permissions view
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
