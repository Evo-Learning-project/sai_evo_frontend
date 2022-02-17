/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Event,
  EventParticipation,
  EventParticipationSlot,
} from '@/models';

import { Commit } from 'vuex';

import {
  createEvent,
  getEvent,
  getEventParticipation,
  moveEventParticipationCurrentSlotCursor,
  partialUpdateEventParticipation,
  partialUpdateEventParticipationSlot,
  participateInEvent,
} from '@/api/events';

export const actions = {
  participateInEvent: async (
    { commit }: { commit: Commit },
    { courseId, eventId }: { courseId: string; eventId: string }
  ) => {
    const participation = await participateInEvent(courseId, eventId);
    commit('setCurrentEventParticipation', participation);
  },
  moveEventParticipationCurrentSlotCursorForward: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId }: { courseId: string }
  ) => {
    const slot = await moveEventParticipationCurrentSlotCursor(
      courseId,
      state.currentEventParticipation.event.id,
      state.currentEventParticipation.id,
      'forward'
    );
    commit('setEventParticipationSlots', [slot]);
  },
  moveEventParticipationCurrentSlotCursorBack: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId }: { courseId: string }
  ) => {
    const slot = await moveEventParticipationCurrentSlotCursor(
      courseId,
      state.currentEventParticipation.event.id,
      state.currentEventParticipation.id,
      'back'
    );
    commit('setEventParticipationSlots', [slot]);
  },
  getEvent: async (
    { commit }: { commit: Commit },
    { courseId, eventId }: { courseId: string; eventId: string }
  ) => {
    console.log('DATA: ', courseId, eventId);
    const event = await getEvent(courseId, eventId);
    commit('setEvent', event);
  },
  createEvent: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId, event }: { courseId: string; event: Event }
  ) => {
    const newEvent = await createEvent(courseId, event);
    //commit('setEvents', [newEvent, ...state.events]);
    return newEvent;
  },
  partialUpdateEventParticipation: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      changes,
    }: {
      courseId: string;
      changes: Record<keyof EventParticipation, unknown>;
    }
  ) => {
    const response = await partialUpdateEventParticipation(
      courseId,
      state.currentEventParticipation?.event.id,
      state.currentEventParticipation?.id,
      changes
    );
    commit('setCurrentEventParticipation', response);
  },
  getEventParticipation: async (
    { commit }: { commit: Commit },
    {
      courseId,
      eventId,
      participationId,
    }: { courseId: string; eventId: string; participationId: string }
  ) => {
    const participation = await getEventParticipation(
      courseId,
      eventId,
      participationId
    );
    commit('setCurrentEventParticipation', participation);
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
      commit('setCurrentEventParticipationSlot', response);
    }
  },
};
