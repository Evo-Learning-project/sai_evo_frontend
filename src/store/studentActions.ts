/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import axios from 'axios';
import {
  Course,
  Event,
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

import { participateInEvent } from '@/api/events';

export const actions = {
  participateInEvent: async (
    { commit }: { commit: Commit },
    { courseId, eventId }: { courseId: string; eventId: string }
  ) => {
    const participation = await participateInEvent(courseId, eventId);
    commit('setEventParticipation', participation);
  },
};
