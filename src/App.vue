<template>
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

export default defineComponent({
  beforeCreate (): void {
    this.$store.commit('initStore')
  }
})
</script>
