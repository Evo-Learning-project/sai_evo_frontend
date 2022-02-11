/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Course,
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventTemplate,
  Exercise,
  Tag,
  User,
} from '@/models';
import axios from 'axios';

export const mutations = {
  initStore: (state: any) => {
    if (state.token) {
      console.log('restoring token');
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + state.token;
    }
  },

  // "dumb" mutations - could be abstracted
  setCourses: (state: any, courses: Course[]) =>
    (state.courses = courses),
  setExercises: (state: any, exercises: Exercise[]) =>
    (state.exercises = exercises),
  setCurrentExercisePage: (state: any, pageNumber: number) =>
    (state.currentExercisePage = pageNumber),
  setEvents: (state: any, events: Event[]) => (state.events = events),
  setTags: (state: any, tags: Tag[]) => (state.tags = tags),
  setLoading: (state: any, val: boolean) => (state.loading = val),

  showSuccessFeedback: (state: any) => {
    state.showSuccessFeedback = true;
    setTimeout(() => (state.showSuccessFeedback = false), 2000);
  },
  setUser: (
    state: any,
    { user, userId }: { user: User; userId?: string }
  ) => {
    if (!userId) {
      // used to set personal user account
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // teacher usage to replace a user when editing privileges
      Object.assign(
        state.users.find((u: User) => u.id == userId),
        user
      );
    }
  },

  setToken: (state: any, token: string) => {
    state.token = token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] =
      'Bearer ' + token;
  },
  // todo merge into above mutation
  resetToken: (state: any) => {
    state.token = '';
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
  },
  setRefreshToken: (state: any, token: string) => {
    state.refreshToken = token;
    localStorage.setItem('refreshToken', token);
  },

  setEvent: (
    state: any,
    { eventId, event }: { eventId: string; event: Event }
  ) =>
    Object.assign(
      state.events.find((e: Event) => e.id == eventId),
      event
    ),
  setEventParticipationSlots: (
    state: any,
    slots: EventParticipationSlot[]
  ) => {
    state.eventParticipation.slots = slots;
  },
  setEventParticipationSlot: (
    state: any,
    {
      slotId,
      slot,
      participationId,
    }: {
      slotId: string;
      slot: EventParticipationSlot;
      participationId: string;
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
  setEventParticipation: (
    state: any,
    participation: EventParticipation
  ) => {
    const target = state.eventParticipations.find(
      (p: EventParticipation) => p.id == participation.id
    );
    if (target) {
      // teacher usage
      Object.assign(target, participation);
    } else {
      // student usage
      state.eventParticipation = participation;
    }
  },
  setEventParticipations: (
    // TODO better naming for student vs teacher state
    state: any,
    participations: EventParticipation[]
  ) => (state.eventParticipations = participations),
};
