import store from '@/store';
import { SharedState } from '@/store/types';

export const courseNameUnique = (name: string): boolean => {
  return (
    store.state as { shared: SharedState }
  ).shared.courses.every((c) => c.name !== name);
};
