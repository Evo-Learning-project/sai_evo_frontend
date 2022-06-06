<template>
  <!-- <div> -->
  <div
    v-if="loading"
    style="z-index: 999"
    class="fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
  >
    <Spinner :size="'xl'" :variant="'dark'" :fast="true"></Spinner>
  </div>
  <transition name="fade">
    <Notification v-if="showSuccessFeedback"></Notification>
  </transition>
  <transition name="fade">
    <!-- unfortunately doesn't work -->
    <Notification
      :icon="'cloud_off'"
      :text="$t('misc.confirm_exiting_unsaved_changes')"
      v-if="showUnsavedChangesNotification"
    ></Notification>
  </transition>
  <router-view class="" />
  <footer
    class="flex items-center w-full h-12 px-6 py-3 mt-auto text-sm text-white  bg-dark"
  >
    <p>
      Crafted with ❤️
      <!-- <img
        alt="love"
        class="inline-block mb-0.5"
        style="width: 0.95rem; margin-left: 1px; margin-right: 1px"
        src="./assets/heart.png"
      /> -->
      by
      <a
        target="_blank"
        class="font-semibold text-indigo-400 hover:underline"
        href="http://bsamu.it"
        >Samuele Bonini</a
      >
    </p>
    <!-- <p class="ml-auto cursor-pointer" @click="showReportForm = true">
      <i class="text-red-500 opacity-70 mr-0.5 fas fa-exclamation-triangle"></i>
      <span class="hidden ml-1 animated-underline md:inline"
        >Segnala malfunzionamento</span
      >
    </p> -->
  </footer>
  <!-- </div> -->
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Spinner from "./components/ui/Spinner.vue";
import Notification from "./components/ui/Notification.vue";
import { getTranslatedString as _ } from "./i18n";

import { createNamespacedHelpers } from "vuex";
import { debounce } from "lodash";
import { Course, CoursePrivilege } from "./models";
//import { typesetTex } from "./utils";
const { mapState, mapGetters } = createNamespacedHelpers("shared");

export default defineComponent({
  beforeCreate(): void {
    this.$store.commit("shared/initStore");
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.beforeWindowUnload);
  },
  components: {
    Spinner,
    Notification,
  },
  async created() {
    if (this.$store.getters["shared/isAuthenticated"]) {
      try {
        await this.$store.dispatch("shared/getCourses");
        if (!this.hasAnyPrivileges && this.isTeacherRoute) {
          this.$router.push("/student/courses");
        }
      } catch (e) {
        console.log("Caught", e);
      }
    }
    window.addEventListener("beforeunload", this.beforeWindowUnload);

    this.typesetTex = debounce(this.typesetTex, 100);
  },
  watch: {
    dirtyTex(newVal) {
      if (newVal) {
        this.typesetTex();
        this.$store.state.shared.dirtyTex = false;
      }
    },
  },
  data() {
    return {
      showUnsavedChangesNotification: false,
    };
  },
  methods: {
    typesetTex() {
      (window as any).MathJax?.typeset?.();
    },
    beforeWindowUnload(e: { preventDefault: () => void; returnValue: string }) {
      if (
        this.unsavedChanges &&
        !window.confirm(_("misc.confirm_exiting_unsaved_changes"))
      ) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = "";
      }
    },
  },
  computed: {
    ...mapState(["loading", "showSuccessFeedback", "dirtyTex", "courses"]),
    ...mapGetters(["unsavedChanges"]),
    hasAnyPrivileges(): boolean {
      if (this.$router.currentRoute.value.params.courseId) {
        // check user has privileges for course currrently visited
        const myPrivileges: CoursePrivilege[] =
          this.courses.find(
            (c: Course) =>
              c.id == (this.$router.currentRoute.value.params.courseId ?? "")
          )?.privileges ?? [];

        return myPrivileges.length > 0;
      }
      // check user has any privileges at all if not visiting a course (i.e. in course list)
      return (this.courses as Course[])
        .map((c) => c.privileges ?? [])
        .some((p) => p.length > 0);
    },
    isTeacherRoute(): boolean {
      return !!this.$route.meta.teacherRoute;
    },
  },
});
</script>
