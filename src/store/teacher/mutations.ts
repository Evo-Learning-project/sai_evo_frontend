/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  EventParticipationSlot,
  EventParticipation,
  Event,
} from '@/models';

export const mutations = {
  // update an event in memory with the given payload
  setEvent: (
    state: any,
    { eventId, event }: { eventId: string; event: Event }
  ) =>
    Object.assign(
      state.events.find((e: Event) => e.id == eventId),
      event
    ),
  // update the slot with id `slotId` using the given payload
  setEventParticipationSlot: (
    state: any,
    {
      participationId,
      slotId,
      slot,
    }: {
      participationId: string;
      slotId: string;
      slot: EventParticipationSlot;
    }
  ) => {
    const target =
      state.eventParticipations
        .find((p: EventParticipation) => p.id == participationId)
        .slots?.find((s: EventParticipationSlot) => s.id == slotId) ??
      state.eventParticipation?.slots?.find(
        (s: EventParticipationSlot) => s.id == slotId
      );
    Object.assign(target, slot);
  },
  // updates the in-memory participation that has the same id as the
  // one in the payload with the given payload
  setEventParticipation: (
    state: any,
    participation: EventParticipation
  ) => {
    const target = state.eventParticipations.find(
      (p: EventParticipation) => p.id == participation.id
    );
    Object.assign(target, participation);
  },
  // sets the array of participations to the event currently being watched
  setEventParticipations: (
    state: any,
    participations: EventParticipation[]
  ) => (state.eventParticipations = participations),
};
