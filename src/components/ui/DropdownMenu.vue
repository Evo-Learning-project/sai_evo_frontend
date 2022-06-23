<template>
  <div class="relative">
    <Btn
      :variant="'icon'"
      :outline="true"
      :tooltip="!expanded ? tooltip : ''"
      @click="$emit('toggleExpanded')"
    >
      <slot name="icon"></slot>
      <span v-if="!$slots.icon?.()" class="material-icons-outlined">{{
        icon
      }}</span>
    </Btn>
    <div
      class="absolute overflow-hidden transition-all duration-75 ease-in origin-top-left transform bg-white  card shadow-popup"
      :class="{
        'max-h-0 opacity-0 scale-95': !expanded,
        'max-h-44 opacity-100 scale-100': expanded,
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
  },
  methods: {},
  computed: {},
  components: { Btn },
});
</script>

<style></style>
