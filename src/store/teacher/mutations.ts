/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  EventParticipationSlot,
  EventParticipation,
  Event,
  Exercise,
  Tag,
  User,
  ExerciseChoice,
  ExerciseTestCase,
} from '@/models';

import Vue from 'vue';

export const mutations = {
  setExercises: (state: any, exercises: Exercise[]) =>
    (state.exercises = exercises),
  setCurrentExercisePage: (state: any, pageNumber: number) =>
    (state.currentExercisePage = pageNumber),
  setEvents: (state: any, events: Event[]) => (state.events = events),
  setTags: (state: any, tags: Tag[]) => (state.tags = tags),

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
    const target = state.eventParticipations
      .find((p: EventParticipation) => p.id == participationId)
      .slots?.find((s: EventParticipationSlot) => s.id == slotId);
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
  // replace the user with same id as payload user with the given payload
  setUser: (state: any, { user }: { user: User }) => {
    Object.assign(
      state.users.find((u: User) => u.id === user.id),
      user
    );
  },

  // updates the list of elements related to an exercise (choices, sub-exercises, etc.)
  setExerciseChildren: (
    state: any,
    {
      exerciseId,
      children,
      payload,
    }: {
      exerciseId: string;
      children: 'choices' | 'sub_exercises' | 'testcases';
      payload: ExerciseChoice[] | Exercise[] | ExerciseTestCase[];
    }
  ) => {
    const target = (state.exercises as Exercise[]).find(
      (e) => e.id === exerciseId
    );
    if (target) {
      target[children] = payload as any;
    }
  },
};
