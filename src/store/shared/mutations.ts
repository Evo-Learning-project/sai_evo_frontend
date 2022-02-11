/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { User } from '@/models';
import axios from 'axios';

export const mutations = {
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
};
