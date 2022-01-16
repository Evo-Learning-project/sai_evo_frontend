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
      :style="
        size === 'xl' ? 'filter: drop-shadow(1px 1px 4px rgba(0,0,0,0.35))' : ''
      "
      class="inline-block rounded-full spinner-border"
      :class="{
        'w-6 h-6 border-2': size === 'lg',
        'w-5 h-5 border-2': size === 'md',
        'w-3 h-3 border-1.5': size === 'sm',
        'w-12 h-12 border-6 ': size === 'xl',
        'border-blue-200': variant === 'primary',
        'border-gray-800': variant === 'dark',
        'border-gray': variant === 'gray',
        'animate-spin-fast': fast,
        'animate-spin': !fast
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
      type: String as PropType<'sm' | 'md' | 'lg' | 'xl'>,
      default: 'md'
    },
    variant: {
      type: String as PropType<'primary' | 'gray' | 'light' | 'dark'>,
      default: 'gray'
    },
    fast: {
      type: Boolean,
      default: false
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
.animate-spin-fast {
  animation: spin 0.6s linear infinite;
}
</style>
