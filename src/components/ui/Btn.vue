<template>
  <button
    class="rounded-md"
    :class="{
      'px-5 py-1 font-medium': size == 'base',
      'px-2.5 py-0.5 text-sm': size == 'sm',
      'px-10 py-2 text-lg font-semibold': size == 'lg',
      'text-lightText bg-primary hover:bg-primary-dark':
        !outline && variant == 'primary',
      'text-danger-dark bg-danger': !outline && variant == 'danger',
      'text-danger-dark border-danger-dark bg-white border hover:bg-danger-dark hover:text-white':
        outline && variant == 'danger',
      'text-success-dark bg-success': !outline && variant == 'success',
      'transition-colors duration-100 shadow-inner': outline,
      'focus:outline-primary': variant == 'primary',
      'focus:outline-danger-dark': variant == 'danger',
      'focus:outline-success': variant == 'success',
      'hover:bg-light hover:shadow-inner': variant == 'light',
      'text-primary hover:text-lightText bg-transparent border-primary border-1.5 hover:bg-primary':
        outline && variant == 'primary'
    }"
  >
    <p class="flex items-center"><slot></slot></p>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'

export default defineComponent({
  name: 'Btn',
  props: {
    outline: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String as PropType<
        'primary' | 'danger' | 'success' | 'dark' | 'light'
      >,
      default: 'primary'
    },
    size: {
      type: String as PropType<'sm' | 'base' | 'lg'>,
      default: 'base'
    }
  }
})
</script>

<style></style>
