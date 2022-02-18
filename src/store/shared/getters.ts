/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Course, getBlankCourse, User } from '@/models';
import { SharedState } from '../types';

export const getters = {
  email: (state: SharedState): string => state.user?.email,
  course:
    (state: SharedState) =>
    (courseId: string): Course =>
      state.courses.find((c: Course) => c.id == courseId) ??
      getBlankCourse(),
  // user:
  //   (state: SharedState) =>
  //   (userId: string): User =>
  //     state.users.find((u: User) => u.id == userId) ?? {},
  unsavedChanges: (state: SharedState): boolean =>
    state.saving || state.savingError,
};
