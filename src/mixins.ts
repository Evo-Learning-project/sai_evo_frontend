/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Course, CoursePrivilege } from './models';
import router from './router';
import store from './store/index';
export const courseIdMixin = {
  computed: {
    courseId(): string {
      return router.currentRoute.value.params.courseId as string;
    },
  },
};

export const eventIdMixin = {
  computed: {
    eventId(): string {
      return router.currentRoute.value.params.examId as string;
    },
  },
};

export const loadingMixin = {
  methods: {
    async withLoading(callback: () => any) {
      // TODO type the state
      (store.state as any).shared.loading = true;
      await callback();
      (store.state as any).shared.loading = false;
    },
  },
};

export const savingMixin = {
  watch: {
    saving(newVal: boolean) {
      (store.state as any).shared.saving = newVal;
    },
    savingError(newVal: boolean) {
      (store.state as any).savingError = newVal;
    },
  },
};

export const coursePrivilegeMixin = {
  methods: {
    hasPrivileges(requiredPrivilegesList: CoursePrivilege[]) {
      /**
       * Given a list of required privileges, returns true iff the current
       * user has such privileges for the current course
       */
      const myPrivileges =
        (store.state as any).shared.courses.find(
          (c: Course) =>
            c.id ==
            (router.currentRoute.value.params.courseId as string)
        )?.privileges ?? [];

      return requiredPrivilegesList.every((p) =>
        myPrivileges.includes(p)
      );
    },
  },
};
