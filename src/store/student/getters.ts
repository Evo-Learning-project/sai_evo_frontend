/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventType } from '@/models';
import { StudentState } from '../types';

export const getters = {
  examParticipations: (state: StudentState) =>
    state.eventParticipations.filter(
      (p) => p.event.event_type === EventType.EXAM
    ),
  practiceParticipations: (state: StudentState) =>
    state.eventParticipations.filter(
      (p) => p.event.event_type === EventType.SELF_SERVICE_PRACTICE
    ),
};
