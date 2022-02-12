/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Course, User } from '@/models';
import axios from 'axios';

export const mutations = {
  initStore: (state: any) => {
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
  setLoading: (state: any, val: boolean) => (state.loading = val),
  showSuccessFeedback: (state: any) => {
    state.showSuccessFeedback = true;
    setTimeout(() => (state.showSuccessFeedback = false), 2000);
  },
  //set personal user account
  setUser: (state: any, { user }: { user: User }) => {
    Object.assign(state.user, user);
    // TODO use plugin
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
  setCourses: (state: any, courses: Course[]) =>
    (state.courses = courses),
};
