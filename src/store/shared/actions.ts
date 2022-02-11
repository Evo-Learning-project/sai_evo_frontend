/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { getCourses } from '@/api/courses';
import {
  partialUpdateEventParticipationSlot,
  bulkPartialUpdateEventParticipation,
  partialUpdateEventParticipation,
} from '@/api/events';
import { EventParticipationSlot, EventParticipation } from '@/models';
import axios from 'axios';
import { Commit } from 'vuex';

export const actions = {
  // converts a token issued by Google to a token usable to authenticate requests to the backend
  convertToken: ({ commit }: { commit: Commit }, token: string) => {
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
          commit('setToken', response.data.access_token);
          commit('setRefreshToken', response.data.refresh_token);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getUserData: ({ commit }: { commit: Commit }) => {
    return new Promise((resolve, reject) => {
      axios
        .get('/users/me/')
        .then((response) => {
          commit('setUser', { user: response.data });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  getCourses: async ({ commit }: { commit: Commit }) => {
    const courses = await getCourses();
    commit('setCourses', courses);
  },
  partialUpdateEventParticipationSlot: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      eventId,
      participationId,
      slotId,
      changes,
      // true if action mutates the store state to reflect changes,
      //false if action only dispatches api call
      mutate = true,
    }: {
      courseId: string;
      eventId: string;
      participationId: string;
      slotId: string;
      changes: Record<keyof EventParticipationSlot, unknown>;
      mutate: boolean;
    }
  ) => {
    const response = await partialUpdateEventParticipationSlot(
      courseId,
      eventId,
      participationId, //state.eventParticipation?.id,
      slotId,
      changes
    );
    if (mutate) {
      commit('setEventParticipationSlot', {
        slotId,
        slot: response,
        participationId,
      });
    }
  },
  partialUpdateEventParticipation: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      changes,
      eventId = undefined,
      participationIds = undefined,
    }: {
      courseId: string;
      eventId?: string;
      changes: Record<keyof EventParticipation, unknown>;
      participationIds?: string[];
    }
  ) => {
    let response;
    if (participationIds && eventId) {
      // teacher usage with multiple ids
      response = await bulkPartialUpdateEventParticipation(
        courseId,
        eventId,
        participationIds,
        changes
      );
      response.forEach((p) => commit('setEventParticipation', p));
    } else {
      // student usage, implicit id as the event participation is in the store
      response = await partialUpdateEventParticipation(
        courseId,
        state.eventParticipation?.event.id,
        state.eventParticipation?.id,
        changes
      );
      commit('setEventParticipation', response);
    }
  },
};
