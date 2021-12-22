<template>
  <div class="flex flex-no-wrap min-h-screen bg-gray-50">
    <!-- Sidebar starts -->
    <div
      class="flex-col justify-between min-h-full ease-in-out shadow w-96 sm:relative md:w-60 bg-primary"
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
          <img
            class="w-36"
            src="https://di.unipi.it/wp-content/themes/unipi/images/cherubino-white.svg"
          />
        </div>
        <ul class="w-full mt-6">
          <router-link
            class=""
            v-for="(option, index) in sidebarOptions"
            :key="'sidebar-' + option.label"
            :to="{ name: option.routeName }"
            :class="{
              '': index == sidebarOptions.length - 1
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
    <div class="w-11/12 min-h-full px-4 py-6 mx-auto md:w-4/5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { SidebarOption } from '@/navigation/sidebar'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  components: {},
  name: 'MainTeacher',
  data () {
    return {
      moved: true
    }
  },
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
    }
  }
})
</script>
