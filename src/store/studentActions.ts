/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';
import {
  Course,
  Event,
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
  partialUpdateEventSubmissionSlot,
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
  partialUpdateEventSubmissionSlot: async (
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
    const response = await partialUpdateEventSubmissionSlot(
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
};
