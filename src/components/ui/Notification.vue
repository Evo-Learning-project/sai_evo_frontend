<template>
  <div
    style="z-index: 999"
    class="fixed transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 border rounded-md shadow-2xl bg-opacity-90 top-1/2 left-1/2"
  >
    <div class="flex items-center w-full px-6 py-8 space-x-4">
      <AnimatedIcon></AnimatedIcon>
      <h3 class="mb-0">{{ $t('misc.success') }}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import AnimatedIcon from './AnimatedIcon.vue'

export default defineComponent({
  components: { AnimatedIcon },
  name: 'Notification'
})
</script>

<style></style>
