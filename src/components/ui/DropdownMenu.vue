<template>
  <div
    class="relative"
    v-click-outside="() => (expanded ? $emit('toggleExpanded') : undefined)"
  >
    <Btn :variant="'icon'" :outline="true" @click="$emit('toggleExpanded')">
      <!-- :tooltip="!expanded ? tooltip : ''" -->
      <slot name="icon"></slot>
      <span v-if="!$slots.icon?.()" class="material-icons-outlined">{{
        icon
      }}</span>
    </Btn>
    <div
      class="
        absolute
        z-20
        overflow-hidden
        transition-all
        duration-75
        ease-in
        transform
        bg-white
        mt-1.5
        card
        shadow-popup
      "
      :class="{
        'max-h-0 opacity-0 scale-95 invisible': !expanded,
        'max-h-44 opacity-100 scale-100': expanded,
        'origin-top-left left-0': placement === 'left',
        'origin-top-right right-0': placement === 'right',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "./Btn.vue";
export default defineComponent({
  name: "DropdownMenu",
  props: {
    tooltip: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "more_vert",
    },
    expanded: {
      type: Boolean,
      required: true,
    },
    placement: {
      type: String as PropType<"left" | "right">,
      default: "left",
    },
  },
  methods: {},
  computed: {},
  components: { Btn },
});
</script>

<style></style>
