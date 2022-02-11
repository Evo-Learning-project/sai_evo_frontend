/* eslint-disable @typescript-eslint/no-explicit-any */
export const getters = {
  email: (state: any): string => state.user?.email,
  unsavedChanges: (state: any): boolean =>
    state.saving || state.savingError,
};
