/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ErrorMessage } from '@/interfaces';
import { Course, Tag, User } from '@/models';
import axios from 'axios';
import { SharedState } from '../types';

export const mutations = {
  initStore: (state: SharedState) => {
    // TODO refactor
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const user = localStorage.getItem('user');

    if (token) {
      console.log('restoring token');
      state.token = token;
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + state.token;
    }
    if (refreshToken) {
      state.refreshToken = refreshToken;
    }
    if (user) {
      state.user = JSON.parse(user);
    }
  },
  setTags: (state: SharedState, tags: Tag[]) => (state.tags = tags),
  setLoading: (state: SharedState, val: boolean) =>
    (state.loading = val),
  showSuccessFeedback: (state: SharedState) => {
    state.showSuccessFeedback = true;
    setTimeout(() => (state.showSuccessFeedback = false), 2000);
  },
  //set personal user account
  setUser: (state: SharedState, { user }: { user: User }) => {
    Object.assign(state.user, user);
    // TODO use plugin
    localStorage.setItem('user', JSON.stringify(user));
  },
  setToken: (state: SharedState, token: string) => {
    state.token = token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] =
      'Bearer ' + token;
  },
  // todo merge into above mutation
  resetToken: (state: SharedState) => {
    state.token = '';
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
  },
  setRefreshToken: (state: SharedState, token: string) => {
    state.refreshToken = token;
    localStorage.setItem('refreshToken', token);
  },
  setCourse: (state: SharedState, course: Course) =>
    Object.assign(
      state.courses.find((c: Course) => c.id == course.id),
      course
    ),
  setCourses: (state: SharedState, courses: Course[]) =>
    (state.courses = courses),
  setErrorNotificationData: (
    state: SharedState,
    {
      data,
      hideTimeout = 4000,
    }: { data: ErrorMessage | null; hideTimeout: number }
  ) => {
    state.errorNotificationData = data;
    if (data) {
      setTimeout(
        () => (state.errorNotificationData = null),
        hideTimeout
      );
    }
  },
};
