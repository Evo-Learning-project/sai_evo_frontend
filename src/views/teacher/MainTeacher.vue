<template>
  <div class="relative flex flex-col flex-no-wrap flex-grow md:flex-row">
    <transition name="fade"
      ><div
        @click="showMobileSidebar = false"
        class="absolute z-50 w-full h-full opacity-50 bg-dark"
        v-show="showMobileSidebar"
      ></div
    ></transition>
    <!-- bg-gray-500 -->
    <nav
      style="z-index: 999"
      class="sticky top-0 flex items-center w-full px-3 py-2  shadow-elevation-2 md:hidden bg-primary"
    >
      <img class="w-32" src="../../../public/unipi-logo.svg" />
      <Btn
        :variant="'icon'"
        :outline="true"
        class="ml-auto"
        @click="showMobileSidebar = true"
        ><span class="material-icons-outlined text-lightText"> menu </span></Btn
      >
    </nav>
    <!-- Sidebar starts -->
    <!-- FIXME review shadow here and in the other two spots in this file -->
    <div
      style="box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3); z-index: 50"
      class="flex-col h-full bg-primary"
      :class="{
        'absolute top-0': !fixSideBar,
        'w-18': !hoveringSidebar && !fixSideBar,
        'w-2/12 hovering-sidebar': hoveringSidebar || fixSideBar,
        'transition-width duration-200 ease-in-out': !unfixingSideBar,
      }"
      id="desktop-nav"
    >
      <div class="fixed h-full pr-2" style="width: inherit">
        <div class="flex items-center w-full mt-4 ml-1 no-hover-sidebar">
          <Btn
            :tooltip="
              fixSideBar ? $t('misc.unfix_sidebar') : $t('misc.fix_sidebar')
            "
            :variant="'icon'"
            :outline="true"
            @click="toggleFixSideBar()"
            class="mx-auto no-hover-sidebar"
          >
            <span class="text-gray-200 material-icons-outlined">{{
              fixSideBar ? "menu_open" : "menu"
            }}</span>
          </Btn>
        </div>
        <div
          style="border-color: rgba(0, 25, 112, 0.3)"
          class="ml-2 border-b"
          :class="[fixSideBar || hoveringSidebar ? 'w-11/12' : 'w-10/12']"
        >
          &nbsp;
        </div>
        <div @mouseover="onSideBarHover($event)" @mouseleave="onSideBarLeave()">
          <transition name="fade-quick">
            <div
              :class="[
                hoveringSidebar || fixSideBar ? 'opacity-100' : 'opacity-0',
              ]"
              class="flex items-center hidden w-full pl-10 pr-8 mt-4 overflow-visible whitespace-pre "
            >
              <img class="w-36" src="../../../public/unipi-logo.svg" /></div
          ></transition>

          <transition name="fade-quick">
            <div
              v-if="false && $store.getters['shared/isAuthenticated']"
              :class="[
                hoveringSidebar || fixSideBar ? 'opacity-100' : 'opacity-0',
              ]"
              class="flex items-center justify-center w-full pl-2 mx-auto mt-8 mb-4 space-x-1 text-sm whitespace-pre  text-light"
            >
              <p>{{ $store.getters["shared/email"] }}</p>
              <Btn @click="logOut()" :variant="'icon'" :outline="true"
                ><span class="text-lg text-lightText material-icons-outlined">
                  logout
                </span></Btn
              >
            </div></transition
          >
          <ul class="flex flex-col w-full h-full mt-6">
            <router-link
              v-wave="{
                color: '#a255ff',
              }"
              class="relative my-1 overflow-hidden rounded-r-full"
              @mousedown="onRouteMouseDown"
              v-for="(option, index) in allowedSidebarOptions"
              :key="'sidebar-' + option.label"
              :to="{ name: option.routeName }"
              :class="{
                'mt-auto mb-44': false && index == sidebarOptions.length - 1,
                'pl-1.25px': true || (!hoveringSidebar && !fixSideBar),
              }"
            >
              <li
                :id="'sidebar-option-' + index"
                style="padding-top: 11px; padding-bottom: 11px"
                class="flex items-center justify-between px-4 cursor-pointer  sidebar-link-container hover:transition-colors text-lightText hover:bg-primary-dark hover:duration-100"
                :class="{
                  'md:w-full': true || !fixSideBar,
                  'md:w-11/12': false && fixSideBar,
                  'rounded-r-full pl-5 -ml-1.25px':
                    hoveringSidebar || fixSideBar,
                  'rounded-full ml-1': !hoveringSidebar && !fixSideBar,
                  'bg-primary-dark pointer-events-none': isRouteActive(option),
                }"
              >
                <div class="flex items-center space-x-2.5">
                  <span
                    class="text-2xl text-gray-200  material-icons-outlined opacity-70"
                  >
                    {{ option.icon }}
                  </span>
                  <transition name="fade-quick">
                    <span
                      v-show="hoveringSidebar || fixSideBar"
                      class="ml-4 whitespace-pre sidebar-link-label"
                      :class="{ 'delay-0': hoveringSidebar }"
                      >{{ option.label }}</span
                    ></transition
                  >
                </div>
              </li>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
    <!--Mobile responsive sidebar-->
    <div
      style="z-index: 99999"
      class="fixed flex-col justify-between block w-9/12 h-full overflow-y-auto transition-transform duration-300 ease-in-out transform  md:hidden bg-primary"
      id="mobile-nav"
      :class="{
        '-translate-x-full': !showMobileSidebar,
        'translate-x-0 shadow-all-around': showMobileSidebar,
      }"
    >
      <div class="w-full h-full px-2">
        <div class="flex items-center w-full mt-4">
          <img class="mx-auto w-36" src="../../../public/unipi-logo.svg" />
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
                w-full
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
                <span class="ml-4 md:inline">{{ option.label }}</span>
              </div>
            </li>
          </router-link>
        </ul>
      </div>
    </div>
    <!-- Sidebar ends -->
    <div
      class="flex flex-col py-6"
      :style="
        !fixSideBar
          ? 'padding-left: ' +
            (routerViewPaddingLeft + 30) +
            'px; padding-right: 30px'
          : ''
      "
      :class="{
        'px-10': fixSideBar,
        'w-full mx-auto': !fixSideBar,
        'w-10/12 mx-auto': fixSideBar,
      }"
    >
      <h1 class="">
        {{ routeTitle }}
      </h1>
      <ErrorView v-if="!!$store.state.shared.pageWideErrorData"></ErrorView>
      <router-view v-else class="flex-grow"></router-view>
      <transition name="quick-bounce"
        ><SnackBar
          class="w-full px-4"
          v-if="$store.state.shared.errorNotificationData"
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

const LOCAL_STORAGE_FIX_SIDEBAR_KEY = "sai_evo_fix_sidebar";

export default defineComponent({
  name: "MainTeacher",
  watch: {
    $route() {
      this.showMobileSidebar = false;
    },
  },
  mounted() {
    // this is called before courses have been retrieved, you should probably do this check in App.vue if the route has a meta flag
    setTimeout(() => {
      if (!this.hasAnyPrivileges() && this.courseId) {
        this.redirectToMainView();
      }
    }, 1500);
    setTimeout(() => {
      this.routerViewPaddingLeft =
        document.getElementById("desktop-nav")?.clientWidth ?? 0;
      const fixSideBar = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_FIX_SIDEBAR_KEY) ?? "false"
      );
      this.unfixingSideBar = true;
      this.fixSideBar = fixSideBar;
      this.$nextTick(() => (this.unfixingSideBar = false));
    }, 1);
  },
  data() {
    return {
      showMobileSidebar: false,
      hoveringSidebar: false,
      sideBarHoverHandle: null as null | number,
      fixSideBar: false,
      unfixingSideBar: false,
      routerViewPaddingLeft: 0,
    };
  },
  mixins: [courseIdMixin, eventIdMixin, coursePrivilegeMixin],
  methods: {
    redirectToMainView,
    logOut,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRouteMouseDown(event: any) {
      //rippleEffect(event, "ripple-light");
    },
    isRouteActive(option: SidebarOption) {
      return (
        option.routeName === this.$route.name ||
        option.children?.includes(this.$route.name as string)
      );
    },
    onSideBarHover(event: MouseEvent) {
      console.log((event.target as any).className.split(" "));
      if (
        this.sideBarHoverHandle == null &&
        !(event.target as any).className.split(" ").includes("no-hover-sidebar")
      ) {
        this.sideBarHoverHandle = setTimeout(
          () => (this.hoveringSidebar = true),
          300
        );
      }
    },
    onSideBarLeave() {
      if (this.sideBarHoverHandle != null) {
        clearTimeout(this.sideBarHoverHandle);
        this.sideBarHoverHandle = null;
      }
      this.hoveringSidebar = false;
    },
    toggleFixSideBar() {
      if (this.fixSideBar) {
        this.unfixingSideBar = true;
        this.fixSideBar = false;
        this.$nextTick(() => (this.unfixingSideBar = false));
      } else {
        this.fixSideBar = true;
      }
      localStorage.setItem(
        LOCAL_STORAGE_FIX_SIDEBAR_KEY,
        String(this.fixSideBar)
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

<style>
.sidebar-link-container {
  transition: border-radius 0.2s;
}
</style>
