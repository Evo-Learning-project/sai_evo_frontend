<template>
  <button
    @click="onClick"
    :disabled="loading"
    class="relative overflow-hidden disabled:cursor-not-allowed disabled:opacity-70"
    :class="{
      'shadow-inner bg-light': forceActive,
      'bg-success-light bg-opacity-30':
        forceActive && variant === 'success-borderless',
      'px-5 py-1 font-medium': size == 'base' && variant !== 'transparent',
      'px-2.5 py-0.5 text-sm': size == 'sm',
      'px-1.5 py-0.5 text-xs': size == 'xs',
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
    <p class="flex items-center" :class="loading ? 'opacity-0' : ''">
      <slot></slot>
    </p>
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
    },
    loading: {
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
    },
    rippleEffect (event: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentTarget: any
      pageX: number
      clientX: number
      pageY: number
      clientY: number
    }) {
      //console.log('EVENT', event)
      const btn = event.currentTarget
      const circle = document.createElement('span')
      const diameter = Math.max(btn.clientWidth, btn.clientHeight)
      const radius = diameter / 2

      //console.log('parent', btn.offsetParent)
      const parentPosition = getComputedStyle(btn.offsetParent).position

      const offsetX =
        parentPosition === 'fixed' || parentPosition === 'absolute'
          ? event.clientX
          : event.pageX
      const offsetY =
        parentPosition === 'fixed' || parentPosition === 'absolute'
          ? event.clientY
          : event.pageY

      const { offsetTop, offsetLeft } = this.getOffset(btn)

      //const {top, left} = this.getOffset(btn)
      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${offsetX - (offsetLeft + radius)}px`
      circle.style.top = `${offsetY - (offsetTop + radius)}px`
      circle.classList.add('ripple')
      circle.classList.add(this.getRippleClass())

      const ripple = btn.getElementsByClassName('ripple')[0]
      //console.log('ripple', ripple, 'offsetY', offsetY)
      if (ripple) {
        ripple.remove()
      }

      btn.appendChild(circle)
    },
    getOffset (el: {
      offsetLeft: number
      offsetTop: number
      scrollLeft: number
      scrollTop: number
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      offsetParent: any
    }) {
      var _x = 0
      var _y = 0
      while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft
        _y += el.offsetTop - el.scrollTop
        el = el.offsetParent
      }
      return { offsetTop: _y, offsetLeft: _x }
    },
    getRippleClass () {
      switch (this.variant) {
        case 'primary-borderless':
          return 'ripple-primary'
        case 'success-borderless':
          return 'ripple-success'
        case 'transparent':
          return 'ripple-gray'
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
  background-color: rgba(255, 255, 255, 0.2); /*rgba(255, 255, 255, 0.2);*/
}
.ripple-gray {
  background-color: rgba(255, 255, 255, 0.7);
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
