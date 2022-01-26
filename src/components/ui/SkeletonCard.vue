<template>
  <card :marginLess="true">
    <template v-slot:header>
      <div
        :class="[short ? 'h-3' : 'h-4']"
        class=" bg-gray-200 rounded animate-pulse"
      ></div>
    </template>
    <template v-slot:body>
      <div
        :class="[short ? 'h-3' : 'h-4']"
        class="w-11/12 mb-2 bg-gray-200 rounded animate-pulse"
      ></div>
      <div
        :class="[short ? 'h-3 space-y-2' : 'h-4 space-y-3']"
        class="animate-pulse"
      >
        <div class="grid grid-cols-3" :class="[short ? 'gap-2' : 'gap-4']">
          <div
            :class="[short ? 'h-3' : 'h-4']"
            class=" col-span-2 bg-gray-200 rounded"
          ></div>
          <div
            :class="[short ? 'h-3' : 'h-4']"
            class=" col-span-1 bg-gray-200 rounded"
          ></div>
        </div>
        <div v-if="!short" class="w-11/12 h-4 bg-gray-200 rounded"></div>
      </div>
    </template>
  </card>
</template>

<script>
import Card from './Card.vue'
export default {
  name: 'SkeletonCard',
  components: {
    Card
  },
  props: {
    short: {
      type: Boolean,
      default: false
    }
  }
}
</script>
