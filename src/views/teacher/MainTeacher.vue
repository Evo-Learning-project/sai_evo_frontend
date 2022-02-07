<template>
  <div class="flex flex-no-wrap flex-grow">
    <!-- bg-gray-500 -->
    <!-- Sidebar starts -->
    <div
      style="box-shadow: 2px 0 5px rgba(0,0,0,0.3)"
      class="flex-col justify-between ease-in-out w-96 sm:relative md:w-60 bg-primary"
      id="mobile-nav"
    >
      <div
        id="openSideBar"
        class="absolute z-40 flex items-center justify-center w-10 h-10 mt-16 -mr-10 rounded-tr rounded-br shadow cursor-pointer left-28 top-4 text-lightText bg-primary md:hidden"
        @click="sidebarHandler(true)"
      >
        <span class="material-icons-outlined">
          cancel
        </span>
      </div>
      <div
        id="closeSideBar"
        class="absolute right-0 flex items-center justify-center hidden w-10 h-10 mt-16 -mr-10 rounded-tr rounded-br shadow cursor-pointer text-lightText bg-primary"
        @click="sidebarHandler(false)"
      >
        <span class="material-icons-outlined">
          cancel
        </span>
      </div>
      <div class="fixed h-full px-2" style="width: inherit">
        <div class="flex items-center w-full px-8 mt-4">
          <img class="w-36" src="../../../public/unipi-logo.svg" />
        </div>
        <div class="w-full mx-auto mt-4 mb-8 text-sm text-center text-light">
          {{ $store.getters.email }}
        </div>
        <ul class="flex flex-col w-full h-full mt-6">
          <router-link
            v-for="(option, index) in sidebarOptions"
            :key="'sidebar-' + option.label"
            :to="{ name: option.routeName }"
            :class="{
              'mt-auto': false && index == sidebarOptions.length - 1
            }"
          >
            <li
              class="flex items-center justify-between w-full px-2 py-2 mt-1.5 rounded-md cursor-pointer hover:transition-colors text-lightText hover:bg-primary-dark hover:duration-100"
              :class="{
                'bg-primary-dark pointer-events-none':
                  option.routeName == $route.name
              }"
            >
              <div class="flex items-center space-x-2">
                <span
                  class="text-xl text-gray-200 material-icons-outlined opacity-70"
                >
                  {{ option.icon }}
                </span>
                <span class="ml-2 text-base ">{{ option.label }}</span>
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
    <div class="flex flex-col w-11/12 px-4 py-6 mx-auto md:w-4/5">
      <h2 class="">
        {{ routeTitle }}
      </h2>
      <router-view class="flex-grow"></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { courseIdMixin, eventIdMixin } from '@/mixins'
import { Course, Event } from '@/models'
import {
  ROUTE_TITLE_COURSE_NAME_TOKEN,
  ROUTE_TITLE_EVENT_NAME_TOKEN
} from '@/navigation/const'
import { SidebarOption } from '@/navigation/sidebar'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'MainTeacher',
  data () {
    return {
      moved: true,
      test: null
    }
  },
  mixins: [courseIdMixin, eventIdMixin],
  methods: {
    // sidebarHandler () {
    //   var sideBar = document.getElementById('mobile-nav')
    //   sideBar.style.transform = 'translateX(-260px)'
    //   if (this.$data.moved) {
    //     sideBar.style.transform = 'translateX(0px)'
    //     this.$data.moved = false
    //   } else {
    //     sideBar.style.transform = 'translateX(-260px)'
    //     this.$data.moved = true
    //   }
    // }
  },
  computed: {
    sidebarOptions (): SidebarOption[] {
      return (this.$route.meta?.sidebarOptions ?? []) as SidebarOption[]
    },
    routeTitle (): string {
      return (this.$route.meta.routeTitle as string)
        ?.replace(ROUTE_TITLE_COURSE_NAME_TOKEN, this.currentCourse)
        ?.replace(ROUTE_TITLE_EVENT_NAME_TOKEN, this.currentEvent)
    },
    currentCourse (): string {
      return (
        this.$store.state.courses.find((c: Course) => c.id == this.courseId)
          ?.name ?? ''
      )
    },
    currentEvent (): string {
      return (
        this.$store.state.events.find((e: Event) => e.id == this.eventId)
          ?.name ??
        this.$store.state.eventParticipation?.event?.name ??
        ''
      )
    }
  }
})
</script>
