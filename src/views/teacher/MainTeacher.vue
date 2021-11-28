<template>
  <div class="flex flex-no-wrap h-screen bg-gray-50">
    <!-- Sidebar starts -->
    <div
      class="absolute z-40 flex-col justify-between w-64 transition duration-150 ease-in-out shadow bg-primary sm:relative md:h-full"
      id="mobile-nav"
    >
      <div
        id="openSideBar"
        class="absolute right-0 flex items-center justify-center w-10 h-10 mt-16 -mr-10 rounded-tr rounded-br shadow cursor-pointer bg-primary md:hidden"
        @click="sidebarHandler(true)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-adjustments"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#FFFFFF"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <circle cx="6" cy="10" r="2" />
          <line x1="6" y1="4" x2="6" y2="8" />
          <line x1="6" y1="12" x2="6" y2="20" />
          <circle cx="12" cy="16" r="2" />
          <line x1="12" y1="4" x2="12" y2="14" />
          <line x1="12" y1="18" x2="12" y2="20" />
          <circle cx="18" cy="7" r="2" />
          <line x1="18" y1="4" x2="18" y2="5" />
          <line x1="18" y1="9" x2="18" y2="20" />
        </svg>
      </div>
      <div
        id="closeSideBar"
        class="absolute right-0 flex items-center justify-center hidden w-10 h-10 mt-16 -mr-10 text-white rounded-tr rounded-br shadow cursor-pointer bg-primary"
        @click="sidebarHandler(false)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-x"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <div>
        <div class="flex items-center w-full h-16 px-8">
          <img
            class="w-32"
            src="https://di.unipi.it/wp-content/themes/unipi/images/cherubino-white.svg"
          />
        </div>
        <ul class="px-2 mt-12">
          <li
            v-for="option in sideBarOptions"
            :key="'sidebar-' + option.label"
            class="flex items-center justify-between w-full px-2 py-3 text-gray-200 rounded-md cursor-pointer hover:text-gray-300 hover:bg-primary-dark"
          >
            <div class="flex items-center">
              <i :class="option.icon"></i>
              <span class="ml-2 text-sm">{{ option.label }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="px-8 bg-primary">
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
          <li class="pt-5 pb-3 text-white cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-bell"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path
                d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
              ></path>
              <path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>
            </svg>
          </li>
          <li class="pt-5 pb-3 text-white cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-messages"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path
                d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10"
              ></path>
              <path
                d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"
              ></path>
            </svg>
          </li>
          <li class="pt-5 pb-3 text-white cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-settings"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </li>
          <li class="pt-5 pb-3 text-white cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-archive"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <rect x="3" y="4" width="18" height="4" rx="2"></rect>
              <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10"></path>
              <line x1="10" y1="12" x2="14" y2="12"></line>
            </svg>
          </li>
        </ul>
      </div>
    </div>
    <!--Mobile responsive sidebar-->
    <!-- Sidebar ends -->
    <!-- Remove class [ h-64 ] when adding a card block -->
    <div class="container w-11/12 h-64 px-6 py-10 mx-auto md:w-4/5">
      <!-- Remove class [ border-dashed border-2 border-gray-300 ] to remove dotted border -->
      <div class="w-full h-full border-2 border-gray-300 border-dashed rounded">
        <!-- Place your content here -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainTeacher',
  data () {
    return {
      moved: true
    }
  },
  methods: {
    sidebarHandler () {
      var sideBar = document.getElementById('mobile-nav')
      sideBar.style.transform = 'translateX(-260px)'
      if (this.$data.moved) {
        sideBar.style.transform = 'translateX(0px)'
        this.$data.moved = false
      } else {
        sideBar.style.transform = 'translateX(-260px)'
        this.$data.moved = true
      }
    }
  },
  computed: {
    sideBarOptions () {
      // todo create interface for sidebar option with label, link, icon, active (boolean)
      return [
        {
          label: 'Dashboard',
          icon: 'fas fa-user'
        },
        {
          label: 'Esami'
        },
        {
          label: 'Esercizi'
        }
      ]
    }
  }
}
</script>
