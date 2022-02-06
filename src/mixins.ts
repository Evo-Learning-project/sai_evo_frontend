/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ComponentOptionsMixin } from 'vue';
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
      store.state.loading = true;
      await callback();
      store.state.loading = false;
    },
    // async withFirstLoading(callback: () => any) {
    //   store.state.firstLoading = true;
    //   await callback();
    //   store.state.firstLoading = false;
    // }
  },
};
