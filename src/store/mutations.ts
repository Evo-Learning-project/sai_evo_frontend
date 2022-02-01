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

  setUser: (state: any, user: User) => {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
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
    { slotId, slot }: { slotId: string; slot: EventParticipationSlot }
  ) => {
    Object.assign(
      state.eventParticipation?.slots?.find(
        (s: EventParticipationSlot) => s.id == slotId
      ),
      slot
    );
  },
  setEventParticipation: (
    state: any,
    participation: EventParticipation
  ) => (state.eventParticipation = participation),
  setEventParticipations: (
    // TODO better naming for student vs teacher state
    state: any,
    participations: EventParticipation[]
  ) => (state.eventParticipations = participations),
};
