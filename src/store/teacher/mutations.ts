/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  EventParticipationSlot,
  EventParticipation,
  Exercise,
  User,
  Event,
  ExerciseChoice,
  ExerciseTestCase,
  EventTemplateRule,
  EventTemplate,
} from "@/models";
import { MutationPayload, TeacherState } from "../types";

export const mutations = {
  setExercises: (state: TeacherState, exercises: Exercise[]) =>
    (state.exercises = exercises),
  setCurrentExercisePage: (state: TeacherState, pageNumber: number) =>
    (state.currentExercisePage = pageNumber),
  setEvents: (state: TeacherState, events: Event[]) => (state.events = events),

  // update an event in memory with the given payload
  setEvent: (
    state: TeacherState,
    { eventId, payload }: MutationPayload<Event>
  ) =>
    Object.assign(
      state.events.find((e: Event) => e.id == eventId),
      payload
    ),
  // update the slot with id `slotId` using the given payload
  setEventParticipationSlot: (
    state: TeacherState,
    {
      participationId,
      slotId,
      payload,
    }: MutationPayload<EventParticipationSlot>
  ) => {
    const target = state.eventParticipations
      .find((p: EventParticipation) => p.id == participationId)
      ?.slots?.find((s: EventParticipationSlot) => s.id == slotId);
    if (target) {
      Object.assign(target, payload);
    }
  },
  // updates the in-memory participation that has the same id as the
  // one in the payload with the given payload
  setEventParticipation: (
    state: TeacherState,
    participation: EventParticipation
  ) => {
    const target = state.eventParticipations.find(
      (p: EventParticipation) => p.id == participation.id
    );
    Object.assign(target, participation);
  },
  // sets the array of participations to the event currently being watched
  setEventParticipations: (
    state: TeacherState,
    participations: EventParticipation[]
  ) => (state.eventParticipations = participations),
  // replace the user with same id as payload user with the given payload
  setUser: (state: TeacherState, { user }: { user: User }) => {
    Object.assign(
      state.users.find((u: User) => u.id === user.id),
      user
    );
  },

  setExercise: (state: TeacherState, payload: Exercise) => {
    Object.assign(
      state.exercises.find((e) => e.id == payload.id),
      payload
    );
  },
  setExerciseChoice: (
    state: TeacherState,
    { exerciseId, payload }: MutationPayload<ExerciseChoice>
  ) => {
    const target = state.exercises
      .find((e) => e.id == exerciseId)
      ?.choices?.find((c) => c.id == payload.id);

    console.log(target, exerciseId, payload);
    Object.assign(target, payload);
  },

  // updates the list of elements related to an exercise (choices, sub-exercises, etc.)
  setExerciseChildren: (
    state: TeacherState,
    {
      exerciseId,
      children,
      payload,
    }: MutationPayload<ExerciseChoice[] | Exercise[] | ExerciseTestCase[]>
  ) => {
    const target = (state.exercises as Exercise[]).find(
      (e) => e.id === exerciseId
    );
    if (target && children) {
      target[children] = payload as any;
    }
  },
  setEventTemplateRules: (
    state: TeacherState,
    { templateId, payload }: MutationPayload<EventTemplateRule[]>
  ) => {
    const target = state.events.find((e) => e.template?.id === templateId);
    if (target) {
      (target.template as EventTemplate).rules = payload;
    }
  },
};
