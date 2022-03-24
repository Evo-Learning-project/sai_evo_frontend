<template>
  <div
    :tabindex="focusable ? 0 : false"
    class="flex border-gray-300 rounded card"
    :class="{
      'md:px-3.5 md:py-3 px-2 py-2.5': size == 'sm',
      'px-2.5 py-5 md:px-5': size == 'default',
      'my-4': size == 'default' && !marginLess,
      border: !highlighted && !borderLess,
      'border-2': highlighted,
      'transition-shadow duration-75 ease-linear hover-shadow-elevation': hoverable,
      'bg-light bg-opacity-80': filled,
    }"
  >
    <!-- FIXME review shadow -->
    <div class="flex flex-col flex-grow w-full">
      <div v-if="$slots.header" class="">
        <slot name="header"></slot>
      </div>
      <div
        v-if="$slots.body"
        class="flex-grow"
        :class="{
          'mt-4': size == 'default' && $slots.header,
          'mt-1.5': size == 'sm',
        }"
      >
        <slot name="body"></slot>
      </div>
    </div>
    <div
      v-if="$slots.side"
      class="h-full"
      :class="{
        'w-40': size == 'default' && !expandSideOnSmall,
        'md:w-10 w-8': size == 'sm' && !expandSideOnSmall,
        'flex-grow md:w-52': expandSideOnSmall,
      }"
    >
      <slot name="side"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  name: "Card",
  props: {
    size: {
      type: String as PropType<"sm" | "default">,
      default: "default",
    },
    expandSideOnSmall: {
      type: Boolean,
      default: false,
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
    marginLess: {
      type: Boolean,
      default: false,
    },
    borderLess: {
      type: Boolean,
      default: false,
    },
    focusable: {
      type: Boolean,
      default: false,
    },
    filled: {
      type: Boolean,
      default: false,
    },
    hoverable: {
      type: Boolean,
      default: true,
    },
  },
});
</script>

<style></style>
