/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';
import {
  Course,
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventTemplate,
  EventTemplateRule,
  EventType,
  Exercise,
  ExerciseChoice,
  Tag,
  User,
} from '@/models';
import { getCourses, getTags } from '@/api/courses';

import { Commit } from 'vuex';

import {
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
    commit('setEventParticipation', participation);
  },
  partialUpdateEventParticipation: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      changes,
    }: {
      courseId: string;
      eventId: string;
      changes: Record<keyof EventParticipation, unknown>;
    }
  ) => {
    const response = await partialUpdateEventParticipation(
      courseId,
      state.eventParticipation?.event.id,
      state.eventParticipation?.id,
      changes
    );
    commit('setEventParticipation', response);
  },
  partialUpdateEventParticipationSlot: async (
    { commit, state }: { commit: Commit; state: any },
    {
      courseId,
      eventId,
      //participationId,
      slotId,
      changes,
      // true if action mutates the store state to reflect changes,
      //false if action only dispatches api call
      mutate = true,
    }: {
      courseId: string;
      eventId: string;
      //participationId: string;
      slotId: string;
      changes: Record<keyof EventParticipationSlot, unknown>;
      mutate: boolean;
    }
  ) => {
    const response = await partialUpdateEventParticipationSlot(
      courseId,
      eventId,
      state.eventParticipation?.id,
      slotId,
      changes
    );
    if (mutate) {
      commit('setEventParticipationSlot', {
        slotId,
        slot: response,
      });
    }
  },
  moveEventParticipationCurrentSlotCursorForward: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId }: { courseId: string }
  ) => {
    const slot = await moveEventParticipationCurrentSlotCursor(
      courseId,
      state.eventParticipation.event.id,
      state.eventParticipation.id,
      'forward'
    );
    console.log('slot', slot);
    commit('setEventParticipationSlots', [slot]);
  },
  moveEventParticipationCurrentSlotCursorBack: async (
    { commit, state }: { commit: Commit; state: any },
    { courseId }: { courseId: string }
  ) => {
    const slot = await moveEventParticipationCurrentSlotCursor(
      courseId,
      state.eventParticipation.event.id,
      state.eventParticipation.id,
      'back'
    );
    commit('setEventParticipationSlots', [slot]);
  },
};
