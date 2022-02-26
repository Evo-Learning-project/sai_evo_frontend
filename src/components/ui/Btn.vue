<template>
  <button
    @mousedown="onMouseDown"
    :disabled="disabled || loading"
    class="relative overflow-hidden disabled:cursor-not-allowed disabled:opacity-70"
    :class="{
      'shadow-inner bg-light': forceActive,
      'bg-success-light bg-opacity-30':
        forceActive && variant === 'success-borderless',
      'px-5 py-1 font-medium':
        !outline && size === 'base' && variant !== 'transparent',
      'px-4 py-2.5px font-medium':
        outline && size === 'base' && variant !== 'icon',
      'px-2.5 py-0.5 text-sm': size === 'sm' && variant !== 'icon',
      'px-1.5 py-0.5 text-xs': size === 'xs' && variant !== 'icon',
      'px-14 py-2 text-lg font-medium': size === 'lg' && variant !== 'icon',
      'text-lightText bg-primary hover:bg-primary-dark shadow-btn':
        !outline && variant === 'primary',
      'text-danger-dark bg-danger shadow-btn': !outline && variant === 'danger',
      'text-danger-dark border-danger-dark bg-white border hover:bg-danger-dark hover:text-white':
        outline && variant === 'danger',
      'text-success-dark bg-success-light': !outline && variant === 'success',
      'transition-colors duration-100': outline,
      'focus:outline-primary': false && variant === 'primary',
      'focus:outline-danger-dark': variant === 'danger',
      'focus:outline-success': false && variant === 'success',
      'hover:bg-light hover:shadow-inner': variant === 'light',
      'text-primary bg-transparent border-primary border-1.5 ':
        outline && variant === 'primary',
      'text-lg font-bold text-primary hover:bg-light px-6 focus:bg-primary-light focus:bg-opacity-30':
        variant === 'primary-borderless',
      'text-lg font-bold text-success hover:bg-light px-6 focus:bg-success-light focus:bg-opacity-30':
        variant === 'success-borderless',
      'text-lg font-bold text-success hover:bg-light px-6':
        variant === 'success-borderless',
      'border-gray-300 bg-white hover:bg-light': variant === 'transparent',
      'rounded-md': variant !== 'transparent',
      'rounded-full p-0 h-8 w-8 bg-transparent hover:bg-gray-200 hover:border border-light text-gray-600':
        variant === 'icon'
    }"
  >
    <div class="flex w-full">
      <p class="flex items-center mx-auto" :class="loading ? 'invisible' : ''">
        <slot></slot>
      </p>
    </div>
    <p
      v-if="loading"
      class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
    >
      <spinner
        :size="'md'"
        :variant="variant === 'primary' ? 'primary' : 'gray'"
      ></spinner>
    </p>
    <slot name="content"></slot>
  </button>
</template>

<script lang="ts">
import { rippleEffect } from '@/utils'
import { defineComponent, PropType } from '@vue/runtime-core'
import Spinner from './Spinner.vue'

export default defineComponent({
  components: { Spinner },
  name: 'Btn',
  props: {
    outline: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String as PropType<
        | 'primary'
        | 'danger'
        | 'success'
        | 'dark'
        | 'light'
        | 'primary-borderless'
        | 'success-borderless'
        | 'transparent'
        | 'icon'
      >,
      default: 'primary'
    },
    size: {
      type: String as PropType<'xs' | 'sm' | 'base' | 'lg'>,
      default: 'base'
    },
    forceActive: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMouseDown (event: any) {
      rippleEffect(event, this.rippleClass)
    }
  },
  computed: {
    rippleClass () {
      switch (this.variant) {
        case 'primary-borderless':
          return 'ripple-primary'
        case 'success-borderless':
          return 'ripple-success'
        case 'transparent':
          return 'ripple-gray'
        case 'primary':
          if (this.outline) {
            return 'ripple-primary'
          }
          return 'ripple-white'
        default:
          return 'ripple-white'
      }
    }
  }
})
</script>
