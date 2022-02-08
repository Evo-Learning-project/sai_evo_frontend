<template>
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
    class="flex items-center w-full h-12 px-6 py-3 mt-auto text-sm text-white bg-dark"
  >
    <p>
      Crafted with &lt;3
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
    <p class="ml-auto cursor-pointer" @click="showReportForm = true">
      <i class="text-red-500 opacity-70 mr-0.5 fas fa-exclamation-triangle"></i>
      <span class="hidden ml-1 animated-underline md:inline"
        >Segnala malfunzionamento</span
      >
    </p>
  </footer>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import Spinner from './components/ui/Spinner.vue'
import { mapGetters, mapState } from 'vuex'
import Notification from './components/ui/Notification.vue'
import { getTranslatedString as _ } from './i18n'

export default defineComponent({
  beforeCreate (): void {
    this.$store.commit('initStore')
  },
  beforeUnmount () {
    window.removeEventListener('beforeunload', this.beforeWindowUnload)
  },
  components: {
    Spinner,
    Notification
  },
  async created () {
    await this.$store.dispatch('getCourses')
    window.addEventListener('beforeunload', this.beforeWindowUnload)
  },
  data () {
    return {
      showUnsavedChangesNotification: false
    }
  },
  methods: {
    beforeWindowUnload (e: {
      preventDefault: () => void
      returnValue: string
    }) {
      if (
        this.unsavedChanges &&
        !confirm(_('misc.confirm_exiting_unsaved_changes'))
      ) {
        // Cancel the event
        e.preventDefault()
        // Chrome requires returnValue to be set
        e.returnValue = ''
      }
    }
  },
  computed: {
    ...mapState(['loading', 'showSuccessFeedback']),
    ...mapGetters(['unsavedChanges'])
  }
})
</script>
