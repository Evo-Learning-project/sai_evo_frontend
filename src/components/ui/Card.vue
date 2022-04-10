<template>
  <div
    :tabindex="focusable ? 0 : false"
    class="flex border-gray-300 card"
    :class="{
      border: !highlighted && !borderLess,
      'border-2': highlighted,
      'duration-75 ease-linear hover:border-transparent transition-shadow-border hover-shadow-elevation':
        hoverable,
      'card-filled': filled,
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
          'mt-3': true || (size == 'default' && $slots.header),
          'mt-1.5': false && size == 'sm',
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
