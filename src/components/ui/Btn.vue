<template>
  <button
    @click="onClick"
    class="relative overflow-hidden disabled:cursor-not-allowed disabled:opacity-50"
    :class="{
      'shadow-inner bg-light': forceActive,
      'bg-success-light bg-opacity-30':
        forceActive && variant === 'success-borderless',
      'px-5 py-1 font-medium': size == 'base' && variant !== 'transparent',
      'px-2.5 py-0.5 text-sm': size == 'sm',
      'px-10 py-2 text-lg font-semibold': size == 'lg',
      'text-lightText bg-primary': !outline && variant == 'primary',
      'text-danger-dark bg-danger': !outline && variant == 'danger',
      'text-danger-dark border-danger-dark bg-white border hover:bg-danger-dark hover:text-white':
        outline && variant == 'danger',
      'text-success-dark bg-success': !outline && variant == 'success',
      'transition-colors duration-100 shadow-inner': outline,
      'focus:outline-primary': false && variant == 'primary',
      'focus:outline-danger-dark': variant == 'danger',
      'focus:outline-success': variant == 'success',
      'hover:bg-light hover:shadow-inner': variant == 'light',
      'text-primary hover:text-lightText bg-transparent border-primary border-1.5 hover:bg-primary':
        outline && variant == 'primary',
      'text-lg font-bold text-primary hover:bg-light px-6 focus:bg-primary-light focus:bg-opacity-30':
        variant == 'primary-borderless',
      'text-lg font-bold text-success hover:bg-light px-6 focus:bg-success-light focus:bg-opacity-30':
        variant == 'success-borderless',
      'text-lg font-bold text-success hover:bg-light px-6':
        variant == 'success-borderless',
      'border-gray-300 bg-white hover:bg-light': variant == 'transparent',
      'rounded-md': variant !== 'transparent'
    }"
  >
    <p class="flex items-center"><slot></slot></p>
    <slot name="content"></slot>
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
        | 'primary'
        | 'danger'
        | 'success'
        | 'dark'
        | 'light'
        | 'primary-borderless'
        | 'success-borderless'
        | 'transparent'
      >,
      default: 'primary'
    },
    size: {
      type: String as PropType<'sm' | 'base' | 'lg'>,
      default: 'base'
    },
    forceActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick (event: any) {
      event
      this.rippleEffect(event)
      setTimeout(() => this.$emit('btnClick'), 150)
      //this.$emit('btnClick')
    },
    rippleEffect (event: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentTarget: any
      clientX: number
      clientY: number
    }) {
      const btn = event.currentTarget
      const circle = document.createElement('span')
      const diameter = Math.max(btn.clientWidth, btn.clientHeight)
      const radius = diameter / 2

      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${event.clientX - (btn.offsetLeft + radius)}px`
      circle.style.top = `${event.clientY - (btn.offsetTop + radius)}px`
      circle.classList.add('ripple')
      circle.classList.add(this.getRippleClass())

      const ripple = btn.getElementsByClassName('ripple')[0]
      console.log('ripple', ripple)
      if (ripple) {
        ripple.remove()
      }

      btn.appendChild(circle)
    },
    getRippleClass () {
      switch (this.variant) {
        case 'primary-borderless':
          return 'ripple-primary'
        case 'success-borderless':
          return 'ripple-success'
        default:
          return 'ripple-white'
      }
    }
  }
})
</script>

<style>
span.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 500ms linear;
}
.ripple-white {
  background-color: rgba(255, 255, 255, 0.6);
}
.ripple-primary {
  background-color: rgba(68, 56, 202, 0.25);
}
.ripple-success {
  background-color: rgba(52, 211, 153, 0.4);
}
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
