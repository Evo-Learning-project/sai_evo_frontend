<template>
  <button
    class="font-semibold rounded-md"
    :class="{
      'px-4 py-1.5': size == 'base',
      'text-lightText bg-primary hover:bg-primary-dark':
        !outline && variant == 'primary',
      'text-danger-dark bg-danger': !outline && variant == 'danger',
      'text-success-dark bg-success': !outline && variant == 'success',
      'transition-colors duration-100 shadow-inner': outline,
      'focus:outline-primary': variant == 'primary',
      'focus:outline-danger': variant == 'danger',
      'focus:outline-success': variant == 'success',
      'text-primary hover:text-lightText bg-transparent border-primary border-1.5 hover:bg-primary':
        outline && variant == 'primary'
    }"
  >
    Button
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
