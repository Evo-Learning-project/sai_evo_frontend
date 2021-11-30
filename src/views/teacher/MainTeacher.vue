<template>
  <div class="flex flex-no-wrap h-screen bg-gray-50">
    <!-- Sidebar starts -->
    <div
      class="absolute z-40 flex-col justify-between transition duration-150 ease-in-out shadow w-60 bg-primary sm:relative md:h-full"
      id="mobile-nav"
    >
      <div
        id="openSideBar"
        class="absolute right-0 flex items-center justify-center w-10 h-10 mt-16 -mr-10 rounded-tr rounded-br shadow cursor-pointer text-lightText bg-primary md:hidden"
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
      <div>
        <div class="flex items-center w-full h-16 px-8">
          <img
            class="w-32"
            src="https://di.unipi.it/wp-content/themes/unipi/images/cherubino-white.svg"
          />
        </div>
        <ul class="px-2 mt-12">
          <router-link
            v-for="option in sidebarOptions"
            :key="'sidebar-' + option.label"
            :to="{ name: option.routeName }"
          >
            <li
              class="flex items-center justify-between w-full px-2 py-2 mt-3 rounded-md cursor-pointer hover:transition-colors text-lightText hover:bg-primary-dark hover:duration-100"
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
    <div class="container w-11/12 h-64 px-4 py-6 mx-auto md:w-4/5">
      <div class="w-full h-full">
        <router-view></router-view>
      </div>
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
