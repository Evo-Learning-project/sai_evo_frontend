<template>
  <!-- <div class="flex items-center justify-center">
    <div
      class="inline-block rounded-full spinner-border animate-spin"
      :class="{
        'border-blue-300 border-opacity-40': variant === 'primary',
        'border-gray': variant === 'gray',
        'w-3 h-3 border': size == 'sm',
        'w-8 h-8 border-4': size == 'md',
        'w-8 h-8 border-4': size == 'lg'
      }"
      role="status"
    ></div>
  </div> -->
  <div class="flex items-center justify-center">
    <div
      class="inline-block rounded-full spinner-border animate-spin"
      :class="{
        'w-6 h-6 border-2': size === 'lg',
        'w-5 h-5 border-2': size === 'md',
        'w-3 h-3 border-1.5': size === 'sm',
        'border-blue-200': variant === 'primary',
        'border-gray': variant === 'gray'
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
    },
    variant: {
      type: String as PropType<'primary' | 'gray' | 'light'>,
      default: 'gray'
    }
  }
})
</script>

<style>
.spinner-border {
  vertical-align: -0.125em;
  border-right: 0.25em solid;
  border-right-color: transparent !important;
}
.border-gray {
  border-color: rgba(156, 163, 175, 0.75);
}
</style>
