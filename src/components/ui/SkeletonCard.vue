<template>
  <card>
    <template v-slot:header>
      <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
    </template>
    <template v-slot:body>
      <div class="w-11/12 h-4 mb-2 bg-gray-200 rounded animate-pulse"></div>
      <div class="space-y-3 animate-pulse">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-4 col-span-2 bg-gray-200 rounded"></div>
          <div class="h-4 col-span-1 bg-gray-200 rounded"></div>
        </div>
        <div class="w-11/12 h-4 bg-gray-200 rounded"></div>
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
  }
}
</script>
