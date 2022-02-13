/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Course, getBlankCourse, User } from '@/models';

export const getters = {
  email: (state: any): string => state.user?.email,
  course:
    (state: any) =>
    (courseId: string): Course =>
      state.courses.find((c: Course) => c.id == courseId) ??
      getBlankCourse(),
  user:
    (state: any) =>
    (userId: string): User =>
      state.users.find((u: User) => u.id == userId) ?? {},
  unsavedChanges: (state: any): boolean =>
    state.saving || state.savingError,
};
