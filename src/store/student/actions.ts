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
  getEvent,
  moveEventParticipationCurrentSlotCursor,
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
};
