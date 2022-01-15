<template>
  <button
    @click="onClick"
    class="relative overflow-hidden"
    :class="{
      'shadow-inner bg-light': forceActive,
      'px-5 py-1 font-medium': size == 'base' && variant !== 'transparent',
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
        outline && variant == 'primary',
      'text-lg font-bold text-primary hover:bg-light px-6':
        variant == 'primary-borderless',
      'text-lg font-bold text-success hover:bg-light px-6':
        variant == 'success-borderless',
      'hover:bg-light border-gray-300': variant == 'transparent',
      'rounded-md': variant !== 'transparent'
    }"
  >
    <p class="flex items-center"><slot></slot></p>
    <slot name="content"></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'
import { v4 as uuid4 } from 'uuid'

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
  created () {
    this.elementId = uuid4()
    // const btn = document.getElementById(this.elementId)
    // console.log('BTN', btn)
    // btn?.addEventListener('click', this.rippleEffect)
  },
  data () {
    return {
      elementId: ''
    }
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick (event: any) {
      this.rippleEffect(event)
      setTimeout(() => this.$emit('btnClick'), 100)
    },
    rippleEffect (event: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentTarget: any
      clientX: number
      clientY: number
    }) {
      console.log('CLICKED')
      const btn = event.currentTarget
      console.log(btn)

      const circle = document.createElement('span')
      const diameter = Math.max(btn.clientWidth, btn.clientHeight)
      const radius = diameter / 2

      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${event.clientX - (btn.offsetLeft + radius)}px`
      circle.style.top = `${event.clientY - (btn.offsetTop + radius)}px`
      circle.classList.add('ripple')

      const ripple = btn.getElementsByClassName('ripple')[0]
      console.log('ripple', ripple)
      if (ripple) {
        ripple.remove()
      }

      btn.appendChild(circle)
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
  background-color: rgba(226, 225, 225, 0.5);
}
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
