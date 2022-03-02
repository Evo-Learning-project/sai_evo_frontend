<template>
  <div
    class="absolute z-20 w-full px-4 py-2 border-b rounded-t-lg rounded-b-sm  -bottom-0 shadow-t-elevation-2 bg-light"
  >
    <div class="flex items-center w-full py-1">
      <div>
        <div class="">
          <slot name="title"></slot>
        </div>
      </div>

      <Btn
        @click="expanded = !expanded"
        :variant="'icon'"
        :outline="true"
        class="ml-auto"
        ><span class="material-icons-outlined">
          {{ expanded ? "expand_more" : "expand_less" }}
        </span></Btn
      >
    </div>
    <div
      class="ease-in-out transition-max-height"
      :class="[
        expanded
          ? 'max-h-72 duration-200 overflow-y-auto'
          : 'max-h-0 duration-75 overflow-y-hidden',
      ]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Btn from "./Btn.vue";
export default defineComponent({
  name: "Backdrop",
  props: {},
  methods: {},
  data() {
    return {
      expanded: false,
    };
  },
  computed: {},
  components: { Btn },
});
</script>

<style></style>
