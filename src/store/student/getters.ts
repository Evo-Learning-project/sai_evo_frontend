/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventParticipation, EventType } from '@/models';

export const getters = {
  examParticipations: (state: any) =>
    state.eventParticipations.filter(
      (p: EventParticipation) => p.event.event_type === EventType.EXAM
    ),
  practiceParticipations: (state: any) =>
    state.eventParticipations.filter(
      (p: EventParticipation) =>
        p.event.event_type === EventType.SELF_SERVICE_PRACTICE
    ),
};
