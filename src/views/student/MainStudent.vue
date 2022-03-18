<template>
  <div class="flex flex-col flex-grow">
    <nav class="relative z-50 md:px-12 bg-primary">
      <div class="px-4 mx-auto sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img class="w-32 -ml-1" src="../../../public/unipi-logo.svg" />
            </div>
            <div class="hidden md:block">
              <div class="flex items-baseline ml-10 space-x-4">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <!--
                <a
                  href="#"
                  class="px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md"
                  aria-current="page"
                  >Dashboard</a
                >

                <a
                  href="#"
                  class="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
                  >Team</a
                >
                -->
              </div>
            </div>
          </div>
          <div class="hidden md:block">
            <div
              v-if="$store.getters['shared/isAuthenticated']"
              class="flex items-center ml-4 space-x-2 md:ml-6"
            >
              <p class="text-lightText">{{ $store.getters["shared/email"] }}</p>
              <Btn @click="logOut()" :variant="'icon'" :outline="true"
                ><span class="text-lg text-lightText material-icons-outlined">
                  logout
                </span></Btn
              >
              <!-- <button
                type="button"
                class="p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span class="sr-only">View notifications</span>
                <svg
                  class="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button> -->

              <!-- Profile dropdown -->
              <!-- <div class="relative ml-3">
                <div>
                  <button
                    type="button"
                    class="flex items-center max-w-xs text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    id="user-menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span class="sr-only">Open user menu</span>
                    <img
                      class="w-8 h-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                </div> -->

              <!--
                Dropdown menu, show/hide based on menu state.

                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              -->
              <!-- <div
                  class="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabindex="-1"
                >
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-0"
                    >Your Profile</a
                  >

                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-1"
                    >Settings</a
                  >

                  <a
                    href="#"
                    class="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-2"
                    >Sign out</a
                  >
                </div> -->
              <!-- </div> -->
            </div>
          </div>
          <div class="flex hidden -mr-2">
            <!-- Mobile menu button -->
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-md  hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="sr-only">Open main menu</span>
              <!--
              Heroicon name: outline/menu

              Menu open: "hidden", Menu closed: "block"
            -->
              <svg
                class="block w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <!--
              Heroicon name: outline/x

              Menu open: "block", Menu closed: "hidden"
            -->
              <svg
                class="hidden w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="hidden" id="mobile-menu">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
          <a
            href="#"
            class="block px-3 py-2 text-base font-medium text-white bg-gray-900 rounded-md "
            aria-current="page"
            >Dashboard</a
          >

          <a
            href="#"
            class="block px-3 py-2 text-base font-medium text-gray-300 rounded-md  hover:bg-gray-700 hover:text-white"
            >Team</a
          >

          <a
            href="#"
            class="block px-3 py-2 text-base font-medium text-gray-300 rounded-md  hover:bg-gray-700 hover:text-white"
            >Projects</a
          >

          <a
            href="#"
            class="block px-3 py-2 text-base font-medium text-gray-300 rounded-md  hover:bg-gray-700 hover:text-white"
            >Calendar</a
          >

          <a
            href="#"
            class="block px-3 py-2 text-base font-medium text-gray-300 rounded-md  hover:bg-gray-700 hover:text-white"
            >Reports</a
          >
        </div>
        <div class="pt-4 pb-3 border-t border-gray-700">
          <div class="flex items-center px-5">
            <div class="flex-shrink-0">
              <img
                class="w-10 h-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium leading-none text-white">
                Tom Cook
              </div>
              <div class="text-sm font-medium leading-none text-gray-400">
                tom@example.com
              </div>
            </div>
            <button
              type="button"
              class="flex-shrink-0 p-1 ml-auto text-gray-400 bg-gray-800 rounded-full  hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span class="sr-only">View notifications</span>
              <!-- Heroicon name: outline/bell -->
              <svg
                class="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
          <!-- <div class="px-2 mt-3 space-y-1">
            <a
              href="#"
              class="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700"
              >Your Profile</a
            >

            <a
              href="#"
              class="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700"
              >Settings</a
            >

            <a
              href="#"
              class="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:text-white hover:bg-gray-700"
              >Sign out</a
            >
          </div> -->
        </div>
      </div>
    </nav>
    <header
      class="sticky top-0 z-50 bg-indigo-100 shadow-md  md:px-12 bg-opacity-70 backdrop-blur-sm backdrop-filter"
    >
      <div class="flex items-center px-4 py-4 mx-auto sm:px-6 lg:px-8">
        <!-- <h1 class="text-3xl font-bold text-gray-900">
          Dashboard
        </h1> -->
        <div class="flex flex-col md:items-center md:space-x-6 md:flex-row">
          <h2 class="mb-0">
            {{ routeTitle }}
          </h2>
          <BreadCrumbs
            v-if="!$route.meta.hideBreadcrumbs"
            :route="$route"
            class="mt-1"
          ></BreadCrumbs>
        </div>
        <div id="main-student-header-right" class="ml-auto"></div>
      </div>
    </header>
    <main class="flex-grow px-2 bg-white md:px-12">
      <div class="h-full py-6 mx-auto sm:px-5 lg:px-8">
        <ErrorView v-if="!!$store.state.shared.pageWideErrorData"></ErrorView>
        <router-view v-else />
        <transition name="quick-bounce"
          ><SnackBar
            v-if="!!$store.state.shared.errorNotificationData"
            :icon="$store.state.shared.errorNotificationData.icon"
            :message="$store.state.shared.errorNotificationData.title"
          ></SnackBar
        ></transition>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin } from "@/mixins";
import {
  ROUTE_TITLE_COURSE_NAME_TOKEN,
  ROUTE_TITLE_EVENT_NAME_TOKEN,
} from "@/navigation/const";
import { SidebarOption } from "@/navigation/sidebar";
import { defineComponent } from "@vue/runtime-core";
import ErrorView from "../shared/ErrorView.vue";
import SnackBar from "@/components/ui/SnackBar.vue";
import BreadCrumbs from "@/components/ui/BreadCrumbs.vue";
import Btn from "@/components/ui/Btn.vue";
import { logOut } from "@/utils";

export default defineComponent({
  name: "MainStudent",
  data() {
    return {};
  },
  mixins: [courseIdMixin, eventIdMixin],
  methods: {
    replaceTitleTokens(str: string) {
      return str
        ?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse.name)
        ?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent);
    },
    logOut,
  },
  computed: {
    sidebarOptions(): SidebarOption[] {
      return (this.$route.meta?.sidebarOptions ?? []) as SidebarOption[];
    },
    routeTitle(): string {
      return this.replaceTitleTokens(this.$route.meta.routeTitle as string);
    },
  },
  components: { ErrorView, SnackBar, BreadCrumbs, Btn },
});
</script>
