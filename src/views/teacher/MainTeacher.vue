<template>
  <div class="flex flex-no-wrap flex-grow">
    <!-- bg-gray-500 -->
    <!-- Sidebar starts -->
    <!-- FIXME review shadow here and in the other two spots in this file -->
    <div
      style="box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3)"
      class="flex-col justify-between ease-in-out w-96 md:w-60 bg-primary"
      id="mobile-nav"
    >
      <div
        id="openSideBar"
        class="absolute z-40 flex items-center justify-center hidden w-10 h-10 mt-16 -mr-10 rounded-tr rounded-br shadow cursor-pointer  left-28 top-4 text-lightText bg-primary md:hidden"
        @click="sidebarHandler(true)"
      >
        <span class="material-icons-outlined"> cancel </span>
      </div>
      <div
        id="closeSideBar"
        class="absolute right-0 flex items-center justify-center hidden w-10 h-10 mt-16 -mr-10 rounded-tr rounded-br shadow cursor-pointer  text-lightText bg-primary"
        @click="sidebarHandler(false)"
      >
        <span class="material-icons-outlined"> cancel </span>
      </div>
      <div class="fixed h-full px-2" style="width: inherit">
        <div class="flex items-center w-full px-8 mt-4">
          <img class="w-36" src="../../../public/unipi-logo.svg" />
        </div>
        <div
          v-if="$store.getters['shared/isAuthenticated']"
          class="flex items-center justify-center w-full mx-auto mt-8 mb-4 space-x-1 text-sm  text-light"
        >
          <p>{{ $store.getters["shared/email"] }}</p>
          <Btn @click="logOut()" :variant="'icon'" :outline="true"
            ><span class="text-lg text-lightText material-icons-outlined">
              logout
            </span></Btn
          >
        </div>
        <ul class="flex flex-col w-full h-full mt-6">
          <router-link
            class="relative my-1 overflow-hidden rounded-md"
            @mousedown="onRouteMouseDown"
            v-for="(option, index) in allowedSidebarOptions"
            :key="'sidebar-' + option.label"
            :to="{ name: option.routeName }"
            :class="{
              'mt-auto mb-44': false && index == sidebarOptions.length - 1,
            }"
          >
            <li
              :id="'sidebar-option-' + index"
              class="
                flex
                items-center
                justify-between
                w-max
                md:w-full
                px-3
                md:px-2
                py-2.5
                rounded-md
                cursor-pointer
                hover:transition-colors
                text-lightText
                hover:bg-primary-dark hover:duration-100
              "
              :class="{
                'bg-primary-dark pointer-events-none': isRouteActive(option),
              }"
            >
              <div class="flex items-center space-x-2.5">
                <span
                  class="text-2xl text-gray-200  material-icons-outlined opacity-70"
                >
                  {{ option.icon }}
                </span>
                <span class="hidden ml-4 md:inline">{{ option.label }}</span>
              </div>
            </li>
          </router-link>
        </ul>
      </div>
      <!-- <div class="px-8 bg-primary">
        <div class="flex items-center px-8 mt-48 mb-4">
          <div class="w-10 h-10 mr-3 bg-cover rounded-md">
            <img
              src="https://tuk-cdn.s3.amazonaws.com/assets/components/avatars/a_5.png"
              alt=""
              class="w-full h-full overflow-hidden rounded-full shadow"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-200">Steve Doe</p>
            <p class="text-xs text-gray-200">View Profile</p>
          </div>
        </div>
        <ul class="flex items-center justify-between w-full">
          <li class="pt-5 pb-3 cursor-pointer text-lightText">
            
          </li>
          <li class="pt-5 pb-3 cursor-pointer text-lightText">
          </li>
          </li>
          <li class="pt-5 pb-3 cursor-pointer text-lightText">
          </li>
        </ul>
      </div>-->
    </div>
    <!--Mobile responsive sidebar-->
    <!-- Sidebar ends -->
    <div class="flex flex-col w-10/12 px-4 py-6 mx-auto md:w-4/5">
      <h1 class="">
        {{ routeTitle }}
      </h1>
      <ErrorView v-if="!!$store.state.shared.pageWideErrorData"></ErrorView>
      <router-view v-else class="flex-grow"></router-view>
      <transition name="quick-bounce"
        ><SnackBar
          class="-ml-5"
          v-if="!!$store.state.shared.errorNotificationData"
          :icon="$store.state.shared.errorNotificationData.icon"
          :message="$store.state.shared.errorNotificationData.title"
        ></SnackBar
      ></transition>
    </div>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, coursePrivilegeMixin, eventIdMixin } from "@/mixins";
import { Course, Event } from "@/models";
import {
  ROUTE_TITLE_COURSE_NAME_TOKEN,
  ROUTE_TITLE_EVENT_NAME_TOKEN,
} from "@/navigation/const";
import { SidebarOption } from "@/navigation/sidebar";
import { logOut, rippleEffect } from "@/utils";
import { defineComponent } from "@vue/runtime-core";
import ErrorView from "../shared/ErrorView.vue";
import SnackBar from "@/components/ui/SnackBar.vue";
import Btn from "@/components/ui/Btn.vue";
import { redirectToMainView } from "@/utils";

export default defineComponent({
  name: "MainTeacher",
  mounted() {
    // TODO this is called before courses have been retrieved, you should probably do this check in App.vue if the route has a meta flag
    this.hasAnyPrivileges();
    setTimeout(() => {
      if (!this.hasAnyPrivileges() && this.courseId) {
        this.redirectToMainView();
      }
    }, 1500);
  },
  data() {
    return {
      moved: true,
    };
  },
  mixins: [courseIdMixin, eventIdMixin, coursePrivilegeMixin],
  methods: {
    redirectToMainView,
    logOut,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRouteMouseDown(event: any) {
      rippleEffect(event, "ripple-light");
    },
    isRouteActive(option: SidebarOption) {
      return (
        option.routeName === this.$route.name ||
        option.children?.includes(this.$route.name as string)
      );
    },
  },
  computed: {
    allowedSidebarOptions(): SidebarOption[] {
      return (
        (this.$route.meta?.sidebarOptions ?? []) as SidebarOption[]
      ).filter((o) => this.hasPrivileges(o.requiredPrivileges));
    },
    routeTitle(): string {
      return (this.$route.meta.routeTitle as string)
        ?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse?.name ?? "")
        ?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent?.name ?? "");
    },
    currentEvent(): Event {
      return this.$store.getters["teacher/event"](this.eventId);
    },
  },
  components: { ErrorView, SnackBar, Btn },
});
</script>
