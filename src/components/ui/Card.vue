<template>
  <div
    tabindex="0"
    class="flex h-full border-gray-300 rounded-md shadow-sm"
    :class="{
      'md:px-3.5 md:py-3': size == 'sm',
      'px-1 py-5  md:px-5': size == 'default',
      'my-4': size == 'default' && !marginLess,
      'border-2': highlighted,
      border: !highlighted
    }"
  >
    <div class="w-full">
      <div v-if="$slots.header" class="">
        <slot name="header"></slot>
      </div>
      <div
        v-if="$slots.body"
        class=""
        :class="{
          'mt-4': size == 'default',
          'mt-1.5': size == 'sm'
        }"
      >
        <slot name="body"></slot>
      </div>
    </div>
    <div
      v-if="$slots.side"
      class="h-full"
      :class="{ 'w-40': size == 'default', 'w-10': size == 'sm' }"
    >
      <slot name="side"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'

export default defineComponent({
  name: 'Card',
  props: {
    size: {
      type: String as PropType<'sm' | 'default'>,
      default: 'default'
    },
    highlighted: {
      type: Boolean,
      default: false
    },
    marginLess: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style></style>
