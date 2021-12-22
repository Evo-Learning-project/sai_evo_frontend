<template>
  <div class="flex items-center justify-center">
    <div
      class="inline-block rounded-full spinner-border animate-spin"
      :class="{
        'w-3 h-3 border': size == 'sm',
        'w-6 h-6 border-3': size == 'md',
        'w-8 h-8 border-4': size == 'lg'
      }"
      role="status"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { PropType } from 'vue'

export default defineComponent({
  name: 'Spinner',
  props: {
    size: {
      type: String as PropType<'sm' | 'md' | 'lg'>,
      default: 'md'
    }
  }
})
</script>

<style>
.spinner-border {
  vertical-align: -0.125em;
  border-color: rgba(156, 163, 175);
  border-right: 0.25em solid transparent;
}
</style>
